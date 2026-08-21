# DevAssess.io — Technical Assessment & Screening Platform

A fullstack technical screening and candidate evaluation web application built with **React (JavaScript)**, **Vite**, **Tailwind CSS**, and **Express**.

> **Made by Shashwat Pathak**

---

## 🌟 Overview

**DevAssess.io** is designed for technical hiring teams and developers. Candidates select their technical stack (JavaScript, TypeScript, Python, Java, C++, Go, Rust, SQL), configure assessment parameters, and complete an interleaved, timed technical evaluation. Candidates who meet the benchmark score (e.g., ≥ 70%) unlock the shortlist portal to upload their resume alongside their verified score verification token.

---

## 🚀 Key Features

- **Multi-Language Stack Selection**: Choose from 8 supported languages or select presets (Web Fullstack, Backend & Data).
- **Dynamic Assessment Engine**: Randomized and difficulty-balanced question pools with syntax snippets and option randomization.
- **Flexible Timing Modes**: Per-question countdown (60s with auto-advance), overall exam timer (15m), or untimed practice mode.
- **Question Palette & Navigation**: Live attempted / flagged / unattempted status grid with keyboard shortcuts (`1-4`, `A-D`, `F`, `Arrow Keys`).
- **Instant Auto-Grading & Analytics**: Visual score radial dial, language proficiency breakdowns, accuracy by difficulty tier (Easy / Medium / Hard), and comprehensive answer explanations.
- **Threshold-Gated Resume Shortlisting**: Qualified candidates (≥ benchmark score) unlock drag-and-drop resume upload (`.pdf`, `.doc`, `.docx`) with instant application ID and verification certificate export (`JSON`).
- **Question Repository Modal**: Filterable repository of all verified assessment questions across supported languages.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: React 18 (JSX), Tailwind CSS v4, Lucide React (Icons), Canvas-Confetti
- **Backend / Server**: Express.js (Node.js)
- **Build Tool**: Vite

---

## 📦 Prerequisites

Before running the application, ensure you have:
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn** or **pnpm** / **bun**

---

## ⚙️ Installation & Setup

1. **Clone the repository** (or navigate to the project root directory):
   ```bash
   git clone <repository-url>
   cd devassess-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env` file based on `.env.example` if needed:
   ```bash
   cp .env.example .env
   ```

---

## ▶️ Running the Application

### 1. Development Mode
Starts the Express backend server with integrated Vite middleware on port `3000`:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 2. Production Build
To create an optimized production build and preview it:
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── README.md               # Project documentation
├── package.json            # Project dependencies & scripts
├── vite.config.js          # Vite and Tailwind configuration
├── server.js               # Express API server & session management
├── index.html              # HTML entry point
└── src/
    ├── main.jsx            # React root mount
    ├── App.jsx             # Main application orchestrator
    ├── index.css           # Global Tailwind CSS styling
    ├── components/
    │   ├── Navbar.jsx            # Top navigation bar with phase stepper
    │   ├── LanguageSelection.jsx # Candidate info & stack selection
    │   ├── AssessmentTest.jsx    # Question UI, timer & palette
    │   ├── ResultView.jsx        # Scorecards, analytics & resume upload
    │   └── QuestionBankModal.jsx # Searchable repository modal
    └── data/
        └── questionBank.js       # Comprehensive verified question repository
```

---

## 👤 Author

**Made with ❤️ by Shashwat Pathak**
