import { useState, useEffect, useCallback, useRef } from "react";

/* ─────────────────────────── GLOBAL CSS ─────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#04040f;overflow-x:hidden}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#07071a}
::-webkit-scrollbar-thumb{background:#1c1c42;border-radius:4px}
.app{font-family:'DM Sans',sans-serif;background:#04040f;min-height:100vh;color:#e8e8f5}
.mono{font-family:'JetBrains Mono',monospace}
.syne{font-family:'Syne',sans-serif}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}
@keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes unlockPulse{0%{box-shadow:0 0 0 0 #10b98160}70%{box-shadow:0 0 0 18px #10b98100}100%{box-shadow:0 0 0 0 #10b98100}}

.fade-up{animation:fadeUp .4s ease both}
.fade-in{animation:fadeIn .3s ease both}
.float{animation:float 3s ease-in-out infinite}
.spin{animation:spin .7s linear infinite;display:inline-block}
.pop{animation:pop .3s ease}
.unlock-pulse{animation:unlockPulse 1.2s ease 2}

/* Layout */
.wrap{display:flex;min-height:100vh}
.sidebar{width:240px;flex-shrink:0;background:#06061c;border-right:1px solid #0f0f30;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
.main{flex:1;overflow-x:hidden;min-width:0;padding-bottom:80px}
@media(max-width:860px){.sidebar{display:none}.mob{display:flex!important}}
.mob{display:none;position:fixed;bottom:0;left:0;right:0;z-index:200;background:#06061c;border-top:1px solid #0f0f30;padding:6px 0}

/* Cards */
.card{background:#080820;border:1px solid #12123a;border-radius:14px;transition:border-color .2s}
.card:hover{border-color:#22225a}
.card-hi{border-color:#3b82f640;box-shadow:0 0 24px #3b82f614}
.card-green{border-color:#10b98150;box-shadow:0 0 20px #10b98112}
.card-gold{border-color:#f59e0b50;box-shadow:0 0 20px #f59e0b12}

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:9px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;transition:all .18s;white-space:nowrap;user-select:none}
.btn-py{background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;box-shadow:0 0 16px #3b82f630}
.btn-py:hover{filter:brightness(1.15);transform:translateY(-1px)}
.btn-green{background:linear-gradient(135deg,#059669,#047857);color:#fff;box-shadow:0 0 16px #10b98130}
.btn-green:hover{filter:brightness(1.15);transform:translateY(-1px)}
.btn-amber{background:linear-gradient(135deg,#d97706,#b45309);color:#fff}
.btn-amber:hover{filter:brightness(1.12);transform:translateY(-1px)}
.btn-ghost{background:transparent;border:1px solid #1a1a48;color:#5050a0}
.btn-ghost:hover{background:#0c0c30;color:#e8e8f5;border-color:#2a2a68}
.btn-sm{padding:5px 12px;font-size:12px;border-radius:7px}
.btn:disabled{opacity:.35;cursor:not-allowed;transform:none!important}

/* Inputs */
.inp{width:100%;background:#05051a;border:1px solid #101038;border-radius:8px;padding:9px 14px;color:#e8e8f5;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s}
.inp:focus{border-color:#3b82f6;box-shadow:0 0 0 3px #3b82f618}
.inp::placeholder{color:#222248}

/* Badges */
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:700;border:1px solid}
.b-easy{color:#4ade80;background:#021a09;border-color:#14532d}
.b-med{color:#fbbf24;background:#180d00;border-color:#7c3800}
.b-hard{color:#f87171;background:#1a0404;border-color:#7f1d1d}
.b-vhard{color:#c084fc;background:#120525;border-color:#6b21a8}

/* Progress */
.pbar{height:5px;background:#08082a;border-radius:999px;overflow:hidden}
.pfill{height:100%;border-radius:999px;transition:width .7s cubic-bezier(.4,0,.2,1)}

/* Nav */
.nav-it{display:flex;align-items:center;gap:9px;padding:9px 14px;margin:1px 8px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:500;color:#3a3a70;transition:all .18s;border:1px solid transparent;position:relative}
.nav-it:hover{color:#7070b8;background:#0a0a2c}
.nav-it.on{color:#e8e8f5;background:#0e0e38;border-color:#1e1e58}
.nav-it.on::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:linear-gradient(180deg,#3b82f6,#10b981);border-radius:2px}

/* Topic checkbox */
.topic-row{display:flex;gap:12px;padding:11px 14px;border-radius:10px;cursor:pointer;transition:all .2s;align-items:flex-start;border:1px solid transparent}
.topic-row:hover{background:#0a0a28;border-color:#1a1a48}
.topic-row.done{background:#021508;border-color:#14532d60}

/* Q card */
.q-row{padding:11px 14px;border-radius:9px;border:1px solid #0e0e30;background:#060618;transition:border-color .15s;margin-bottom:6px}
.q-row:hover{border-color:#1e1e50}

/* Repo card */
.repo-card{background:#060618;border:1px solid #0e0e30;border-radius:10px;padding:14px 16px;transition:all .22s;cursor:pointer}
.repo-card:hover{border-color:#3b82f640;transform:translateY(-2px);box-shadow:0 6px 20px #3b82f612}

/* Section label */
.sec-label{font-size:11px;font-weight:700;color:#30305a;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px}

/* Scrollable row */
.srow{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;padding:2px}
.srow::-webkit-scrollbar{display:none}

/* Tabs */
.tab-row{display:flex;gap:3px;border-bottom:1px solid #0f0f30;padding-bottom:4px;margin-bottom:18px;overflow-x:auto;scrollbar-width:none}
.tab-row::-webkit-scrollbar{display:none}
.tab-b{flex-shrink:0;padding:7px 14px;border-radius:8px;border:none;background:transparent;color:#303060;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;transition:all .2s}
.tab-b.on{background:#0c0c34;color:#e8e8f5}
.tab-b:hover:not(.on){color:#6060a8;background:#080826}

/* Grids */
.g2{display:grid;grid-template-columns:1fr;gap:12px}
@media(min-width:580px){.g2{grid-template-columns:1fr 1fr}}
.g3{display:grid;grid-template-columns:1fr;gap:10px}
@media(min-width:720px){.g3{grid-template-columns:1fr 1fr}}
@media(min-width:1100px){.g3{grid-template-columns:1fr 1fr 1fr}}
.g4{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
@media(min-width:900px){.g4{grid-template-columns:repeat(4,1fr)}}

/* Code */
.code{background:#02020c;border:1px solid #0e0e2a;border-radius:9px;padding:12px 15px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#7070c8;overflow-x:auto;white-space:pre;line-height:1.75}

/* shimmer xp bar */
.xp-bar{background:linear-gradient(90deg,#3b82f6,#10b981,#f59e0b,#3b82f6);background-size:300% 100%;animation:shimmer 3s linear infinite}

/* ML unlock banner */
.ml-banner{background:linear-gradient(135deg,#03190e,#051a0a);border:1px solid #10b98160;border-radius:16px;padding:28px 24px;animation:unlockPulse 1.5s ease 2}

/* Theory section */
.theory-card{background:#080820;border:1px solid #12123a;border-radius:12px;padding:14px 16px;cursor:pointer;transition:all .2s}
.theory-card:hover{border-color:#3b82f660;background:#0a0a24}
.method-pill{display:inline-block;background:#3b82f612;color:#3b82f6;border:1px solid #3b82f630;border-radius:6px;padding:3px 10px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}

/* Responsive improvements */
@media(max-width:480px){
  .g4{grid-template-columns:repeat(2,1fr)!important}
  .btn{font-size:12px;padding:6px 12px}
  .topic-row{padding:9px 10px}
  .q-row{padding:9px 10px}
  .tab-b{padding:6px 10px;font-size:12px}
  .nav-it{padding:8px 10px;font-size:12px}
}
@media(max-width:360px){
  .syne{letter-spacing:0!important}
  .code{font-size:11px;padding:10px}
}

/* Better sidebar for tablets */
@media(min-width:861px) and (max-width:1100px){
  .sidebar{width:200px}
}

/* Full-width utility */
.full{width:100%}

/* Day calendar responsive */
.day-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
@media(max-width:500px){.day-grid{gap:2px}}
`;

/* ─────────────────────────── THEME ─────────────────────────── */
const T = {
  bg:"#04040f", surf:"#06061c", card:"#080820", border:"#12123a",
  t1:"#e8e8f5", t2:"#5050a0", t3:"#1a1a42",
  blue:"#3b82f6", green:"#10b981", amber:"#f59e0b",
  red:"#ef4444", purple:"#a855f7", cyan:"#06b6d4",
};

/* ─────────────────────────── STORAGE ─────────────────────────── */
function useStorage(key, def) {
  const [v, setV] = useState(def);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get(key); if (r?.value !== undefined) setV(JSON.parse(r.value)); }
      catch {}
      setLoaded(true);
    })();
  }, [key]);
  const save = useCallback(async (nv) => {
    const val = typeof nv === "function" ? nv(v) : nv;
    setV(val);
    try { await window.storage.set(key, JSON.stringify(val)); } catch {}
  }, [key, v]);
  return [v, save, loaded];
}

/* ─────────────────────────── PYTHON CURRICULUM ─────────────────────────── */
/* 6 focused Python months. Each week has: topics[], projects[], repos[] */
const PYTHON_MONTHS = [
  {
    id: 1, emoji: "🐍", title: "Python Foundations", color: "#3b82f6",
    sub: "Syntax, variables, control flow & functions",
    weeks: [
      {
        n: 1, title: "Setup & Basic Syntax",
        topics: [
          "Python installation, VS Code setup, running .py files",
          "Variables, data types: int, float, str, bool, None",
          "print(), input(), f-strings and string formatting",
          "Type casting: int(), str(), float(), bool()",
          "Comments, PEP 8 style guide, naming conventions",
        ],
        projects: [
          { title: "Personal Bio Card", desc: "Ask user for name/age/city/hobby, print a formatted card with borders", diff: "Easy" },
          { title: "Unit Converter", desc: "Convert km↔miles, kg↔pounds, Celsius↔Fahrenheit", diff: "Easy" },
          { title: "Receipt Generator", desc: "3 items + prices + 18% GST, formatted with ₹ symbol and totals", diff: "Medium" },
        ],
        repos: [
          { name: "python-beginner-projects", url: "github.com/zhiwehu/Python-programming-exercises", stars: "18k", desc: "100 Python beginner exercises with solutions" },
          { name: "the-algorithms/python", url: "github.com/TheAlgorithms/Python", stars: "190k", desc: "All algorithms implemented in Python" },
          { name: "practical-python", url: "github.com/dabeaz-course/practical-python", stars: "9.5k", desc: "David Beazley's practical Python course materials" },
        ],
      },
      {
        n: 2, title: "Control Flow & Logic",
        topics: [
          "if / elif / else conditional statements",
          "Comparison operators: ==, !=, <, >, <=, >=",
          "Logical operators: and, or, not",
          "Nested conditions and complex boolean logic",
          "Ternary expression: value_if_true if condition else value_if_false",
        ],
        projects: [
          { title: "Grade Calculator", desc: "Take 5 subject marks, compute weighted average, assign A+/A/B/C/D/F", diff: "Easy" },
          { title: "BMI Analyzer", desc: "Input height+weight, calculate BMI, classify, give tailored advice", diff: "Easy" },
          { title: "Income Tax Calculator", desc: "Indian tax slabs 2024, show breakdown at each slab, effective rate", diff: "Medium" },
        ],
        repos: [
          { name: "python-exercises", url: "github.com/darkprinx/100-plus-Python-programming-exercises-extended", stars: "3.2k", desc: "100+ Python exercises with tests" },
          { name: "coding-interview-gym", url: "github.com/partik-joshi/python-coding-interview", stars: "1.8k", desc: "Python interview questions with solutions" },
          { name: "awesome-python", url: "github.com/vinta/awesome-python", stars: "220k", desc: "Curated list of awesome Python frameworks & resources" },
        ],
      },
      {
        n: 3, title: "Loops & Iteration",
        topics: [
          "for loops with range(start, stop, step)",
          "while loops, break, continue, pass keywords",
          "Nested loops and pattern printing",
          "enumerate(), zip(), reversed(), sorted()",
          "Loop-based algorithms: sum, count, min, max without builtins",
        ],
        projects: [
          { title: "Number Guessing Game", desc: "Random 1-100, binary search hints, track attempts, session leaderboard", diff: "Easy" },
          { title: "Star Pattern Gallery", desc: "8 patterns: pyramid, diamond, hollow square, X, Z using nested loops", diff: "Easy" },
          { title: "Sorting Visualizer", desc: "Bubble + insertion sort step-by-step, show array as # bar chart each step", diff: "Hard" },
        ],
        repos: [
          { name: "python-patterns", url: "github.com/faif/python-patterns", stars: "40k", desc: "Design patterns implemented in Python" },
          { name: "leetcode-python", url: "github.com/neetcode-gh/leetcode", stars: "18k", desc: "LeetCode solutions with NeetCode explanations" },
          { name: "algorithm-visualizer", url: "github.com/algorithm-visualizer/algorithm-visualizer", stars: "46k", desc: "Algorithm visualization tool" },
        ],
      },
      {
        n: 4, title: "Functions & Scope",
        topics: [
          "Defining functions: def, return, docstrings",
          "Parameters: positional, keyword, default, *args, **kwargs",
          "Variable scope: local, global, nonlocal",
          "Lambda functions and anonymous functions",
          "Recursion: base case, recursive case, call stack",
        ],
        projects: [
          { title: "Calculator with History", desc: "All arithmetic + modulo + power. Log each operation with timestamp", diff: "Easy" },
          { title: "Password Generator", desc: "Length + complexity config, check strength, generate multiple passwords", diff: "Medium" },
          { title: "Fibonacci & Memoization", desc: "Compare naive recursion vs memoized vs iterative — show timing", diff: "Medium" },
        ],
        repos: [
          { name: "python-cookbook", url: "github.com/dabeaz/python-cookbook", stars: "8.2k", desc: "Python Cookbook 3rd edition code samples" },
          { name: "clean-code-python", url: "github.com/zedr/clean-code-python", stars: "21k", desc: "Clean Code principles applied to Python" },
          { name: "wtfpython", url: "github.com/satwikkansal/wtfpython", stars: "35k", desc: "Exploring surprising Python snippets" },
        ],
      },
    ],
  },
  {
    id: 2, emoji: "📦", title: "Data Structures", color: "#f97316",
    sub: "Lists, dicts, sets, tuples & comprehensions",
    weeks: [
      {
        n: 5, title: "Lists & Tuples",
        topics: [
          "List creation, indexing, slicing [start:stop:step]",
          "List methods: append, insert, remove, pop, sort, reverse",
          "List comprehensions with conditions and nested loops",
          "Tuples: immutability, packing/unpacking, named tuples",
          "2D lists / matrices: creation, access, iteration patterns",
        ],
        projects: [
          { title: "Student Grade Manager", desc: "Add/remove/update students. Sort by name or grade. Compute class stats.", diff: "Easy" },
          { title: "Matrix Operations", desc: "Add, multiply, transpose matrices using only 2D lists (no numpy)", diff: "Medium" },
          { title: "Sliding Window Algorithms", desc: "Max subarray, longest substring — implement 5 classic sliding window problems", diff: "Hard" },
        ],
        repos: [
          { name: "python-ds", url: "github.com/prabhupant/python-ds", stars: "2.1k", desc: "Data structures in Python with visualizations" },
          { name: "algorithms-python", url: "github.com/keon/algorithms", stars: "24k", desc: "Minimal examples of data structures and algorithms" },
          { name: "pygorithm", url: "github.com/OmkarPathak/pygorithm", stars: "3.7k", desc: "Python module for learning algorithms with step-by-step display" },
        ],
      },
      {
        n: 6, title: "Dictionaries & Sets",
        topics: [
          "Dict creation, access, .get(), .keys(), .values(), .items()",
          "Dict comprehensions and nested dicts",
          "Sets: union, intersection, difference, symmetric difference",
          "Frozen sets and set operations for deduplication",
          "collections module: Counter, defaultdict, OrderedDict, deque",
        ],
        projects: [
          { title: "Word Frequency Analyzer", desc: "Input any text. Top 10 words, bar chart with #, unique words, avg length", diff: "Easy" },
          { title: "Contact Book", desc: "CRUD contacts (name/phone/email). Search by any field. Export to CSV.", diff: "Medium" },
          { title: "LRU Cache", desc: "Implement LRU cache from scratch using OrderedDict. Support get() and put()", diff: "Hard" },
        ],
        repos: [
          { name: "python-cheatsheet", url: "github.com/gto76/python-cheatsheet", stars: "37k", desc: "Comprehensive Python cheatsheet with examples" },
          { name: "collections-examples", url: "github.com/pymotw/pymotw-3", stars: "1.9k", desc: "Python Module of the Week — all stdlib examples" },
          { name: "interview-prep", url: "github.com/donnemartin/interactive-coding-challenges", stars: "29k", desc: "Interactive coding challenges with Jupyter notebooks" },
        ],
      },
      {
        n: 7, title: "Strings & File I/O",
        topics: [
          "String methods: split, join, strip, replace, find, count, format",
          "Regular expressions with re module: search, findall, sub, groups",
          "File handling: open(), read, write, append, context managers with",
          "CSV and JSON reading/writing with csv and json modules",
          "Error handling: try/except/finally, custom exceptions",
        ],
        projects: [
          { title: "Log File Analyzer", desc: "Parse a server log file. Count errors/warnings by type. Show timeline.", diff: "Medium" },
          { title: "Mini Markdown Parser", desc: "Convert # headings, **bold**, *italic*, - lists to HTML output", diff: "Medium" },
          { title: "Data Cleaning Tool", desc: "Read messy CSV, fix nulls/duplicates/types, write clean version + report", diff: "Hard" },
        ],
        repos: [
          { name: "regex101", url: "github.com/nicktindall/cyclon.p2p", stars: "—", desc: "Use regex101.com — best regex learning tool online" },
          { name: "python-json-tutorial", url: "github.com/realpython/python-basics-exercises", stars: "2.4k", desc: "Real Python exercises for beginners" },
          { name: "textblob", url: "github.com/sloria/TextBlob", stars: "9.1k", desc: "Simple text processing library — great for learning NLP basics" },
        ],
      },
      {
        n: 8, title: "Algorithms & Big-O",
        topics: [
          "Big-O notation: O(1), O(log n), O(n), O(n log n), O(n²)",
          "Searching: linear search, binary search, interpolation search",
          "Sorting: bubble, selection, insertion, merge, quick sort",
          "Recursion: factorial, Fibonacci, Tower of Hanoi, flood fill",
          "Two pointers, sliding window, prefix sums — classic patterns",
        ],
        projects: [
          { title: "Sort Comparator", desc: "Implement 5 sorts. Time each on same list (100/1000/10000 elements). Plot.", diff: "Medium" },
          { title: "Binary Search Library", desc: "find_first(), find_last(), count_occurrences() on sorted list in O(log n)", diff: "Medium" },
          { title: "Maze Solver", desc: "DFS and BFS maze solver on 2D grid. Show path. Compare steps taken.", diff: "Hard" },
        ],
        repos: [
          { name: "algo-visualizer", url: "github.com/algorithm-visualizer/algorithm-visualizer", stars: "46k", desc: "Interactive algorithm visualization platform" },
          { name: "sorting-algorithms", url: "github.com/prathyvsh/sorting-algorithms", stars: "3.1k", desc: "Sorting algorithms visualized" },
          { name: "dsa-python", url: "github.com/akashp1712/ds-and-algorithm-in-python", stars: "1.2k", desc: "Complete DSA in Python with explanation" },
        ],
      },
    ],
  },
  {
    id: 3, emoji: "⚙️", title: "OOP & Advanced Python", color: "#a855f7",
    sub: "Classes, decorators, generators & async",
    weeks: [
      {
        n: 9, title: "Object-Oriented Programming",
        topics: [
          "Classes, __init__, instance vs class variables and methods",
          "Inheritance, super(), method overriding, multiple inheritance",
          "Dunder/magic methods: __str__, __repr__, __len__, __eq__, __lt__",
          "Properties: @property, getter/setter pattern",
          "Abstract classes with ABC, interfaces in Python",
        ],
        projects: [
          { title: "Bank Account System", desc: "Account hierarchy: Savings/Current/FD. Transactions, interest, statements.", diff: "Medium" },
          { title: "Shape Library", desc: "Shape base class → Circle/Rect/Triangle. Area/perimeter. Sort by area.", diff: "Easy" },
          { title: "Mini ORM", desc: "Base Model class. Define fields as class vars. generate_sql() for SELECT/INSERT", diff: "Hard" },
        ],
        repos: [
          { name: "python-oop-examples", url: "github.com/cs-MohamedAyman/Object-Oriented-Programming", stars: "4.8k", desc: "Comprehensive OOP examples in Python" },
          { name: "design-patterns", url: "github.com/faif/python-patterns", stars: "40k", desc: "Design patterns in Python — Singleton, Factory, Observer etc" },
          { name: "fluent-python", url: "github.com/fluentpython/example-code-2e", stars: "7.5k", desc: "Fluent Python 2e all code examples" },
        ],
      },
      {
        n: 10, title: "Decorators & Generators",
        topics: [
          "First-class functions: passing functions, closures, factory pattern",
          "Decorators: @, functools.wraps, chaining decorators",
          "Built-in decorators: @staticmethod, @classmethod, @property, @cache",
          "Generators: yield, next(), generator expressions, infinite sequences",
          "Iterators: __iter__, __next__, custom iterator classes",
        ],
        projects: [
          { title: "Decorator Toolkit", desc: "@timer, @retry(n), @memoize, @rate_limit — stack them, show order matters", diff: "Medium" },
          { title: "Infinite Sequence Generators", desc: "Fibonacci, primes, random walk — all as generators. Pipeline with filter/map.", diff: "Medium" },
          { title: "Pipeline Framework", desc: "Data pipeline using generators: source → transform → filter → sink", diff: "Hard" },
        ],
        repos: [
          { name: "python-decorators", url: "github.com/chiphuyen/python-is-cool", stars: "3.3k", desc: "Cool Python features with clear examples — decorators, generators" },
          { name: "itertools-examples", url: "github.com/erikrose/more-itertools", stars: "3.6k", desc: "More routines for operating on iterables" },
          { name: "functional-python", url: "github.com/pytoolz/toolz", stars: "4.6k", desc: "Functional programming tools for Python" },
        ],
      },
      {
        n: 11, title: "Error Handling & Testing",
        topics: [
          "Exception hierarchy, try/except/else/finally patterns",
          "Custom exception classes with context and data",
          "Unit testing with pytest: fixtures, parametrize, marks",
          "Mocking with unittest.mock: MagicMock, patch, side_effect",
          "TDD cycle: Red → Green → Refactor with real examples",
        ],
        projects: [
          { title: "Robust CSV Parser", desc: "Parse malformed CSVs. Handle every possible error. 20 test cases with pytest.", diff: "Medium" },
          { title: "API Client with Tests", desc: "Wrapper for any public API. Mock all HTTP calls. 95%+ test coverage.", diff: "Hard" },
          { title: "Property-Based Testing", desc: "Use hypothesis library to find edge cases in 3 of your own functions", diff: "Hard" },
        ],
        repos: [
          { name: "pytest-docs", url: "github.com/pytest-dev/pytest", stars: "12k", desc: "pytest — the de facto Python testing framework" },
          { name: "hypothesis", url: "github.com/HypothesisWorks/hypothesis", stars: "7.5k", desc: "Property-based testing library for Python" },
          { name: "python-testing-cookbook", url: "github.com/realpython/pytest-tutorial", stars: "1.1k", desc: "Real Python pytest tutorial repository" },
        ],
      },
      {
        n: 12, title: "Async Python & Concurrency",
        topics: [
          "Concurrency vs parallelism — Python's GIL and its implications",
          "asyncio: async def, await, event loop, gather, create_task",
          "aiohttp for async HTTP — concurrent web requests",
          "threading module for I/O-bound tasks, thread safety",
          "multiprocessing for CPU-bound tasks, ProcessPoolExecutor",
        ],
        projects: [
          { title: "Async Web Scraper", desc: "Scrape 20 URLs concurrently with aiohttp. Rate limit. Retry on failure.", diff: "Hard" },
          { title: "Concurrent File Processor", desc: "Process 100 files with ThreadPoolExecutor. Benchmark vs sequential.", diff: "Medium" },
          { title: "Async Task Queue", desc: "Producer/consumer pattern with asyncio.Queue. Priority levels. Monitoring.", diff: "Hard" },
        ],
        repos: [
          { name: "aiohttp", url: "github.com/aio-libs/aiohttp", stars: "15k", desc: "Async HTTP Client/Server for asyncio" },
          { name: "asyncio-examples", url: "github.com/realpython/materials/asyncio-walkthrough", stars: "4.2k", desc: "Real Python asyncio walkthrough examples" },
          { name: "trio", url: "github.com/python-trio/trio", stars: "5.8k", desc: "Friendly async library — learn async patterns" },
        ],
      },
    ],
  },
  {
    id: 4, emoji: "🌐", title: "Files, DBs & APIs", color: "#10b981",
    sub: "SQLite, REST APIs, web scraping",
    weeks: [
      {
        n: 13, title: "SQLite & Databases",
        topics: [
          "SQLite3: CREATE TABLE, INSERT, SELECT, UPDATE, DELETE",
          "Parameterized queries to prevent SQL injection",
          "Joins: INNER, LEFT, RIGHT — with Python examples",
          "Transactions, context managers for DB connections",
          "SQLAlchemy ORM basics: models, sessions, queries",
        ],
        projects: [
          { title: "Task Manager CLI", desc: "Full CRUD with SQLite. Priority, due dates, tags. Filter/sort/export.", diff: "Medium" },
          { title: "Inventory System", desc: "Products, categories, stock levels, low-stock alerts, sales reports", diff: "Medium" },
          { title: "Blog Database", desc: "SQLAlchemy ORM: Users, Posts, Comments, Tags. Full CRUD + pagination.", diff: "Hard" },
        ],
        repos: [
          { name: "sqlalchemy", url: "github.com/sqlalchemy/sqlalchemy", stars: "9.5k", desc: "SQLAlchemy — Python SQL toolkit and ORM" },
          { name: "sqlite-tutorial", url: "github.com/CoreyMSchafer/code_snippets/SQLite", stars: "12k", desc: "Corey Schafer's SQLite tutorial code" },
          { name: "peewee", url: "github.com/coleifer/peewee", stars: "11k", desc: "Simple, lightweight ORM — great for learning" },
        ],
      },
      {
        n: 14, title: "REST APIs & HTTP",
        topics: [
          "HTTP methods: GET, POST, PUT, PATCH, DELETE and status codes",
          "requests library: headers, params, auth, sessions, timeouts",
          "JSON parsing, response handling, error codes management",
          "FastAPI basics: routes, Pydantic models, automatic docs",
          "Authentication: API keys, Bearer tokens, OAuth 2.0 flow",
        ],
        projects: [
          { title: "Weather Dashboard CLI", desc: "OpenWeatherMap API: current weather, 5-day forecast, formatted output", diff: "Easy" },
          { title: "GitHub Stats Tool", desc: "GitHub API: show user's repos, stars, languages, contribution graph", diff: "Medium" },
          { title: "FastAPI CRUD Service", desc: "Full REST API: Users + Items. Pydantic validation. SQLite. Swagger docs.", diff: "Hard" },
        ],
        repos: [
          { name: "fastapi", url: "github.com/tiangolo/fastapi", stars: "78k", desc: "FastAPI framework — build APIs with Python 3.10+" },
          { name: "requests", url: "github.com/psf/requests", stars: "52k", desc: "HTTP for Humans — most used Python HTTP library" },
          { name: "httpx", url: "github.com/encode/httpx", stars: "13k", desc: "Next-gen HTTP client — async support built-in" },
        ],
      },
      {
        n: 15, title: "Web Scraping",
        topics: [
          "BeautifulSoup4: parse HTML, find, find_all, CSS selectors",
          "Selenium for dynamic JavaScript-rendered pages",
          "Scrapy framework for production-grade spiders",
          "Handling pagination, infinite scroll, form submission",
          "Rate limiting, robots.txt, ethical scraping practices",
        ],
        projects: [
          { title: "Job Listings Scraper", desc: "Scrape job listings from a site. Store in CSV/SQLite. Alert on new jobs.", diff: "Medium" },
          { title: "Price Tracker", desc: "Track price of any Amazon product. Alert when price drops below target.", diff: "Hard" },
          { title: "News Aggregator", desc: "Scrape 5 news sites. Deduplicate. Categorize by topic. Daily email summary.", diff: "Hard" },
        ],
        repos: [
          { name: "scrapy", url: "github.com/scrapy/scrapy", stars: "53k", desc: "Fast web crawling & scraping framework" },
          { name: "beautifulsoup", url: "github.com/waylan/beautifulsoup", stars: "2.8k", desc: "Beautiful Soup — screen-scraping library" },
          { name: "playwright-python", url: "github.com/microsoft/playwright-python", stars: "11k", desc: "Playwright for Python — modern browser automation" },
        ],
      },
      {
        n: 16, title: "CLI Tools & Automation",
        topics: [
          "argparse for command-line argument parsing",
          "Rich library for beautiful terminal output",
          "Click framework for building CLI applications",
          "os, shutil, pathlib for file system automation",
          "Scheduling: schedule library, cron, system tasks automation",
        ],
        projects: [
          { title: "Dev Environment Setup Tool", desc: "CLI that installs all dev tools, checks versions, fixes PATH, generates SSH key", diff: "Medium" },
          { title: "File Organizer", desc: "Watch folder, auto-sort by type/date, duplicate detection, dry-run mode", diff: "Medium" },
          { title: "Git Workflow Automator", desc: "CLI: auto-branch naming, commit templates, PR creation via GitHub API", diff: "Hard" },
        ],
        repos: [
          { name: "rich", url: "github.com/Textualize/rich", stars: "49k", desc: "Rich text and beautiful formatting in the terminal" },
          { name: "click", url: "github.com/pallets/click", stars: "15k", desc: "Python composable command line interface toolkit" },
          { name: "typer", url: "github.com/tiangolo/typer", stars: "15k", desc: "CLI apps with Python type hints — from FastAPI creator" },
        ],
      },
    ],
  },
  {
    id: 5, emoji: "📊", title: "NumPy, Pandas & EDA", color: "#f59e0b",
    sub: "Data science foundations for AI/ML",
    weeks: [
      {
        n: 17, title: "NumPy Deep Dive",
        topics: [
          "ndarray creation: zeros, ones, arange, linspace, random",
          "Array operations: reshape, transpose, broadcasting rules",
          "Indexing: fancy indexing, boolean masks, advanced slicing",
          "Mathematical operations: dot, linalg, einsum, FFT",
          "Performance: vectorization vs loops — why 100× faster",
        ],
        projects: [
          { title: "Linear Algebra Library", desc: "Matrix mult, inverse, determinant, eigenvalues — without linalg", diff: "Hard" },
          { title: "Image Processor", desc: "Load image as numpy array. Apply filters: blur, sharpen, greyscale, flip", diff: "Medium" },
          { title: "Statistics Engine", desc: "Descriptive stats, correlation matrix, histogram, box plot — pure numpy", diff: "Medium" },
        ],
        repos: [
          { name: "numpy", url: "github.com/numpy/numpy", stars: "28k", desc: "NumPy — the fundamental package for scientific computing" },
          { name: "numpy-100", url: "github.com/rougier/numpy-100", stars: "12k", desc: "100 NumPy exercises with solutions — essential practice" },
          { name: "numpy-tutorial", url: "github.com/ageron/handson-ml3", stars: "27k", desc: "Hands-On ML3e code — best practical numpy examples" },
        ],
      },
      {
        n: 18, title: "Pandas Mastery",
        topics: [
          "DataFrame and Series creation, indexing, loc vs iloc",
          "Data cleaning: fillna, dropna, astype, duplicates, outliers",
          "GroupBy, aggregation, pivot_table, merge, join, concat",
          "apply(), map(), transform() for row/column operations",
          "Time series: DatetimeIndex, resample, rolling, shift",
        ],
        projects: [
          { title: "COVID Data Analyzer", desc: "Download public COVID data. Clean it. Compute death rate, recovery by country.", diff: "Medium" },
          { title: "E-commerce Analytics", desc: "Analyze order dataset: revenue by month, top products, customer LTV", diff: "Medium" },
          { title: "Stock Market EDA", desc: "yfinance data: moving averages, RSI, correlation between stocks, signals", diff: "Hard" },
        ],
        repos: [
          { name: "pandas", url: "github.com/pandas-dev/pandas", stars: "43k", desc: "Pandas — powerful data analysis toolkit" },
          { name: "pandas-exercises", url: "github.com/guipsamora/pandas_exercises", stars: "13k", desc: "Practice pandas with real datasets — 10 topic areas" },
          { name: "effective-pandas", url: "github.com/TomAugspurger/effective-pandas", stars: "2.8k", desc: "Modern, idiomatic pandas — best practices guide" },
        ],
      },
      {
        n: 19, title: "Data Visualization",
        topics: [
          "Matplotlib: figures, axes, subplots, line/bar/scatter/hist",
          "Seaborn: statistical plots, heatmaps, pairplots, themes",
          "Plotly for interactive charts — hover, zoom, export",
          "Chart selection: when to use each type of visualization",
          "Storytelling with data: titles, annotations, color palettes",
        ],
        projects: [
          { title: "Interactive Dashboard", desc: "Plotly: 6 interactive charts on one dataset. Filters. Export to HTML.", diff: "Medium" },
          { title: "Census Data Story", desc: "Download census data, tell a visual story: 8 charts + narrative captions", diff: "Hard" },
          { title: "Real-Time Plot", desc: "Matplotlib animation: live stock/crypto price updating every 5 seconds", diff: "Hard" },
        ],
        repos: [
          { name: "matplotlib", url: "github.com/matplotlib/matplotlib", stars: "20k", desc: "Matplotlib — comprehensive Python plotting library" },
          { name: "plotly-py", url: "github.com/plotly/plotly.py", stars: "16k", desc: "Interactive graphing library for Python" },
          { name: "seaborn", url: "github.com/mwaskom/seaborn", stars: "12k", desc: "Statistical data visualization based on matplotlib" },
        ],
      },
      {
        n: 20, title: "Exploratory Data Analysis",
        topics: [
          "EDA workflow: shape, dtypes, describe, value_counts, info",
          "Missing data patterns: MCAR, MAR, MNAR — detection strategies",
          "Outlier detection: IQR, Z-score, isolation forest",
          "Feature correlation and multicollinearity analysis",
          "Creating reproducible EDA notebooks with Jupyter",
        ],
        projects: [
          { title: "Titanic Full EDA", desc: "Classic dataset: survival analysis, feature correlations, prediction readiness", diff: "Easy" },
          { title: "House Price EDA", desc: "Kaggle dataset: discover features that drive price, handle missing values", diff: "Medium" },
          { title: "Automated EDA Tool", desc: "Function: given any CSV, auto-generate full EDA report as HTML", diff: "Hard" },
        ],
        repos: [
          { name: "ydata-profiling", url: "github.com/ydataai/ydata-profiling", stars: "12k", desc: "Create HTML profiling reports from pandas DataFrames" },
          { name: "sweetviz", url: "github.com/fbdesignpro/sweetviz", stars: "2.9k", desc: "High-density EDA visualizations in one line of code" },
          { name: "kaggle-datasets", url: "github.com/awesomedata/awesome-public-datasets", stars: "60k", desc: "Awesome public datasets for EDA practice" },
        ],
      },
    ],
  },
  {
    id: 6, emoji: "🏆", title: "DSA & Interview Prep", color: "#ef4444",
    sub: "Algorithms, system design & portfolio",
    weeks: [
      {
        n: 21, title: "Stacks, Queues & Linked Lists",
        topics: [
          "Stack: LIFO, push/pop/peek, Python list as stack, deque",
          "Queue: FIFO, enqueue/dequeue, circular queue, priority queue",
          "Linked List: singly/doubly, insert/delete/reverse/detect cycle",
          "Applications: valid parentheses, expression evaluation, LRU cache",
          "heapq module: min-heap, max-heap, heap sort, k-th largest",
        ],
        projects: [
          { title: "Expression Evaluator", desc: "Evaluate infix expressions: handle brackets, precedence, all operators", diff: "Hard" },
          { title: "Browser History", desc: "Back/forward using two stacks. URL validation. History search.", diff: "Medium" },
          { title: "Task Scheduler", desc: "Priority queue scheduler: run highest priority task, handle deadlines", diff: "Hard" },
        ],
        repos: [
          { name: "python-dsa", url: "github.com/jwasham/coding-interview-university", stars: "302k", desc: "Coding interview university — most starred CS resource" },
          { name: "leetcode-patterns", url: "github.com/seanprashad/leetcode-patterns", stars: "9.8k", desc: "75 essential LeetCode patterns curated list" },
          { name: "neetcode", url: "github.com/neetcode-gh/leetcode", stars: "18k", desc: "All NeetCode solutions with video explanations" },
        ],
      },
      {
        n: 22, title: "Trees & Graphs",
        topics: [
          "Binary trees: in/pre/post-order traversal, height, diameter",
          "Binary Search Trees: insert, delete, search, validate, balance",
          "Heaps, tries, segment trees — when to use each",
          "Graphs: adjacency list/matrix, BFS, DFS, topological sort",
          "Shortest path: Dijkstra's, Bellman-Ford, A* algorithm",
        ],
        projects: [
          { title: "File System Tree", desc: "Build a tree from directory. Show as ASCII tree. Search files by pattern.", diff: "Medium" },
          { title: "Social Network Graph", desc: "Friend connections as graph. BFS for shortest connection. Find influencers.", diff: "Hard" },
          { title: "Autocomplete with Trie", desc: "Insert words into Trie. Return all completions for a prefix in O(m+n)", diff: "Hard" },
        ],
        repos: [
          { name: "graph-algorithms", url: "github.com/TheAlgorithms/Python/tree/master/graphs", stars: "190k", desc: "All graph algorithms in Python — The Algorithms repo" },
          { name: "binarytree", url: "github.com/joowani/binarytree", stars: "1.9k", desc: "Python library for learning binary trees" },
          { name: "networkx", url: "github.com/networkx/networkx", stars: "14k", desc: "NetworkX — graph library for complex networks" },
        ],
      },
      {
        n: 23, title: "Dynamic Programming",
        topics: [
          "Memoization (top-down) vs tabulation (bottom-up)",
          "1D DP: climbing stairs, house robber, coin change",
          "2D DP: unique paths, edit distance, longest common subsequence",
          "Knapsack: 0/1 knapsack, unbounded, fractional",
          "Advanced: matrix chain mult, longest palindrome, word break",
        ],
        projects: [
          { title: "Spell Checker", desc: "Edit distance to find closest words. Suggest 3 corrections. Measure time.", diff: "Medium" },
          { title: "Optimal Stock Trader", desc: "Best time to buy/sell: 1 tx, multiple tx, cooldown, at most k tx", diff: "Hard" },
          { title: "Text Justification", desc: "Optimal text justification using DP to minimize raggedness", diff: "Very Hard" },
        ],
        repos: [
          { name: "dp-problems", url: "github.com/zhiwehu/Python-programming-exercises", stars: "18k", desc: "Python DP exercises with full solutions" },
          { name: "competitive-programming", url: "github.com/cp-algorithms/cp-algorithms", stars: "14k", desc: "E-Maxx competitive programming algorithms" },
          { name: "blind75", url: "github.com/hxu296/leetcode-company-wise-problems-2022", stars: "6.2k", desc: "Company-wise LeetCode problems — Blind 75 and more" },
        ],
      },
      {
        n: 24, title: "Portfolio & Mock Interviews",
        topics: [
          "STAR format for behavioral interviews: Situation Task Action Result",
          "System design basics: scalability, load balancers, databases, CDN",
          "Python coding patterns: clean code, readability, docstrings",
          "Building your GitHub portfolio: READMEs, demos, pinned repos",
          "Resume for Python developer roles: keywords, projects, metrics",
        ],
        projects: [
          { title: "Capstone AI App", desc: "Build one impressive app combining everything: Python + API + DB + CLI", diff: "Hard" },
          { title: "Portfolio README", desc: "GitHub profile README with stats, projects, skills, contact links", diff: "Easy" },
          { title: "Mock Interview Record", desc: "Record yourself solving 5 LeetCode mediums. Review and improve.", diff: "Medium" },
        ],
        repos: [
          { name: "portfolio-ideas", url: "github.com/florinpop17/app-ideas", stars: "79k", desc: "App Ideas collection — beginner to advanced projects" },
          { name: "resume-templates", url: "github.com/byebrid/resume-templates", stars: "2.1k", desc: "ATS-friendly resume templates for developers" },
          { name: "coding-interview-handbook", url: "github.com/yangshun/tech-interview-handbook", stars: "116k", desc: "Curated coding interview preparation materials" },
        ],
      },
    ],
  },
];

/* ─────────────────────────── QUESTION GENERATOR (Claude API) ─────────────────────────── */
async function generateQuestions(topicText, weekTitle) {
  const API_KEY = "YOUR_ANTHROPIC_API_KEY";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `Generate exactly 100 Python interview/practice questions for this topic.

Topic: "${topicText}"
Week context: "${weekTitle}"

Return ONLY valid JSON:

{
  "easy": [
    {"q": "question text", "co": "Google"}
  ],
  "medium": [
    {"q": "question text", "co": "OpenAI"}
  ],
  "hard": [
    {"q": "question text", "co": "Anthropic"}
  ],
  "vhard": [
    {"q": "question text", "co": "Meta"}
  ]
}

Easy: 25 questions
Medium: 30 questions
Hard: 30 questions
Very Hard: 15 questions

Rotate companies: Google, OpenAI, Anthropic, Meta, Microsoft.`
        }
      ]
    })
  });

  const data = await res.json();

  const text = data.content[0].text.trim();

  return JSON.parse(text);
}

/* ─────────────────────────── SHARED COMPONENTS ─────────────────────────── */
const Spin = () => <span className="spin" style={{ fontSize: 16 }}>⟳</span>;

const Ring = ({ pct, size = 72, stroke = 5, color = T.blue, label }) => {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#07072a" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c - (pct/100)*c} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset .8s ease", filter:`drop-shadow(0 0 4px ${color}80)` }} />
      </svg>
      {label && <div style={{ fontSize: 11, color: T.t2, textAlign: "center" }}>{label}</div>}
    </div>
  );
};

const Header = ({ totalXP, solvedTopics, monthsDone }) => {
  const LEVELS = [
    { l:1, name:"Beginner",    min:0,    color:"#6b7280", emoji:"🌱" },
    { l:2, name:"Learner",     min:150,  color:"#3b82f6", emoji:"📘" },
    { l:3, name:"Practitioner",min:400,  color:"#10b981", emoji:"⚡" },
    { l:4, name:"Developer",   min:800,  color:"#f59e0b", emoji:"🔥" },
    { l:5, name:"Engineer",    min:1400, color:"#a855f7", emoji:"🚀" },
    { l:6, name:"Python Pro",  min:2200, color:"#ef4444", emoji:"🏆" },
    { l:7, name:"ML Ready!",   min:3200, color:"#06b6d4", emoji:"🌌" },
  ];
  const lvl = LEVELS.filter(l => totalXP >= l.min).pop() || LEVELS[0];
  const next = LEVELS[lvl.l] || lvl;
  const pct = lvl.l < 7 ? Math.round(((totalXP - lvl.min)/(next.min - lvl.min))*100) : 100;

  return (
    <div style={{
      background:"linear-gradient(180deg,#07071e,#04040f)",
      borderBottom:`1px solid ${T.border}`,
      padding:"12px clamp(12px,4vw,28px)",
      display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap"
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{
          width:44, height:44, borderRadius:12, flexShrink:0,
          background:"linear-gradient(135deg,#3b82f6,#06b6d4)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:22, fontWeight:900, color:"#fff",
          boxShadow:"0 0 18px #3b82f640"
        }}>S</div>
        <div>
          <div className="syne" style={{ fontSize:"clamp(14px,2.5vw,20px)", fontWeight:800, color:T.t1, lineHeight:1.1 }}>
            Shyam Baghel
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4, flexWrap:"wrap" }}>
            <span style={{
              fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:999,
              background:lvl.color+"20", color:lvl.color, border:`1px solid ${lvl.color}40`
            }}>{lvl.emoji} Lv.{lvl.l} {lvl.name}</span>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:"clamp(60px,10vw,120px)", height:4, background:"#0a0a28", borderRadius:999, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:lvl.color, borderRadius:999, transition:"width .8s ease" }} />
              </div>
              <span style={{ fontSize:9, color:T.t2 }}>{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {[
          { icon:"⭐", val:totalXP, label:"XP", glow:"#f59e0b" },
          { icon:"✅", val:`${solvedTopics}`, label:"Topics", glow:"#10b981" },
          { icon:"📅", val:`${monthsDone}/6`, label:"Months", glow:"#3b82f6" },
        ].map(s => (
          <div key={s.label} style={{
            background:T.card, border:`1px solid ${T.border}`, borderRadius:10,
            padding:"6px 12px", display:"flex", alignItems:"center", gap:7,
            boxShadow:`0 0 10px ${s.glow}18`
          }}>
            <span style={{ fontSize:16 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:T.t1, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:10, color:T.t2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────── SIDEBAR ─────────────────────────── */
const NAV = [
  { id:"roadmap",  icon:"🗺️", label:"Python Roadmap" },
  { id:"tracker",  icon:"📅", label:"Progress Tracker" },
  { id:"theory",   icon:"📖", label:"Python Theory" },
  { id:"projects", icon:"🔨", label:"Project Ideas" },
  { id:"practice", icon:"⚡", label:"Practice Questions" },
  { id:"ml",       icon:"🌌", label:"ML Path", badge:"After Python" },
];

const Sidebar = ({ tab, setTab, topicsDone, totalTopics }) => (
  <div className="sidebar">
    <div style={{ padding:"20px 16px 10px" }}>
      <div className="syne" style={{ fontSize:14, fontWeight:800, color:T.blue, letterSpacing:.5 }}>🐍 Python Mastery</div>
      <div style={{ fontSize:11, color:T.t2, marginTop:3 }}>6-Month Roadmap</div>
    </div>
    <div style={{ padding:"0 8px" }}>
      {NAV.map(n => (
        <div key={n.id} className={`nav-it ${tab === n.id ? "on" : ""}`}
          onClick={() => setTab(n.id)}>
          <span style={{ fontSize:16 }}>{n.icon}</span>
          <span style={{ flex:1 }}>{n.label}</span>
          {n.badge && (
            <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4,
              background:"#10b98120", color:T.green, border:"1px solid #10b98140" }}>
              {n.badge}
            </span>
          )}
        </div>
      ))}
    </div>
    <div style={{ flex:1 }} />
    <div style={{ padding:"14px 16px", borderTop:`1px solid ${T.border}` }}>
      <div className="sec-label">Overall Progress</div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:12, color:T.t2 }}>Topics Completed</span>
        <span style={{ fontSize:12, fontWeight:700, color:T.blue }}>{topicsDone}/{totalTopics}</span>
      </div>
      <div className="pbar">
        <div className="pfill xp-bar" style={{ width:`${Math.round(topicsDone/totalTopics*100)}%` }} />
      </div>
    </div>
  </div>
);

const MobileNav = ({ tab, setTab }) => (
  <div className="mob">
    {NAV.map(n => (
      <div key={n.id} onClick={() => setTab(n.id)}
        style={{
          flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2,
          padding:"4px 8px", cursor:"pointer",
          color: tab === n.id ? T.blue : T.t2,
          background: tab === n.id ? "#0a0a2a" : "transparent",
          borderRadius:8
        }}>
        <span style={{ fontSize:18 }}>{n.icon}</span>
        <span style={{ fontSize:9, fontWeight:600 }}>{n.label.split(" ")[0]}</span>
      </div>
    ))}
  </div>
);

/* ─────────────────────────── TOPIC ROW WITH QUESTIONS ─────────────────────────── */

/* ─────────────────────────── TOPIC IDEAS DATA ─────────────────────────── */
// 10 project ideas per week (24 weeks × 10 = 240 ideas)
const WEEK_IDEAS = {
  1:[
    {t:"Number Guessing Game",h:"Use random.randint() for target. Loop until correct. Count attempts. Add hint: 'too high/low'. Save high score to variable."},
    {t:"Temperature Converter",h:"Functions for C↔F↔K conversions. Input validation with try/except. Build a menu loop. Extend to a full unit converter."},
    {t:"Simple Calculator",h:"eval() is unsafe — build your own parser. Handle division by zero. Add memory (M+, M-, MR). Log history to a list."},
    {t:"Word Counter CLI",h:"Read a .txt file. Count total words, unique words, top-10 frequent. Use split() and Counter from collections."},
    {t:"Basic Password Generator",h:"Use string.ascii_letters + digits + punctuation. random.choices() with weights. Ensure at least 1 of each type."},
    {t:"Roman Numeral Converter",h:"Map values dict: {1000:'M', 900:'CM'...}. Loop through divmod. Handle both directions (int↔roman)."},
    {t:"Simple ATM Simulator",h:"Dict for accounts. if/elif for menu. Deposit/withdraw with balance check. PIN validation. Transaction history list."},
    {t:"Pattern Printer",h:"Nested loops for pyramids, diamonds, hollow squares. Accept size as input. Print stars (*), numbers, or letters."},
    {t:"Basic Quiz Game",h:"Store Q&A in a list of dicts. Shuffle with random.shuffle(). Score tracking. Timer with time.time(). Save score to file."},
    {t:"FizzBuzz Variations",h:"Classic FizzBuzz then extend: custom rules, range input, multiple conditions, output to file, count Fizz vs Buzz."},
  ],
  2:[
    {t:"Mad Libs Generator",h:"Store template strings with {placeholders}. Input multiple words, use .format() or f-strings. Read templates from file."},
    {t:"Palindrome Checker",h:"Handle spaces/punctuation with re.sub(). Check words AND phrases. Find all palindromes in a paragraph."},
    {t:"Caesar Cipher",h:"ord()/chr() for ASCII shift. Handle uppercase/lowercase. Add Vigenere cipher upgrade. brute-force decryption mode."},
    {t:"Anagram Detector",h:"Sort both strings and compare, or use Counter. Find all anagram pairs in a word list. Group anagrams together."},
    {t:"String Statistics Tool",h:"Count vowels/consonants, longest word, average word length, most common letter. Accept input or read from file."},
    {t:"Text Formatter CLI",h:"Wrap text at N chars, center/left/right justify, add borders. Implement markdown-lite: **bold**, *italic*."},
    {t:"URL Parser",h:"Use split() to extract protocol, domain, path, query params. Validate URL format. Rebuild URL from components."},
    {t:"Emoji Translator",h:"Dict mapping words to emojis. Replace words in sentences. Add reverse mode. Read custom mappings from JSON."},
    {t:"Pig Latin Translator",h:"Move first consonant cluster to end + 'ay'. Handle vowel-start words. Process entire sentences. Handle punctuation."},
    {t:"Acronym Generator",h:"Take first letter of each word, uppercase. Skip small words (the, a, of). Generate from sentence or phrase input."},
  ],
  3:[
    {t:"Shopping Cart System",h:"List of dicts for items. add/remove/update quantity functions. calc_total() with tax. Apply discount codes. Print receipt."},
    {t:"Student Grade Manager",h:"Dict of students → list of grades. Calc mean, median, mode. Letter grade function. Sort by GPA. Export to CSV."},
    {t:"Contact Book",h:"List of dicts: name, phone, email. CRUD operations. Search by name/phone. Sort alphabetically. Save/load from JSON."},
    {t:"Inventory System",h:"Dict of items with stock/price. Add/remove stock. Low-stock alert when quantity < threshold. Total value calculation."},
    {t:"To-Do List with Priorities",h:"List of dicts with task, priority (1-5), due_date, done. Sort by priority. Filter by status. Save to JSON file."},
    {t:"Movie Watchlist",h:"List of movie dicts: title, genre, rating, watched. Filter by genre. Sort by rating. Random movie suggester."},
    {t:"Expense Tracker",h:"List of expense dicts with amount, category, date. Monthly totals. Category breakdown. Budget vs actual. CSV export."},
    {t:"Library Book Tracker",h:"Books dict: title→{author, ISBN, available, borrower}. Borrow/return functions. Overdue detection. Search by author."},
    {t:"Playlist Manager",h:"List of song dicts. Add/remove/reorder. Shuffle with random.shuffle(). Filter by genre/artist. Play count tracking."},
    {t:"Recipe Book",h:"Dict of recipes: name→{ingredients, steps, time, servings}. Scale ingredients. Search by ingredient. Filter by cook time."},
  ],
  4:[
    {t:"For Loop Art Generator",h:"Nested loops to draw ASCII art: spirals, checkerboards. Use chr() for characters. Accept pattern type as argument."},
    {t:"Multiplication Table",h:"Print N×N table using nested loops. Format with f-string padding. Highlight perfect squares. Accept N from user."},
    {t:"Number Base Converter",h:"Convert decimal to binary/octal/hex manually (no bin()). Use while loop with divmod. Handle negative numbers."},
    {t:"Prime Number Sieve",h:"Implement Sieve of Eratosthenes. Find all primes up to N. Count primes in range. Check if large number is prime."},
    {t:"Fibonacci Variations",h:"Iterative, recursive, and generator versions. Memoized version for speed. Detect Fibonacci numbers. Golden ratio calculation."},
    {t:"Collatz Sequence",h:"3n+1 problem: loop until 1. Count steps. Find longest sequence for numbers 1-1000. Visualize sequence length."},
    {t:"Number Spiral Matrix",h:"Fill an N×N matrix in a spiral pattern using direction arrays. Print the matrix. Find value at position (r, c)."},
    {t:"Calendar Printer",h:"Print a month calendar like the cal command. Use datetime. Handle leap years. Highlight today's date with a marker."},
    {t:"BMI Calculator System",h:"BMI formula + category. Weight history tracking. Ideal weight range. Plot with text-based bar. Store in CSV."},
    {t:"Countdown Timer",h:"time.sleep(1) loop. Show HH:MM:SS. Accept input in any format. Sound alarm (print bell char). Multiple timers."},
  ],
  5:[
    {t:"Number Properties Explorer",h:"Check: prime, perfect, Armstrong, palindrome, happy. For any number, print all properties. Find all up to N."},
    {t:"Math Quiz Generator",h:"random operations (+,-,×,÷). Difficulty levels. Timer per question. Hint system. Track weak areas. Adaptive difficulty."},
    {t:"Statistics Calculator",h:"Implement mean, median, mode, variance, std dev, percentiles from scratch. Compare with statistics module."},
    {t:"Matrix Operations",h:"2D list matrix: add, multiply, transpose. Input matrix from user. Determinant for 2×2, 3×3. Row reduction."},
    {t:"Polynomial Evaluator",h:"List of coefficients. Eval at x using Horner's method. Add/multiply polynomials. Find roots by bisection method."},
    {t:"Budget Planner",h:"Income, fixed/variable expenses input. Net savings calc. Months to reach savings goal. Emergency fund calculator."},
    {t:"Unit Converter Suite",h:"Length, weight, temperature, volume, speed, area. Two-way conversion. Most common conversions quick-access menu."},
    {t:"Loan Calculator",h:"Monthly payment with compound interest formula. Total interest paid. Amortization schedule. Extra payment impact."},
    {t:"Grade Point Calculator",h:"GPA from letter grades + credit hours. Cumulative GPA. Required grades to reach target GPA. Dean's list check."},
    {t:"Number Puzzle Solver",h:"Magic squares, Sudoku verifier, cross-sum puzzles. Brute-force search with pruning. Puzzle generator."},
  ],
  6:[
    {t:"Function Benchmarker",h:"timeit.timeit() wrapper. Compare multiple implementations. Plot results as ASCII bar chart. Auto-repeat for accuracy."},
    {t:"Closure-Based Counter",h:"Factory function returning increment/decrement/reset functions sharing state. Rate-limited counter. Thread-safe version."},
    {t:"Argument Parser Framework",h:"Build argparse-lite: parse sys.argv. Support flags, options, positional args. Help message generation."},
    {t:"Function Pipeline",h:"Chain functions: pipeline(f, g, h)(x) == h(g(f(x))). Partial application. Composition operator. Lazy evaluation."},
    {t:"Recursive Data Processor",h:"Deep copy, deep compare, deep merge of nested dicts/lists. Find all values by key path. Flatten nested structure."},
    {t:"Memoization Library",h:"LRU cache decorator. TTL-based cache. Stats: hits, misses, hit rate. Cache invalidation by key pattern."},
    {t:"Error Handler Decorator",h:"@retry with backoff, @timeout, @log_errors, @validate_args decorators. Compose multiple decorators."},
    {t:"Command Dispatcher",h:"Dict mapping command names to functions. Register commands with decorator. Help system. Alias support."},
    {t:"Mini Test Framework",h:"@test decorator, assert_equal/assert_raises helpers. Test discovery. Pass/fail/skip reporting. Test fixtures."},
    {t:"Functional Utilities",h:"Implement: curry, compose, pipe, memoize, once, debounce, throttle, partial. Pure Python, no imports."},
  ],
  7:[
    {t:"JSON Config Manager",h:"Load/save nested config. Dot-notation access: config.get('db.host'). Env var override. Schema validation."},
    {t:"CSV Analyzer",h:"Read large CSVs with csv module. Filter rows, sort, group by column. Summary stats. Write filtered results."},
    {t:"Log File Parser",h:"Parse nginx/apache logs with regex. Count status codes, top IPs, peak hours. Detect 404 patterns. Alert thresholds."},
    {t:"Directory Organizer",h:"Scan folder, organize files by extension/date/size. Dry-run mode. Undo log. Duplicate finder with hash check."},
    {t:"File Synchronizer",h:"Compare two directories using checksums. Copy new/modified. Delete removed. Show diff. Schedule with cron."},
    {t:"Text File Search Engine",h:"Index words→file positions. Boolean AND/OR/NOT queries. Phrase search. Ranked results by frequency."},
    {t:"Backup Tool",h:"Zip files/folders with timestamp. Incremental backup (only changed). Restore from backup. Retention policy."},
    {t:"Markdown to HTML",h:"Parse headings, bold, italic, links, lists. Build element tree. Render to HTML string. Handle nested markdown."},
    {t:"Configuration File Generator",h:"Jinja2-like templates for .env, .conf, Dockerfile. Variable substitution. Conditional blocks. Include files."},
    {t:"File Duplicate Finder",h:"MD5/SHA256 hash all files. Group by hash. Show duplicate sets. Interactive delete or hardlink. Size savings report."},
  ],
  8:[
    {t:"Exception Hierarchy Printer",h:"Traverse BaseException.__subclasses__() recursively. Print tree with indentation. Filter by module. Show MRO."},
    {t:"Custom Exception Library",h:"AppError base class. ValidationError, AuthError, NotFoundError with status codes. Structured logging on raise."},
    {t:"Safe Math Evaluator",h:"Parse math expressions safely (no eval). AST-based: tokenize → parse → evaluate. Support variables, functions."},
    {t:"File Operation Safety Wrapper",h:"@safe_open, @atomic_write decorators. Backup before overwrite. Checksum verification. Retry on PermissionError."},
    {t:"Input Validation Library",h:"Validate: email, phone, URL, IP, date, credit card. Return validation errors list. Chainable validators."},
    {t:"Retry Mechanism",h:"@retry(max_attempts, delay, backoff, exceptions). Jitter. Circuit breaker pattern. Fallback value support."},
    {t:"Context Manager Collection",h:"timer(), temp_dir(), env_override(), capture_output(), atomic_file() context managers. Use contextlib."},
    {t:"Error Logger",h:"Custom logging handler. Format with timestamp/level/file/line. File + console output. Log rotation. Email on CRITICAL."},
    {t:"Assertion Library",h:"assert_equal, assert_raises, assert_almost_equal, assert_in, assert_is_instance with descriptive error messages."},
    {t:"Graceful Shutdown Handler",h:"Signal handlers (SIGINT, SIGTERM). Cleanup registry. Timeout for cleanup tasks. State save before exit."},
  ],
  9:[
    {t:"Object Serializer",h:"Custom __repr__, __str__, __eq__, __hash__. JSON serializer for custom objects. Deep copy/compare support."},
    {t:"Data Class Generator",h:"Implement dataclass-like decorator from scratch: add __init__, __repr__, __eq__ based on class annotations."},
    {t:"Observer Pattern Framework",h:"Subject/Observer base classes. Event types. Async notification support. Weak references to observers."},
    {t:"Strategy Pattern Library",h:"Sorting strategies (quick/merge/heap). Interchangeable algorithm objects. Benchmark multiple strategies."},
    {t:"Builder Pattern",h:"QueryBuilder for SQL, RequestBuilder for HTTP, DocumentBuilder for markdown. Fluent interface (method chaining)."},
    {t:"Singleton Registry",h:"Thread-safe singleton. Plugin registry pattern. Service locator. Dependency injection container."},
    {t:"Proxy Pattern",h:"Lazy loading proxy. Caching proxy. Permission checking proxy. Logging proxy. Transparent interface."},
    {t:"Linked List Library",h:"Singly/doubly linked list. All operations: insert, delete, reverse, cycle detection, merge sorted lists."},
    {t:"Stack and Queue Library",h:"Stack, Queue, Deque, Priority Queue from scratch using arrays and linked lists. All with proper complexity."},
    {t:"Binary Tree Toolkit",h:"BST: insert, search, delete. Traversals: in/pre/post/level. Height, balance check. AVL auto-balance."},
  ],
  10:[
    {t:"Decorator Composition Framework",h:"@compose multiple decorators cleanly. Order matters — demonstrate. functools.wraps to preserve metadata."},
    {t:"Class Decorator Collection",h:"@singleton, @cached_property, @type_check, @abstract_method decorators for classes. Property validators."},
    {t:"Property Validator",h:"Descriptor protocol: __get__, __set__, __delete__. Typed properties. Range validators. Readonly properties."},
    {t:"Metaclass Logger",h:"Metaclass that logs all method calls. Track instantiation count. Auto-register subclasses in a registry."},
    {t:"Function Tracer",h:"Decorator printing call stack depth, arguments, return values. Configurable depth limit. Performance timing."},
    {t:"Benchmark Decorator",h:"@benchmark(n=100) runs function n times, reports min/max/mean/std. Compares two implementations side by side."},
    {t:"API Rate Limiter",h:"Token bucket algorithm. Per-user limits. Redis-backed (or dict-backed). Decorator interface. Headers injection."},
    {t:"Permission System",h:"@requires_role('admin'), @login_required decorators. Role hierarchy. Permission inheritance. Audit log."},
    {t:"Lazy Loader",h:"__getattr__ on module to lazy-import. Lazy class attributes. Cache after first access. Thread-safe loading."},
    {t:"Method Missing Handler",h:"__getattr__/__getattribute__ magic. Dynamic method generation. Proxy any object. Record all calls."},
  ],
  11:[
    {t:"Infinite Sequence Generator",h:"fibonacci(), primes(), naturals(), random_walk() generators. Combine with itertools.islice(). Lazy evaluation."},
    {t:"Data Pipeline with Generators",h:"Chain generators: read_csv | filter | transform | write_csv. Memory-efficient for huge files. Pluggable stages."},
    {t:"Custom Range Iterator",h:"Implement range-like class with __iter__, __next__, __len__, __contains__. Float step support. Reverse iteration."},
    {t:"Event-Driven System",h:"Generator-based coroutines. send() values in. yield control back. Simulate async without asyncio."},
    {t:"Chunked File Processor",h:"Read file in chunks with generator. Process chunks in parallel. Merge results. Memory stays constant regardless of file size."},
    {t:"Tree Traversal Generator",h:"Yield nodes in DFS/BFS order without recursion. Accept any tree structure. depth parameter. Path tracking."},
    {t:"Sliding Window Generator",h:"window(seq, n) yields tuples. Supports overlap. Apply stats to each window. Streaming min/max/avg."},
    {t:"Round Robin Scheduler",h:"cycle() over tasks with weights. Yield task based on priority. Pause/resume tasks. Fairness metrics."},
    {t:"Tokenizer Generator",h:"Yield tokens from source text: numbers, strings, operators, identifiers. Position tracking. Error recovery."},
    {t:"Merge K Sorted Iterators",h:"heapq.merge() then custom merge. Handle infinite iterators. Peek without consuming. Priority queue approach."},
  ],
  12:[
    {t:"Async Web Scraper",h:"aiohttp + asyncio.gather(). Semaphore for rate limiting. Retry with backoff. Save results as they come in."},
    {t:"Async Chat Server",h:"asyncio streams. Multiple clients. Broadcast messages. Private messages. Room support. History buffer."},
    {t:"Concurrent File Downloader",h:"asyncio + aiohttp to download N URLs. Progress bar per file. Total bandwidth. Retry failed. Checksum verify."},
    {t:"Async Job Queue",h:"asyncio.Queue producer/consumer. Priority queue. Dead letter queue. Worker pool. Job status tracking."},
    {t:"Async API Client",h:"Async HTTP client wrapper. Connection pooling. Request/response middleware. Timeout handling. Circuit breaker."},
    {t:"Event Loop Visualizer",h:"Instrument asyncio event loop. Log: coroutine start/end/await. Show concurrent tasks timeline. Detect blocking."},
    {t:"Async Rate Limiter",h:"Token bucket with asyncio. Per-endpoint limits. Await when rate exceeded. Burst allowance. Metrics."},
    {t:"Async Database Pool",h:"Async connection pool. Acquire/release with async context manager. Max connections. Queue waiting requests."},
    {t:"Task Scheduler",h:"Schedule coroutines at specific times. cron-like syntax. Cancel tasks. Persist schedule. Missed task handling."},
    {t:"Async Pipeline",h:"Chain async generators: source | transform | filter | sink. Backpressure. Error propagation. Cancellation."},
  ],
  13:[
    {t:"Testing Framework",h:"Discover test_ functions. Fixtures via dependency injection. Parametrize. Mocking. Coverage report. HTML output."},
    {t:"Test Data Factory",h:"Factory functions for test data. Faker-lite: random names, emails, addresses. Seeded random for reproducibility."},
    {t:"Mutation Tester",h:"Modify source code (flip operators, change constants). Run tests. Detect which mutations are NOT caught = weak tests."},
    {t:"Snapshot Tester",h:"Serialize output to JSON. Compare with stored snapshot. Update on --update flag. Diff viewer for changes."},
    {t:"Property-Based Tester",h:"Generate random inputs. Run property assertions (output always sorted, length preserved). Shrink failing examples."},
    {t:"Mock Library",h:"Mock object that records calls. assert_called_with(), call_count. Patch context manager. Side effects."},
    {t:"Performance Test Suite",h:"Measure execution time, memory usage. Assert performance budgets. Compare before/after. Regression detection."},
    {t:"Integration Test Runner",h:"Start dependencies (mock server, temp DB). Run test suite. Tear down. Report per-test timing and dependencies."},
    {t:"Coverage Analyzer",h:"Instrument code with sys.settrace(). Track which lines execute. Report uncovered lines. Branch coverage."},
    {t:"Chaos Engineering Tool",h:"Randomly inject failures: slow functions, raise exceptions, corrupt data. Test system resilience. Recovery metrics."},
  ],
  14:[
    {t:"SQLite ORM",h:"Map Python classes to tables. CRUD via method calls. Query builder. Relationships (FK). Migrations. Connection pool."},
    {t:"Database Migration Tool",h:"Version-controlled schema changes. Up/down migrations. Apply pending migrations. Rollback. Migration history table."},
    {t:"Query Builder",h:"Fluent interface: db.select('users').where(age>18).order_by('name').limit(10). Build parameterized SQL. Prevent injection."},
    {t:"Connection Pool Manager",h:"Min/max connections. Acquire/release. Timeout. Health checks. Auto-reconnect. Metrics: pool size, wait time."},
    {t:"Data Seeder",h:"Generate realistic test data for any schema. Respect foreign keys. Batch insert. Progress bar. Configurable counts."},
    {t:"Database Backup Tool",h:"Dump to SQL or CSV. Compress. Encrypt. Schedule. Incremental backup. Restore with validation."},
    {t:"Schema Visualizer",h:"Read SQLite schema. Generate ASCII ERD diagram. Show tables, columns, types, FK relationships."},
    {t:"CSV to SQLite Importer",h:"Auto-detect column types. Handle nulls/duplicates. Batch inserts. Progress. Validate constraints. Create indexes."},
    {t:"SQL Formatter",h:"Parse SQL, reformat with consistent indent/case. Validate syntax. Detect N+1 query patterns. Suggest indexes."},
    {t:"Audit Log System",h:"Trigger-based change tracking. Who changed what, when, old→new value. Queryable history. Point-in-time recovery."},
  ],
  15:[
    {t:"HTTP Client Library",h:"GET/POST/PUT/DELETE with requests. Session management. Cookie handling. Retry. Timeout. Response validation."},
    {t:"REST API Wrapper",h:"Base class for API clients. Auth methods (API key, OAuth, JWT). Rate limiting. Pagination. Response caching."},
    {t:"Webhook Server",h:"FastAPI endpoint receiving webhooks. Verify HMAC signature. Queue events. Retry failed handlers. Dashboard."},
    {t:"GraphQL Client",h:"HTTP client for GraphQL. Build queries as Python. Handle errors. Introspection. Schema validation."},
    {t:"API Response Validator",h:"JSON Schema validation. Type checking. Required fields. Custom validators. Detailed error messages. Diff tool."},
    {t:"API Load Tester",h:"Async concurrent requests. Ramp up/down. Latency percentiles (p50/p95/p99). Error rate. Throughput. Report."},
    {t:"Retry Middleware",h:"Transparent retry for HTTP. Exponential backoff. Idempotency keys. Circuit breaker. Fallback responses."},
    {t:"API Mock Server",h:"Define routes with expected responses. Request matching. Delay simulation. Failure injection. Record/replay mode."},
    {t:"OpenAPI Generator",h:"Read FastAPI app. Generate OpenAPI spec. Generate client SDK. Sync spec with code changes. Validation."},
    {t:"WebSocket Client",h:"Persistent connection. Ping/pong. Reconnect on disconnect. Message queue. Binary + text support."},
  ],
  16:[
    {t:"Web Scraper Framework",h:"Page fetcher with caching. CSS selector extraction. Pagination handler. Rate limiting. Robots.txt compliance."},
    {t:"Price Monitor",h:"Scrape product pages every N hours. Track price history. Alert on drop below threshold. Export to CSV/chart."},
    {t:"News Aggregator",h:"Scrape RSS feeds + HTML. Deduplicate by title similarity. Categorize by keyword. Markdown digest output."},
    {t:"Job Listing Scraper",h:"Multiple job boards. Normalize fields. Deduplicate. Filter by keywords. Email digest. Store in SQLite."},
    {t:"Social Media Archiver",h:"Download posts, images, metadata. Deduplicate. Search your archive. Export to various formats. Privacy-safe."},
    {t:"Wikipedia Summarizer",h:"Fetch Wikipedia page. Extract first 3 paragraphs. Clean HTML. Summarize with sentence scoring. Related articles."},
    {t:"Real Estate Data Collector",h:"Scrape listings: price, size, location, date. Clean data. Export to pandas. Geographic clustering."},
    {t:"Academic Paper Downloader",h:"Search arXiv API. Download PDFs. Extract abstract/authors. Citation graph builder. Topic clustering."},
    {t:"Amazon Review Analyzer",h:"Scrape reviews (with selenium). Sentiment scoring. Keyword extraction. Rating distribution. Fake review detection."},
    {t:"Sports Stats Scraper",h:"Match results, player stats, league tables. Historical data. Generate stats reports. Prediction model input."},
  ],
  17:[
    {t:"FastAPI To-Do Service",h:"CRUD endpoints. SQLite with SQLAlchemy. Pydantic models. Pagination. Filtering. Tag support. Swagger docs."},
    {t:"User Auth Service",h:"Register/login/refresh JWT. Password hashing (bcrypt). Email verification. Rate limiting. Session management."},
    {t:"File Upload Service",h:"Multipart upload. MIME type validation. Virus scan hook. Resize images. S3-compatible storage. CDN URLs."},
    {t:"URL Shortener",h:"POST long URL → short code (nanoid). GET short → redirect. Analytics: clicks, referrers, geo. Admin dashboard."},
    {t:"Notification Service",h:"Email (SMTP) and SMS (Twilio) notifications. Templates with Jinja2. Queue-based sending. Delivery tracking."},
    {t:"Rate Limiter Middleware",h:"Per-IP and per-user rate limits. Token bucket in Redis/dict. HTTP 429 with Retry-After. Whitelist/blacklist."},
    {t:"Health Check Service",h:"GET /health endpoint. Check DB, cache, external APIs. Circuit breaker status. Version info. SLA monitoring."},
    {t:"Audit Trail API",h:"Middleware logging every request: user, endpoint, params, response code, duration. Queryable audit log endpoint."},
    {t:"Feature Flag Service",h:"Enable/disable features per user/percentage. A/B testing support. Real-time updates. Analytics integration."},
    {t:"Event Streaming API",h:"Server-Sent Events (SSE) endpoint. Broadcast to subscribed clients. Reconnect support. Event history."},
  ],
  18:[
    {t:"Sales Dashboard",h:"pandas: load CSV, group by product/region/date. matplotlib: bar, line, pie charts. Interactive filters. Export PDF."},
    {t:"COVID Data Analyzer",h:"Download official datasets. Plot cases/deaths/vaccinations over time. Country comparisons. Moving averages."},
    {t:"Stock Market Analyzer",h:"yfinance OHLC data. Moving averages, RSI, MACD, Bollinger Bands. Backtest simple strategies."},
    {t:"Weather Pattern Analyzer",h:"Download NOAA weather data. Plot temperature trends. Anomaly detection. Monthly/seasonal averages. Forecasting."},
    {t:"Social Media Analytics",h:"Follower growth, engagement rates. Best posting times. Hashtag performance. Competitor analysis. Trend detection."},
    {t:"E-commerce Analytics",h:"Sales by product/category/time. Customer cohort analysis. Churn prediction. LTV calculation. Funnel analysis."},
    {t:"Log Analytics Dashboard",h:"Parse application logs. Error frequency, latency percentiles. Alert conditions. Time series plotting."},
    {t:"Survey Data Analyzer",h:"Load CSV responses. Likert scale analysis. Cross-tabulation. Statistical significance tests. Report generation."},
    {t:"Fitness Tracker Analytics",h:"Import Apple Health / Fitbit export. Plot activity trends. Sleep quality analysis. Goal tracking. Correlations."},
    {t:"City Transit Analysis",h:"GTFS feed processing. Route efficiency. On-time performance. Passenger load estimation. Map visualization."},
  ],
  19:[
    {t:"NumPy Image Filter",h:"Load image as array. Apply kernels: blur, sharpen, edge detect. Custom filters. Before/after comparison."},
    {t:"Signal Processing",h:"Generate sine/square/noise signals. FFT frequency analysis. Filter design. Spectrogram. Audio visualization."},
    {t:"Monte Carlo Simulator",h:"Pi estimation, option pricing, risk analysis. Vectorized operations. Statistical confidence intervals."},
    {t:"Linear Algebra Visualizer",h:"2D transformations: rotation, scaling, shear. Show eigenvectors. Matrix multiplication as transformations."},
    {t:"Optimization Solver",h:"Gradient descent visualization. Simulate annealing. Genetic algorithm. Benchmark on classic functions."},
    {t:"Physics Simulation",h:"Projectile motion, pendulum, N-body gravity. numpy ODE solver. Animate with matplotlib."},
    {t:"Neural Network from Scratch",h:"numpy only: forward pass, backprop, gradient descent. Train on XOR or MNIST. Plot loss curve."},
    {t:"Image Compression",h:"SVD-based compression. Show quality vs compression ratio. PCA for dimensionality reduction. PSNR metric."},
    {t:"Time Series Forecasting",h:"Moving average, exponential smoothing, ARIMA-lite. Evaluate with MAE/RMSE. Confidence intervals."},
    {t:"Clustering Algorithm",h:"K-means from scratch with numpy. Elbow method for K. Compare with sklearn. Visualize cluster boundaries."},
  ],
  20:[
    {t:"Titanic Survival Model",h:"EDA → feature engineering → logistic regression + decision tree. Cross-validation. Feature importance. Kaggle submission."},
    {t:"Customer Churn Predictor",h:"Telecom dataset. Feature engineering. Class imbalance (SMOTE). Random forest. SHAP values. Business impact."},
    {t:"Sentiment Analyzer",h:"Movie/product reviews. TF-IDF + logistic regression. VADER for quick sentiment. Confusion matrix analysis."},
    {t:"Spam Classifier",h:"Email dataset. Text preprocessing. Naive Bayes + SVM comparison. Precision/recall tradeoff. Real-time prediction."},
    {t:"House Price Predictor",h:"Ames dataset. Null handling. Feature engineering. Ridge/Lasso/XGBoost. Stacking ensemble. SHAP explanations."},
    {t:"Image Classifier",h:"scikit-learn: HOG features + SVM. MNIST/CIFAR-10. Confusion matrix. Grad-CAM-like visualization."},
    {t:"Anomaly Detector",h:"Isolation Forest + One-Class SVM. Credit card fraud dataset. ROC curve. Precision-recall curve. Alert system."},
    {t:"Recommendation System",h:"Collaborative filtering with matrix factorization. Content-based with TF-IDF. Hybrid approach. A/B test simulation."},
    {t:"Drug Discovery EDA",h:"Molecule property analysis. Activity cliffs detection. Structure-activity relationships. Model for IC50 prediction."},
    {t:"Natural Language Classifier",h:"Multi-class text classification. Preprocessing pipeline. Evaluate multiple models. Hyperparameter tuning."},
  ],
  21:[
    {t:"LeetCode Practice Tracker",h:"Track problems by company, difficulty, topic. Spaced repetition schedule. Success rate analytics. Note taking."},
    {t:"Algorithm Visualizer",h:"Animate sorting/searching algorithms in terminal using curses or HTML output. Step-by-step with comparison count."},
    {t:"Graph Problems Solver",h:"Implement: DFS/BFS/Dijkstra/A*/Bellman-Ford. Visualize on grid. Compare performance. Handle directed/weighted."},
    {t:"Dynamic Programming Explorer",h:"Classic DP: knapsack, LCS, edit distance, coin change. Show memoization table. Bottom-up vs top-down."},
    {t:"Tree Algorithm Library",h:"BST, AVL, Red-Black trees. All operations. Visualization. Balance metrics. Performance vs sorted list."},
    {t:"String Algorithm Suite",h:"KMP, Rabin-Karp, Z-algorithm pattern matching. Suffix array/trie. Aho-Corasick multi-pattern."},
    {t:"Competitive Programming Helper",h:"Template generator, test case creator, I/O template, complexity analyzer. Problem tag classifier."},
    {t:"Backtracking Puzzle Solver",h:"N-Queens, Sudoku, Word Search, Combination Sum, Permutations. Visualize backtrack steps."},
    {t:"Segment Tree Library",h:"Range sum/min/max queries. Lazy propagation. Point/range updates. Persistent version. Merge sort tree."},
    {t:"Graph Generation Suite",h:"Random graphs: Erdős-Rényi, Barabási-Albert. Planarity test. Coloring. Community detection. Export."},
  ],
  22:[
    {t:"Huffman Coder",h:"Build frequency table. Min-heap priority queue. Build tree. Generate codes. Encode/decode files. Compression ratio stats."},
    {t:"Trie Autocomplete",h:"Insert words with frequencies. Suggest top-K completions. Fuzzy matching. Delete words. Serialize/deserialize."},
    {t:"Skip List Implementation",h:"Probabilistic data structure. Insert/search/delete O(log n). Compare with sorted list. Visualization."},
    {t:"Bloom Filter",h:"Bit array + k hash functions. False positive rate analysis. Size calculator. Counting variant. Network dedup use case."},
    {t:"Disjoint Set Union",h:"Union-Find with path compression + union by rank. Applications: Kruskal's MST, connected components, percolation."},
    {t:"Fenwick Tree",h:"Binary Indexed Tree for prefix sums. Range queries. Point updates. 2D extension. Application to inversion count."},
    {t:"LRU Cache Implementation",h:"OrderedDict or doubly-linked-list + hashmap. get/put in O(1). LFU variant. TTL support. Thread-safe version."},
    {t:"Persistent Data Structure",h:"Persistent array, stack, linked list. Structural sharing. Version history. Undo/redo. Functional update semantics."},
    {t:"Interval Tree",h:"Insert intervals. Query: all overlapping intervals. Delete. Applications: calendar scheduling, genomics."},
    {t:"Cartesian Tree",h:"Build from array. Min/Max cartesian tree. RMQ with sparse table. LCA using Euler tour + RMQ."},
  ],
  23:[
    {t:"Python Packaging",h:"pyproject.toml, setup.cfg. Build wheel/sdist. Publish to PyPI (test). Entry points. Version management."},
    {t:"CLI Tool with Click/Typer",h:"Multi-command CLI. Rich output with colors/tables. Progress bars. Config file support. Shell completion."},
    {t:"Code Formatter/Linter",h:"AST-based code analysis. Style checker: naming, line length, complexity. Auto-fix mode. VS Code extension."},
    {t:"Documentation Generator",h:"Parse Python docstrings. Generate HTML/Markdown docs. Type hint extraction. Example execution. Cross-references."},
    {t:"GitHub Actions Workflow",h:"CI pipeline: lint, test, coverage, build. Deploy on tag. Matrix testing Python 3.9-3.12. Cache dependencies."},
    {t:"Docker Multi-Stage Build",h:"Optimize Python Docker image: slim base, non-root user, multi-stage for builder/runtime. Health check."},
    {t:"Pre-commit Hook Suite",h:"Custom hooks: check imports sorted, types valid, no debug prints, complexity check. Run in CI too."},
    {t:"Code Complexity Analyzer",h:"McCabe cyclomatic complexity. Function length. Dependency graph. Coupling/cohesion metrics. Refactor suggestions."},
    {t:"Import Optimizer",h:"Find unused imports. Sort and group imports (isort-lite). Circular import detector. Lazy import suggester."},
    {t:"Performance Profiler",h:"cProfile wrapper. Memory profiler. Line profiler. Flame graph generator. Hotspot identification. Report."},
  ],
  24:[
    {t:"System Design Simulator",h:"Simulate: load balancer, cache, DB, CDN. Measure: latency, throughput, availability. Failure injection."},
    {t:"Portfolio Website Generator",h:"Read your GitHub profile. Auto-generate static site: projects, skills, experience. Deploy to GitHub Pages."},
    {t:"Technical Blog Engine",h:"Markdown posts → HTML. Syntax highlighting. Tag system. Search. RSS feed. Static site generation."},
    {t:"Resume Builder",h:"YAML/JSON input → PDF resume via reportlab. Multiple themes. ATS score check. Keyword optimizer."},
    {t:"Code Review Bot",h:"GitHub webhook. Analyze PR diff: style, complexity, test coverage, security. Post automated comments."},
    {t:"Mock Interview Platform",h:"Random question from DB. Timer. Hint system. Solution reveal. Score based on time + hints used. Progress."},
    {t:"Contribution Streak Analyzer",h:"GitHub API: commit history. Streak tracking. Language breakdown. Peak hours. Contribution heatmap calendar."},
    {t:"Developer Productivity Dashboard",h:"Git commits, PR reviews, issues closed, study hours. Weekly report. Goal tracking. Slack integration."},
    {t:"Capstone: Full-Stack App",h:"FastAPI backend + CLI + optional React/HTML frontend. Auth, DB, tests, Docker, CI/CD. Deploy on Railway/Render."},
    {t:"Open Source Starter Kit",h:"Choose repo. Read CONTRIBUTING.md. Fix real issue. Write tests. Submit PR. Document the entire process."},
  ],
};

/* ─────────────────────────── AUTO QUESTION GENERATOR ─────────────────────────── */
async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:4000,
      messages:[{role:"user", content: prompt}]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:{message:"HTTP "+res.status}}));
    throw new Error(err?.error?.message || "API error " + res.status);
  }
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "API error");
  const raw = data.content.map(c=>c.text||"").join("").trim();
  const cleaned = raw.replace(/```json|```/g,"").trim();
  const start = cleaned.indexOf("{"); const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("JSON parse failed — response may be truncated. Retry.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function autoGenerateQuestions(topicText, weekTitle) {
  // Two calls of 50 questions each — avoids token limit issues
  const COMPANIES = "Google, Meta, Amazon, Microsoft, OpenAI, Apple, Netflix, Stripe, Uber, Airbnb";
  const LINKS = "docs.python.org, realpython.com, geeksforgeeks.org/python, leetcode.com/explore";

  const prompt1 = `Generate 50 Python interview questions for: "${topicText}" (${weekTitle})
Return ONLY JSON, no markdown:
{"easy":[{"q":"question text","co":"Company","link":"https://url"}],"medium":[...]}
easy: 20 questions, medium: 30 questions.
Companies: ${COMPANIES}. Links from: ${LINKS}.
Keep each question concise (under 100 chars). Keep links short.`;

  const prompt2 = `Generate 50 more Python interview questions for: "${topicText}" (${weekTitle})
Return ONLY JSON, no markdown:
{"hard":[{"q":"question text","co":"Company","link":"https://url"}],"vhard":[...]}
hard: 35 questions, vhard: 15 questions.
Companies: ${COMPANIES}. Links from: ${LINKS}.
Keep each question concise (under 100 chars). Keep links short.`;

  const [part1, part2] = await Promise.all([callClaude(prompt1), callClaude(prompt2)]);
  return {
    easy:   (part1.easy   || []).slice(0, 25),
    medium: (part1.medium || []).slice(0, 30),
    hard:   (part2.hard   || []).slice(0, 30),
    vhard:  (part2.vhard  || []).slice(0, 15),
  };
}

/* ─────────────────────────── UPDATED TOPIC PANEL ─────────────────────────── */
const TopicPanel = ({ topic, topicIdx, weekN, monthColor, done, onToggle, weekTitle }) => {
  const storKey = `q-${weekN}-${topicIdx}`;
  const [questions, saveQuestions] = useStorage(storKey, null);
  const [loading, setLoading] = useState(false);
  const [qDiff, setQDiff] = useState("easy");
  const [open, setOpen] = useState(false);
  const [ideaOpen, setIdeaOpen] = useState(false);

  const [qError, setQError] = useState(null);

  const loadQuestions = () => {
    setLoading(true);
    setQError(null);
    autoGenerateQuestions(topic, weekTitle, weekN, topicIdx)
      .then(q => { saveQuestions(q); setQError(null); })
      .catch(e => { setQError(e.message || "Generation failed. Check console."); console.error("Q gen error:", e); })
      .finally(() => setLoading(false));
  };

  // Auto-load when panel opens (only if not already loaded / errored)
  useEffect(() => {
    if (open && !questions && !loading && !qError) {
      loadQuestions();
    }
  }, [open]);

  const diffConfig = [
    { k:"easy",  label:"🟢 Easy",      cls:"b-easy",  count:25, c:T.green },
    { k:"medium",label:"🟡 Medium",    cls:"b-med",   count:30, c:T.amber },
    { k:"hard",  label:"🔴 Hard",      cls:"b-hard",  count:30, c:"#f87171" },
    { k:"vhard", label:"🟣 Very Hard", cls:"b-vhard", count:15, c:"#c084fc" },
  ];

  const displayed = questions?.[qDiff] || [];
  const weekIdeas = WEEK_IDEAS[weekN] || [];

  return (
    <div className={`topic-row ${done ? "done" : ""}`} style={{ flexDirection:"column", cursor:"default" }}>
      {/* Main row */}
      <div style={{ display:"flex", gap:10, alignItems:"flex-start", width:"100%", flexWrap:"wrap" }}>
        <div onClick={() => onToggle(`m${weekN}-t${topicIdx}`)}
          style={{
            width:22, height:22, borderRadius:6, flexShrink:0, marginTop:2, cursor:"pointer",
            background: done ? T.green : "transparent",
            border:`2px solid ${done ? T.green : "#2a2a60"}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, color:"#000", fontWeight:900, transition:"all .2s"
          }}>{done ? "✓" : ""}</div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:600, color: done ? T.green : T.t1, lineHeight:1.5 }}>
            {topic}
          </div>
          {done && <span style={{ fontSize:10, color:T.green }}>✅ Studied</span>}
        </div>

        <div style={{ display:"flex", gap:6, flexShrink:0, flexWrap:"wrap" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setIdeaOpen(!ideaOpen)}
            style={{ fontSize:11, color:ideaOpen?"#f59e0b":T.t2 }}>
            💡 {ideaOpen?"Hide":"Ideas"}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setOpen(!open)}
            style={{ fontSize:11, color:open?monthColor:T.t2 }}>
            {open ? "▲ Hide" : "📚 Questions"}
          </button>
        </div>
      </div>

      {/* Project Ideas Panel */}
      {ideaOpen && weekIdeas.length > 0 && (
        <div className="fade-in" style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}`, width:"100%" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.amber, marginBottom:10, letterSpacing:.5 }}>💡 PROJECT IDEAS FOR THIS TOPIC</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,280px),1fr))", gap:8 }}>
            {weekIdeas.map((idea, i) => (
              <div key={i} style={{
                background:"#070718", border:`1px solid ${T.amber}25`, borderRadius:10, padding:"10px 13px",
                transition:"border-color .2s"
              }}>
                <div style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:5 }}>
                  <span style={{ fontSize:10, fontWeight:800, color:T.amber, background:T.amber+"15", padding:"2px 7px", borderRadius:999, flexShrink:0 }}>#{i+1}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:T.t1, lineHeight:1.3 }}>{idea.t}</span>
                </div>
                <p style={{ fontSize:11, color:T.t2, lineHeight:1.6, paddingLeft:4 }}>🔧 {idea.h}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions Panel */}
      {open && (
        <div className="fade-in" style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}`, width:"100%" }}>
          {loading ? (
            <div style={{ padding:"20px 0", textAlign:"center" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:14 }}>
                <span style={{ fontSize:16, animation:"spin .8s linear infinite", display:"inline-block" }}>⟳</span>
                <span style={{ fontSize:13, color:T.blue, fontWeight:600 }}>Auto-loading 100 questions for this topic...</span>
              </div>
              {[80,60,90,50,70].map((w,i) => (
                <div key={i} style={{ height:14, background:"#08082a", borderRadius:7, marginBottom:6, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${w}%`, background:"linear-gradient(90deg,#0d0d30,#1a1a50,#0d0d30)", backgroundSize:"200% 100%", animation:"shimmer 1.2s linear infinite", borderRadius:7 }}/>
                </div>
              ))}
            </div>
          ) : questions ? (
            <>
              {/* Diff tabs */}
              <div style={{ display:"flex", gap:5, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
                {diffConfig.map(d => (
                  <button key={d.k} onClick={() => setQDiff(d.k)} className="btn btn-sm"
                    style={{
                      background: qDiff === d.k ? d.c+"25" : "transparent",
                      border:`1px solid ${qDiff === d.k ? d.c+"80" : T.border}`,
                      color: qDiff === d.k ? d.c : T.t2,
                      fontFamily:"'DM Sans',sans-serif"
                    }}>
                    {d.label} <span style={{ fontSize:10, opacity:.7 }}>({questions[d.k]?.length || 0})</span>
                  </button>
                ))}
                <button className="btn btn-ghost btn-sm" style={{ marginLeft:"auto", fontSize:11 }}
                  onClick={() => { saveQuestions(null); setQError(null); loadQuestions(); }}>
                  🔄 Refresh
                </button>
              </div>

              <div style={{ maxHeight:400, overflowY:"auto", paddingRight:4, display:"flex", flexDirection:"column", gap:5 }}>
                {displayed.map((q, i) => {
                  const dc = qDiff==="easy"?T.green:qDiff==="medium"?T.amber:qDiff==="hard"?"#f87171":"#c084fc";
                  return (
                    <div key={i} className="q-row" style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <span className="mono" style={{
                        fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:5, flexShrink:0, marginTop:1,
                        background: dc+"12", color: dc, border:`1px solid ${dc}40`
                      }}>Q{i+1}</span>
                      <p style={{ fontSize:13, color:T.t1, lineHeight:1.6, flex:1 }}>{q.q}</p>
                      <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end", flexShrink:0 }}>
                        <span style={{ fontSize:10, color:T.t2, background:T.surf, padding:"2px 7px", borderRadius:999, border:`1px solid ${T.border}`, whiteSpace:"nowrap" }}>
                          🏢 {q.co}
                        </span>
                        {q.link && (
                          <a href={q.link} target="_blank" rel="noreferrer"
                            style={{ fontSize:10, color:T.blue, background:T.blue+"12", padding:"2px 7px", borderRadius:999, border:`1px solid ${T.blue}40`, textDecoration:"none", whiteSpace:"nowrap" }}>
                            📖 Study ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
                {displayed.length === 0 && <div style={{ textAlign:"center", padding:20, color:T.t3, fontSize:13 }}>No questions in this difficulty.</div>}
              </div>
            </>
          ) : (
            <div className="fade-in" style={{ padding:"18px 0", textAlign:"center" }}>
              {qError ? (
                <div>
                  <div style={{ fontSize:14, marginBottom:8 }}>⚠️</div>
                  <div style={{ fontSize:13, color:"#f87171", marginBottom:8, lineHeight:1.6, maxWidth:360, margin:"0 auto 12px" }}>{qError}</div>
                  <div style={{ fontSize:12, color:T.t2, marginBottom:14 }}>
                    Tip: This usually means the API response was cut off. Try clicking Retry.
                  </div>
                  <button className="btn btn-py btn-sm" onClick={loadQuestions}>🔄 Retry</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:13, color:T.t2, marginBottom:12 }}>Questions ready to load</div>
                  <button className="btn btn-py btn-sm" onClick={loadQuestions}>✨ Load 100 Questions</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


/* ─────────────────────────── WEEK CARD ─────────────────────────── */
const MIN_PER_WEEK = 3;

const WeekCard = ({ week, monthColor, topicProgress, onToggle, expanded, onExpand, idx }) => {
  const done = week.topics.filter((_, j) => topicProgress[`m${week.n}-t${j}`]).length;
  const pct = Math.round((done / week.topics.length) * 100);
  const complete = done >= MIN_PER_WEEK;
  const [projOpen, setProjOpen] = useState(false);
  const [repoOpen, setRepoOpen] = useState(false);

  return (
    <div style={{
      borderRadius:13, border:`1px solid ${complete ? T.green+"60" : expanded ? monthColor+"50" : T.border}`,
      background: complete ? "#021208" : T.card,
      marginBottom:10, overflow:"hidden",
      boxShadow: complete ? `0 0 18px ${T.green}18` : "none",
      transition:"all .25s"
    }}>
      {/* Week header */}
      <div style={{ padding:"14px 16px", cursor:"pointer", display:"flex", gap:10, alignItems:"center" }}
        onClick={() => onExpand(expanded ? null : idx)}>
        <div style={{
          width:36, height:36, borderRadius:9, flexShrink:0,
          background: complete ? T.green+"25" : monthColor+"20",
          border:`1px solid ${complete ? T.green+"50" : monthColor+"40"}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:13, fontWeight:800, color: complete ? T.green : monthColor
        }}>{complete ? "✓" : `W${week.n}`}</div>

        <div style={{ flex:1, minWidth:0 }}>
          <div className="syne" style={{ fontSize:14, fontWeight:700, color: complete ? T.green : T.t1, marginBottom:4 }}>
            {week.title}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flex:1, height:4, background:"#07072a", borderRadius:999, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", borderRadius:999, transition:"width .5s",
                background: complete ? T.green : `linear-gradient(90deg,${monthColor},${monthColor}88)`,
                boxShadow: complete ? `0 0 6px ${T.green}80` : "none"
              }} />
            </div>
            <span style={{ fontSize:11, fontWeight:700, color: complete ? T.green : T.t2, whiteSpace:"nowrap" }}>
              {done}/{week.topics.length} topics
            </span>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
          {complete
            ? <span style={{ fontSize:10, fontWeight:700, background:T.green+"20", color:T.green, padding:"2px 8px", borderRadius:999, border:`1px solid ${T.green}40` }}>✅ Week Done</span>
            : done > 0
            ? <span style={{ fontSize:10, fontWeight:700, background:monthColor+"18", color:monthColor, padding:"2px 8px", borderRadius:999, border:`1px solid ${monthColor}40` }}>Need {MIN_PER_WEEK-done} more</span>
            : <span style={{ fontSize:10, color:T.t2 }}>Goal: {MIN_PER_WEEK}/{week.topics.length}</span>
          }
          <span style={{ fontSize:11, color:T.t2 }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="fade-in" style={{ padding:"0 16px 16px", borderTop:`1px solid ${T.border}` }}>
          <div style={{ padding:"12px 0 8px", fontSize:11, color:T.t2 }}>
            ✅ Tick topics you've studied · Need at least {MIN_PER_WEEK} of {week.topics.length}
          </div>

          {/* Topics with individual question panels */}
          {week.topics.map((topic, j) => (
            <TopicPanel
              key={j}
              topic={topic}
              topicIdx={j}
              weekN={week.n}
              monthColor={monthColor}
              done={!!topicProgress[`m${week.n}-t${j}`]}
              onToggle={onToggle}
              weekTitle={week.title}
            />
          ))}

          {/* Projects section */}
          <div style={{ marginTop:14 }}>
            <button className="btn btn-ghost btn-sm" style={{ marginBottom:8 }}
              onClick={() => setProjOpen(!projOpen)}>
              {projOpen ? "▲ Hide" : "🔨 Projects"} ({week.projects.length})
            </button>
            {projOpen && (
              <div className="g2 fade-in" style={{ gap:8 }}>
                {week.projects.map((p, i) => (
                  <div key={i} style={{ background:"#05051a", border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
                      <div style={{ flex:1, fontSize:13, fontWeight:700, color:T.t1 }}>{p.title}</div>
                      <span className={`badge ${p.diff==="Easy"?"b-easy":p.diff==="Medium"?"b-med":p.diff==="Hard"?"b-hard":"b-vhard"}`}>
                        {p.diff}
                      </span>
                    </div>
                    <p style={{ fontSize:12, color:T.t2, lineHeight:1.6 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Repos section */}
          <div style={{ marginTop:10 }}>
            <button className="btn btn-ghost btn-sm" style={{ marginBottom:8 }}
              onClick={() => setRepoOpen(!repoOpen)}>
              {repoOpen ? "▲ Hide" : "📦 GitHub Repos"} ({week.repos.length})
            </button>
            {repoOpen && (
              <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {week.repos.map((r, i) => (
                  <div key={i} className="repo-card" onClick={() => window.open(`https://${r.url}`, "_blank")}>
                    <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:5 }}>
                      <span style={{ fontSize:16 }}>📦</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:T.blue, marginBottom:2 }}>
                          {r.name}
                        </div>
                        <div className="mono" style={{ fontSize:10, color:T.t2, marginBottom:4 }}>
                          ⭐ {r.stars} · {r.url}
                        </div>
                        <div style={{ fontSize:12, color:T.t2, lineHeight:1.5 }}>{r.desc}</div>
                      </div>
                      <span style={{ fontSize:11, color:T.blue }}>↗</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────── NEXT MONTH PANEL ─────────────────────────── */
const NextMonthPanel = ({ currentM, nextM, onGo }) => {
  if (!nextM) return (
    <div className="ml-banner" style={{ marginTop:20, textAlign:"center" }}>
      <div style={{ fontSize:52, marginBottom:10 }} className="float">🎓</div>
      <div className="syne" style={{ fontSize:22, fontWeight:800, color:T.green, marginBottom:8 }}>
        Python Mastery Complete!
      </div>
      <p style={{ fontSize:14, color:T.t2, lineHeight:1.7, maxWidth:480, margin:"0 auto 16px" }}>
        You've completed all 6 months of Python! Head to <strong style={{ color:T.blue }}>🌌 ML Path</strong> to see your next steps into Machine Learning and AI.
      </p>
      <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
        {["🐍 Syntax","📦 Data Structures","⚙️ OOP","🌐 APIs","📊 Pandas","🏆 DSA"].map(t => (
          <span key={t} style={{ fontSize:12, color:T.green, background:T.green+"15", padding:"4px 12px", borderRadius:999, border:`1px solid ${T.green}40`, fontWeight:600 }}>{t}</span>
        ))}
      </div>
    </div>
  );

  const GUIDE = {
    2: { focus:"Master data structures — they're the foundation of every algorithm question", actions:["Implement all list operations manually first","Solve 10 LeetCode Easys using only lists","Build your Contact Book project this week","Read time complexities of dict operations"] },
    3: { focus:"OOP is what separates scripting from real software engineering", actions:["Rewrite your Month 1 projects using classes","Understand __dunder__ methods deeply — they appear in frameworks","Learn one design pattern per week","Write tests for every class you build"] },
    4: { focus:"Everything connects to APIs and databases in real Python jobs", actions:["Get an OpenWeatherMap API key — first real API project","Set up SQLite and build a CRUD app from scratch","Learn to read API documentation independently","Start your portfolio project using an API + DB"] },
    5: { focus:"NumPy and Pandas are mandatory for AI/ML — every ML framework uses them", actions:["Complete numpy-100 exercises (github.com/rougier/numpy-100)","Download one real dataset from Kaggle and EDA it","Learn broadcasting — it's confusing but critical","Practice with pandas-exercises repo"] },
    6: { focus:"DSA and portfolio will get you hired — nothing else will", actions:["Solve 2 LeetCode problems every day — consistency beats intensity","Polish your 3 best projects with great READMEs and live demos","Practice explaining your code out loud (mock interviews)","Apply to junior roles even before you feel ready"] },
  };
  const g = GUIDE[nextM.id] || {};

  return (
    <div style={{ marginTop:20, borderRadius:14, overflow:"hidden", border:`1px solid ${nextM.color}50`, boxShadow:`0 0 28px ${nextM.color}15` }}>
      <div style={{ padding:"16px 20px", background:`linear-gradient(135deg,${nextM.color}20,${nextM.color}08)`, borderBottom:`1px solid ${nextM.color}30` }}>
        <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:36 }} className="float">{nextM.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:700, color:nextM.color, textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>
              🎉 Month {currentM.id} Complete! Up Next →
            </div>
            <div className="syne" style={{ fontSize:17, fontWeight:800, color:T.t1 }}>Month {nextM.id}: {nextM.title}</div>
            <div style={{ fontSize:12, color:T.t2 }}>{nextM.sub}</div>
          </div>
          <button className="btn btn-py" onClick={onGo}>Start Month {nextM.id} →</button>
        </div>
      </div>
      <div style={{ padding:"16px 20px", background:"#06061a" }}>
        <div className="g2">
          <div>
            <div className="sec-label">🎯 Main Focus</div>
            <p style={{ fontSize:13, fontWeight:600, color:nextM.color, marginBottom:12, lineHeight:1.5 }}>{g.focus}</p>
            <div className="sec-label">✅ First Week Action Plan</div>
            {g.actions?.map((a, i) => (
              <div key={i} style={{ display:"flex", gap:9, marginBottom:7, padding:"7px 11px", background:T.surf, borderRadius:8, border:`1px solid ${T.border}` }}>
                <span style={{ color:nextM.color, fontWeight:800, flexShrink:0, fontSize:12 }}>{i+1}.</span>
                <span style={{ fontSize:12, color:T.t1, lineHeight:1.5 }}>{a}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="sec-label">📆 Weeks Preview</div>
            {nextM.weeks.map((w, i) => (
              <div key={i} style={{ display:"flex", gap:9, marginBottom:7, padding:"9px 12px", background:T.surf, borderRadius:9, border:`1px solid ${T.border}` }}>
                <div style={{ width:26, height:26, borderRadius:6, background:nextM.color+"20", border:`1px solid ${nextM.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:nextM.color, flexShrink:0 }}>W{w.n}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:T.t1 }}>{w.title}</div>
                  <div style={{ fontSize:11, color:T.t2 }}>{w.topics.slice(0,2).join(" · ")}…</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:10, padding:"10px 14px", background:`${nextM.color}12`, border:`1px solid ${nextM.color}30`, borderRadius:10 }}>
              <div style={{ fontSize:10, fontWeight:700, color:nextM.color, marginBottom:4 }}>🏆 Month Capstone</div>
              <div style={{ fontSize:12, color:T.t1, lineHeight:1.5 }}>{nextM.weeks[nextM.weeks.length-1]?.projects[0]?.title} — {nextM.weeks[nextM.weeks.length-1]?.projects[0]?.desc}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────── PYTHON ROADMAP VIEW ─────────────────────────── */
const RoadmapView = ({ topicProgress, saveTopicProgress }) => {
  const [selMonth, setSelMonth] = useState(1);
  const [expandedWeek, setExpandedWeek] = useState(0);

  const toggle = (key) => saveTopicProgress(prev => ({ ...prev, [key]: !prev[key] }));

  const getWeekDone = (w) => w.topics.filter((_, j) => topicProgress[`m${w.n}-t${j}`]).length;
  const weekComplete = (w) => getWeekDone(w) >= MIN_PER_WEEK;
  const monthComplete = (m) => m.weeks.every(w => weekComplete(w));

  const month = PYTHON_MONTHS.find(m => m.id === selMonth);
  const nextMonth = PYTHON_MONTHS.find(m => m.id === selMonth + 1) || null;
  const mComplete = monthComplete(month);

  const totalTopics = month.weeks.reduce((a, w) => a + w.topics.length, 0);
  const doneTopic  = month.weeks.reduce((a, w) => a + getWeekDone(w), 0);
  const mPct = Math.round((doneTopic / totalTopics) * 100);

  return (
    <div className="fade-up" style={{ padding:"clamp(12px,4vw,28px)" }}>
      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <div className="syne" style={{ fontSize:"clamp(18px,4vw,26px)", fontWeight:800, color:T.t1, marginBottom:4 }}>
          🐍 Python Mastery Roadmap
        </div>
        <p style={{ fontSize:13, color:T.t2 }}>
          6 months · 24 weeks · Complete {MIN_PER_WEEK}+ topics per week · 100 interview questions per topic
        </p>
      </div>

      {/* Month selector */}
      <div className="srow" style={{ marginBottom:14 }}>
        {PYTHON_MONTHS.map(m => {
          const mc = monthComplete(m);
          return (
            <button key={m.id}
              onClick={() => { setSelMonth(m.id); setExpandedWeek(0); }}
              style={{
                flex:"0 0 auto", padding:"8px 16px", borderRadius:10, border:"1px solid",
                borderColor: mc ? T.green+"80" : selMonth === m.id ? m.color : T.border,
                background: mc ? T.green+"15" : selMonth === m.id ? m.color+"20" : T.card,
                color: mc ? T.green : selMonth === m.id ? m.color : T.t2,
                cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13,
                display:"flex", alignItems:"center", gap:7, transition:"all .2s",
                boxShadow: selMonth === m.id ? `0 0 14px ${mc?T.green:m.color}30` : "none"
              }}>
              <span>{mc ? "✅" : m.emoji}</span>
              <span>M{m.id}: {m.title.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Month header card */}
      <div className="card" style={{ padding:"16px 20px", marginBottom:14, borderColor: mComplete ? T.green+"60" : month.color+"40", boxShadow:`0 0 20px ${mComplete?T.green:month.color}14` }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <Ring pct={mPct} size={68} color={mComplete ? T.green : month.color} label={`${mPct}%`} />
          <div style={{ flex:1, minWidth:200 }}>
            <div className="syne" style={{ fontSize:18, fontWeight:800, color: mComplete ? T.green : T.t1, marginBottom:4 }}>
              {mComplete ? "✅ " : ""}{month.title}
            </div>
            <div style={{ fontSize:12, color:T.t2, marginBottom:10 }}>{month.sub}</div>
            {/* Week completion dots */}
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {month.weeks.map(w => {
                const d = getWeekDone(w);
                const wc = weekComplete(w);
                return (
                  <div key={w.n} style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:999,
                    background: wc ? T.green+"18" : "#07072a",
                    border:`1px solid ${wc ? T.green+"50" : T.border}`,
                    color: wc ? T.green : T.t2 }}>
                    {wc ? "✅" : `${d}/${w.topics.length}`} W{w.n}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ textAlign:"center", flexShrink:0 }}>
            <div style={{ fontSize:22, fontWeight:900, color: mComplete ? T.green : month.color }}>{doneTopic}/{totalTopics}</div>
            <div style={{ fontSize:11, color:T.t2 }}>topics done</div>
            <div style={{ fontSize:11, color:T.t2 }}>{month.weeks.length} weeks</div>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14, padding:"9px 14px", background:T.surf, borderRadius:9, border:`1px solid ${T.border}` }}>
        <span style={{ fontSize:12, color:T.t2 }}>📚 Click any week → Expand topics</span>
        <span style={{ fontSize:12, color:T.t2 }}>✅ Tick topics you've studied</span>
        <span style={{ fontSize:12, color:month.color }}>📚 100 Questions per topic (AI-generated)</span>
        <span style={{ fontSize:12, color:T.t2 }}>🔨 Projects &amp; GitHub repos per week</span>
      </div>

      {/* Week cards */}
      {month.weeks.map((w, i) => (
        <WeekCard
          key={w.n}
          week={w}
          monthColor={month.color}
          topicProgress={topicProgress}
          onToggle={toggle}
          expanded={expandedWeek === i}
          onExpand={setExpandedWeek}
          idx={i}
        />
      ))}

      {/* Month complete → next month preview */}
      {mComplete && (
        <NextMonthPanel
          currentM={month}
          nextM={nextMonth}
          onGo={() => nextMonth && (setSelMonth(nextMonth.id), setExpandedWeek(0))}
        />
      )}

      {/* Not complete hint */}
      {!mComplete && doneTopic > 0 && (
        <div style={{ marginTop:14, padding:"13px 16px", background:month.color+"0a", border:`1px solid ${month.color}28`, borderRadius:11, display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:20 }}>💡</span>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:month.color, marginBottom:3 }}>
              {month.weeks.filter(w => !weekComplete(w)).length} week(s) remaining in Month {month.id}
            </div>
            <p style={{ fontSize:12, color:T.t2, lineHeight:1.6 }}>
              Complete <strong style={{ color:T.t1 }}>{MIN_PER_WEEK} topics</strong> in each week.
              Weeks done: <strong style={{ color:T.green }}>{month.weeks.filter(w => weekComplete(w)).length}/{month.weeks.length}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────── ML PATH VIEW ─────────────────────────── */
const MLPathView = ({ allPythonDone }) => {
  const [selStage, setSelStage] = useState(0);

  const ML_STAGES = [
    {
      n: 1, emoji: "📐", title: "ML Foundations", color: "#3b82f6", duration: "4-6 weeks",
      desc: "The math and theory that powers every ML algorithm",
      topics: [
        "Linear algebra: vectors, matrices, dot products, eigenvalues",
        "Calculus: gradients, partial derivatives, chain rule for backprop",
        "Probability & statistics: Bayes theorem, distributions, MLE",
        "Scikit-learn: train/test split, pipelines, cross-validation",
        "Bias-variance tradeoff, overfitting, regularization (L1/L2)",
      ],
      resources: [
        { name:"fast.ai ML Course", url:"course.fast.ai", type:"Free Course", desc:"Best practical ML course — learn by coding first" },
        { name:"Scikit-learn Docs", url:"scikit-learn.org/stable/user_guide", type:"Documentation", desc:"Read the user guide — best ML reference" },
        { name:"StatQuest YouTube", url:"youtube.com/@statquest", type:"YouTube", desc:"Josh Starmer explains ML with incredible clarity" },
        { name:"ML from Scratch", url:"github.com/eriklindernoren/ML-From-Scratch", stars:"23k", type:"GitHub", desc:"Implement ML algorithms from scratch — essential practice" },
      ],
      project: { title:"Iris Classifier from Scratch", desc:"Implement KNN, Logistic Regression, and Decision Tree on Iris dataset without using sklearn's model classes. Compare accuracy." },
      interview: [
        "What is the bias-variance tradeoff? How do you diagnose underfitting vs overfitting?",
        "Explain gradient descent. Why mini-batch over full batch?",
        "When would you use L1 regularization over L2?",
        "What does cross-validation actually measure? Why is it better than a single split?",
      ],
    },
    {
      n: 2, emoji: "🌳", title: "Classical ML Algorithms", color: "#f97316", duration: "4-6 weeks",
      desc: "The algorithms that power most production ML today",
      topics: [
        "Linear and Logistic Regression — math + implementation",
        "Decision Trees, Random Forests, Gradient Boosting (XGBoost)",
        "SVM: hyperplane, kernel trick, C and gamma tuning",
        "Clustering: K-Means, DBSCAN, hierarchical clustering",
        "Feature engineering: encoding, scaling, selection, creation",
      ],
      resources: [
        { name:"Hands-On ML (Aurélien Géron)", url:"github.com/ageron/handson-ml3", stars:"27k", type:"Book + GitHub", desc:"Best ML book — read ch3-7, follow all notebooks" },
        { name:"XGBoost Docs + Examples", url:"xgboost.readthedocs.io/en/stable/tutorials", type:"Docs", desc:"XGBoost powers 60% of Kaggle competition wins" },
        { name:"Kaggle Learn — ML Intro", url:"kaggle.com/learn/intro-to-machine-learning", type:"Free Course", desc:"Kaggle's free ML intro — 6 micro-courses" },
        { name:"mlcourse.ai", url:"mlcourse.ai", type:"Free Course", desc:"Open ML course by ODS.ai — most rigorous free course" },
      ],
      project: { title:"Titanic Prediction Pipeline", desc:"Full ML pipeline: EDA → feature engineering → train 5 models → ensemble → submit to Kaggle. Document everything in a notebook." },
      interview: [
        "How does a Random Forest reduce variance compared to a single Decision Tree?",
        "Explain the kernel trick in SVM. When would you use RBF vs linear kernel?",
        "What is gradient boosting? How does XGBoost differ from vanilla GBM?",
        "How do you handle severe class imbalance in a classification problem?",
      ],
    },
    {
      n: 3, emoji: "🔥", title: "Neural Networks & PyTorch", color: "#a855f7", duration: "6-8 weeks",
      desc: "Deep learning fundamentals and modern frameworks",
      topics: [
        "Perceptron, MLP architecture, activation functions (ReLU, sigmoid, tanh)",
        "Backpropagation: chain rule, computational graphs, vanishing gradients",
        "PyTorch: tensors, autograd, custom Dataset, DataLoader",
        "CNNs: convolutions, pooling, feature maps — image classification",
        "Batch normalization, dropout, learning rate schedules, optimizers",
      ],
      resources: [
        { name:"fast.ai Deep Learning (Part 1)", url:"course.fast.ai", type:"Free Course", desc:"The best deep learning course for practitioners — free" },
        { name:"Andrej Karpathy YouTube", url:"youtube.com/@AndrejKarpathy", type:"YouTube", desc:"Neural Networks: Zero to Hero — build GPT from scratch" },
        { name:"PyTorch Tutorials", url:"pytorch.org/tutorials", type:"Official Docs", desc:"Start with 60 Minute Blitz, then go deeper" },
        { name:"d2l.ai", url:"d2l.ai", type:"Free Book", desc:"Dive into Deep Learning — interactive textbook with code" },
      ],
      project: { title:"MNIST CNN from Scratch", desc:"Build a CNN in PyTorch that achieves >99% on MNIST. Then transfer to CIFAR-10. Write a blog post explaining every layer." },
      interview: [
        "Walk me through backpropagation mathematically for a 2-layer network.",
        "Why does batch normalization help training? Where should you place it?",
        "What is the vanishing gradient problem? How do ResNets solve it?",
        "When would you use Adam vs SGD with momentum?",
      ],
    },
    {
      n: 4, emoji: "🤖", title: "NLP & Transformers", color: "#10b981", duration: "6-8 weeks",
      desc: "Language models, BERT, GPT and the attention mechanism",
      topics: [
        "Text preprocessing: tokenization, stemming, TF-IDF, word2vec",
        "Attention mechanism: query/key/value, self-attention, multi-head",
        "Transformer architecture from scratch (following 'Attention Is All You Need')",
        "BERT: pre-training objectives, fine-tuning with HuggingFace",
        "GPT: autoregressive generation, prompt engineering at the model level",
      ],
      resources: [
        { name:"HuggingFace NLP Course", url:"huggingface.co/learn/nlp-course", type:"Free Course", desc:"The definitive free NLP course — start here" },
        { name:"Annotated Transformer", url:"nlp.seas.harvard.edu/annotated-transformer", type:"Paper+Code", desc:"Attention Is All You Need — annotated and implemented" },
        { name:"Karpathy's makemore/nanoGPT", url:"github.com/karpathy/nanoGPT", stars:"36k", type:"GitHub", desc:"Build GPT from scratch — best learning exercise" },
        { name:"NLTK + spaCy", url:"github.com/explosion/spaCy", stars:"29k", type:"Libraries", desc:"spaCy for production NLP, NLTK for learning" },
      ],
      project: { title:"Fine-tune DistilBERT Classifier", desc:"Fine-tune DistilBERT on a sentiment/classification dataset of your choice. Achieve >90% accuracy. Deploy as a HuggingFace Space." },
      interview: [
        "Explain the attention mechanism. Why is self-attention O(n²)?",
        "What is the difference between BERT and GPT architecturally? When do you use each?",
        "How does tokenization work in modern LLMs? Why does 'tokenization' split into multiple tokens?",
        "What is RLHF and why does it matter for alignment?",
      ],
    },
    {
      n: 5, emoji: "🚀", title: "MLOps & Production", color: "#f59e0b", duration: "4-6 weeks",
      desc: "Deploy, monitor and maintain ML models in production",
      topics: [
        "Model serving with FastAPI, containerization with Docker",
        "MLflow for experiment tracking, model registry, versioning",
        "Data versioning with DVC, reproducible ML pipelines",
        "Monitoring: data drift, model drift, alerting strategies",
        "CI/CD for ML: GitHub Actions, automated testing, deployment gates",
      ],
      resources: [
        { name:"Full Stack Deep Learning", url:"fullstackdeeplearning.com", type:"Free Course", desc:"Best course on deploying ML in production" },
        { name:"Made With ML", url:"madewithml.com", type:"Free Course", desc:"MLOps fundamentals — comprehensive and free" },
        { name:"MLflow Docs", url:"mlflow.org/docs/latest/index.html", type:"Docs", desc:"Start here for experiment tracking and model registry" },
        { name:"Evidently AI", url:"github.com/evidentlyai/evidently", stars:"5.4k", type:"GitHub", desc:"ML model monitoring — detect drift in production" },
      ],
      project: { title:"End-to-End ML Pipeline", desc:"Train model → MLflow tracking → Docker container → FastAPI endpoint → CI/CD with GitHub Actions → production monitoring with Evidently." },
      interview: [
        "How do you detect model drift in production? What do you do when you detect it?",
        "Walk me through the ML deployment process from notebook to production.",
        "What is A/B testing for ML models? How do you measure success?",
        "Why is reproducibility important in ML? How do you achieve it?",
      ],
    },
    {
      n: 6, emoji: "🌌", title: "Specialization & Career", color: "#ef4444", duration: "Ongoing",
      desc: "Choose your path and land your first ML/AI role",
      topics: [
        "Choose specialization: Computer Vision, NLP, Reinforcement Learning, or Generative AI",
        "Read and implement papers from arXiv — build research intuition",
        "Contribute to open-source ML projects (HuggingFace, scikit-learn)",
        "Build a Kaggle competition portfolio — aim for top 10-20%",
        "Interview preparation: ML system design, coding, behavioral STAR",
      ],
      resources: [
        { name:"Papers With Code", url:"paperswithcode.com", type:"Research", desc:"Latest ML papers with code — read 1 paper per week" },
        { name:"arXiv CS.LG", url:"arxiv.org/list/cs.LG/recent", type:"Research", desc:"Latest ML research — subscribe to weekly digest" },
        { name:"Kaggle Competitions", url:"kaggle.com/competitions", type:"Practice", desc:"Compete and learn from other kernels — essential for ML careers" },
        { name:"ML Interview Prep", url:"github.com/khangich/machine-learning-interview", stars:"9.2k", type:"GitHub", desc:"ML interview questions from FAANG companies" },
      ],
      project: { title:"ML Portfolio + Job Applications", desc:"3 polished ML projects with live demos. 1 Kaggle competition top 20%. 1 open-source contribution. Start applying to ML Engineer / Data Scientist roles." },
      interview: [
        "Design a recommendation system for YouTube at scale (ML System Design).",
        "How would you build a fraud detection system? Walk me through end-to-end.",
        "What ML research paper has excited you most recently and why?",
        "Tell me about a time you improved a model's performance significantly.",
      ],
    },
  ];

  const stage = ML_STAGES[selStage];
  const LOCK = !allPythonDone;

  return (
    <div className="fade-up" style={{ padding:"clamp(12px,4vw,28px)" }}>
      <div className="syne" style={{ fontSize:"clamp(18px,4vw,26px)", fontWeight:800, color:T.t1, marginBottom:4 }}>
        🌌 ML Learning Path
      </div>
      <p style={{ fontSize:13, color:T.t2, marginBottom:20 }}>
        Your roadmap after Python mastery — from ML foundations to production AI systems
      </p>

      {/* Lock message */}
      {LOCK && (
        <div style={{ padding:"16px 20px", background:"#0a0a04", border:"1px solid #92400e80", borderRadius:12, marginBottom:18, display:"flex", gap:12, alignItems:"flex-start" }}>
          <span style={{ fontSize:24 }}>🔒</span>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:T.amber, marginBottom:4 }}>Complete Python Mastery first</div>
            <p style={{ fontSize:12, color:T.t2, lineHeight:1.6 }}>
              Finish all 6 months of the Python Roadmap (complete 3+ topics per week in all 24 weeks) to unlock the full ML Path. You can preview it here, but don't skip Python — it's your foundation.
            </p>
          </div>
        </div>
      )}

      {/* ML Journey path */}
      <div style={{ overflowX:"auto", marginBottom:18 }}>
        <div style={{ display:"flex", gap:0, alignItems:"center", minWidth:"max-content", padding:"4px 2px" }}>
          {ML_STAGES.map((s, i) => (
            <div key={s.n} style={{ display:"flex", alignItems:"center" }}>
              <div onClick={() => setSelStage(i)} style={{ textAlign:"center", cursor:"pointer", padding:"4px 0" }}>
                <div style={{
                  width:48, height:48, borderRadius:"50%", margin:"0 auto 6px",
                  background: selStage === i ? s.color+"30" : "#08082a",
                  border:`2px solid ${selStage === i ? s.color : T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
                  boxShadow: selStage === i ? `0 0 16px ${s.color}50` : "none",
                  transition:"all .2s"
                }}>{s.emoji}</div>
                <div style={{ fontSize:10, fontWeight:700, color: selStage === i ? s.color : T.t2, whiteSpace:"nowrap", maxWidth:64, textAlign:"center", lineHeight:1.3 }}>
                  {s.title.split(" ")[0]}
                </div>
                <div style={{ fontSize:9, color:T.t2, marginTop:2 }}>{s.duration}</div>
              </div>
              {i < ML_STAGES.length - 1 && (
                <div style={{ width:32, height:2, background:`linear-gradient(90deg,${s.color}40,${ML_STAGES[i+1].color}40)`, margin:"0 2px", flexShrink:0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stage detail */}
      <div className="card" style={{ padding:"18px 22px", marginBottom:14, borderColor:stage.color+"40", boxShadow:`0 0 20px ${stage.color}14` }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap" }}>
          <span style={{ fontSize:42 }} className="float">{stage.emoji}</span>
          <div style={{ flex:1 }}>
            <div className="syne" style={{ fontSize:20, fontWeight:800, color:T.t1, marginBottom:3 }}>
              Stage {stage.n}: {stage.title}
            </div>
            <p style={{ fontSize:13, color:T.t2, marginBottom:8 }}>{stage.desc}</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:12, color:stage.color, background:stage.color+"15", padding:"3px 10px", borderRadius:999, border:`1px solid ${stage.color}40`, fontWeight:600 }}>
                ⏱ {stage.duration}
              </span>
              <span style={{ fontSize:12, color:T.t2, background:T.surf, padding:"3px 10px", borderRadius:999, border:`1px solid ${T.border}` }}>
                {stage.topics.length} core topics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage tabs */}
      <div className="tab-row">
        {[{id:"topics",label:"📋 Topics"},{id:"resources",label:"📚 Resources"},{id:"project",label:"🏆 Project"},{id:"interview",label:"🎯 Interview Qs"}].map(t => {
          const [activeTab, setActiveTab] = useState("topics"); // eslint bug workaround — use parent state
          return null;
        })}
      </div>

      {/* Render all stage content directly (no tab state inside map) */}
      <MLStageContent stage={stage} LOCK={LOCK} />
    </div>
  );
};

/* Sub-component to avoid hooks-in-loop */
const MLStageContent = ({ stage, LOCK }) => {
  const [tab, setTab] = useState("topics");
  return (
    <>
      <div className="tab-row">
        {[{id:"topics",label:"📋 Topics"},{id:"resources",label:"📚 Resources"},{id:"project",label:"🏆 Project"},{id:"interview",label:"🎯 Interview Qs"}].map(t => (
          <button key={t.id} className={`tab-b ${tab===t.id?"on":""}`}
            style={tab===t.id?{color:stage.color,background:stage.color+"18"}:{}}
            onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === "topics" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {stage.topics.map((t, i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"11px 14px", background:T.surf, borderRadius:10, border:`1px solid ${T.border}` }}>
              <div style={{ width:24, height:24, borderRadius:6, background:stage.color+"20", border:`1px solid ${stage.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:stage.color, flexShrink:0 }}>{i+1}</div>
              <span style={{ fontSize:13, color:T.t1, lineHeight:1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "resources" && (
        <div className="g2" style={{ gap:10 }}>
          {stage.resources.map((r, i) => (
            <div key={i} className="repo-card" onClick={() => window.open(`https://${r.url}`, "_blank")}>
              <div style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
                <span style={{ fontSize:18 }}>
                  {r.type.includes("GitHub") ? "📦" : r.type.includes("Course") ? "🎓" : r.type.includes("YouTube") ? "▶️" : r.type.includes("Book") ? "📖" : "🔗"}
                </span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.blue, marginBottom:2 }}>{r.name}</div>
                  <span style={{ fontSize:10, color:stage.color, background:stage.color+"15", padding:"1px 7px", borderRadius:999, border:`1px solid ${stage.color}40`, fontWeight:600 }}>{r.type}</span>
                  {r.stars && <span className="mono" style={{ fontSize:10, color:T.t2, marginLeft:8 }}>⭐ {r.stars}</span>}
                </div>
                <span style={{ fontSize:11, color:T.blue }}>↗</span>
              </div>
              <p style={{ fontSize:12, color:T.t2, lineHeight:1.5 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "project" && (
        <div className="card card-gold" style={{ padding:"24px" }}>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <div style={{ fontSize:44 }} className="float">🏆</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.amber, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Stage {stage.n} Project</div>
              <div className="syne" style={{ fontSize:18, fontWeight:800, color:T.t1, marginBottom:10 }}>{stage.project.title}</div>
              <p style={{ fontSize:14, color:T.t2, lineHeight:1.7 }}>{stage.project.desc}</p>
              {LOCK && (
                <div style={{ marginTop:12, fontSize:12, color:T.amber, background:T.amber+"12", padding:"7px 12px", borderRadius:8, border:`1px solid ${T.amber}30` }}>
                  🔒 Complete Python Mastery to unlock this project
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "interview" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {stage.interview.map((q, i) => (
            <div key={i} className="q-row">
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span className="mono" style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:6, flexShrink:0, background:stage.color+"15", color:stage.color, border:`1px solid ${stage.color}40` }}>Q{i+1}</span>
                <p style={{ fontSize:14, color:T.t1, lineHeight:1.6 }}>{q}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop:8, padding:"13px 16px", background:stage.color+"0e", border:`1px solid ${stage.color}28`, borderRadius:11 }}>
            <div style={{ fontSize:11, fontWeight:700, color:stage.color, marginBottom:5 }}>💡 Interview Tips for {stage.title}</div>
            <p style={{ fontSize:13, color:T.t2, lineHeight:1.6 }}>
              Always explain your reasoning out loud. Link every answer to a project you've built. For ML questions, mention the dataset size, model chosen, and metric you optimized.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PROGRESS TRACKER VIEW
═══════════════════════════════════════════════════════════════════ */
const DAYS_OF_WEEK = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
function getWeekKey(offset=0){ const d=new Date(); d.setDate(d.getDate()-d.getDay()+1+offset*7); return d.toISOString().slice(0,10); }
function getDateKey(weekStart,dayIdx){ const d=new Date(weekStart); d.setDate(d.getDate()+dayIdx); return d.toISOString().slice(0,10); }
function todayKey(){ return new Date().toISOString().slice(0,10); }
function formatDate(key){ const d=new Date(key); return d.toLocaleDateString("en-IN",{day:"numeric",month:"short"}); }
const MOOD_EMOJIS = ["😴","😕","😐","😊","🔥"];

/* ═══════════════════════════════════════════════════════════════════
   PROGRESS TRACKER — Day 1 to Day 180 system
═══════════════════════════════════════════════════════════════════ */
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0,10);
}
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}
function fmtFull(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" });
}
function fmtShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day:"numeric", month:"short" });
}

// Map day number (1-180) to Python curriculum context
function getDayContext(dayNum) {
  if (dayNum < 1 || dayNum > 180) return null;
  const monthIdx = Math.floor((dayNum - 1) / 30);       // 0-5
  const dayInMonth = ((dayNum - 1) % 30) + 1;            // 1-30
  const weekIdx = Math.min(3, Math.floor((dayInMonth - 1) / 7)); // 0-3
  const dayInWeek = (dayInMonth - 1) % 7;                // 0-6
  const month = PYTHON_MONTHS[monthIdx];
  const week = month?.weeks[weekIdx];
  const isStudyDay = dayInWeek < 5;   // Mon-Fri = study, Sat-Sun = practice
  const topicIdx = isStudyDay ? dayInWeek : null;
  const topic = isStudyDay ? week?.topics[topicIdx] : null;
  return { monthIdx, weekIdx, dayInWeek, month, week, topic, isStudyDay };
}

const TrackerView = ({ topicProgress }) => {
  const [startDate, saveStartDate] = useStorage("py-start-v1", null);
  const [logs, saveLogs]           = useStorage("tracker-logs-v2", {});
  const [editDay, setEditDay]      = useState(null);
  const [form, setForm]            = useState({ hours:"2", topics:"", notes:"", git:false, mood:3 });
  const [view, setView]            = useState("calendar"); // calendar | stats | heatmap
  const [viewMonth, setViewMonth]  = useState(0); // which of the 6 months to view (0-5)

  const today = todayKey();
  const currentDayNum = startDate ? Math.min(180, Math.max(1, daysBetween(startDate, today) + 1)) : 0;

  const saveDay = () => {
    saveLogs(prev => ({ ...prev, [editDay]: { ...form } }));
    setEditDay(null);
  };
  const openEdit = (dateKey) => {
    setEditDay(dateKey);
    setForm(logs[dateKey] || { hours:"2", topics:"", notes:"", git:false, mood:3 });
  };

  // Computed stats
  const allLogs = Object.entries(logs);
  const totalHours = allLogs.reduce((a,[,l])=>a+parseFloat(l.hours||0), 0);
  const totalDays  = allLogs.filter(([,l])=>l.topics?.trim()).length;
  const gitDays    = allLogs.filter(([,l])=>l.git).length;
  const streak = (() => {
    let s=0, d=new Date();
    while(true){ const k=d.toISOString().slice(0,10); if(!logs[k])break; s++; d.setDate(d.getDate()-1); }
    return s;
  })();
  const longestStreak = (() => {
    if (!startDate) return 0;
    let max=0, cur=0;
    for (let i=0; i<180; i++) {
      const dk = addDays(startDate, i);
      if (logs[dk]?.topics?.trim()) { cur++; max=Math.max(max,cur); }
      else cur=0;
    }
    return max;
  })();
  const completionPct = startDate ? Math.round((totalDays / Math.min(currentDayNum, 180)) * 100) : 0;

  // ── Onboarding screen ──────────────────────────────────────────
  if (!startDate) {
    return (
      <div className="fade-up" style={{ padding:"clamp(14px,5vw,40px)", maxWidth:600, margin:"0 auto" }}>
        <div style={{ textAlign:"center", padding:"40px 0" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🚀</div>
          <div className="syne" style={{ fontSize:28, fontWeight:800, color:T.t1, marginBottom:8 }}>
            Start Your Python Journey
          </div>
          <p style={{ fontSize:15, color:T.t2, lineHeight:1.8, marginBottom:28, maxWidth:440, margin:"0 auto 28px" }}>
            This tracker will map <strong style={{color:T.t1}}>Day 1</strong> to today's date and count through
            <strong style={{color:T.blue}}> 180 days</strong> (6 months). Each day maps to a specific
            Python topic, week, and month in your curriculum.
          </p>
          <div style={{ background:T.card, border:`1px solid ${T.blue}40`, borderRadius:16, padding:"24px 28px", marginBottom:24, textAlign:"left" }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.blue, marginBottom:14 }}>📅 What you get:</div>
            {[
              "Day 1 = today. Day 180 = 6 months from now",
              "Every day maps to a specific Python topic",
              "Daily study log: hours, topics, mood, GitHub push",
              "Streak tracker and completion percentage",
              "Monthly progress calendar with topic context"
            ].map((t,i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:8, fontSize:13, color:T.t2 }}>
                <span style={{ color:T.green, flexShrink:0 }}>✓</span>{t}
              </div>
            ))}
          </div>
          <button className="btn btn-py" style={{ fontSize:15, padding:"12px 32px" }}
            onClick={() => saveStartDate(today)}>
            🚀 Begin My Python Journey — Day 1 Starts Today
          </button>
          <div style={{ marginTop:12, fontSize:12, color:T.t2 }}>
            Today: {fmtFull(today)}
          </div>
        </div>
      </div>
    );
  }

  // ── Main tracker layout ─────────────────────────────────────────
  const endDate = addDays(startDate, 179);
  const day1Month = new Date(startDate).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
  const day180Month = new Date(endDate).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});

  return (
    <div className="fade-up" style={{ padding:"clamp(12px,4vw,28px)" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:16 }}>
        <div>
          <div className="syne" style={{ fontSize:"clamp(18px,4vw,24px)", fontWeight:800, color:T.t1, marginBottom:2 }}>
            📅 Progress Tracker
          </div>
          <div style={{ fontSize:12, color:T.t2 }}>
            Day 1: {day1Month} → Day 180: {day180Month}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ background:T.card, border:`1px solid ${T.blue}40`, borderRadius:10, padding:"8px 14px", textAlign:"center" }}>
            <div className="syne" style={{ fontSize:22, fontWeight:800, color:T.blue, lineHeight:1 }}>{currentDayNum}</div>
            <div style={{ fontSize:10, color:T.t2 }}>Current Day</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ fontSize:11 }}
            onClick={() => { if(window.confirm("Reset tracker? All logs will be lost.")) { saveStartDate(null); saveLogs({}); } }}>
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="g4" style={{ marginBottom:14, gap:8 }}>
        {[
          { icon:"🔥", val:streak,   label:"Streak",       c:"#f97316" },
          { icon:"⏱",  val:`${totalHours.toFixed(0)}h`, label:"Total Hours", c:T.blue },
          { icon:"📅", val:totalDays,  label:"Days Studied",  c:T.green },
          { icon:"🏆", val:`${completionPct}%`, label:"On Track", c:"#a855f7" },
        ].map(s => (
          <div key={s.label} style={{ background:T.card, border:`1px solid ${s.c}30`, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
            <div style={{ fontSize:18 }}>{s.icon}</div>
            <div className="syne" style={{ fontSize:18, fontWeight:800, color:s.c, lineHeight:1.1 }}>{s.val}</div>
            <div style={{ fontSize:10, color:T.t2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Full 6-month progress bar */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"12px 16px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:12, color:T.t2 }}>Day {currentDayNum} of 180</span>
          <span style={{ fontSize:12, fontWeight:700, color:T.blue }}>{Math.round(currentDayNum/180*100)}% of journey</span>
        </div>
        <div className="pbar" style={{ height:10, marginBottom:8 }}>
          <div className="pfill xp-bar" style={{ width:`${Math.min(100,currentDayNum/180*100)}%`, height:"100%" }} />
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {PYTHON_MONTHS.map((m,i) => {
            const monthStart = i*30+1;
            const monthEnd = (i+1)*30;
            const monthDays = allLogs.filter(([dk])=>{ const n=daysBetween(startDate,dk)+1; return n>=monthStart&&n<=monthEnd&&logs[dk]?.topics?.trim(); }).length;
            const pct = Math.round(monthDays/30*100);
            return (
              <div key={m.id} style={{ flex:1, cursor:"pointer" }} onClick={()=>{setView("calendar");setViewMonth(i);}}>
                <div style={{ fontSize:9, color:T.t2, textAlign:"center", marginBottom:2 }}>{m.emoji}</div>
                <div className="pbar" style={{ height:6 }}>
                  <div style={{ height:"100%", borderRadius:999, width:`${pct}%`, background:m.color, transition:"width .5s" }}/>
                </div>
                <div style={{ fontSize:8, color:m.color, textAlign:"center", marginTop:1 }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View tabs */}
      <div className="tab-row" style={{ marginBottom:14 }}>
        {[{id:"calendar",l:"📆 Calendar"},{id:"heatmap",l:"🔥 Heatmap"},{id:"stats",l:"📊 Stats"}].map(t=>(
          <button key={t.id} className={`tab-b ${view===t.id?"on":""}`} onClick={()=>setView(t.id)}
            style={view===t.id?{color:T.blue,background:T.blue+"18"}:{}}>{t.l}</button>
        ))}
      </div>

      {/* ── CALENDAR VIEW ─────────────────────────────────────────── */}
      {view==="calendar" && (
        <div>
          {/* Month selector */}
          <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
            {PYTHON_MONTHS.map((m,i) => (
              <button key={i} onClick={()=>setViewMonth(i)} className="btn btn-sm"
                style={{
                  background: viewMonth===i ? m.color+"30" : "transparent",
                  border:`1px solid ${viewMonth===i ? m.color : T.border}`,
                  color: viewMonth===i ? m.color : T.t2,
                  fontFamily:"'DM Sans',sans-serif"
                }}>
                {m.emoji} M{m.id}: {m.title.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Month calendar */}
          {(() => {
            const m = PYTHON_MONTHS[viewMonth];
            const monthStart = viewMonth * 30;
            const days = Array.from({length:30}, (_,i) => {
              const dayNum = monthStart + i + 1;
              const dateKey = addDays(startDate, dayNum - 1);
              const ctx = getDayContext(dayNum);
              const log = logs[dateKey];
              const isToday = dateKey === today;
              const isPast = dateKey <= today;
              const isFuture = dateKey > today;
              const hasLog = log?.topics?.trim();
              return { dayNum, dateKey, ctx, log, isToday, isPast, isFuture, hasLog };
            });

            // Group into weeks
            const weeks = [days.slice(0,7), days.slice(7,14), days.slice(14,21), days.slice(21,28), days.slice(28,30)];

            return (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div>
                    <span style={{ fontSize:16, fontWeight:800, color:m.color }}>{m.emoji} Month {m.id}: {m.title}</span>
                    <span style={{ fontSize:12, color:T.t2, marginLeft:10 }}>Days {viewMonth*30+1}–{(viewMonth+1)*30}</span>
                  </div>
                  <span style={{ fontSize:12, color:T.t2 }}>
                    {fmtShort(addDays(startDate, viewMonth*30))} – {fmtShort(addDays(startDate, viewMonth*30+29))}
                  </span>
                </div>

                {/* Week header */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:4 }}>
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                    <div key={d} style={{ fontSize:10, fontWeight:700, color:T.t3, textAlign:"center", padding:"3px 0" }}>{d}</div>
                  ))}
                </div>

                {weeks.filter(w=>w.length>0).map((week, wi) => (
                  <div key={wi}>
                    <div style={{ fontSize:10, fontWeight:700, color:m.color, opacity:.7, marginBottom:3, marginTop:wi>0?6:0 }}>
                      Week {wi+1} · {m.weeks[wi]?.title || "Review"}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:3 }}>
                      {/* Fill empty slots if week 5 is only 2 days */}
                      {Array.from({length:7}, (_,di) => {
                        const day = week[di];
                        if (!day) return <div key={di}/>;
                        const { dayNum, dateKey, ctx, log, isToday, isPast, isFuture, hasLog } = day;
                        const bg = hasLog ? "#021508" : isToday ? "#070720" : isFuture ? T.bg : T.card;
                        const border = hasLog ? T.green+"50" : isToday ? T.blue+"80" : isFuture ? T.border+"40" : T.border;
                        return (
                          <div key={di}
                            onClick={() => isPast || isToday ? openEdit(dateKey) : null}
                            style={{
                              background: bg,
                              border:`1px solid ${border}`,
                              borderRadius:8,
                              padding:"6px 4px",
                              cursor: isPast||isToday ? "pointer":"default",
                              opacity: isFuture ? .35 : 1,
                              transition:"all .18s",
                              minHeight:64,
                              boxShadow: isToday ? `0 0 10px ${T.blue}30` : hasLog ? `0 0 6px ${T.green}20` : "none"
                            }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                              <span className="mono" style={{ fontSize:9, fontWeight:800, color:isToday?T.blue:T.t3 }}>D{dayNum}</span>
                              {hasLog && <span style={{ fontSize:11 }}>{MOOD_EMOJIS[parseInt(log.mood||3)-1]||"😊"}</span>}
                              {isToday && !hasLog && <span style={{ fontSize:9, color:T.blue, fontWeight:700 }}>TODAY</span>}
                            </div>
                            <div style={{ fontSize:9, color:T.t3, marginBottom:3 }}>{fmtShort(dateKey)}</div>
                            {ctx?.topic && (
                              <div style={{ fontSize:9, color:hasLog?T.green:T.t3, lineHeight:1.3, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                                {ctx.topic.split(":")[0]}
                              </div>
                            )}
                            {!ctx?.isStudyDay && (
                              <div style={{ fontSize:9, color:"#a855f7", opacity:.7 }}>🎯 Practice</div>
                            )}
                            {hasLog && (
                              <div style={{ fontSize:9, fontWeight:700, color:T.green, marginTop:2 }}>{log.hours}h ✓</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Month summary */}
                {(() => {
                  const mLogs = days.filter(d=>d.hasLog).length;
                  const mHours = days.reduce((a,d)=>a+parseFloat(d.log?.hours||0),0);
                  return (
                    <div style={{ marginTop:10, padding:"10px 14px", background:T.surf, border:`1px solid ${T.border}`, borderRadius:10, display:"flex", gap:16, flexWrap:"wrap" }}>
                      <span style={{ fontSize:12, color:T.t2 }}>📅 <strong style={{color:T.t1}}>{mLogs}/30</strong> days logged</span>
                      <span style={{ fontSize:12, color:T.t2 }}>⏱ <strong style={{color:T.t1}}>{mHours.toFixed(1)}h</strong> studied</span>
                      <span style={{ fontSize:12, color:T.t2 }}>📤 <strong style={{color:"#a855f7"}}>{days.filter(d=>d.log?.git).length}</strong> git pushes</span>
                    </div>
                  );
                })()}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── HEATMAP VIEW ──────────────────────────────────────────── */}
      {view==="heatmap" && (
        <div>
          <div style={{ fontSize:12, color:T.t2, marginBottom:12 }}>
            180-day activity map — each cell = 1 day · darker = more hours
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(30,1fr)", gap:2, marginBottom:10 }}>
            {Array.from({length:180}, (_,i) => {
              const dayNum = i+1;
              const dateKey = addDays(startDate, i);
              const h = parseFloat(logs[dateKey]?.hours||0);
              const intensity = h===0?0:h<1?1:h<2?2:h<3?3:4;
              const colors = ["#07071a","#0d2a18","#0d4a2a","#0d7040","#10b981"];
              const isToday = dateKey===today;
              return (
                <div key={i} onClick={()=>dateKey<=today&&openEdit(dateKey)}
                  title={`Day ${dayNum} · ${fmtShort(dateKey)} · ${h}h`}
                  style={{
                    paddingBottom:"100%", borderRadius:2, cursor:dateKey<=today?"pointer":"default",
                    background: colors[intensity], border:isToday?`1px solid ${T.blue}`:"none",
                    opacity: dateKey>today ? .2 : 1
                  }}/>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center", fontSize:11, color:T.t2, marginBottom:12 }}>
            Less {["#07071a","#0d2a18","#0d4a2a","#0d7040","#10b981"].map(c=><div key={c} style={{width:12,height:12,borderRadius:2,background:c,border:`1px solid ${T.border}`}}/>)} More
          </div>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {PYTHON_MONTHS.map((m,i) => {
              const st = i*30; const en = st+30;
              const hrs = Array.from({length:30},(_,j)=>parseFloat(logs[addDays(startDate,st+j)]?.hours||0)).reduce((a,b)=>a+b,0);
              const studied = Array.from({length:30},(_,j)=>logs[addDays(startDate,st+j)]?.topics?.trim()).filter(Boolean).length;
              return (
                <div key={i} style={{ flex:"1 1 100px", background:T.card, border:`1px solid ${m.color}30`, borderRadius:9, padding:"8px 10px" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:m.color }}>{m.emoji} M{m.id}</div>
                  <div style={{ fontSize:13, fontWeight:800, color:T.t1 }}>{hrs.toFixed(0)}h</div>
                  <div style={{ fontSize:10, color:T.t2 }}>{studied}/30 days</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STATS VIEW ─────────────────────────────────────────────── */}
      {view==="stats" && (
        <div className="g2" style={{ gap:12 }}>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.t1, marginBottom:14 }}>📊 Weekly Hours</div>
            {Array.from({length:8}, (_,i) => {
              const weekStart = addDays(today, -(7-i)*7);
              const hrs = Array.from({length:7},(_,j)=>parseFloat(logs[addDays(weekStart,j)]?.hours||0)).reduce((a,b)=>a+b,0);
              return (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:7 }}>
                  <div style={{ fontSize:10, color:T.t2, width:46, flexShrink:0 }}>{fmtShort(weekStart)}</div>
                  <div style={{ flex:1, height:12, background:"#06062a", borderRadius:999, overflow:"hidden" }}>
                    <div style={{ width:`${Math.min(100,(hrs/40)*100)}%`, height:"100%", background:`linear-gradient(90deg,${T.blue},${T.green})`, borderRadius:999, transition:"width .7s" }}/>
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:T.blue, width:32, textAlign:"right" }}>{hrs.toFixed(1)}h</div>
                </div>
              );
            })}
            <div style={{ marginTop:12, padding:"9px 12px", background:T.surf, borderRadius:8, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:11, color:T.t2, marginBottom:4 }}>🏆 Records</div>
              <div style={{ display:"flex", gap:16, flexWrap:"wrap", fontSize:12 }}>
                <span style={{ color:T.t1 }}>Longest streak: <strong style={{color:"#f97316"}}>{longestStreak}d</strong></span>
                <span style={{ color:T.t1 }}>Git pushes: <strong style={{color:"#a855f7"}}>{gitDays}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.t1, marginBottom:14 }}>📝 Recent Sessions</div>
            <div style={{ maxHeight:320, overflowY:"auto", display:"flex", flexDirection:"column", gap:6 }}>
              {Object.entries(logs).sort(([a],[b])=>b.localeCompare(a)).slice(0,15).map(([dk,log]) => {
                const dayNum = startDate ? daysBetween(startDate, dk) + 1 : "?";
                return (
                  <div key={dk} style={{ padding:"8px 11px", background:T.surf, borderRadius:8, border:`1px solid ${T.border}`, cursor:"pointer" }}
                    onClick={()=>openEdit(dk)}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                      <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                        <span className="mono" style={{ fontSize:10, color:T.blue, fontWeight:700 }}>D{dayNum}</span>
                        <span style={{ fontSize:11, color:T.t1, fontWeight:600 }}>{fmtShort(dk)}</span>
                      </div>
                      <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                        <span style={{ fontSize:13 }}>{MOOD_EMOJIS[parseInt(log.mood||3)-1]||"😊"}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:T.green }}>{log.hours}h</span>
                        {log.git && <span style={{ fontSize:10, color:"#a855f7" }}>📤</span>}
                      </div>
                    </div>
                    {log.topics && <div style={{ fontSize:11, color:T.t2, lineHeight:1.4 }}>{log.topics}</div>}
                  </div>
                );
              })}
              {Object.keys(logs).length===0 && <div style={{ textAlign:"center", padding:20, color:T.t3, fontSize:13 }}>No sessions logged yet. Click any day in the calendar!</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── LOG MODAL ─────────────────────────────────────────────── */}
      {editDay && (
        <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
          onClick={e=>{ if(e.target===e.currentTarget)setEditDay(null); }}>
          <div style={{ background:"#08082a", border:`1px solid ${T.blue}60`, borderRadius:16, padding:24, width:"min(100%,460px)", maxHeight:"90vh", overflowY:"auto", boxShadow:`0 0 40px ${T.blue}20` }}>
            {(() => {
              const dayNum = startDate ? daysBetween(startDate, editDay)+1 : "?";
              const ctx = startDate ? getDayContext(dayNum) : null;
              return (
                <>
                  <div className="syne" style={{ fontSize:17, fontWeight:800, color:T.t1, marginBottom:2 }}>
                    Log Session — Day {dayNum}
                  </div>
                  <div style={{ fontSize:12, color:T.t2, marginBottom:4 }}>{fmtFull(editDay)}</div>
                  {ctx?.topic && (
                    <div style={{ fontSize:11, color:T.blue, background:T.blue+"12", padding:"4px 10px", borderRadius:7, marginBottom:14, border:`1px solid ${T.blue}30` }}>
                      📚 Today's topic: {ctx.topic.split(":")[0]}
                    </div>
                  )}
                </>
              );
            })()}

            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:6 }}>⏱ Hours Studied</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {["0.5","1","1.5","2","3","4","5","6+"].map(h => (
                  <button key={h} onClick={()=>setForm(f=>({...f,hours:h}))} className="btn btn-sm"
                    style={{ background:form.hours===h?T.blue+"40":T.surf, border:`1px solid ${form.hours===h?T.blue:T.border}`, color:form.hours===h?T.blue:T.t2, fontFamily:"'DM Sans',sans-serif" }}>
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:6 }}>😊 Energy / Mood</div>
              <div style={{ display:"flex", gap:8 }}>
                {[1,2,3,4,5].map(m => (
                  <button key={m} onClick={()=>setForm(f=>({...f,mood:m}))}
                    style={{ fontSize:24, background:"none", border:`2px solid ${form.mood===m?T.amber:"transparent"}`, borderRadius:8, cursor:"pointer", padding:4 }}>
                    {MOOD_EMOJIS[m-1]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:6 }}>📚 What did you study?</div>
              <textarea className="inp" rows={2} placeholder="Topics covered, chapters read, exercises done..."
                value={form.topics} onChange={e=>setForm(f=>({...f,topics:e.target.value}))} />
            </div>

            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:6 }}>📝 Notes / Blockers</div>
              <textarea className="inp" rows={2} placeholder="What was challenging? What clicked? What to revisit?"
                value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
            </div>

            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:18 }}>
              <div onClick={()=>setForm(f=>({...f,git:!f.git}))}
                style={{ width:36, height:20, borderRadius:999, background:form.git?"#a855f7":"#1a1a48", cursor:"pointer", position:"relative", transition:"background .2s" }}>
                <div style={{ width:16, height:16, borderRadius:999, background:"#fff", position:"absolute", top:2, left:form.git?18:2, transition:"left .2s" }}/>
              </div>
              <span style={{ fontSize:13, color:form.git?"#a855f7":T.t2, fontWeight:600 }}>📤 Pushed to GitHub today</span>
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <button className="btn btn-py" style={{ flex:1 }} onClick={saveDay}>💾 Save Session</button>
              <button className="btn btn-ghost" onClick={()=>setEditDay(null)}>Cancel</button>
              {logs[editDay] && <button className="btn" style={{ background:"#1a0404", border:"1px solid #7f1d1d", color:"#fca5a5" }}
                onClick={()=>{ saveLogs(p=>{const n={...p};delete n[editDay];return n;}); setEditDay(null); }}>Delete</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   PROJECT IDEAS VIEW
═══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════
   SEED DATA — 30 starter projects (always available instantly)
═══════════════════════════════════════════════════════════════════ */
const SEED_PROJECTS = [
  { id:"p1",  month:1, diff:"Easy",     tags:["CLI"],       title:"Personal Finance Tracker",    desc:"Log income/expenses by category. Monthly summary with % breakdown. Stored in JSON. Pure Python.",   skills:["functions","dicts","json","file I/O"],         time:"1-2 days" },
  { id:"p2",  month:1, diff:"Easy",     tags:["Game"],      title:"Hangman Game",                desc:"Word game with categories. ASCII gallows art. Track wins/losses in JSON.",                          skills:["strings","loops","random"],                   time:"1 day"    },
  { id:"p3",  month:1, diff:"Medium",   tags:["Report"],    title:"Student Report Card",         desc:"CRUD students + 5 subject marks. GPA, rank, formatted card, export CSV.",                          skills:["OOP","sorting","file I/O"],                   time:"2-3 days" },
  { id:"p4",  month:1, diff:"Medium",   tags:["Game"],      title:"Quiz App with Timer",         desc:"Load JSON questions. 30s timer per question. Score + explanation. Leaderboard file.",              skills:["json","time","dicts"],                        time:"2 days"   },
  { id:"p5",  month:1, diff:"Hard",     tags:["Tracker"],   title:"Habit Tracker CLI",           desc:"Track daily habits. Streak counter. Terminal heatmap with # chars. JSON persistence.",             skills:["datetime","json","f-strings"],                time:"3-4 days" },
  { id:"p6",  month:2, diff:"Easy",     tags:["Data"],      title:"Library Book Manager",        desc:"CRUD books. Borrow/return + due dates. Late fee calculator. Dicts & lists only.",                  skills:["dicts","lists","datetime"],                  time:"2 days"   },
  { id:"p7",  month:2, diff:"Medium",   tags:["Algorithm"], title:"Text Compression Tool",       desc:"Run-Length Encoding + Huffman coding. Compare ratios on real files. Show bytes saved.",            skills:["algorithms","heapq","Counter"],               time:"3-4 days" },
  { id:"p8",  month:2, diff:"Medium",   tags:["Game"],      title:"Sudoku Solver",               desc:"Backtracking solver for any 9×9 grid. Step counter. Random puzzle generator.",                     skills:["2D lists","recursion","backtracking"],        time:"3 days"   },
  { id:"p9",  month:2, diff:"Hard",     tags:["Cache"],     title:"In-Memory Cache with TTL",    desc:"LRU cache + TTL expiry. Thread-safe. Stats: hit rate, miss rate, evictions.",                      skills:["OrderedDict","threading","time"],             time:"4-5 days" },
  { id:"p10", month:2, diff:"Hard",     tags:["Algorithm"], title:"Pathfinding Visualizer",      desc:"A*, Dijkstra, BFS, DFS on a grid. Terminal animation of exploration + final path.",                skills:["graphs","heapq","curses"],                    time:"5 days"   },
  { id:"p11", month:3, diff:"Easy",     tags:["OOP"],       title:"Inventory Management OOP",    desc:"Products, categories, stock alerts. Full OOP with inheritance + decorator logging.",               skills:["OOP","ABC","decorators"],                     time:"2-3 days" },
  { id:"p12", month:3, diff:"Medium",   tags:["Patterns"],  title:"Event System Framework",      desc:"Observer pattern. Subscribers, events, async dispatch. Mini event bus.",                           skills:["decorators","OOP","asyncio"],                 time:"3-4 days" },
  { id:"p13", month:3, diff:"Hard",     tags:["Async"],     title:"Async Task Runner",           desc:"asyncio job runner. Parallel exec, rate limiting, exponential backoff, progress bar.",             skills:["asyncio","decorators","logging"],              time:"5-6 days" },
  { id:"p14", month:3, diff:"Hard",     tags:["Generator"], title:"Streaming Data Pipeline",     desc:"Generator-based ETL. Source→Transform→Sink. Backpressure + memory-efficient chunking.",           skills:["generators","async","contextlib"],            time:"6-7 days" },
  { id:"p15", month:3, diff:"Medium",   tags:["Testing"],   title:"Test Framework Lite",         desc:"Build your own pytest-mini. Discover tests, run, collect results, colored terminal report.",       skills:["OOP","decorators","importlib"],               time:"4 days"   },
  { id:"p16", month:4, diff:"Easy",     tags:["API"],       title:"GitHub Dashboard CLI",        desc:"GitHub API: repos, stars, issues, contributors. Rich-formatted output. SQLite cache.",             skills:["requests","json","sqlite3","argparse"],       time:"2-3 days" },
  { id:"p17", month:4, diff:"Medium",   tags:["FastAPI"],   title:"URL Shortener Service",       desc:"FastAPI: POST URL → short code. Click analytics. Rate limiting. SQLite + Swagger docs.",           skills:["FastAPI","SQLite","pydantic"],                time:"3-4 days" },
  { id:"p18", month:4, diff:"Medium",   tags:["Scraping"],  title:"Job Board Aggregator",        desc:"Scrape 3 sites. Deduplicate. Filter by skill/location. SQLite storage + daily digest.",           skills:["BeautifulSoup","requests","sqlite3"],         time:"5 days"   },
  { id:"p19", month:4, diff:"Hard",     tags:["Auth"],      title:"REST Blog API + JWT Auth",    desc:"Full JWT register/login/refresh. Posts, comments, tags. Pagination. 100% test coverage.",         skills:["FastAPI","SQLAlchemy","JWT","pytest"],        time:"8-10 days"},
  { id:"p20", month:4, diff:"Hard",     tags:["Automation"],"title":"Dev Setup Automation Suite",desc:"CLI: create project, init git, venv, install deps, pre-commit hooks, push to GitHub API.",        skills:["subprocess","pathlib","requests","click"],    time:"5-7 days" },
  { id:"p21", month:5, diff:"Easy",     tags:["Pandas"],    title:"IPL Cricket Analysis",        desc:"Analyze IPL dataset: top batsmen, bowling economy, team win rates, toss impact. 8 charts.",       skills:["pandas","matplotlib","seaborn"],              time:"2-3 days" },
  { id:"p22", month:5, diff:"Medium",   tags:["Plotly"],    title:"Real Estate Dashboard",       desc:"Interactive Plotly: price by area, yearly trends, filters. Export standalone HTML.",              skills:["plotly","pandas","numpy"],                    time:"3-4 days" },
  { id:"p23", month:5, diff:"Medium",   tags:["Finance"],   title:"Stock Portfolio Analyzer",    desc:"yfinance: portfolio returns, Sharpe ratio, correlation matrix, MPT optimal allocation.",          skills:["numpy","pandas","matplotlib","scipy"],        time:"4-5 days" },
  { id:"p24", month:5, diff:"Hard",     tags:["ML Intro"],  title:"House Price Predictor",       desc:"Full ML pipeline: EDA → feature eng → 5 models → ensemble → SHAP → Streamlit app.",             skills:["scikit-learn","pandas","streamlit"],          time:"8-10 days"},
  { id:"p25", month:5, diff:"Hard",     tags:["Report"],    title:"Auto EDA Report Generator",   desc:"Input any CSV → auto HTML report: distributions, correlations, outliers, missing data.",          skills:["pandas","plotly","jinja2"],                   time:"5-6 days" },
  { id:"p26", month:6, diff:"Medium",   tags:["Benchmark"], title:"Algorithm Benchmark Suite",   desc:"Compare 10 sort/search algorithms. Terminal table with timing + Big-O complexity.",              skills:["algorithms","timeit","rich"],                 time:"3-4 days" },
  { id:"p27", month:6, diff:"Medium",   tags:["Portfolio"], title:"README Generator CLI",        desc:"Answer questions → auto-generate a beautiful GitHub profile README with badges.",                 skills:["requests","jinja2","click"],                  time:"2-3 days" },
  { id:"p28", month:6, diff:"Hard",     tags:["Capstone"],  title:"AI-Powered Task Manager",     desc:"FastAPI + rich CLI. NLP-powered task categorization. Priority inference. Smart scheduling.",      skills:["FastAPI","NLP","SQLAlchemy","Click"],         time:"10-14 days"},
  { id:"p29", month:6, diff:"Hard",     tags:["Open Source"],"title":"Open Source Contribution", desc:"Find Python repo with good-first-issue. Fix bug or add feature. Write tests. Get PR merged.",    skills:["git","testing","documentation"],              time:"1-2 weeks"},
  { id:"p30", month:6, diff:"Very Hard",tags:["Capstone"],  title:"Build Your Own CLI Framework", desc:"Click/Typer-like from scratch: plugin system, auto-help, arg parsing, colored output, tests.",   skills:["OOP","AST","decorators","testing"],           time:"2-3 weeks"},
];

/* ═══════════════════════════════════════════════════════════════════
   SEED DATA — 36 starter practice questions
═══════════════════════════════════════════════════════════════════ */
const SEED_QUESTIONS = [
  { id:"q1",  cat:"Python Basics",   diff:"Easy",     co:"Google",    time:5,  xp:15,  q:"Write a function that takes a list of numbers and returns the second largest element without sorting." },
  { id:"q2",  cat:"Python Basics",   diff:"Easy",     co:"Meta",      time:5,  xp:15,  q:"Write a function that checks if a string is a palindrome, ignoring spaces, punctuation and case." },
  { id:"q3",  cat:"Python Basics",   diff:"Medium",   co:"Amazon",    time:10, xp:30,  q:"Implement a function that flattens a nested list of arbitrary depth: [[1,[2,3]],[[4],5]] → [1,2,3,4,5]." },
  { id:"q4",  cat:"Python Basics",   diff:"Medium",   co:"Microsoft", time:10, xp:30,  q:"Write a decorator @retry(n, delay) that retries a function n times with delay seconds between attempts on exception." },
  { id:"q5",  cat:"Python Basics",   diff:"Hard",     co:"Anthropic", time:20, xp:60,  q:"Implement a @memoize decorator that handles positional and keyword arguments, including unhashable types gracefully." },
  { id:"q6",  cat:"Python Basics",   diff:"Easy",     co:"OpenAI",    time:5,  xp:15,  q:"Given a dictionary, write a function to invert it, handling duplicate values by collecting them in a list." },
  { id:"q7",  cat:"Python Basics",   diff:"Medium",   co:"Apple",     time:12, xp:30,  q:"Write a context manager class that measures execution time and raises TimeoutError if it exceeds a given threshold." },
  { id:"q8",  cat:"Python Basics",   diff:"Hard",     co:"Google",    time:25, xp:60,  q:"Implement a thread-safe Singleton in Python — show metaclass approach and module-level instance, compare tradeoffs." },
  { id:"q9",  cat:"Data Structures", diff:"Easy",     co:"Amazon",    time:8,  xp:15,  q:"Implement a stack using two queues. Support push(), pop(), and peek(). Analyze time complexity of each." },
  { id:"q10", cat:"Data Structures", diff:"Easy",     co:"Meta",      time:8,  xp:15,  q:"Given a list of intervals sorted by start, merge all overlapping ones. [[1,3],[2,6],[8,10]] → [[1,6],[8,10]]." },
  { id:"q11", cat:"Data Structures", diff:"Medium",   co:"Google",    time:15, xp:30,  q:"Implement a MinStack supporting push(), pop(), top(), and getMin() — all in O(1) time and O(n) space." },
  { id:"q12", cat:"Data Structures", diff:"Medium",   co:"Microsoft", time:12, xp:30,  q:"Given a string of brackets, determine if valid. Handle '()', '[]', '{}'. Return True/False." },
  { id:"q13", cat:"Data Structures", diff:"Hard",     co:"Anthropic", time:30, xp:60,  q:"Design a data structure supporting insert(val), remove(val), getRandom() — all O(1) average." },
  { id:"q14", cat:"Data Structures", diff:"Hard",     co:"OpenAI",    time:30, xp:60,  q:"Implement a Trie with insert, search, startsWith. Then add delete() and countWordsWithPrefix()." },
  { id:"q15", cat:"Data Structures", diff:"Medium",   co:"Netflix",   time:15, xp:30,  q:"Find the K most frequent elements in a list in O(n log k) using a min-heap. Return in order." },
  { id:"q16", cat:"Data Structures", diff:"Easy",     co:"Spotify",   time:8,  xp:15,  q:"Reverse a singly linked list both iteratively and recursively. Compare time and space complexity." },
  { id:"q17", cat:"Algorithms",      diff:"Easy",     co:"Google",    time:8,  xp:15,  q:"Binary search: find the left-most index to insert a target in a sorted array to keep it sorted." },
  { id:"q18", cat:"Algorithms",      diff:"Medium",   co:"Amazon",    time:15, xp:30,  q:"Given a sorted array rotated at an unknown pivot, find a target element in O(log n) time." },
  { id:"q19", cat:"Algorithms",      diff:"Medium",   co:"Meta",      time:20, xp:30,  q:"Implement merge sort. Then modify it to count inversions in an array (pairs where arr[i] > arr[j], i < j)." },
  { id:"q20", cat:"Algorithms",      diff:"Hard",     co:"Microsoft", time:35, xp:60,  q:"Find the median of two sorted arrays in O(log(m+n)). Explain why O(m+n) isn't acceptable at scale." },
  { id:"q21", cat:"Algorithms",      diff:"Easy",     co:"Airbnb",    time:8,  xp:15,  q:"Two Sum: find two numbers adding to target. Return indices. Solve in O(n) using hash map." },
  { id:"q22", cat:"Algorithms",      diff:"Medium",   co:"Stripe",    time:20, xp:30,  q:"Find the length of longest substring without repeating characters. Sliding window O(n)." },
  { id:"q23", cat:"Algorithms",      diff:"Hard",     co:"Google",    time:35, xp:60,  q:"Given n integers representing an elevation map (width=1), compute how much rainwater can be trapped." },
  { id:"q24", cat:"Algorithms",      diff:"Very Hard",co:"Anthropic", time:45, xp:100, q:"Design and implement a rate limiter with sliding window. Handle concurrent requests safely with minimal overhead." },
  { id:"q25", cat:"OOP & Design",    diff:"Easy",     co:"Amazon",    time:10, xp:15,  q:"Design a parking lot system: ParkingLot, Floor, Spot, Vehicle classes. Handle motorcycles, cars, buses differently." },
  { id:"q26", cat:"OOP & Design",    diff:"Medium",   co:"Uber",      time:20, xp:30,  q:"Implement the Observer pattern: EventEmitter with on(event,cb), emit(event,data), off(), once()." },
  { id:"q27", cat:"OOP & Design",    diff:"Hard",     co:"Google",    time:40, xp:60,  q:"Design a thread-safe connection pool: acquire(), release(), min/max size, timeout, graceful shutdown." },
  { id:"q28", cat:"OOP & Design",    diff:"Hard",     co:"Microsoft", time:35, xp:60,  q:"Implement command pattern with undo/redo. Apply to a text editor with insert, delete, replace, bold, italic." },
  { id:"q29", cat:"Python Advanced", diff:"Medium",   co:"OpenAI",    time:15, xp:30,  q:"Write a generator yielding all permutations of a list without itertools. Handle duplicates correctly." },
  { id:"q30", cat:"Python Advanced", diff:"Medium",   co:"Anthropic", time:20, xp:30,  q:"Implement an async web crawler using asyncio + aiohttp. Queue-based. Rate limiting. Retry on 429." },
  { id:"q31", cat:"Python Advanced", diff:"Hard",     co:"Meta",      time:40, xp:60,  q:"Write a metaclass that wraps every public method with logging: name, args, return value, execution time." },
  { id:"q32", cat:"Python Advanced", diff:"Very Hard",co:"Anthropic", time:50, xp:100, q:"Design a Python import hook intercepting module imports and applying type checking to function calls via __annotations__." },
  { id:"q33", cat:"APIs & Data",     diff:"Easy",     co:"Stripe",    time:10, xp:15,  q:"Write a function making an API call with exponential backoff retry (max 5, starting 1s, jitter)." },
  { id:"q34", cat:"APIs & Data",     diff:"Medium",   co:"Airbnb",    time:20, xp:30,  q:"Design a caching layer for an HTTP client. Cache GETs with TTL. Invalidate on POST/PUT/DELETE to same path." },
  { id:"q35", cat:"APIs & Data",     diff:"Medium",   co:"Uber",      time:25, xp:30,  q:"Read a >1GB CSV in chunks with pandas and process each chunk in parallel with ProcessPoolExecutor." },
  { id:"q36", cat:"APIs & Data",     diff:"Hard",     co:"Amazon",    time:40, xp:60,  q:"Implement an async job queue: FastAPI endpoint to submit, workers to process, status polling, dead letter queue." },
];

/* ═══════════════════════════════════════════════════════════════════
   AI BATCH GENERATORS — produce 15 items per call
═══════════════════════════════════════════════════════════════════ */
const COMPANIES = ["Google","Meta","Amazon","Microsoft","OpenAI","Anthropic","Apple","Netflix","Stripe","Airbnb","Uber","Spotify","Atlassian","Figma","Notion"];
const PROJ_CATS = ["CLI Tool","Web Scraper","API Integration","Data Analysis","Automation","Game","OOP Design","Algorithm Visualizer","FastAPI Service","Testing Framework","Async System","Database Tool","File Processor","Monitoring Tool","Portfolio App"];

async function batchGenProjects(month, existingCount) {
  const monthData = PYTHON_MONTHS.find(m => m.id === month);
  const diffs = ["Easy","Easy","Medium","Medium","Hard","Very Hard"];
  const types = PROJ_CATS.slice(0, 8);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:4000,
      messages:[{role:"user", content:`Generate 15 unique Python project ideas for Month ${month}: "${monthData?.title}" (${monthData?.sub}).
Month skills: ${monthData?.weeks.map(w=>w.title).join(", ")}

Make them all DIFFERENT types: CLI tools, web scrapers, API integrations, data tools, games, automation, etc.
Mix difficulties: include Easy, Medium, Hard, Very Hard projects.

Return ONLY valid JSON array (no markdown fences, no extra text):
[
  {"title":"...","desc":"2-3 sentence description of what to build and what makes it interesting","diff":"Easy|Medium|Hard|Very Hard","tags":["tag1","tag2"],"skills":["skill1","skill2","skill3"],"time":"X-Y days","repo":"github.com/..."}
]
Generate exactly 15 projects. Make each genuinely useful and distinct.`}]
    })
  });
  const data = await res.json();
  const text = data.content.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim();
  const arr = JSON.parse(text);
  return arr.map((p, i) => ({
    ...p,
    id: `gen-p-m${month}-${existingCount+i}-${Date.now()}`,
    month,
    generated: true
  }));
}

async function batchGenQuestions(category, existingCount) {
  const diffs = ["Easy","Easy","Easy","Medium","Medium","Medium","Medium","Hard","Hard","Hard","Hard","Very Hard","Very Hard","Medium","Hard"];
  const cos = COMPANIES.slice(0, 15).map((_,i)=>COMPANIES[i % COMPANIES.length]);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:4000,
      messages:[{role:"user", content:`Generate 15 unique Python interview questions for category: "${category}".

These are REAL interview questions asked at top tech companies (Google, Meta, Amazon, Anthropic, Microsoft, OpenAI, etc.)
Mix Easy (3), Medium (6), Hard (5), Very Hard (1) difficulties.
Make each question genuinely distinct and challenging.

Return ONLY a valid JSON array (no markdown, no extra text):
[
  {"q":"full question text — be specific and technical","diff":"Easy|Medium|Hard|Very Hard","co":"CompanyName","time":10,"xp":30,"hint":"small hint without revealing solution","approach":"optimal approach in 1-2 sentences","code":"# clean Python solution\\ndef solution():\\n    pass"}
]

XP values: Easy=15, Medium=30, Hard=60, Very Hard=100
Time values (minutes): Easy=5-10, Medium=10-20, Hard=25-40, Very Hard=45-60
Generate exactly 15 questions. Make each genuinely challenging and interview-realistic.`}]
    })
  });
  const data = await res.json();
  const text = data.content.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim();
  const arr = JSON.parse(text);
  return arr.map((q, i) => ({
    ...q,
    id: `gen-q-${category.replace(/\s+/g,"-")}-${existingCount+i}-${Date.now()}`,
    cat: category,
    generated: true
  }));
}

/* ═══════════════════════════════════════════════════════════════════
   PROJECTS VIEW — 100 projects with real-time generation
═══════════════════════════════════════════════════════════════════ */
const ProjectsView = () => {
  const [filterMonth, setFilterMonth] = useState(0);
  const [filterDiff,  setFilterDiff]  = useState("All");
  const [done, saveDone]                   = useStorage("proj-done-v1",  {});
  const [genProjects, saveGenProjects]     = useStorage("gen-projects-v2", []);
  const [expandedId, setExpandedId]        = useState(null);
  const [genLog, setGenLog]                = useState([]);
  const [generating, setGenerating]        = useState(false);
  const [genTarget, setGenTarget]          = useState(null); // {month, label}
  // Single AI idea generator
  const [aiMonth, setAiMonth]   = useState(1);
  const [aiSkill, setAiSkill]   = useState("");
  const [aiDiff, setAiDiff]     = useState("Medium");
  const [aiResult, setAiResult] = useState(null);
  const [aiLoad, setAiLoad]     = useState(false);

  const allProjects = [...SEED_PROJECTS, ...(genProjects || [])];
  const DIFF_C = {Easy:T.green, Medium:T.amber, Hard:"#f87171", "Very Hard":"#c084fc"};

  const filtered = allProjects.filter(p =>
    (filterMonth === 0 || p.month === filterMonth) &&
    (filterDiff === "All" || p.diff === filterDiff)
  );

  const projectsPerMonth = (mid) => allProjects.filter(p => p.month === mid).length;

  // Generate until a month has 16+ projects (seed has 5 per month)
  const generateForMonth = async (monthId) => {
    const existing = allProjects.filter(p => p.month === monthId);
    if (existing.length >= 16) return;
    setGenerating(true);
    setGenTarget({ month: monthId, label: PYTHON_MONTHS.find(m=>m.id===monthId)?.title });
    setGenLog([`⚡ Generating 15 projects for Month ${monthId}...`]);
    try {
      const newProjs = await batchGenProjects(monthId, existing.length);
      setGenLog(l => [...l, `✅ Generated ${newProjs.length} projects!`]);
      await saveGenProjects(prev => [...(prev||[]), ...newProjs]);
    } catch(e) {
      setGenLog(l => [...l, `❌ Error: ${e.message}. Try again.`]);
    }
    setGenerating(false);
    setGenTarget(null);
  };

  // Generate ALL months to reach ~100 projects
  const generateAll = async () => {
    setGenerating(true);
    setGenLog(["🚀 Generating projects for all 6 months..."]);
    for (const m of PYTHON_MONTHS) {
      const existing = allProjects.filter(p => p.month === m.id);
      if (existing.length >= 16) {
        setGenLog(l => [...l, `⏭ Month ${m.id} already has ${existing.length} projects`]);
        continue;
      }
      setGenLog(l => [...l, `⚡ Month ${m.id}: ${m.title}...`]);
      try {
        const newProjs = await batchGenProjects(m.id, existing.length);
        await saveGenProjects(prev => [...(prev||[]), ...newProjs]);
        setGenLog(l => [...l, `✅ Month ${m.id}: +${newProjs.length} projects (total: ${existing.length + newProjs.length})`]);
      } catch(e) {
        setGenLog(l => [...l, `❌ Month ${m.id} failed: ${e.message}`]);
      }
    }
    setGenLog(l => [...l, `🎉 Done! Total projects: ${allProjects.length}`]);
    setGenerating(false);
  };

  const aiGenSingle = async () => {
    setAiLoad(true); setAiResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:`Generate a Python project idea:
Month ${aiMonth} of 6 (${PYTHON_MONTHS.find(m=>m.id===aiMonth)?.title})
Difficulty: ${aiDiff}
Focus: ${aiSkill||"general Python"}
Return ONLY valid JSON: {"title":"...","desc":"2-3 sentences","skills":["s1","s2","s3"],"time":"X-Y days","steps":["Step 1: ...","Step 2: ...","Step 3: ...","Step 4: ...","Step 5: ..."],"stretch":"bonus challenge"}`}]})});
      const data = await res.json();
      setAiResult(JSON.parse(data.content.map(c=>c.text||"").join("").trim()));
    } catch(e) { alert("Failed. Try again."); }
    setAiLoad(false);
  };

  return (
    <div className="fade-up" style={{padding:"clamp(12px,4vw,28px)"}}>
      <div className="syne" style={{fontSize:"clamp(18px,4vw,24px)",fontWeight:800,color:T.t1,marginBottom:4}}>🔨 Project Ideas</div>
      <p style={{fontSize:13,color:T.t2,marginBottom:16}}>Build towards <strong style={{color:T.amber}}>100 projects</strong> across 6 months — generate more with AI in real-time</p>

      {/* Live counter bar */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 18px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
            <span className="syne" style={{fontSize:24,fontWeight:800,color:T.amber}}>{allProjects.length}</span>
            <span style={{fontSize:13,color:T.t2}}>/ 100 projects generated</span>
            <span style={{fontSize:12,color:T.green}}>✅ {Object.values(done).filter(Boolean).length} completed</span>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button className="btn btn-amber btn-sm" onClick={generateAll} disabled={generating}>
              {generating?<><span className="spin">⟳</span>Generating...</>:"🚀 Generate All 100 Projects"}
            </button>
          </div>
        </div>
        <div className="pbar" style={{height:8,marginBottom:6}}>
          <div className="pfill" style={{width:`${Math.min(100,(allProjects.length/100)*100)}%`,background:"linear-gradient(90deg,#f59e0b,#10b981)",boxShadow:"0 0 8px #f59e0b40",transition:"width .5s"}}/>
        </div>
        {/* Per-month mini counters */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
          {PYTHON_MONTHS.map(m => {
            const cnt = projectsPerMonth(m.id);
            const pct = Math.min(100, (cnt/16)*100);
            return (
              <div key={m.id} style={{flex:"1 1 80px",minWidth:70}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:10,color:T.t2}}>{m.emoji} M{m.id}</span>
                  <span style={{fontSize:10,fontWeight:700,color:m.color}}>{cnt}/16</span>
                </div>
                <div className="pbar" style={{height:3}}>
                  <div style={{height:"100%",borderRadius:999,width:`${pct}%`,background:m.color,transition:"width .5s"}}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generation log */}
      {genLog.length > 0 && (
        <div style={{background:"#02020c",border:"1px solid #0a0a28",borderRadius:10,padding:"12px 14px",marginBottom:14,maxHeight:140,overflowY:"auto"}}>
          {genLog.map((l,i) => (
            <div key={i} className="mono" style={{fontSize:11,color:l.startsWith("✅")?T.green:l.startsWith("❌")?"#f87171":l.startsWith("🎉")?T.amber:T.t2,marginBottom:3}}>
              {generating && i===genLog.length-1 && <span className="spin" style={{marginRight:6}}>⟳</span>}
              {l}
            </div>
          ))}
        </div>
      )}

      {/* Per-month generate buttons */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {PYTHON_MONTHS.map(m => {
          const cnt = projectsPerMonth(m.id);
          const done2 = cnt >= 16;
          return (
            <button key={m.id} onClick={()=>generateForMonth(m.id)} disabled={generating||done2} className="btn btn-sm"
              style={{background:done2?T.green+"20":m.color+"20",border:`1px solid ${done2?T.green+"60":m.color+"50"}`,color:done2?T.green:m.color,fontFamily:"'DM Sans',sans-serif"}}>
              {done2?"✅":m.emoji} M{m.id} ({cnt}) {done2?"":"+ Add 15"}
            </button>
          );
        })}
      </div>

      {/* AI single idea generator */}
      <div style={{background:"linear-gradient(135deg,#07072a,#04041a)",border:`1px solid ${T.blue}40`,borderRadius:14,padding:"16px 18px",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:T.blue,marginBottom:10}}>✨ Custom AI Project Generator</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
          <select className="inp" value={aiMonth} onChange={e=>setAiMonth(+e.target.value)} style={{padding:"6px 10px",flex:1,minWidth:120}}>
            {PYTHON_MONTHS.map(m=><option key={m.id} value={m.id}>M{m.id}: {m.title}</option>)}
          </select>
          <input className="inp" value={aiSkill} onChange={e=>setAiSkill(e.target.value)} placeholder="Focus skill (e.g. asyncio, pandas...)" style={{padding:"6px 10px",flex:2,minWidth:150}}/>
          <select className="inp" value={aiDiff} onChange={e=>setAiDiff(e.target.value)} style={{padding:"6px 10px",flex:1,minWidth:90}}>
            {["Easy","Medium","Hard","Very Hard"].map(d=><option key={d}>{d}</option>)}
          </select>
          <button className="btn btn-py btn-sm" onClick={aiGenSingle} disabled={aiLoad}>
            {aiLoad?<><span className="spin">⟳</span>Generating...</>:"✨ Generate"}
          </button>
        </div>
        {aiResult && (
          <div className="fade-in" style={{background:"#050520",border:`1px solid ${T.blue}50`,borderRadius:10,padding:"14px 16px"}}>
            <div className="syne" style={{fontSize:15,fontWeight:800,color:T.t1,marginBottom:5}}>{aiResult.title}</div>
            <p style={{fontSize:12,color:T.t2,lineHeight:1.6,marginBottom:10}}>{aiResult.desc}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              {aiResult.skills?.map(s=><span key={s} style={{fontSize:10,color:T.blue,background:T.blue+"18",padding:"2px 8px",borderRadius:999,border:`1px solid ${T.blue}40`}}>{s}</span>)}
              <span style={{fontSize:10,color:T.amber,background:T.amber+"15",padding:"2px 8px",borderRadius:999,border:`1px solid ${T.amber}40`}}>⏱ {aiResult.time}</span>
            </div>
            {aiResult.steps?.map((s,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:4,fontSize:12,color:T.t1}}><span style={{color:T.blue,fontWeight:800,flexShrink:0}}>{i+1}.</span><span style={{lineHeight:1.5}}>{s}</span></div>)}
            {aiResult.stretch&&<div style={{marginTop:8,padding:"7px 11px",background:T.amber+"10",border:`1px solid ${T.amber}30`,borderRadius:7,fontSize:12,color:T.amber}}>⭐ Stretch: {aiResult.stretch}</div>}
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
        <button onClick={()=>setFilterMonth(0)} className="btn btn-sm" style={{background:filterMonth===0?T.blue+"30":"transparent",border:`1px solid ${filterMonth===0?T.blue:T.border}`,color:filterMonth===0?T.blue:T.t2,fontFamily:"'DM Sans',sans-serif"}}>All ({allProjects.length})</button>
        {PYTHON_MONTHS.map(m=>(
          <button key={m.id} onClick={()=>setFilterMonth(m.id)} className="btn btn-sm" style={{background:filterMonth===m.id?m.color+"30":"transparent",border:`1px solid ${filterMonth===m.id?m.color:T.border}`,color:filterMonth===m.id?m.color:T.t2,fontFamily:"'DM Sans',sans-serif"}}>{m.emoji} M{m.id} ({projectsPerMonth(m.id)})</button>
        ))}
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:16}}>
        {["All","Easy","Medium","Hard","Very Hard"].map(d=><button key={d} onClick={()=>setFilterDiff(d)} className="btn btn-sm" style={{background:filterDiff===d?(DIFF_C[d]||T.blue)+"30":"transparent",border:`1px solid ${filterDiff===d?(DIFF_C[d]||T.blue):T.border}`,color:filterDiff===d?(DIFF_C[d]||T.blue):T.t2,fontFamily:"'DM Sans',sans-serif"}}>{d}</button>)}
      </div>

      {/* Project cards */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(p=>{
          const dc=DIFF_C[p.diff]||T.blue; const isDone=!!done[p.id]; const isExp=expandedId===p.id;
          return (
            <div key={p.id} style={{background:isDone?"#021508":T.card,border:`1px solid ${isDone?T.green+"60":isExp?dc+"50":T.border}`,borderRadius:12,overflow:"hidden",transition:"all .2s"}}>
              <div style={{padding:"13px 15px",cursor:"pointer",display:"flex",gap:11,alignItems:"flex-start"}} onClick={()=>setExpandedId(isExp?null:p.id)}>
                <div onClick={e=>{e.stopPropagation();saveDone(prev=>({...prev,[p.id]:!prev[p.id]}))}}
                  style={{width:21,height:21,borderRadius:5,flexShrink:0,marginTop:1,background:isDone?T.green:"transparent",border:`2px solid ${isDone?T.green:dc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",fontWeight:900,cursor:"pointer"}}>{isDone?"✓":""}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",marginBottom:4}}>
                    <span className="syne" style={{fontSize:13,fontWeight:700,color:isDone?T.green:T.t1}}>{p.title}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:999,background:dc+"18",color:dc,border:`1px solid ${dc}40`}}>{p.diff}</span>
                    <span style={{fontSize:10,color:T.t2}}>M{p.month}</span>
                    <span style={{fontSize:10,color:T.t2}}>⏱ {p.time}</span>
                    {p.generated&&<span style={{fontSize:9,color:"#a855f7",background:"#a855f715",padding:"1px 6px",borderRadius:999,border:"1px solid #a855f740"}}>AI ✨</span>}
                  </div>
                  <p style={{fontSize:12,color:T.t2,lineHeight:1.5}}>{p.desc?.slice(0,100)}{(p.desc?.length||0)>100?"…":""}</p>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
                    {p.tags?.slice(0,3).map(t=><span key={t} style={{fontSize:10,color:dc,background:dc+"12",padding:"1px 6px",borderRadius:999}}>{t}</span>)}
                  </div>
                </div>
                <span style={{fontSize:10,color:T.t2,flexShrink:0}}>{isExp?"▲":"▼"}</span>
              </div>
              {isExp&&(
                <div className="fade-in" style={{padding:"0 15px 14px",borderTop:`1px solid ${T.border}`}}>
                  <p style={{fontSize:13,color:T.t1,lineHeight:1.7,margin:"10px 0"}}>{p.desc}</p>
                  <div style={{fontSize:11,fontWeight:700,color:T.t2,marginBottom:5}}>🛠 Skills</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>{p.skills?.map(s=><span key={s} style={{fontSize:11,color:T.blue,background:T.blue+"15",padding:"2px 9px",borderRadius:999,border:`1px solid ${T.blue}40`}}>{s}</span>)}</div>
                  <div style={{display:"flex",gap:9,flexWrap:"wrap",alignItems:"center"}}>
                    {p.repo&&<a href={`https://${p.repo}`} target="_blank" rel="noreferrer" style={{fontSize:12,color:T.blue,textDecoration:"none"}}>📦 Reference ↗</a>}
                    <button className="btn btn-sm" onClick={()=>saveDone(prev=>({...prev,[p.id]:!prev[p.id]}))}
                      style={{background:isDone?"#1a0404":"#021508",border:`1px solid ${isDone?"#7f1d1d":T.green+"60"}`,color:isDone?"#fca5a5":T.green}}>
                      {isDone?"✗ Undo":"✓ Mark Done"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length===0&&<div style={{textAlign:"center",padding:30,color:T.t3,fontSize:13}}>No projects yet for this filter. Click a generate button above!</div>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PRACTICE QUESTIONS VIEW — 300 questions with real-time generation
═══════════════════════════════════════════════════════════════════ */
const Q_CATEGORIES = ["Python Basics","Data Structures","Algorithms","OOP & Design","Python Advanced","APIs & Data"];

const PracticeView = () => {
  const [cat,   setCat]   = useState("All");
  const [diff,  setDiff]  = useState("All");
  const [search, setSearch] = useState("");
  const [solved, saveSolved]             = useStorage("pq-solved-v1",  {});
  const [genQuestions, saveGenQuestions] = useStorage("gen-questions-v2", []);
  const [active,  setActive]  = useState(null);
  const [showHint,  setShowHint]  = useState(false);
  const [showSol,   setShowSol]   = useState(false);
  const [timer,   setTimer]   = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  const [genLog,      setGenLog]      = useState([]);
  const [generating,  setGenerating]  = useState(false);
  // AI custom generator
  const [aiCat,   setAiCat]   = useState("Python Basics");
  const [aiDiff3, setAiDiff3] = useState("Medium");
  const [aiTopic, setAiTopic] = useState("");
  const [aiQ,     setAiQ]     = useState(null);
  const [aiLoad2, setAiLoad2] = useState(false);

  useEffect(()=>{ if(running){timerRef.current=setInterval(()=>setTimer(t=>t+1),1000);}else clearInterval(timerRef.current); return()=>clearInterval(timerRef.current); },[running]);

  const allQuestions = [...SEED_QUESTIONS, ...(genQuestions||[])];
  const DIFF_C = {Easy:T.green, Medium:T.amber, Hard:"#f87171", "Very Hard":"#c084fc"};
  const XP_MAP = {Easy:15, Medium:30, Hard:60, "Very Hard":100};
  const fmt = s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const questionsPerCat = (c) => allQuestions.filter(q=>q.cat===c).length;
  const totalXP = Object.keys(solved).reduce((a,id)=>{const q=allQuestions.find(x=>x.id===id);return a+(q?.xp||XP_MAP[q?.diff]||0);},0);

  const filtered = allQuestions.filter(q =>
    (cat==="All"||q.cat===cat) &&
    (diff==="All"||q.diff===diff) &&
    (!search || q.q.toLowerCase().includes(search.toLowerCase()))
  );

  const startQ = (q) => { setActive(q); setShowHint(false); setShowSol(false); setTimer(0); setRunning(true); };
  const markSolved = () => { setRunning(false); if(active) saveSolved(prev=>({...prev,[active.id]:{done:true,time:timer}})); setActive(null); };

  // Generate 15 questions for one category
  const generateForCat = async (category) => {
    const existing = allQuestions.filter(q=>q.cat===category);
    if (existing.length >= 50) return;
    setGenerating(true);
    setGenLog(l=>[...l, `⚡ Generating 15 questions for "${category}"...`]);
    try {
      const newQs = await batchGenQuestions(category, existing.length);
      await saveGenQuestions(prev=>[...(prev||[]), ...newQs]);
      setGenLog(l=>[...l, `✅ "${category}": +${newQs.length} questions (total: ${existing.length+newQs.length})`]);
    } catch(e) {
      setGenLog(l=>[...l, `❌ ${category} failed: ${e.message}`]);
    }
    setGenerating(false);
  };

  // Generate ALL categories to reach 300
  const generateAll300 = async () => {
    setGenerating(true);
    setGenLog(["🚀 Generating questions for all 6 categories..."]);
    for (const category of Q_CATEGORIES) {
      const existing = allQuestions.filter(q=>q.cat===category);
      const need = Math.max(0, 50 - existing.length);
      if (need === 0) { setGenLog(l=>[...l,`⏭ "${category}" already has ${existing.length}/50`]); continue; }
      const batches = Math.ceil(need / 15);
      for (let b = 0; b < batches; b++) {
        const cur = allQuestions.filter(q=>q.cat===category).length;
        if (cur >= 50) break;
        setGenLog(l=>[...l, `⚡ "${category}" batch ${b+1}/${batches}...`]);
        try {
          const newQs = await batchGenQuestions(category, cur);
          await saveGenQuestions(prev=>[...(prev||[]), ...newQs]);
          setGenLog(l=>[...l, `✅ +${newQs.length} → total ${cur+newQs.length}`]);
        } catch(e) {
          setGenLog(l=>[...l, `❌ Failed: ${e.message}`]);
          break;
        }
      }
    }
    setGenLog(l=>[...l, `🎉 Done! Total: ${allQuestions.length} questions`]);
    setGenerating(false);
  };

  const aiCustomGen = async () => {
    setAiLoad2(true); setAiQ(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:`Python interview question:
Category: ${aiCat}, Difficulty: ${aiDiff3}, Topic: ${aiTopic||aiCat}
Return ONLY valid JSON:
{"q":"full question","hint":"hint without giving answer","approach":"optimal approach 2 sentences","code":"# Python solution\\ndef solve():\\n    pass","time_complexity":"O(?)","space_complexity":"O(?)","followup":"follow-up question"}`}]})});
      const data = await res.json();
      setAiQ(JSON.parse(data.content.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim()));
    } catch(e){ alert("Failed."); }
    setAiLoad2(false);
  };

  const cats = ["All",...Q_CATEGORIES];

  return (
    <div className="fade-up" style={{padding:"clamp(12px,4vw,28px)"}}>
      <div className="syne" style={{fontSize:"clamp(18px,4vw,24px)",fontWeight:800,color:T.t1,marginBottom:4}}>⚡ Practice Questions</div>
      <p style={{fontSize:13,color:T.t2,marginBottom:16}}>Build up to <strong style={{color:T.green}}>300 questions</strong> — generate more per category in real-time</p>

      {/* Live counter */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 18px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
            <span className="syne" style={{fontSize:24,fontWeight:800,color:T.green}}>{allQuestions.length}</span>
            <span style={{fontSize:13,color:T.t2}}>/ 300 questions</span>
            <span style={{fontSize:12,color:T.amber}}>⭐ {totalXP} XP earned</span>
            <span style={{fontSize:12,color:T.blue}}>✅ {Object.keys(solved).length} solved</span>
          </div>
          <button className="btn btn-green btn-sm" onClick={generateAll300} disabled={generating}>
            {generating?<><span className="spin">⟳</span>Generating...</>:"🚀 Generate All 300 Questions"}
          </button>
        </div>
        <div className="pbar" style={{height:8,marginBottom:8}}>
          <div className="pfill" style={{width:`${Math.min(100,(allQuestions.length/300)*100)}%`,background:"linear-gradient(90deg,#10b981,#3b82f6,#a855f7)",boxShadow:"0 0 8px #10b98140",transition:"width .5s"}}/>
        </div>
        {/* Per-category counters */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:6}}>
          {Q_CATEGORIES.map(c=>{
            const cnt = questionsPerCat(c);
            const full = cnt >= 50;
            return (
              <div key={c} style={{background:T.surf,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 10px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <span style={{fontSize:10,color:T.t2,lineHeight:1.2}}>{c}</span>
                  <span style={{fontSize:10,fontWeight:700,color:full?T.green:T.blue}}>{cnt}/50</span>
                </div>
                <div className="pbar" style={{height:3,marginBottom:4}}>
                  <div style={{height:"100%",borderRadius:999,width:`${Math.min(100,(cnt/50)*100)}%`,background:full?T.green:T.blue,transition:"width .5s"}}/>
                </div>
                <button onClick={()=>generateForCat(c)} disabled={generating||full} className="btn btn-sm"
                  style={{width:"100%",fontSize:9,padding:"3px 0",background:full?T.green+"15":"transparent",border:`1px solid ${full?T.green+"50":T.border}`,color:full?T.green:T.t2,fontFamily:"'DM Sans',sans-serif"}}>
                  {full?"✅ Full":generating?"⟳…":`+ 15 Questions`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generation log */}
      {genLog.length > 0 && (
        <div style={{background:"#02020c",border:"1px solid #0a0a28",borderRadius:9,padding:"10px 14px",marginBottom:12,maxHeight:130,overflowY:"auto"}}>
          {genLog.slice(-8).map((l,i)=>(
            <div key={i} className="mono" style={{fontSize:11,color:l.startsWith("✅")?T.green:l.startsWith("❌")?"#f87171":l.startsWith("🎉")?T.amber:T.t2,marginBottom:2,display:"flex",alignItems:"center",gap:6}}>
              {generating&&i===genLog.slice(-8).length-1&&<span className="spin">⟳</span>}
              {l}
            </div>
          ))}
        </div>
      )}

      {/* Active question overlay */}
      {active&&(
        <div style={{position:"fixed",inset:0,background:"#000000e0",zIndex:500,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"50px 16px 16px",overflowY:"auto"}}>
          <div style={{background:"#08082a",border:`1px solid ${DIFF_C[active.diff]||T.blue}60`,borderRadius:16,padding:"24px",width:"min(100%,660px)",boxShadow:`0 0 40px ${DIFF_C[active.diff]||T.blue}20`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                <span className={`badge ${active.diff==="Easy"?"b-easy":active.diff==="Medium"?"b-med":active.diff==="Hard"?"b-hard":"b-vhard"}`}>{active.diff}</span>
                <span style={{fontSize:11,color:T.t2,background:T.surf,padding:"2px 8px",borderRadius:999,border:`1px solid ${T.border}`}}>{active.cat}</span>
                <span style={{fontSize:11,color:T.t2,background:T.surf,padding:"2px 8px",borderRadius:999,border:`1px solid ${T.border}`}}>🏢 {active.co||"Practice"}</span>
                <span style={{fontSize:11,color:T.amber}}>⭐ {active.xp||XP_MAP[active.diff]||30} XP</span>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div className="mono" style={{fontSize:20,fontWeight:700,color:timer>(active.time||15)*60?"#f87171":T.green}}>{fmt(timer)}</div>
                <button onClick={()=>setRunning(r=>!r)} className="btn btn-ghost btn-sm">{running?"⏸":"▶"}</button>
              </div>
            </div>
            <div className="pbar" style={{height:5,marginBottom:16}}>
              <div className="pfill" style={{width:`${Math.min(100,timer/((active.time||15)*60)*100)}%`,background:timer>(active.time||15)*60?"#ef4444":(DIFF_C[active.diff]||T.blue),transition:"width 1s linear"}}/>
            </div>
            <p style={{fontSize:15,color:T.t1,lineHeight:1.8,marginBottom:14,fontWeight:500}}>{active.q}</p>
            <div style={{fontSize:12,color:T.t2,marginBottom:14}}>🎯 Target: <strong style={{color:timer<=(active.time||15)*60?T.green:"#f87171"}}>{active.time||15} min</strong> · <strong style={{color:DIFF_C[active.diff]||T.blue}}>{active.xp||XP_MAP[active.diff]||30} XP</strong></div>

            {showHint&&active.hint&&<div className="fade-in" style={{padding:"10px 14px",background:T.amber+"12",border:`1px solid ${T.amber}40`,borderRadius:8,marginBottom:10,fontSize:13,color:T.amber}}>💡 {active.hint}</div>}
            {showSol&&(
              <div className="fade-in" style={{marginBottom:12}}>
                {active.approach&&<div style={{padding:"10px 14px",background:T.blue+"12",border:`1px solid ${T.blue}40`,borderRadius:8,marginBottom:8,fontSize:13,color:T.t1,lineHeight:1.6}}><strong style={{color:T.blue}}>Approach: </strong>{active.approach}</div>}
                {active.code&&<div className="code">{active.code}</div>}
              </div>
            )}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button className="btn btn-green" onClick={markSolved}>✅ Solved — +{active.xp||XP_MAP[active.diff]||30} XP</button>
              {!showHint&&active.hint&&<button className="btn btn-ghost btn-sm" onClick={()=>setShowHint(true)}>💡 Hint</button>}
              {!showSol&&<button className="btn btn-ghost btn-sm" onClick={()=>setShowSol(true)}>🔑 Solution</button>}
              <button className="btn" style={{background:"#1a0404",border:"1px solid #7f1d1d",color:"#fca5a5"}} onClick={()=>{setRunning(false);setActive(null);}}>✗ Skip</button>
            </div>
          </div>
        </div>
      )}

      {/* AI custom question */}
      <div style={{background:"linear-gradient(135deg,#07072a,#04041a)",border:`1px solid ${T.green}40`,borderRadius:14,padding:"16px 18px",marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:T.green,marginBottom:10}}>🤖 AI Custom Question Generator</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
          <select className="inp" value={aiCat} onChange={e=>setAiCat(e.target.value)} style={{padding:"6px 10px",flex:1,minWidth:130}}>
            {Q_CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
          <select className="inp" value={aiDiff3} onChange={e=>setAiDiff3(e.target.value)} style={{padding:"6px 10px",flex:1,minWidth:90}}>
            {["Easy","Medium","Hard","Very Hard"].map(d=><option key={d}>{d}</option>)}
          </select>
          <input className="inp" value={aiTopic} onChange={e=>setAiTopic(e.target.value)} placeholder="Topic (e.g. generators, binary search...)" style={{padding:"6px 10px",flex:2,minWidth:150}}/>
          <button className="btn btn-green btn-sm" onClick={aiCustomGen} disabled={aiLoad2}>
            {aiLoad2?<><span className="spin">⟳</span>Generating...</>:"✨ Generate"}
          </button>
        </div>
        {aiQ&&(
          <div className="fade-in" style={{background:"#050520",border:`1px solid ${T.green}50`,borderRadius:10,padding:"14px 16px"}}>
            <p style={{fontSize:14,color:T.t1,lineHeight:1.8,marginBottom:10,fontWeight:500}}>{aiQ.q}</p>
            {aiQ.hint&&<div style={{fontSize:12,color:T.amber,marginBottom:8,padding:"7px 11px",background:T.amber+"10",border:`1px solid ${T.amber}30`,borderRadius:7}}>💡 {aiQ.hint}</div>}
            <div style={{fontSize:12,fontWeight:700,color:T.t2,marginBottom:5}}>Approach</div>
            <p style={{fontSize:12,color:T.t2,lineHeight:1.6,marginBottom:8}}>{aiQ.approach}</p>
            {aiQ.code&&<div className="code" style={{marginBottom:8}}>{aiQ.code}</div>}
            <div style={{display:"flex",gap:12,flexWrap:"wrap",fontSize:11,color:T.t2,marginBottom:6}}>
              <span>⏱ <strong style={{color:T.green}}>{aiQ.time_complexity}</strong></span>
              <span>💾 <strong style={{color:T.blue}}>{aiQ.space_complexity}</strong></span>
            </div>
            {aiQ.followup&&<div style={{fontSize:11,color:"#c084fc",padding:"7px 11px",background:"#120525",border:"1px solid #6b21a8",borderRadius:7}}>🎙 Follow-up: {aiQ.followup}</div>}
          </div>
        )}
      </div>

      {/* Search + Filters */}
      <input className="inp" value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search questions..." style={{marginBottom:10}}/>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
        {cats.map(c=>{
          const cnt = c==="All"?allQuestions.length:questionsPerCat(c);
          return <button key={c} onClick={()=>setCat(c)} className="btn btn-sm" style={{background:cat===c?T.blue+"30":"transparent",border:`1px solid ${cat===c?T.blue:T.border}`,color:cat===c?T.blue:T.t2,fontFamily:"'DM Sans',sans-serif"}}>{c} ({cnt})</button>;
        })}
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
        {["All","Easy","Medium","Hard","Very Hard"].map(d=><button key={d} onClick={()=>setDiff(d)} className="btn btn-sm" style={{background:diff===d?(DIFF_C[d]||T.blue)+"30":"transparent",border:`1px solid ${diff===d?(DIFF_C[d]||T.blue):T.border}`,color:diff===d?(DIFF_C[d]||T.blue):T.t2,fontFamily:"'DM Sans',sans-serif"}}>{d}</button>)}
      </div>

      <div style={{fontSize:12,color:T.t2,marginBottom:10}}>Showing {filtered.length} questions</div>

      {/* Question list */}
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {filtered.map(q=>{
          const dc=DIFF_C[q.diff]||T.blue; const isSolved=!!solved[q.id]; const sd=solved[q.id];
          return (
            <div key={q.id} style={{background:isSolved?"#021208":T.card,border:`1px solid ${isSolved?T.green+"60":T.border}`,borderRadius:11,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start",transition:"all .2s"}}>
              <div style={{width:20,height:20,borderRadius:5,flexShrink:0,marginTop:1,background:isSolved?T.green:"transparent",border:`2px solid ${isSolved?T.green:dc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#000",fontWeight:900}}>{isSolved?"✓":""}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:5}}>
                  <span className={`badge ${q.diff==="Easy"?"b-easy":q.diff==="Medium"?"b-med":q.diff==="Hard"?"b-hard":"b-vhard"}`}>{q.diff}</span>
                  <span style={{fontSize:10,color:T.t2,background:T.surf,padding:"1px 7px",borderRadius:999,border:`1px solid ${T.border}`}}>{q.cat}</span>
                  {q.co&&<span style={{fontSize:10,color:T.t2}}>🏢 {q.co}</span>}
                  <span style={{fontSize:10,color:T.amber}}>⭐ {q.xp||XP_MAP[q.diff]||30}</span>
                  <span style={{fontSize:10,color:T.t2}}>⏱ {q.time||15}min</span>
                  {q.generated&&<span style={{fontSize:9,color:"#a855f7",background:"#a855f715",padding:"1px 5px",borderRadius:999,border:"1px solid #a855f740"}}>AI ✨</span>}
                  {isSolved&&sd?.time&&<span style={{fontSize:10,color:T.green}}>✅ {fmt(sd.time)}</span>}
                </div>
                <p style={{fontSize:13,color:isSolved?T.t2:T.t1,lineHeight:1.6}}>{q.q}</p>
              </div>
              <button className="btn btn-sm" onClick={()=>startQ(q)} style={{flexShrink:0,background:isSolved?"transparent":dc+"25",border:`1px solid ${isSolved?T.border:dc+"60"}`,color:isSolved?T.t2:dc,fontFamily:"'DM Sans',sans-serif"}}>
                {isSolved?"Redo":"▶ Solve"}
              </button>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{textAlign:"center",padding:30,color:T.t3,fontSize:13}}>No questions match. Try generating more!</div>}
      </div>
    </div>
  );
};



/* ═══════════════════════════════════════════════════════════════════
   THEORY SECTION — Python reference with methods + examples
═══════════════════════════════════════════════════════════════════ */
const THEORY_DATA = [
  {
    id:"variables", cat:"Month 1 · Fundamentals", title:"Variables & Data Types", emoji:"📦",
    intro:"Python is dynamically typed — variables need no type declaration. Everything is an object.",
    sections:[
      { name:"Core Types", items:[
        { method:"int", desc:"Integer number. Arbitrary precision.", ex:"x = 42\ny = int('100')  # 100\nz = int(3.9)    # 3 (truncates)\n\n# Useful int operations\nabs(-7)         # 7\npow(2, 10)      # 1024\ndivmod(17, 5)   # (3, 2)  quotient, remainder" },
        { method:"float", desc:"64-bit floating point number.", ex:"pi = 3.14159\nf = float('3.14')   # 3.14\nround(3.14159, 2)   # 3.14\n\nimport math\nmath.floor(3.7)  # 3\nmath.ceil(3.2)   # 4\nmath.sqrt(16)    # 4.0" },
        { method:"str", desc:"Immutable sequence of Unicode characters.", ex:'name = "Alice"\ns = str(42)       # "42"\nlen(name)         # 5\nname[0]           # "A"\nname[-1]          # "e"\nname[1:3]         # "li"  (slicing)' },
        { method:"bool", desc:"Subclass of int. True==1, False==0.", ex:"t = True; f = False\nbool(0)      # False\nbool([])     # False  (empty = falsy)\nbool('')     # False\nbool(1)      # True\nbool([1,2])  # True\nnot True     # False" },
        { method:"None", desc:"Singleton representing 'no value'. Type is NoneType.", ex:"x = None\nif x is None:       # always use 'is', not ==\n    print('empty')\n\ndef greet(name=None):\n    if name is None:\n        name = 'World'\n    return f'Hello, {name}!'" },
      ]},
      { name:"Type Functions", items:[
        { method:"type(obj)", desc:"Returns the exact type of an object.", ex:"type(42)          # <class 'int'>\ntype('hi')        # <class 'str'>\ntype([])          # <class 'list'>\ntype(None)        # <class 'NoneType'>\n\n# Check exact type (not recommended — use isinstance)\ntype(True) == bool  # True" },
        { method:"isinstance(obj, cls)", desc:"Checks if obj is an instance of cls or its subclasses.", ex:"isinstance(42, int)           # True\nisinstance(True, int)         # True  (bool is subclass of int)\nisinstance(3.14, (int,float)) # True  (tuple of types)\nisinstance('hi', str)         # True\n\n# Prefer over type() for OOP safety" },
        { method:"id(obj)", desc:"Returns the memory address of an object.", ex:"a = [1,2,3]\nb = a       # same object — alias!\nid(a) == id(b)   # True\n\nc = a.copy() # different object\nid(a) == id(c)   # False\n\n# Small integers (-5 to 256) are cached\nx = 100; y = 100\nid(x) == id(y)   # True (cached)" },
      ]},
      { name:"Type Conversion", items:[
        { method:"int(), float(), str(), bool()", desc:"Explicit type conversion functions.", ex:'# int from string\nint("42")        # 42\nint("0xFF", 16)  # 255 (hex)\nint("0b1010", 2) # 10  (binary)\n\n# str from anything\nstr(3.14)        # "3.14"\nstr([1,2,3])     # "[1, 2, 3]"\n\n# float edge cases\nfloat("inf")     # inf\nfloat("nan")     # nan' },
      ]},
    ]
  },
  {
    id:"strings", cat:"Month 1 · Fundamentals", title:"String Methods", emoji:"📝",
    intro:"Strings are immutable. All string methods return a new string — they never modify in place.",
    sections:[
      { name:"Case & Strip", items:[
        { method:".upper() / .lower()", desc:"Convert to UPPERCASE or lowercase.", ex:'s = "Hello World"\ns.upper()    # "HELLO WORLD"\ns.lower()    # "hello world"\ns.title()    # "Hello World"\ns.swapcase() # "hELLO wORLD"\ns.capitalize() # "Hello world"  (only first letter)' },
        { method:".strip() / .lstrip() / .rstrip()", desc:"Remove whitespace or specified characters from edges.", ex:'"  hello  ".strip()    # "hello"\n"  hello  ".lstrip()   # "hello  "\n"  hello  ".rstrip()   # "  hello"\n\n# Remove specific chars\n"###Python###".strip("#")  # "Python"\n"abcXYZabc".strip("abc")   # "XYZ"' },
      ]},
      { name:"Search & Replace", items:[
        { method:".find() / .index()", desc:".find() returns -1 if not found; .index() raises ValueError.", ex:'"hello world".find("world")   # 6\n"hello world".find("xyz")     # -1  (not found)\n"hello world".index("world")  # 6\n\n# From position\n"abcabc".find("bc", 2)  # 4  (start from index 2)\n"hello".rfind("l")      # 3  (right-most)' },
        { method:".replace(old, new, count)", desc:"Replace occurrences. Optional count limits replacements.", ex:'"aababc".replace("a", "X")     # "XXbXbc"\n"aababc".replace("a", "X", 2)  # "XXababc"  (only 2)\n\n# Chain replaces\n"  hello  world  ".replace("  ", " ").strip()  # "hello world"' },
        { method:".count(sub)", desc:"Count non-overlapping occurrences of substring.", ex:'"banana".count("a")     # 3\n"banana".count("an")    # 2\n"aaaa".count("aa")      # 2  (non-overlapping)\n\n# With start/end\n"hello world hello".count("hello", 5)  # 1' },
      ]},
      { name:"Split & Join", items:[
        { method:".split(sep, maxsplit)", desc:"Split string into a list. Default splits on whitespace.", ex:'"a,b,c".split(",")         # ["a", "b", "c"]\n"hello world".split()      # ["hello", "world"]  (any whitespace)\n"a b c".split(" ", 1)      # ["a", "b c"]  (maxsplit=1)\n\n# splitlines for multi-line text\n"a\\nb\\nc".splitlines()    # ["a", "b", "c"]' },
        { method:'sep.join(iterable)', desc:"Join an iterable into a string with separator.", ex:'", ".join(["Alice", "Bob", "Charlie"])  # "Alice, Bob, Charlie"\n"".join(["P","y","t","h","o","n"])       # "Python"\n"\\n".join(["line1", "line2"])            # "line1\\nline2"\n\n# Common pattern: list → string\n"-".join(str(n) for n in [1,2,3])      # "1-2-3"' },
      ]},
      { name:"Check & Format", items:[
        { method:".startswith() / .endswith()", desc:"Check prefix/suffix. Accept tuple of strings.", ex:'"hello.py".endswith(".py")         # True\n"hello.py".endswith((".py",".txt")) # True\n"README".startswith(("README","readme"))  # True\n\n# Useful for file type checks\nfilename.endswith((".jpg",".png",".gif"))' },
        { method:"f-strings (f\"\")", desc:"Modern string formatting. Expressions in curly braces.", ex:'name = "Alice"; score = 95.5\nf"Name: {name}, Score: {score:.1f}"  # "Name: Alice, Score: 95.5"\nf"{2**10}"        # "1024"   (any expression)\nf"{name!r}"       # "\'Alice\'"  (repr)\nf"{score:>10.2f}" # "     95.50"  (alignment)' },
        { method:".zfill() / .center() / .ljust() / .rjust()", desc:"Padding and alignment.", ex:'"42".zfill(5)          # "00042"\n"hi".center(10)        # "    hi    "\n"hi".center(10, "-")   # "----hi----"\n"hi".ljust(10, ".")    # "hi........"\n"hi".rjust(10)         # "        hi"' },
      ]},
    ]
  },
  {
    id:"lists", cat:"Month 2 · Data Structures", title:"List Methods", emoji:"📋",
    intro:"Lists are ordered, mutable sequences. The most versatile Python data structure.",
    sections:[
      { name:"Add / Remove", items:[
        { method:".append(item)", desc:"Add single item to the END. O(1) amortized.", ex:"lst = [1, 2, 3]\nlst.append(4)    # [1, 2, 3, 4]\nlst.append([5,6])  # [1,2,3,4,[5,6]] — appends the LIST\n\n# vs extend\nlst2 = [1, 2]\nlst2.extend([3,4])  # [1, 2, 3, 4]" },
        { method:".insert(idx, item)", desc:"Insert item BEFORE index idx. O(n).", ex:"lst = ['a','b','d']\nlst.insert(2, 'c')   # ['a','b','c','d']\nlst.insert(0, 'X')   # ['X','a','b','c','d']  (prepend)\nlst.insert(-1, 'Z')  # inserts before last element" },
        { method:".remove(value)", desc:"Remove FIRST occurrence. Raises ValueError if not found.", ex:"lst = [1, 2, 3, 2, 1]\nlst.remove(2)    # [1, 3, 2, 1]  (first 2 only)\n\n# Safe remove\nif value in lst:\n    lst.remove(value)" },
        { method:".pop(idx=-1)", desc:"Remove and return item at index. Default: last item. O(1) for end, O(n) for middle.", ex:"lst = [10, 20, 30, 40]\nlst.pop()     # returns 40, lst=[10,20,30]\nlst.pop(0)    # returns 10, lst=[20,30]\nlst.pop(1)    # returns 30, lst=[20]\n\n# Common pattern: stack\nstack = []\nstack.append(x)  # push\nstack.pop()      # pop" },
      ]},
      { name:"Sort & Search", items:[
        { method:".sort(key, reverse)", desc:"In-place sort. Stable. key is a function.", ex:"nums = [3,1,4,1,5,9]\nnums.sort()                    # [1,1,3,4,5,9]\nnums.sort(reverse=True)        # [9,5,4,3,1,1]\n\nwords = ['banana','apple','cherry']\nwords.sort(key=len)            # ['apple','banana','cherry']\nwords.sort(key=str.lower)\n\n# vs sorted() — returns new list\nsorted([3,1,4], reverse=True)  # [4,3,1]" },
        { method:".index(value, start, end)", desc:"Return index of first match. Raises ValueError if not found.", ex:"lst = ['a','b','c','b']\nlst.index('b')      # 1\nlst.index('b', 2)   # 3  (search from index 2)\n\n# Safe index with .find()-style:\ntry:\n    i = lst.index('z')\nexcept ValueError:\n    i = -1" },
        { method:".count(value)", desc:"Count occurrences of value.", ex:"lst = [1,2,3,1,2,1]\nlst.count(1)   # 3\nlst.count(9)   # 0\n\n# Frequency dict (better for many values)\nfrom collections import Counter\ncounts = Counter(lst)  # Counter({1:3, 2:2, 3:1})" },
      ]},
      { name:"Copy & Misc", items:[
        { method:"Slicing [start:stop:step]", desc:"Extract sub-list. Does NOT modify original.", ex:"lst = [0,1,2,3,4,5]\nlst[1:4]     # [1,2,3]\nlst[::2]     # [0,2,4]  (every 2nd)\nlst[::-1]    # [5,4,3,2,1,0]  (reverse copy)\nlst[-3:]     # [3,4,5]  (last 3)\nlst[:]       # shallow copy of entire list" },
        { method:"List Comprehension", desc:"Concise list creation. Faster than for loop + append.", ex:"# [expression for item in iterable if condition]\nsquares = [x**2 for x in range(10)]\nevens   = [x for x in range(20) if x%2==0]\nmatrix  = [[r*c for c in range(3)] for r in range(3)]\n\n# Flatten nested list\nnested = [[1,2],[3,4],[5,6]]\nflat = [x for row in nested for x in row]  # [1,2,3,4,5,6]" },
      ]},
    ]
  },
  {
    id:"dicts", cat:"Month 2 · Data Structures", title:"Dictionary Methods", emoji:"🗂",
    intro:"Dicts are hash maps: O(1) average lookup/insert. Ordered by insertion (Python 3.7+).",
    sections:[
      { name:"Access", items:[
        { method:".get(key, default)", desc:"Return value for key, or default if missing. Never raises KeyError.", ex:"d = {'a':1, 'b':2}\nd['a']          # 1  — raises KeyError if missing\nd.get('a')      # 1\nd.get('z')      # None  (no KeyError)\nd.get('z', 0)   # 0  (default value)\n\n# Common pattern: count\ncount = {}\nfor ch in 'hello':\n    count[ch] = count.get(ch, 0) + 1" },
        { method:".keys() / .values() / .items()", desc:"View objects — dynamic, reflect dict changes.", ex:"d = {'a':1,'b':2,'c':3}\nlist(d.keys())    # ['a','b','c']\nlist(d.values())  # [1, 2, 3]\nlist(d.items())   # [('a',1),('b',2),('c',3)]\n\n# Iterate items\nfor key, val in d.items():\n    print(f'{key}: {val}')" },
      ]},
      { name:"Modify", items:[
        { method:".update(other)", desc:"Merge another dict or iterable of key-value pairs.", ex:"d = {'a':1, 'b':2}\nd.update({'b':20, 'c':3})   # {'a':1,'b':20,'c':3}\nd.update(d=4, e=5)          # keyword args also work\n\n# Python 3.9+ merge operator\nd1 = {'a':1}; d2 = {'b':2}\nmerged = d1 | d2    # {'a':1,'b':2}" },
        { method:".setdefault(key, default)", desc:"Return value if key exists, else insert with default and return it.", ex:"d = {'a':1}\nd.setdefault('a', 99)   # 1  (already exists)\nd.setdefault('b', 99)   # 99 (inserts b:99)\n\n# Common: grouping\ngroups = {}\nfor item in items:\n    groups.setdefault(item.category, []).append(item)" },
        { method:".pop(key, default)", desc:"Remove and return value. Default prevents KeyError.", ex:"d = {'a':1,'b':2,'c':3}\nd.pop('b')        # 2  — removes 'b'\nd.pop('z', None)  # None — no error if missing\n\n# popitem() — remove last-inserted (LIFO)\nd.popitem()       # ('c', 3) in Python 3.7+" },
      ]},
      { name:"Build & Patterns", items:[
        { method:"Dict Comprehension", desc:"Build dicts concisely.", ex:"# {key_expr: val_expr for item in iterable if cond}\nsquares = {x: x**2 for x in range(5)}\n# {0:0, 1:1, 2:4, 3:9, 4:16}\n\n# Invert a dict\nd = {'a':1,'b':2,'c':3}\ninverted = {v:k for k,v in d.items()}\n# {1:'a', 2:'b', 3:'c'}" },
        { method:"collections.defaultdict", desc:"Like dict but auto-creates missing keys.", ex:"from collections import defaultdict\n\n# Count characters\ncounts = defaultdict(int)\nfor ch in 'hello':\n    counts[ch] += 1\n\n# Group items\ngroups = defaultdict(list)\nfor name, cat in data:\n    groups[cat].append(name)" },
        { method:"collections.Counter", desc:"Specialized dict for counting. Most common patterns.", ex:"from collections import Counter\n\nwords = ['apple','banana','apple','cherry','banana','apple']\nc = Counter(words)\nc.most_common(2)     # [('apple',3),('banana',2)]\nc['apple']           # 3\nsum(c.values())      # 6\n\n# Arithmetic\nc1 = Counter(a=3,b=2); c2 = Counter(a=1,b=4)\nc1 + c2  # Counter({'b':6,'a':4})" },
      ]},
    ]
  },
  {
    id:"oop", cat:"Month 3 · OOP", title:"Classes & OOP", emoji:"🧱",
    intro:"Python OOP: everything is an object. Classes define blueprints; instances are objects.",
    sections:[
      { name:"Class Basics", items:[
        { method:"class / __init__ / self", desc:"Define a class. __init__ is the constructor. self is the instance.", ex:"class Dog:\n    species = 'Canis lupus'  # class attribute (shared)\n\n    def __init__(self, name, age):\n        self.name = name        # instance attribute\n        self.age  = age\n\n    def bark(self):\n        return f'{self.name} says Woof!'\n\n    def __repr__(self):\n        return f'Dog({self.name!r}, {self.age})'\n\nrex = Dog('Rex', 3)\nrex.bark()            # 'Rex says Woof!'\nDog.species           # 'Canis lupus'" },
        { method:"@property", desc:"Computed attribute. Getter/setter/deleter pattern.", ex:"class Circle:\n    def __init__(self, radius):\n        self._radius = radius\n\n    @property\n    def radius(self):\n        return self._radius\n\n    @radius.setter\n    def radius(self, value):\n        if value < 0:\n            raise ValueError('Radius cannot be negative')\n        self._radius = value\n\n    @property\n    def area(self):\n        import math\n        return math.pi * self._radius ** 2\n\nc = Circle(5)\nc.radius = 10   # calls setter\nc.area          # computed, read-only" },
        { method:"@classmethod / @staticmethod", desc:"Alternative constructors and utility functions.", ex:"class Date:\n    def __init__(self, year, month, day):\n        self.year, self.month, self.day = year, month, day\n\n    @classmethod\n    def from_string(cls, s):  # alternative constructor\n        y, m, d = s.split('-')\n        return cls(int(y), int(m), int(d))\n\n    @staticmethod\n    def is_leap(year):  # utility — no self/cls needed\n        return year%4==0 and (year%100!=0 or year%400==0)\n\nDate.from_string('2024-01-15')  # Date object\nDate.is_leap(2024)               # True" },
      ]},
      { name:"Inheritance", items:[
        { method:"super()", desc:"Call parent class methods. Essential for cooperative multiple inheritance.", ex:"class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f'{self.name} makes a sound'\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)  # call parent __init__\n        self.breed = breed\n\n    def speak(self):           # override\n        return f'{self.name} barks'\n\nclass GoldenRetriever(Dog):\n    def speak(self):\n        return super().speak() + ' (friendly!)'" },
        { method:"isinstance() / issubclass()", desc:"Check inheritance relationships at runtime.", ex:"class A: pass\nclass B(A): pass\nclass C(B): pass\n\nb = B()\nisinstance(b, B)  # True\nisinstance(b, A)  # True  (A is parent)\nissubclass(C, A)  # True  (C inherits from A)\nissubclass(A, B)  # False\n\n# MRO — Method Resolution Order\nC.__mro__   # (<class C>, <class B>, <class A>, <class object>)" },
      ]},
      { name:"Magic Methods", items:[
        { method:"__str__ / __repr__", desc:"Human-readable and unambiguous string representations.", ex:"class Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n\n    def __repr__(self):  # for developers\n        return f'Point({self.x}, {self.y})'\n\n    def __str__(self):   # for end users\n        return f'({self.x}, {self.y})'\n\np = Point(3, 4)\nprint(p)    # (3, 4)  — calls __str__\nrepr(p)     # 'Point(3, 4)' — calls __repr__\n[p]         # [Point(3, 4)] — list uses __repr__" },
        { method:"__eq__ / __hash__ / __lt__", desc:"Comparison and hashing for use in sets/dicts.", ex:"from functools import total_ordering\n\n@total_ordering  # implement < and ==, get rest free\nclass Card:\n    RANKS = '23456789TJQKA'\n    def __init__(self, rank, suit):\n        self.rank = rank; self.suit = suit\n\n    def __eq__(self, other):\n        return self.rank == other.rank\n\n    def __lt__(self, other):\n        return self.RANKS.index(self.rank) < self.RANKS.index(other.rank)\n\n    def __hash__(self):\n        return hash((self.rank, self.suit))" },
        { method:"__len__ / __getitem__ / __iter__", desc:"Make custom classes behave like sequences.", ex:"class NumberRange:\n    def __init__(self, start, end):\n        self.start, self.end = start, end\n\n    def __len__(self):\n        return self.end - self.start\n\n    def __getitem__(self, idx):\n        if idx < 0: idx += len(self)\n        if not (0 <= idx < len(self)):\n            raise IndexError('index out of range')\n        return self.start + idx\n\n    def __iter__(self):\n        return iter(range(self.start, self.end))\n\nr = NumberRange(5, 10)\nlen(r)     # 5\nr[2]       # 7\nlist(r)    # [5, 6, 7, 8, 9]" },
      ]},
    ]
  },
  {
    id:"decorators", cat:"Month 3 · OOP", title:"Decorators", emoji:"🎨",
    intro:"Decorators are higher-order functions that modify other functions without changing their source code.",
    sections:[
      { name:"Core Concepts", items:[
        { method:"Basic decorator pattern", desc:"A decorator is a function that takes a function and returns a function.", ex:"import functools\n\ndef my_decorator(func):\n    @functools.wraps(func)  # preserve metadata\n    def wrapper(*args, **kwargs):\n        print(f'Before {func.__name__}')\n        result = func(*args, **kwargs)\n        print(f'After {func.__name__}')\n        return result\n    return wrapper\n\n@my_decorator\ndef greet(name):\n    print(f'Hello, {name}!')\n\ngreet('Alice')\n# Before greet\n# Hello, Alice!\n# After greet" },
        { method:"Decorator factory (with arguments)", desc:"Decorator that accepts its own arguments.", ex:"def repeat(n):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for _ in range(n):\n                result = func(*args, **kwargs)\n            return result\n        return wrapper\n    return decorator\n\n@repeat(3)\ndef say_hello():\n    print('Hello!')\n\nsay_hello()  # prints Hello! three times" },
      ]},
      { name:"Useful Built-ins", items:[
        { method:"functools.lru_cache", desc:"Memoization decorator. Caches results of expensive calls.", ex:"from functools import lru_cache\n\n@lru_cache(maxsize=None)  # None = unlimited\ndef fib(n):\n    if n < 2: return n\n    return fib(n-1) + fib(n-2)\n\nfib(100)  # instant — without cache this would take ages\n\n# Check cache stats\nfib.cache_info()  # CacheInfo(hits=98, misses=101, ...)\nfib.cache_clear()" },
        { method:"functools.wraps", desc:"Preserves __name__, __doc__, __annotations__ of wrapped function.", ex:"import functools\n\ndef log(func):\n    @functools.wraps(func)   # without this, wrapper.__name__ == 'wrapper'\n    def wrapper(*args, **kwargs):\n        print(f'Calling {func.__name__}')\n        return func(*args, **kwargs)\n    return wrapper\n\n@log\ndef add(x, y):\n    '''Add two numbers.'''\n    return x + y\n\nadd.__name__  # 'add'  (not 'wrapper')\nadd.__doc__   # 'Add two numbers.'" },
      ]},
    ]
  },
  {
    id:"generators", cat:"Month 3 · OOP", title:"Generators & Iterators", emoji:"⚡",
    intro:"Generators produce values lazily — one at a time, only when requested. Memory efficient for large sequences.",
    sections:[
      { name:"Generator Functions", items:[
        { method:"yield", desc:"Pause function execution, return value, resume on next().", ex:"def countdown(n):\n    while n > 0:\n        yield n     # pause here, return n\n        n -= 1      # resume here on next call\n\ngen = countdown(3)\nnext(gen)   # 3\nnext(gen)   # 2\nnext(gen)   # 1\nnext(gen)   # raises StopIteration\n\nfor x in countdown(5):  # for loop handles StopIteration\n    print(x)" },
        { method:"Generator expressions", desc:"Like list comprehensions but lazy. Use () instead of [].", ex:"# List comprehension — creates ALL items NOW\nsquares_list = [x**2 for x in range(1_000_000)]  # uses ~8MB\n\n# Generator expression — creates one item AT A TIME\nsquares_gen = (x**2 for x in range(1_000_000))   # uses ~200 bytes\n\n# Both work the same in loops\nsum(x**2 for x in range(100))  # generator in sum — efficient\n\n# Chain generators\nevens = (x for x in range(1000) if x%2==0)\nbig   = (x for x in evens if x > 500)" },
      ]},
      { name:"Iterator Protocol", items:[
        { method:"__iter__ / __next__", desc:"The iterator protocol. __iter__ returns self. __next__ returns next value.", ex:"class Counter:\n    def __init__(self, low, high):\n        self.current = low\n        self.high = high\n\n    def __iter__(self):\n        return self  # object is its own iterator\n\n    def __next__(self):\n        if self.current > self.high:\n            raise StopIteration\n        self.current += 1\n        return self.current - 1\n\nfor n in Counter(1, 5):\n    print(n)  # 1 2 3 4 5" },
        { method:"itertools module", desc:"Standard library tools for working with iterators.", ex:"import itertools\n\n# chain — concatenate iterables\nlist(itertools.chain([1,2],[3,4],[5]))  # [1,2,3,4,5]\n\n# islice — lazy slicing\nlist(itertools.islice(range(100), 5))  # [0,1,2,3,4]\n\n# cycle — repeat indefinitely\ncycler = itertools.cycle(['Mon','Tue','Wed'])\n\n# accumulate — running totals\nlist(itertools.accumulate([1,2,3,4,5]))  # [1,3,6,10,15]\n\n# product — cartesian product\nlist(itertools.product([1,2],['a','b']))  # [(1,'a'),(1,'b'),...]" },
      ]},
    ]
  },
  {
    id:"exceptions", cat:"Month 1-3 · Core", title:"Exception Handling", emoji:"🛡",
    intro:"Python uses try/except for error handling. Exceptions are objects inheriting from BaseException.",
    sections:[
      { name:"try / except / else / finally", items:[
        { method:"Basic try/except", desc:"Catch specific exceptions. Avoid bare 'except:'.", ex:"try:\n    x = int(input('Enter number: '))\n    result = 10 / x\nexcept ValueError:\n    print('Not a valid number')\nexcept ZeroDivisionError:\n    print('Cannot divide by zero')\nexcept (TypeError, OverflowError) as e:  # multiple exceptions\n    print(f'Math error: {e}')\nelse:\n    print(f'Result: {result}')  # runs if NO exception\nfinally:\n    print('Always runs')  # cleanup code" },
        { method:"raise / raise from", desc:"Raise exceptions. 'raise from' chains exceptions.", ex:"def divide(a, b):\n    if b == 0:\n        raise ValueError('Divisor cannot be zero')\n    return a / b\n\n# Re-raise same exception\ntry:\n    result = divide(1, 0)\nexcept ValueError:\n    print('Logging error...')\n    raise  # re-raises the same exception\n\n# Exception chaining\ntry:\n    open('missing.txt')\nexcept FileNotFoundError as e:\n    raise RuntimeError('Config failed') from e" },
      ]},
      { name:"Custom Exceptions", items:[
        { method:"Custom exception classes", desc:"Subclass Exception for domain-specific errors.", ex:"class AppError(Exception):\n    '''Base class for application errors.'''\n    pass\n\nclass ValidationError(AppError):\n    def __init__(self, field, message):\n        self.field = field\n        self.message = message\n        super().__init__(f'{field}: {message}')\n\nclass NotFoundError(AppError):\n    def __init__(self, resource, resource_id):\n        self.resource = resource\n        super().__init__(f'{resource} with id {resource_id} not found')\n\n# Usage\ntry:\n    raise ValidationError('email', 'invalid format')\nexcept ValidationError as e:\n    print(e.field, e.message)" },
      ]},
    ]
  },
  {
    id:"fileio", cat:"Month 4 · Files & APIs", title:"File I/O & pathlib", emoji:"📁",
    intro:"Python's pathlib (3.4+) is the modern way to work with file system paths.",
    sections:[
      { name:"pathlib.Path", items:[
        { method:"Path basics", desc:"Create, navigate, and inspect file system paths.", ex:"from pathlib import Path\n\np = Path('/home/user/docs/report.txt')\np.name        # 'report.txt'\np.stem        # 'report'\np.suffix      # '.txt'\np.parent      # Path('/home/user/docs')\np.parts       # ('/', 'home', 'user', 'docs', 'report.txt')\n\n# Build paths with /\nhome = Path.home()\nconfig = home / '.config' / 'app' / 'settings.json'\n\n# Check existence\nconfig.exists()   # True/False\nconfig.is_file()  # True/False\nconfig.is_dir()   # True/False" },
        { method:"Read / Write files", desc:"Modern file I/O with pathlib.", ex:"from pathlib import Path\n\npath = Path('data.txt')\n\n# Write\npath.write_text('Hello, World!')       # entire file as string\npath.write_bytes(b'binary data')\n\n# Read\ncontent = path.read_text()              # entire file\nbytes_  = path.read_bytes()\nlines   = path.read_text().splitlines() # list of lines\n\n# Classic open() for large files (streaming)\nwith open(path, 'r', encoding='utf-8') as f:\n    for line in f:  # memory efficient\n        process(line)" },
      ]},
      { name:"File Operations", items:[
        { method:"glob / rglob", desc:"Find files matching a pattern.", ex:"from pathlib import Path\n\np = Path('.')\n\n# All Python files in current dir\nlist(p.glob('*.py'))\n\n# All Python files in all subdirs\nlist(p.rglob('*.py'))\n\n# All files in a dir\nlist(p.iterdir())\n\n# Sort by size\nfiles = sorted(p.rglob('*.py'), key=lambda f: f.stat().st_size)" },
        { method:"mkdir / rename / unlink", desc:"Create, move, delete files and directories.", ex:"from pathlib import Path\n\nPath('new_dir').mkdir(exist_ok=True)\nPath('new_dir/sub').mkdir(parents=True, exist_ok=True)\n\nPath('old.txt').rename(Path('new.txt'))\nPath('file.txt').unlink()           # delete file\nPath('file.txt').unlink(missing_ok=True)  # no error if gone\n\nimport shutil\nshutil.rmtree('directory')          # delete directory tree\nshutil.copy('src.txt', 'dst.txt')   # copy file" },
      ]},
    ]
  },
  {
    id:"numpy", cat:"Month 5 · Data Science", title:"NumPy Essentials", emoji:"🔢",
    intro:"NumPy is the foundation of scientific Python. Vectorized operations on N-dimensional arrays are 10-100× faster than Python loops.",
    sections:[
      { name:"Array Creation", items:[
        { method:"np.array / np.zeros / np.ones / np.arange", desc:"Create arrays from data or patterns.", ex:"import numpy as np\n\nnp.array([1, 2, 3])           # 1D array\nnp.array([[1,2],[3,4]])       # 2D array\nnp.zeros((3, 4))              # 3×4 array of 0s\nnp.ones((2, 3), dtype=float)  # 2×3 array of 1.0s\nnp.arange(0, 10, 2)           # [0, 2, 4, 6, 8]\nnp.linspace(0, 1, 5)          # [0, .25, .5, .75, 1]\nnp.random.randn(3, 3)         # 3×3 standard normal" },
        { method:"Array shape / reshape / dtype", desc:"Key array attributes and shape manipulation.", ex:"a = np.array([[1,2,3],[4,5,6]])\na.shape     # (2, 3)\na.ndim      # 2\na.size      # 6  (total elements)\na.dtype     # dtype('int64')\n\n# Reshape — total elements must match\na.reshape(3, 2)    # (3,2) array\na.reshape(6)       # 1D array\na.reshape(2,-1)    # -1 = auto-calculate\na.flatten()        # always returns 1D copy\na.ravel()          # 1D view (if possible)" },
      ]},
      { name:"Operations", items:[
        { method:"Vectorized arithmetic", desc:"Operations on entire arrays — no loops needed.", ex:"a = np.array([1, 2, 3, 4])\nb = np.array([10, 20, 30, 40])\n\na + b     # [11, 22, 33, 44]\na * b     # [10, 40, 90, 160]\na ** 2    # [1, 4, 9, 16]\na > 2     # [False, False, True, True]  (boolean mask)\n\n# Broadcasting: different shapes\na = np.ones((3,3))\nb = np.array([1, 2, 3])  # shape (3,)\na + b  # b broadcast to (3,3)" },
        { method:"np.sum / np.mean / np.std / np.max", desc:"Aggregate functions. axis parameter controls direction.", ex:"a = np.array([[1,2,3],[4,5,6]])\n\nnp.sum(a)          # 21  (all elements)\nnp.sum(a, axis=0)  # [5,7,9]  (sum columns)\nnp.sum(a, axis=1)  # [6,15]   (sum rows)\n\nnp.mean(a)         # 3.5\nnp.std(a)          # standard deviation\nnp.min(a); np.max(a)\nnp.argmin(a); np.argmax(a)  # index of min/max" },
      ]},
    ]
  },
  {
    id:"pandas", cat:"Month 5 · Data Science", title:"Pandas Essentials", emoji:"🐼",
    intro:"Pandas provides DataFrame and Series for tabular data analysis. Think SQL + Excel in Python.",
    sections:[
      { name:"Core Structures", items:[
        { method:"DataFrame / Series", desc:"DataFrame = 2D table. Series = 1D column.", ex:"import pandas as pd\n\n# Create DataFrame\ndf = pd.DataFrame({\n    'name': ['Alice', 'Bob', 'Charlie'],\n    'age':  [25, 30, 35],\n    'score':[90, 85, 92]\n})\n\n# Select column → Series\ndf['age']         # Series with age data\ndf[['name','age']] # multiple cols → DataFrame\n\n# From CSV\ndf = pd.read_csv('data.csv')\ndf = pd.read_csv('data.csv', index_col='id', parse_dates=['date'])" },
        { method:"df.info() / df.describe() / df.head()", desc:"Quick data inspection methods.", ex:"df.info()      # column types, non-null counts, memory\ndf.describe()  # count, mean, std, min, quartiles, max\ndf.head(5)     # first 5 rows\ndf.tail(3)     # last 3 rows\ndf.shape       # (rows, cols)\ndf.columns     # Index of column names\ndf.dtypes      # dtype of each column\ndf.isnull().sum()  # count missing values per column" },
      ]},
      { name:"Select & Filter", items:[
        { method:".loc[] / .iloc[]", desc:".loc = label-based. .iloc = integer position-based.", ex:"df = pd.DataFrame({'A':[1,2,3],'B':[4,5,6]}, index=['x','y','z'])\n\n# .loc — by label\ndf.loc['x']           # row with label 'x'\ndf.loc['x':'y', 'A']  # rows x to y, column A\ndf.loc[df['A']>1]     # filter rows by condition\n\n# .iloc — by integer position\ndf.iloc[0]            # first row\ndf.iloc[0:2, 0:1]     # rows 0-1, column 0" },
        { method:"Boolean masking / query()", desc:"Filter rows using conditions.", ex:"# Boolean mask\nmask = df['age'] > 25\ndf[mask]              # rows where age > 25\n\n# Multiple conditions\ndf[(df['age'] > 25) & (df['score'] > 90)]\n\n# .query() — SQL-like string\ndf.query('age > 25 and score > 90')\ndf.query('@min_age < age < @max_age')  # use variables with @" },
      ]},
      { name:"Aggregate & Transform", items:[
        { method:".groupby() / .agg()", desc:"Group data and apply aggregations.", ex:"# groupby + agg\ndf.groupby('category')['sales'].sum()\ndf.groupby('category').agg({'sales':'sum','price':'mean'})\n\n# Multiple agg functions\ndf.groupby('dept').agg(\n    avg_salary=('salary','mean'),\n    headcount=('name','count'),\n    max_salary=('salary','max')\n)\n\n# pivot table\npd.pivot_table(df, values='sales', index='region', columns='month', aggfunc='sum')" },
      ]},
    ]
  },
  {
    id:"algorithms", cat:"Month 6 · DSA", title:"Key Algorithms", emoji:"🧮",
    intro:"Essential algorithms for coding interviews. Know time and space complexity for each.",
    sections:[
      { name:"Sorting", items:[
        { method:"Binary Search", desc:"O(log n) search on sorted array. Always define invariant clearly.", ex:"def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = left + (right - left) // 2  # avoid overflow\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# Find insertion point (left-most)\ndef bisect_left(arr, target):\n    lo, hi = 0, len(arr)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if arr[mid] < target: lo = mid + 1\n        else: hi = mid\n    return lo" },
        { method:"Merge Sort", desc:"O(n log n). Stable. Good for linked lists and external sorting.", ex:"def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left  = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]" },
      ]},
      { name:"Graph Traversal", items:[
        { method:"BFS (Breadth-First Search)", desc:"O(V+E). Shortest path in unweighted graphs. Level-by-level.", ex:"from collections import deque\n\ndef bfs(graph, start):\n    visited = {start}\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order\n\n# Shortest path\ndef bfs_path(graph, start, end):\n    queue = deque([(start, [start])])\n    visited = {start}\n    while queue:\n        node, path = queue.popleft()\n        if node == end: return path\n        for nb in graph[node]:\n            if nb not in visited:\n                visited.add(nb)\n                queue.append((nb, path+[nb]))" },
        { method:"DFS (Depth-First Search)", desc:"O(V+E). Used for cycle detection, topological sort, connected components.", ex:"def dfs_iterative(graph, start):\n    visited = set()\n    stack = [start]\n    order = []\n    while stack:\n        node = stack.pop()\n        if node not in visited:\n            visited.add(node)\n            order.append(node)\n            stack.extend(reversed(graph[node]))\n    return order\n\n# Recursive DFS\ndef dfs_recursive(graph, node, visited=None):\n    if visited is None: visited = set()\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs_recursive(graph, neighbor, visited)\n    return visited" },
      ]},
      { name:"Dynamic Programming", items:[
        { method:"Memoization (top-down DP)", desc:"Recursive with caching. Start with recurrence, add cache.", ex:"from functools import lru_cache\n\n# Fibonacci with memoization\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2: return n\n    return fib(n-1) + fib(n-2)\n\n# Coin change (minimum coins)\ndef coin_change(coins, amount):\n    @lru_cache(maxsize=None)\n    def dp(rem):\n        if rem == 0: return 0\n        if rem < 0: return float('inf')\n        return 1 + min(dp(rem - c) for c in coins)\n    result = dp(amount)\n    return result if result != float('inf') else -1" },
        { method:"Tabulation (bottom-up DP)", desc:"Iterative DP. Build table from base cases up.", ex:"# Knapsack problem\ndef knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0]*(capacity+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for w in range(capacity+1):\n            dp[i][w] = dp[i-1][w]\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i][w],\n                    dp[i-1][w-weights[i-1]] + values[i-1])\n    return dp[n][capacity]\n\n# Longest Common Subsequence\ndef lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1]==s2[j-1]: dp[i][j]=dp[i-1][j-1]+1\n            else: dp[i][j]=max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]" },
      ]},
    ]
  },
];

/* ═══════════════════════════════════════════════════════════════════
   THEORY VIEW COMPONENT
═══════════════════════════════════════════════════════════════════ */
const TheoryView = () => {
  const [activeTopic, setActiveTopic] = useState(null);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState(null);

  const cats = [...new Set(THEORY_DATA.map(t=>t.cat))];
  const filtered = THEORY_DATA.filter(t =>
    !search ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.sections?.some(s => s.items?.some(i =>
      i.method.toLowerCase().includes(search.toLowerCase()) ||
      i.desc.toLowerCase().includes(search.toLowerCase())
    ))
  );

  const topic = THEORY_DATA.find(t=>t.id===activeTopic);

  return (
    <div className="fade-up" style={{ padding:"clamp(12px,4vw,28px)" }}>
      <div className="syne" style={{ fontSize:"clamp(18px,4vw,24px)", fontWeight:800, color:T.t1, marginBottom:4 }}>📖 Python Theory Reference</div>
      <p style={{ fontSize:13, color:T.t2, marginBottom:14 }}>Complete Python reference: every method, syntax, and concept — with examples</p>

      {/* Search */}
      <input className="inp" value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="🔍 Search methods, topics, concepts..." style={{ marginBottom:14 }} />

      {activeTopic && topic ? (
        /* ── Single topic deep-dive ────────────────────────────── */
        <div>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom:14 }} onClick={()=>{ setActiveTopic(null); setActiveSection(null); }}>
            ← Back to all topics
          </button>

          <div style={{ background:T.card, border:`1px solid ${T.blue}40`, borderRadius:14, padding:"18px 20px", marginBottom:14 }}>
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:32 }}>{topic.emoji}</span>
              <div>
                <div className="syne" style={{ fontSize:20, fontWeight:800, color:T.t1 }}>{topic.title}</div>
                <div style={{ fontSize:12, color:T.blue }}>{topic.cat}</div>
              </div>
            </div>
            <p style={{ fontSize:13, color:T.t2, lineHeight:1.7 }}>{topic.intro}</p>
          </div>

          {/* Section tabs */}
          <div className="tab-row" style={{ marginBottom:14 }}>
            {topic.sections.map(s => (
              <button key={s.name} className={`tab-b ${activeSection===s.name||(!activeSection&&topic.sections[0].name===s.name)?"on":""}`}
                onClick={()=>setActiveSection(s.name)}
                style={activeSection===s.name||(!activeSection&&topic.sections[0].name===s.name)?{color:T.blue,background:T.blue+"18"}:{}}>
                {s.name}
              </button>
            ))}
          </div>

          {/* Method cards */}
          {(() => {
            const sec = topic.sections.find(s=>s.name===(activeSection||topic.sections[0].name));
            return (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {sec?.items.map((item, i) => (
                  <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
                    <div style={{ padding:"14px 16px 10px", borderBottom:`1px solid ${T.border}` }}>
                      <div style={{ display:"flex", gap:10, alignItems:"flex-start", flexWrap:"wrap" }}>
                        <code className="mono" style={{
                          fontSize:13, fontWeight:700, color:T.blue,
                          background:T.blue+"12", padding:"3px 10px", borderRadius:6,
                          border:`1px solid ${T.blue}30`, flexShrink:0
                        }}>{item.method}</code>
                        <p style={{ fontSize:13, color:T.t2, lineHeight:1.5, flex:1 }}>{item.desc}</p>
                      </div>
                    </div>
                    <div className="code" style={{ borderRadius:0, borderTop:"none", borderLeft:"none", borderRight:"none" }}>
                      {item.ex}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      ) : (
        /* ── Topic grid ────────────────────────────────────────── */
        <div>
          {cats.map(cat => {
            const topicsInCat = filtered.filter(t=>t.cat===cat);
            if (!topicsInCat.length) return null;
            return (
              <div key={cat} style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.t3, textTransform:"uppercase", letterSpacing:1.2, marginBottom:10 }}>
                  {cat}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,240px),1fr))", gap:8 }}>
                  {topicsInCat.map(t => {
                    const methodCount = t.sections?.reduce((a,s)=>a+s.items.length, 0) || 0;
                    return (
                      <div key={t.id} onClick={()=>{ setActiveTopic(t.id); setActiveSection(null); }}
                        style={{
                          background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px",
                          cursor:"pointer", transition:"all .2s"
                        }}
                        onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.blue+"60"; e.currentTarget.style.background="#0a0a24"; }}
                        onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background=T.card; }}>
                        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                          <span style={{ fontSize:22 }}>{t.emoji}</span>
                          <div>
                            <div className="syne" style={{ fontSize:14, fontWeight:700, color:T.t1 }}>{t.title}</div>
                            <div style={{ fontSize:10, color:T.t2 }}>{methodCount} methods / concepts</div>
                          </div>
                        </div>
                        <p style={{ fontSize:12, color:T.t2, lineHeight:1.5, marginBottom:8 }}>
                          {t.intro.slice(0, 90)}...
                        </p>
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                          {t.sections?.slice(0,3).map(s=>(
                            <span key={s.name} style={{ fontSize:10, color:T.blue, background:T.blue+"12", padding:"2px 8px", borderRadius:999, border:`1px solid ${T.blue}30` }}>
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:40, color:T.t3, fontSize:14 }}>
              No topics match "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};


/* ─────────────────────────── MAIN APP ─────────────────────────── */
export default function PythonMasteryApp() {
  const [tab, setTab] = useState("roadmap");
  const [topicProgress, saveTopicProgress, loaded] = useStorage("py-topics-v1", {});

  // XP: each completed topic = 20 XP
  const totalTopics = PYTHON_MONTHS.flatMap(m => m.weeks).flatMap(w => w.topics).length;
  const solvedTopics = Object.values(topicProgress).filter(Boolean).length;
  const totalXP = solvedTopics * 20;

  const allPythonDone = PYTHON_MONTHS.every(m =>
    m.weeks.every(w =>
      w.topics.filter((_, j) => topicProgress[`m${w.n}-t${j}`]).length >= MIN_PER_WEEK
    )
  );

  const monthsDone = PYTHON_MONTHS.filter(m =>
    m.weeks.every(w =>
      w.topics.filter((_, j) => topicProgress[`m${w.n}-t${j}`]).length >= MIN_PER_WEEK
    )
  ).length;

  if (!loaded) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:T.bg }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }} className="float">🐍</div>
        <div style={{ fontSize:14, color:T.t2 }}>Loading Python Mastery...</div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <style>{CSS}</style>
      <Header totalXP={totalXP} solvedTopics={solvedTopics} monthsDone={monthsDone} />
      <div className="wrap">
        <Sidebar tab={tab} setTab={setTab} topicsDone={solvedTopics} totalTopics={totalTopics} />
        <div className="main">
          {tab === "roadmap" && (
            <RoadmapView topicProgress={topicProgress} saveTopicProgress={saveTopicProgress} />
          )}
          {tab === "tracker" && (
            <TrackerView topicProgress={topicProgress} />
          )}
          {tab === "theory" && (
            <TheoryView />
          )}
          {tab === "projects" && (
            <ProjectsView />
          )}
          {tab === "practice" && (
            <PracticeView />
          )}
          {tab === "ml" && (
            <MLPathView allPythonDone={allPythonDone} />
          )}
        </div>
      </div>
      <MobileNav tab={tab} setTab={setTab} />
    </div>
  );
}
