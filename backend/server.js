// backend/server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const questions = require("./questions");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// File Upload Setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const isValid = allowedTypes.test(file.originalname.toLowerCase());
    cb(null, isValid);
    //--> if we want to do error handling while uploading the file
    //  if (isValid) {
    //   cb(null, true);
    // } else {
    //   cb(new Error("Only .pdf, .doc, and .docx files are allowed!"));
    // }
  },
});

app.get("/api/questions", (req, res) => {
  const { languages } = req.query;
  const selected = languages.split(",");
  const allQuestions = [];

  selected.forEach((lang) => {
    if (questions[lang]) {
      allQuestions.push(...questions[lang].slice(0, 5)); // pick 5 per language
    }
  });

  const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
  res.json(shuffled);
});

app.post("/api/upload", upload.single("resume"), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: "error No file uploaded." });
    }
  res.status(200).json({ message: "Resume uploaded successfully" });
});

//-->if doing error handling during file upload process

// app.post("/api/upload", (req, res) => {
//   upload.single("resume")(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       // Multer-specific errors (e.g., file too large)
//       return res.status(400).json({ message: err.message });
//     } else if (err) {
//       // Other errors (e.g., wrong file type)
//       return res.status(400).json({ message: err.message });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     // Success
//     res.status(200).json({ message: "Resume uploaded successfully" });
//   });
// });


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
