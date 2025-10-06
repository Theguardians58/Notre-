// Search functionality for notes
import { Note, SearchResult } from './types';

export const searchNotes = (notes: Note[], searchQuery: string): SearchResult[] => {
  if (!searchQuery.trim()) return [];

  const query = searchQuery.toLowerCase();
  const results: SearchResult[] = [];

  for (const note of notes) {
    let relevance = 0;
    let matchedContent = '';

    // Search in title
    if (note.title.toLowerCase().includes(query)) {
      relevance += 10;
      matchedContent = note.title;
    }

    // Search in content (convert Tiptap JSON to text)
    const contentText = extractTextFromContent(note.content);
    if (contentText.toLowerCase().includes(query)) {
      relevance += 5;

      // Get excerpt around the match
      const index = contentText.toLowerCase().indexOf(query);
      const start = Math.max(0, index - 50);
      const end = Math.min(contentText.length, index + query.length + 50);
      matchedContent = contentText.slice(start, end);
    }

    // Search in tags
    if (note.tags?.some((tag) => tag.toLowerCase().includes(query))) {
      relevance += 3;
    }

    if (relevance > 0) {
      results.push({
        noteId: note.id,
        title: note.title,
        excerpt: matchedContent || contentText.slice(0, 100),
        relevance,
        matchedContent,
      });
    }
  }

  // Sort by relevance
  return results.sort((a, b) => b.relevance - a.relevance);
};

// Extract plain text from Tiptap JSON content
const extractTextFromContent = (content: any): string => {
  if (!content) return '';

  let text = '';

  const traverse = (node: any) => {
    if (node.type === 'text') {
      text += node.text + ' ';
    }

    if (node.content && Array.isArray(node.content)) {
      for (const child of node.content) {
        traverse(child);
      }
    }
  };

  traverse(content);
  return text.trim();
};

// Semantic search (placeholder for future AI-powered search)
export const semanticSearch = async (
  notes: Note[],
  searchQuery: string,
  aiProvider?: string,
  apiKey?: string
): Promise<SearchResult[]> => {
  // For now, fall back to basic search
  // In the future, this could use embeddings for semantic search
  return searchNotes(notes, searchQuery);
};
