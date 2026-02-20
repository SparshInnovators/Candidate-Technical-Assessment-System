import Button from '../ui/Button';

export default function QuestionNav({
  currentIndex, totalQuestions, answers, questions,
  onPrevious, onNext, onGoTo, onSubmit, hideButtons = false
}) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <div className="space-y-4">
      {/* Prev / Next / Submit */}
      {!hideButtons && (
        <div className="flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={onPrevious} disabled={isFirst} size="md">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          {isLast ? (
            <Button onClick={onSubmit} size="md">
              Submit Test
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
          ) : (
            <Button onClick={onNext} size="md">
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          )}
        </div>
      )}

      {/* Question grid navigator */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Jump to question</p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => {
            const isAnswered = answers[q.$id] !== undefined;
            const isCurrent = i === currentIndex;
            return (
              <button
                key={i}
                onClick={() => onGoTo(i)}
                title={`Question ${i + 1}${isAnswered ? ' (answered)' : ''}`}
                className={`
                  w-8 h-8 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer
                  ${isCurrent
                    ? 'bg-indigo-600 text-white'
                    : isAnswered
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                  }
                `}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
