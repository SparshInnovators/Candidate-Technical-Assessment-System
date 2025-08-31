import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LanguageSelection = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const handleToggle = (lang) => {
    setSelected((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const startTest = () => {
    if (selected.length < 2) {
      alert("Please select at least 2 languages.");
      return;
    }
    navigate("/quiz", { state: { languages: selected } });
  };

  const languages = ["JavaScript", "Python", "Java", "Cpp", "SQL"];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
          Select Programming Languages
        </h1>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleToggle(lang)}
              className={`px-6 py-2 rounded-full border text-base font-medium transition-all duration-300 cursor-pointer
                ${
                  selected.includes(lang)
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <button
          onClick={startTest}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-full transition-all duration-300 cursor-pointer text-lg shadow-md"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default LanguageSelection;
