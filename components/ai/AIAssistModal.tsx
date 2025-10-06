// AI assistance modal
'use client';

import { FC, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { callAI } from '@/lib/ai/providers';
import { AIAction } from '@/lib/types';
import toast from 'react-hot-toast';

interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  action: string;
  noteId: string;
}

export const AIAssistModal: FC<AIAssistModalProps> = ({
  isOpen,
  onClose,
  text,
  action,
  noteId,
}) => {
  const { user } = useAuthStore();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'friendly' | 'formal'>('professional');
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');

  const handleProcess = async () => {
    if (!user?.settings.apiKeys || !text) return;

    const provider = user.settings.defaultAIProvider;
    const apiKey = user.settings.apiKeys[provider];

    if (!apiKey) {
      toast.error(`Please configure your ${provider} API key in settings`);
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const aiAction: AIAction = {
        type: action as any,
        text,
        options: {
          tone: selectedTone,
          language: selectedLanguage,
        },
      };

      const response = await callAI(provider, apiKey, aiAction);
      setResult(response);
    } catch (error: any) {
      toast.error(error.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard');
  };

  const getActionTitle = () => {
    switch (action) {
      case 'summarize':
        return 'Summarize Text';
      case 'improve':
        return 'Improve Writing';
      case 'tone_change':
        return 'Change Tone';
      case 'translate':
        return 'Translate';
      case 'brainstorm':
        return 'Brainstorm Ideas';
      default:
        return 'AI Assist';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getActionTitle()}>
      <div className="space-y-4">
        {/* Original Text */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Original Text
          </label>
          <div className="max-h-32 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm text-gray-900 dark:bg-gray-700 dark:text-gray-100">
            {text}
          </div>
        </div>

        {/* Options */}
        {action === 'tone_change' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Tone
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
            </select>
          </div>
        )}

        {action === 'translate' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Language
            </label>
            <input
              type="text"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              placeholder="e.g., Spanish, French, Japanese"
            />
          </div>
        )}

        {/* Process Button */}
        {!result && (
          <Button onClick={handleProcess} disabled={loading} className="w-full">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                Processing...
              </div>
            ) : (
              'Process with AI'
            )}
          </Button>
        )}

        {/* Result */}
        {result && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Result
            </label>
            <div className="max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-3 text-sm text-gray-900 dark:bg-gray-700 dark:text-gray-100">
              {result}
            </div>
            <div className="mt-3 flex gap-2">
              <Button onClick={handleCopyResult} variant="secondary" className="flex-1">
                Copy Result
              </Button>
              <Button onClick={() => setResult('')} variant="ghost" className="flex-1">
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
