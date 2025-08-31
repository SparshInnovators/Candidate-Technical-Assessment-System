const container = document.getElementById("questionContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const timeEl = document.getElementById("time");
const progressBar = document.getElementById("progressBar");

let questions = JSON.parse(sessionStorage.getItem("quizQuestions") || "[]");
let index = Number(sessionStorage.getItem("currentIndex")) || 0;
let answers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
let timer;
let timeLeft = 30; // seconds per question

function startTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timeEl.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if(timeLeft <=0) {
      saveAnswer();
      nextQuestion();
    }
  }, 1000);
}

function showQuestion() {
  if(index < 0) index = 0;
  if(index >= questions.length) index = questions.length -1;

  const q = questions[index];
  let html = `<p>${q.question}</p>`;
  q.options.forEach((opt,i)=>{
    const checked = answers[q.id]==i ? "checked" : "";
    html += `<label><input type="radio" name="q" value="${i}" ${checked}> ${opt}</label><br>`;
  });
  container.innerHTML = html;
  updateProgress();
  startTimer();
  saveProgress();
}

function saveAnswer() {
  const selected = document.querySelector('input[name="q"]:checked');
  if(selected) answers[questions[index].id] = selected.value;
  saveProgress();
}

function nextQuestion() {
  saveAnswer();
  if(index === questions.length -1){
    submitQuiz();
  } else {
    index++;
    showQuestion();
  }
}

function prevQuestion() {
  saveAnswer();
  index--;
  showQuestion();
}

function updateProgress() {
  const percent = ((index)/questions.length)*100;
  progressBar.style.width = percent + "%";
}

function submitQuiz() {
  clearInterval(timer);
  fetch("/submit-quiz",{
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ responses: answers })
  })
  .then(r=>r.json())
  .then(()=> {
    // Clear sessionStorage on submit
    sessionStorage.removeItem("quizQuestions");
    sessionStorage.removeItem("quizAnswers");
    sessionStorage.removeItem("currentIndex");
    window.location.href="result.html";
  });
}

// Partial progress save
function saveProgress() {
  sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
  sessionStorage.setItem("currentIndex", index);
}

nextBtn.onclick = nextQuestion;
prevBtn.onclick = prevQuestion;

showQuestion();
