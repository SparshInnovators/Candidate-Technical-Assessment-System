const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// --- FIX FOR RESUME UPLOAD ---
// Configure multer storage to keep the original filename and extension
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // The destination folder
    },
    filename: function (req, file, cb) {
        // Prepend the current timestamp to the original filename to avoid overwrites
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer with the custom storage configuration
const upload = multer({ storage: storage });
// --- END FIX ---


// Load questions from JSON file
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf-8'));
const SCORE_THRESHOLD = 75; // Passing score percentage

// API endpoint to get questions
app.get('/api/questions', (req, res) => {
    const selectedLanguages = req.query.languages.split(',');
    let combinedQuestions = [];
    selectedLanguages.forEach(lang => {
        if (questions[lang]) {
            combinedQuestions = [...combinedQuestions, ...questions[lang]];
        }
    });
    res.json(combinedQuestions);
});

// API endpoint to submit answers
app.post('/api/submit', (req, res) => {
    const userAnswers = req.body.answers;
    let score = 0;
    
    if (!userAnswers || userAnswers.length === 0) {
        return res.json({ score: 0, passed: false, message: 'No answers submitted.' });
    }
    
    let totalQuestions = userAnswers.length;
    userAnswers.forEach(ua => {
        let questionFound = false;
        Object.values(questions).forEach(langQuestions => {
            if (questionFound) return;
            const questionObj = langQuestions.find(q => q.question === ua.question);
            if (questionObj && questionObj.correctAnswer === ua.answer) {
                score++;
                questionFound = true;
            }
        });
    });

    const finalPercentage = (score / totalQuestions) * 100;
    const passed = finalPercentage >= SCORE_THRESHOLD;

    res.json({
        score: finalPercentage,
        passed: passed,
        message: passed ? 'Congratulations! Please upload your resume.' : 'Please try again later.'
    });
});

// Use the configured upload middleware
app.post('/api/upload-resume', upload.single('resume'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Now req.file contains the file with its original name
    res.send({ message: 'Resume uploaded successfully!', file: req.file });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});