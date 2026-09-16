const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Resume upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }
});

// Allow only PDF, DOC and DOCX files
const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, DOC and DOCX files are allowed."));
        }
    }
});


// Get questions
app.get("/api/questions", (req, res) => {

    try {

        const filePath = path.join(
            __dirname,
            "data",
            "questions.json"
        );

        const questions = JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );

        res.json(questions);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to load questions."
        });
    }
});


// Resume upload
app.post("/api/upload-resume", upload.single("resume"), (req, res) => {

    if (!req.file) {

        return res.status(400).json({
            success: false,
            message: "Please select a resume."
        });
    }

    res.json({
        success: true,
        message: "Resume uploaded successfully!",
        fileName: req.file.filename
    });
});


// Handle upload errors
app.use((error, req, res, next) => {

    if (error instanceof multer.MulterError) {

        if (error.code === "LIMIT_FILE_SIZE") {

            return res.status(400).json({
                success: false,
                message: "Resume must be less than 5 MB."
            });
        }
    }

    if (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    next();
});


// Start server
app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});