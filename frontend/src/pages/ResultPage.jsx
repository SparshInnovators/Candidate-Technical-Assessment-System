import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const ResultPage = () => {
  const { state } = useLocation();
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("resume", file);
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Your Score: <span className="text-blue-600">{state.score}/10</span>
        </h2>

        {state.score >= 7 ? (
          <>
            <p className="text-green-600 font-medium mb-6">
              🎉 Congratulations! Please upload your resume.
            </p>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-4 cursor-pointer border border-gray-300 rounded-lg px-4 py-2 w-full text-sm text-gray-700 transition duration-200 hover:border-blue-400"
            />

            <button
              onClick={uploadResume}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Upload Resume
            </button>

            {msg && (
              <p className="text-blue-700 mt-4 text-sm font-medium">{msg}</p>
            )}
          </>
        ) : (
          <p className="text-red-600 text-lg font-semibold mt-4">
            ❌ Sorry, you didn’t meet the minimum score. Try again later!
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
