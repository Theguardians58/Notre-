# CogniNote - AI-Powered Note-Taking Application

A modern, feature-rich note-taking web application built with Next.js 14, React, Firebase, and AI integration. CogniNote combines the power of block-based editing with AI assistance to enhance your productivity.

![CogniNote](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-10-orange?logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)

## 🌟 Features

### 📝 Rich-Text Editing
- **Block-Based Editor**: Powered by Tiptap with full rich-text formatting support
- **Rich Formatting**: Headings, bold, italic, code blocks with syntax highlighting, blockquotes, and more
- **Lists**: Ordered, unordered, and interactive to-do lists with checkboxes
- **Media Support**: Inline images and file uploads
- **Slash Commands**: Quick access to all formatting options via `/` command menu

### 📊 Visual Diagrams & Collaboration (NEW!)
- **Flowcharts**: Create process flows with React Flow - drag-and-drop nodes and connections
- **Mindmaps**: Organize ideas with tree-structured mindmaps and auto-layout
- **Whiteboard**: Freeform drawing and sketching with Excalidraw
- **Mermaid Diagrams**: Text-based diagrams (flowcharts, sequences, class diagrams, state diagrams, etc.)
- **Diagram Selector**: Beautiful modal for choosing diagram types

### 📂 Document Organization
- **Infinite Nesting**: Create hierarchical document structures with unlimited nesting
- **Multiple Document Types**:
  - Standard Documents
  - Meeting Notes Template
  - Project Plan Template
  - Custom Templates (extensible)
- **Tree Navigation**: Intuitive sidebar with expandable/collapsible folders
- **Real-time Sync**: All changes automatically saved and synced via Firestore

### 🔗 Advanced Features
- **Bi-Directional Linking**: Link notes using `[[Page Name]]` syntax
- **Backlinks**: Automatically track which notes reference each other
- **Global Search**: Instant full-text search across all notes (⌘K)
- **Semantic Search Ready**: Infrastructure for AI-powered semantic search

### 🤖 AI Integration
- **Multi-Provider Support**: Google Gemini, OpenAI (GPT-4), and Anthropic (Claude)
- **AI Actions**:
  - **Summarize**: Condense long text
  - **Improve Writing**: Fix grammar and enhance clarity
  - **Change Tone**: Adjust writing style (professional, casual, friendly, formal)
  - **Translate**: Convert text to different languages
  - **Brainstorm**: Generate creative ideas
  - **Content Generation**: Create content from prompts
- **Flexible Configuration**: Switch between AI providers in settings
- **Secure API Key Storage**: Encrypted keys stored in private Firestore documents

### 🎨 User Experience
- **Dark Mode**: System-aware theme with manual toggle
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean UI**: Modern, minimalist design with Tailwind CSS
- **Auto-save**: Never lose your work with automatic saving

### 🔐 Authentication & Security
- **Firebase Authentication**: Email/password and Google Sign-In
- **Secure Data**: User-specific data isolation in Firestore
- **Private API Keys**: API keys never exposed client-side or publicly

