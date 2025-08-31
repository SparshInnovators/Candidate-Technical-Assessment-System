Candidate Technical Assessment System
Project Title

Dynamic Technical Assessment Platform

Project Description

This web application enables candidate shortlisting via a technical assessment process. Candidates can:

Select one or more programming languages

Take a multiple-choice quiz based on selected languages

Track progress with a timer and progress bar

Review incorrectly answered questions

Upload their resume if they pass the quiz

The platform includes optional features like random question selection, countdown timers, partial progress save, and mobile-responsive design.

Features
Core Features

Language Selection Page

Multi-language selection (Python, JavaScript, etc.)

Validation to ensure at least one language is selected

Starts the quiz upon submission

Assessment Page

Displays multiple-choice questions dynamically based on selected languages

Next/Previous question navigation

Countdown timer per question

Progress bar and partial progress save in browser storage

Result Page

Shows final score and pass/fail status

Displays wrongly answered questions with correct answers

Conditional resume upload for candidates who pass

Resume upload supports PDF, DOC, DOCX with size validation

Bonus Features

Timer with auto-submit on expiration

Randomized question selection with no repetition

Progress tracking across sessions

Review wrong answers after submission

Technical Requirements

Frontend: HTML, CSS, JavaScript

Backend: Node.js with Express.js

Session Management: express-session

File Upload: Multer for resume uploads

Data Storage: JSON file for question bank

Example Question Format
{
  "JavaScript": [
    {
      "id": "js1",
      "question": "What is closure in JavaScript?",
      "options": ["Function inside function", "Variable type", "Array method", "Object property"],
      "answer": 0
    }
  ],
  "Python": [
    {
      "id": "py1",
      "question": "Difference between list and tuple?",
      "options": ["List immutable", "Tuple immutable", "Both mutable", "None"],
      "answer": 1
    }
  ]
}

Project Setup Instructions

Clone the repository:

git clone <repository-url>


Install dependencies:

npm install


Start the server:

npm start


Open browser at:

http://localhost:3000


Select languages → Take quiz → Review wrong answers → Upload resume if passed

Folder Structure
public/          # Frontend HTML, CSS, JS
uploads/         # Resume uploads
questions.json   # Quiz question bank
server.js        # Backend
package.json
README.md

Technical Notes

Session Handling: Tracks quiz progress and results

Partial Save: Stores answers in browser storage to prevent data loss

Resume Upload: Only allowed for passed candidates; validates file type and size

Timer: Counts down per question and auto-submits when expired

Random Questions: Shuffled and balanced across selected languages

Evaluation Criteria

Functional language selection

Working quiz system with score calculation

Timer and progress tracking

Conditional resume upload

Wrong-answer review

Mobile responsiveness

Clean, well-commented code

Minimum Requirements Completed

Multi-language selection page

Quiz interface with navigation

Score calculation and conditional resume upload

Basic error handling

Mobile-responsive design

Future Enhancements

React-based UI for better interactivity

Dashboard for candidate analytics

Difficulty-based question balancing

Multiple quiz attempts per user

Enhanced UI/UX and styling