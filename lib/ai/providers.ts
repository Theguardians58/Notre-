// AI provider integrations
import { AIProvider, AIAction } from '../types';

// Base AI request function
export const callAI = async (
  provider: AIProvider,
  apiKey: string,
  action: AIAction
): Promise<string> => {
  switch (provider) {
    case 'gemini':
      return callGemini(apiKey, action);
    case 'openai':
      return callOpenAI(apiKey, action);
    case 'anthropic':
      return callAnthropic(apiKey, action);
    default:
      throw new Error('Unsupported AI provider');
  }
};

// Google Gemini integration
const callGemini = async (apiKey: string, action: AIAction): Promise<string> => {
  const prompt = buildPrompt(action);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Gemini API request failed');
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || '';
};

// OpenAI integration
const callOpenAI = async (apiKey: string, action: AIAction): Promise<string> => {
  const prompt = buildPrompt(action);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
};

// Anthropic Claude integration
const callAnthropic = async (apiKey: string, action: AIAction): Promise<string> => {
  const prompt = buildPrompt(action);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Anthropic API request failed');
  }

  const data = await response.json();
  return data.content[0]?.text || '';
};

// Build prompt based on action type
const buildPrompt = (action: AIAction): string => {
  const { type, text, prompt, options } = action;

  switch (type) {
    case 'summarize':
      return `Please summarize the following text concisely:\n\n${text}`;

    case 'improve':
      return `Please improve the writing quality, fix grammar and spelling mistakes in the following text:\n\n${text}`;

    case 'tone_change':
      const tone = options?.tone || 'professional';
      return `Please rewrite the following text in a ${tone} tone:\n\n${text}`;

    case 'translate':
      const language = options?.language || 'Spanish';
      return `Please translate the following text to ${language}:\n\n${text}`;

    case 'brainstorm':
      return `Based on this context, please brainstorm and generate 5 creative ideas:\n\n${text}`;

    case 'generate':
      return prompt || 'Generate content';

    default:
      return text || prompt || '';
  }
};

// Streaming AI response (for content generation)
export const streamAI = async (
  provider: AIProvider,
  apiKey: string,
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  switch (provider) {
    case 'gemini':
      await streamGemini(apiKey, prompt, onChunk);
      break;
    case 'openai':
      await streamOpenAI(apiKey, prompt, onChunk);
      break;
    case 'anthropic':
      await streamAnthropic(apiKey, prompt, onChunk);
      break;
    default:
      throw new Error('Unsupported AI provider');
  }
};

const streamGemini = async (
  apiKey: string,
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Gemini API request failed');
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.trim() && line.startsWith('{')) {
        try {
          const data = JSON.parse(line);
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) onChunk(text);
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
};

const streamOpenAI = async (
  apiKey: string,
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ') && !line.includes('[DONE]')) {
        try {
          const data = JSON.parse(line.slice(6));
          const text = data.choices?.[0]?.delta?.content;
          if (text) onChunk(text);
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
};

const streamAnthropic = async (
  apiKey: string,
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error('Anthropic API request failed');
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'content_block_delta') {
            const text = data.delta?.text;
            if (text) onChunk(text);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
};
