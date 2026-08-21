import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { LanguageSelection } from './components/LanguageSelection.jsx';
import { AssessmentTest } from './components/AssessmentTest.jsx';
import { ResultView } from './components/ResultView.jsx';
import { QuestionBankModal } from './components/QuestionBankModal.jsx';
import { AVAILABLE_LANGUAGES } from './data/questionBank.js';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState('selection');
  const [languages, setLanguages] = useState(AVAILABLE_LANGUAGES);
  const [candidate, setCandidate] = useState({
    name: '',
    email: '',
    roleInterest: 'Fullstack Engineer',
    experienceLevel: 'Mid-Level (2-5 yrs)'
  });

  const [settings, setSettings] = useState({
    selectedLanguages: ['javascript', 'typescript'],
    questionsPerLanguage: 5,
    timerMode: 'per_question',
    perQuestionTimeSeconds: 60,
    overallTimeMinutes: 15,
    passingScorePercent: 70
  });

  const [sessionId, setSessionId] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [assessmentResult, setAssessmentResult] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // Fetch languages from backend on mount
  useEffect(() => {
    fetch('/api/languages')
      .then(res => res.json())
      .then(data => {
        if (data.languages && data.languages.length > 0) {
          setLanguages(data.languages);
        }
      })
      .catch(err => {
        console.warn('Using local languages fallback:', err);
      });
  }, []);

  // Start Assessment API Call
  const handleStartTest = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate,
          settings
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize assessment.');
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setSessionQuestions(data.questions);
      setCurrentStep('test');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error starting test:', err);
      setErrorMessage(err.message || 'Unable to connect to assessment server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Assessment API Call
  const handleSubmitTest = async (answers, totalTimeSpent) => {
    if (!sessionId) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers,
          totalTimeSpentSeconds: totalTimeSpent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to grade assessment submission.');
      }

      const resultData = await response.json();
      setAssessmentResult(resultData);
      setCurrentStep('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting test:', err);
      setErrorMessage(err.message || 'Error occurred while grading your test.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSessionId(null);
    setSessionQuestions([]);
    setAssessmentResult(null);
    setCurrentStep('selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-300 flex flex-col font-sans selection:bg-teal-500/30 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentStep={currentStep}
        candidateName={candidate.name || undefined}
        onOpenQuestionBank={() => setIsBankModalOpen(true)}
        onResetToHome={currentStep !== 'test' ? handleRetake : undefined}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mx-auto max-w-5xl px-4 pt-4 w-full">
          <div className="flex items-center justify-between rounded-xl bg-rose-950/40 border border-rose-800/60 p-4 text-xs text-rose-300 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Views */}
      <main className="flex-1 pb-16">
        {currentStep === 'selection' && (
          <LanguageSelection
            languages={languages}
            candidate={candidate}
            onCandidateChange={setCandidate}
            settings={settings}
            onSettingsChange={setSettings}
            onStartTest={handleStartTest}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'test' && sessionQuestions.length > 0 && (
          <AssessmentTest
            questions={sessionQuestions}
            settings={settings}
            candidateName={candidate.name}
            onSubmit={handleSubmitTest}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 'result' && assessmentResult && (
          <ResultView
            result={assessmentResult}
            onRetake={handleRetake}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#090B0E] py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 DevAssess Platform. Engineered for Technical Hiring & Candidate Evaluation.</p>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>Dynamic Question Balancing</span>
            <span>•</span>
            <span>Threshold Gated Upload</span>
            <span>•</span>
            <span className="text-teal-400">Instant Auto-Grading</span>
          </div>
        </div>
      </footer>

      {/* Question Bank Modal */}
      <QuestionBankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        languages={languages}
      />

    </div>
  );
}
