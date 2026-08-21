import React from 'react';
import { 
  Code2, 
  Terminal, 
  Layers, 
  Database, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';

export const Navbar = ({
  currentStep,
  selectedLanguagesCount = 0,
  onOpenQuestionBank
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0F1115]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-inner">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black tracking-tight text-white">
                DevAssess<span className="text-teal-400">.io</span>
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-teal-400 border border-teal-500/20">
                PRO SHORTLIST
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Dynamic Technical Assessment & Screening
            </p>
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div className="hidden md:flex items-center gap-2">
          {/* Step 1 */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
            currentStep === 'select'
              ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
              : 'text-slate-500'
          }`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
              currentStep === 'select' ? 'bg-teal-500 text-[#0F1115]' : 'bg-slate-800 text-slate-400'
            }`}>
              1
            </span>
            <span>Stack Select</span>
          </div>

          <div className="h-px w-4 bg-slate-800" />

          {/* Step 2 */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
            currentStep === 'test'
              ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
              : 'text-slate-500'
          }`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
              currentStep === 'test' ? 'bg-teal-500 text-[#0F1115]' : 'bg-slate-800 text-slate-400'
            }`}>
              2
            </span>
            <span>Assessment</span>
          </div>

          <div className="h-px w-4 bg-slate-800" />

          {/* Step 3 */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
            currentStep === 'result'
              ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
              : 'text-slate-500'
          }`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
              currentStep === 'result' ? 'bg-teal-500 text-[#0F1115]' : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </span>
            <span>Result & Shortlist</span>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5">
          {onOpenQuestionBank && (
            <button
              onClick={onOpenQuestionBank}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#161B22] px-3.5 py-1.5 text-xs font-mono font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all shadow-xs"
            >
              <Database className="h-3.5 w-3.5 text-teal-400" />
              <span className="hidden sm:inline">Question Bank</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 rounded-xl bg-[#161B22] px-3 py-1.5 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[11px] text-slate-400">Benchmark:</span>
            <span className="font-bold text-teal-400">70% Pass</span>
          </div>
        </div>

      </div>
    </header>
  );
};
