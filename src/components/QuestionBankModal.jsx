import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Code2, 
  Database, 
  Filter, 
  Check, 
  ChevronRight, 
  Layers, 
  HelpCircle 
} from 'lucide-react';
import { QUESTION_BANK } from '../data/questionBank.js';

export const QuestionBankModal = ({
  isOpen,
  onClose,
  languages
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredQuestions = QUESTION_BANK.filter(q => {
    if (selectedLanguage !== 'all' && q.languageId !== selectedLanguage) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchQ = q.question.toLowerCase().includes(query);
      const matchTopic = q.topic.toLowerCase().includes(query);
      const matchLang = q.language.toLowerCase().includes(query);
      if (!matchQ && !matchTopic && !matchLang) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090B0E]/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-800 bg-[#161B22] shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Technical Assessment Question Repository
              </h2>
              <p className="text-xs text-slate-400">
                Browse verified questions across supported languages and runtime stacks ({QUESTION_BANK.length} total).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="border-b border-slate-800 bg-[#090B0E] p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by keyword, topic, or language syntax..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-[#161B22] pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Language filter dropdown */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-800 bg-[#161B22] px-3 py-2 text-xs text-slate-300 focus:border-teal-500 focus:outline-none"
            >
              <option value="all">All Languages ({QUESTION_BANK.length})</option>
              {languages.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>

            {/* Difficulty filter dropdown */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-800 bg-[#161B22] px-3 py-2 text-xs text-slate-300 focus:border-teal-500 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

          </div>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No assessment questions found matching your filter criteria.
            </div>
          ) : (
            filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-xl border border-slate-800 bg-[#090B0E] p-4 text-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-400">#{idx + 1}</span>
                    <span className="font-semibold text-white">{q.language}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                      {q.difficulty}
                    </span>
                    <span className="text-slate-500 font-mono">• {q.topic}</span>
                  </div>
                </div>

                <p className="font-medium text-slate-200 text-sm">{q.question}</p>

                {q.codeSnippet && (
                  <pre className="p-3 rounded-lg bg-[#161B22] text-teal-300 font-mono text-[11px] overflow-x-auto whitespace-pre">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border text-[11px] ${
                        oIdx === q.correctOptionIndex
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 font-semibold'
                          : 'border-slate-800 bg-[#161B22]/60 text-slate-400'
                      }`}
                    >
                      <span className="font-mono mr-1.5 opacity-70">
                        {['A', 'B', 'C', 'D'][oIdx]}.
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 bg-[#090B0E] p-4 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredQuestions.length} of {QUESTION_BANK.length} items</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-teal-500 px-4 py-2 font-bold text-[#0F1115] hover:bg-teal-400 transition-colors"
          >
            Close Repository
          </button>
        </div>

      </div>
    </div>
  );
};
