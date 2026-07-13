# PPSC Preparation System

A comprehensive web application designed to help students prepare for the Punjab Public Service Commission (PPSC) examinations. This platform provides access to past papers, AI-powered mock tests, progress tracking, and personalized learning recommendations.

## 🚀 Features

- **📚 Solved Papers**: Access thousands of real past papers with detailed, step-by-step solutions
- **🤖 AI Mock Tests**: Adaptive tests powered by AI to target and strengthen your weak areas
- **📊 Progress Analytics**: Track your performance with insightful analytics and personalized recommendations
- **📖 Practice Mode**: Practice questions across multiple subjects including:
  - Computer Science
  - Current Affairs
  - English
  - Geography
  - Mathematics
  - Pakistan Affairs
  - World Affairs
- **🏆 Leaderboard**: Compete with other students and track rankings
- **👤 User Profile**: Manage your profile and view your progress
- **💬 AI Assistant**: Get help and guidance from an AI-powered assistant
- **📈 Dashboard**: Comprehensive overview of your learning journey

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.4.5](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React, React Icons
- **Charts**: Recharts
- **Build Tool**: Turbopack (for development)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.x or higher
- **npm** (Node Package Manager)

You can check your Node.js version by running:
```bash
node --version
```

## 🔧 Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd PPSC-Next
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the project root and add:
   ```bash
   HF_API_KEY=your_hugging_face_token
   NEXT_PUBLIC_API_URL=http://localhost:5001
   NEXT_PUBLIC_SERVER_URL_LOCAL=http://localhost:5001
   NEXT_PUBLIC_SERVER_URL_PRODUCTION=https://ppsc-backend-production.up.railway.app
   ```
   This is required for the YouTube audio transcription endpoint that uses the
   `openai/whisper-large-v3` model on Hugging Face, and the frontend API client
   uses the public server URL variables when `NEXT_PUBLIC_API_URL` is not set.

## 🏃 Running the Project

### Development Mode

To start the development server with Turbopack (faster builds):

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

Open this URL in your browser to see the application. The page will automatically reload when you make changes to the code.

### Production Build

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

### Linting

To check for linting errors:

```bash
npm run lint
```

## 📁 Project Structure

```
PPSC-Next/
├── public/                 # Static assets (images, logos)
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── ai-assistant/  # AI Assistant page
│   │   ├── dashboard/     # Dashboard page
│   │   ├── leaderboard/   # Leaderboard page
│   │   ├── login/         # Login page
│   │   ├── mock-test/     # Mock test page
│   │   ├── practice/      # Practice mode page
│   │   ├── profile/       # User profile page
│   │   ├── register/      # Registration page
│   │   ├── results/       # Results page
│   │   ├── subjects/      # Subjects page
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Landing page
│   ├── components/        # React components
│   │   └── layout/        # Layout components (AppBar, Sidebar, etc.)
│   ├── contexts/          # React contexts (AuthContext)
│   ├── data/              # MCQ data files (JSON)
│   ├── lib/               # Utility functions and helpers
│   └── types/             # TypeScript type definitions
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
└── tailwind.config        # Tailwind CSS configuration
```

## 🎯 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check for code issues

## 🔐 Authentication

The application uses client-side authentication with localStorage for session management. Users can:
- Register for a new account
- Login to existing accounts
- Access protected routes through the AuthWrapper component

## 📝 Notes

- The application uses **Turbopack** for faster development builds
- Data is stored in **localStorage** for client-side persistence
- MCQ data is stored in JSON files in the `src/data/` directory
- The project uses **path aliases** (`@/*`) for cleaner imports
- The video transcript feature requires `HF_API_KEY` in `.env.local`


**Happy Learning! 🎓**
