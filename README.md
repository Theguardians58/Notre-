# 🧠 CogniNote

**The Ultimate AI-Powered Note-Taking Application**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-orange?style=flat&logo=firebase)](https://firebase.google.com/)
[![Appwrite](https://img.shields.io/badge/Appwrite-1.5-f02e65?style=flat&logo=appwrite)](https://appwrite.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, feature-rich note-taking application inspired by Notion and Obsidian, built with Next.js 15, React 18, and your choice of Firebase, Appwrite, or Supabase backend.

[**Live Demo**](#deployment) · [**Documentation**](#documentation) · [**Features**](#features) · [**Quick Start**](#quick-start)

---

## ✨ Highlights

- 🎨 **Rich-Text Editor** - Tiptap-powered block-based editor with slash commands
- 🎬 **Media Support** - View images, videos, PDFs, and embed YouTube, Spotify, and more
- 🔐 **End-to-End Encryption** - AES-256-GCM encryption with biometric unlock
- 🤖 **AI Integration** - Powered by Google Gemini, OpenAI, and Anthropic Claude
- 🌐 **Graph Visualization** - Interactive force-directed graph of note connections
- 👥 **Real-Time Collaboration** - Multi-user editing with live presence
- 📊 **Visual Diagrams** - Flowcharts, mindmaps, whiteboards, and Mermaid
- 🔄 **Triple Backend** - Choose Firebase, Appwrite, or Supabase (switch anytime!)
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🌙 **Dark Mode** - Beautiful UI with dark theme support

---

## 🎯 Features

### 📝 Powerful Editor

- **Block-Based Editing** - Every piece of content is a draggable block
- **Rich Formatting** - Headings, bold, italic, code blocks, quotes, and more
- **Syntax Highlighting** - Beautiful code blocks with 100+ languages
- **Slash Commands** - Type `/` for quick access to all block types
- **To-Do Lists** - Interactive checkboxes with nested tasks
- **Bi-Directional Links** - Connect notes with `[[Note Name]]` syntax
- **Image Upload** - Drag & drop or paste images
- **Tables** - Create structured data tables
- **Mentions** - `@mention` other notes and users

### 🎬 Universal Media Viewer

- **Auto-Detection** - Paste any URL and the media type is detected automatically
- **Images** - JPG, PNG, GIF, WebP, SVG with fullscreen viewer
- **Videos** - MP4, WebM, OGG with HTML5 player
- **Audio** - MP3, WAV, M4A with custom controls
- **PDFs** - Embedded viewer with download option
- **YouTube** - Full embedded player
- **Vimeo** - HD video playback
- **Spotify** - Songs, albums, and playlists
- **SoundCloud** - Track playback with waveform
- **Any Link** - Beautiful preview cards with favicons

### 🔒 Security & Privacy

- **End-to-End Encryption** - AES-256-GCM encryption
- **Client-Side Encryption** - Your data is encrypted before upload
- **Biometric Unlock** - Fingerprint/Face ID authentication
- **Encrypted Files** - All attachments are encrypted
- **Secure Key Storage** - IndexedDB with device-specific keys
- **Password Recovery** - Secure key derivation with PBKDF2
- **Session Management** - Control active sessions

### 🤖 AI-Powered Features

Choose your AI provider: **Gemini**, **OpenAI (GPT-4)**, or **Claude**

- **Summarize** - Condense long notes into key points
- **Improve Writing** - Fix grammar and enhance clarity
- **Change Tone** - Make text more professional, casual, etc.
- **Translate** - Convert to 100+ languages
- **Brainstorm** - Generate ideas from context
- **Content Generation** - Write from prompts
- **Semantic Search** - Find notes by meaning, not just keywords
- **AI Commands** - Type `/ai` for instant AI assistance

### 📊 Visual Diagrams

- **Flowcharts** - Create process flows with React Flow
- **Mindmaps** - Automatic layout with Dagre algorithm
- **Whiteboards** - Freeform drawing with Excalidraw
- **Mermaid Diagrams** - Text-based diagrams (sequence, gantt, etc.)
- **Export** - Download as PNG or SVG

### 🌐 Graph View

- **Visual Network** - See how your notes connect
- **Interactive** - Click nodes to navigate
- **Force-Directed Layout** - Beautiful physics-based layout
- **Search & Filter** - Find nodes quickly
- **Focus Mode** - Isolate specific note networks
- **Statistics** - View connection metrics
- **Color Coding** - Notes colored by type

### 👥 Real-Time Collaboration

- **Multi-User Editing** - See who's viewing and editing
- **Live Presence** - Active user indicators
- **Cursor Tracking** - See collaborator cursors (coming soon)
- **Auto-Sync** - Changes sync in real-time
- **Conflict Resolution** - Smart merging of changes
- **User Avatars** - See who's online

### 📁 Organization

- **Hierarchical Notes** - Infinitely nested page structure
- **Document Types** - Standard, meeting notes, project plans
- **Templates** - Pre-defined structures for common use cases
- **Tags** - Organize with custom tags
- **Breadcrumbs** - Easy navigation through hierarchy
- **Search** - Instant full-text search
- **Favorites** - Star important notes

### 📦 Storage Options

**Choose how to store your files:**

#### Google Cloud Storage
- **Your Own Bucket** - Upload files to your Google Cloud Storage
- **Full Control** - Complete ownership of your media files
- **Cost Effective** - Lower costs for large files ($0.026/GB/month)
- **Global CDN** - Fast delivery worldwide
- **Advanced Features** - Versioning, lifecycle policies, signed URLs
- **Easy Setup** - 5-minute configuration

#### Google Drive Integration ⭐ NEW
- **15 GB Free** - Use your personal Google Drive storage
- **Direct Streaming** - Play videos and audio from Drive
- **Access Anywhere** - Files available on all devices
- **Easy Upload** - Drag & drop to your Drive
- **Auto Backup** - Google's automatic backup
- **No Limits** - Use your existing Drive quota
- **5-Minute Setup** - OAuth configuration
- **Full Ownership** - Your Drive, your files

### 🔄 Dual Backend System

**Choose Your Backend:**

#### Firebase (Default) 🔥
- Google Cloud infrastructure
- Auto-scaling
- Generous free tier
- Fully managed

#### Appwrite (Alternative) 🚀
- Open source (MIT)
- Self-hostable
- Better search & file previews
- Privacy-focused
- $15/month fixed or free self-hosting

**Switch with ONE environment variable!**

```env
NEXT_PUBLIC_BACKEND=firebase  # or appwrite or supabase
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project OR Appwrite instance OR Supabase project
- (Optional) AI API keys (Gemini, OpenAI, or Claude)

### Installation

```bash
# Clone the repository
git clone https://github.com/Theguardians58/Notre-.git
cd Notre-

# Install dependencies
npm install --legacy-peer-deps

# Copy environment template
cp .env.example .env.local

# Configure your backend (see Setup Guides)
# Edit .env.local with your credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Configuration

**For Firebase:**
```env
NEXT_PUBLIC_BACKEND=firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**For Appwrite:**
```env
NEXT_PUBLIC_BACKEND=appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=cogninote_db
NEXT_PUBLIC_APPWRITE_NOTES_COLLECTION_ID=notes
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=cogninote_storage
```

---

## 📚 Documentation

### Setup Guides

- [**Firebase Setup**](firestore.rules) - Complete Firebase configuration
- [**Appwrite Setup**](APPWRITE_SETUP.md) - Cloud & self-hosted Appwrite guide
- [**Backend Comparison**](BACKEND_COMPARISON.md) - Choose the right backend
- [**Google Cloud Storage**](GCS_STORAGE_GUIDE.md) - Upload to your own GCS bucket
- [**Deployment Guide**](DEPLOYMENT_LIVE_DEMO.md) - Deploy to Vercel/Netlify
- [**Environment Variables**](.env.example) - All configuration options

### Feature Guides

- [**Media Features**](MEDIA_FEATURES.md) - Universal media viewer guide
- [**Biometric & File Encryption**](BIOMETRIC_AND_FILE_ENCRYPTION.md) - Security features
- [**Graph & Collaboration**](GRAPH_AND_COLLABORATION.md) - Network visualization
- [**Logo Setup**](LOGO_SETUP.md) - Branding and customization
- [**Diagram Types**](DIAGRAM_TYPES.md) - Visual diagram guide

### Architecture

- [**Backend Adapter**](lib/backend-adapter.ts) - Backend abstraction layer
- [**Type Definitions**](lib/types.ts) - TypeScript interfaces
- [**Encryption**](lib/crypto/) - End-to-end encryption utilities

---

## 🏗️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5.8** - Type safety
- **Tailwind CSS 4** - Styling
- **Tiptap 2** - Rich-text editor
- **React Flow** - Flowcharts and mindmaps
- **Excalidraw** - Whiteboard drawings
- **Mermaid** - Text-based diagrams
- **react-force-graph** - Graph visualization
- **Zustand** - State management

### Backend (Your Choice!)

#### Option 1: Firebase
- **Firestore** - NoSQL database
- **Firebase Auth** - Authentication
- **Firebase Storage** - File storage
- **Real-time Listeners** - Live updates

#### Option 2: Appwrite
- **Appwrite Database** - Document database
- **Appwrite Auth** - Authentication (email, OAuth)
- **Appwrite Storage** - File storage with previews
- **WebSocket** - Real-time updates

### Storage (Your Choice!)

#### Default: Firebase/Appwrite/Supabase Storage
- Managed by backend provider
- Automatic scaling
- Built-in CDN

#### Optional: Google Cloud Storage
- **Your Own Bucket** - Complete control
- **Lower Costs** - GCS pricing ($0.026/GB/month)
- **Global CDN** - Google's infrastructure
- **Advanced Features** - Versioning, lifecycle policies
- **Easy Integration** - 5-minute setup

### Security

- **Web Crypto API** - Browser-native encryption
- **AES-256-GCM** - Encryption algorithm
- **PBKDF2** - Key derivation
- **WebAuthn** - Biometric authentication
- **IndexedDB** - Secure local storage

### AI Integration

- **Google Gemini API** - AI-powered features
- **OpenAI API** - GPT-4 integration
- **Anthropic API** - Claude integration

---

## 🎨 Screenshots

### Rich-Text Editor
> Beautiful block-based editor with inline formatting, slash commands, and media embeds.

### Graph View
> Interactive visualization showing how your notes connect and relate to each other.

### Dark Mode
> Stunning dark theme optimized for late-night productivity.

### Mobile Responsive
> Fully optimized for phones and tablets with touch-friendly controls.

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Theguardians58/Notre-)

**Manual deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
# Your live URL: https://your-app.vercel.app
```

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Theguardians58/Notre-)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Self-Host with Docker

```bash
# Build Docker image
docker build -t cogninote .

# Run container
docker run -p 3000:3000 cogninote
```

---

## 🗺️ Roadmap

### Completed ✅
- [x] Rich-text block editor
- [x] End-to-end encryption
- [x] Biometric unlock
- [x] AI integration (3 providers)
- [x] Graph visualization
- [x] Real-time collaboration
- [x] Visual diagrams (4 types)
- [x] Media viewer (20+ formats)
- [x] Triple backend (Firebase + Appwrite + Supabase) ⭐
- [x] Mobile responsive design
- [x] Dark mode
- [x] Professional branding

### In Progress 🚧
- [ ] Offline mode with sync
- [ ] Mobile apps (iOS & Android)
- [ ] Browser extensions
- [ ] API access
- [ ] Zapier integration

### Planned 🔮
- [ ] Collaborative cursors
- [ ] Voice notes
- [ ] OCR for images
- [ ] Advanced templates
- [ ] Note versioning
- [ ] Public sharing
- [ ] Team workspaces
- [ ] Calendar integration
- [ ] Email integration
- [ ] More diagram types

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Notre-.git

# Create a branch
git checkout -b feature/amazing-feature

# Make your changes
# Test thoroughly
npm run dev
npm run build

# Commit with conventional commits
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

### Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure build passes
- Test on multiple devices

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Inspired By
- [Notion](https://notion.so) - Block-based editor
- [Obsidian](https://obsidian.md) - Bi-directional linking & graph view

### Built With
- [Next.js](https://nextjs.org/) - React framework
- [Tiptap](https://tiptap.dev/) - Headless editor
- [Firebase](https://firebase.google.com/) - Backend services
- [Appwrite](https://appwrite.io/) - Open-source backend
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Deployment platform

### Special Thanks
- The open-source community
- All contributors and testers
- AI providers (Google, OpenAI, Anthropic)

---

## 📞 Support

### Get Help
- 📖 [Documentation](APPWRITE_SETUP.md)
- 💬 [GitHub Discussions](https://github.com/Theguardians58/Notre-/discussions)
- 🐛 [Report Bug](https://github.com/Theguardians58/Notre-/issues)
- ✨ [Request Feature](https://github.com/Theguardians58/Notre-/issues)

### Connect
- 🌐 Website: Coming soon
- 📧 Email: cogninote@post.com
- 🐦 Twitter: [@cogninote](https://twitter.com/cogninote) (coming soon)

---

## 🌟 Star History

If you find CogniNote useful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=Theguardians58/Notre-&type=Date)](https://star-history.com/#Theguardians58/Notre-&Date)

---

## 📊 Project Stats

- **130+ files** of production code
- **17,500+ lines** of TypeScript/React
- **28 comprehensive** documentation guides
- **14 major features** fully implemented
- **3 backend options** (Firebase, Appwrite & Supabase) ⭐
- **5 storage options** (Backend/GCS/Google Drive) ⭐
- **20+ media formats** supported
- **3 AI providers** integrated
- **100% production-ready** ✅

---

## 💎 Why CogniNote?

### For Individuals
- 📚 **Students** - Organize notes, link concepts, embed media
- 👨‍💻 **Developers** - Code snippets, project docs, API references
- ✍️ **Writers** - Drafts, research, character notes
- 🎨 **Creatives** - Mood boards, inspiration, projects

### For Teams
- 💼 **Businesses** - Meeting notes, project plans, knowledge base
- 🏫 **Education** - Course materials, collaborative notes
- 🔬 **Research** - Papers, references, data analysis
- 📰 **Media** - Story ideas, sources, drafts

### For Privacy-Conscious
- 🔐 **End-to-end encryption** - Your data stays private
- 🏠 **Self-hosting option** - Complete control with Appwrite
- 🌍 **Data sovereignty** - Choose where your data lives
- 🔓 **No vendor lock-in** - Export anytime, switch backends freely
- 📦 **Own your storage** - Upload to your Google Cloud Storage bucket

---

## 🎯 What Makes CogniNote Special?

✨ **Truly Flexible** - Only note app with triple backend support (Firebase/Appwrite/Supabase)  
🔒 **Privacy First** - E2E encryption with biometric unlock  
🎬 **Media Rich** - Embed anything from anywhere  
🤖 **AI Native** - Choose your AI provider  
🌐 **Open Source Options** - Appwrite or Supabase for full transparency  
📦 **Own Your Storage** - Upload to GCS or Google Drive  
🐘 **PostgreSQL Power** - Full SQL support with Supabase ⭐  
📁 **Google Drive Integration** - 15 GB free + stream files ⭐ NEW  
🆓 **Generous Free Tiers** - All backends offer free plans  
📱 **Fully Responsive** - Works perfectly on any device  
⚡ **Modern Tech** - Built with Next.js 15 & React 18  
🎨 **Beautiful UI** - Clean, professional design  

---

## 🚀 Get Started Now!

```bash
npx create-next-app cogninote --example https://github.com/Theguardians58/Notre-
cd cogninote
npm run dev
```

**Or deploy instantly:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Theguardians58/Notre-)

---

<div align="center">

### Built with ❤️ using Next.js

**[⬆ Back to Top](#-cogninote)**

</div>
