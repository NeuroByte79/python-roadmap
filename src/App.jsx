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
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: `Generate exactly 100 Python interview/practice questions for this specific topic:

Topic: "${topicText}"
Week context: "${weekTitle}"

These should be real technical interview questions from Google, OpenAI, Anthropic, Meta, Microsoft style.

Return ONLY valid JSON — no other text, no markdown fences:
{
  "easy": [
    {"q": "question text", "co": "Google"},
    ... (25 questions)
  ],
  "medium": [
    {"q": "question text", "co": "OpenAI"},
    ... (30 questions)  
  ],
  "hard": [
    {"q": "question text", "co": "Anthropic"},
    ... (30 questions)
  ],
  "vhard": [
    {"q": "question text", "co": "Meta"},
    ... (15 questions)
  ]
}

Easy: conceptual, definitions, basic syntax. 
Medium: write code, explain behavior, debug snippets.
Hard: design problems, optimization, edge cases, real-world systems.
Very Hard: open-ended system design, research-level, architecture decisions.
Rotate companies: Google, OpenAI, Anthropic, Meta, Microsoft across all questions.`
      }]
    })
  });
  const data = await res.json();
  const text = data.content.map(c => c.text || "").join("").trim();
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
const TopicPanel = ({ topic, topicIdx, weekN, monthColor, done, onToggle, weekTitle }) => {
  const storKey = `q-${weekN}-${topicIdx}`;
  const [questions, saveQuestions] = useStorage(storKey, null);
  const [loading, setLoading] = useState(false);
  const [qDiff, setQDiff] = useState("easy");
  const [open, setOpen] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const q = await generateQuestions(topic, weekTitle);
      await saveQuestions(q);
    } catch (e) {
      alert("Generation failed. Check your connection.");
    }
    setLoading(false);
  };

  const diffConfig = [
    { k:"easy",  label:"🟢 Easy",     cls:"b-easy",  count:25 },
    { k:"medium",label:"🟡 Medium",   cls:"b-med",   count:30 },
    { k:"hard",  label:"🔴 Hard",     cls:"b-hard",  count:30 },
    { k:"vhard", label:"🟣 Very Hard",cls:"b-vhard", count:15 },
  ];

  const displayed = questions?.[qDiff] || [];

  return (
    <div className={`topic-row ${done ? "done" : ""}`} style={{ flexDirection:"column", cursor:"default" }}>
      {/* Top row: checkbox + topic text + expand */}
      <div style={{ display:"flex", gap:12, alignItems:"flex-start", width:"100%" }}>
        <div onClick={() => onToggle(`m${weekN}-t${topicIdx}`)}
          style={{
            width:22, height:22, borderRadius:6, flexShrink:0, marginTop:1, cursor:"pointer",
            background: done ? T.green : "transparent",
            border:`2px solid ${done ? T.green : T.t2}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, color:"#000", fontWeight:900, transition:"all .2s"
          }}>{done ? "✓" : ""}</div>

        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color: done ? T.t1 : T.t2, lineHeight:1.5 }}>
            {topic}
          </div>
          {done && <span style={{ fontSize:10, color:T.green }}>✅ Completed</span>}
        </div>

        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(!open)}
          style={{ flexShrink:0, fontSize:11 }}>
          {open ? "▲ Hide" : "📚 100 Questions"}
        </button>
      </div>

      {/* Expanded: 100 questions panel */}
      {open && (
        <div className="fade-in" style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}`, width:"100%" }}>
          {/* Generate button */}
          <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:12, color:T.t2, flex:1 }}>
              {questions ? `✅ ${Object.values(questions).flat().length} questions loaded` : "No questions yet — generate them!"}
            </span>
            <button className={`btn ${questions ? "btn-ghost" : "btn-py"} btn-sm`}
              onClick={generate} disabled={loading}>
              {loading ? <><Spin /> Generating 100 Qs...</> : questions ? "🔄 Regenerate" : "✨ Generate 100 Questions"}
            </button>
          </div>

          {questions && (
            <>
              {/* Difficulty tabs */}
              <div style={{ display:"flex", gap:4, marginBottom:12, flexWrap:"wrap" }}>
                {diffConfig.map(d => (
                  <button key={d.k}
                    onClick={() => setQDiff(d.k)}
                    className="btn btn-sm"
                    style={{
                      background: qDiff === d.k ? monthColor+"30" : "transparent",
                      border:`1px solid ${qDiff === d.k ? monthColor : T.border}`,
                      color: qDiff === d.k ? monthColor : T.t2,
                      fontFamily:"'DM Sans',sans-serif"
                    }}>
                    {d.label} ({questions[d.k]?.length || 0})
                  </button>
                ))}
              </div>

              {/* Questions list */}
              <div style={{ maxHeight:360, overflowY:"auto", paddingRight:4 }}>
                {displayed.map((q, i) => (
                  <div key={i} className="q-row">
                    <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                      <span className="mono" style={{
                        fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:5, flexShrink:0,
                        background: qDiff==="easy"?"#021a09":qDiff==="medium"?"#180d00":qDiff==="hard"?"#1a0404":"#120525",
                        color: qDiff==="easy"?T.green:qDiff==="medium"?T.amber:qDiff==="hard"?"#f87171":"#c084fc",
                        border:`1px solid ${qDiff==="easy"?"#14532d":qDiff==="medium"?"#7c3800":qDiff==="hard"?"#7f1d1d":"#6b21a8"}`
                      }}>Q{i+1}</span>
                      <p style={{ fontSize:13, color:T.t1, lineHeight:1.6, flex:1 }}>{q.q}</p>
                      <span className={`badge ${qDiff==="easy"?"b-easy":qDiff==="medium"?"b-med":qDiff==="hard"?"b-hard":"b-vhard"}`}
                        style={{ flexShrink:0, fontSize:10 }}>{q.co}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
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

const TrackerView = ({ topicProgress }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [logs, saveLogs] = useStorage("tracker-logs-v1", {});
  const [editDay, setEditDay] = useState(null);
  const [form, setForm] = useState({ hours:"1", topics:"", notes:"", git:false, mood:3 });
  const [view, setView] = useState("week");

  const weekStart = getWeekKey(weekOffset);
  const days = DAYS_OF_WEEK.map((_,i)=>getDateKey(weekStart,i));
  const today = todayKey();

  const saveDay = () => { saveLogs(prev=>({...prev,[editDay]:{...form,date:editDay}})); setEditDay(null); };
  const openEdit = (key) => { setEditDay(key); setForm(logs[key]||{hours:"1",topics:"",notes:"",git:false,mood:3}); };

  const totalDaysLogged = Object.keys(logs).length;
  const totalHours = Object.values(logs).reduce((a,l)=>a+parseFloat(l.hours||0),0);
  const gitPushes = Object.values(logs).filter(l=>l.git).length;
  const streak = (()=>{ let s=0,d=new Date(); while(true){const k=d.toISOString().slice(0,10); if(!logs[k])break; s++;d.setDate(d.getDate()-1);} return s; })();

  const heatDays = Array.from({length:84},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-83+i); return d.toISOString().slice(0,10); });

  return (
    <div className="fade-up" style={{padding:"clamp(12px,4vw,28px)"}}>
      <div className="syne" style={{fontSize:"clamp(18px,4vw,24px)",fontWeight:800,color:T.t1,marginBottom:4}}>📅 Progress Tracker</div>
      <p style={{fontSize:13,color:T.t2,marginBottom:18}}>Log daily study sessions, track streaks, and review monthly progress</p>

      <div className="g4" style={{marginBottom:18,gap:10}}>
        {[
          {icon:"🔥",val:streak,label:"Day Streak",c:"#f97316"},
          {icon:"⏱️",val:totalHours.toFixed(1)+"h",label:"Total Hours",c:T.blue},
          {icon:"📅",val:totalDaysLogged,label:"Days Logged",c:T.green},
          {icon:"📤",val:gitPushes,label:"Git Pushes",c:"#a855f7"},
        ].map(s=>(
          <div key={s.label} style={{background:T.card,border:`1px solid ${s.c}30`,borderRadius:12,padding:"12px 14px",textAlign:"center",boxShadow:`0 0 12px ${s.c}12`}}>
            <div style={{fontSize:20}}>{s.icon}</div>
            <div className="syne" style={{fontSize:22,fontWeight:800,color:s.c,lineHeight:1.1}}>{s.val}</div>
            <div style={{fontSize:11,color:T.t2}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-row" style={{marginBottom:16}}>
        {[{id:"week",l:"📆 This Week"},{id:"month",l:"🔥 Heatmap"},{id:"stats",l:"📊 Monthly Report"}].map(t=>(
          <button key={t.id} className={`tab-b ${view===t.id?"on":""}`} onClick={()=>setView(t.id)}
            style={view===t.id?{color:T.blue,background:T.blue+"18"}:{}}>{t.l}</button>
        ))}
      </div>

      {view==="week" && (
        <div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>setWeekOffset(w=>w-1)}>← Prev</button>
            <div style={{flex:1,textAlign:"center",fontSize:13,fontWeight:700,color:T.t1}}>
              Week of {formatDate(days[0])} — {formatDate(days[6])}
              {weekOffset===0&&<span style={{fontSize:11,color:T.green,marginLeft:8}}>● Current</span>}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={()=>setWeekOffset(w=>Math.min(0,w+1))} disabled={weekOffset===0}>Next →</button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,160px),1fr))",gap:10}}>
            {days.map((dk,i)=>{
              const log=logs[dk]; const isToday=dk===today; const dayDone=!!log?.topics?.trim();
              return (
                <div key={dk} onClick={()=>openEdit(dk)} style={{
                  background:dayDone?"#021508":isToday?"#07071e":T.card,
                  border:`1px solid ${dayDone?T.green+"60":isToday?T.blue+"60":T.border}`,
                  borderRadius:12,padding:"13px 13px",cursor:"pointer",transition:"all .2s",
                  boxShadow:isToday?`0 0 14px ${T.blue}20`:dayDone?`0 0 12px ${T.green}18`:"none"
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:isToday?T.blue:T.t2}}>{DAYS_OF_WEEK[i]}</div>
                      <div style={{fontSize:13,fontWeight:800,color:T.t1}}>{formatDate(dk)}</div>
                    </div>
                    <div style={{fontSize:18}}>{dayDone?(MOOD_EMOJIS[parseInt(log.mood||3)-1]||"😊"):isToday?"📝":"○"}</div>
                  </div>
                  {log?(
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:T.green}}>⏱ {log.hours}h</div>
                      {log.topics&&<div style={{fontSize:11,color:T.t2,marginTop:3,lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{log.topics}</div>}
                      {log.git&&<div style={{fontSize:10,color:"#a855f7",marginTop:4}}>📤 Git pushed</div>}
                    </div>
                  ):(
                    <div style={{fontSize:11,color:T.t3,marginTop:4}}>{isToday?"Tap to log today":"Click to log"}</div>
                  )}
                  {isToday&&!log&&<div style={{marginTop:6,fontSize:10,fontWeight:700,color:T.blue,background:T.blue+"15",padding:"3px 8px",borderRadius:999,display:"inline-block",border:`1px solid ${T.blue}40`}}>Today</div>}
                </div>
              );
            })}
          </div>

          {days.some(d=>logs[d])&&(
            <div style={{marginTop:14,padding:"14px 18px",background:T.surf,border:`1px solid ${T.border}`,borderRadius:12}}>
              <div style={{fontSize:12,fontWeight:700,color:T.t2,marginBottom:8}}>Week Summary</div>
              <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                <span style={{fontSize:13,color:T.t1}}>⏱ {days.reduce((a,d)=>a+parseFloat(logs[d]?.hours||0),0).toFixed(1)}h studied</span>
                <span style={{fontSize:13,color:T.t1}}>📅 {days.filter(d=>logs[d]?.topics?.trim()).length}/7 active days</span>
                <span style={{fontSize:13,color:"#a855f7"}}>📤 {days.filter(d=>logs[d]?.git).length} git pushes</span>
              </div>
            </div>
          )}
        </div>
      )}

      {view==="month" && (
        <div>
          <div style={{fontSize:12,color:T.t2,marginBottom:12}}>Last 84 days — darker green = more study hours</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(14,1fr)",gap:4,marginBottom:12}}>
            {heatDays.map(dk=>{
              const log=logs[dk]; const h=parseFloat(log?.hours||0); const isToday=dk===today;
              const intensity=h===0?0:h<1?1:h<2?2:h<3?3:4;
              const colors=["#070720","#0d2a18","#0d4a2a","#0d7040","#10b981"];
              return <div key={dk} onClick={()=>openEdit(dk)} title={`${formatDate(dk)}: ${h}h`} style={{width:"100%",paddingBottom:"100%",borderRadius:3,cursor:"pointer",background:colors[intensity],border:isToday?`1px solid ${T.blue}`:"1px solid transparent"}}/>;
            })}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",fontSize:11,color:T.t2}}>
            <span>Less</span>
            {["#070720","#0d2a18","#0d4a2a","#0d7040","#10b981"].map(c=><div key={c} style={{width:14,height:14,borderRadius:3,background:c,border:`1px solid ${T.border}`}}/>)}
            <span>More</span>
          </div>
        </div>
      )}

      {view==="stats" && (
        <div className="g2" style={{gap:12}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 18px"}}>
            <div style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:14}}>📊 Hours per Week (last 8 weeks)</div>
            {Array.from({length:8},(_,i)=>{
              const ws=getWeekKey(-7+i);
              const wdays=DAYS_OF_WEEK.map((_,j)=>getDateKey(ws,j));
              const hrs=wdays.reduce((a,d)=>a+parseFloat(logs[d]?.hours||0),0);
              return (
                <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                  <div style={{fontSize:10,color:T.t2,width:46,flexShrink:0}}>{formatDate(ws)}</div>
                  <div style={{flex:1,height:14,background:"#06062a",borderRadius:999,overflow:"hidden"}}>
                    <div style={{width:`${Math.min(100,(hrs/40)*100)}%`,height:"100%",background:`linear-gradient(90deg,${T.blue},${T.green})`,borderRadius:999,transition:"width .7s ease"}}/>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:T.blue,width:32,textAlign:"right"}}>{hrs.toFixed(1)}h</div>
                </div>
              );
            })}
          </div>

          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 18px"}}>
            <div style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:14}}>📝 Recent Sessions</div>
            <div style={{maxHeight:300,overflowY:"auto",display:"flex",flexDirection:"column",gap:7}}>
              {Object.entries(logs).sort(([a],[b])=>b.localeCompare(a)).slice(0,12).map(([dk,log])=>(
                <div key={dk} style={{padding:"9px 12px",background:T.surf,borderRadius:9,border:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:12,fontWeight:700,color:T.t1}}>{formatDate(dk)}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:14}}>{MOOD_EMOJIS[parseInt(log.mood||3)-1]||"😊"}</span>
                      <span style={{fontSize:11,fontWeight:700,color:T.green}}>{log.hours}h</span>
                      {log.git&&<span style={{fontSize:10,color:"#a855f7"}}>📤</span>}
                    </div>
                  </div>
                  {log.topics&&<div style={{fontSize:11,color:T.t2,lineHeight:1.4}}>{log.topics}</div>}
                  {log.notes&&<div style={{fontSize:11,color:T.t3,marginTop:3,fontStyle:"italic"}}>{log.notes}</div>}
                </div>
              ))}
              {Object.keys(logs).length===0&&<div style={{textAlign:"center",padding:20,color:T.t3,fontSize:13}}>No sessions yet. Start by logging today!</div>}
            </div>
          </div>
        </div>
      )}

      {editDay&&(
        <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>{if(e.target===e.currentTarget)setEditDay(null);}}>
          <div style={{background:"#08082a",border:`1px solid ${T.blue}60`,borderRadius:16,padding:24,width:"min(100%,460px)",maxHeight:"90vh",overflowY:"auto",boxShadow:`0 0 40px ${T.blue}20`}}>
            <div className="syne" style={{fontSize:17,fontWeight:800,color:T.t1,marginBottom:4}}>Log Study Session</div>
            <div style={{fontSize:12,color:T.t2,marginBottom:18}}>{formatDate(editDay)}{editDay===today?" · Today":""}</div>

            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:T.t2,marginBottom:6}}>⏱ Hours Studied</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["0.5","1","1.5","2","3","4","5","6+"].map(h=>(
                  <button key={h} onClick={()=>setForm(f=>({...f,hours:h}))} className="btn btn-sm"
                    style={{background:form.hours===h?T.blue+"40":T.surf,border:`1px solid ${form.hours===h?T.blue:T.border}`,color:form.hours===h?T.blue:T.t2,fontFamily:"'DM Sans',sans-serif"}}>{h}h</button>
                ))}
              </div>
            </div>

            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:T.t2,marginBottom:6}}>😊 Energy Level</div>
              <div style={{display:"flex",gap:8}}>
                {[1,2,3,4,5].map(m=>(
                  <button key={m} onClick={()=>setForm(f=>({...f,mood:m}))} style={{fontSize:24,background:"none",border:`2px solid ${form.mood===m?T.amber:"transparent"}`,borderRadius:8,cursor:"pointer",padding:4}}>{MOOD_EMOJIS[m-1]}</button>
                ))}
              </div>
            </div>

            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:T.t2,marginBottom:6}}>📚 Topics Covered</div>
              <textarea className="inp" rows={2} placeholder="e.g. Decorators, list comprehensions, wrote 2 functions..." value={form.topics} onChange={e=>setForm(f=>({...f,topics:e.target.value}))} />
            </div>

            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:T.t2,marginBottom:6}}>📝 Notes / Blockers</div>
              <textarea className="inp" rows={2} placeholder="What was hard? What clicked?" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
            </div>

            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:18}}>
              <div onClick={()=>setForm(f=>({...f,git:!f.git}))} style={{width:36,height:20,borderRadius:999,background:form.git?"#a855f7":"#1a1a48",cursor:"pointer",position:"relative",transition:"background .2s"}}>
                <div style={{width:16,height:16,borderRadius:999,background:"#fff",position:"absolute",top:2,left:form.git?18:2,transition:"left .2s"}}/>
              </div>
              <span style={{fontSize:13,color:form.git?"#a855f7":T.t2,fontWeight:600}}>📤 Pushed to GitHub today</span>
            </div>

            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button className="btn btn-py" style={{flex:1}} onClick={saveDay}>💾 Save Session</button>
              <button className="btn btn-ghost" onClick={()=>setEditDay(null)}>Cancel</button>
              {logs[editDay]&&<button className="btn" style={{background:"#1a0404",border:"1px solid #7f1d1d",color:"#fca5a5"}} onClick={()=>{saveLogs(p=>{const n={...p};delete n[editDay];return n});setEditDay(null);}}>Delete</button>}
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
    method:"POST", headers:{"Content-Type":"application/json"},
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
    method:"POST", headers:{"Content-Type":"application/json"},
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
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:`Generate a Python project idea:
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
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:`Python interview question:
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
