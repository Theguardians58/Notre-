// Core type definitions for CogniNote

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  settings: UserSettings;
  encryption: {
    enabled: boolean;
    salt: string; // Base64 encoded salt for key derivation
    passwordHash: string; // For verification only
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  defaultAIProvider: AIProvider;
  theme: 'light' | 'dark' | 'system';
  apiKeys: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
  };
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic';

export interface Note {
  id: string;
  title: string;
  content: any; // Tiptap JSON content (encrypted if encryption enabled)
  type: DocumentType;
  ownerId: string;
  parentNoteId: string | null;
  children?: string[]; // Array of child note IDs
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  emoji?: string;
  isPublic: boolean;
  linkedNotes?: string[]; // Bi-directional links
  backlinks?: string[]; // Notes that link to this one
  encrypted?: boolean; // Flag indicating if content is encrypted
  iv?: string; // Initialization vector for decryption (if encrypted)
}

export type DocumentType = 
  | 'document' 
  | 'meeting_notes' 
  | 'project_plan' 
  | 'flowchart' 
  | 'mindmap' 
  | 'whiteboard'
  | 'mermaid_diagram'
  | 'custom_template';

export interface Template {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  content: any; // Default Tiptap JSON content
  ownerId: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface AIAction {
  type: 'summarize' | 'improve' | 'tone_change' | 'translate' | 'brainstorm' | 'generate';
  text?: string;
  prompt?: string;
  options?: {
    tone?: 'professional' | 'casual' | 'friendly' | 'formal';
    language?: string;
  };
}

export interface SearchResult {
  noteId: string;
  title: string;
  excerpt: string;
  relevance: number;
  matchedContent?: string;
}
