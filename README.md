# Candidate Technical Assessment System

A dynamic web application for candidate shortlisting through technical assessments. Candidates can select programming languages, take multiple-choice tests, and upload resumes based on their performance.

## Features

### Core Features

1. **Language Selection Page**
   - Multi-select interface for programming languages
   - Validation before test starts
   - Modern, responsive design

2. **Assessment Page**
   - Multiple choice questions based on selected languages
   - Next/Previous question navigation
   - Real-time progress bar
   - Current score display
   - Answer persistence

3. **Result Page**
   - Final score display with visual indicators
   - Pass/Fail messaging (60% threshold)
   - Conditional resume upload (only for passing candidates)
   - Answer review section
   - File type and size validation

### Technical Implementation

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express.js
- **Session Management**: express-session
- **File Upload**: Multer middleware
- **Data Storage**: JSON file for questions, session storage for test data

## Project Structure

```
Candidate-Technical-Assessment-System/
├── server.js                 # Express server and API routes
├── package.json              # Node.js dependencies
├── questions.json            # Question bank (12 questions per language)
├── .gitignore               # Git ignore rules
├── README.md                # This file
└── public/                  # Frontend files
    ├── index.html           # Language selection page
    ├── assessment.html      # Test interface
    ├── result.html          # Results page
    ├── css/
    │   └── style.css        # Main stylesheet
    └── js/
        ├── app.js           # Shared utilities and API functions
        ├── index.js         # Language selection logic
        ├── assessment.js    # Test interface logic
        └── result.js        # Results page logic
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone or download the repository**
   ```bash
   cd Candidate-Technical-Assessment-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload (requires nodemon):
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to: `http://localhost:3000`
   - The application will start with the language selection page

### Environment Variables (Optional)

Create a `.env` file in the root directory for custom configuration. You can copy `.env.example` to `.env` and modify the values:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=your-secret-key-change-in-production-to-a-random-string
SESSION_MAX_AGE=86400000

# File Upload Configuration
MAX_FILE_SIZE=5242880

# Test Configuration
PASS_THRESHOLD=60
```

**Important**: Never commit your `.env` file to version control. The `.env.example` file is provided as a template.

## Usage

### For Candidates

1. **Select Languages**: Choose one or more programming languages from the list
2. **Start Test**: Click "Start Test" to begin the assessment
3. **Answer Questions**: Navigate through questions using Next/Previous buttons
4. **Submit Test**: Click "Submit Test" when finished
5. **View Results**: See your score and review answers
6. **Upload Resume**: If you passed (≥60%), upload your resume (PDF, DOC, or DOCX)

### Supported Languages

- JavaScript
- Python
- Java
- C++

Each language has 12 questions available.

## API Endpoints

- `GET /api/languages` - Get available programming languages
- `POST /api/start-test` - Initialize test session with selected languages
- `GET /api/get-questions` - Get questions for current test (without answers)
- `POST /api/submit-answer` - Submit answer for a specific question
- `POST /api/submit-test` - Submit complete test and get results
- `GET /api/test-status` - Check current test session status
- `GET /api/get-results` - Get test results (if already submitted)
- `POST /api/upload-resume` - Upload resume file (requires passing score)
- `POST /api/clear-session` - Clear current session

## Question Format

Questions are stored in `questions.json` with the following structure:

```json
{
  "JavaScript": [
    {
      "question": "Question text here",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 1",
      "language": "JavaScript"
    }
  ]
}
```

## Configuration

### Test Threshold

The passing threshold is set to **60%** in `server.js`. You can modify this value:

```javascript
const threshold = 60; // Change this value
```

### File Upload Limits

- Maximum file size: **5MB**
- Allowed file types: **PDF, DOC, DOCX**

These can be modified in `server.js`:

```javascript
limits: { fileSize: 5 * 1024 * 1024 } // 5MB
```

### Questions per Test

Default: **10 questions** per test, distributed evenly across selected languages.

Modify in `server.js`:

```javascript
selectedQuestions = selectedQuestions.slice(0, 10); // Change 10 to desired number
```

## Features Implemented

✅ Multi-language selection  
✅ Dynamic question loading  
✅ Random question selection (shuffled)  
✅ Answer persistence (sessionStorage + backend)  
✅ Progress tracking  
✅ Score calculation  
✅ Conditional resume upload  
✅ File validation (type and size)  
✅ Responsive design  
✅ Error handling  
✅ Loading states  
✅ Answer review section  
✅ Progress bar  
✅ Mobile responsive  

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Considerations

- Session-based authentication
- File type validation on both client and server
- File size limits
- Secure session cookie handling
- Input validation

## Troubleshooting

### Server won't start

- Ensure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 3000 is available

### Questions not loading

- Verify `questions.json` exists and is valid JSON
- Check server console for errors
- Ensure questions are properly formatted

### File upload fails

- Check file size (must be ≤ 5MB)
- Verify file type (PDF, DOC, or DOCX only)
- Ensure `uploads/` directory is writable

### Session issues

- Clear browser cookies and try again
- Ensure cookies are enabled in browser
- Check session secret is set (default provided)

## Development

### Adding New Questions

Edit `questions.json` and add questions following the existing format:

```json
"LanguageName": [
  {
    "question": "Your question?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "language": "LanguageName"
  }
]
```

### Adding New Languages

1. Add questions to `questions.json` with a new language key
2. The language will automatically appear in the selection list

### Modifying Styles

Edit `public/css/style.css` to customize the appearance.

## License

MIT License

## Author

Student Development Task - Technical Assessment Platform

---

**Note**: This is a development project. For production use, consider:
- Using a proper database instead of JSON files
- Implementing user authentication
- Adding rate limiting
- Using environment variables for sensitive data
- Implementing HTTPS
- Adding comprehensive error logging
- Database storage for test results and resume metadata