export default function Timer({ timeRemaining, className = '' }) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLow = timeRemaining <= 10;
  const isWarning = timeRemaining <= 20 && timeRemaining > 10;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-semibold border
        ${isLow
          ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
          : isWarning
            ? 'bg-amber-50 text-amber-600 border-amber-200'
            : 'bg-slate-50 text-slate-700 border-slate-200'
        } ${className}
      `}
    >
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
