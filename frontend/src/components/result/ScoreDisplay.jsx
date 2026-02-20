import Card from '../ui/Card';

export default function ScoreDisplay({ score, total, percentage, passed }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="overflow-hidden p-0">
      {/* Top accent bar */}
      <div className={`h-1.5 w-full ${passed ? 'bg-emerald-500' : 'bg-red-500'}`} />

      <div className="p-8 text-center">
        {/* Circular ring */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle
                cx="60" cy="60" r={radius} fill="none"
                stroke={passed ? '#10b981' : '#ef4444'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
          {passed ? '🎉 You Passed!' : 'Assessment Complete'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          You answered <strong className="text-slate-800">{score}</strong> out of{' '}
          <strong className="text-slate-800">{total}</strong> questions correctly.
        </p>

        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
          passed
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {passed ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {passed ? 'Pass — Resume upload unlocked' : `Fail — Need 60% to pass`}
        </span>
      </div>
    </Card>
  );
}
