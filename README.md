# Candidate Technical Assessment System

This web application helps organizations shortlist candidates by assessing their technical knowledge through a timed multiple-choice quiz. Based on their score, candidates are prompted to upload their resume.

---
##  Features

-  Multi-language selection (at least 2 required)
-  Timed MCQ assessment (5 minutes, auto-submit)
-  Score evaluation (7 out of 10 to pass)
-  Resume upload (PDF/DOC/DOCX if passed)
-  Auto-submit and result display on timeout
-  Fully responsive design using Tailwind CSS (CLI)

---

##  Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | React.js, Tailwind CSS (CLI)   |
| Backend     | Node.js, Express.js, Multer    |
| Styling     | Tailwind CSS (via CLI)         |
| File Upload | Resume storage via `multer`    |

Note:- the resume that candidate will upload will get uploaded inside the folder path i.e Candidate-Technical-Assessment-System/backend/uploads/ 

---
## Folder Structure
candidate-assessment/
├── backend/
│ ├── server.js
│ ├── questions.js
│ └── uploads/
├── frontend/
│ ├── public/
| | |── index.html
│ │ └── output.css
│ ├── src/
│ │ ├── App.js
│ │ ├── index.js
│ │ └── pages/
│ │ ├── LanguageSelection.jsx
│ │ ├── QuizPage.jsx
│ │ └── ResultPage.jsx
│ ├── styles/
│ │ └── input.css
│ ├── package-lock.json
│ └── package.json
└── README.md

---

##  Setup Instructions

###  Prerequisites

- Node.js v16+
- npm

---

###  Backend Setup
1. clone the repository
cd backend
npm install
node server.js
-> Server runs at http://localhost:5000

### frontend setup
cd frontend
npm install
# In one terminal, compile Tailwind:
npx tailwindcss -i ./styles/input.css -o ./public/output.css --watch

# In another terminal, start React app:
npm start
=> React runs at http://localhost:3000

Note :- Make sure you keep Tailwind CLI watching to update output.css.

### Sample Questions Format (backend/questions.js)
const questions = {
  JavaScript: [
    {
      question: "What is the output of typeof typeof 1?",
      options: ["number", "string", "undefined", "object"],
      correctAnswer: "string"
    },
    // More JS questions
  ],
  Python: [
    {
      question: "What is the result of 2**3?",
      options: ["6", "8", "9", "Error"],
      correctAnswer: "8"
    },
    // More Python questions
  ],
  // Java, C++, SQL...
};

###  Resume Upload info
Supported formats: .pdf, .doc, .docx
Saved in: backend/uploads/

Notes:-
-- Tailwind is integrated using CLI via output.css

-- All questions are stored locally in a JS file (questions.js)
(note:- we can also use mongodb to store questions so that we add questions dynamically)

-- Auto-submit logic triggers when timer hits 0

-- Answers are scored immediately and passed to Result page

### Minimum Requirements for candidate to pass 
 -- Select at least 2 languages

 -- Take 10-question quiz

 -- Score 7/10 or higher

 -- Upload resume if eligible


