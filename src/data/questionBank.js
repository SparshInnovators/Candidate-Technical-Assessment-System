export const AVAILABLE_LANGUAGES = [
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Web & Fullstack',
    iconName: 'Code2',
    badgeColor: 'amber',
    description: 'Modern ES6+, Event Loop, Closures, Asynchronous JS, and Prototype Chains.',
    popularTopics: ['Event Loop', 'Closures', 'Promises', 'Prototypes', 'Type Coercion']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Web & Fullstack',
    iconName: 'FileCode2',
    badgeColor: 'blue',
    description: 'Static Typing, Generics, Utility Types, Type Narrowing, and Interfaces.',
    popularTopics: ['Generics', 'Utility Types', 'Type Narrowing', 'Keyof & typeof']
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Backend & Data',
    iconName: 'Terminal',
    badgeColor: 'emerald',
    description: 'Data structures, Decorators, Generators, Memory Model, and Pythonic Idioms.',
    popularTopics: ['Decorators', 'Generators', 'GIL', 'List/Dict Comprehension']
  },
  {
    id: 'java',
    name: 'Java',
    category: 'Enterprise & Systems',
    iconName: 'Coffee',
    badgeColor: 'orange',
    description: 'OOP Principles, JVM Architecture, Collections Framework, and Multithreading.',
    popularTopics: ['JVM & GC', 'Collections', 'Polymorphism', 'Concurreny']
  },
  {
    id: 'cpp',
    name: 'C++',
    category: 'Systems & Performance',
    iconName: 'Cpu',
    badgeColor: 'indigo',
    description: 'Pointers & References, Memory Management, RAII, Smart Pointers, and Templates.',
    popularTopics: ['Smart Pointers', 'RAII', 'Virtual Functions', 'Move Semantics']
  },
  {
    id: 'go',
    name: 'Go (Golang)',
    category: 'Cloud & Infrastructure',
    iconName: 'Server',
    badgeColor: 'cyan',
    description: 'Goroutines, Channels, Slices, Structs, Interfaces, and Concurrency patterns.',
    popularTopics: ['Goroutines', 'Channels', 'Defer', 'Interfaces']
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'Systems & Safety',
    iconName: 'ShieldAlert',
    badgeColor: 'rose',
    description: 'Ownership, Borrow Checker, Lifetimes, Pattern Matching, and Error Handling.',
    popularTopics: ['Borrow Checker', 'Lifetimes', 'Option & Result', 'Traits']
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'Database & Data',
    iconName: 'Database',
    badgeColor: 'purple',
    description: 'Relational Queries, Joins, Aggregations, Window Functions, and Indexing.',
    popularTopics: ['Joins', 'Aggregations', 'Indexes', 'ACID Transactions']
  }
];

