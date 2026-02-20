import { databases } from './appwrite.js';
import { ID } from 'node-appwrite';

const DATABASE_ID = 'assessment_db';
const COLLECTION_ID = 'questions';

const questionBank = {
    JavaScript: [
        { questionText: 'What is the output of: console.log(typeof typeof 1)?', options: ['number', 'string', 'undefined', 'object'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'Which method removes the last element from an array?', options: ['shift()', 'pop()', 'splice()', 'slice()'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What does "===" operator check?', options: ['Value only', 'Type only', 'Value and type', 'Reference'], correctAnswer: 2, difficulty: 'easy' },
        { questionText: 'What is a closure in JavaScript?', options: ['A built-in method', 'A function with access to its outer scope', 'A type of loop', 'An error handler'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'function', 'declare'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What does Array.prototype.map() return?', options: ['undefined', 'The original array', 'A new array', 'A boolean'], correctAnswer: 2, difficulty: 'easy' },
        { questionText: 'What is event bubbling?', options: ['Events propagate from child to parent', 'Events propagate from parent to child', 'Events stop at the target', 'Events are queued'], correctAnswer: 0, difficulty: 'medium' },
        { questionText: 'What is the purpose of Promise.all()?', options: ['Run promises sequentially', 'Wait for all promises to resolve', 'Cancel all promises', 'Create a new promise'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What does "use strict" do?', options: ['Enables strict type checking', 'Enables strict mode for catching common errors', 'Makes code run faster', 'Disables console.log'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'Which method converts a JSON string to a JavaScript object?', options: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.decode()'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is the output of: console.log(0.1 + 0.2 === 0.3)?', options: ['true', 'false', 'undefined', 'NaN'], correctAnswer: 1, difficulty: 'hard' },
        { questionText: 'What is the temporal dead zone?', options: ['A zone where var is undefined', 'Period between entering scope and let/const declaration', 'A memory leak', 'A deprecated feature'], correctAnswer: 1, difficulty: 'hard' },
    ],

    Python: [
        { questionText: 'What is the difference between a list and a tuple?', options: ['Lists are immutable, tuples are mutable', 'Lists are mutable, tuples are immutable', 'No difference', 'Tuples cannot store strings'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What does the "self" keyword refer to in a class?', options: ['The class itself', 'The current instance', 'The parent class', 'A global variable'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'Which method is used to add an element to a list?', options: ['add()', 'insert()', 'append()', 'push()'], correctAnswer: 2, difficulty: 'easy' },
        { questionText: 'What is a decorator in Python?', options: ['A comment style', 'A function that modifies another function', 'A type of class', 'A loop construct'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What does "**kwargs" mean in a function definition?', options: ['Keyword arguments as a dictionary', 'Positional arguments', 'A syntax error', 'A pointer to arguments'], correctAnswer: 0, difficulty: 'medium' },
        { questionText: 'What is a list comprehension?', options: ['A way to understand lists', 'A concise way to create lists', 'A debugging tool', 'A sorting method'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is the output of: print(type([]))?', options: ['<class \'list\'>', '<class \'array\'>', '<class \'tuple\'>', 'list'], correctAnswer: 0, difficulty: 'easy' },
        { questionText: 'Which keyword is used for exception handling?', options: ['catch', 'except', 'handle', 'error'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What does the __init__ method do?', options: ['Initializes the class', 'Destroys the object', 'Imports modules', 'It is a static method'], correctAnswer: 0, difficulty: 'easy' },
        { questionText: 'What is the GIL in Python?', options: ['Global Interface Layer', 'Global Interpreter Lock', 'General Input Library', 'Generic Iteration Loop'], correctAnswer: 1, difficulty: 'hard' },
        { questionText: 'What is the difference between "is" and "=="?', options: ['No difference', '"is" checks identity, "==" checks equality', '"is" is faster', '"==" checks identity'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What does the "yield" keyword do?', options: ['Stops the function permanently', 'Returns a value and pauses the generator', 'Creates a new thread', 'Imports a module'], correctAnswer: 1, difficulty: 'hard' },
    ],

    Java: [
        { questionText: 'What is the entry point of a Java program?', options: ['start()', 'main()', 'init()', 'run()'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'Which keyword is used to inherit a class?', options: ['implements', 'extends', 'inherits', 'using'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is the difference between "==" and ".equals()"?', options: ['No difference', '"==" compares references, ".equals()" compares values', '"==" is for primitives only', '".equals()" is faster'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What is encapsulation?', options: ['Hiding implementation details', 'Inheriting from multiple classes', 'A type of loop', 'Compiling code'], correctAnswer: 0, difficulty: 'easy' },
        { questionText: 'Which collection does not allow duplicate elements?', options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'], correctAnswer: 2, difficulty: 'medium' },
        { questionText: 'What is the purpose of the "final" keyword?', options: ['Makes a class abstract', 'Prevents modification/inheritance', 'Creates a constant', 'Both B and C'], correctAnswer: 3, difficulty: 'medium' },
        { questionText: 'What is an interface in Java?', options: ['A type of class', 'A contract that classes must follow', 'A design pattern', 'A Java library'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is the default value of a boolean in Java?', options: ['true', 'false', 'null', '0'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is method overloading?', options: ['Same method name, different parameters', 'Same method name, same parameters', 'Overriding parent methods', 'A compiler error'], correctAnswer: 0, difficulty: 'medium' },
        { questionText: 'What does the "static" keyword mean?', options: ['The member belongs to the class, not instances', 'The member cannot change', 'The member is private', 'The method runs first'], correctAnswer: 0, difficulty: 'medium' },
        { questionText: 'What is a NullPointerException?', options: ['A compile error', 'Thrown when accessing a member of a null reference', 'A checked exception', 'An arithmetic error'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is garbage collection in Java?', options: ['Deleting unused files', 'Automatic memory management', 'Removing syntax errors', 'Clearing the console'], correctAnswer: 1, difficulty: 'medium' },
    ],

    'C++': [
        { questionText: 'What is a pointer in C++?', options: ['A variable storing a memory address', 'A type of loop', 'A function', 'A class method'], correctAnswer: 0, difficulty: 'easy' },
        { questionText: 'What does "cout" do?', options: ['Reads input', 'Writes output to console', 'Creates a file', 'Allocates memory'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is the difference between struct and class in C++?', options: ['No difference', 'Struct has public defaults, class has private', 'Struct cannot have methods', 'Class cannot be inherited'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What is RAII?', options: ['Resource Acquisition Is Initialization', 'Random Access Input Interface', 'Runtime Application Instruction Index', 'Register Allocation In Implementation'], correctAnswer: 0, difficulty: 'hard' },
        { questionText: 'Which operator is used for dynamic memory allocation?', options: ['malloc', 'new', 'alloc', 'create'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is a virtual function?', options: ['A function that does not exist', 'A function that can be overridden in derived classes', 'A static function', 'An inline function'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What does the "const" keyword do?', options: ['Makes a variable changeable', 'Makes a variable read-only', 'Deletes a variable', 'Creates a new scope'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is operator overloading?', options: ['Using operators with extra operands', 'Defining custom behavior for operators', 'A compiler error', 'Using multiple operators at once'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What is the STL?', options: ['Standard Testing Library', 'Standard Template Library', 'System Thread Library', 'Static Type Loader'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is the purpose of a destructor?', options: ['Initialize objects', 'Clean up resources when an object is destroyed', 'Create copies of objects', 'Allocate memory'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What is a reference in C++?', options: ['A copy of a variable', 'An alias for another variable', 'A pointer', 'A constant'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is the diamond problem?', options: ['A compiler optimization', 'Ambiguity in multiple inheritance', 'A memory leak', 'A syntax error'], correctAnswer: 1, difficulty: 'hard' },
    ],

    TypeScript: [
        { questionText: 'What is TypeScript?', options: ['A new programming language', 'A typed superset of JavaScript', 'A JavaScript framework', 'A CSS preprocessor'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is the "any" type used for?', options: ['Only for numbers', 'To opt out of type checking', 'To create classes', 'To import modules'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is an interface in TypeScript?', options: ['A class implementation', 'A contract defining object shapes', 'A function', 'A module'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What does "readonly" modifier do?', options: ['Makes property writable', 'Makes property read-only after initialization', 'Deletes the property', 'Makes it private'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is a union type?', options: ['A type that can be one of several types', 'A single type', 'A class', 'An error type'], correctAnswer: 0, difficulty: 'medium' },
        { questionText: 'What is the "never" type?', options: ['A type for null values', 'A type representing values that never occur', 'Same as void', 'Same as undefined'], correctAnswer: 1, difficulty: 'hard' },
        { questionText: 'What are generics in TypeScript?', options: ['General-purpose functions', 'Reusable components that work with multiple types', 'Global variables', 'A testing framework'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What is type inference?', options: ['Manually specifying types', 'TypeScript automatically determining types', 'A runtime check', 'An error handling method'], correctAnswer: 1, difficulty: 'easy' },
        { questionText: 'What is an enum in TypeScript?', options: ['A named set of numeric or string constants', 'A type of array', 'A class method', 'A loop structure'], correctAnswer: 0, difficulty: 'easy' },
        { questionText: 'What is the difference between "type" and "interface"?', options: ['No difference', 'Types support unions, interfaces support declaration merging', 'Types are faster', 'Interfaces cannot extend'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What is a type guard?', options: ['A security feature', 'A runtime check that narrows a type', 'A compile-time error', 'A class decorator'], correctAnswer: 1, difficulty: 'medium' },
        { questionText: 'What does "as const" do?', options: ['Creates a constant variable', 'Makes values literal types', 'Converts to a class', 'Imports a constant'], correctAnswer: 1, difficulty: 'hard' },
    ],
};

async function seed() {
    console.log('\n🌱 Seeding question bank...\n');

    let totalCreated = 0;

    for (const [language, questions] of Object.entries(questionBank)) {
        let count = 0;
        for (const q of questions) {
            try {
                await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    language,
                    difficulty: q.difficulty,
                });
                count++;
            } catch (err) {
                if (err.code === 409) {
                    console.log(`  • Skipping duplicate: "${q.questionText.slice(0, 50)}..."`);
                } else {
                    console.error(`  ✗ Failed to create question: ${err.message}`);
                }
            }
        }
        console.log(`✓ ${language}: ${count} questions seeded`);
        totalCreated += count;
    }

    console.log(`\n✅ Seeding complete! ${totalCreated} questions created.\n`);
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
});
