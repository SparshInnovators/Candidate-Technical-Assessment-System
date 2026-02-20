const LANG_CONFIG = {
  JavaScript: { icon: '⚡', border: 'border-yellow-300', bg: 'bg-yellow-50', text: 'text-yellow-800', badge: 'bg-yellow-400' },
  Python:     { icon: '🐍', border: 'border-blue-300',   bg: 'bg-blue-50',   text: 'text-blue-800',   badge: 'bg-blue-500' },
  Java:       { icon: '☕', border: 'border-orange-300', bg: 'bg-orange-50', text: 'text-orange-800', badge: 'bg-orange-500' },
  'C++':      { icon: '⚙️', border: 'border-slate-300',  bg: 'bg-slate-50',  text: 'text-slate-800',  badge: 'bg-slate-500' },
  TypeScript: { icon: '🔷', border: 'border-indigo-300', bg: 'bg-indigo-50', text: 'text-indigo-800', badge: 'bg-indigo-500' },
};

export default function LanguageCard({ language, selected, onToggle }) {
  const cfg = LANG_CONFIG[language] ?? { icon: '📝', border: 'border-slate-300', bg: 'bg-slate-50', text: 'text-slate-800', badge: 'bg-slate-500' };

  return (
    <button
      type="button"
      onClick={() => onToggle(language)}
      className={`
        relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2
        transition-all duration-150 cursor-pointer text-center w-full
        ${selected
          ? `${cfg.border} ${cfg.bg}`
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
        }
      `}
    >
      {selected && (
        <span className={`absolute top-2 right-2 w-4 h-4 rounded-full ${cfg.badge} flex items-center justify-center`}>
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
      <span className="text-2xl">{cfg.icon}</span>
      <span className={`text-sm font-semibold ${selected ? cfg.text : 'text-slate-700'}`}>{language}</span>
    </button>
  );
}