export const QUESTION_BANK = [
  // ==================== JAVASCRIPT ====================
  {
    id: 'js-1',
    language: 'JavaScript',
    category: 'Type Coercion',
    difficulty: 'Easy',
    question: 'What will be printed to the console?',
    codeSnippet: 'console.log(typeof typeof 1);',
    options: ['"number"', '"string"', '"undefined"', '"object"'],
    correctAnswer: 1,
    explanation: '`typeof 1` evaluates to `"number"` (a string). Then `typeof "number"` evaluates to `"string"`.'
  },
  {
    id: 'js-2',
    language: 'JavaScript',
    category: 'Closures & Scopes',
    difficulty: 'Medium',
    question: 'What is the output of the following loop with `setTimeout`?',
    codeSnippet: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 10);\n}',
    options: ['0, 1, 2', '3, 3, 3', 'undefined, undefined, undefined', '0, 0, 0'],
    correctAnswer: 1,
    explanation: 'Because `var` is function-scoped rather than block-scoped, all timeouts share the exact same `i` variable which is incremented to 3 by the time the timer callbacks execute.'
  },
  {
    id: 'js-3',
    language: 'JavaScript',
    category: 'Event Loop',
    difficulty: 'Hard',
    question: 'In what order will the log statements print?',
    codeSnippet: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");',
    options: ['A -> B -> C -> D', 'A -> D -> B -> C', 'A -> D -> C -> B', 'A -> C -> D -> B'],
    correctAnswer: 2,
    explanation: 'Synchronous code runs first ("A", "D"). Next, the microtask queue (`Promise.then` -> "C") executes before macrotasks (`setTimeout` -> "B").'
  },
  {
    id: 'js-4',
    language: 'JavaScript',
    category: 'Objects & References',
    difficulty: 'Medium',
    question: 'What does the following comparison return?',
    codeSnippet: 'const a = { x: 1 };\nconst b = { x: 1 };\nconsole.log(a == b, a === b);',
    options: ['true, true', 'true, false', 'false, false', 'false, true'],
    correctAnswer: 2,
    explanation: 'In JavaScript, objects are compared by reference identity, not structural content. Since `a` and `b` point to two distinct memory allocations, both `==` and `===` return `false`.'
  },
  {
    id: 'js-5',
    language: 'JavaScript',
    category: 'Prototypes & Functions',
    difficulty: 'Easy',
    question: 'What does `Array.prototype.map()` return?',
    options: [
      'The original array mutated with changes',
      'A new array containing the transformed elements',
      'The length of the modified array',
      'A boolean indicating if transformation succeeded'
    ],
    correctAnswer: 1,
    explanation: '`map()` creates a brand new array populated with the results of calling the provided callback function on every element of the calling array without mutating the original.'
  },
  {
    id: 'js-6',
    language: 'JavaScript',
    category: 'Modern ES6+',
    difficulty: 'Easy',
    question: 'What is the value of `result` after executing the destructuring statement?',
    codeSnippet: 'const { a, b = 10, ...rest } = { a: 5, c: 20, d: 30 };\nconst result = [a, b, Object.keys(rest).length];',
    options: ['[5, 10, 2]', '[5, undefined, 2]', '[5, 10, 3]', '[5, null, 2]'],
    correctAnswer: 0,
    explanation: '`a` is 5, `b` is assigned default value 10 because `b` is undefined in the source object, and `rest` holds `{ c: 20, d: 30 }` which has 2 keys.'
  },
  {
    id: 'js-7',
    language: 'JavaScript',
    category: 'Asynchronous JS',
    difficulty: 'Medium',
    question: 'What is the value resolved by `Promise.all` when one promise rejects?',
    options: [
      'An array with null for rejected items',
      'It immediately rejects with the reason of the first rejected promise',
      'It waits for all promises to settle and returns both results and errors',
      'It retries the failed promise once'
    ],
    correctAnswer: 1,
    explanation: '`Promise.all` employs fail-fast behavior: if any promise in the iterable rejects, the whole returned promise immediately rejects with that rejection reason.'
  },
  {
    id: 'js-8',
    language: 'JavaScript',
    category: 'Coercion & Equality',
    difficulty: 'Hard',
    question: 'What is the output of `[] + {}` versus `{} + []` in standard JavaScript expression evaluation?',
    options: [
      '"[object Object]" and "[object Object]" (or 0 depending on parser context)',
      '0 and 0',
      'undefined and null',
      'TypeError: invalid operand conversion'
    ],
    correctAnswer: 0,
    explanation: '`[] + {}` converts `[]` to `""` and `{}` to `"[object Object]"`, yielding `"[object Object]"`. In expression position, `{} + []` evaluates to `"[object Object]"` (or 0 if `{}` is parsed as an empty block).'
  },
  {
    id: 'js-9',
    language: 'JavaScript',
    category: 'Functions & `this`',
    difficulty: 'Medium',
    question: 'How do arrow functions handle the `this` binding?',
    options: [
      'They dynamically bind `this` to the invoking object',
      'They capture `this` lexically from the enclosing scope',
      'They always bind `this` to `window` or `global`',
      '`this` is always `undefined` in arrow functions'
    ],
    correctAnswer: 1,
    explanation: 'Arrow functions do not possess their own `this` context. Instead, they lexically inherit `this` from the enclosing execution context.'
  },
  {
    id: 'js-10',
    language: 'JavaScript',
    category: 'Memory & References',
    difficulty: 'Hard',
    question: 'Which method creates a true deep clone of an object including nested objects, dates, and arrays (excluding functions)?',
    options: [
      'Object.assign({}, target)',
      '{ ...target } (Spread operator)',
      'structuredClone(target)',
      'target.slice(0)'
    ],
    correctAnswer: 2,
    explanation: '`structuredClone()` is the native modern web API that performs deep structural cloning. `Object.assign` and spread only perform shallow copies.'
  },

  // ==================== TYPESCRIPT ====================
  {
    id: 'ts-1',
    language: 'TypeScript',
    category: 'Type System',
    difficulty: 'Easy',
    question: 'What is the key difference between the `any` type and the `unknown` type in TypeScript?',
    options: [
      '`any` is type-safe; `unknown` turns off all type checking',
      '`unknown` is type-safe; you cannot perform arbitrary operations on it without type narrowing',
      '`unknown` can only hold primitive numbers and strings',
      'There is no functional difference; they are aliases'
    ],
    correctAnswer: 1,
    explanation: '`unknown` is the type-safe counterpart of `any`. Anything is assignable to `unknown`, but `unknown` cannot be assigned to anything (except `any` and `unknown`) without a type assertion or narrowing check.'
  },
  {
    id: 'ts-2',
    language: 'TypeScript',
    category: 'Utility Types',
    difficulty: 'Medium',
    question: 'Which built-in utility type constructs a type with all properties of `T` set to optional?',
    codeSnippet: 'interface User {\n  id: string;\n  name: string;\n  email: string;\n}\ntype OptionalUser = ???<User>;',
    options: ['Omit<User, any>', 'Partial<User>', 'Readonly<User>', 'Nullable<User>'],
    correctAnswer: 1,
    explanation: '`Partial<T>` makes all properties of `T` optional by adding `?` modifier to each property.'
  },
  {
    id: 'ts-3',
    language: 'TypeScript',
    category: 'Generics & Constraints',
    difficulty: 'Medium',
    question: 'How do you constrain a generic type parameter `T` to ensure it has a `length: number` property?',
    options: [
      'function logLength<T is { length: number }>(arg: T)',
      'function logLength<T implements { length: number }>(arg: T)',
      'function logLength<T extends { length: number }>(arg: T)',
      'function logLength<T where length == number>(arg: T)'
    ],
    correctAnswer: 2,
    explanation: 'In TypeScript generics, the `extends` keyword is used to enforce interface constraints on type parameters.'
  },
  {
    id: 'ts-4',
    language: 'TypeScript',
    category: 'Type Narrowing',
    difficulty: 'Hard',
    question: 'What is the purpose of a Custom Type Guard function in TypeScript?',
    codeSnippet: 'function isFish(pet: Fish | Bird): pet is Fish {\n  return (pet as Fish).swim !== undefined;\n}',
    options: [
      'It converts a Bird object into a Fish object at runtime',
      'It instructs the TypeScript compiler to narrow `pet` to `Fish` in blocks where this returns true',
      'It throws a runtime error if `pet` is a Bird',
      'It automatically mocks test data for `Fish`'
    ],
    correctAnswer: 1,
    explanation: 'A type predicate signature `pet is Fish` informs the compiler that if the function returns true, the variable in that scope is strictly typed as `Fish`.'
  },
  {
    id: 'ts-5',
    language: 'TypeScript',
    category: 'Mapped & Conditional Types',
    difficulty: 'Hard',
    question: 'What will `type Result` resolve to in this conditional type?',
    codeSnippet: 'type Flatten<T> = T extends Array<infer Item> ? Item : T;\ntype Result = Flatten<string[]>;',
    options: ['Array<string>', 'string', 'string | undefined', 'unknown'],
    correctAnswer: 1,
    explanation: 'The `infer` keyword inside conditional types extracts the inner type `Item` of the array, so `Flatten<string[]>` evaluates to `string`.'
  },
  {
    id: 'ts-6',
    language: 'TypeScript',
    category: 'Interfaces vs Types',
    difficulty: 'Easy',
    question: 'Which TypeScript feature allows declaration merging (re-opening and adding properties)?',
    options: ['interface', 'type alias', 'enum', 'abstract class'],
    correctAnswer: 0,
    explanation: 'Multiple `interface` declarations with the same name in the same scope are automatically merged by TypeScript, whereas `type` aliases cannot be re-declared.'
  },
  {
    id: 'ts-7',
    language: 'TypeScript',
    category: 'Keywords & Operators',
    difficulty: 'Medium',
    question: 'What does the `keyof` operator return when applied to an object type?',
    codeSnippet: 'interface Car { brand: string; speed: number; }\ntype CarKeys = keyof Car;',
    options: [
      'An array of strings `["brand", "speed"]` at runtime',
      'A union of string literal types: `"brand" | "speed"`',
      'A boolean indicating if keys exist',
      'The number 2'
    ],
    correctAnswer: 1,
    explanation: '`keyof` produces a compile-time union of string or numeric literal keys of the given type.'
  },
  {
    id: 'ts-8',
    language: 'TypeScript',
    category: 'Literal Types',
    difficulty: 'Easy',
    question: 'What happens when using the `as const` assertion on an object literal?',
    codeSnippet: 'const config = { role: "admin", level: 1 } as const;',
    options: [
      'It locks the object at runtime and prevents garbage collection',
      'All properties become `readonly` and have narrow literal types rather than widened types like `string` and `number`',
      'It encrypts object values',
      'It converts the object into a JSON string'
    ],
    correctAnswer: 1,
    explanation: '`as const` creates a compile-time deeply readonly object where string/number fields retain their exact literal types (`"admin"` and `1`) rather than widening to `string` and `number`.'
  },
  {
    id: 'ts-9',
    language: 'TypeScript',
    category: 'Utility Types',
    difficulty: 'Medium',
    question: 'Which utility type constructs a type by picking a set of properties `Keys` from `Type`?',
    options: ['Extract<Type, Keys>', 'Pick<Type, Keys>', 'Select<Type, Keys>', 'Include<Type, Keys>'],
    correctAnswer: 1,
    explanation: '`Pick<Type, Keys>` creates a new type by selecting the specified keys from `Type`.'
  },
  {
    id: 'ts-10',
    language: 'TypeScript',
    category: 'Never Type',
    difficulty: 'Hard',
    question: 'When is the `never` type primarily used in TypeScript?',
    options: [
      'To represent values that will never occur (e.g. functions that always throw or exhaustiveness checking in switch cases)',
      'As a synonym for `null`',
      'To define optional query parameters',
      'To mark asynchronous callbacks'
    ],
    correctAnswer: 0,
    explanation: '`never` represents the type of values that never occur, such as a function returning an infinite loop or throw, or when narrowing reaches an unreachable branch (exhaustiveness check).'
  },

  // ==================== PYTHON ====================
  {
    id: 'py-1',
    language: 'Python',
    category: 'Data Structures',
    difficulty: 'Easy',
    question: 'What is the primary difference between a Python `list` and a Python `tuple`?',
    options: [
      'Lists are immutable, while tuples are mutable',
      'Lists are mutable, while tuples are immutable',
      'Tuples can only store integers',
      'Lists cannot contain duplicate elements'
    ],
    correctAnswer: 1,
    explanation: 'Lists in Python are mutable (their elements can be added, updated, or removed in-place), whereas tuples are immutable once created.'
  },
  {
    id: 'py-2',
    language: 'Python',
    category: 'Default Arguments',
    difficulty: 'Medium',
    question: 'What will be the output of calling `append_item()` twice?',
    codeSnippet: 'def append_item(val, items=[]):\n    items.append(val)\n    return items\n\nprint(append_item(1))\nprint(append_item(2))',
    options: ['[1] and [2]', '[1] and [1, 2]', '[1] and [[1], 2]', 'Error: mutable argument exception'],
    correctAnswer: 1,
    explanation: 'Default parameter values in Python are evaluated once at function definition time, not at invocation time. Thus, the list `items` is shared across subsequent calls.'
  },
  {
    id: 'py-3',
    language: 'Python',
    category: 'Generators',
    difficulty: 'Medium',
    question: 'What does the `yield` keyword do when used inside a Python function?',
    options: [
      'Terminates the program execution',
      'Converts the function into a generator that produces a sequence of values lazily on demand',
      'Returns a static list of all variables',
      'Forces multithreaded execution of the block'
    ],
    correctAnswer: 1,
    explanation: '`yield` turns a regular function into a generator iterator, pausing execution and sending a value back to the caller while preserving local state for the next call to `next()`.'
  },
  {
    id: 'py-4',
    language: 'Python',
    category: 'Decorators',
    difficulty: 'Hard',
    question: 'What is a Python decorator fundamentally?',
    codeSnippet: '@my_decorator\ndef greet():\n    print("Hello")',
    options: [
      'A function that takes another function as an argument, extends its behavior, and returns a callable',
      'A class constructor only used for GUI styling',
      'A runtime compiler optimization directive',
      'A syntax error in modern Python'
    ],
    correctAnswer: 0,
    explanation: 'A decorator is syntactic sugar for passing a function into another higher-order function: `greet = my_decorator(greet)`.'
  },
  {
    id: 'py-5',
    language: 'Python',
    category: 'Concurrency & GIL',
    difficulty: 'Hard',
    question: 'What is the Global Interpreter Lock (GIL) in CPython?',
    options: [
      'A mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously',
      'A database security firewall for Python web frameworks',
      'A lock that prevents recursive function calls',
      'A mechanism to encrypt memory heaps'
    ],
    correctAnswer: 0,
    explanation: 'CPython’s GIL is a mutex ensuring only one thread runs Python bytecode at any given moment, making CPU-bound multi-threaded programs run sequentially on a single core.'
  },
  {
    id: 'py-6',
    language: 'Python',
    category: 'Comprehensions',
    difficulty: 'Easy',
    question: 'What will be the value of `evens`?',
    codeSnippet: 'evens = [x * 2 for x in range(5) if x % 2 == 0]',
    options: ['[0, 4, 8]', '[0, 2, 4]', '[2, 6]', '[0, 2, 4, 6, 8]'],
    correctAnswer: 0,
    explanation: 'For `x` in `range(5)` (0, 1, 2, 3, 4), the even numbers are 0, 2, 4. Multiplying each by 2 yields `[0, 4, 8]`.'
  },
  {
    id: 'py-7',
    language: 'Python',
    category: 'Functions & Arguments',
    difficulty: 'Easy',
    question: 'What is the difference between `*args` and `**kwargs` in a Python function signature?',
    options: [
      '`*args` receives positional arguments as a tuple; `**kwargs` receives keyword arguments as a dictionary',
      '`*args` receives keywords; `**kwargs` receives numbers only',
      '`*args` is for asynchronous calls; `**kwargs` is for sync calls',
      'There is no difference'
    ],
    correctAnswer: 0,
    explanation: '`*args` collects arbitrary extra positional arguments as a tuple, while `**kwargs` collects arbitrary keyword arguments into a dictionary.'
  },
  {
    id: 'py-8',
    language: 'Python',
    category: 'Memory Management',
    difficulty: 'Medium',
    question: 'How does Python primarily manage memory reclamation for unreachable objects?',
    options: [
      'Manual `free()` calls by the developer',
      'Reference counting supplemented by a cyclic garbage collector',
      'Mark-and-sweep on every variable assignment',
      'Memory is never freed until process exits'
    ],
    correctAnswer: 1,
    explanation: 'Python uses reference counting as its primary memory management strategy, paired with a generational garbage collector to detect and collect circular reference cycles.'
  },
  {
    id: 'py-9',
    language: 'Python',
    category: 'Magic Methods',
    difficulty: 'Medium',
    question: 'Which dunder (double underscore) method is called to produce an unambiguous official string representation of an object (often used for debugging)?',
    options: ['__str__', '__repr__', '__format__', '__init__'],
    correctAnswer: 1,
    explanation: '`__repr__` is intended to return an unambiguous string representation of the object suitable for debugging and logging, whereas `__str__` is for human-readable output.'
  },
  {
    id: 'py-10',
    language: 'Python',
    category: 'Operators & Identity',
    difficulty: 'Easy',
    question: 'What does `is` check compared to `==` in Python?',
    options: [
      '`is` checks memory identity (same object in memory); `==` checks value equality',
      '`is` checks value equality; `==` checks type match',
      'They are identical in all circumstances',
      '`is` is only valid for boolean values'
    ],
    correctAnswer: 0,
    explanation: '`is` checks if two variables reference the exact same memory address (`id(a) == id(b)`), while `==` evaluates value equality via `__eq__`.'
  },

  // ==================== JAVA ====================
  {
    id: 'java-1',
    language: 'Java',
    category: 'Basics & Memory',
    difficulty: 'Easy',
    question: 'Why are String objects immutable in Java?',
    options: [
      'For security, thread safety, and enabling String pool caching',
      'Because Java does not support character arrays',
      'To prevent strings from holding more than 256 characters',
      'It is a compiler bug that was retained for backwards compatibility'
    ],
    correctAnswer: 0,
    explanation: 'String immutability provides thread-safety without synchronization, enables String constant pool sharing for memory efficiency, and ensures security when strings are used as class loading or network connection parameters.'
  },
  {
    id: 'java-2',
    language: 'Java',
    category: 'OOP Principles',
    difficulty: 'Medium',
    question: 'What is the difference between Method Overloading and Method Overriding?',
    options: [
      'Overloading is compile-time polymorphism (same name, different signature); Overriding is runtime polymorphism (same name & signature in subclass)',
      'Overloading occurs across subclasses; Overriding occurs inside the same class only',
      'Overloading requires abstract classes; Overriding requires final classes',
      'There is no difference'
    ],
    correctAnswer: 0,
    explanation: 'Overloading allows multiple methods in the same class to share the same name with different parameter signatures (static binding), while Overriding allows a subclass to provide a specific implementation of a parent class method (dynamic runtime dispatch).'
  },
  {
    id: 'java-3',
    language: 'Java',
    category: 'Keywords',
    difficulty: 'Easy',
    question: 'What does the `final` keyword indicate when applied to a class in Java?',
    codeSnippet: 'public final class Engine { ... }',
    options: [
      'The class cannot be instantiated',
      'The class cannot be subclassed (inherited from)',
      'All methods in the class must be static',
      'The class is automatically executed at JVM startup'
    ],
    correctAnswer: 1,
    explanation: 'A `final` class cannot be extended or inherited by any other class (for instance, `java.lang.String` is a final class).'
  },
  {
    id: 'java-4',
    language: 'Java',
    category: 'Collections Framework',
    difficulty: 'Medium',
    question: 'What is the primary structural difference between `HashMap` and `ConcurrentHashMap`?',
    options: [
      '`ConcurrentHashMap` is thread-safe using lock striping / CAS without locking the whole map, while `HashMap` is not thread-safe',
      '`HashMap` allows concurrent writes from multiple threads safely',
      '`ConcurrentHashMap` does not allow duplicate keys, while `HashMap` does',
      '`HashMap` is only available on Android'
    ],
    correctAnswer: 0,
    explanation: '`HashMap` is non-synchronized and can enter infinite loops or corrupt data under multi-threaded writes. `ConcurrentHashMap` provides fine-grained thread-safe concurrency without synchronizing the entire map.'
  },
  {
    id: 'java-5',
    language: 'Java',
    category: 'JVM & Garbage Collection',
    difficulty: 'Hard',
    question: 'Where are Java object instances allocated in the JVM memory architecture?',
    options: [
      'In the Method Area / Metaspace',
      'On the JVM Heap',
      'On the Thread Call Stack',
      'Inside CPU L1 Cache directly'
    ],
    correctAnswer: 1,
    explanation: 'All object instances in standard Java are allocated on the Heap memory area, which is shared among all threads and managed by the Garbage Collector.'
  },
  {
    id: 'java-6',
    language: 'Java',
    category: 'Equals & HashCode',
    difficulty: 'Medium',
    question: 'What is the contract between `equals()` and `hashCode()` in Java?',
    options: [
      'If `a.equals(b)` is true, then `a.hashCode()` MUST equal `b.hashCode()`',
      'If `a.hashCode() == b.hashCode()`, then `a.equals(b)` MUST be true',
      '`hashCode()` must always return a positive number',
      'They have no relationship to each other'
    ],
    correctAnswer: 0,
    explanation: 'If two objects are equal according to `equals()`, they MUST produce the same `hashCode()`. However, two distinct objects with the same `hashCode()` (hash collision) do not have to be equal.'
  },
  {
    id: 'java-7',
    language: 'Java',
    category: 'Exceptions & Flow',
    difficulty: 'Easy',
    question: 'When will the `finally` block in a `try-catch-finally` structure NOT execute?',
    options: [
      'When an unhandled RuntimeException occurs in try',
      'When `System.exit(0)` is invoked or the JVM crashes',
      'When the try block contains a `return` statement',
      'When catch is omitted'
    ],
    correctAnswer: 1,
    explanation: 'The `finally` block executes even if there is a `return` statement or exception in `try`/`catch`, unless `System.exit()` is explicitly called or catastrophic JVM termination occurs.'
  },
  {
    id: 'java-8',
    language: 'Java',
    category: 'Generics & Type Erasure',
    difficulty: 'Hard',
    question: 'What happens to Java generic type parameters during compilation (Type Erasure)?',
    options: [
      'They are converted into C++ templates at runtime',
      'Generic type information is erased and replaced by type bounds or Object with runtime casts added automatically',
      'Each generic variation creates a separate bytecode class file',
      'The JVM retains reified types for every generic instance'
    ],
    correctAnswer: 1,
    explanation: 'Java implemented generics via Type Erasure for backwards compatibility: compile-time checks are enforced, and type parameters are replaced by their bounds (or Object), removing parameterized types at runtime.'
  },
  {
    id: 'java-9',
    language: 'Java',
    category: 'Concurrency',
    difficulty: 'Hard',
    question: 'What does the `volatile` keyword guarantee for a variable in Java?',
    options: [
      'Atomic execution of composite operations like `i++`',
      'Visibility across threads (reads always fetch from main memory) and instruction reordering prevention (happens-before)',
      'Automatic garbage collection lock',
      'The variable cannot be changed once set'
    ],
    correctAnswer: 1,
    explanation: '`volatile` guarantees that any write to the variable is immediately visible to all other threads (no thread-local CPU cache staleness) and prevents compiler reordering, but it does NOT provide atomicity for compound operations.'
  },
  {
    id: 'java-10',
    language: 'Java',
    category: 'Modern Java (Streams)',
    difficulty: 'Medium',
    question: 'In Java Streams, what is the difference between intermediate and terminal operations?',
    options: [
      'Intermediate operations are lazy and return a new Stream; terminal operations trigger traversal and return a non-stream result or void',
      'Intermediate operations run first synchronously; terminal operations run on a background thread',
      'Terminal operations can be chained indefinitely',
      'There is no distinction'
    ],
    correctAnswer: 0,
    explanation: 'Intermediate operations (e.g. `filter`, `map`) are lazy and produce a pipeline; execution only commences when a terminal operation (e.g. `collect`, `forEach`, `reduce`) is invoked.'
  },

  // ==================== C++ ====================
  {
    id: 'cpp-1',
    language: 'C++',
    category: 'Pointers & References',
    difficulty: 'Easy',
    question: 'What is a fundamental difference between a C++ reference and a pointer?',
    options: [
      'A reference cannot be null and cannot be reseated (rebound) to point to another object after initialization',
      'A reference requires manual memory deallocation using `delete`',
      'Pointers cannot hold memory addresses',
      'References use 64-bit pointers while pointers use 32-bit registers'
    ],
    correctAnswer: 0,
    explanation: 'References act as an alias to an existing object: they must be initialized upon declaration, cannot be null, and cannot be reseated to refer to a different object later.'
  },
  {
    id: 'cpp-2',
    language: 'C++',
    category: 'Memory Management & RAII',
    difficulty: 'Medium',
    question: 'What does RAII (Resource Acquisition Is Initialization) mean in modern C++?',
    options: [
      'Resources are bound to object lifetime; acquired in constructors and released automatically in destructors',
      'All variables must be initialized to zero on program start',
      'Memory must be allocated in the data segment only',
      'Constructors must return an error code'
    ],
    correctAnswer: 0,
    explanation: 'RAII ensures that resources (memory, file handles, mutex locks) are tied to the lifetime of stack-allocated objects, guaranteeing exception-safe cleanup when the object goes out of scope.'
  },
  {
    id: 'cpp-3',
    language: 'C++',
    category: 'Smart Pointers',
    difficulty: 'Medium',
    question: 'Which smart pointer in C++11 represents exclusive ownership of a dynamically allocated resource?',
    options: ['std::shared_ptr', 'std::unique_ptr', 'std::weak_ptr', 'std::auto_ptr'],
    correctAnswer: 1,
    explanation: '`std::unique_ptr` manages a resource with strict exclusive ownership semantics: it cannot be copied, only moved.'
  },
  {
    id: 'cpp-4',
    language: 'C++',
    category: 'Polymorphism & OOP',
    difficulty: 'Hard',
    question: 'Why should a base class with virtual functions always declare a `virtual` destructor?',
    codeSnippet: 'class Base {\npublic:\n    virtual ~Base() = default;\n    virtual void run() = 0;\n};',
    options: [
      'To prevent the compiler from optimizing out function calls',
      'To ensure the derived class destructor is correctly called when deleting an object through a pointer to Base',
      'To speed up dynamic_cast',
      'Virtual destructors are required for template specialization only'
    ],
    correctAnswer: 1,
    explanation: 'Deleting a derived class object through a pointer to a base class without a virtual destructor results in Undefined Behavior and memory leaks because only the base destructor would be invoked.'
  },
  {
    id: 'cpp-5',
    language: 'C++',
    category: 'Move Semantics',
    difficulty: 'Hard',
    question: 'What does `std::move(x)` actually do in C++11?',
    options: [
      'It physically moves the bits of `x` to another memory block',
      'It performs an unconditional static cast of `x` to an rvalue reference (`T&&`), enabling move constructors to be called',
      'It deletes the original object `x` immediately',
      'It allocates a new heap buffer'
    ],
    correctAnswer: 1,
    explanation: '`std::move` does not move any memory itself; it is simply a compile-time cast that turns an lvalue into an rvalue reference, signaling to the compiler that the resource may be pilfered/moved from.'
  },
  {
    id: 'cpp-6',
    language: 'C++',
    category: 'Memory Allocation',
    difficulty: 'Easy',
    question: 'What is the key difference between `malloc()` and the `new` operator in C++?',
    options: [
      '`new` calls constructors and is type-safe; `malloc()` only allocates raw bytes without calling constructors',
      '`malloc()` returns a reference; `new` returns a void pointer',
      '`new` allocates in stack memory; `malloc()` in register memory',
      'They are 100% identical in C++'
    ],
    correctAnswer: 0,
    explanation: '`new` is a type-safe operator that calculates object size, allocates heap memory, and calls the appropriate constructor. `malloc` merely allocates raw bytes and returns `void*`.'
  },
  {
    id: 'cpp-7',
    language: 'C++',
    category: 'Virtual Tables',
    difficulty: 'Hard',
    question: 'How does dynamic dispatch (runtime polymorphism) operate in standard C++ implementations?',
    options: [
      'Through a vtable (virtual method table) and a hidden vptr pointer embedded in each polymorphic object instance',
      'By interpreting the source AST at runtime',
      'By rewriting the machine code binary during execution',
      'Using switch-case tables generated in the global segment'
    ],
    correctAnswer: 0,
    explanation: 'Compilers construct a virtual method table (vtable) per class and inject a hidden virtual table pointer (`vptr`) into every object instance pointing to the appropriate function resolution table.'
  },
  {
    id: 'cpp-8',
    language: 'C++',
    category: 'Templates',
    difficulty: 'Medium',
    question: 'When are C++ templates instantiated and compiled?',
    options: [
      'At compile time for each specific type combination used in code',
      'At runtime via a Just-In-Time (JIT) virtual machine',
      'When the operating system loads the binary',
      'Templates are never compiled; they are preprocessed macros'
    ],
    correctAnswer: 0,
    explanation: 'C++ templates are instantiated and checked by the compiler during build time for each distinct concrete type used, enabling zero runtime overhead.'
  },
  {
    id: 'cpp-9',
    language: 'C++',
    category: 'STL Containers',
    difficulty: 'Easy',
    question: 'What is the amortized time complexity of inserting an element at the back of a `std::vector`?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctAnswer: 0,
    explanation: '`std::vector::push_back` runs in amortized O(1) time because the internal dynamic array doubles its capacity geometrically when full.'
  },
  {
    id: 'cpp-10',
    language: 'C++',
    category: 'Const Correctness',
    difficulty: 'Medium',
    question: 'What does `const` at the end of a member function declaration specify?',
    codeSnippet: 'int getScore() const { return score; }',
    options: [
      'The function cannot modify any non-mutable member variables of the calling object',
      'The function must return a constant pointer',
      'The function cannot take any arguments',
      'The function executes in constant O(1) time'
    ],
    correctAnswer: 0,
    explanation: 'A `const` member function guarantees that it will not mutate any non-mutable member variables of the object on which it is invoked.'
  },

  // ==================== GO (GOLANG) ====================
  {
    id: 'go-1',
    language: 'Go (Golang)',
    category: 'Concurrency',
    difficulty: 'Easy',
    question: 'How do you spawn a concurrent lightweight thread of execution (goroutine) in Go?',
    codeSnippet: 'go processTask(payload)',
    options: [
      'By prefixing a function call with the `go` keyword',
      'By calling `Thread.start(processTask)`',
      'By inheriting from `runtime.Goroutine`',
      'By passing the function to `async()`'
    ],
    correctAnswer: 0,
    explanation: 'The `go` statement starts the execution of a function call as an independent concurrent goroutine managed by Go’s M:N runtime scheduler.'
  },
  {
    id: 'go-2',
    language: 'Go (Golang)',
    category: 'Channels',
    difficulty: 'Medium',
    question: 'What happens when sending to an unbuffered channel in Go if no receiver is ready?',
    options: [
      'The sending goroutine blocks until another goroutine performs a receive on the channel',
      'The message is discarded silently',
      'A runtime panic is thrown immediately',
      'The channel dynamically resizes into a ring buffer'
    ],
    correctAnswer: 0,
    explanation: 'Unbuffered channels provide synchronous communication: a send operation blocks until another goroutine is actively receiving from the channel.'
  },
  {
    id: 'go-3',
    language: 'Go (Golang)',
    category: 'Defer Statement',
    difficulty: 'Easy',
    question: 'In what order do multiple `defer` statements execute when a function returns?',
    codeSnippet: 'func demo() {\n    defer fmt.Print("1 ")\n    defer fmt.Print("2 ")\n    defer fmt.Print("3 ")\n}',
    options: ['1 2 3 (FIFO)', '3 2 1 (LIFO)', 'Random order', 'They execute simultaneously'],
    correctAnswer: 1,
    explanation: 'Deferred function calls are pushed onto a call stack and executed in Last-In-First-Out (LIFO) order when the surrounding function returns.'
  },
  {
    id: 'go-4',
    language: 'Go (Golang)',
    category: 'Interfaces',
    difficulty: 'Medium',
    question: 'How are interfaces implemented in Go?',
    options: [
      'Implicitly: a type implements an interface simply by implementing all of the interface’s methods',
      'Explicitly using the `implements` keyword on struct definitions',
      'Using inheritance from an abstract base struct',
      'Through annotation decorators `@Implements`'
    ],
    correctAnswer: 0,
    explanation: 'Go uses structural typing (duck typing for interfaces): there is no `implements` keyword. A type satisfies an interface automatically by implementing all required methods.'
  },
  {
    id: 'go-5',
    language: 'Go (Golang)',
    category: 'Slices & Arrays',
    difficulty: 'Hard',
    question: 'What components make up the internal header of a Go slice?',
    options: [
      'A pointer to an underlying array, length (`len`), and capacity (`cap`)',
      'A linked list head, tail, and size',
      'Only a memory address and a mutex lock',
      'A hash map bucket array and salt'
    ],
    correctAnswer: 0,
    explanation: 'A slice in Go is a 24-byte header (on 64-bit systems) consisting of a pointer to the backing array, an integer length (`len`), and an integer capacity (`cap`).'
  },
  {
    id: 'go-6',
    language: 'Go (Golang)',
    category: 'Error Handling',
    difficulty: 'Easy',
    question: 'What is the idiomatic way to handle errors in Go functions?',
    options: [
      'Return `(result, error)` as multiple return values and check `if err != nil`',
      'Use `try / catch / finally` blocks',
      'Throw runtime exceptions on invalid input',
      'Set a global `errno` variable'
    ],
    correctAnswer: 0,
    explanation: 'Go treats errors as regular values: functions return an `error` interface as their last return value, and callers explicitly check `if err != nil`.'
  },
  {
    id: 'go-7',
    language: 'Go (Golang)',
    category: 'Channels & Close',
    difficulty: 'Hard',
    question: 'What happens if you attempt to send a value to a closed channel in Go?',
    options: [
      'It panics at runtime',
      'It returns a zero value',
      'The channel reopens automatically',
      'It blocks forever'
    ],
    correctAnswer: 0,
    explanation: 'Sending to a closed channel or closing an already closed channel causes an immediate runtime panic in Go.'
  },
  {
    id: 'go-8',
    language: 'Go (Golang)',
    category: 'Pointers & Structs',
    difficulty: 'Medium',
    question: 'What is the difference between a value receiver and a pointer receiver on a struct method?',
    codeSnippet: 'func (u User) Name() string // Value receiver\nfunc (u *User) SetAge(a int) // Pointer receiver',
    options: [
      'Value receivers receive a copy and cannot mutate the caller; Pointer receivers can mutate the caller and avoid copying',
      'Pointer receivers are slower in all scenarios',
      'Value receivers cannot return strings',
      'Pointer receivers can only be called from goroutines'
    ],
    correctAnswer: 0,
    explanation: 'Methods with pointer receivers can modify the caller’s fields directly and avoid copying large structs on each method invocation.'
  },
  {
    id: 'go-9',
    language: 'Go (Golang)',
    category: 'Memory & Escape Analysis',
    difficulty: 'Hard',
    question: 'What is Escape Analysis in the Go compiler?',
    options: [
      'The process where the compiler determines whether a variable can be safely allocated on the stack or must escape to the heap',
      'A tool to detect infinite loops in goroutines',
      'A sanitizer that detects SQL injection attacks',
      'A method to free circular references'
    ],
    correctAnswer: 0,
    explanation: 'Escape analysis determines variable lifetime at compile time. If a reference to a variable escapes the function scope, the compiler allocates it on the heap rather than stack.'
  },
  {
    id: 'go-10',
    language: 'Go (Golang)',
    category: 'Control Flow',
    difficulty: 'Easy',
    question: 'What does the `select` statement do in Go?',
    options: [
      'It blocks until one of its channel communication cases (send or receive) is ready to proceed',
      'It executes SQL queries on an embedded database',
      'It filters a slice using a predicate function',
      'It selects between CPU architectures'
    ],
    correctAnswer: 0,
    explanation: '`select` lets a goroutine wait on multiple channel operations simultaneously, choosing one at random if multiple are ready.'
  },

  // ==================== RUST ====================
  {
    id: 'rust-1',
    language: 'Rust',
    category: 'Ownership & Borrowing',
    difficulty: 'Easy',
    question: 'What are the core rules of Rust ownership regarding references?',
    options: [
      'You can have either any number of immutable references (&T) OR exactly one mutable reference (&mut T) at a time, but not both',
      'You can have unlimited mutable references at all times',
      'References must be freed manually with `free()`',
      'All variables in Rust are mutable by default'
    ],
    correctAnswer: 0,
    explanation: 'Rust’s borrow checker enforces the Aliasing XOR Mutability rule: you may have multiple immutable references or one exclusive mutable reference at any given time.'
  },
  {
    id: 'rust-2',
    language: 'Rust',
    category: 'Mutability',
    difficulty: 'Easy',
    question: 'How do you declare a mutable variable in Rust?',
    options: ['let mut x = 5;', 'var x = 5;', 'let x: mutable = 5;', 'mut let x = 5;'],
    correctAnswer: 0,
    explanation: 'Variables in Rust are immutable by default; the `mut` keyword must be explicitly added (`let mut x = 5;`).'
  },
  {
    id: 'rust-3',
    language: 'Rust',
    category: 'Error Handling',
    difficulty: 'Medium',
    question: 'How does the `?` operator work on a `Result<T, E>` in Rust?',
    options: [
      'If the Result is Ok(v), it unwraps v; if Err(e), it immediately returns Err(e) from the enclosing function',
      'It converts errors into null pointers',
      'It retries the operation 3 times',
      'It suppresses the error silently'
    ],
    correctAnswer: 0,
    explanation: 'The `?` operator provides early return: unwraps `Ok` values or returns `Err(From::from(e))` from the calling function.'
  },
  {
    id: 'rust-4',
    language: 'Rust',
    category: 'Option & Null Safety',
    difficulty: 'Easy',
    question: 'How does Rust avoid the "Billion-Dollar Mistake" of null pointer exceptions?',
    options: [
      'Rust has no null keyword; optional values are explicitly modeled via the `Option<T>` enum (Some(T) or None)',
      'Every pointer is wrapped in an encrypted token',
      'The compiler crashes if you declare variables without values',
      'Null pointers are converted to zero at runtime'
    ],
    correctAnswer: 0,
    explanation: 'Rust does not have `null`. Presence or absence of a value is explicitly encoded in the type system using `Option<T>`.'
  },
  {
    id: 'rust-5',
    language: 'Rust',
    category: 'Pattern Matching',
    difficulty: 'Medium',
    question: 'What is a key requirement of the `match` expression in Rust?',
    options: [
      'It must be exhaustive (handle all possible variants of the type being matched)',
      'It can only match integer values',
      'It requires a `break` keyword after every arm',
      'It only executes asynchronously'
    ],
    correctAnswer: 0,
    explanation: '`match` in Rust must be exhaustive; the compiler will reject any match expression that does not cover every possible branch or include a wildcard `_` fallback.'
  },
  {
    id: 'rust-6',
    language: 'Rust',
    category: 'Lifetimes',
    difficulty: 'Hard',
    question: 'What is the primary purpose of lifetime annotations (e.g. `\'a`) in Rust?',
    codeSnippet: 'fn longest<\'a>(x: &\'a str, y: &\'a str) -> &\'a str',
    options: [
      'To describe the relationships between the lifetimes of multiple references so the borrow checker can ensure no dangling references exist',
      'To specify how many milliseconds a variable stays in RAM',
      'To control garbage collection frequency',
      'To define thread execution duration'
    ],
    correctAnswer: 0,
    explanation: 'Lifetime annotations do not change how long any value lives; they help the compiler verify that returned references remain valid as long as the inputs they borrow from.'
  },
  {
    id: 'rust-7',
    language: 'Rust',
    category: 'Smart Pointers',
    difficulty: 'Hard',
    question: 'What does `Rc<T>` versus `Arc<T>` represent in Rust?',
    options: [
      '`Rc<T>` is reference-counted single-threaded; `Arc<T>` is atomically reference-counted and safe to share across threads',
      '`Rc<T>` is for primitive types; `Arc<T>` is for vectors',
      '`Arc<T>` is garbage collected; `Rc<T>` is not',
      'They are identical'
    ],
    correctAnswer: 0,
    explanation: '`Rc<T>` provides shared ownership in single-threaded contexts; `Arc<T>` (Atomic Reference Counted) uses atomic CPU instructions so it implements `Send` and `Sync` across threads.'
  },
  {
    id: 'rust-8',
    language: 'Rust',
    category: 'Traits & Generics',
    difficulty: 'Medium',
    question: 'What is the difference between static dispatch with `impl Trait` and dynamic dispatch with `dyn Trait`?',
    options: [
      '`impl Trait` uses monomorphization at compile time (zero runtime cost); `dyn Trait` uses trait objects with dynamic vtable lookup at runtime',
      '`dyn Trait` is faster than `impl Trait`',
      '`impl Trait` requires heap allocation',
      '`dyn Trait` cannot be used in function arguments'
    ],
    correctAnswer: 0,
    explanation: '`impl Trait` generates specialized concrete code at compile time with zero overhead (static dispatch), while `dyn Trait` creates a fat pointer with a vtable for runtime polymorphism.'
  },
  {
    id: 'rust-9',
    language: 'Rust',
    category: 'Interior Mutability',
    difficulty: 'Hard',
    question: 'Which type provides interior mutability by enforcing borrowing rules at runtime rather than compile time?',
    options: ['RefCell<T>', 'Box<T>', 'Vec<T>', 'Option<T>'],
    correctAnswer: 0,
    explanation: '`RefCell<T>` allows mutating values even when behind an immutable reference by checking borrow rules at runtime (panicking on violation).'
  },
  {
    id: 'rust-10',
    language: 'Rust',
    category: 'Closures',
    difficulty: 'Medium',
    question: 'What does the `move` keyword do when placed in front of a Rust closure?',
    codeSnippet: 'let handle = thread::spawn(move || {\n    println!("{:?}", data);\n});',
    options: [
      'Forces the closure to take full ownership of captured variables rather than borrowing them',
      'Moves the closure to another CPU core',
      'Converts the closure into a function pointer',
      'Disables capture of external variables'
    ],
    correctAnswer: 0,
    explanation: '`move` forces the closure to take ownership of values it captures from the surrounding environment rather than inferring a borrow.'
  },

  // ==================== SQL ====================
  {
    id: 'sql-1',
    language: 'SQL',
    category: 'Joins',
    difficulty: 'Easy',
    question: 'What is the result of an `INNER JOIN` between two tables?',
    options: [
      'Only the rows that have matching values in both tables',
      'All rows from the left table and matching rows from the right table',
      'All rows from both tables regardless of matches',
      'A cross product Cartesian join of all records'
    ],
    correctAnswer: 0,
    explanation: '`INNER JOIN` returns records that satisfy the join condition with matching keys present in both tables.'
  },
  {
    id: 'sql-2',
    language: 'SQL',
    category: 'Aggregation & Filtering',
    difficulty: 'Medium',
    question: 'What is the critical difference between `WHERE` and `HAVING` clauses?',
    codeSnippet: 'SELECT department, AVG(salary) FROM employees\nWHERE status = \'Active\'\nGROUP BY department\nHAVING AVG(salary) > 80000;',
    options: [
      '`WHERE` filters individual rows before aggregation; `HAVING` filters grouped records after aggregation',
      '`HAVING` filters rows before `WHERE` executes',
      '`WHERE` can only be used with numeric fields',
      '`HAVING` replaces `GROUP BY`'
    ],
    correctAnswer: 0,
    explanation: 'The `WHERE` clause applies filters to individual rows before the `GROUP BY` aggregation, whereas `HAVING` filters the aggregated results after grouping.'
  },
  {
    id: 'sql-3',
    language: 'SQL',
    category: 'Transactions & ACID',
    difficulty: 'Medium',
    question: 'What does the "I" in ACID properties stand for, and what does it ensure?',
    options: [
      'Isolation: concurrent transactions execute without interfering with one another as if running serially',
      'Integrity: primary keys cannot be null',
      'Indexing: all tables must have B-tree indexes',
      'Iteration: queries can be executed in loops'
    ],
    correctAnswer: 0,
    explanation: 'Isolation ensures that concurrent transactions operate independently without seeing intermediate, uncommitted changes from other concurrent transactions.'
  },
  {
    id: 'sql-4',
    language: 'SQL',
    category: 'Window Functions',
    difficulty: 'Hard',
    question: 'What does the `ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)` window function do?',
    options: [
      'Assigns a sequential integer to each row within each department starting from 1 for the highest salary',
      'Sums the total salaries in the department',
      'Deletes duplicate salary entries in each department',
      'Creates a new table partition on disk'
    ],
    correctAnswer: 0,
    explanation: '`ROW_NUMBER()` assigns an incrementing unique integer rank to rows inside each `PARTITION BY` group ordered by the specified criteria.'
  },
  {
    id: 'sql-5',
    language: 'SQL',
    category: 'Indexes & Performance',
    difficulty: 'Medium',
    question: 'What data structure is most commonly used for relational database indexes (like primary key lookup)?',
    options: ['B-Tree / B+ Tree', 'Doubly Linked List', 'Bloom Filter', 'Binary Heap'],
    correctAnswer: 0,
    explanation: 'B+ Trees provide balanced logarithmic search, insert, and sequential range-scan access, making them the standard storage structure for database indexes.'
  },
  {
    id: 'sql-6',
    language: 'SQL',
    category: 'Union vs Union All',
    difficulty: 'Easy',
    question: 'What is the performance difference between `UNION` and `UNION ALL`?',
    options: [
      '`UNION` eliminates duplicate rows (incurring a sort/hash overhead), whereas `UNION ALL` retains all rows and is faster',
      '`UNION ALL` removes duplicates faster than `UNION`',
      '`UNION` only works on numbers',
      'There is no performance difference'
    ],
    correctAnswer: 0,
    explanation: '`UNION` runs a deduplication step across result sets, whereas `UNION ALL` simply concatenates results together without deduplication overhead.'
  },
  {
    id: 'sql-7',
    language: 'SQL',
    category: 'NULL Handling',
    difficulty: 'Medium',
    question: 'What does the SQL expression `SELECT NULL = NULL` evaluate to in Three-Valued Logic (3VL)?',
    options: ['UNKNOWN (which evaluates as falsy in WHERE)', 'TRUE', 'FALSE', 'Syntax Error'],
    correctAnswer: 0,
    explanation: 'In ANSI SQL, comparing anything to `NULL` via `=` results in `UNKNOWN`. To test for null values, the `IS NULL` predicate must be used.'
  },
  {
    id: 'sql-8',
    language: 'SQL',
    category: 'Subqueries & CTEs',
    difficulty: 'Medium',
    question: 'What is a Common Table Expression (CTE) defined with the `WITH` keyword?',
    codeSnippet: 'WITH HighEarners AS (\n  SELECT * FROM employees WHERE salary > 100000\n)\nSELECT department, count(*) FROM HighEarners GROUP BY department;',
    options: [
      'A temporary named result set defined within the execution scope of a single query',
      'A permanent materialized view stored on disk',
      'A stored procedure executed asynchronously',
      'A database trigger'
    ],
    correctAnswer: 0,
    explanation: 'A CTE provides a readable, modular way to define temporary result sets for reuse within a `SELECT`, `INSERT`, `UPDATE`, or `DELETE` statement.'
  },
  {
    id: 'sql-9',
    language: 'SQL',
    category: 'Keys & Constraints',
    difficulty: 'Easy',
    question: 'What is the difference between a `PRIMARY KEY` and a `UNIQUE` constraint?',
    options: [
      'A table can have only one `PRIMARY KEY` and it cannot contain `NULL` values; a table can have multiple `UNIQUE` constraints and they may allow `NULL` (depending on RDBMS)',
      '`UNIQUE` constraints are not indexed',
      '`PRIMARY KEY` only works on integer IDs',
      'They are completely identical'
    ],
    correctAnswer: 0,
    explanation: 'A table is restricted to exactly one primary key that enforces non-null uniqueness, whereas multiple unique constraints can be declared and may allow null entries.'
  },
  {
    id: 'sql-10',
    language: 'SQL',
    category: 'Normalization',
    difficulty: 'Hard',
    question: 'What does Third Normal Form (3NF) require beyond 2NF?',
    options: [
      'Every non-key attribute must depend directly on the primary key, with no transitive dependencies',
      'All columns must be encrypted',
      'Tables must not contain foreign keys',
      'Every column must store JSON arrays'
    ],
    correctAnswer: 0,
    explanation: '3NF requires that the table is in 2NF and that no non-prime attribute is transitively dependent on the primary key ("Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key").'
  }
];
