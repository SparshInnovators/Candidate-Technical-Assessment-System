import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAssessment } from '../hooks/useAssessment';
import { useTimer } from '../hooks/useTimer';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import ProgressBar from '../components/ui/ProgressBar';
import Timer from '../components/ui/Timer';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import QuestionCard from '../components/assessment/QuestionCard';
import QuestionNav from '../components/assessment/QuestionNav';

export default function AssessmentPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const languages = location.state?.languages || [];

  const {
    questions, currentIndex, currentQuestion, answers, status,
    error, loading, fetchQuestions, startAssessment, selectAnswer,
    goToNext, goToPrevious, goToQuestion, saveProgress, submitAssessment,
    totalQuestions, answeredCount, TIME_PER_QUESTION,
    getWrongAnswers, getScoreByLanguage,
  } = useAssessment();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleTimerExpire = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      goToNext();
    } else {
      setShowSubmitModal(true);
    }
  }, [currentIndex, questions.length, goToNext]);

  const { timeRemaining, reset: resetTimer } = useTimer(TIME_PER_QUESTION, handleTimerExpire);

  useEffect(() => {
    if (languages.length === 0) { navigate('/'); return; }
    const init = async () => {
      try {
        const questionList = await fetchQuestions(languages);
        await startAssessment(user.$id, languages, questionList);
      } catch (err) {
        console.error('Failed to initialize assessment:', err);
      }
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === 'in_progress' && currentQuestion) {
      resetTimer(TIME_PER_QUESTION);
    }
  }, [currentIndex, status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === 'in_progress' && Object.keys(answers).length > 0) {
      const timeout = setTimeout(() => saveProgress(), 2000);
      return () => clearTimeout(timeout);
    }
  }, [answers, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await submitAssessment(user.$id);
      navigate('/result', {
        state: {
          ...result,
          wrongAnswers: getWrongAnswers(),
          scoreByLanguage: getScoreByLanguage(),
        },
      });
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  if (loading && status === 'idle') {
    return <Loader text="Loading questions..." fullscreen />;
  }

  if (error) {
    return (
      <Container className="py-16">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5-3.032 1.5-3.898 0L2.697 16.126c-.866-1.5.217-3.374 1.948-3.374h14.71c1.73 0 2.813 1.874 1.948 3.374zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </Card>
      </Container>
    );
  }

  if (!currentQuestion) return null;

  const unanswered = totalQuestions - answeredCount;

  return (
    <Container className="py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content: Question */}
        <div className="lg:col-span-8">
          <Card className="p-8 min-h-125 flex flex-col justify-between">
             <div className="mb-6">
                <QuestionCard
                  question={currentQuestion}
                  selectedAnswer={answers[currentQuestion.$id]}
                  onSelectAnswer={(idx) => selectAnswer(currentQuestion.$id, idx)}
                />
             </div>
             
             {/* Navigation Buttons (Moved here for better UX) */}
             <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
                <Button variant="secondary" onClick={goToPrevious} disabled={currentIndex === 0} size="md">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </Button>

                {currentIndex === totalQuestions - 1 ? (
                  <Button onClick={() => setShowSubmitModal(true)} size="md">
                    Submit Test
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Button>
                ) : (
                  <Button onClick={goToNext} size="md">
                    Next
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                )}
             </div>
          </Card>
        </div>

        {/* Sidebar: Timer, Progress, Grid */}
        <div className="lg:col-span-4 space-y-6">
          {/* Timer Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Time Remaining</h3>
                <Timer timeRemaining={timeRemaining} />
             </div>
             <ProgressBar current={currentIndex + 1} total={totalQuestions} className="mt-4" />
             <p className="text-right text-xs text-slate-400 mt-2">
               <span className="font-bold text-slate-900">{answeredCount}</span> of {totalQuestions} answered
             </p>
          </div>

          {/* Question Navigator */}
          <QuestionNav
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            answers={answers}
            questions={questions}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onGoTo={goToQuestion}
            onSubmit={() => setShowSubmitModal(true)}
            hideButtons={true} // Add this prop to hide buttons in QuestionNav if modifying component
          />
        </div>
      </div>

      {/* Submit Modal */}
      <Modal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          title="Submit Assessment?"
        >
          <p className="text-sm text-slate-600 mt-1 mb-2">
            You have answered{' '}
            <strong className="text-slate-900">{answeredCount}</strong> of{' '}
            <strong className="text-slate-900">{totalQuestions}</strong> questions.
          </p>

          {unanswered > 0 && (
            <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl mt-3 mb-5">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {unanswered} unanswered question{unanswered > 1 ? 's' : ''} will be marked incorrect.
            </div>
          )}

          <div className="flex gap-3 justify-end mt-5">
            <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>Continue</Button>
            <Button onClick={handleSubmit} loading={submitting}>Submit Assessment</Button>
          </div>
        </Modal>
    </Container>
  );
}
