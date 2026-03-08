import { useState } from "react";

/* ─── COLOUR PALETTE ─────────────────────────────────────────── */
const C = {
  bg: "#0b0b12", card: "#12121e", border: "#1e1e2e", hover: "#1a1a2e",
  t1: "#eeeef5", t2: "#8b8ba7", t3: "#3d3d58",
  green: "#22c55e", amber: "#f59e0b", red: "#ef4444", blue: "#3b82f6",
};
const MONTH_COLORS = ["#3b82f6","#f97316","#a855f7","#10b981","#f59e0b","#ef4444"];
const DIFF = {
  Starter:      { bg:"#052e16", border:"#166534", text:"#4ade80" },
  Easy:         { bg:"#0a2a0a", border:"#15803d", text:"#86efac" },
  Intermediate: { bg:"#2d1a05", border:"#b45309", text:"#fcd34d" },
  Advanced:     { bg:"#2d0a0a", border:"#b91c1c", text:"#fca5a5" },
};

/* ─── DATA ────────────────────────────────────────────────────── */
const DATA = [
  /* ── MONTH 1 ── */
  { id:1, emoji:"🧱", title:"Foundations", sub:"Setup & Syntax", color:"#3b82f6", weeks:[
    { n:1, title:"Computer Basics & Dev Setup",
      git:"git init · git config --global · create GitHub account & push first file",
      daily:"30 min theory + 30 min terminal practice",
      resources:["CS50 Week 0 (YouTube – free)","GeeksforGeeks: Number Systems","VS Code Docs"],
      capstone:{ title:"Hello World – Pushed to GitHub", diff:"Starter", gh:"python-journey", desc:"Print a personalised welcome card (name, college, quote) and push the repo live." },
      days:[
        { n:1, label:"System Explorer",       desc:"List your PC specs in specs.txt, open it via terminal. Zero Python — pure shell confidence." },
        { n:2, label:"Binary Converter",      desc:"Convert 0–15 to binary by hand, verify with print(bin(7)). Understand bits physically." },
        { n:3, label:"First .py File",        desc:"Create hello.py — print name, age, college in 3 lines. Run from terminal. First commit!" },
        { n:4, label:"Folder Structure",      desc:"mkdir my-projects/week{1..26} from terminal. Commit a README inside each folder." },
        { n:5, label:"About Me Program",      desc:"Use input() to ask name/age/city. Print a formatted sentence. First interactive script!" },
        { n:6, label:"Number Systems Quiz",   desc:"Convert 42→binary, 0b11010→decimal, 0xFF→decimal. Save answers in week1-notes.md." },
        { n:7, label:"Week README Push",      desc:"Write a README.md: what you learned, what was hard, tomorrow's goal. Push everything." },
      ],
      topics:[
        { text:"Hardware: CPU, RAM, Storage, GPU",         idea:"🔨 Build: System Info Printer — use Python platform module to print OS, architecture, processor name." },
        { text:"OS concepts: File systems, PATH, terminal", idea:"🔨 Build: File Tree Visualiser — recursively list files in a folder using os.walk()." },
        { text:"Binary & hex number systems",              idea:"🔨 Build: Number Converter CLI — convert between binary, decimal, hex interactively." },
        { text:"Install Python 3.x, VS Code, Git",         idea:"🔨 Build: 'am I set up?' Script — check Python version, Git version, print coloured status." },
        { text:"Terminal commands: cd, ls, mkdir, touch",  idea:"🔨 Build: Folder Organiser — auto-create a projects/week structure using subprocess." },
      ]
    },
    { n:2, title:"Python Syntax & Variables",
      git:"git add · git commit -m 'descriptive message' · git push origin main",
      daily:"45 min coding + 15 min Git practice",
      resources:["Automate the Boring Stuff Ch.1–2","freeCodeCamp Python for Beginners","Repl.it (online REPL)"],
      capstone:{ title:"Mad Libs Story Generator", diff:"Starter", gh:"mad-libs-python", desc:"Ask for 5 words, build a funny story with f-strings. Save output to a .txt file." },
      days:[
        { n:1, label:"Variable Zoo",        desc:"Create int, float, str, bool, None variables. Print each with type(). Commit variables_demo.py." },
        { n:2, label:"Simple Calculator",   desc:"Take two inputs. Show sum, difference, product, quotient, modulo, power. Handle floats." },
        { n:3, label:"String Surgeon",      desc:"Input a sentence. Print UPPER, lower, Title, length, first word, last word, reversed." },
        { n:4, label:"Receipt Generator",   desc:"3 hardcoded items + prices. Calculate total + 18% GST. Print a formatted ₹ receipt." },
        { n:5, label:"ID Card Printer",     desc:"Ask name, DOB, college, hobby. Print a bordered ID card using f-strings." },
        { n:6, label:"Type Converter Tool", desc:"Input a number. Show as int, float, binary, hex, octal, string. Python is flexible!" },
        { n:7, label:"Mad Libs Final Push", desc:"Add 2 story templates chosen randomly. Push with README. First real project done!" },
      ],
      topics:[
        { text:"Variables & data types: int, float, str, bool",  idea:"🔨 Build: Personal Bio Card — store name/age/city in typed variables, print a formatted card." },
        { text:"input() and print() with f-strings",             idea:"🔨 Build: Greeting Generator — ask first + last name, print 5 different greeting styles." },
        { text:"Type casting: int(), str(), float()",            idea:"🔨 Build: Unit Converter — input a number as string, cast to float, convert km↔miles." },
        { text:"String slicing, methods (.upper .split etc.)",   idea:"🔨 Build: Name Formatter — take full name string, output initials, reversed, title case." },
        { text:"Code comments & readability",                    idea:"🔨 Build: Annotated Calculator — well-commented calc showing each step as a print." },
      ]
    },
    { n:3, title:"Control Flow & Logic",
      git:"git log · git diff HEAD · git status — learn to read your own history",
      daily:"Build 2 small logic programs every day",
      resources:["GeeksforGeeks: Python if-else","W3Schools Python","Python Tutor visualiser (free)"],
      capstone:{ title:"BMI & Life-Stage Analyzer", diff:"Easy", gh:"bmi-analyzer-python", desc:"Take height/weight/age. Calc BMI, classify it, give tailored health advice." },
      days:[
        { n:1, label:"Traffic Light",      desc:"Input red/yellow/green → print instruction. Add 'broken' state. First real if/elif/else." },
        { n:2, label:"FizzBuzz+",          desc:"Odd/even + divisible by 3, 5, both, is prime. Stack multiple conditions." },
        { n:3, label:"Grade Calculator",   desc:"5 subject marks → average → A+/A/B/C/D/F with exact cutoffs. elif ladder." },
        { n:4, label:"Leap Year Detector", desc:"Apply real rule: ÷4 YES, ÷100 NO, ÷400 YES. Classic nested condition." },
        { n:5, label:"Vending Machine",    desc:"5 items + prices. Handle exact money, too little, too much (give change), invalid." },
        { n:6, label:"Rock Paper Scissors",desc:"User vs hardcoded computer. Win/lose/draw via nested if/elif." },
        { n:7, label:"BMI Analyzer Push",  desc:"Add body-fat estimate formula. Push with README explaining formulas used." },
      ],
      topics:[
        { text:"if / elif / else statements",                idea:"🔨 Build: Smart Discount Calculator — apply tiered discounts based on purchase amount." },
        { text:"Logical operators: and, or, not",            idea:"🔨 Build: Login Validator — check username AND password correct, show specific errors." },
        { text:"Comparison operators",                       idea:"🔨 Build: Number Comparator — compare 3 numbers, print largest/smallest without min/max." },
        { text:"Nested conditions",                          idea:"🔨 Build: Ticket Price Calculator — age + student/senior/military → correct price logic." },
        { text:"Boolean logic & truth tables",               idea:"🔨 Build: Logic Gate Simulator — AND, OR, NOT, XOR gates from boolean expressions." },
      ]
    },
    { n:4, title:"Loops & Iteration",
      git:"git branch dev · git checkout -b feature/guessing-game · git merge dev",
      daily:"Solve 3 loop problems on GeeksforGeeks Practice",
      resources:["Automate the Boring Stuff Ch.2","Python Tutor (loop visualiser)","HackerRank Python domain"],
      capstone:{ title:"Number Guessing Game with High Score", diff:"Easy", gh:"number-guessing-game", desc:"Random 1–100. Hints. Count attempts. Track best score. Difficulty levels." },
      days:[
        { n:1, label:"Multiplication Tables", desc:"Nested loops, neatly formatted columns. Let user choose which table." },
        { n:2, label:"Star Patterns",         desc:"5 patterns: right triangle, pyramid, diamond, hollow square, inverted pyramid." },
        { n:3, label:"Sum Calculator",        desc:"Sum 1–100, sum evens, sum odds, sum of squares, factorial N — all via loops." },
        { n:4, label:"PIN Lock Simulator",    desc:"3 attempts, while loop, lockout after fails. Show remaining attempts." },
        { n:5, label:"Stats Tool",            desc:"User enters numbers until 'done'. Calculate min, max, sum, average." },
        { n:6, label:"Password Strength",     desc:"Check length, upper, lower, digit, special. Score 1–5 with label." },
        { n:7, label:"Guessing Game Push",    desc:"Add replay, session stats, difficulty levels. Push full project." },
      ],
      topics:[
        { text:"for loops with range()",                     idea:"🔨 Build: Times Table App — print complete 1–20 multiplication table, highlight perfect squares." },
        { text:"while loops, break, continue",               idea:"🔨 Build: ATM Simulator — keep asking for PIN until correct, max 3 attempts with lockout." },
        { text:"Nested loops",                               idea:"🔨 Build: Star Pyramid Generator — 5 different ASCII art patterns from nested loops." },
        { text:"enumerate() and zip()",                      idea:"🔨 Build: Inventory Printer — zip item names + prices, enumerate to show numbered list." },
        { text:"Loop patterns: sum, count, search",          idea:"🔨 Build: Number Stats CLI — input list of numbers, compute min/max/avg/sum using loops only." },
      ]
    },
  ]},

  /* ── MONTH 2 ── */
  { id:2, emoji:"🏗️", title:"Data Structures", sub:"Functions & Files", color:"#f97316", weeks:[
    { n:5, title:"Lists & Tuples",
      git:"Create a new branch per feature. Write meaningful commit messages (feat: add sort function).",
      daily:"10 list problems per day on HackerRank Python domain",
      resources:["Real Python: Lists Guide","freeCodeCamp Data Structures","HackerRank Python domain (free)"],
      capstone:{ title:"Student Grade Manager", diff:"Easy", gh:"student-grade-manager", desc:"2D list of students + marks. Average, sort, report. Add/remove dynamically." },
      days:[
        { n:1, label:"Shopping Cart",          desc:"List with add/remove/view/clear/search. Loop until 'quit'." },
        { n:2, label:"Slicer Practice",        desc:"20-number list: first 5, last 5, every other, reversed, even indices." },
        { n:3, label:"To-Do List App",         desc:"Two lists: pending + done. Add/mark/remove/view operations." },
        { n:4, label:"Comprehension Dojo",     desc:"10 comprehensions: squares, evens, filter words, uppercase, flatten." },
        { n:5, label:"Tic Tac Toe Board",      desc:"3×3 2D list. Print nicely. Two players input positions." },
        { n:6, label:"Tuple Use Cases",        desc:"Student records as tuples. Show immutability benefits vs list." },
        { n:7, label:"Grade Manager Push",     desc:"Add toppers board, class average, subject-wise analysis. Report to .txt." },
      ],
      topics:[
        { text:"List creation, indexing, slicing",              idea:"🔨 Build: Top 5 Movies List — store, index, slice, and display your favourite films." },
        { text:"List methods: append, pop, sort, reverse",      idea:"🔨 Build: Dynamic Leaderboard — players join/leave, auto-sort by score, display top 3." },
        { text:"List comprehensions",                           idea:"🔨 Build: Grade Filter — one-liner comprehension to find all students scoring above 75." },
        { text:"Tuples — immutability & use cases",             idea:"🔨 Build: GPS Coordinates Store — lat/long as tuples, show why immutability matters." },
        { text:"2D lists (matrices)",                           idea:"🔨 Build: Seating Chart Generator — 5×10 hall, assign/free seats, display as grid." },
      ]
    },
    { n:6, title:"Dictionaries & Sets",
      git:"git stash · git stash pop — juggle features without losing work",
      daily:"Build one complete mini-app using dictionaries each day",
      resources:["Automate the Boring Stuff Ch.5","GeeksforGeeks: Python Dictionaries","Real Python: Sets"],
      capstone:{ title:"Contact Book CLI App", diff:"Easy", gh:"contact-book-cli", desc:"Full CRUD. Search, edit, delete, sort. Import/export to .txt file." },
      days:[
        { n:1, label:"Word Frequency",     desc:"Paragraph input → count each word → show top 5. Ignore case/punctuation." },
        { n:2, label:"Student Info DB",    desc:"Nested dicts: name/age/marks/city. Print full profile. Search by name." },
        { n:3, label:"Inventory Manager",  desc:"Dict of items. Add stock, sell (reduce qty), low-stock alert (<5)." },
        { n:4, label:"Set Operations Lab", desc:"Python vs Java class lists. Find: both, only Python, only Java, union." },
        { n:5, label:"Phonebook",          desc:"20 name:number pairs. Partial search, add, delete, update." },
        { n:6, label:"Restaurant Menu",    desc:"Menu dict. Order, remove, bill, 10% coupon, pay and change." },
        { n:7, label:"Contact Book Push",  desc:"Import from .txt, export formatted .txt. Push to GitHub." },
      ],
      topics:[
        { text:"Dictionary CRUD operations",                  idea:"🔨 Build: Mini JSON Database — store, retrieve, update, delete student records in a dict." },
        { text:"dict methods: keys, values, items",           idea:"🔨 Build: Frequency Analyser — use items() to find most/least common words in a text." },
        { text:"Nested dictionaries",                         idea:"🔨 Build: School Directory — nested dict {class: {roll: {name, marks}}} with full lookup." },
        { text:"Sets — union, intersection, difference",      idea:"🔨 Build: Friend Suggester — find mutual friends (intersection) using two people's sets." },
        { text:"Choosing the right data structure",           idea:"🔨 Build: Data Structure Benchmarker — time list vs dict vs set lookups on 1 million items." },
      ]
    },
    { n:7, title:"Functions & Scope",
      git:"Open a Pull Request on GitHub. Add a description, request a review from yourself.",
      daily:"Refactor last week's project: extract every repeated block into a named function",
      resources:["Automate the Boring Stuff Ch.3","Real Python: Functions Deep Dive","Corey Schafer Functions (YouTube)"],
      capstone:{ title:"Modular Scientific Calculator", diff:"Easy", gh:"modular-calculator-python", desc:"Every operation is a function. History of last 10 calcs. Unit converter bonus." },
      days:[
        { n:1, label:"Geometry Functions",  desc:"area/perimeter for circle, rectangle, triangle. Call with different args." },
        { n:2, label:"Flexible Greeter",    desc:"greet(name, lang='English') — Hindi/English/Tamil greetings." },
        { n:3, label:"Recursion Visual",    desc:"factorial, fibonacci, sum_of_digits, reverse_string — print each step." },
        { n:4, label:"Lambda Dojo",         desc:"Convert 5 functions to lambdas. Use with sorted(), filter(), map()." },
        { n:5, label:"Scope Explorer",      desc:"Local, global, nonlocal examples. Write a closure-based counter." },
        { n:6, label:"Utility Belt Module", desc:"utils.py: is_prime, celsius_to_f, count_vowels, is_palindrome. Import in main." },
        { n:7, label:"Calculator Push",     desc:"*args for multi-number ops. History as list of dicts. Push via PR." },
      ],
      topics:[
        { text:"def, return, parameters vs arguments",      idea:"🔨 Build: Area Calculator Library — functions for 6 shapes, imported and called from main.py." },
        { text:"Default args, *args, **kwargs",             idea:"🔨 Build: Flexible Email Formatter — format_email(to, subject, body, cc=None, **headers)." },
        { text:"LEGB scope rule",                           idea:"🔨 Build: Visit Counter — closure that counts how many times a page was 'visited' without globals." },
        { text:"Lambda functions",                          idea:"🔨 Build: Sort-o-Matic — sort a list of dicts (students) by any key using lambda." },
        { text:"Recursion basics",                          idea:"🔨 Build: Folder Size Calculator — recursively sum file sizes in a folder tree (os.path)." },
      ]
    },
    { n:8, title:"File I/O & Error Handling",
      git:"Add .gitignore (ignore __pycache__, .env, *.csv). Write a proper README.md with badges.",
      daily:"1 hr on the monthly capstone + commit every single day",
      resources:["Automate the Boring Stuff Ch.8–9","Real Python: File I/O","Python Docs: Exceptions"],
      capstone:{ title:"💰 Expense Tracker CLI — Month 2 Capstone", diff:"Intermediate", gh:"expense-tracker-cli", desc:"Full CSV-persisted expense/income tracker. Monthly summary, categories, balance." },
      days:[
        { n:1, label:"Diary Writer",          desc:"Append entries with timestamps. Read and display all past entries." },
        { n:2, label:"Error Handling Gym",    desc:"5 programs each handling a specific error with friendly messages." },
        { n:3, label:"CSV Contact Saver",     desc:"Load on startup, save on exit. Persistent contacts from last week's app." },
        { n:4, label:"Log File Analyser",     desc:"Fake 50-line log.txt. Count types, extract ERRORs, save summary." },
        { n:5, label:"Custom Exception Quiz", desc:"InvalidAnswerError, TimeLimitError, MaxAttemptsError — quiz app." },
        { n:6, label:"File Organiser Script", desc:"Auto-move .txt/.py/.jpg into sub-folders. Handle permission errors." },
        { n:7, label:"Expense Tracker Push",  desc:"Add date filter, monthly export, custom categories. Full README." },
      ],
      topics:[
        { text:"open(), read, write, append modes",          idea:"🔨 Build: Personal Diary App — append daily entries with timestamps, read history on demand." },
        { text:"with statement (context managers)",          idea:"🔨 Build: Safe CSV Logger — always-closed file handler for logging app events." },
        { text:"try / except / finally",                    idea:"🔨 Build: Crash-Proof Calculator — handle ZeroDivisionError, ValueError, show friendly errors." },
        { text:"Custom exceptions",                         idea:"🔨 Build: Bank Transfer Validator — InsufficientFundsError, InvalidAccountError raised & caught." },
        { text:"CSV basics with csv module",                idea:"🔨 Build: CSV Grade Book — read, append, update marks. Sort by score. Export summary." },
      ]
    },
  ]},

  /* ── MONTH 3 ── */
  { id:3, emoji:"⚙️", title:"OOP & Libraries", sub:"NumPy & Pandas", color:"#a855f7", weeks:[
    { n:9, title:"OOP I — Classes & Objects",
      git:"Open GitHub Issues for each bug or feature you discover. Reference them in commits: 'fix #3'.",
      daily:"Model 1 real-world thing as a Python class every day",
      resources:["Corey Schafer OOP YouTube Series (free)","Real Python: OOP","Python Docs: Classes"],
      capstone:{ title:"Bank Account System", diff:"Easy", gh:"bank-account-oop", desc:"Deposit, withdraw, transfer, transaction history. Balance validation. __str__ mini-statement." },
      days:[
        { n:1, label:"Car Class",        desc:"make, model, year, odometer. drive(km), describe(), __str__." },
        { n:2, label:"Student Class",    desc:"name, roll, marks[]. add_mark(), average(), grade(), __str__." },
        { n:3, label:"Geometry Classes", desc:"Rectangle + Circle. area(), perimeter(), compare(other)." },
        { n:4, label:"Employee Class",   desc:"name, id, salary, dept. give_raise(%). Class var company_name." },
        { n:5, label:"Playlist Manager", desc:"Song + Playlist classes. add/remove/shuffle/total_duration." },
        { n:6, label:"ATM Machine",      desc:"authenticate(pin), deposit, withdraw, check_balance with exceptions." },
        { n:7, label:"Bank Account Push",desc:"Savings subclass preview with interest. Timestamps on history." },
      ],
      topics:[
        { text:"Classes & objects — the blueprint concept",  idea:"🔨 Build: Product Catalogue — Product class with name/price/stock. print_info() method." },
        { text:"__init__, self, instance attributes",        idea:"🔨 Build: Student Registry — __init__ sets name/roll/marks, methods compute grade & rank." },
        { text:"Instance methods vs class methods",          idea:"🔨 Build: Temperature Converter — instance stores value; classmethods from_celsius/from_fahrenheit." },
        { text:"Class variables vs instance variables",      idea:"🔨 Build: Employee Counter — track how many employees exist using a class variable." },
        { text:"__str__ and __repr__ dunder methods",        idea:"🔨 Build: Playing Card — Card('A','♠'). __str__ returns 'Ace of Spades', __repr__ for debugging." },
      ]
    },
    { n:10, title:"OOP II — Inheritance & Polymorphism",
      git:"Set up a GitHub Projects Kanban board: To Do / In Progress / Done for all your projects.",
      daily:"Extend the Bank Account project: add one new subclass each day",
      resources:["Corey Schafer OOP Part 4–6","GeeksforGeeks: Python OOP","Real Python: Inheritance"],
      capstone:{ title:"Library Management System", diff:"Intermediate", gh:"library-management-oop", desc:"Book, EBook, AudioBook inherit Item. Member borrows/returns. Polymorphic display." },
      days:[
        { n:1, label:"Animal Kingdom",      desc:"Animal→Dog/Cat/Bird. Override speak(). Polymorphic mixed list call." },
        { n:2, label:"Bank Extended",       desc:"SavingsAccount (interest), CurrentAccount (overdraft) via super()." },
        { n:3, label:"Shape Hierarchy",     desc:"Shape→2D/3D→Circle/Rect/Cube/Sphere. area() and volume() polymorphic." },
        { n:4, label:"Employee Hierarchy",  desc:"Employee→Manager/Developer/Intern. Each overrides __str__." },
        { n:5, label:"Vehicle Fleet",       desc:"Vehicle→Car/Truck/Moto. Each overrides fuel_cost(km). Fleet total." },
        { n:6, label:"Encapsulation Lab",   desc:"Patient class with private __health_record. Doctor-verified access." },
        { n:7, label:"Library Push",        desc:"Fine calc, search by author/genre, most borrowed list." },
      ],
      topics:[
        { text:"Inheritance & super()",                          idea:"🔨 Build: Animal Sounds App — Animal base; Dog/Cat/Bird override speak(); loop calls all." },
        { text:"Method overriding",                              idea:"🔨 Build: Shape Area Printer — same area() call on Circle/Rectangle/Triangle prints each formula." },
        { text:"Multiple inheritance",                           idea:"🔨 Build: Flying Car — inherits from Car and Drone. Both fly() and drive() work." },
        { text:"Polymorphism & duck typing",                     idea:"🔨 Build: Payment Processor — CreditCard/UPI/Cash all have pay(amount); call without checking type." },
        { text:"Encapsulation: _ and __ prefixes",               idea:"🔨 Build: Secure Vault — __pin and __balance; only public methods can change them." },
      ]
    },
    { n:11, title:"NumPy & Networking Basics",
      git:"Set up a basic GitHub Actions workflow (echo 'hello' step). Understand the YAML format.",
      daily:"30 min NumPy exercises + 30 min networking reading",
      resources:["NumPy Official Quickstart (numpy.org)","freeCodeCamp NumPy Tutorial","CS Networking Crash Course (YouTube)"],
      capstone:{ title:"Student Marks Analyser (NumPy)", diff:"Easy", gh:"marks-analyser-numpy", desc:"50 students × 5 subjects. Topper, class avg, std dev, below-average list, bar chart." },
      days:[
        { n:1, label:"Array vs List Race", desc:"1M numbers. Time sum/multiply/square. Show NumPy is 100× faster." },
        { n:2, label:"Matrix Math",        desc:"3×3 matrices. Add, dot product, transpose, determinant, inverse." },
        { n:3, label:"Stats Dashboard",    desc:"100 random scores. mean, median, std, IQR, percentiles." },
        { n:4, label:"Image as Array",     desc:"Load with PIL. Set half pixels to 0. Display. Images = arrays!" },
        { n:5, label:"Broadcasting Tricks",desc:"Add row vector to matrix. Normalise 0–1. ML preprocessing!" },
        { n:6, label:"Network Detective",  desc:"socket: get your IP, hostname. Research DNS + HTTP flow." },
        { n:7, label:"Marks Analyser Push",desc:"Rank students, identify remedials <40%, export CSV + Notebook." },
      ],
      topics:[
        { text:"NumPy arrays vs Python lists",                   idea:"🔨 Build: Speed Benchmark — prove NumPy is 100× faster on 1M element math with timeit." },
        { text:"Array ops, broadcasting, reshape",               idea:"🔨 Build: Image Brightness Adjuster — load image as array, multiply pixel values by 1.5." },
        { text:"Indexing, slicing, boolean masking",             idea:"🔨 Build: Exam Anomaly Detector — mask students scoring >95 OR <20 as 'needs review'." },
        { text:"Statistical functions: mean, std, median",       idea:"🔨 Build: Class Report Card — per-subject mean/std/median; flag subjects with high std dev." },
        { text:"Networking: IP, HTTP, DNS basics",               idea:"🔨 Build: Network Info Tool — socket.gethostname(), gethostbyname() + display as info card." },
      ]
    },
    { n:12, title:"Pandas & Data Analysis",
      git:"Add shields.io badges to README (Python version, license, stars). Learn Markdown tables.",
      daily:"Analyse one Kaggle dataset every day — apply the week's technique",
      resources:["Kaggle Python Course (100% free)","Pandas Official Docs","Seaborn Gallery (seaborn.pydata.org)"],
      capstone:{ title:"📊 Web Scraper + Data Dashboard — Month 3 Capstone", diff:"Intermediate", gh:"data-dashboard-pandas", desc:"Scrape real data → Pandas → clean → 3 charts → export HTML report." },
      days:[
        { n:1, label:"Pandas Blitz",       desc:"Load titanic.csv. shape, dtypes, head, describe, null counts." },
        { n:2, label:"Filtering Master",   desc:"All females / 1st class / age 20–30 / survived AND female." },
        { n:3, label:"GroupBy Analytics",  desc:"Survival by class, avg fare by port, gender survival %. Real DS!" },
        { n:4, label:"Missing Data",       desc:"Fill age with median. Drop cabin nulls. dropna vs fillna." },
        { n:5, label:"Chart Generator",    desc:"4 charts: bar, histogram, pie, scatter from titanic data." },
        { n:6, label:"CSV Data Cleaner",   desc:"Messy CSV → cleaning pipeline → clean_output.csv function." },
        { n:7, label:"Dashboard Push",     desc:"Scraping + Pandas + charts + Jupyter Notebook. Screenshots README." },
      ],
      topics:[
        { text:"DataFrame & Series creation",                    idea:"🔨 Build: IPL Stats Viewer — load IPL CSV into DataFrame, print top run-scorers table." },
        { text:"read_csv, head, info, describe",                 idea:"🔨 Build: Dataset Inspector — auto-print shape/types/nulls/stats for any CSV you drop in." },
        { text:"Filtering, groupby, aggregation",                idea:"🔨 Build: Sales Analyser — group sales by region + month, find best-performing area." },
        { text:"Handling missing data",                          idea:"🔨 Build: Data Imputer — fill numeric nulls with median, categorical nulls with mode." },
        { text:"Basic Matplotlib / Seaborn plots",               idea:"🔨 Build: Auto Chart Generator — input CSV column names → auto-pick best chart type." },
      ]
    },
  ]},

  /* ── MONTH 4 ── */
  { id:4, emoji:"🌐", title:"Web & APIs", sub:"Flask & Databases", color:"#10b981", weeks:[
    { n:13, title:"Web Scraping",
      git:"Fork a repo from GitHub. Add a feature. Open a PR back to your own fork. Understand upstream.",
      daily:"Scrape a completely different website each day",
      resources:["Automate the Boring Stuff Ch.12","Real Python: Web Scraping Tutorial","Scrapy Docs (advanced)"],
      capstone:{ title:"News Headline Aggregator", diff:"Easy", gh:"news-headline-scraper", desc:"Scrape 3 news sites. Remove dupes. Categorise by keyword. Save JSON. Schedule run." },
      days:[
        { n:1, label:"First Scrape",     desc:"Wikipedia article title + first paragraph. Understand HTML tree." },
        { n:2, label:"Quote Scraper",    desc:"All 10 pages of quotes.toscrape.com → 100 quotes to JSON." },
        { n:3, label:"Price Tracker",    desc:"Product page → name/price/rating. Save CSV with timestamp." },
        { n:4, label:"Image Downloader", desc:"Gallery site → all img src → download to /downloads. Handle fails." },
        { n:5, label:"Job Scraper",      desc:"Internshala listings → title/company/stipend. Filter remote → CSV." },
        { n:6, label:"Cricket Stats",    desc:"ESPNcricinfo table → Pandas → top 5 run-scorers → bar chart." },
        { n:7, label:"News Agg Push",    desc:"TextBlob sentiment on headlines. Word cloud image. Push." },
      ],
      topics:[
        { text:"requests library — GET, POST",                   idea:"🔨 Build: URL Status Checker — input list of URLs, print HTTP status (200/404/500) for each." },
        { text:"BeautifulSoup — parsing HTML",                   idea:"🔨 Build: Wikipedia Scraper — scrape any Wikipedia article title + summary + first image URL." },
        { text:"CSS selectors & finding elements",               idea:"🔨 Build: Quote Collection Bot — scrape quotes.toscrape.com all pages, save to quotes.json." },
        { text:"Scraping etiquette (robots.txt)",                idea:"🔨 Build: Robots.txt Reader — input any domain, fetch and parse its robots.txt, print rules." },
        { text:"Saving scraped data to CSV/JSON",                idea:"🔨 Build: Product Price Tracker — daily price CSV with timestamps; alert when price drops." },
      ]
    },
    { n:14, title:"REST APIs & JSON",
      git:"Use the GitHub API with your token: auto-create a new repo via Python script.",
      daily:"Call one completely new free API every day and build something with its data",
      resources:["Real Python: Consuming APIs","Postman Learning Center (free)","public-apis.io (huge list)"],
      capstone:{ title:"Multi-API Weather Dashboard", diff:"Easy", gh:"weather-dashboard-api", desc:"OpenWeather + Wikipedia + AirVisual. Rich terminal UI. 5-day forecast chart." },
      days:[
        { n:1, label:"First API Call",    desc:"OpenWeather free key. Parse temp/humidity/wind. Formatted print." },
        { n:2, label:"GitHub API",        desc:"No auth needed. Fetch your profile, repos, star count." },
        { n:3, label:"Currency Converter",desc:"ExchangeRate API. convert(amount, from, to) function. 170+ currencies." },
        { n:4, label:"Joke/Quote Bot",    desc:"JokeAPI + ZenQuotes. Random joke OR quote. Save favourites to JSON." },
        { n:5, label:"Space Tracker",     desc:"Open-Notify API: people in space, ISS location. NASA APOD." },
        { n:6, label:"Repo Automator",    desc:"GitHub API + token. Create repo, add README, push file — automated!" },
        { n:7, label:"Weather Dash Push", desc:"Matplotlib 7-day forecast chart. History CSV. Two-city compare." },
      ],
      topics:[
        { text:"REST concepts: GET, POST, PUT, DELETE",          idea:"🔨 Build: HTTP Method Explorer — demo all 4 verbs against JSONPlaceholder test API." },
        { text:"JSON parsing with json module",                  idea:"🔨 Build: JSON Pretty Printer — fetch any API, pretty-print the JSON with indents & colors." },
        { text:"API keys, headers, authentication",              idea:"🔨 Build: GitHub Stats Card — use GitHub API + token to print your repo/follower stats." },
        { text:"requests with real APIs (OpenWeather etc.)",     idea:"🔨 Build: Weather Alert Bot — check weather every hour, print alert if rain/storm detected." },
        { text:"Rate limiting & error handling",                 idea:"🔨 Build: Robust API Client — retry on 429, backoff on 5xx, timeout on 10s, log all errors." },
      ]
    },
    { n:15, title:"Flask Web Framework",
      git:"Deploy a plain HTML page to GitHub Pages. Understand static hosting vs dynamic server.",
      daily:"Add exactly one new Flask feature per day — keep each addition in its own commit",
      resources:["Corey Schafer Flask Series (YouTube – free)","Flask Official Docs (flask.palletsprojects.com)","Jinja2 Docs"],
      capstone:{ title:"Personal Portfolio Website", diff:"Intermediate", gh:"portfolio-flask", desc:"Multi-page Flask site. Projects loaded from JSON. Contact form. Deploy to Render." },
      days:[
        { n:1, label:"Hello Flask",       desc:"3 routes: /, /about, /contact. Return HTML strings. Debug mode." },
        { n:2, label:"Jinja2 Templates",  desc:"base.html with nav+footer. 3 pages extend it. Pass dict to template." },
        { n:3, label:"Form Handler",      desc:"Contact form. POST handler. Validate inputs. Success/error message." },
        { n:4, label:"Dynamic Routes",    desc:"/project/<name> loads from JSON. 404 for unknown projects." },
        { n:5, label:"Session Login",     desc:"Hardcoded user. Login sets session. Protected /dashboard. Logout." },
        { n:6, label:"Flask REST API",    desc:"GET /api/projects → JSON. POST /api/contact → save message." },
        { n:7, label:"Portfolio Deploy",  desc:"Render.com free deploy. Real URL in README. First live website!" },
      ],
      topics:[
        { text:"Flask app setup, routes, views",                 idea:"🔨 Build: Link Shortener — Flask maps random 6-char codes to long URLs in a dict." },
        { text:"Jinja2 templates & template inheritance",        idea:"🔨 Build: Blog Engine — base.html navbar; posts.html lists entries from a JSON file." },
        { text:"GET & POST forms with WTForms",                  idea:"🔨 Build: Contact Form Handler — validate name/email/message, show errors inline." },
        { text:"Static files (CSS, JS, images)",                 idea:"🔨 Build: Styled Flask App — add custom CSS to make your portfolio look polished." },
        { text:"Flask sessions & cookies",                       idea:"🔨 Build: Theme Switcher — save user's dark/light preference in a session cookie." },
      ]
    },
    { n:16, title:"Databases with SQLAlchemy",
      git:"Create your first GitHub Release (v1.0.0). Write a CHANGELOG.md. Tag the commit.",
      daily:"1.5 hr every day building the Todo app — no skipping",
      resources:["SQLite Tutorial (sqlitetutorial.net)","SQLAlchemy 2.0 Quickstart","Miguel Grinberg Flask Mega-Tutorial (free)"],
      capstone:{ title:"🌐 Full-Stack Todo App — Month 4 Capstone", diff:"Advanced", gh:"fullstack-todo-flask", desc:"Flask + SQLite + Bootstrap + Auth. Priority, due dates, categories. Deployed live." },
      days:[
        { n:1, label:"SQLite First Steps",   desc:"Raw SQL: CREATE TABLE, INSERT, SELECT WHERE, UPDATE, DELETE." },
        { n:2, label:"Python + sqlite3",     desc:"Wrap SQL in Python functions. CRUD for Products. Context manager." },
        { n:3, label:"SQLAlchemy ORM",       desc:"User model. Create DB from model. ORM add/query/filter/delete." },
        { n:4, label:"Flask + Database",     desc:"/add, /list, /delete/<id> routes. Full web + DB pipeline." },
        { n:5, label:"Auth System",          desc:"Flask-Login + bcrypt. Register, login, protected routes. Never plain passwords!" },
        { n:6, label:"Relationships",        desc:"User→Todos (1:M). Categories (M:M). backref in SQLAlchemy." },
        { n:7, label:"Todo Deploy + Release",desc:"Render deploy. GitHub Release v1.0.0 with changelog + screenshots." },
      ],
      topics:[
        { text:"SQLite with Python sqlite3",                     idea:"🔨 Build: CLI Address Book — SQLite-backed CRUD for contacts (name, phone, email)." },
        { text:"CRUD operations in SQL",                         idea:"🔨 Build: Product Inventory — INSERT/SELECT/UPDATE/DELETE via Python functions." },
        { text:"Flask-SQLAlchemy models",                        idea:"🔨 Build: Note-Taking App — Note model (title, body, timestamp). CRUD via Flask routes." },
        { text:"One-to-many and many-to-many relationships",     idea:"🔨 Build: Blog with Tags — Post has many Tags; Tag has many Posts. SQLAlchemy M2M table." },
        { text:"User auth with bcrypt & Flask-Login",            idea:"🔨 Build: Secure Login System — bcrypt hashed passwords, protected dashboard route." },
      ]
    },
  ]},

  /* ── MONTH 5 ── */
  { id:5, emoji:"🤖", title:"AI / ML", sub:"scikit-learn & Deep Learning", color:"#f59e0b", weeks:[
    { n:17, title:"ML Concepts + scikit-learn",
      git:"Put Jupyter Notebooks on GitHub. Add a requirements.txt. Link notebook via nbviewer in README.",
      daily:"30 min Andrew Ng theory + 30 min scikit-learn hands-on code",
      resources:["Andrew Ng ML Course – Coursera (free audit)","scikit-learn official docs","Kaggle Intro to ML (free)"],
      capstone:{ title:"House Price Predictor", diff:"Easy", gh:"house-price-ml", desc:"Linear Regression on housing data. MSE/R² evaluation. Actual vs predicted plot." },
      days:[
        { n:1, label:"ML Intuition Day",     desc:"No code — draw supervised/unsupervised/regression/classification on paper." },
        { n:2, label:"First Model",          desc:"California housing. LinearRegression. Predict. Calculate MSE. 15 lines!" },
        { n:3, label:"Train/Test Split",     desc:"Change 80/20→60/40→90/10. Watch score change. See overfitting." },
        { n:4, label:"Feature Importance",   desc:"model.coef_ weights. Remove least important. Retrain. Compare." },
        { n:5, label:"3-Model Race",         desc:"LinearRegression vs Ridge vs Lasso. Compare R². Print table." },
        { n:6, label:"Polynomial Regression",desc:"PolynomialFeatures(degree=2). Plot linear vs curve fit." },
        { n:7, label:"House Predictor Push", desc:"Interactive predict_price() function. Push Jupyter Notebook." },
      ],
      topics:[
        { text:"Supervised vs Unsupervised ML",                  idea:"🔨 Build: ML Concept Explainer — print a formatted summary of 5 ML algorithm types." },
        { text:"Train/test split & overfitting",                 idea:"🔨 Build: Overfit Demonstrator — show accuracy soaring on train but crashing on test." },
        { text:"scikit-learn: fit, predict, score",              idea:"🔨 Build: Salary Predictor — regress salary on years of experience, plot the line." },
        { text:"Linear Regression theory + code",                idea:"🔨 Build: Study Hours → Marks Predictor — classic linear regression with scatter + line." },
        { text:"Model evaluation: MSE, R-squared",               idea:"🔨 Build: Model Report Card — print MSE, RMSE, R² for any regression model nicely." },
      ]
    },
    { n:18, title:"Classification & EDA",
      git:"Create a GitHub Wiki page documenting your ML experiment results (accuracy, params tried).",
      daily:"Work on Titanic Kaggle notebook + try 1 new feature engineering trick",
      resources:["Kaggle Titanic Competition (free)","StatQuest ML Videos (YouTube)","Towards Data Science (blog)"],
      capstone:{ title:"Titanic Survival Predictor", diff:"Intermediate", gh:"titanic-survival-ml", desc:"Full pipeline: EDA→clean→feature eng→3 models→F1→Kaggle submit. Aim 78%+." },
      days:[
        { n:1, label:"Titanic EDA",         desc:"Survival by gender/class/age. Answer: who had best odds? seaborn." },
        { n:2, label:"Feature Engineering", desc:"FamilySize, IsAlone, Title from Name, AgeGroup. Better features = better model." },
        { n:3, label:"Logistic Regression", desc:"Train. Print confusion matrix, precision, recall, F1." },
        { n:4, label:"Decision Tree",       desc:"Plot tree max_depth=3. Read like flowchart. Tune and see overfit." },
        { n:5, label:"Random Forest",       desc:"n_estimators=100. Compare to tree. Feature importance plot." },
        { n:6, label:"Cross-Validation",    desc:"5-fold CV on all 3. Print mean ± std. Proper evaluation!" },
        { n:7, label:"Kaggle Submit",       desc:"predictions.csv. Submit. Screenshot leaderboard score. README badge!" },
      ],
      topics:[
        { text:"Logistic Regression",                            idea:"🔨 Build: Email Spam Detector — logistic regression on email features, print 'SPAM/HAM'." },
        { text:"Decision Trees & Random Forests",                idea:"🔨 Build: Mushroom Safety Classifier — is this mushroom poisonous? Random Forest tells you." },
        { text:"Confusion matrix, precision, recall, F1",        idea:"🔨 Build: Model Evaluator — pretty-print a confusion matrix with TP/FP/FN/TN labels." },
        { text:"Exploratory Data Analysis (EDA) workflow",       idea:"🔨 Build: Auto-EDA Tool — input any CSV, auto-print shape/nulls/distributions/correlations." },
        { text:"Feature engineering basics",                     idea:"🔨 Build: Feature Creator — add FamilySize, IsAlone, AgeGroup to Titanic, compare accuracy." },
      ]
    },
    { n:19, title:"NLP & Text Processing",
      git:"Start a GitHub Discussion on one of your repos asking for feedback. Engage the community.",
      daily:"Process one completely new text dataset every day",
      resources:["NLTK Book (nltk.org – free)","Hugging Face Course (huggingface.co – free)","Towards Data Science NLP"],
      capstone:{ title:"Product Review Sentiment Analyser", diff:"Intermediate", gh:"sentiment-analyser-nlp", desc:"Scrape reviews or use dataset. VADER scoring. +/–/neutral pie. Word clouds." },
      days:[
        { n:1, label:"Text Pipeline",      desc:"Paragraph → lowercase, punctuation-free, tokenised, stopwords removed, lemmatised." },
        { n:2, label:"TF-IDF Lab",         desc:"Build manually, then TfidfVectorizer. Find most important word per doc." },
        { n:3, label:"VADER Sentiment",    desc:"20 tweets/reviews. Positive/negative/neutral bar chart." },
        { n:4, label:"Spam Classifier",    desc:"SMS Spam dataset. TF-IDF + Naive Bayes. Print SPAM/HAM prediction." },
        { n:5, label:"Hugging Face Step",  desc:"pipeline('sentiment-analysis') on 10 sentences. pipeline('summarization')." },
        { n:6, label:"Text Summariser",    desc:"Extractive: rank sentences by TF-IDF. Top 3 = summary." },
        { n:7, label:"Review Analyser Push",desc:"Word clouds: positive words, negative complaints. Export PDF report." },
      ],
      topics:[
        { text:"Text preprocessing: tokenisation, stopwords",    idea:"🔨 Build: Text Cleaner CLI — input raw text, output clean/tokenised/lemmatised version." },
        { text:"TF-IDF vectorisation",                           idea:"🔨 Build: Document Similarity Scorer — TF-IDF cosine similarity between 2 articles." },
        { text:"Sentiment analysis with VADER",                  idea:"🔨 Build: Tweet Mood Tracker — analyse 50 tweets, plot mood distribution pie chart." },
        { text:"Naive Bayes spam classifier",                    idea:"🔨 Build: SMS Spam Filter — train on public SMS dataset, test your own messages." },
        { text:"Hugging Face pipelines",                         idea:"🔨 Build: AI News Summariser — fetch article, summarise with HuggingFace in 3 lines." },
      ]
    },
    { n:20, title:"Deep Learning + Gradio",
      git:"Set up GitHub Copilot (free for students). Use it to help write docstrings and tests.",
      daily:"Train a model locally, deploy with Gradio on Hugging Face Spaces the same day",
      resources:["fast.ai Practical Deep Learning (fast.ai – free)","Gradio Docs (gradio.app)","Keras Official Docs"],
      capstone:{ title:"🤖 Image Classifier Web App — Month 5 Capstone", diff:"Advanced", gh:"image-classifier-gradio", desc:"CNN on MNIST/CIFAR-10. model.h5 saved. Gradio UI. Deployed to HF Spaces." },
      days:[
        { n:1, label:"Neural Net on Paper",   desc:"Draw 3-layer network. Manual forward pass. Understand weights/bias/ReLU." },
        { n:2, label:"First Keras Model",     desc:"MNIST Sequential. Flatten→Dense(128)→Dense(10). 5 epochs → 97%." },
        { n:3, label:"CNN Power-Up",          desc:"Add Conv2D + MaxPooling. Compare accuracy. Visualise filters." },
        { n:4, label:"Training Dashboard",    desc:"Plot train vs val accuracy + loss. Spot overfit. Add Dropout." },
        { n:5, label:"Save & Load",           desc:"model.h5. Load in new script. Predict without retraining." },
        { n:6, label:"Gradio in 10 Lines",    desc:"Image input → prediction → confidence bar. Deploy to HF Spaces!" },
        { n:7, label:"Image Classifier Push", desc:"Top-3 confidence scores, sample images, model card. Share URL!" },
      ],
      topics:[
        { text:"Neural network: layers, weights, activations",   idea:"🔨 Build: XOR Solver NN — tiny 2-input network that learns XOR gate from scratch." },
        { text:"Keras Sequential model",                         idea:"🔨 Build: MNIST Digit Recogniser — train, evaluate, save. 97%+ accuracy in 20 lines." },
        { text:"Training loop, loss functions, optimisers",      idea:"🔨 Build: Loss Curve Plotter — plot training loss per epoch for 3 different optimisers." },
        { text:"Gradio for instant AI web apps",                 idea:"🔨 Build: Handwriting Recognition App — Gradio canvas input → model predicts digit." },
        { text:"Saving and loading Keras models",                idea:"🔨 Build: Offline Predictor — save model.h5, load in CLI, predict from user input." },
      ]
    },
  ]},

  /* ── MONTH 6 ── */
  { id:6, emoji:"🚀", title:"Advanced & Career", sub:"Deploy · Portfolio · Jobs", color:"#ef4444", weeks:[
    { n:21, title:"Advanced Python Patterns",
      git:"Add black, flake8, isort. Set up pre-commit hooks so code quality runs on every commit.",
      daily:"Refactor one old project each day using the new advanced pattern you just learned",
      resources:["Real Python: Decorators","Python Docs: asyncio","Fluent Python (book – recommended)"],
      capstone:{ title:"Async Web Scraper (10× Faster)", diff:"Advanced", gh:"async-scraper-python", desc:"asyncio + aiohttp. 50 URLs concurrently. Compare sync vs async. progress bar." },
      days:[
        { n:1, label:"Decorator Magic",     desc:"@timer, @log_calls, @retry(n). Apply to previous projects." },
        { n:2, label:"Generator Chains",    desc:"yield: infinite fibonacci, primes, squares. Chain generators." },
        { n:3, label:"Context Managers",    desc:"DatabaseConnection + TempFile using @contextmanager." },
        { n:4, label:"Async Basics",        desc:"async/await. Fetch 5 URLs concurrently. Compare time." },
        { n:5, label:"Type Hints",          desc:"Add type hints to expense tracker. Run mypy. Zero errors." },
        { n:6, label:"Code Quality",        desc:"black + flake8 + isort on ALL projects. Fix every warning." },
        { n:7, label:"Async Scraper Push",  desc:"tqdm progress bar, exponential backoff, rate limiting. Production!" },
      ],
      topics:[
        { text:"Decorators & closures",                         idea:"🔨 Build: @cache Decorator — memoise expensive functions (like fibonacci) with a dict cache." },
        { text:"Generators & the yield keyword",                idea:"🔨 Build: Infinite Prime Generator — yield primes forever; take(n) helper to get first N." },
        { text:"Custom context managers",                       idea:"🔨 Build: Timed Block — 'with timer():' context manager prints execution time on exit." },
        { text:"asyncio & async/await",                         idea:"🔨 Build: Async News Fetcher — fetch 20 news APIs simultaneously, print headlines." },
        { text:"Type hints + mypy",                             idea:"🔨 Build: Type-Safe Calculator — full type annotations; mypy shows zero errors." },
      ]
    },
    { n:22, title:"Testing & CI/CD",
      git:"Create .github/workflows/test.yml — auto-run pytest on every push to main. Green badge!",
      daily:"Write at least 5 new tests for existing code every day",
      resources:["Real Python: pytest Guide","pytest Official Docs","GitHub Actions Docs (free)"],
      capstone:{ title:"Tested Expense Tracker v2.0", diff:"Intermediate", gh:"expense-tracker-tested", desc:"20+ pytest tests. GitHub Actions CI. Coverage badge. CONTRIBUTING.md." },
      days:[
        { n:1, label:"First pytest",          desc:"test_add, test_divide_by_zero, test_negative. See green checkmarks." },
        { n:2, label:"Fixtures & Parametrize",desc:"@pytest.fixture for reusable data. parametrize: 10 inputs, 1 test." },
        { n:3, label:"Mock & Patch",          desc:"unittest.mock.patch fakes API calls. Test offline. Critical skill." },
        { n:4, label:"Coverage Report",       desc:"pytest --cov. Aim 80%+. See uncovered lines in HTML." },
        { n:5, label:"Docstrings",            desc:"Google-style docstrings. pdoc3 generates HTML docs from them." },
        { n:6, label:"GitHub Actions CI",     desc:"test.yml: trigger on push, install deps, run pytest. Auto-tested!" },
        { n:7, label:"Tested App Push",       desc:"codecov.io coverage badge in README. CONTRIBUTING.md. Done!" },
      ],
      topics:[
        { text:"pytest basics and test discovery",               idea:"🔨 Build: Calculator Test Suite — 15 tests covering every operation including edge cases." },
        { text:"@pytest.fixture and parametrize",                idea:"🔨 Build: Parametrised String Tests — test is_palindrome() with 20 cases in one decorator." },
        { text:"unittest.mock — patching external calls",        idea:"🔨 Build: Offline API Tests — mock requests.get to test weather parser without internet." },
        { text:"Code coverage with pytest-cov",                  idea:"🔨 Build: 80% Coverage Project — track coverage on expense tracker, hit 80% threshold." },
        { text:"GitHub Actions CI pipeline",                     idea:"🔨 Build: Auto-Test on Push — YAML workflow: checkout, pip install, pytest, report." },
      ]
    },
    { n:23, title:"Capstone Architecture",
      git:"Full GitFlow: main + dev + feature/xyz branches. All merges via Pull Request with description.",
      daily:"2 focused hours building the capstone. Commit every single night before sleep.",
      resources:["The 12-Factor App (12factor.net)","Flask Application Factory Pattern","python-dotenv Docs"],
      capstone:{ title:"AI Study Assistant — Architecture Done", diff:"Advanced", gh:"ai-study-assistant", desc:"Flask + SQLAlchemy + OpenAI. Auth + file upload + logging + .env secrets." },
      days:[
        { n:1, label:"Architecture Day",    desc:"Draw DB schema, API endpoints, folder structure. README-driven dev." },
        { n:2, label:"Project Scaffold",    desc:"app/, tests/, static/, templates/, config.py, .env, .gitignore." },
        { n:3, label:"Auth System",         desc:"Flask-Login + bcrypt. Register/Login/Logout. Protected routes." },
        { n:4, label:"File Upload",         desc:"Flask-Uploads. PDF + TXT. PyPDF2 text extraction. Save to DB." },
        { n:5, label:"Logging",             desc:"Python logging. Log logins/uploads/errors to rotating app.log." },
        { n:6, label:"Secrets Management",  desc:".env for ALL secrets. python-dotenv. .env.example for contributors." },
        { n:7, label:"Architecture Push",   desc:"Auth + upload working. GitHub Issues open. Kanban board created." },
      ],
      topics:[
        { text:"Project planning: schema, API design",           idea:"🔨 Build: ERD Diagram — draw the database schema for your capstone in draw.io + push PNG." },
        { text:"Production project structure",                   idea:"🔨 Build: App Factory Pattern — restructure Flask app into create_app() factory properly." },
        { text:"Environment variables with .env",                idea:"🔨 Build: Config Manager — dev/staging/prod configs from .env, loaded via python-dotenv." },
        { text:"Python logging module",                          idea:"🔨 Build: Request Logger — log every Flask request (method/path/status/time) to rotating file." },
        { text:"Docker basics (optional stretch)",               idea:"🔨 Build: Dockerised Flask — Dockerfile + docker-compose.yml. Run app in container." },
      ]
    },
    { n:24, title:"Capstone — AI Features",
      git:"Add a GIF demo to your README using Loom + Giphy. Add topic/language badges from shields.io.",
      daily:"One new feature per day. Commit every night with a clear commit message.",
      resources:["OpenAI API Docs","Gemini API (free tier – Google AI Studio)","Bootstrap 5 Docs"],
      capstone:{ title:"AI Study Assistant — Core Features Complete", diff:"Advanced", gh:"ai-study-assistant", desc:"AI summarise + quiz generation + chatbot + Bootstrap UI + caching. All working." },
      days:[
        { n:1, label:"AI Summariser",     desc:"OpenAI/Gemini API. Extract text → send → get summary → show on page." },
        { n:2, label:"Quiz Generator",    desc:"Prompt: '5 MCQ as JSON'. Parse response. Store. Auto-grade quiz." },
        { n:3, label:"Study Chatbot",     desc:"Chat about uploaded notes. Stream Flask response. Feels like GPT!" },
        { n:4, label:"Bootstrap UI",      desc:"Sidebar nav, cards, modals, quiz progress bars, dark mode toggle." },
        { n:5, label:"Dashboard Analytics",desc:"Notes count, quizzes, avg score, streak. Chart.js via CDN." },
        { n:6, label:"Caching",           desc:"Flask-Caching on AI responses. Loading spinners. Feels fast." },
        { n:7, label:"Feature-Complete Push",desc:"2-min Loom GIF. Full API docs. GitHub Release v0.9 beta." },
      ],
      topics:[
        { text:"Integrating OpenAI / Gemini API",                idea:"🔨 Build: AI Text Rewriter — paste any paragraph, AI rewrites it in 5 different tones." },
        { text:"Streaming API responses in Flask",               idea:"🔨 Build: Real-Time AI Chat — Flask SSE endpoint streams GPT response word-by-word." },
        { text:"Prompt engineering for structured outputs",      idea:"🔨 Build: JSON Quiz Generator — prompt for MCQ JSON, parse reliably, handle bad output." },
        { text:"Bootstrap 5 responsive layout",                  idea:"🔨 Build: Responsive Dashboard — sidebar collapses on mobile, cards stack correctly." },
        { text:"Flask-Caching for performance",                  idea:"🔨 Build: Cached API Proxy — cache expensive AI calls for 1 hour, serve from cache." },
      ]
    },
    { n:25, title:"Deployment & DevOps",
      git:"Add all secrets to GitHub Secrets. Reference them in Actions YAML (never hardcode keys).",
      daily:"1 hr deployment work + 1 hr polishing the live app + 1 commit",
      resources:["Render.com Docs (render.com)","Railway.app Quickstart","Uptime Robot (free monitoring)"],
      capstone:{ title:"AI Study Assistant — LIVE on the Internet! 🎉", diff:"Advanced", gh:"ai-study-assistant", desc:"Render deploy + PostgreSQL prod + Uptime Robot monitoring + security headers." },
      days:[
        { n:1, label:"Prod Config",        desc:"Dev vs Prod configs. DEBUG=False. Gunicorn wsgi server." },
        { n:2, label:"DB Migration",       desc:"Flask-Migrate: db init/migrate/upgrade. Schema changes safely." },
        { n:3, label:"Deploy to Render",   desc:"Connect GitHub → Render. Set env vars. Watch build logs. First live URL!" },
        { n:4, label:"PostgreSQL Prod",    desc:"Render free PostgreSQL. Update DATABASE_URL. Run migrations." },
        { n:5, label:"Monitoring",         desc:"Uptime Robot every 5 min. /health endpoint. Sentry error tracking." },
        { n:6, label:"Security",           desc:"Flask-Talisman (HTTPS/CSP), Flask-Limiter, input sanitisation." },
        { n:7, label:"v1.0 Launch!",       desc:"GitHub Release v1.0.0. LinkedIn post. dev.to article. Share!" },
      ],
      topics:[
        { text:"Deploying Flask to Render / Railway",            idea:"🔨 Build: Deploy a Hello World — smallest possible Flask app deployed live in 15 min." },
        { text:"PostgreSQL in production",                       idea:"🔨 Build: Prod DB Migration — migrate SQLite local → PostgreSQL prod without data loss." },
        { text:"Environment secrets in GitHub Actions",          idea:"🔨 Build: Secure CI Pipeline — use ${{ secrets.API_KEY }} in Actions YAML, never in code." },
        { text:"Uptime monitoring & /health endpoint",           idea:"🔨 Build: Health Check API — /health returns JSON with DB status, version, uptime." },
        { text:"Security headers with Flask-Talisman",          idea:"🔨 Build: Security Audit Script — check your live app for missing security headers." },
      ]
    },
    { n:26, title:"Career Prep & Open Source",
      git:"Pin 6 best repos. Update ALL READMEs with GIF demos, live links, tech stack badges.",
      daily:"1 hr portfolio polish + 1 hr LeetCode Easy + contribute to OSS",
      resources:["GitHub Student Developer Pack (free)","LeetCode Easy problems","dev.to (write your story)"],
      capstone:{ title:"Portfolio Showcase + First Open Source PR", diff:"Intermediate", gh:"your-github-profile", desc:"Profile README. 6 polished repos. First OSS PR. LinkedIn post. Internship applications." },
      days:[
        { n:1, label:"GitHub Profile Glow-Up", desc:"Profile README: bio, badges, stats card, top projects. Pin 6 best repos." },
        { n:2, label:"README Makeover",        desc:"GIF demo, tech stack, install steps, live link for all 6 capstones." },
        { n:3, label:"First OSS PR",           desc:"'good first issue' label. Fork, fix, PR with clear description. OSS contributor!" },
        { n:4, label:"DSA Crash Course",       desc:"Stack, queue, linked list in Python. 5 LeetCode Easy array problems." },
        { n:5, label:"Mock Interview Prep",    desc:"Explain each project: problem / hardest part / what you'd improve. Record yourself." },
        { n:6, label:"LinkedIn Post",          desc:"'6 months ago I didn't know Python. Today I built an AI app. Here's what I learned 🧵'" },
        { n:7, label:"Day 182 — You Made It!", desc:"182 commits. 6 deployed apps. 1 OSS PR. Open internship applications. You're ready! 🚀" },
      ],
      topics:[
        { text:"GitHub profile README optimisation",             idea:"🔨 Build: Animated Profile README — add GitHub stats cards, streak counter, tech badges." },
        { text:"Open source contribution workflow",              idea:"🔨 Build: First OSS PR — fix a typo/bug in any Python project, open a real PR." },
        { text:"DSA basics: arrays, stacks, queues",             idea:"🔨 Build: Stack-Based Bracket Validator — check if '({[]})' is balanced using a list-stack." },
        { text:"Interview: explain your projects clearly",       idea:"🔨 Build: Project Pitch Deck — 1-page markdown 'elevator pitch' for each of your 6 projects." },
        { text:"LinkedIn & resume optimisation",                 idea:"🔨 Build: Resume PDF Generator — Python script fills a template with your projects → PDF." },
      ]
    },
  ]},
];

