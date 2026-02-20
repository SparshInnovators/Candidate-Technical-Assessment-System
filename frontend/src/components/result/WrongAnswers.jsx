import { useState } from 'react';
import Card from '../ui/Card';

export default function WrongAnswers({ wrongAnswers }) {
  const [expanded, setExpanded] = useState(false);

  if (!wrongAnswers || wrongAnswers.length === 0) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-3 text-emerald-600">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Perfect Score!</p>
            <p className="text-xs text-emerald-600">All answers were correct.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900">Review Wrong Answers</h3>
            <p className="text-xs text-slate-500">{wrongAnswers.length} question{wrongAnswers.length > 1 ? 's' : ''} to review</p>
          </div>
        </div>
        <div className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
          {wrongAnswers.map((item, index) => (
            <div key={index} className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  {item.language}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 mb-3">{item.question}</p>
              <div className="space-y-1.5">
                {item.options.map((opt, optIdx) => {
                  const isCorrect = optIdx === item.correctAnswer;
                  const isYours = optIdx === item.yourAnswer;
                  let cls = 'bg-slate-50 text-slate-600 border-slate-200';
                  if (isCorrect) cls = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  else if (isYours) cls = 'bg-red-50 text-red-800 border-red-200';

                  return (
                    <div key={optIdx} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${cls}`}>
                      <span className="font-bold w-5 shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                      <span className="flex-1">{opt}</span>
                      {isCorrect && <span className="text-xs font-bold text-emerald-600 shrink-0">✓ Correct</span>}
                      {isYours && !isCorrect && <span className="text-xs font-bold text-red-600 shrink-0">✗ Yours</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
