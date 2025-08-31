const scoreEl = document.getElementById("score");
const resumeSection = document.getElementById("resumeSection");
const uploadBtn = document.getElementById("uploadBtn");
const resumeFile = document.getElementById("resumeFile");
const uploadMsg = document.getElementById("uploadMsg");

fetch("/api/result")
.then(r=>r.json())
.then(data=>{
  scoreEl.textContent = `Score: ${data.scorePercent}% (${data.correct}/${data.total})`;
  if(data.passed) resumeSection.style.display="block";
  else scoreEl.textContent += " — Try again later!";
});

uploadBtn.onclick = () => {
  const file = resumeFile.files[0];
  if(!file) return alert("Select a file!");
  const allowed = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if(!allowed.includes(file.type)) return alert("File type not allowed");

  const form = new FormData();
  form.append("resume", file);

  fetch("/api/upload",{method:"POST", body:form})
  .then(r=>r.json())
  .then(d=>uploadMsg.textContent = d.message);
}
