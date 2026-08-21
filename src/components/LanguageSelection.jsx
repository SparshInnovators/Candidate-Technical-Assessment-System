import React, { useState } from 'react';
import { 
  Code2, 
  FileCode2, 
  Terminal, 
  Coffee, 
  Cpu, 
  Server, 
  ShieldAlert, 
  Database, 
  Check, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  ChevronRight 
} from 'lucide-react';

const ICON_MAP = {
  Code2: <Code2 className="h-5 w-5" />,
  FileCode2: <FileCode2 className="h-5 w-5" />,
  Terminal: <Terminal className="h-5 w-5" />,
  Coffee: <Coffee className="h-5 w-5" />,
  Cpu: <Cpu className="h-5 w-5" />,
  Server: <Server className="h-5 w-5" />,
  ShieldAlert: <ShieldAlert className="h-5 w-5" />,
  Database: <Database className="h-5 w-5" />
};

export const LanguageSelection = ({
  languages,
  candidate,
  onCandidateChange,
  settings,
  onSettingsChange,
  onStartTest,
  isLoading
}) => {
  const [validationError, setValidationError] = useState(null);

  const toggleLanguage = (id) => {
    const current = [...settings.selectedLanguages];
    const index = current.indexOf(id);
    if (index > -1) {
      if (current.length === 1) {
        setValidationError('You must keep at least one programming language selected.');
        return;
      }
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setValidationError(null);
    onSettingsChange({ ...settings, selectedLanguages: current });
  };

  const selectPreset = (preset) => {
    setValidationError(null);
    if (preset === 'all') {
      onSettingsChange({ ...settings, selectedLanguages: languages.map(l => l.id) });
    } else if (preset === 'web') {
      onSettingsChange({ ...settings, selectedLanguages: ['javascript', 'typescript', 'sql'] });
    } else if (preset === 'backend') {
      onSettingsChange({ ...settings, selectedLanguages: ['python', 'java', 'go', 'sql'] });
    } else if (preset === 'clear') {
      onSettingsChange({ ...settings, selectedLanguages: ['javascript'] });
    }
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!candidate.name.trim()) {
      setValidationError('Please enter your Full Name before starting.');
      return;
    }
    if (!candidate.email.trim() || !candidate.email.includes('@')) {
      setValidationError('Please enter a valid Email Address for result verification.');
      return;
    }
    if (settings.selectedLanguages.length === 0) {
      setValidationError('Please select at least one programming language.');
      return;
    }
    setValidationError(null);
    onStartTest();
  };

  const totalCalculatedQuestions = settings.selectedLanguages.length * settings.questionsPerLanguage;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner / Hero Intro */}
      <div className="text-center sm:text-left">
        <div className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-2 flex items-center gap-2 justify-center sm:justify-start">
          <Sparkles className="h-3.5 w-3.5" />
          Phase 01 — Configuration
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Technical Assessment Engine
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          Select your core programming stack to generate a targeted evaluation. Candidates meeting the passing threshold ({settings.passingScorePercent}%) unlock immediate resume submission for team shortlisting.
        </p>
      </div>

      <form onSubmit={handleStart} className="space-y-8">
        
        {/* Section 1: Candidate Information */}
        <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800/80 pb-3">
            <User className="h-5 w-5 text-teal-400" />
            <h2 className="text-base font-bold text-white">1. Candidate Information</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="cand-name" className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="cand-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={candidate.name}
                  onChange={(e) => onCandidateChange({ ...candidate, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-[#090B0E] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-teal-500 focus:bg-[#090B0E] focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cand-email" className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="cand-email"
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  value={candidate.email}
                  onChange={(e) => onCandidateChange({ ...candidate, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-[#090B0E] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-teal-500 focus:bg-[#090B0E] focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="cand-role" className="block text-xs font-semibold text-slate-300 mb-1">
                Target Role / Track
              </label>
              <input
                id="cand-role"
                type="text"
                placeholder="e.g. Fullstack Engineer"
                value={candidate.roleInterest || ''}
                onChange={(e) => onCandidateChange({ ...candidate, roleInterest: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-[#090B0E] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-teal-500 focus:bg-[#090B0E] focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Language Selection Grid */}
        <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-teal-400" />
              <div>
                <h2 className="text-base font-bold text-white">2. Select Core Stack</h2>
                <p className="text-xs text-slate-400">
                  Multiple selection allowed • <span className="text-teal-400 font-mono font-semibold">{settings.selectedLanguages.length} Selected</span>
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 font-medium mr-1 font-mono">Presets:</span>
              <button
                type="button"
                onClick={() => selectPreset('all')}
                className="rounded-lg bg-[#090B0E] border border-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                All (8)
              </button>
              <button
                type="button"
                onClick={() => selectPreset('web')}
                className="rounded-lg bg-[#090B0E] border border-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                Web Fullstack
              </button>
              <button
                type="button"
                onClick={() => selectPreset('backend')}
                className="rounded-lg bg-[#090B0E] border border-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                Backend & Data
              </button>
            </div>
          </div>

          {/* Languages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {languages.map((lang) => {
              const isSelected = settings.selectedLanguages.includes(lang.id);
              return (
                <div
                  key={lang.id}
                  id={`lang-card-${lang.id}`}
                  onClick={() => toggleLanguage(lang.id)}
                  className={`group relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/5 ring-1 ring-teal-500/30'
                      : 'border-slate-800 bg-[#161B22] hover:border-slate-700 hover:bg-[#1a2029]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isSelected ? 'bg-teal-500 text-[#0F1115] font-bold shadow-md shadow-teal-500/30' : 'bg-[#090B0E] border border-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      {ICON_MAP[lang.iconName] || <Code2 className="h-5 w-5" />}
                    </div>

                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                      isSelected 
                        ? 'border-teal-500 bg-teal-500 text-[#0F1115]' 
                        : 'border-slate-700 bg-[#090B0E] group-hover:border-slate-600'
                    }`}>
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{lang.name}</span>
                      <span className="text-[10px] font-mono text-teal-400/80 uppercase tracking-wider">
                        {lang.category.split('&')[0]}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {lang.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {lang.popularTopics.slice(0, 2).map((topic, i) => (
                        <span key={i} className="inline-block rounded-md bg-[#090B0E] border border-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Assessment Parameters & Timer Options */}
        <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800/80 pb-3">
            <Clock className="h-5 w-5 text-teal-400" />
            <h2 className="text-base font-bold text-white">3. Assessment Parameters & Timer Mode</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Questions per language */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Questions per Language
              </label>
              <div className="flex items-center gap-2">
                {[3, 5, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onSettingsChange({ ...settings, questionsPerLanguage: num })}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold border transition-all ${
                      settings.questionsPerLanguage === num
                        ? 'border-teal-500 bg-teal-500 text-[#0F1115] shadow-md shadow-teal-500/20'
                        : 'border-slate-800 bg-[#090B0E] text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-500 font-mono">
                Total assessment length: <strong className="text-teal-400">{totalCalculatedQuestions} questions</strong>
              </p>
            </div>

            {/* Timer Mode Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Timer Configuration
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'per_question', label: 'Per Q (60s)', desc: 'Countdown per question' },
                  { id: 'overall', label: 'Overall (15m)', desc: 'Fixed total test time' },
                  { id: 'untimed', label: 'Untimed', desc: 'No time limits' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onSettingsChange({ ...settings, timerMode: mode.id })}
                    className={`rounded-xl py-2 px-1 text-center text-xs font-semibold border transition-all ${
                      settings.timerMode === mode.id
                        ? 'border-teal-500 bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30'
                        : 'border-slate-800 bg-[#090B0E] text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                {settings.timerMode === 'per_question' && '⏱️ 60-second timer per question with auto-advance.'}
                {settings.timerMode === 'overall' && '⏱️ 15-minute global countdown for the entire test.'}
                {settings.timerMode === 'untimed' && '☕ Relaxed mode without time constraints.'}
              </p>
            </div>

            {/* Passing Score Benchmark */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Resume Unlock Benchmark
              </label>
              <div className="flex items-center gap-2">
                {[60, 70, 75, 80].map((threshold) => (
                  <button
                    key={threshold}
                    type="button"
                    onClick={() => onSettingsChange({ ...settings, passingScorePercent: threshold })}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold border transition-all ${
                      settings.passingScorePercent === threshold
                        ? 'border-teal-500 bg-teal-500 text-[#0F1115] shadow-md shadow-teal-500/20'
                        : 'border-slate-800 bg-[#090B0E] text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {threshold}%
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Candidates scoring ≥ <strong className="text-teal-400">{settings.passingScorePercent}%</strong> can upload their resume.
              </p>
            </div>

          </div>
        </div>

        {/* Validation error notice */}
        {validationError && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-950/40 border border-rose-800/60 p-3.5 text-xs text-rose-300 shadow-lg">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Assessment Guidelines & Start CTA */}
        <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal-400" />
                Assessment Structure Summary
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                • {settings.selectedLanguages.length} selected language{settings.selectedLanguages.length > 1 ? 's' : ''} ({settings.selectedLanguages.join(', ')})<br />
                • {totalCalculatedQuestions} total questions balanced across difficulty tiers<br />
                • Multiple-choice format with code analysis and instant auto-grading
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#0F1115] font-bold px-8 py-3.5 text-sm shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0F1115] border-t-transparent" />
                  <span>Preparing Assessment...</span>
                </>
              ) : (
                <>
                  <span>Start Technical Assessment</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>

          </div>
        </div>

      </form>
    </div>
  );
};
