import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  Send, 
  Code, 
  Copy, 
  Check, 
  HelpCircle, 
  Layers 
} from 'lucide-react';

export const AssessmentTest = ({
  questions,
  settings,
  candidateName,
  onSubmit,
  isSubmitting
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => {
    return questions.map(q => ({
      questionId: q.id,
      selectedOption: null,
      timeSpentSeconds: 0,
      isFlagged: false
    }));
  });

  // Timer states
  const perQuestionLimit = settings.perQuestionTimeSeconds || 60;
  const overallLimitSeconds = (settings.overallTimeMinutes || 15) * 60;

  const [questionTimeLeft, setQuestionTimeLeft] = useState(perQuestionLimit);
  const [overallTimeLeft, setOverallTimeLeft] = useState(overallLimitSeconds);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPaletteMobile, setShowPaletteMobile] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];
  const currentAnswer = answers[currentIndex] || {
    questionId: currentQ?.id,
    selectedOption: null,
    timeSpentSeconds: 0,
    isFlagged: false
  };

  // Reset question timer on question index change
  useEffect(() => {
    setQuestionTimeLeft(perQuestionLimit);
  }, [currentIndex, perQuestionLimit]);

  // Main Timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalTimeSpent(prev => prev + 1);

      // Increment time spent on current question
      setAnswers(prev => {
        const next = [...prev];
        if (next[currentIndex]) {
          next[currentIndex] = {
            ...next[currentIndex],
            timeSpentSeconds: next[currentIndex].timeSpentSeconds + 1
          };
        }
        return next;
      });

      // Overall timer mode
      if (settings.timerMode === 'overall') {
        setOverallTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }

      // Per-question timer mode
      if (settings.timerMode === 'per_question') {
        setQuestionTimeLeft(prev => {
          if (prev <= 1) {
            // Auto advance or submit if last
            if (currentIndex < questions.length - 1) {
              setCurrentIndex(c => c + 1);
              return perQuestionLimit;
            } else {
              clearInterval(timer);
              handleAutoSubmit();
              return 0;
            }
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, settings.timerMode, perQuestionLimit, questions.length]);

  const handleAutoSubmit = () => {
    onSubmit(answers, totalTimeSpent);
  };

  // Keyboard navigation shortcuts (1, 2, 3, 4 or A, B, C, D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSubmitModal || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toUpperCase();
      let optionIndex = null;
      if (key === '1' || key === 'A') optionIndex = 0;
      if (key === '2' || key === 'B') optionIndex = 1;
      if (key === '3' || key === 'C') optionIndex = 2;
      if (key === '4' || key === 'D') optionIndex = 3;

      if (optionIndex !== null && optionIndex < (currentQ?.options?.length || 0)) {
        handleSelectOption(optionIndex);
      } else if (key === 'F') {
        handleToggleFlag();
      } else if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(c => c - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQ, answers, showSubmitModal, questions.length]);

  const handleSelectOption = (index) => {
    setAnswers(prev => {
      const next = [...prev];
      if (next[currentIndex]) {
        next[currentIndex] = {
          ...next[currentIndex],
          selectedOption: next[currentIndex].selectedOption === index ? null : index
        };
      }
      return next;
    });
  };

  const handleToggleFlag = () => {
    setAnswers(prev => {
      const next = [...prev];
      if (next[currentIndex]) {
        next[currentIndex] = {
          ...next[currentIndex],
          isFlagged: !next[currentIndex].isFlagged
        };
      }
      return next;
    });
  };

  const handleClearAnswer = () => {
    setAnswers(prev => {
      const next = [...prev];
      if (next[currentIndex]) {
        next[currentIndex] = {
          ...next[currentIndex],
          selectedOption: null
        };
      }
      return next;
    });
  };

  const copySnippet = () => {
    if (!currentQ.codeSnippet) return;
    navigator.clipboard.writeText(currentQ.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Stats calculation
  const answeredCount = answers.filter(a => a.selectedOption !== null).length;
  const flaggedCount = answers.filter(a => a.isFlagged).length;
  const remainingCount = questions.length - answeredCount;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // Formatted timer text
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    Medium: 'bg-teal-500/10 text-teal-300 border border-teal-500/30',
    Hard: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      
      {/* Top Test Header with Progress & Timer */}
      <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-4 sm:p-5 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Question Index & Tag info */}
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-[#0F1115] font-mono font-bold text-sm shadow-md shadow-teal-500/20">
              {currentIndex + 1}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-mono font-semibold ${difficultyColors[currentQ.difficulty] || difficultyColors.Medium}`}>
                  {currentQ.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {currentQ.language} • {currentQ.category}
              </p>
            </div>
          </div>

          {/* Real-time Timers & Bookmark */}
          <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
            
            {/* Active Timer Display */}
            {settings.timerMode !== 'untimed' && (
              <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2 border font-mono font-bold text-sm transition-colors ${
                (settings.timerMode === 'per_question' ? questionTimeLeft <= 10 : overallTimeLeft <= 60)
                  ? 'border-rose-500/60 bg-rose-950/40 text-rose-400 animate-pulse'
                  : 'border-slate-800 bg-[#090B0E] text-teal-400'
              }`}>
                <Clock className={`h-4 w-4 ${
                  (settings.timerMode === 'per_question' ? questionTimeLeft <= 10 : overallTimeLeft <= 60)
                    ? 'text-rose-400'
                    : 'text-teal-400'
                }`} />
                <span>
                  {settings.timerMode === 'per_question' 
                    ? `${questionTimeLeft}s remaining` 
                    : formatTimer(overallTimeLeft)}
                </span>
              </div>
            )}

            {/* Flag / Bookmark Button */}
            <button
              type="button"
              onClick={handleToggleFlag}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                currentAnswer.isFlagged
                  ? 'border-amber-500/60 bg-amber-500/15 text-amber-300 ring-2 ring-amber-500/30'
                  : 'border-slate-800 bg-[#090B0E] text-slate-400 hover:text-white hover:border-slate-700'
              }`}
              title="Flag for review (Press 'F')"
            >
              <Bookmark className={`h-3.5 w-3.5 ${currentAnswer.isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">
                {currentAnswer.isFlagged ? 'Flagged' : 'Flag (F)'}
              </span>
            </button>

            {/* Mobile Toggle Palette */}
            <button
              type="button"
              onClick={() => setShowPaletteMobile(!showPaletteMobile)}
              className="lg:hidden inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-[#090B0E] px-3 py-2 text-xs font-semibold text-slate-300"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Palette</span>
            </button>
          </div>

        </div>

        {/* Linear Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-teal-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
            {answeredCount}/{questions.length} answered ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Main Content: Left Question Pane + Right Palette Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Question Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-6 sm:p-8 shadow-xl">
            
            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentQ.question}
            </h2>

            {/* Code Snippet Block (if provided) */}
            {currentQ.codeSnippet && (
              <div className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-[#090B0E] shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 bg-[#0F1115] px-4 py-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Code className="h-3.5 w-3.5 text-teal-400" />
                    <span className="font-mono text-slate-300">{currentQ.language} snippet</span>
                  </div>
                  <button
                    onClick={copySnippet}
                    className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-teal-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs sm:text-sm font-mono text-teal-300 overflow-x-auto leading-relaxed whitespace-pre bg-[#090B0E]">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Multiple Choice Options List */}
            <div className="mt-6 space-y-3">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Select one option:
              </span>
              
              {currentQ.options.map((option, index) => {
                const isSelected = currentAnswer.selectedOption === index;
                const optionLetter = ['A', 'B', 'C', 'D'][index] || `${index + 1}`;

                return (
                  <div
                    key={index}
                    id={`option-${currentQ.id}-${index}`}
                    onClick={() => handleSelectOption(index)}
                    className={`group relative flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all duration-150 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500/15 ring-2 ring-teal-500/30 text-white font-medium shadow-lg shadow-teal-500/5'
                        : 'border-slate-800 bg-[#090B0E]/60 hover:border-slate-700 hover:bg-[#090B0E] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 pr-4">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
                        isSelected 
                          ? 'bg-teal-500 text-[#0F1115]' 
                          : 'bg-[#161B22] border border-slate-800 text-slate-400 group-hover:text-white'
                      }`}>
                        {optionLetter}
                      </span>
                      <span className="text-sm leading-relaxed">{option}</span>
                    </div>

                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isSelected 
                        ? 'border-teal-500 bg-teal-500 text-[#0F1115]' 
                        : 'border-slate-700 bg-[#090B0E] group-hover:border-slate-600'
                    }`}>
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-5">
              
              {/* Prev / Clear */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#090B0E] px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {currentAnswer.selectedOption !== null && (
                  <button
                    type="button"
                    onClick={handleClearAnswer}
                    className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Next / Submit Trigger */}
              <div className="flex items-center gap-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(c => Math.min(questions.length - 1, c + 1))}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 px-6 py-2.5 text-xs font-bold text-[#0F1115] shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 px-6 py-2.5 text-xs font-bold text-[#0F1115] shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Review & Submit</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Right 4 Cols: Question Palette / Overview */}
        <div className={`lg:col-span-4 ${showPaletteMobile ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-20 rounded-2xl border border-slate-800 bg-[#161B22] p-5 shadow-xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-teal-400" />
                Question Palette
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {answeredCount}/{questions.length} Attempted
              </span>
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span>Flagged ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span>Unattempted ({remainingCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-teal-400 bg-transparent" />
                <span>Current (Q{currentIndex + 1})</span>
              </div>
            </div>

            {/* Grid Palette buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const ans = answers[idx];
                const isCurrent = idx === currentIndex;
                const isAnswered = ans && ans.selectedOption !== null;
                const isFlagged = ans && ans.isFlagged;

                let btnStyle = 'border-slate-800 bg-[#090B0E] text-slate-400 hover:text-white hover:border-slate-700';
                if (isAnswered) {
                  btnStyle = 'border-teal-500 bg-teal-500 text-[#0F1115] font-bold shadow-xs';
                }
                if (isFlagged) {
                  btnStyle = 'border-amber-500/60 bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40';
                }
                if (isCurrent) {
                  btnStyle += ' ring-2 ring-offset-2 ring-offset-[#161B22] ring-teal-400 font-extrabold';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowPaletteMobile(false);
                    }}
                    className={`relative flex h-10 w-full items-center justify-center rounded-xl border text-xs font-mono transition-all ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-[#161B22]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Final Submit Trigger Card */}
            <div className="border-t border-slate-800/80 pt-4">
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-4 py-3 text-xs font-bold text-[#0F1115] shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Final Assessment</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090B0E]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#161B22] p-6 shadow-2xl border border-slate-800 space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Ready to Submit Assessment?
                </h3>
                <p className="text-xs text-slate-400">
                  You will receive instant scoring and shortlist eligibility.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#090B0E] p-4 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Total Questions:</span>
                <strong className="text-white">{questions.length}</strong>
              </div>
              <div className="flex justify-between text-teal-400 font-mono">
                <span>Answered:</span>
                <strong>{answeredCount}</strong>
              </div>
              <div className="flex justify-between text-amber-400 font-mono">
                <span>Flagged for review:</span>
                <strong>{flaggedCount}</strong>
              </div>
              <div className="flex justify-between text-rose-400 font-mono">
                <span>Unattempted remaining:</span>
                <strong>{remainingCount}</strong>
              </div>
            </div>

            {remainingCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 p-3 rounded-xl border border-amber-800/60">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>You still have {remainingCount} unattempted question{remainingCount > 1 ? 's' : ''}. Unanswered questions receive 0 points.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-800 bg-[#090B0E] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  onSubmit(answers, totalTimeSpent);
                }}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-5 py-2 text-xs font-bold text-[#0F1115] shadow-lg shadow-teal-500/20 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0F1115] border-t-transparent" />
                    <span>Grading...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Confirm & Submit</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
