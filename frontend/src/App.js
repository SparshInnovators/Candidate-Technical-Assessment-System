import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LanguageSelection from "./pages/LanguageSelection";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LanguageSelection />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

