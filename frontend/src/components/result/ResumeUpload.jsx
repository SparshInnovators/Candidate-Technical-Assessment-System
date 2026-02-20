import { useState } from 'react';
import Card from '../ui/Card';
import FileUpload from '../ui/FileUpload';

export default function ResumeUpload({ onUpload }) {
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      await onUpload(file);
      setUploaded(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-emerald-500 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Upload Your Resume</h3>
          <p className="text-xs text-slate-500">Submit your resume to complete the application process.</p>
        </div>
      </div>

      {uploaded ? (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold">Resume uploaded successfully!</span>
        </div>
      ) : (
        <FileUpload onUpload={handleUpload} uploading={uploading} />
      )}
    </Card>
  );
}
