
const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const PASS_PERCENTAGE = 70;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const questionsPath = path.join(__dirname, "data", "questions.json");
const uploadDirectory = path.join(__dirname, "uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "assessment-session-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 60 * 1000
    }
  })
);

app.use(express.static(path.join(__dirname, "public")));

function getQuestionBank() {
  if (!fs.existsSync(questionsPath)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(questionsPath, "utf8"));
}

function shuffleQuestions(questions) {
  const shuffled = [...questions];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function removeUploadedFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error("Only PDF, DOC, and DOCX files are allowed."));
    }

    cb(null, true);
  }
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Assessment server is running." });
});

app.get("/api/languages", (req, res) => {
  try {
    const questions = getQuestionBank();
    const languages = [...new Set(questions.map(q => q.language))];

    res.json({ success: true, languages });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not load assessment languages."
    });
  }
});

app.post("/api/start", (req, res) => {
  try {
    const selectedLanguages = req.body.languages;

    if (!Array.isArray(selectedLanguages) || selectedLanguages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Select at least one programming language."
      });
    }

    const uniqueLanguages = [...new Set(selectedLanguages)];
    const questionBank = getQuestionBank();
    const selectedQuestions = [];

    for (const language of uniqueLanguages) {
      const languageQuestions = questionBank.filter(
        q => q.language === language
      );

      if (languageQuestions.length === 0) {
        return res.status(400).json({
          success: false,
          message: `No questions available for ${language}.`
        });
      }

      selectedQuestions.push(
        ...shuffleQuestions(languageQuestions).slice(0, 10)
      );
    }

    if (
      selectedQuestions.some(
        q => !q.id || !q.question || !Array.isArray(q.options) ||
        !Number.isInteger(q.correctIndex) ||
        q.correctIndex < 0 || q.correctIndex >= q.options.length
      )
    ) {
      return res.status(500).json({
        success: false,
        message: "The question bank contains an invalid question."
      });
    }

    req.session.assessment = {
      languages: uniqueLanguages,
      questions: selectedQuestions,
      startedAt: Date.now(),
      submitted: false,
      result: null
    };

    const safeQuestions = selectedQuestions.map(
      ({ correctIndex, explanation, ...question }) => question
    );

    res.json({
      success: true,
      totalQuestions: safeQuestions.length,
      questions: safeQuestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not start the assessment."
    });
  }
});

app.post("/api/submit", (req, res) => {
  const assessment = req.session.assessment;

  if (!assessment) {
    return res.status(400).json({
      success: false,
      message: "Start an assessment before submitting."
    });
  }

  if (assessment.submitted) {
    return res.json({ success: true, ...assessment.result });
  }

  const answers = req.body.answers || {};
  let correctAnswers = 0;

  assessment.questions.forEach(question => {
    if (Number(answers[question.id]) === question.correctIndex) {
      correctAnswers++;
    }
  });

  const totalQuestions = assessment.questions.length;
  const percentage = totalQuestions
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;

  const resumeEligible = percentage >= PASS_PERCENTAGE;

  const review = assessment.questions.map(question => ({
    id: question.id,
    language: question.language,
    question: question.question,
    options: question.options,
    selectedIndex:
      answers[question.id] === undefined
        ? null
        : Number(answers[question.id]),
    correctIndex: question.correctIndex,
    correct: Number(answers[question.id]) === question.correctIndex,
    explanation: question.explanation || ""
  }));

  assessment.submitted = true;
  assessment.result = {
    correctAnswers,
    totalQuestions,
    percentage,
    passPercentage: PASS_PERCENTAGE,
    resumeEligible,
    review
  };

  res.json({ success: true, ...assessment.result });
});

app.post("/api/upload-resume", (req, res) => {
  upload.single("resume")(req, res, error => {
    if (error) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Resume must be 5 MB or smaller."
          : error.message;

      return res.status(400).json({
        success: false,
        message
      });
    }

    const assessment = req.session.assessment;

    if (
      !assessment ||
      !assessment.submitted ||
      !assessment.result ||
      !assessment.result.resumeEligible
    ) {
      if (req.file) {
        removeUploadedFile(req.file.path);
      }

      return res.status(403).json({
        success: false,
        message: "You must pass the assessment before uploading your resume."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a resume file."
      });
    }

    res.json({
      success: true,
      message: "Resume uploaded successfully."
    });
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    success: false,
    message: "An unexpected server error occurred."
  });
});

app.listen(PORT, () => {
  console.log(`Assessment server running at http://localhost:${PORT}`);
});
