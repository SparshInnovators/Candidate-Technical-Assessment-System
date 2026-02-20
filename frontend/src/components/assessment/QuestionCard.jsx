export default function QuestionCard({ question, selectedAnswer, onSelectAnswer }) {
  if (!question) return null;

  return (
    <div>
      {/* Question header */}
      <div className="flex items-start gap-3 mb-6">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white text-xs font-bold shrink-0 mt-0.5">
          {question.language?.charAt(0)}
        </span>
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{question.language}</span>
          <h3 className="text-base font-semibold text-slate-900 leading-relaxed mt-0.5">
            {question.questionText}
          </h3>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelectAnswer(index)}
              className={`
                w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 text-sm
                transition-all duration-150 cursor-pointer
                ${isSelected
                  ? 'border-indigo-500 bg-indigo-50 text-slate-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <span className={`
                inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold shrink-0
                ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}
              `}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={isSelected ? 'font-medium' : ''}>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
