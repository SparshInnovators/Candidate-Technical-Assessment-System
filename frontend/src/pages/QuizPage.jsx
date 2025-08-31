import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuizPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(5 * 60); // 5 minutes

  const answersRef = useRef([]);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/questions?languages=${state.languages.join(",")}`
    )
      .then((res) => res.json())
      .then(setQuestions);
  }, [state.languages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitTest(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questions]);

  const selectAnswer = (option) => {
    const newAnswers = [...answers];
    newAnswers[index] = option;
    setAnswers(newAnswers);
    answersRef.current = newAnswers;
  };

  const submitTest = (auto = false) => {
    let score = 0;
    const latestAnswers = answersRef.current;
    questions.forEach((q, i) => {
      if (latestAnswers[i] === q.correctAnswer) score++;
    });

    if (auto) {
      alert("Time's up! Submitting your test...");
    }

    navigate("/result", { state: { score } });
  };

  if (questions.length === 0) return <p className="text-center mt-10">Loading...</p>;

  const q = questions[index];
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Time: <span className="text-blue-600">{minutes}:{seconds.toString().padStart(2, "0")}</span>
          </h2>
          <button
            onClick={() => submitTest(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all duration-300 cursor-pointer"
          >
            Submit Test
          </button>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Q{index + 1}: {q.question}
        </h3>

        <div className="space-y-3">
          {q.options.map((opt) => (
            <div
              key={opt}
              className={`border rounded-lg px-4 py-2 transition-all duration-200 cursor-pointer ${
                answers[index] === opt
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-blue-100 border-gray-300"
              }`}
              onClick={() => selectAnswer(opt)}
            >
              {opt}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
            className={`px-6 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
              index === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>
          <button
            disabled={index === questions.length - 1}
            onClick={() => setIndex(index + 1)}
            className={`px-6 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
              index === questions.length - 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
