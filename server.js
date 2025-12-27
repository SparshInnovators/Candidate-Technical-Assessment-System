// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000 // 24 hours default
  }
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-sessionId-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.session.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only PDF, DOC, DOCX
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || 
                   file.mimetype === 'application/msword' ||
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }, // 5MB default limit
  fileFilter: fileFilter
});

// Load questions from JSON file
let questionsData = {};
try {
  const questionsFile = fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8');
  questionsData = JSON.parse(questionsFile);
} catch (error) {
  console.error('Error loading questions:', error);
  questionsData = {};
}

// API Routes

// Get available languages
app.get('/api/languages', (req, res) => {
  const languages = Object.keys(questionsData);
  res.json({ languages });
});

// Initialize session and get questions for selected languages
app.post('/api/start-test', (req, res) => {
  const { languages } = req.body;
  
  if (!languages || !Array.isArray(languages) || languages.length === 0) {
    return res.status(400).json({ error: 'Please select at least one language' });
  }

  // Filter questions based on selected languages
  let selectedQuestions = [];
  languages.forEach(lang => {
    if (questionsData[lang]) {
      // Shuffle and take up to 10 questions per language
      const langQuestions = [...questionsData[lang]];
      shuffleArray(langQuestions);
      const questionsPerLang = Math.ceil(10 / languages.length); // Distribute questions evenly
      selectedQuestions.push(...langQuestions.slice(0, questionsPerLang));
    }
  });

  // Shuffle all selected questions
  shuffleArray(selectedQuestions);

  // Limit total questions to 10
  selectedQuestions = selectedQuestions.slice(0, 10);

  // Initialize session
  req.session.testData = {
    languages: languages,
    questions: selectedQuestions.map(q => ({
      question: q.question,
      options: q.options,
      language: q.language,
      correctAnswer: q.correctAnswer
    })),
    answers: new Array(selectedQuestions.length).fill(null),
    startTime: Date.now()
    // score is intentionally not set here - it will be set when test is submitted
  };

  // Send questions without correct answers to client
  const questionsForClient = selectedQuestions.map((q, index) => ({
    id: index,
    question: q.question,
    options: q.options,
    language: q.language
  }));

  res.json({ questions: questionsForClient });
});

// Submit answer for a question
app.post('/api/submit-answer', (req, res) => {
  if (!req.session.testData) {
    return res.status(400).json({ error: 'No active test session' });
  }

  const { questionId, answer } = req.body;

  if (questionId === undefined || answer === null || answer === undefined) {
    return res.status(400).json({ error: 'Invalid question ID or answer' });
  }

  req.session.testData.answers[questionId] = answer;
  res.json({ success: true });
});

// Get test results (if already submitted)
app.get('/api/get-results', (req, res) => {
  if (!req.session.testData) {
    return res.status(400).json({ error: 'No active test session' });
  }

  if (req.session.testData.score === undefined) {
    return res.status(400).json({ error: 'Test not yet submitted' });
  }

  // Safely handle percentage (might be undefined or null)
  const percentage = req.session.testData.percentage;
  const percentageStr = (percentage !== undefined && percentage !== null) 
    ? percentage.toFixed(2) 
    : '0.00';

  res.json({
    score: req.session.testData.score,
    totalQuestions: req.session.testData.totalQuestions,
    percentage: percentageStr,
    passed: req.session.testData.passed,
    results: req.session.testData.results
  });
});

