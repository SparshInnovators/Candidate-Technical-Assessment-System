import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Container from '../components/layout/Container';
import LanguageCard from '../components/assessment/LanguageCard';

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript'];

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
    title: 'Timed Questions',
    desc: '60 seconds per question — keep your momentum going.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '60% to Pass',
    desc: 'Hit 60% or above to unlock the resume upload portal.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Detailed Results',
    desc: 'Review every wrong answer with a full score breakdown.',
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [error, setError] = useState('');

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
    setError('');
  };

  const handleStart = () => {
    if (!user) { navigate('/login'); return; }
    if (selectedLanguages.length === 0) { setError('Please select at least one programming language.'); return; }
    navigate('/assessment', { state: { languages: selectedLanguages } });
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-indigo-950 text-white">
        <Container className="py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-200 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Candidate Technical Assessment Platform
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
              Prove Your{' '}
              <span className="text-indigo-300">Technical Skills</span>
            </h1>
            <p className="text-indigo-200 text-lg leading-relaxed max-w-lg mx-auto">
              Take a timed, language-specific assessment and demonstrate your programming expertise to potential employers.
            </p>
          </div>
        </Container>
      </div>

      {/* Main content */}
      <Container className="py-10 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Language selector card */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-md p-7">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Choose Your Languages</h2>
            <p className="text-sm text-slate-500 mb-6">Select one or more languages to be assessed on.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {LANGUAGES.map((lang) => (
                <LanguageCard
                  key={lang}
                  language={lang}
                  selected={selectedLanguages.includes(lang)}
                  onToggle={toggleLanguage}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl mb-5">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleStart}
                className={`
                  w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-sm transition-colors duration-150 cursor-pointer
                  ${selectedLanguages.length > 0
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                {user ? 'Start Assessment →' : 'Sign In to Start →'}
              </button>
              {selectedLanguages.length > 0 && (
                <span className="text-sm text-slate-500">
                  <span className="font-bold text-indigo-600">{selectedLanguages.length}</span>{' '}
                  language{selectedLanguages.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
          </div>

          {/* Feature cards */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-0.5">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
