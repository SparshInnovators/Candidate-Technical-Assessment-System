import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  UploadCloud, 
  FileText, 
  Clock, 
  BarChart3, 
  RotateCcw, 
  Download, 
  Check, 
  Code, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  UserCheck, 
  BookOpen 
} from 'lucide-react';

export const ResultView = ({
  result,
  onRetake
}) => {
  // Confetti on mount if passed
  useEffect(() => {
    if (result.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [result.passed]);

  // Review Filter states
  const [reviewFilter, setReviewFilter] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Resume upload form states
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Additional candidate details
  const [candidatePhone, setCandidatePhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');

  const toggleExpand = (qId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setFileError(null);
    if (!file) return;

    const allowedExts = ['.pdf', '.doc', '.docx'];
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = allowedExts.some(ext => fileNameLower.endsWith(ext));

    if (!hasValidExt) {
      setFileError('Invalid file format. Please upload a PDF, DOC, or DOCX document.');
      setSelectedFile(null);
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      setFileError('File size exceeds the 10MB limit.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError('Please select a resume file before submitting.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      // Simulate progressive upload
      const progressTimer = setInterval(() => {
        setUploadProgress(p => {
          if (p >= 85) {
            clearInterval(progressTimer);
            return 85;
          }
          return p + 20;
        });
      }, 150);

      const response = await fetch('/api/candidate/upload-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: result.sessionId,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          candidatePhone,
          linkedinUrl,
          portfolioUrl,
          coverNote
        })
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to submit resume.');
      }

      const data = await response.json();
      setTimeout(() => {
        setIsUploading(false);
        setSubmissionSuccess(data);
      }, 300);
    } catch (err) {
      setIsUploading(false);
      setFileError(err.message || 'Error occurred while uploading resume.');
    }
  };

  const filteredReviews = result.reviews.filter(rev => {
    if (reviewFilter === 'correct') return rev.isCorrect;
    if (reviewFilter === 'incorrect') return !rev.isCorrect;
    return true;
  });

  const formatDuration = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const exportAssessmentJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Assessment-Result-${result.candidate.name.replace(/\s+/g, '_')}-${result.verificationToken}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* 1. Header Banner & Final Score Radial / Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#161B22] p-6 sm:p-8 shadow-xl transition-all">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Status Message & Metadata */}
          <div className="space-y-3 text-center md:text-left">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono font-bold border ${
              result.passed 
                ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {result.passed ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
                  <span>ASSESSMENT PASSED • SHORTLIST QUALIFIED</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span>THRESHOLD BENCHMARK NOT MET</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {result.passed 
                ? `Congratulations, ${result.candidate.name}!` 
                : `Assessment Complete, ${result.candidate.name}`}
            </h1>

            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              {result.passed 
                ? `You achieved a score of ${result.scorePercentage}%, exceeding the ${result.passingThreshold}% threshold. Resume submission has been unlocked for technical shortlisting review.`
                : `You scored ${result.scorePercentage}% (Passing benchmark: ${result.passingThreshold}%). While your score is below the automatic shortlisting threshold, review the technical breakdowns below to strengthen your focus areas.`}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 bg-[#090B0E] border border-slate-800 rounded-lg px-2.5 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                Token: <strong className="text-white">{result.verificationToken}</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-[#090B0E] border border-slate-800 rounded-lg px-2.5 py-1">
                <Clock className="h-3.5 w-3.5 text-teal-400" />
                Time: <strong className="text-white">{formatDuration(result.totalTimeSpentSeconds)}</strong>
              </span>
            </div>
          </div>

          {/* Radial Score Card */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#090B0E] p-6 shadow-xl border border-slate-800 min-w-[200px]">
            <div className="relative flex items-center justify-center">
              <svg className="h-28 w-28 -rotate-90 transform">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * result.scorePercentage) / 100}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ${
                    result.passed ? 'text-teal-400' : 'text-amber-400'
                  }`}
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white tracking-tight">
                  {result.scorePercentage}%
                </span>
                <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">
                  Score
                </span>
              </div>
            </div>

            <div className="mt-3 text-center text-xs text-slate-400 font-mono">
              <strong className="text-teal-400 font-bold">{result.correctAnswersCount}</strong> of <strong className="text-white font-bold">{result.totalQuestions}</strong> correct
            </div>
          </div>

        </div>
      </div>

      {/* 2. Shortlist Resume Submission Section (Conditional if Passed) */}
      {result.passed ? (
        <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Unlock Candidate Shortlisting: Upload Resume
              </h2>
              <p className="text-xs text-slate-400">
                Qualified submission attached with verified assessment score ({result.scorePercentage}%).
              </p>
            </div>
          </div>

          {submissionSuccess ? (
            /* Success confirmation slip */
            <div className="rounded-2xl border border-teal-500/40 bg-[#090B0E] p-6 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-[#0F1115] shadow-lg shadow-teal-500/20">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  Application Successfully Submitted!
                </h3>
                <p className="text-xs text-teal-300 mt-1">
                  Your resume and verified score report have been forwarded to the technical hiring team.
                </p>
              </div>

              <div className="mx-auto max-w-md rounded-xl bg-[#161B22] p-4 border border-slate-800 text-left text-xs space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono">Application ID:</span>
                  <strong className="font-mono text-teal-400">{submissionSuccess.applicationId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Candidate:</span>
                  <strong className="text-white">{submissionSuccess.candidateName} ({submissionSuccess.candidateEmail})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resume File:</span>
                  <strong className="font-mono text-slate-200">{submissionSuccess.fileName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verified Score:</span>
                  <strong className="text-teal-400 font-bold">{result.scorePercentage}% (Passed)</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={exportAssessmentJSON}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 px-5 py-2.5 text-xs font-bold text-[#0F1115] transition-all shadow-lg shadow-teal-500/20"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Verification Certificate (JSON)</span>
              </button>
            </div>
          ) : (
            /* Resume upload form */
            <form onSubmit={handleResumeSubmit} className="space-y-6">
              
              {/* Drag and drop upload zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  selectedFile 
                    ? 'border-teal-500 bg-teal-500/10' 
                    : 'border-slate-800 bg-[#090B0E]/70 hover:border-teal-500/60 hover:bg-[#090B0E]'
                }`}
              >
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="sr-only"
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-bold text-white">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for submission
                    </div>
                    <label
                      htmlFor="resume-file-input"
                      className="cursor-pointer text-xs font-semibold text-teal-400 hover:underline inline-block pt-1"
                    >
                      Change file
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#161B22] border border-slate-800 text-teal-400">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <div>
                      <label
                        htmlFor="resume-file-input"
                        className="cursor-pointer text-sm font-bold text-teal-400 hover:text-teal-300"
                      >
                        Click to browse file
                      </label>{' '}
                      <span className="text-sm text-slate-400">or drag and drop here</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Accepted formats: PDF, DOC, DOCX (Max size: 10MB)
                    </p>
                  </div>
                )}
              </div>

              {fileError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-950/40 border border-rose-800/60 p-3.5 text-xs text-rose-300 shadow-lg">
                  <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* Additional candidate contact fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#090B0E] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    LinkedIn / GitHub Profile
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#090B0E] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Brief Note to Hiring Team (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about your background, key projects, or availability..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#090B0E] px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Progress Indicator */}
              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Submitting Application & Verified Score...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-teal-500 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-6 py-3 text-xs font-bold text-[#0F1115] shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Candidate Application</span>
                </button>
              </div>

            </form>
          )}

        </div>
      ) : (
        /* Below Threshold Notice */
        <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Next Steps & Recommendations
              </h2>
              <p className="text-xs text-slate-400">
                You can review solutions below, strengthen key concepts, and retake the assessment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-800 bg-[#090B0E] p-4 text-xs space-y-2">
              <h4 className="font-bold text-white">Focused Study Recommendations:</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                {result.languageBreakdown.map(l => (
                  <li key={l.language}>
                    <strong className="text-slate-200">{l.language}:</strong> Scored {l.correct}/{l.total} ({l.percentage}%)
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#090B0E] p-4 flex flex-col justify-between text-xs space-y-3">
              <div>
                <h4 className="font-bold text-white">Ready for another attempt?</h4>
                <p className="text-slate-400 mt-1">
                  You can configure new language sets and restart the test whenever you are ready.
                </p>
              </div>
              <button
                type="button"
                onClick={onRetake}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-4 py-2.5 font-bold text-[#0F1115] transition-all shadow-lg shadow-teal-500/20"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Technical Assessment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Performance Analytics (Language & Difficulty Breakdowns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-teal-400" />
              Proficiency by Language
            </h3>
          </div>

          <div className="space-y-3.5">
            {result.languageBreakdown.map(lang => (
              <div key={lang.language} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{lang.language}</span>
                  <span className="text-slate-400 font-mono">
                    {lang.correct}/{lang.total} ({lang.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      lang.percentage >= 70 ? 'bg-teal-500' : lang.percentage >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-teal-400" />
              Accuracy by Difficulty
            </h3>
          </div>

          <div className="space-y-3.5">
            {result.difficultyBreakdown.map(diff => (
              <div key={diff.difficulty} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{diff.difficulty} Tier</span>
                  <span className="text-slate-400 font-mono">
                    {diff.correct}/{diff.total} ({diff.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      diff.difficulty === 'Easy' ? 'bg-teal-500' : diff.difficulty === 'Medium' ? 'bg-teal-300' : 'bg-rose-500'
                    }`}
                    style={{ width: `${diff.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Detailed Answer Review & Solutions */}
      <div className="rounded-2xl border border-slate-800 bg-[#161B22] p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Detailed Question Review & Solutions
            </h3>
            <p className="text-xs text-slate-400">
              Comprehensive code explanations and answer evaluations.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#090B0E] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setReviewFilter('all')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                reviewFilter === 'all' ? 'bg-teal-500 text-[#0F1115] font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({result.reviews.length})
            </button>
            <button
              onClick={() => setReviewFilter('correct')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                reviewFilter === 'correct' ? 'bg-emerald-500 text-[#0F1115] font-bold shadow-xs' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Correct ({result.reviews.filter(r => r.isCorrect).length})
            </button>
            <button
              onClick={() => setReviewFilter('incorrect')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                reviewFilter === 'incorrect' ? 'bg-rose-500 text-white font-bold shadow-xs' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              Incorrect ({result.reviews.filter(r => !r.isCorrect).length})
            </button>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {filteredReviews.map((rev, index) => {
            const isExpanded = expandedQuestions[rev.questionId] !== false; // Default expanded

            return (
              <div
                key={rev.questionId}
                className="rounded-xl border border-slate-800 bg-[#090B0E]/60 transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(rev.questionId)}
                  className="flex cursor-pointer items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      rev.isCorrect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {rev.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          Q{index + 1}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {rev.language} • {rev.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {rev.question}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                      rev.isCorrect ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {rev.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="border-t border-slate-800 p-4 sm:p-5 space-y-4 text-xs bg-[#090B0E] rounded-b-xl">
                    
                    <p className="text-sm font-semibold text-white">
                      {rev.question}
                    </p>

                    {rev.codeSnippet && (
                      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0F1115] p-3.5">
                        <pre className="text-xs font-mono text-teal-300 overflow-x-auto whitespace-pre">
                          <code>{rev.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Options status */}
                    <div className="space-y-2">
                      <span className="font-mono font-bold text-slate-400 uppercase tracking-wider">Answer Analysis:</span>
                      {rev.options.map((opt, optIdx) => {
                        const isUserChoice = rev.userSelectedOption === optIdx;
                        const isCorrectAnswer = rev.correctOption === optIdx;

                        let optStyle = 'border-slate-800 bg-[#161B22] text-slate-400';
                        if (isCorrectAnswer) {
                          optStyle = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 font-semibold ring-1 ring-emerald-500/40';
                        } else if (isUserChoice && !rev.isCorrect) {
                          optStyle = 'border-rose-500/60 bg-rose-950/40 text-rose-300 line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center justify-between rounded-lg border p-2.5 ${optStyle}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[11px] opacity-70">
                                {['A', 'B', 'C', 'D'][optIdx] || optIdx + 1}.
                              </span>
                              <span>{opt}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                              {isCorrectAnswer && (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <Check className="h-3 w-3" /> Correct Answer
                                </span>
                              )}
                              {isUserChoice && (
                                <span className={isCorrectAnswer ? 'text-emerald-400' : 'text-rose-400'}>
                                  (Your Choice)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Callout */}
                    <div className="rounded-xl border border-teal-500/20 bg-teal-950/20 p-3.5 text-xs text-teal-200 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-teal-300">
                        <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                        Explanation:
                      </span>
                      <p className="leading-relaxed text-teal-200/90">
                        {rev.explanation}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={exportAssessmentJSON}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#090B0E] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Score Report (JSON)</span>
          </button>

          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 px-5 py-2 text-xs font-bold text-[#0F1115] transition-colors shadow-lg shadow-teal-500/20"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Start New Assessment</span>
          </button>
        </div>

      </div>

    </div>
  );
};
