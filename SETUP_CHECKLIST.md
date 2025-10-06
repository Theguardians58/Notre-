# CogniNote Setup Checklist

## ✅ Pre-Installation Verification

Before running the application, ensure you have completed the following steps:

### 1. Node.js and Package Manager
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or pnpm available

### 2. Firebase Project Setup
- [ ] Created Firebase project at https://console.firebase.google.com
- [ ] Enabled Authentication (Email/Password + Google)
- [ ] Created Firestore Database (Production mode)
- [ ] Enabled Firebase Storage
- [ ] Configured Firestore Security Rules (see README.md)
- [ ] Configured Storage Security Rules (see README.md)

### 3. Environment Variables
- [ ] Created `.env.local` file in project root
- [ ] Added all Firebase configuration variables:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`

### 4. Dependencies Installation
```bash
npm install
# or
pnpm install
```

### 5. AI Provider Setup (Optional but Recommended)
Choose at least one AI provider:

- [ ] **Google Gemini** (Recommended for beginners)
  - Get API key: https://makersuite.google.com/app/apikey
  - Free tier available
  
- [ ] **OpenAI** (GPT-4)
  - Get API key: https://platform.openai.com/api-keys
  - Paid service
  
- [ ] **Anthropic** (Claude)
  - Get API key: https://console.anthropic.com/
  - Paid service

---

## 🚀 Running the Application

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open Browser**
   - Navigate to http://localhost:3000

3. **Create Account**
   - Sign up with email or Google
   - Complete profile setup

4. **Configure AI (Optional)**
   - Go to Settings
   - Add your AI provider API key
   - Select default provider

5. **Create Your First Note**
   - Click "New Note" in sidebar
   - Start writing!

---

## 🐛 Common Issues & Solutions

### Issue: "Firebase can only be initialized on the client side"
**Solution**: This is expected on server-side rendering. Ignore if app works in browser.

### Issue: "Failed to create note"
**Solutions**:
- Check Firestore security rules are properly configured
- Ensure user is authenticated
- Verify Firebase project has Firestore enabled

### Issue: "AI features not working"
**Solutions**:
- Verify API key is correctly entered in Settings
- Check API key has proper permissions/billing enabled
- Ensure default AI provider is selected
- Check browser console for detailed error messages

### Issue: "Images not uploading"
**Solutions**:
- Verify Firebase Storage is enabled
- Check Storage security rules
- Ensure file size is under limits (default: 5MB)

### Issue: Dark mode not working
**Solutions**:
- Check browser's system preferences
- Toggle theme manually in settings
- Clear browser cache

### Issue: Search not finding notes
**Solutions**:
- Ensure notes are saved (check for "Saving..." indicator)
- Try refreshing the page
- Check notes are not empty

---

## 📊 Verification Tests

After setup, verify these features work:

1. **Authentication**
   - [ ] Can sign up with email
   - [ ] Can sign in with Google
   - [ ] Can logout and login again

2. **Notes Management**
   - [ ] Can create new note
   - [ ] Can edit note title
   - [ ] Can edit note content
   - [ ] Changes auto-save
   - [ ] Can delete note

3. **Editor Features**
   - [ ] Can format text (bold, italic)
   - [ ] Can create headings
   - [ ] Can create lists
   - [ ] Can create task lists
   - [ ] Slash commands work (type `/`)

4. **Organization**
   - [ ] Can create nested notes
   - [ ] Sidebar shows note hierarchy
   - [ ] Can navigate between notes

5. **Search**
   - [ ] Can open search (⌘K or Ctrl+K)
   - [ ] Search finds notes by title
   - [ ] Search finds notes by content

6. **AI Features** (if configured)
   - [ ] Can access AI modal
   - [ ] Can summarize text
   - [ ] Can improve writing
   - [ ] Can translate text

7. **UI/UX**
   - [ ] Dark mode toggle works
   - [ ] Responsive on mobile
   - [ ] No console errors

---

## 🔍 Debug Mode

To enable verbose logging, add to `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

---

## 📞 Getting Help

If you encounter issues not covered here:

1. Check browser console for errors (F12)
2. Check Firebase console for quota/billing issues
3. Review Firestore security rules
4. Check network tab for failed requests
5. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Browser and OS version
   - Screenshots if applicable

---

## ✨ Next Steps

Once everything is working:

1. Explore different document templates
2. Set up your preferred AI provider
3. Create your knowledge base structure
4. Try bi-directional linking
5. Experiment with AI features
6. Customize the app to your workflow

Enjoy using CogniNote! 🎉
