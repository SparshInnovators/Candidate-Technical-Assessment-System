import { useLocation, useNavigate } from 'react-router-dom';
import { fileStorage } from '../lib/appwrite';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ScoreDisplay from '../components/result/ScoreDisplay';
import ResumeUpload from '../components/result/ResumeUpload';
import WrongAnswers from '../components/result/WrongAnswers';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return (
      <Container className="py-16">
        <Card className="max-w-md mx-auto text-center p-8">
          <p className="text-slate-500 mb-4">No result data found.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </Card>
      </Container>
    );
  }

  const { score, total, percentage, passed, wrongAnswers, scoreByLanguage } = state;

  const handleResumeUpload = async (file) => {
    await fileStorage.uploadResume(file);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-indigo-950 text-white">
        <Container className="py-12 sm:py-16">
          <div className="text-center">
            <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-2">Assessment Complete</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Your Results</h1>
          </div>
        </Container>
      </div>

      <Container className="-mt-8 pb-12 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Overall Score */}
          <div className="lg:col-span-1">
             <ScoreDisplay score={score} total={total} percentage={percentage} passed={passed} />
          </div>

          {/* Column 2: Language Breakdown */}
          <div className="lg:col-span-1">
            {scoreByLanguage && Object.keys(scoreByLanguage).length > 0 && (
              <Card className="p-6 h-full">
                <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Language Breakdown
                </h3>
                <div className="space-y-4">
                  {Object.entries(scoreByLanguage).map(([lang, data]) => {
                    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                    return (
                      <div key={lang}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-slate-900">{lang}</span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                            pct >= 60
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {data.correct}/{data.total} &middot; {pct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${pct >= 60 ? 'bg-emerald-500' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Column 3: Actions / Resume Upload */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {passed && (
               <ResumeUpload onUpload={handleResumeUpload} />
            )}
            
            <Card className="p-6 flex flex-col items-center justify-center flex-1 text-center bg-indigo-50 border-indigo-100">
               <h3 className="text-lg font-bold text-indigo-900 mb-2">Next Steps</h3>
               <p className="text-sm text-indigo-700/80 mb-6">
                 {passed ? "Great job! Upload your resume above to complete your profile." : "Don't worry, you can always try again to improve your score."}
               </p>
               <Button variant={passed ? "secondary" : "primary"} onClick={() => navigate('/')} className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {passed ? "Back to Dashboard" : "Retake Assessment"}
              </Button>
            </Card>
          </div>

          {/* Full Width: Wrong Answers */}
          <div className="lg:col-span-3">
             <WrongAnswers wrongAnswers={wrongAnswers} />
          </div>
        </div>
      </Container>
    </div>
  );
}
