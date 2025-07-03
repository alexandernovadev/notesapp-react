# 📝 NotesApp - Professional Note Management Application

<div align="center">
  <img src="./screenshot.png" alt="NotesApp Screenshot" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); width: 100%; max-width: 800px;">
</div>

<div align="center">
  
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Material-UI](https://img.shields.io/badge/Material_UI-5.15.0-0081CB?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[![Zustand](https://img.shields.io/badge/Zustand-4.4.0-FF6B6B?style=for-the-badge&logo=zustand&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![TipTap](https://img.shields.io/badge/TipTap-2.1.0-00D4FF?style=for-the-badge&logo=tiptap&logoColor=white)](https://tiptap.dev/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-1.40.0-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.20.0-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)

[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](http://makeapullrequest.com)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com/yourusername)

</div>

---

## 🚀 **Overview**

**NotesApp** is a modern, full-featured note-taking application built with React and TypeScript. It offers a premium writing experience with rich text editing, advanced search capabilities, user profiles, and seamless cloud synchronization through Firebase.

### ✨ **Key Highlights**
- 🎨 **Premium UI/UX** with Material Design 3
- 📝 **Rich Text Editor** powered by TipTap
- 🔍 **Advanced Search** with intelligent filtering
- 👤 **User Profiles** with detailed statistics
- 🌐 **Real-time Sync** across all devices
- 🔒 **Secure Authentication** with multiple providers
- 📱 **Fully Responsive** design

---

## 📋 **Features**

### 🔐 **Authentication & Security**
- **Multiple Auth Methods**: Email/Password, Google OAuth
- **Session Management**: Persistent authentication state
- **Password Recovery**: Secure reset functionality
- **Protected Routes**: Role-based access control
- **Data Encryption**: Secure data transmission

### 📝 **Rich Note Management**
- **Advanced Editor**: TipTap with 15+ extensions
  - Text formatting (bold, italic, underline, strikethrough)
  - Headings (H1, H2, H3)
  - Lists (bullet, numbered, tasks)
  - Tables with drag-and-drop
  - Code blocks and inline code
  - Links and images
  - Quotes and dividers
- **Smart Organization**: Categories, tags, colors, priorities
- **Multimedia Support**: Image upload with drag-and-drop
- **Auto-save**: Real-time content preservation
- **Word Count & Reading Time**: Automatic statistics

### 🔍 **Advanced Search System**
- **Semantic Search**: Search by title, content, tags
- **Smart Filters**: Category, color, priority, date range
- **Search History**: Previously searched terms
- **Auto-suggestions**: Intelligent keyword recommendations
- **Real-time Results**: Instant search with debouncing

### 👤 **Premium User Profiles**
- **Personal Information**: Bio, location, occupation, company
- **Statistics Dashboard**: 
  - Total notes and word count
  - Reading time analytics
  - Weekly/monthly activity
  - Category usage patterns
  - Achievement system
- **Preferences**: Theme, editor settings, notifications
- **Customization**: Font size, language, auto-save options

### 🎨 **User Interface**
- **Material Design 3**: Modern, accessible components
- **Custom Theme**: Purple gradient with glass morphism
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Micro-interactions and transitions
- **Loading States**: Skeleton screens and progress indicators
- **Dark Mode Ready**: Theme switching capabilities

---

## 🏗️ **Architecture**

### **Frontend Stack**
```
├── React 18 + TypeScript     # Core framework
├── Vite                      # Build tool & dev server
├── Material-UI v5            # Component library
├── Zustand                   # State management
├── React Router v6           # Navigation
├── TipTap                    # Rich text editor
└── React Hook Form           # Form management
```

### **Backend Services**
```
├── Firebase Auth             # Authentication
├── Firestore                 # NoSQL database
├── Firebase Storage          # File storage
├── Cloudinary               # Image processing
└── Firebase Hosting         # Web hosting
```

### **Project Structure**
```
src/
├── components/              # Reusable UI components
│   ├── auth/               # Authentication components
│   ├── editor/             # Rich text editor
│   ├── layout/             # Layout components
│   └── ...
├── hooks/                  # Custom React hooks
├── pages/                  # Application pages
├── stores/                 # Zustand state stores
├── firebase/               # Firebase configuration
├── utils/                  # Utility functions
├── types/                  # TypeScript definitions
└── theme/                  # Material-UI theme
```

---

## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Firebase account
- Cloudinary account (optional)

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/notesapp-react.git
   cd notesapp-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create `.env` file:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Cloudinary Configuration (Optional)
   VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/your_cloud_name/upload
   ```

4. **Firebase Setup**
   - Create a new Firebase project
   - Enable Authentication (Email/Password + Google)
   - Enable Firestore Database
   - Configure security rules

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📚 **Usage Guide**

### **Getting Started**
1. **Register**: Create account with email or Google
2. **Create Note**: Click "Nueva Nota" button
3. **Write**: Use the rich text editor with all formatting options
4. **Organize**: Add categories, tags, and colors
5. **Search**: Use the advanced search with filters
6. **Profile**: Customize your profile and preferences

### **Editor Features**
- **Formatting**: Use toolbar or keyboard shortcuts
- **Images**: Drag & drop or click to upload
- **Tables**: Insert and resize tables
- **Lists**: Create bullet, numbered, or task lists
- **Links**: Add hyperlinks to external content
- **Code**: Inline code or code blocks

### **Organization Tips**
- Use **categories** for broad topics
- Add **tags** for specific subjects
- Set **priorities** for important notes
- Use **colors** for visual organization
- **Pin** frequently accessed notes

---

## 🔧 **Development**

### **Available Scripts**
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

### **Contributing**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Code Style**
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Commit message format

---

## 📊 **Performance**

### **Optimizations**
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Cloudinary transformations
- **Caching**: Firebase offline persistence
- **Debouncing**: Search input optimization
- **Memoization**: React.memo, useMemo, useCallback

### **Metrics**
- **Lighthouse Score**: 95+ Performance
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped

---

## 🔒 **Security**

### **Implemented Measures**
- **Authentication**: Firebase Auth with JWT tokens
- **Authorization**: Firestore security rules
- **Data Validation**: Client and server-side validation
- **XSS Protection**: Content sanitization
- **HTTPS**: SSL/TLS encryption
- **Environment Variables**: Secure configuration

---

## 🌟 **Screenshots**

<div align="center">
  <table>
    <tr>
      <td><strong>Dashboard</strong></td>
      <td><strong>Rich Editor</strong></td>
    </tr>
    <tr>
      <td><img src="./docs/dashboard.png" width="400" alt="Dashboard"></td>
      <td><img src="./docs/editor.png" width="400" alt="Editor"></td>
    </tr>
    <tr>
      <td><strong>Search</strong></td>
      <td><strong>Profile</strong></td>
    </tr>
    <tr>
      <td><img src="./docs/search.png" width="400" alt="Search"></td>
      <td><img src="./docs/profile.png" width="400" alt="Profile"></td>
    </tr>
  </table>
</div>

---

## 🗺️ **Roadmap**

### **Phase 1 - Core Features** ✅
- [x] Authentication system
- [x] Rich text editor
- [x] CRUD operations
- [x] Search functionality
- [x] User profiles

### **Phase 2 - Enhanced Features** 🚧 C.Soon
- [ ] Offline support (PWA)
- [ ] Real-time collaboration
- [ ] Export to PDF/Word
- [ ] Note templates
- [ ] Scheduled reminders

### **Phase 3 - Advanced Features** 📋C.soon
- [ ] API integration
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] AI-powered suggestions
- [ ] Team workspaces

---


## 🙏 **Acknowledgments**

- **React Team** for the amazing framework
- **Material-UI** for the beautiful components
- **TipTap** for the rich text editor
- **Firebase** for the backend services
- **Cloudinary** for image management
- **Open Source Community** for inspiration

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>