// Submit test and calculate score
app.post('/api/submit-test', (req, res) => {
  if (!req.session.testData) {
    return res.status(400).json({ error: 'No active test session' });
  }

  // If already submitted, return existing results
  if (req.session.testData.score !== undefined) {
    // Safely handle percentage (might be undefined or null)
    const percentage = req.session.testData.percentage;
    const percentageStr = (percentage !== undefined && percentage !== null) 
      ? percentage.toFixed(2) 
      : '0.00';
    
    return res.json({
      score: req.session.testData.score,
      totalQuestions: req.session.testData.totalQuestions,
      percentage: percentageStr,
      passed: req.session.testData.passed,
      results: req.session.testData.results
    });
  }

  const { answers } = req.session.testData;
  
  // Validate that answers array exists
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid test data: answers not found' });
  }

  // Validate that questions array exists
  if (!req.session.testData.questions || !Array.isArray(req.session.testData.questions)) {
    return res.status(400).json({ error: 'Invalid test data: questions not found' });
  }

  let score = 0;
  const results = [];

  req.session.testData.questions.forEach((q, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === q.correctAnswer;
    
    if (isCorrect) {
      score++;
    }

    results.push({
      question: q.question,
      options: q.options,
      userAnswer: userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: isCorrect
    });
  });

  const totalQuestions = req.session.testData.questions.length;
  const percentage = (score / totalQuestions) * 100;
  const threshold = parseInt(process.env.PASS_THRESHOLD) || 60; // 60% default threshold to pass
  const passed = percentage >= threshold;

  req.session.testData.score = score;
  req.session.testData.totalQuestions = totalQuestions;
  req.session.testData.percentage = percentage;
  req.session.testData.passed = passed;
  req.session.testData.results = results;

  res.json({
    score,
    totalQuestions,
    percentage: percentage.toFixed(2),
    passed,
    results
  });
});

// Get test status (for resuming or checking)
app.get('/api/test-status', (req, res) => {
  if (!req.session.testData) {
    return res.json({ hasTest: false });
  }

  const testData = req.session.testData;
  res.json({
    hasTest: true,
    languages: testData.languages,
    questionsCount: testData.questions.length,
    answersCount: testData.answers.filter(a => a !== null).length,
    isSubmitted: testData.score !== undefined
  });
});

// Get questions for current test (without correct answers)
app.get('/api/get-questions', (req, res) => {
  if (!req.session.testData) {
    return res.status(400).json({ error: 'No active test session' });
  }

  const questions = req.session.testData.questions.map((q, index) => ({
    id: index,
    question: q.question,
    options: q.options,
    language: q.language
  }));

  res.json({ questions });
});

// Upload resume
app.post('/api/upload-resume', upload.single('resume'), (req, res) => {
  if (!req.session.testData || !req.session.testData.passed) {
    return res.status(403).json({ error: 'You must pass the test to upload resume' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  req.session.testData.resumeUploaded = true;
  req.session.testData.resumePath = req.file.path;
  req.session.testData.resumeFilename = req.file.filename;

  res.json({
    success: true,
    message: 'Resume uploaded successfully',
    filename: req.file.filename,
    originalName: req.file.originalname
  });
});

// Download/view uploaded resume
app.get('/api/download-resume', (req, res) => {
  if (!req.session.testData || !req.session.testData.resumePath) {
    return res.status(404).json({ error: 'No resume found' });
  }

  const resumePath = req.session.testData.resumePath;
  
  // Check if file exists
  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({ error: 'Resume file not found' });
  }

  // Get the original filename if available, otherwise use the stored filename
  const filename = req.session.testData.resumeFilename || path.basename(resumePath);
  const originalName = req.query.originalName || filename;

  // Determine content type based on file extension
  const ext = path.extname(resumePath).toLowerCase();
  let contentType = 'application/pdf';
  if (ext === '.doc') {
    contentType = 'application/msword';
  } else if (ext === '.docx') {
    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  
  // Set appropriate headers
  res.setHeader('Content-Disposition', `inline; filename="${originalName}"`);
  res.setHeader('Content-Type', contentType);
  
  // Send the file
  res.sendFile(path.resolve(resumePath));
});

// Clear session (for starting fresh)
app.post('/api/clear-session', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error clearing session' });
    }
    res.json({ success: true });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB' });
    }
  }
  
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Helper function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
});
