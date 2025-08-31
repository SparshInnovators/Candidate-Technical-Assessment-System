document.getElementById("langForm").onsubmit = async (e) => {
  e.preventDefault();
  const langs = Array.from(document.querySelectorAll('input[name="lang"]:checked')).map(el => el.value);
  if(langs.length === 0) return alert("Select at least one language");

  const res = await fetch("/start-quiz", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ languages: langs })
  });
  const data = await res.json();
  sessionStorage.setItem("quizQuestions", JSON.stringify(data.questions));
  window.location.href = "quiz.html";
};
