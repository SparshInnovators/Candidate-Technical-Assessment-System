// backend/questions.js
const questions = {
  JavaScript: [
    {
      question: "What is the output of: console.log(typeof typeof 1)?",
      options: ["number", "string", "undefined", "object"],
      correctAnswer: "string",
    },
    {
      question: "What is a closure?",
      options: ["Function with scope", "Variable", "Loop", "Object"],
      correctAnswer: "Function with scope",
    },
    {
      question: "Which method converts JSON data to a JavaScript object?",
      options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "parse.JSON()"],
      correctAnswer: "JSON.parse()",
    },
    {
      question: "What is the result of '2' + 2 in JavaScript?",
      options: ["4", "22", "NaN", "undefined"],
      correctAnswer: "22",
    },
    {
      question: "Which keyword is used to declare a constant in JavaScript?",
      options: ["var", "let", "const", "define"],
      correctAnswer: "const",
    },
  ],
  Python: [
    {
      question: "What is the output of print(2**3)?",
      options: ["6", "8", "9", "Error"],
      correctAnswer: "8",
    },
    {
      question: "Which keyword is used to define a function in Python?",
      options: ["function", "def", "func", "lambda"],
      correctAnswer: "def",
    },
    {
      question: "What is the correct file extension for Python files?",
      options: [".pt", ".pyt", ".py", ".python"],
      correctAnswer: ".py",
    },
    {
      question: "How do you insert COMMENTS in Python code?",
      options: ["// this is a comment", "# this is a comment", "/* this is a comment */", "-- this is a comment"],
      correctAnswer: "# this is a comment",
    },
    {
      question: "What data type is the result of: 3 / 2 in Python 3?",
      options: ["int", "float", "str", "bool"],
      correctAnswer: "float",
    },
  ],
  Java: [
    {
      question: "Which keyword is used to inherit a class in Java?",
      options: ["this", "super", "extends", "implements"],
      correctAnswer: "extends",
    },
    {
      question: "What is the size of an int in Java?",
      options: ["2 bytes", "4 bytes", "8 bytes", "Depends on system"],
      correctAnswer: "4 bytes",
    },
    {
      question: "Which method is the entry point of any Java program?",
      options: ["start()", "run()", "main()", "init()"],
      correctAnswer: "main()",
    },
    {
      question: "Which of these is not a Java keyword?",
      options: ["class", "interface", "extends", "include"],
      correctAnswer: "include",
    },
    {
      question: "What is the default value of a boolean in Java?",
      options: ["true", "false", "0", "null"],
      correctAnswer: "false",
    },
  ],
  Cpp: [
    {
      question: "Which of these is used to declare a class in C++?",
      options: ["function", "class", "method", "def"],
      correctAnswer: "class",
    },
    {
      question: "Which symbol is used to declare a pointer in C++?",
      options: ["&", "*", "#", "%"],
      correctAnswer: "*",
    },
    {
      question: "Which of the following is the correct syntax to read an integer from user in C++?",
      options: ["cin << x;", "input >> x;", "cin >> x;", "read >> x;"],
      correctAnswer: "cin >> x;",
    },
    {
      question: "Which operator is overloaded for output in C++?",
      options: ["<<", ">>", "->", "+"],
      correctAnswer: "<<",
    },
    {
      question: "What is the extension of a C++ source file?",
      options: [".cpp", ".c", ".class", ".java"],
      correctAnswer: ".cpp",
    },
  ],
  SQL: [
    {
      question: "Which command is used to retrieve data?",
      options: ["SELECT", "INSERT", "DELETE", "UPDATE"],
      correctAnswer: "SELECT",
    },
    {
      question: "Which SQL statement is used to update data in a database?",
      options: ["UPDATE", "MODIFY", "CHANGE", "ALTER"],
      correctAnswer: "UPDATE",
    },
    {
      question: "What does the WHERE clause do in SQL?",
      options: ["Limits rows returned", "Sorts rows", "Deletes columns", "Creates tables"],
      correctAnswer: "Limits rows returned",
    },
    {
      question: "Which SQL command is used to create a new table?",
      options: ["INSERT TABLE", "NEW TABLE", "CREATE TABLE", "MAKE TABLE"],
      correctAnswer: "CREATE TABLE",
    },
    {
      question: "Which keyword is used to sort the result-set in SQL?",
      options: ["ORDER BY", "GROUP BY", "SORT", "ARRANGE BY"],
      correctAnswer: "ORDER BY",
    },
  ],
};

module.exports = questions;
