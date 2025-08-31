import express from "express";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const SCORE_THRESHOLD = 50;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ dest: "uploads/" });

// Load questions
const questionsData = JSON.parse(fs.readFileSync(path.join(__dirname, "questions.json")));

// Start quiz
app.post("/start-quiz", (req, res) => {
  const { languages } = req.body; // array of selected languages
  if (!languages || languages.length === 0) return res.status(400).json({ error: "Select languages" });

  // Combine questions for selected languages and shuffle
  let selectedQuestions = [];
  languages.forEach(lang => {
    if (questionsData[lang]) selectedQuestions = selectedQuestions.concat(questionsData[lang]);
  });

  // Shuffle function
  selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

  req.session.quiz = { questions: selectedQuestions, answers: {} };
  res.json({ questions: selectedQuestions });
});

// Submit answer
app.post("/submit-quiz", (req, res) => {
  const { responses } = req.body;
  const quiz = req.session.quiz;
  if (!quiz) return res.status(400).json({ error: "Quiz not started" });

  const { questions } = quiz;
  let correct = 0;
  const wrong = [];

  questions.forEach(q => {
    const sel = Number(responses[q.id]);
    if (sel === q.answer) correct++;
    else wrong.push(q.id);
  });

  const scorePercent = Math.round((correct / questions.length) * 100);
  const passed = scorePercent >= SCORE_THRESHOLD;

  req.session.result = { scorePercent, correct, total: questions.length, passed, wrong };
  res.json(req.session.result);
});

// Get result
app.get("/api/result", (req, res) => {
  if (!req.session.result) return res.status(404).json({ error: "No result found" });
  res.json(req.session.result);
});

// Upload resume
app.post("/api/upload", upload.single("resume"), (req, res) => {
  const result = req.session.result;
  if (!result || !result.passed) return res.status(403).json({ error: "Cannot upload" });
  res.json({ message: "Resume uploaded!", file: req.file });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