### 🛡️ End-to-End Encryption (NEW!)
- **Military-Grade Security**: AES-256-GCM encryption
- **Zero-Knowledge**: All encryption happens on your device before syncing
- **Password Protected**: Separate encryption password for maximum security
- **Recovery Keys**: 64-character recovery key for password recovery
- **Encrypted Content**: Notes, diagrams, and AI API keys all encrypted
- **Lock/Unlock**: Manually lock encryption when stepping away
- **No Server Access**: We cannot read your encrypted notes - truly private!
- **See ENCRYPTION_GUIDE.md** for detailed documentation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **Firebase Account** (free tier works fine)
- **AI Provider API Key** (optional, for AI features):
  - [Google Gemini](https://makersuite.google.com/app/apikey)
  - [OpenAI](https://platform.openai.com/api-keys)
  - [Anthropic](https://console.anthropic.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cogninote
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Firebase**
   
   a. Go to [Firebase Console](https://console.firebase.google.com/)
   
   b. Create a new project
   
   c. Enable the following services:
      - **Authentication**: Enable Email/Password and Google providers
      - **Firestore Database**: Create a database in production mode
      - **Storage**: Enable Firebase Storage

   d. Get your Firebase configuration:
      - Go to Project Settings > General
      - Scroll down to "Your apps" and click the web icon (</>)
      - Copy the configuration object

4. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Set up Firestore Security Rules**

   In Firebase Console > Firestore Database > Rules, add:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own user document
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Notes access control
       match /notes/{noteId} {
         allow read: if request.auth != null && 
                        (resource.data.ownerId == request.auth.uid || 
                         resource.data.isPublic == true);
         allow create: if request.auth != null && 
                          request.resource.data.ownerId == request.auth.uid;
         allow update, delete: if request.auth != null && 
                                  resource.data.ownerId == request.auth.uid;
       }
     }
   }
   ```

6. **Set up Firebase Storage Rules**

   In Firebase Console > Storage > Rules, add:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /users/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

7. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

8. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📚 Usage Guide

### Creating Your First Note

1. **Sign Up**: Create an account using email or Google Sign-In
2. **Create a Note**: Click "New Note" in the sidebar
3. **Start Writing**: Use the rich-text editor to write content
4. **Use Slash Commands**: Type `/` to see available formatting options

### Using Templates

1. Click "New Note" dropdown in the sidebar
2. Select a template:
   - **Meeting Notes**: Pre-formatted for meetings with sections for attendees, agenda, and action items
   - **Project Plan**: Structure for project goals, timeline, and tasks

### Organizing Notes

- **Create Child Notes**: Click on a note and create a new note to nest it
- **Drag & Drop**: Rearrange notes in the sidebar (coming soon)
- **Search**: Press `⌘K` (Mac) or `Ctrl+K` (Windows) to search

### AI Features

1. **Set Up AI**:
   - Go to Settings (gear icon in sidebar)
   - Add your API key for Google Gemini, OpenAI, or Anthropic
   - Select your default AI provider

2. **Use AI Assistance**:
   - Select text in the editor
   - Click the sparkle icon (✨) in the toolbar
   - Choose an AI action (summarize, improve, translate, etc.)

### Linking Notes

- Type `[[` to start creating a link to another note
- Select the target note from the dropdown
- The linked note will show this note in its backlinks

---

## 🗂️ Project Structure

```
cogninote/
├── app/                      # Next.js App Router pages
│   ├── auth/                # Authentication pages
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── dashboard/          # Main dashboard
│   ├── note/[id]/          # Individual note editing page
│   ├── settings/           # Settings page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── ai/                 # AI-related components
│   │   └── AIAssistModal.tsx
│   ├── auth/               # Authentication components
│   │   └── AuthGuard.tsx
│   ├── editor/             # Tiptap editor components
│   │   ├── TiptapEditor.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── SlashCommands.tsx
│   │   └── SlashCommandsList.tsx
│   ├── layout/             # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── SearchModal.tsx
│   │   └── ThemeToggle.tsx
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Spinner.tsx
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   ├── useNotes.ts         # Notes management hook
│   └── useTheme.ts         # Theme management hook
├── lib/                     # Utilities and libraries
│   ├── ai/                 # AI provider integrations
│   │   └── providers.ts
│   ├── firebase/           # Firebase utilities
│   │   ├── config.ts       # Firebase configuration
│   │   ├── auth.ts         # Authentication functions
│   │   ├── notes.ts        # Note CRUD operations
│   │   ├── settings.ts     # User settings
│   │   └── storage.ts      # File upload/download
│   ├── store/              # Zustand state management
│   │   ├── useAuthStore.ts
│   │   ├── useNotesStore.ts
│   │   └── useUIStore.ts
│   ├── search.ts           # Search functionality
│   ├── templates.ts        # Document templates
│   └── types.ts            # TypeScript types
├── .env.example            # Environment variables template
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

---

## 🔧 Configuration

### Firestore Database Schema

#### Users Collection (`users/{userId}`)
```typescript
{
  email: string,
  displayName: string,
  photoURL?: string,
  settings: {
    defaultAIProvider: 'gemini' | 'openai' | 'anthropic',
    theme: 'light' | 'dark' | 'system',
    apiKeys: {
      gemini?: string,
      openai?: string,
      anthropic?: string
    }
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Notes Collection (`notes/{noteId}`)
```typescript
{
  title: string,
  content: JSON, // Tiptap document structure
  type: 'document' | 'meeting_notes' | 'project_plan' | 'custom_template',
  ownerId: string,
  parentNoteId: string | null,
  children: string[],
  tags: string[],
  emoji?: string,
  isPublic: boolean,
  linkedNotes: string[],
  backlinks: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4.0
- **Rich Text Editor**: Tiptap 2.1
- **State Management**: Zustand 4.4
- **Backend**: Firebase (Firestore, Auth, Storage)
- **AI Integration**: Google Gemini, OpenAI, Anthropic
- **Diagrams**: React Flow 11.10, Excalidraw 0.17, Mermaid 10.6, Dagre 0.8
- **Encryption**: Web Crypto API (built-in, zero dependencies)
- **Icons**: Heroicons 2.2
- **Fonts**: Geist Sans

---

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms

CogniNote can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Docker

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Inspired by Notion and Obsidian
- Built with [Tiptap](https://tiptap.dev/) for rich-text editing
- Powered by [Firebase](https://firebase.google.com/) for backend services
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)

---

## 📧 Support

For support, email support@cogninote.app or open an issue in the GitHub repository.

---

## 🗺️ Roadmap

### Recently Added ✅
- [x] Flowcharts and mindmaps
- [x] Whiteboard/drawing canvas
- [x] Mermaid diagram support
- [x] End-to-end encryption
- [x] Encryption recovery keys
- [x] Visual diagram selector

### Coming Soon
- [ ] Graph View for bi-directional links visualization
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Export to PDF/Markdown
- [ ] Custom themes
- [ ] Plugins system
- [ ] Offline support with PWA
- [ ] Voice notes transcription
- [ ] AI-powered note suggestions
- [ ] Integration with calendar apps
- [ ] Biometric unlock for encryption
- [ ] Encrypted file attachments

---

Made with ❤️ by the CogniNote Team
