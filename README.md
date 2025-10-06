# 🧠 CogniNote - AI-Powered Note-Taking Application

> **Main Repository**: https://github.com/Theguardians58/Notre-

An enterprise-grade, AI-powered note-taking application similar to Notion and Obsidian, built with Next.js 15, Firebase, and cutting-edge web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## ✨ Features

### 📝 **Rich-Text Editing**
- Block-based editor powered by Tiptap
- Syntax highlighting for code blocks
- Drag & drop blocks
- Slash commands (`/heading`, `/code`, `/image`, etc.)
- Task lists with checkboxes
- Tables, quotes, and dividers

### 📊 **Visual Diagrams**
- **Flowcharts** - Create interactive flowcharts with React Flow
- **Mindmaps** - Auto-layout mindmaps with Dagre
- **Whiteboards** - Freeform drawing with Excalidraw
- **Mermaid Diagrams** - Text-to-diagram conversion

### 🔐 **End-to-End Encryption**
- Client-side AES-256-GCM encryption
- Zero-knowledge architecture
- Encrypted AI API keys
- Recovery key system
- No server-side decryption

### 🤖 **AI-Powered Features**
- **Multi-Provider Support**:
  - Google Gemini API
  - OpenAI GPT-4
  - Anthropic Claude
- **AI Actions**:
  - Summarize text
  - Improve writing
  - Change tone
  - Translate
  - Brainstorm ideas
  - Generate content
- Streaming responses

### 📱 **Responsive Design**
- Mobile-first approach
- Tablet optimized
- Desktop layouts
- PWA-ready
- Touch-friendly interfaces
- Offline capable

### 🔥 **Firebase Backend**
- Real-time sync with Firestore
- Authentication (Email/Password + Google OAuth)
- File storage for images/attachments
- Scalable architecture
- Cloud-based backups

### 🎨 **Modern UI/UX**
- Dark mode support
- Clean, minimalist design
- Smooth animations
- Keyboard shortcuts
- Customizable themes
- Responsive modals

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Theguardians58/Notre-.git
cd Notre-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password + Google)
4. Enable **Firestore Database**
5. Enable **Storage**
6. Copy your Firebase configuration

### 4. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📖 Documentation

### Getting Started
- [**QUICK_START.md**](QUICK_START.md) - 5-minute setup guide
- [**SETUP_CHECKLIST.md**](SETUP_CHECKLIST.md) - Complete setup checklist
- [**SUCCESS_SUMMARY.md**](SUCCESS_SUMMARY.md) - Deployment guide

### Features
- [**FEATURES_SUMMARY.md**](FEATURES_SUMMARY.md) - All features explained
- [**ENCRYPTION_GUIDE.md**](ENCRYPTION_GUIDE.md) - Security & encryption
- [**RESPONSIVE_DESIGN_GUIDE.md**](RESPONSIVE_DESIGN_GUIDE.md) - Mobile optimization

### Deployment
- [**DEPLOYMENT_GUIDE.md**](DEPLOYMENT_GUIDE.md) - Deploy to production
- [**MIGRATION_GUIDE.md**](MIGRATION_GUIDE.md) - Migration instructions

### Troubleshooting
- [**KNOWN_ISSUES_AND_FIXES.md**](KNOWN_ISSUES_AND_FIXES.md) - Common issues

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4.0
- **State Management**: Zustand
- **Editor**: Tiptap 2.1
- **Diagrams**: React Flow, Excalidraw, Mermaid
- **UI Components**: Headless UI, Heroicons

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Functions**: Firebase Functions (optional)

### AI Integration
- Google Gemini API
- OpenAI API
- Anthropic API

### Security
- Web Crypto API
- AES-256-GCM encryption
- PBKDF2 key derivation

---

## 📂 Project Structure

```
Notre-/
├── app/                        # Next.js App Router
│   ├── auth/                   # Authentication pages
│   ├── dashboard/              # Dashboard page
│   ├── note/[id]/              # Note editor pages
│   ├── settings/               # Settings pages
│   └── layout.tsx              # Root layout
├── components/                 # React components
│   ├── ai/                     # AI components
│   ├── auth/                   # Auth components
│   ├── diagrams/               # Diagram editors
│   ├── editor/                 # Text editor
│   ├── encryption/             # Encryption UI
│   ├── layout/                 # Layout components
│   └── ui/                     # UI primitives
├── lib/                        # Utilities & logic
│   ├── ai/                     # AI providers
│   ├── crypto/                 # Encryption
│   ├── firebase/               # Firebase utilities
│   ├── store/                  # Zustand stores
│   ├── search.ts               # Search functionality
│   ├── templates.ts            # Document templates
│   └── types.ts                # TypeScript types
├── hooks/                      # Custom React hooks
├── public/                     # Static assets
├── .github/                    # GitHub config
│   ├── workflows/              # CI/CD workflows
│   └── REPOSITORY_INFO.md      # Repository info
├── docs/                       # Documentation
└── package.json                # Dependencies
```

---

## 🔒 Security

### End-to-End Encryption
- All notes can be encrypted client-side
- AES-256-GCM encryption algorithm
- Zero-knowledge architecture
- Recovery key system for password reset
- See [ENCRYPTION_GUIDE.md](ENCRYPTION_GUIDE.md) for details

### API Key Security
- AI API keys are encrypted before storage
- Keys stored per-user in Firestore
- Never exposed in client-side code
- Secure transmission over HTTPS

### Firebase Security Rules
Firestore rules are configured to ensure:
- Users can only access their own data
- Authenticated access only
- Validation on writes

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Environment Variables

Required variables in `.env.local`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `chore:` Maintenance
- `refactor:` Code refactoring
- `test:` Tests
- `style:` Formatting

---

## 📊 Project Stats

- **Lines of Code**: 11,000+
- **Components**: 30+
- **Pages**: 7
- **Dependencies**: 40+
- **Documentation**: 13 guides
- **Supported Devices**: Mobile, Tablet, Desktop
- **AI Providers**: 3 (Gemini, OpenAI, Anthropic)

---

## 📝 Roadmap

### Planned Features
- [ ] Collaborative editing (real-time)
- [ ] Version history
- [ ] Export to PDF/Markdown
- [ ] Kanban boards
- [ ] Calendar integration
- [ ] Mobile apps (React Native)
- [ ] Browser extensions
- [ ] Advanced permissions

---

## 🐛 Known Issues

See [KNOWN_ISSUES_AND_FIXES.md](KNOWN_ISSUES_AND_FIXES.md) for current issues and workarounds.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with amazing open-source projects:
- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tiptap](https://tiptap.dev/)
- [React Flow](https://reactflow.dev/)
- [Excalidraw](https://excalidraw.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Theguardians58/Notre-/issues)
- **Documentation**: Check the `docs/` folder
- **Email**: [Your email if you want to add]

---

## ⭐ Star This Repository

If you find CogniNote useful, please give it a star! It helps others discover the project.

---

**Made with ❤️ using Next.js, Firebase, and AI**

**Main Repository**: https://github.com/Theguardians58/Notre-
