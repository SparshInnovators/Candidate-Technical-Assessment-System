import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { QUESTION_BANK, AVAILABLE_LANGUAGES } from './src/data/questionBank.js';

const sessions = new Map();
const results = new Map();
const resumeSubmissions = new Map();

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // --- API Endpoints ---

  // 1. Languages list and statistics
  app.get('/api/languages', (_req, res) => {
    const languagesWithCounts = AVAILABLE_LANGUAGES.map(lang => {
      const questionsForLang = QUESTION_BANK.filter(
        q => q.language.toLowerCase() === lang.name.toLowerCase() || q.language.toLowerCase().includes(lang.id)
      );
      return {
        ...lang,
        totalQuestions: questionsForLang.length,
        difficultyCounts: {
          easy: questionsForLang.filter(q => q.difficulty === 'Easy').length,
          medium: questionsForLang.filter(q => q.difficulty === 'Medium').length,
          hard: questionsForLang.filter(q => q.difficulty === 'Hard').length,
        }
      };
    });

    res.json({
      languages: languagesWithCounts,
      totalQuestionBankSize: QUESTION_BANK.length,
      defaultThreshold: 70
    });
  });

  // 2. Start Assessment Session & Generate Dynamic Questions
  app.post('/api/assessment/start', (req, res) => {
    try {
      const { candidate, settings } = req.body;

      if (!candidate?.name || !candidate?.email) {
        return res.status(400).json({ error: 'Candidate name and email are required.' });
      }

      if (!settings?.selectedLanguages || settings.selectedLanguages.length === 0) {
        return res.status(400).json({ error: 'At least one programming language must be selected.' });
      }

      const questionsPerLang = Math.max(1, Math.min(settings.questionsPerLanguage || 5, 10));
      const chosenQuestions = [];
      const sessionQuestionIds = [];

      for (const langId of settings.selectedLanguages) {
        const langMeta = AVAILABLE_LANGUAGES.find(l => l.id === langId);
        const langName = langMeta ? langMeta.name : langId;

        const langQuestions = QUESTION_BANK.filter(
          q => q.language.toLowerCase() === langName.toLowerCase() || q.language.toLowerCase().includes(langId.toLowerCase())
        );

        const shuffled = shuffleArray(langQuestions);
        const selectedForLang = shuffled.slice(0, Math.min(questionsPerLang, shuffled.length));

        for (const q of selectedForLang) {
          sessionQuestionIds.push(q.id);
          // Return client-safe version without correctAnswer or explanation
          chosenQuestions.push({
            id: q.id,
            language: q.language,
            category: q.category,
            difficulty: q.difficulty,
            question: q.question,
            codeSnippet: q.codeSnippet,
            options: q.options
          });
        }
      }

      // Shuffle all selected questions to give an interleaved experience
      const finalQuestions = shuffleArray(chosenQuestions);
      const sessionId = generateId('SES');

      sessions.set(sessionId, {
        sessionId,
        candidate,
        settings,
        questionIds: finalQuestions.map(q => q.id),
        startTime: Date.now()
      });

      res.json({
        sessionId,
        candidate,
        settings,
        questions: finalQuestions,
        totalQuestions: finalQuestions.length,
        startTime: Date.now()
      });
    } catch (err) {
      console.error('Error starting assessment:', err);
      res.status(500).json({ error: 'Failed to initialize assessment session.' });
    }
  });

  // 3. Submit Assessment and Compute Result
  app.post('/api/assessment/submit', (req, res) => {
    try {
      const {
        sessionId,
        answers,
        totalTimeSpentSeconds
      } = req.body;

      const session = sessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Assessment session not found or expired.' });
      }

      const reviews = [];
      let correctCount = 0;
      const langStatsMap = {};
      const diffStatsMap = {
        Easy: { total: 0, correct: 0 },
        Medium: { total: 0, correct: 0 },
        Hard: { total: 0, correct: 0 }
      };

      for (const qId of session.questionIds) {
        const fullQ = QUESTION_BANK.find(q => q.id === qId);
        if (!fullQ) continue;

        const candidateAnswer = answers.find(a => a.questionId === qId);
        const userChoice = candidateAnswer && candidateAnswer.selectedOption !== null
          ? candidateAnswer.selectedOption
          : null;

        const isCorrect = userChoice !== null && userChoice === fullQ.correctAnswer;

        if (isCorrect) {
          correctCount++;
        }

        // Language breakdown accumulation
        if (!langStatsMap[fullQ.language]) {
          langStatsMap[fullQ.language] = { total: 0, correct: 0 };
        }
        langStatsMap[fullQ.language].total++;
        if (isCorrect) langStatsMap[fullQ.language].correct++;

        // Difficulty breakdown accumulation
        if (diffStatsMap[fullQ.difficulty]) {
          diffStatsMap[fullQ.difficulty].total++;
          if (isCorrect) diffStatsMap[fullQ.difficulty].correct++;
        }

        reviews.push({
          questionId: fullQ.id,
          language: fullQ.language,
          difficulty: fullQ.difficulty,
          question: fullQ.question,
          codeSnippet: fullQ.codeSnippet,
          options: fullQ.options,
          userSelectedOption: userChoice,
          correctOption: fullQ.correctAnswer,
          isCorrect,
          explanation: fullQ.explanation,
          timeSpentSeconds: candidateAnswer?.timeSpentSeconds || 0
        });
      }

      const totalQuestions = session.questionIds.length;
      const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      const passingThreshold = session.settings.passingScorePercent || 70;
      const passed = scorePercentage >= passingThreshold;
      const verificationToken = `DTAP-${passed ? 'PASS' : 'REV'}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const languageBreakdown = Object.keys(langStatsMap).map(lang => ({
        language: lang,
        total: langStatsMap[lang].total,
        correct: langStatsMap[lang].correct,
        percentage: Math.round((langStatsMap[lang].correct / langStatsMap[lang].total) * 100)
      }));

      const difficultyBreakdown = ['Easy', 'Medium', 'Hard'].map(diff => ({
        difficulty: diff,
        total: diffStatsMap[diff]?.total || 0,
        correct: diffStatsMap[diff]?.correct || 0,
        percentage: diffStatsMap[diff]?.total > 0
          ? Math.round((diffStatsMap[diff].correct / diffStatsMap[diff].total) * 100)
          : 0
      }));

      const assessmentResult = {
        sessionId,
        candidate: session.candidate,
        submittedAt: new Date().toISOString(),
        totalQuestions,
        correctAnswersCount: correctCount,
        scorePercentage,
        passed,
        passingThreshold,
        totalTimeSpentSeconds: totalTimeSpentSeconds || 0,
        languageBreakdown,
        difficultyBreakdown,
        reviews,
        verificationToken
      };

      results.set(sessionId, assessmentResult);

      res.json(assessmentResult);
    } catch (err) {
      console.error('Error grading assessment:', err);
      res.status(500).json({ error: 'Failed to grade assessment submission.' });
    }
  });

  // 4. Resume Upload (Threshold Gated)
  app.post('/api/candidate/upload-resume', (req, res) => {
    try {
      const {
        sessionId,
        fileName,
        fileSize,
        fileType,
        fileData,
        candidatePhone,
        linkedinUrl,
        portfolioUrl,
        coverNote
      } = req.body;

      const result = results.get(sessionId);
      if (!result) {
        return res.status(403).json({ error: 'Valid completed assessment required before resume submission.' });
      }

      if (!result.passed) {
        return res.status(403).json({
          error: `Assessment score (${result.scorePercentage}%) does not meet the passing threshold (${result.passingThreshold}%). Resume submission is locked.`
        });
      }

      // File validation
      const allowedExtensions = ['.pdf', '.doc', '.docx'];
      const ext = path.extname(fileName || '').toLowerCase();
      const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/octet-stream'
      ];

      if (!allowedExtensions.includes(ext) && !allowedMimes.includes(fileType)) {
        return res.status(400).json({
          error: 'Invalid file format. Only PDF, DOC, and DOCX documents are accepted.'
        });
      }

      // 10MB limit
      const maxBytes = 10 * 1024 * 1024;
      if (fileSize > maxBytes) {
        return res.status(400).json({
          error: 'File size exceeds maximum limit of 10MB.'
        });
      }

      const applicationId = `CAND-APP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const submissionRecord = {
        applicationId,
        sessionId,
        candidate: result.candidate,
        scorePercentage: result.scorePercentage,
        verificationToken: result.verificationToken,
        fileName,
        fileSize,
        fileType,
        candidatePhone: candidatePhone || 'Not provided',
        linkedinUrl: linkedinUrl || 'Not provided',
        portfolioUrl: portfolioUrl || 'Not provided',
        coverNote: coverNote || '',
        submittedAt: new Date().toISOString(),
        hasFileData: Boolean(fileData)
      };

      resumeSubmissions.set(applicationId, submissionRecord);

      res.json({
        success: true,
        applicationId,
        candidateName: result.candidate.name,
        candidateEmail: result.candidate.email,
        fileName,
        fileSize,
        submittedAt: submissionRecord.submittedAt,
        message: 'Resume successfully submitted and verified against assessment credentials.'
      });
    } catch (err) {
      console.error('Error processing resume upload:', err);
      res.status(500).json({ error: 'Failed to process resume upload.' });
    }
  });

  // 5. Sample Question Bank export / summary endpoint
  app.get('/api/sample-questions', (_req, res) => {
    res.json({
      totalQuestions: QUESTION_BANK.length,
      sampleQuestions: QUESTION_BANK.slice(0, 5)
    });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
