import { useState, useCallback } from 'react';
import { db } from '../lib/appwrite';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function balanceQuestions(allQuestions, languages, questionsPerLang = 5) {
  const grouped = {};
  languages.forEach((lang) => { grouped[lang] = allQuestions.filter((q) => q.language === lang); });
  let balanced = [];
  languages.forEach((lang) => {
    const langQuestions = shuffleArray(grouped[lang]);
    balanced.push(...langQuestions.slice(0, questionsPerLang));
  });
  return shuffleArray(balanced);
}

const TIME_PER_QUESTION = 60;
const PASS_THRESHOLD = 60;

export function useAssessment() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [assessmentId, setAssessmentId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = useCallback(async (languages) => {
    setLoading(true);
    setError(null);
    try {
      const response = await db.listQuestions(languages);
      const balanced = balanceQuestions(response.documents, languages);
      if (balanced.length === 0) throw new Error('No questions found for selected languages.');
      setQuestions(balanced);
      setCurrentIndex(0);
      setAnswers({});
      setStatus('ready');
      return balanced;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const startAssessment = useCallback(async (userId, languages, questionList) => {
    try {
      const assessment = await db.createAssessment({
        userId,
        languages,
        questionIds: questionList.map((q) => q.$id),
        answers: [],
        currentIndex: 0,
        score: 0,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        timePerQuestion: TIME_PER_QUESTION,
      });
      setAssessmentId(assessment.$id);
      setStatus('in_progress');
      return assessment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const selectAnswer = useCallback((questionId, answerIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  }, [questions.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToQuestion = useCallback((index) => setCurrentIndex(index), []);

  const saveProgress = useCallback(async () => {
    if (!assessmentId) return;
    try {
      const answersArray = questions.map((q) => answers[q.$id] !== undefined ? answers[q.$id] : -1);
      await db.updateAssessment(assessmentId, { answers: answersArray, currentIndex });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }, [assessmentId, answers, currentIndex, questions]);

  const calculateScore = useCallback(() => {
    let correct = 0;
    questions.forEach((q) => { if (answers[q.$id] === q.correctAnswer) correct++; });
    return correct;
  }, [questions, answers]);

  const submitAssessment = useCallback(async (userId) => {
    setLoading(true);
    try {
      const score = calculateScore();
      const total = questions.length;
      const percentage = Math.round((score / total) * 100);
      const passed = percentage >= PASS_THRESHOLD;
      const answersArray = questions.map((q) => answers[q.$id] !== undefined ? answers[q.$id] : -1);
      await db.updateAssessment(assessmentId, { answers: answersArray, score, status: 'completed', currentIndex: total });
      const result = await db.createResult({
        userId, assessmentId, score, totalQuestions: total, percentage, passed,
        completedAt: new Date().toISOString(),
      });
      setStatus('completed');
      return { result, score, total, percentage, passed };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [assessmentId, answers, calculateScore, questions]);

  const getWrongAnswers = useCallback(() => {
    return questions
      .filter((q) => answers[q.$id] !== q.correctAnswer)
      .map((q) => ({
        question: q.questionText,
        options: q.options,
        yourAnswer: answers[q.$id] ?? -1,
        correctAnswer: q.correctAnswer,
        language: q.language,
      }));
  }, [questions, answers]);

  const getScoreByLanguage = useCallback(() => {
    const langScores = {};
    questions.forEach((q) => {
      if (!langScores[q.language]) langScores[q.language] = { correct: 0, total: 0 };
      langScores[q.language].total++;
      if (answers[q.$id] === q.correctAnswer) langScores[q.language].correct++;
    });
    return langScores;
  }, [questions, answers]);

  return {
    questions, currentIndex, currentQuestion: questions[currentIndex] || null,
    answers, assessmentId, status, error, loading,
    fetchQuestions, startAssessment, selectAnswer, goToNext, goToPrevious, goToQuestion,
    saveProgress, submitAssessment, getWrongAnswers, getScoreByLanguage,
    totalQuestions: questions.length,
    answeredCount: Object.keys(answers).length,
    TIME_PER_QUESTION,
  };
}
