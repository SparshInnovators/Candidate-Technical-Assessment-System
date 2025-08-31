# Candidate Technical Assessment System
## Student Development Task

### Task Title
Build a Dynamic Technical Assessment Platform

### Task Description
Create a web application that helps in candidate shortlisting through a technical assessment process. Candidates can select their preferred programming languages, take a multiple-choice test, and based on their performance, get access to resume upload functionality.

### Core Features
1. **Language Selection Page**
   - List of programming languages to choose from
   - Multiple selection allowed
   - Start test button

2. **Assessment Page**
   - Multiple choice questions based on selected languages
   - Next/Previous question navigation
   - Submit test button
   - Display current score (optional)

3. **Result Page**
   - Display final score
   - If score meets threshold:
     - Show resume upload option
     - Display success message
   - If score below threshold:
     - Show "Try again later" message

### Technical Requirements
- Frontend: HTML, CSS, JavaScript (framework of your choice)
- Backend: Any language/framework
- Store questions and answers
- Basic user session management
- File upload functionality for resume

### Question Format Example
```javascript
{
    question: "What is the output of: console.log(typeof typeof 1)?",
    options: [
        "number",
        "string",
        "undefined",
        "object"
    ],
    correctAnswer: "string",
    language: "JavaScript"
}
```

### Steps to Complete

1. **Create Landing Page**
   - Design language selection interface
   - Implement multi-select functionality
   - Add validation before test starts

2. **Implement Test Interface**
   - Create question display component
   - Add answer selection functionality
   - Implement navigation between questions
   - Add score calculation

3. **Build Result System**
   - Create score display
   - Implement conditional resume upload
   - Add file type validation for resume

4. **Add Basic Styling**
   - Make interface responsive
   - Add loading states
   - Include progress indicators
   - Style form elements

### Bonus Features
1. **Timer System**
   - Add countdown timer for each question
   - Auto-submit when time expires
   - Display time remaining

2. **Dynamic Question Sets**
   - Implement random question selection
   - Ensure no question repetition
   - Balance questions across selected languages

3. **Additional Enhancements**
   - Progress bar
   - Score analytics
   - Review wrong answers
   - Save partial progress

### Notes
- Maintain clean code structure
- Include proper error handling
- Focus on user experience
- Ensure mobile responsiveness
- Include loading states
- Add proper validation messages

### Example Data Structure

```javascript
// Question Bank Example
const questions = {
    "JavaScript": [
        {
            question: "What is closure in JavaScript?",
            options: ["...", "...", "...", "..."],
            correctAnswer: 2
        },
        // More questions...
    ],
    "Python": [
        {
            question: "What is the difference between list and tuple?",
            options: ["...", "...", "...", "..."],
            correctAnswer: 1
        },
        // More questions...
    ]
}
```

### Submission Requirements
- GitHub repository containing:
  - Source code
  - Setup instructions
  - Sample questions JSON
  - README file

### Evaluation Criteria
- Code organization
- User interface design
- Error handling
- Feature implementation
- Code commenting
- Mobile responsiveness

### Time Estimate
- Basic Version: 4-5 hours
- With Bonus Features: 8-10 hours

### Technical Tips
1. **Question Management**
   - Store questions in JSON format
   - Include at least 10 questions per language
   - Maintain proper question categorization

2. **Session Handling**
   - Track user progress
   - Handle page refreshes
   - Maintain score data

3. **File Upload**
   - Limit file types to PDF, DOC, DOCX
   - Implement file size validation
   - Add upload progress indicator

4. **For Timer Feature**
   ```javascript
   // Timer example structure
   {
       questionId: 1,
       timeLimit: 60, // seconds
       timeRemaining: 60,
       status: "active"
   }
   ```

5. **For Random Questions**
   - Implement shuffle algorithm
   - Ensure fair distribution of difficulty
   - Track used questions

### Minimum Requirements to Pass
- Working language selection
- Functional quiz system
- Score calculation
- Conditional resume upload
- Basic error handling
- Mobile responsive design


### My Implementation
- Built a dynamic technical assessment platform using HTML, CSS,Bootstrap and JavaScript.

- Implemented language selection, multiple-choice quiz interface, and score calculation.

- Added conditional resume upload based on candidate performance.

- Validated inputs and ensured responsive design for mobile and desktop.

- Used JSON to store questions and answers dynamically.

- Added responsiveness across all the screen sizes.