const REPOS = [
  { name:"python-projects-for-beginners", org:"intermediate-python", tag:"Beginner", stars:"3.2k", c:"#3b82f6", desc:"50+ beginner projects with solutions" },
  { name:"Python (TheAlgorithms)", org:"TheAlgorithms", tag:"DSA", stars:"190k", c:"#f59e0b", desc:"Every algorithm in clean Python" },
  { name:"ML-For-Beginners", org:"microsoft", tag:"AI/ML", stars:"68k", c:"#ef4444", desc:"Microsoft's 12-week ML curriculum" },
  { name:"microblog", org:"miguelgrinberg", tag:"Web Dev", stars:"15k", c:"#10b981", desc:"Flask Mega-Tutorial companion app" },
  { name:"awesome-python", org:"vinta", tag:"Reference", stars:"220k", c:"#a855f7", desc:"Curated list of Python libraries" },
];

/* ─── HELPER COMPONENTS ─────────────────────────────────────── */
function Badge({ text, style }) {
  return <span style={{ display:"inline-block", borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700, letterSpacing:0.3, ...style }}>{text}</span>;
}
function DiffBadge({ diff }) {
  const d = DIFF[diff] || DIFF.Easy;
  return <Badge text={diff} style={{ background:d.bg, border:`1px solid ${d.border}`, color:d.text }} />;
}
function SectionTitle({ children, color="#8b8ba7" }) {
  return <div style={{ fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color, marginBottom:10 }}>{children}</div>;
}
function Card({ children, style={}, color }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${color ? color+"30" : C.border}`, borderRadius:12, padding:16, ...style }}>
      {children}
    </div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────── */
export default function App() {
  const [mIdx, setMIdx]   = useState(0);
  const [wIdx, setWIdx]   = useState(0);
  const [tab, setTab]     = useState("topics");   // topics | days | project
  const [dayOpen, setDayOpen] = useState(null);
  const [topicOpen, setTopicOpen] = useState(null);
  const [checks, setChecks] = useState({});
  const [tChecks, setTChecks] = useState({});

  const month = DATA[mIdx];
  const week  = month.weeks[wIdx];
  const mc    = month.color;

  const toggle  = k => setChecks(p => ({ ...p, [k]: !p[k] }));
  const toggleT = k => setTChecks(p => ({ ...p, [k]: !p[k] }));

  const weekProgress = (m, w) => w.days.filter(d => checks[`${m.id}-${w.n}-${d.n}`]).length;
  const monthProgress = m => {
    const done  = m.weeks.reduce((s,w) => s + weekProgress(m,w), 0);
    return Math.round((done / (m.weeks.length*7)) * 100);
  };
  const totalDone = DATA.reduce((s,m) => s + m.weeks.reduce((ws,w) => ws + weekProgress(m,w), 0), 0);
  const totalDays = 26 * 7;
  const globalPct = Math.round((totalDone / totalDays) * 100);
  const curWeekDone = weekProgress(month, week);

  return (
    <div style={{
      display:"flex", height:"100vh", width:"100vw",
      background:C.bg, color:C.t1, overflow:"hidden",
      fontFamily:"-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ══════════ LEFT SIDEBAR ══════════ */}
      <aside style={{ width:210, flexShrink:0, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", background:"#0e0e18", overflow:"hidden" }}>
        {/* Logo */}
        <div style={{ padding:"18px 16px 14px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#3b82f6,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🐍</div>
            <div>
              <div style={{ fontSize:12, fontWeight:800, color:C.t1, letterSpacing:0.2 }}>Python Mastery</div>
              <div style={{ fontSize:10, color:C.t3, marginTop:1 }}>B.Tech CSE · AI/ML</div>
            </div>
          </div>
          {/* Global progress */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.t2, marginBottom:7 }}>
              <span>Overall Progress</span>
              <span style={{ color:C.blue, fontWeight:700 }}>{globalPct}%</span>
            </div>
            <div style={{ background:C.border, borderRadius:4, height:5 }}>
              <div style={{ height:"100%", width:`${globalPct}%`, background:"linear-gradient(90deg,#3b82f6,#a855f7)", borderRadius:4, transition:"width .4s" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:C.t3, marginTop:6 }}>
              <span>{totalDone} days done</span><span>{totalDays-totalDone} left</span>
            </div>
          </div>
        </div>

        {/* Month nav */}
        <div style={{ flex:1, overflowY:"auto", padding:"10px 8px" }}>
          <SectionTitle>Months</SectionTitle>
          {DATA.map((m,i) => {
            const pct = monthProgress(m);
            const active = mIdx===i;
            return (
              <div key={i} onClick={() => { setMIdx(i); setWIdx(0); setDayOpen(null); setTopicOpen(null); }}
                style={{ borderRadius:10, padding:"9px 10px", marginBottom:3, cursor:"pointer",
                  background: active ? `${m.color}18` : "transparent",
                  border:`1px solid ${active ? m.color+"35" : "transparent"}`,
                  transition:"all .15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <span style={{ fontSize:16 }}>{m.emoji}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:700, color: active ? C.t1 : C.t2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>M{m.id}. {m.title}</div>
                    <div style={{ fontSize:9, color:C.t3, marginTop:1 }}>{m.sub}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color: active ? m.color : C.t3 }}>{pct}%</span>
                </div>
                {active && <div style={{ marginTop:6, background:C.border, borderRadius:3, height:3 }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:m.color, borderRadius:3, transition:"width .4s" }} />
                </div>}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:9, color:C.t3, lineHeight:1.7 }}>182 days · 26 weeks · 6 capstone projects<br/>Har din ek commit. 🇮🇳</div>
        </div>
      </aside>

      {/* ══════════ WEEK SIDEBAR ══════════ */}
      <aside style={{ width:230, flexShrink:0, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", background:C.bg, overflow:"hidden" }}>
        {/* Month header */}
        <div style={{ padding:"15px 14px 12px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:8 }}>
            <span style={{ fontSize:20 }}>{month.emoji}</span>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:mc }}>Month {month.id}: {month.title}</div>
              <div style={{ fontSize:10, color:C.t3 }}>{month.sub}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {[["topics","📚 Topics"],["days","📅 Daily"],["project","🏗️ Project"]].map(([v,l]) => (
              <button key={v} onClick={() => setTab(v)}
                style={{ flex:1, background: tab===v ? mc : C.card, border:`1px solid ${tab===v ? mc : C.border}`,
                  borderRadius:7, padding:"5px 0", cursor:"pointer", color: tab===v ? "#fff" : C.t2,
                  fontSize:9, fontWeight:700, transition:"all .15s" }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Week list */}
        <div style={{ flex:1, overflowY:"auto", padding:10 }}>
          <SectionTitle>Weeks</SectionTitle>
          {month.weeks.map((w,wi) => {
            const done = weekProgress(month, w);
            const active = wIdx===wi;
            const d = DIFF[w.capstone.diff] || DIFF.Easy;
            return (
              <div key={wi} onClick={() => { setWIdx(wi); setDayOpen(null); setTopicOpen(null); }}
                style={{ borderRadius:10, padding:"11px 12px", marginBottom:5, cursor:"pointer",
                  background: active ? `${mc}12` : C.card,
                  border:`1px solid ${active ? mc+"45" : C.border}`,
                  transition:"all .15s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                  <Badge text={`W${w.n}`} style={{ background: active ? mc : C.border, color: active ? "#fff" : C.t2, fontSize:10 }} />
                  <DiffBadge diff={w.capstone.diff} />
                </div>
                <div style={{ fontSize:12, fontWeight:700, color: active ? C.t1 : C.t2, marginBottom:4, lineHeight:1.4 }}>{w.title}</div>
                <div style={{ fontSize:10, color:C.t3, marginBottom:7, lineHeight:1.4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{w.capstone.title}</div>
                <div style={{ background:C.border, borderRadius:3, height:3, marginBottom:3 }}>
                  <div style={{ height:"100%", width:`${Math.round((done/7)*100)}%`, background: done===7 ? C.green : mc, borderRadius:3, transition:"width .3s" }} />
                </div>
                <div style={{ fontSize:9, color:C.t3 }}>{done}/7 days complete</div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Top bar */}
        <div style={{ padding:"14px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:"#0e0e18", flexShrink:0 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <Badge text={`W${week.n}`} style={{ background:mc, color:"#fff", fontSize:11 }} />
              <span style={{ fontSize:16, fontWeight:800, color:C.t1 }}>{week.title}</span>
              <DiffBadge diff={week.capstone.diff} />
            </div>
            <div style={{ fontSize:11, color:C.t3 }}>Month {month.id}: {month.title} · {week.n * 7 - 6}–{week.n * 7} of 182 days</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10, color:C.t3 }}>This week</div>
              <div style={{ fontSize:13, fontWeight:800, color: curWeekDone===7 ? C.green : mc }}>{curWeekDone}/7 days</div>
            </div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
              <div style={{ fontSize:14, fontWeight:900, color:globalPct===100?C.green:mc }}>{globalPct}%</div>
              <div style={{ fontSize:8, color:C.t3 }}>global</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>

          {/* ── TOPICS TAB ── */}
          {tab==="topics" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, alignItems:"start" }}>
              {/* Topics with project ideas */}
              <div>
                <SectionTitle color={mc}>Topics & What to Build</SectionTitle>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {week.topics.map((t,ti) => {
                    const k = `t-${month.id}-${week.n}-${ti}`;
                    const done = !!tChecks[k];
                    const open = topicOpen === ti;
                    return (
                      <div key={ti} style={{ background: open ? `${mc}0a` : C.card, border:`1px solid ${open ? mc+"35" : C.border}`, borderRadius:11, overflow:"hidden", transition:"all .2s" }}>
                        <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"12px 14px", cursor:"pointer" }}
                          onClick={() => setTopicOpen(open ? null : ti)}>
                          {/* checkbox */}
                          <div onClick={e => { e.stopPropagation(); toggleT(k); }}
                            style={{ width:18, height:18, borderRadius:5, border:`2px solid ${done ? mc : C.t3}`,
                              background: done ? mc : "transparent", display:"flex", alignItems:"center",
                              justifyContent:"center", flexShrink:0, marginTop:1, cursor:"pointer", transition:"all .15s" }}>
                            {done && <span style={{ color:"#fff", fontSize:11, lineHeight:1 }}>✓</span>}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:600, color: done ? C.t3 : C.t1, textDecoration: done ? "line-through" : "none", lineHeight:1.4 }}>{t.text}</div>
                          </div>
                          <span style={{ fontSize:11, color:open ? mc : C.t3, marginTop:2 }}>{open?"▲":"▼"}</span>
                        </div>
                        {open && (
                          <div style={{ padding:"0 14px 12px 42px", borderTop:`1px solid ${mc}20` }}>
                            <div style={{ background:`${mc}10`, border:`1px solid ${mc}25`, borderRadius:8, padding:"10px 12px", marginTop:8 }}>
                              <div style={{ fontSize:9, fontWeight:800, color:mc, letterSpacing:1.5, textTransform:"uppercase", marginBottom:5 }}>GitHub Project Idea</div>
                              <div style={{ fontSize:12, color:C.t1, lineHeight:1.6 }}>{t.idea}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right column */}
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {/* Capstone project card */}
                <div>
                  <SectionTitle color={mc}>Week Capstone Project</SectionTitle>
                  <Card color={mc}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <DiffBadge diff={week.capstone.diff} />
                      <div style={{ background:"#1a1a2e", border:`1px solid ${C.border}`, borderRadius:6, padding:"3px 9px", fontSize:10, color:C.t2 }}>
                        🐙 github/{week.capstone.gh}
                      </div>
                    </div>
                    <div style={{ fontSize:15, fontWeight:800, color:C.t1, marginBottom:6 }}>{week.capstone.title}</div>
                    <div style={{ fontSize:12, color:C.t2, lineHeight:1.7 }}>{week.capstone.desc}</div>
                  </Card>
                </div>

                {/* Git practice */}
                <Card>
                  <SectionTitle color="#f97316">🐙 Git Practice This Week</SectionTitle>
                  <div style={{ fontSize:12, color:C.t2, lineHeight:1.8 }}>{week.git}</div>
                </Card>

                {/* Daily habit */}
                <Card>
                  <SectionTitle color="#10b981">⏰ Daily Study Habit</SectionTitle>
                  <div style={{ fontSize:12, color:C.t2, lineHeight:1.8 }}>{week.daily}</div>
                </Card>

                {/* Resources */}
                <Card>
                  <SectionTitle color="#a855f7">🔗 Free Resources</SectionTitle>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {week.resources.map((r,ri) => (
                      <div key={ri} style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:5, height:5, borderRadius:"50%", background:mc, flexShrink:0 }} />
                        <span style={{ fontSize:12, color:C.t2 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── DAILY PROJECTS TAB ── */}
          {tab==="days" && (
            <div>
              <SectionTitle color={mc}>7-Day Build Schedule — Week {week.n}</SectionTitle>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {week.days.map((d,di) => {
                  const k = `${month.id}-${week.n}-${d.n}`;
                  const done = !!checks[k];
                  const open = dayOpen===di;
                  return (
                    <div key={di} onClick={() => setDayOpen(open ? null : di)}
                      style={{ background: done ? "#0a150a" : open ? `${mc}0a` : C.card,
                        border:`1px solid ${done ? C.green+"30" : open ? mc+"40" : C.border}`,
                        borderRadius:11, overflow:"hidden", cursor:"pointer", transition:"all .15s" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px" }}>
                        <div onClick={e => { e.stopPropagation(); toggle(k); }}
                          style={{ width:20, height:20, borderRadius:6, border:`2px solid ${done ? C.green : C.t3}`,
                            background: done ? C.green : "transparent", display:"flex", alignItems:"center",
                            justifyContent:"center", flexShrink:0, cursor:"pointer", transition:"all .15s" }}>
                          {done && <span style={{ color:"#fff", fontSize:12, lineHeight:1 }}>✓</span>}
                        </div>
                        <Badge text={`Day ${d.n}`} style={{ background:`${mc}20`, border:`1px solid ${mc}40`, color:mc, flexShrink:0 }} />
                        <span style={{ fontSize:13, fontWeight:700, color: done ? C.t3 : C.t1, textDecoration: done ? "line-through" : "none" }}>{d.label}</span>
                      </div>
                      {open && (
                        <div style={{ padding:"0 14px 12px 44px", borderTop:`1px solid ${mc}15` }}>
                          <div style={{ fontSize:12, color:C.t2, lineHeight:1.7, borderLeft:`3px solid ${mc}50`, paddingLeft:10 }}>{d.desc}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── PROJECT TAB ── */}
          {tab==="project" && (
            <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:14, alignItems:"start" }}>
              <div>
                <SectionTitle color={mc}>Capstone Project Details</SectionTitle>
                <Card color={mc} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <DiffBadge diff={week.capstone.diff} />
                    <div style={{ background:C.border, borderRadius:6, padding:"3px 9px", fontSize:10, color:C.t2 }}>🐙 /{week.capstone.gh}</div>
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color:C.t1, marginBottom:8 }}>{week.capstone.title}</div>
                  <div style={{ fontSize:13, color:C.t2, lineHeight:1.7 }}>{week.capstone.desc}</div>
                </Card>

                <SectionTitle color="#f59e0b">📅 Build It Day by Day</SectionTitle>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {week.days.map((d,di) => {
                    const k = `${month.id}-${week.n}-${d.n}`;
                    const done = !!checks[k];
                    return (
                      <div key={di} style={{ display:"flex", gap:10, padding:"10px 12px", background: done?"#0a150a":C.card, border:`1px solid ${done?C.green+"25":C.border}`, borderRadius:9 }}>
                        <div onClick={() => toggle(k)}
                          style={{ width:18, height:18, borderRadius:5, border:`2px solid ${done?C.green:C.t3}`, background: done?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2, cursor:"pointer" }}>
                          {done && <span style={{ color:"#fff", fontSize:10 }}>✓</span>}
                        </div>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color: done?C.t3:C.t1, textDecoration: done?"line-through":"none" }}>Day {d.n}: {d.label}</div>
                          <div style={{ fontSize:11, color:C.t3, marginTop:2, lineHeight:1.5 }}>{d.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <SectionTitle color="#a855f7">🔨 Topic Project Ideas (this week)</SectionTitle>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {week.topics.map((t,ti) => (
                    <Card key={ti}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.t3, marginBottom:4, lineHeight:1.4 }}>{t.text}</div>
                      <div style={{ fontSize:11, color:C.t1, lineHeight:1.6 }}>{t.idea}</div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ══════════ RIGHT PANEL ══════════ */}
      <aside style={{ width:252, flexShrink:0, borderLeft:`1px solid ${C.border}`, display:"flex", flexDirection:"column", background:"#0e0e18", overflow:"hidden" }}>
        {/* Stats */}
        <div style={{ padding:"14px 14px 12px", borderBottom:`1px solid ${C.border}` }}>
          <SectionTitle>Your Stats</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
            {[
              { l:"Days Done",   v:totalDone,           c:C.blue },
              { l:"Remaining",   v:totalDays-totalDone, c:C.t3 },
              { l:"This Week",   v:`${curWeekDone}/7`,  c:mc },
              { l:"Completion",  v:`${globalPct}%`,     c:"#a855f7" },
            ].map((s,i) => (
              <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 11px" }}>
                <div style={{ fontSize:18, fontWeight:900, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:9, color:C.t3, marginTop:2, textTransform:"uppercase", letterSpacing:0.5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick month jump */}
        <div style={{ padding:"12px 14px 10px", borderBottom:`1px solid ${C.border}` }}>
          <SectionTitle>Quick Jump</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:5 }}>
            {DATA.map((m,i) => (
              <button key={i} onClick={() => { setMIdx(i); setWIdx(0); setDayOpen(null); setTopicOpen(null); }}
                style={{ background: mIdx===i ? `${m.color}25` : C.card,
                  border:`1px solid ${mIdx===i ? m.color+"50" : C.border}`,
                  borderRadius:8, padding:"8px 4px", cursor:"pointer", fontSize:16,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:2, transition:"all .15s" }}>
                <span>{m.emoji}</span>
                <span style={{ fontSize:8, color: mIdx===i ? m.color : C.t3, fontWeight:700 }}>M{m.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Starter repos */}
        <div style={{ flex:1, overflowY:"auto", padding:"12px 14px" }}>
          <SectionTitle>🍴 Fork These on Day 1</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {REPOS.map((r,i) => (
              <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <Badge text={r.tag} style={{ background:r.c+"20", border:`1px solid ${r.c}40`, color:r.c }} />
                  <span style={{ fontSize:9, color:C.amber }}>⭐ {r.stars}</span>
                </div>
                <div style={{ fontSize:11, fontWeight:700, color:C.t1, marginBottom:2 }}>{r.org}/{r.name}</div>
                <div style={{ fontSize:10, color:C.t3, lineHeight:1.4 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation footer */}
        <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ background:`linear-gradient(135deg,#0f0f2a,#1a0f2a)`, border:`1px solid #2d2d45`, borderRadius:10, padding:"11px 13px" }}>
            <div style={{ fontSize:11, fontWeight:800, color:C.t1, marginBottom:4 }}>💪 Stay Consistent</div>
            <div style={{ fontSize:10, color:C.t3, lineHeight:1.7 }}>Har din ek commit.<br/>182 days = job ready. 🇮🇳🚀</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
