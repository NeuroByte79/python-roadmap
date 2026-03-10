import { useState, useEffect, useRef, useCallback } from "react";

/* ===================================================================
   GLOBAL CSS — Futuristic Neon-Cyber Dark Theme
=================================================================== */
const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#050510;overflow-x:hidden}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#08081a}
::-webkit-scrollbar-thumb{background:#1e1e48;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#2e2e68}
.app{font-family:'Outfit',sans-serif;background:#050510;min-height:100vh;color:#eeeef8}
.mono{font-family:'JetBrains Mono',monospace}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 10px var(--gc,#8b5cf640)}50%{box-shadow:0 0 28px var(--gc,#8b5cf640)}}
@keyframes barGrow{from{width:0}to{width:var(--w)}}
@keyframes xpPop{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}
@keyframes borderGlow{0%,100%{border-color:#1e1e48}50%{border-color:#8b5cf660}}
.fade-up{animation:fadeUp .4s ease both}
.fade-in{animation:fadeIn .3s ease both}
.float{animation:float 3.5s ease-in-out infinite}
.pulse{animation:pulse 2.2s ease-in-out infinite}
.spin{animation:spin .75s linear infinite;display:inline-block}

/* Layout */
.layout{display:flex;min-height:100vh}
.sidebar{width:228px;flex-shrink:0;background:#06061a;border-right:1px solid #121234;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
.main-content{flex:1;overflow-x:hidden;min-width:0}
@media(max-width:820px){.sidebar{display:none}.mob-nav{display:flex!important}}
.mob-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#06061a;border-top:1px solid #121234;z-index:100;padding:6px 4px;justify-content:space-around}

/* Cards */
.card{background:#0b0b22;border:1px solid #161640;border-radius:14px;transition:border-color .2s,transform .15s}
.card:hover{border-color:#28286a}
.card-glow{box-shadow:0 0 0 1px #8b5cf620,0 6px 28px #8b5cf610}
.card-glow-cyan{box-shadow:0 0 0 1px #00d4ff20,0 6px 28px #00d4ff10}
.card-glow-green{box-shadow:0 0 0 1px #10b98120,0 6px 28px #10b98110}

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-family:'Outfit',sans-serif;font-weight:600;font-size:13px;transition:all .2s;user-select:none;white-space:nowrap}
.btn-primary{background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;box-shadow:0 0 18px #8b5cf630}
.btn-primary:hover{background:linear-gradient(135deg,#8b50f5,#7c3aed);box-shadow:0 0 28px #8b5cf645;transform:translateY(-1px)}
.btn-cyan{background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;box-shadow:0 0 18px #00d4ff30}
.btn-cyan:hover{background:linear-gradient(135deg,#0ea5e9,#0284c7);transform:translateY(-1px)}
.btn-ghost{background:transparent;border:1px solid #1e1e48;color:#6464a0}
.btn-ghost:hover{background:#0e0e2c;color:#eeeef8;border-color:#2e2e68}
.btn-success{background:#031a0c;border:1px solid #14532d;color:#4ade80}
.btn-success:hover{background:#062514}
.btn-danger{background:#1a0308;border:1px solid #7f1d1d;color:#fca5a5}
.btn-amber{background:linear-gradient(135deg,#d97706,#b45309);color:#fff}
.btn-amber:hover{background:linear-gradient(135deg,#f59e0b,#d97706);transform:translateY(-1px)}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;box-shadow:none!important}

/* Inputs */
.inp{width:100%;background:#06061e;border:1px solid #141440;border-radius:8px;padding:10px 14px;color:#eeeef8;font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s}
.inp:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px #8b5cf618}
.inp::placeholder{color:#28284a}
textarea.inp{resize:vertical;min-height:80px;line-height:1.6}

/* Tabs */
.tab-bar{display:flex;gap:3px;overflow-x:auto;scrollbar-width:none;padding:2px}
.tab-bar::-webkit-scrollbar{display:none}
.tab-btn{flex-shrink:0;padding:8px 14px;border-radius:8px;border:none;background:transparent;color:#40407a;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;transition:all .2s;white-space:nowrap}
.tab-btn.active{background:#0f0f34;color:#eeeef8}
.tab-btn:hover:not(.active){color:#7878a8;background:#0a0a28}

/* Badges */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;border:1px solid}
.easy{color:#4ade80;background:#031b0e;border-color:#14532d}
.medium{color:#fbbf24;background:#1f1200;border-color:#92400e}
.hard{color:#f87171;background:#1f0606;border-color:#991b1b}
.co-google{color:#4285f4;background:#030f22;border-color:#1e3a6e}
.co-openai{color:#19c37d;background:#020d08;border-color:#065f46}
.co-anthropic{color:#cf9c6e;background:#120a02;border-color:#44280a}
.co-meta{color:#0ea5e9;background:#020c18;border-color:#0c4a6e}

/* Progress */
.prog-track{height:5px;background:#0c0c2a;border-radius:999px;overflow:hidden}
.prog-fill{height:100%;border-radius:999px;transition:width .8s cubic-bezier(.4,0,.2,1)}

/* Nav items */
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;border-radius:8px;margin:1px 8px;font-size:13px;font-weight:500;color:#40407a;transition:all .2s;border:1px solid transparent;position:relative}
.nav-item:hover{color:#7878a8;background:#0c0c2c}
.nav-item.active{color:#eeeef8;background:#0f0f34;border-color:#20205a}
.nav-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:linear-gradient(180deg,#8b5cf6,#00d4ff);border-radius:2px}

/* Question cards */
.q-card{background:#08082a;border:1px solid #141440;border-radius:10px;padding:14px 16px;transition:all .2s;cursor:pointer}
.q-card:hover{border-color:#28286a;background:#0c0c34}

/* Challenge card */
.ch-card{background:#08082a;border:1px solid #141440;border-radius:12px;padding:16px 18px;transition:all .25s}
.ch-card:hover{border-color:#2e2e70;background:#0c0c34;transform:translateY(-1px)}
.ch-card.solved{opacity:.55;border-color:#14532d;background:#020d06}

/* Upload zone */
.upload-zone{border:2px dashed #1a1a48;border-radius:12px;padding:32px;text-align:center;cursor:pointer;transition:all .25s}
.upload-zone:hover,.upload-zone.drag{border-color:#8b5cf6;background:#8b5cf60e}

/* Section headings */
.sec-h{font-size:clamp(18px,3vw,24px);font-weight:800;color:#eeeef8;margin-bottom:4px}
.sec-sub{font-size:13px;color:#40407a}

/* Grids */
.g2{display:grid;grid-template-columns:1fr;gap:12px}
@media(min-width:600px){.g2{grid-template-columns:1fr 1fr}}
.g3{display:grid;grid-template-columns:1fr;gap:12px}
@media(min-width:700px){.g3{grid-template-columns:1fr 1fr}}
@media(min-width:1100px){.g3{grid-template-columns:1fr 1fr 1fr}}
.g4{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
@media(min-width:900px){.g4{grid-template-columns:repeat(4,1fr)}}

/* Code block */
.code-block{background:#03030e;border:1px solid #141440;border-radius:10px;padding:14px 16px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#8888c8;overflow-x:auto;white-space:pre;line-height:1.7}

/* Review section */
.rev-sec{background:#06061e;border:1px solid #141440;border-radius:10px;padding:14px 18px;margin-bottom:10px}

/* Glow utilities */
.glow-purple{box-shadow:0 0 24px #8b5cf625}
.glow-cyan{box-shadow:0 0 24px #00d4ff25}
.glow-green{box-shadow:0 0 24px #10b98125}
.glow-amber{box-shadow:0 0 24px #f59e0b25}

/* Month pill */
.month-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid;cursor:pointer;transition:all .2s}

/* XP bar shimmer */
.xp-shimmer{background:linear-gradient(90deg,#8b5cf6,#00d4ff,#10b981,#8b5cf6);background-size:200% 100%;animation:shimmer 2.5s linear infinite}

/* Scrollable row */
.scroll-row{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px}
.scroll-row::-webkit-scrollbar{display:none}
`;

/* ===================================================================
   THEME
=================================================================== */
const T = {
  bg:"#050510", surface:"#06061a", card:"#0b0b22", cardHover:"#0f0f30",
  border:"#161640", borderHover:"#28286a",
  t1:"#eeeef8", t2:"#6464a0", t3:"#20204a",
  cyan:"#00d4ff", purple:"#8b5cf6", emerald:"#10b981",
  amber:"#f59e0b", red:"#ef4444", blue:"#3b82f6",
  pink:"#ec4899", orange:"#f97316",
};

const DIFF_STYLE = {
  Easy:    { bg:"#031b0e", border:"#14532d", text:"#4ade80", cls:"easy" },
  Medium:  { bg:"#1f1200", border:"#92400e", text:"#fbbf24", cls:"medium" },
  Hard:    { bg:"#1f0606", border:"#991b1b", text:"#f87171", cls:"hard" },
  Starter: { bg:"#031b0e", border:"#14532d", text:"#4ade80", cls:"easy" },
};

/* ===================================================================
   XP LEVEL SYSTEM
=================================================================== */
const XP_LEVELS = [
  { level:1, title:"Beginner",     min:0,    max:200,  color:"#6b7280", emoji:"🌱" },
  { level:2, title:"Apprentice",   min:200,  max:500,  color:"#3b82f6", emoji:"📘" },
  { level:3, title:"Practitioner", min:500,  max:1000, color:"#10b981", emoji:"⚡" },
  { level:4, title:"Developer",    min:1000, max:1800, color:"#f59e0b", emoji:"🔥" },
  { level:5, title:"Engineer",     min:1800, max:3000, color:"#a855f7", emoji:"🚀" },
  { level:6, title:"Architect",    min:3000, max:4500, color:"#ec4899", emoji:"🏆" },
  { level:7, title:"AI Master",    min:4500, max:99999,color:"#00d4ff", emoji:"🌌" },
];
const getLevel = (xp) => XP_LEVELS.find(l => xp >= l.min && xp < l.max) || XP_LEVELS[XP_LEVELS.length-1];

/* ===================================================================
   7-MONTH CURRICULUM
=================================================================== */
const CURRICULUM = [
  {
    id:1, emoji:"🐍", title:"Python Mastery", color:"#3b82f6",
    sub:"Core language, data structures & OOP",
    totalXP:500,
    weeks:[
      { n:1, title:"Dev Setup & Computer Basics", topics:["VS Code, Python, Git installation","Binary & hexadecimal systems","Terminal commands (cd,ls,mkdir)","Variables & data types","Running first Python scripts"] },
      { n:2, title:"Python Syntax & Variables",   topics:["Strings, ints, floats, booleans","f-strings & formatting","Type casting","String methods (.upper/.lower/.split)","Input/output & comments"] },
      { n:3, title:"Control Flow & Logic",        topics:["if/elif/else statements","Logical operators: and, or, not","Comparison operators","Nested conditions","Boolean logic & truth tables"] },
      { n:4, title:"Loops & Iteration",           topics:["for loops with range()","while loops & break/continue","enumerate() and zip()","Nested loops & patterns","Accumulator patterns"] },
    ],
    interviewQ:[
      { q:"What is the difference between a list and a tuple in Python?", co:"Google", diff:"Easy" },
      { q:"Explain Python's GIL and its impact on multi-threading.", co:"Anthropic", diff:"Hard" },
      { q:"Write a function to flatten a deeply nested list without imports.", co:"Meta", diff:"Medium" },
      { q:"What are Python generators? When would you prefer them over lists?", co:"OpenAI", diff:"Medium" },
      { q:"Explain the difference between == and 'is' in Python.", co:"Google", diff:"Easy" },
      { q:"Write a decorator that logs function execution time.", co:"Anthropic", diff:"Hard" },
    ],
    capstone:"CLI Task Manager with SQLite persistence, CRUD operations, and priority levels",
  },
  {
    id:2, emoji:"⚙️", title:"Advanced Python & Data", color:"#f97316",
    sub:"OOP, libraries, APIs & async",
    totalXP:600,
    weeks:[
      { n:5, title:"Functions & Functional Programming", topics:["*args & **kwargs","Lambda, map, filter, reduce","Closures & decorators","Generators & yield","functools module"] },
      { n:6, title:"OOP Deep Dive",                      topics:["Classes, inheritance, polymorphism","Magic/dunder methods","Abstract classes (ABC)","Properties & class methods","Design patterns intro"] },
      { n:7, title:"File I/O & Databases",               topics:["Reading/writing files","JSON & CSV handling","SQLite with sqlite3","Context managers","Robust error handling"] },
      { n:8, title:"NumPy, Pandas & APIs",               topics:["NumPy arrays & broadcasting","Pandas DataFrames & EDA","Data cleaning & missing values","requests library","REST API consumption"] },
    ],
    interviewQ:[
      { q:"What is the difference between @classmethod and @staticmethod?", co:"Google", diff:"Medium" },
      { q:"Explain Python's memory management and garbage collection.", co:"Anthropic", diff:"Hard" },
      { q:"Write a context manager class for timing code execution.", co:"Meta", diff:"Medium" },
      { q:"What is the difference between deep copy and shallow copy?", co:"OpenAI", diff:"Easy" },
      { q:"How does Pandas handle missing data? What are best practices?", co:"Google", diff:"Medium" },
      { q:"Design a simple event system using Python's built-in features.", co:"Anthropic", diff:"Hard" },
    ],
    capstone:"Data analysis pipeline: fetch from API → process with Pandas → visualize → save to SQLite",
  },
  {
    id:3, emoji:"🤖", title:"LLM Fundamentals", color:"#a855f7",
    sub:"Transformers, tokenization & prompt engineering",
    totalXP:700,
    weeks:[
      { n:9,  title:"How LLMs Work",           topics:["Transformer architecture overview","Attention mechanism intuition","Tokenization & vocabulary","Context windows & limits","Temperature, top-p & sampling"] },
      { n:10, title:"Prompt Engineering",       topics:["Zero-shot, few-shot, chain-of-thought","System prompts & personas","Role prompting techniques","Prompt injection & safety","Structured output prompting"] },
      { n:11, title:"LLM APIs & Integration",   topics:["OpenAI & Anthropic APIs","Streaming responses","Token counting & cost optimization","Retry logic & error handling","Building multi-turn chatbots"] },
      { n:12, title:"Embeddings & Search",      topics:["Vector embeddings concept","Cosine similarity from scratch","Semantic search implementation","Embedding models comparison","Use cases: search, recommendation"] },
    ],
    interviewQ:[
      { q:"Explain the attention mechanism. Why is self-attention O(n²)?", co:"OpenAI", diff:"Hard" },
      { q:"What is the difference between fine-tuning and prompt engineering?", co:"Anthropic", diff:"Medium" },
      { q:"How would you reduce hallucinations in an LLM application?", co:"Google", diff:"Medium" },
      { q:"What is tokenization? Why do some words split into multiple tokens?", co:"Meta", diff:"Easy" },
      { q:"Explain the trade-offs between different temperature values.", co:"OpenAI", diff:"Medium" },
      { q:"Design a prompt to reliably extract structured JSON from unstructured text.", co:"Anthropic", diff:"Hard" },
    ],
    capstone:"AI-powered document Q&A: upload PDF → extract text → semantic search → answer with LLM",
  },
  {
    id:4, emoji:"🧠", title:"AI Engineering", color:"#10b981",
    sub:"RAG, agents, tool use & evaluation",
    totalXP:750,
    weeks:[
      { n:13, title:"Retrieval-Augmented Generation", topics:["RAG architecture & components","Vector databases (Chroma, Pinecone)","Chunking strategies","Embedding + retrieval pipeline","RAG evaluation metrics"] },
      { n:14, title:"LLM Agents",                     topics:["Agent loop: perceive-reason-act","Tool calling & function use","ReAct pattern","Multi-step reasoning chains","Agent memory patterns"] },
      { n:15, title:"LangChain & LlamaIndex",         topics:["LangChain fundamentals","Chains & pipelines","Document loaders","Memory modules","Building production agents"] },
      { n:16, title:"Evaluation & Observability",     topics:["LLM eval frameworks","RAGAS for RAG evaluation","Logging & tracing (LangSmith)","Cost monitoring strategies","A/B testing LLM outputs"] },
    ],
    interviewQ:[
      { q:"What are the key components of a RAG system and how do they interact?", co:"Anthropic", diff:"Medium" },
      { q:"How do you evaluate the quality of a RAG pipeline? What metrics matter?", co:"Google", diff:"Hard" },
      { q:"Explain the ReAct prompting pattern. When would you use it?", co:"OpenAI", diff:"Medium" },
      { q:"What are the limitations of LLM agents in production?", co:"Meta", diff:"Hard" },
      { q:"How would you handle context window limits in a document chat app?", co:"Anthropic", diff:"Medium" },
      { q:"Design a tool-calling system where an LLM can query a database.", co:"Google", diff:"Hard" },
    ],
    capstone:"Full RAG agent: crawl website → build vector store → agent with web search + code tools",
  },
  {
    id:5, emoji:"🔬", title:"ML & Deep Learning", color:"#f59e0b",
    sub:"Scikit-learn, PyTorch & NLP",
    totalXP:800,
    weeks:[
      { n:17, title:"ML Foundations",            topics:["Supervised vs unsupervised learning","Train/val/test splits","Bias-variance tradeoff","Scikit-learn pipeline","Cross-validation strategies"] },
      { n:18, title:"Classical ML Algorithms",   topics:["Linear & logistic regression","Decision trees & random forests","SVM fundamentals","Gradient boosting (XGBoost)","Feature engineering techniques"] },
      { n:19, title:"Neural Networks & PyTorch", topics:["Perceptron & MLP architecture","Backpropagation intuition","PyTorch tensors & autograd","Training loop from scratch","CNNs for image classification"] },
      { n:20, title:"NLP & Fine-tuning",         topics:["Text preprocessing pipeline","TF-IDF vs embeddings","BERT fine-tuning with HuggingFace","Named entity recognition","Sentiment analysis project"] },
    ],
    interviewQ:[
      { q:"Explain the bias-variance tradeoff. How do you diagnose and fix each?", co:"Google", diff:"Medium" },
      { q:"What is gradient descent? Why do we use mini-batch instead of full batch?", co:"Meta", diff:"Medium" },
      { q:"How does backpropagation work? Walk me through the math.", co:"OpenAI", diff:"Hard" },
      { q:"When would you choose a random forest over a neural network?", co:"Anthropic", diff:"Medium" },
      { q:"What is dropout and batch normalization? Why do they help?", co:"Google", diff:"Hard" },
      { q:"How do you handle severe class imbalance in classification?", co:"Meta", diff:"Easy" },
    ],
    capstone:"End-to-end NLP classifier: fine-tune BERT on domain data, evaluate with custom metrics, deploy as API",
  },
  {
    id:6, emoji:"🚀", title:"Production AI Systems", color:"#ef4444",
    sub:"Deployment, safety & career prep",
    totalXP:900,
    weeks:[
      { n:21, title:"AI System Design",    topics:["Latency vs cost tradeoffs","LLM caching strategies","Async processing & queues","Rate limiting & throttling","Multi-model routing"] },
      { n:22, title:"Deployment & MLOps", topics:["Docker & containerization","FastAPI for ML serving","Model versioning (MLflow)","CI/CD for ML pipelines","Performance monitoring & drift"] },
      { n:23, title:"AI Safety & Ethics",  topics:["Prompt injection attacks","Content filtering strategies","Bias detection & mitigation","RLHF & Constitutional AI","Responsible AI principles"] },
      { n:24, title:"Fine-tuning & Career",topics:["When to fine-tune vs prompt","LoRA & PEFT methods","Building your AI portfolio","Technical interview prep","Open source contributions"] },
    ],
    interviewQ:[
      { q:"Design a production LLM system to handle 10,000 requests/second.", co:"Google", diff:"Hard" },
      { q:"Explain prompt injection attacks. How do you defend against them?", co:"Anthropic", diff:"Hard" },
      { q:"What is LoRA fine-tuning? When is it better than full fine-tuning?", co:"OpenAI", diff:"Medium" },
      { q:"How do you monitor model performance in production? What metrics?", co:"Meta", diff:"Medium" },
      { q:"Design a content moderation system for social media using LLMs.", co:"Google", diff:"Hard" },
      { q:"Walk me through your best AI project end-to-end.", co:"Anthropic", diff:"Medium" },
    ],
    capstone:"Production AI service: fine-tuned model + RAG + agent, deployed on cloud with monitoring",
  },
  {
    id:7, emoji:"🌌", title:"ML Transition & Capstone", color:"#6366f1",
    sub:"Advanced ML + graduation project",
    totalXP:1000,
    weeks:[
      { n:25, title:"Advanced ML & Research",  topics:["Reading & implementing ML papers","Transformer architecture deep dive","Diffusion models overview","Frontier models landscape","Contributing to open source"] },
      { n:26, title:"Capstone Project Sprint", topics:["Problem definition & research","System design document","Implementation & testing","Evaluation & iteration","Demo, deploy & open-source"] },
    ],
    interviewQ:[
      { q:"Explain the architecture of a large language model. What innovations matter?", co:"OpenAI", diff:"Hard" },
      { q:"What are the key differences between BERT and GPT architectures?", co:"Google", diff:"Hard" },
      { q:"How does RLHF (Reinforcement Learning from Human Feedback) work?", co:"Anthropic", diff:"Hard" },
      { q:"How do you stay current with ML research? Walk through your process.", co:"Meta", diff:"Easy" },
      { q:"What would you build if you had access to frontier model APIs and 30 days?", co:"Anthropic", diff:"Medium" },
    ],
    capstone:"Your signature AI project: novel application combining everything, deployed live, open-sourced",
  },
];

/* ===================================================================
   ALL CODING CHALLENGES (42 total, 6 per month)
=================================================================== */
const ALL_CHALLENGES = [
  // ── Month 1: Python Mastery ──
  { id:"m1c1", title:"FizzBuzz Advanced",       diff:"Easy",   xp:30,  month:1,
    desc:"Print 1–100. Multiples of 3→'Fizz', 5→'Buzz', 15→'FizzBuzz', 7→'Whizz'. Handle ALL combinations.",
    hint:"Check combined conditions first (e.g. 105=3×5×7). Use modulo % for each divisor." },
  { id:"m1c2", title:"Caesar Cipher",           diff:"Easy",   xp:40,  month:1,
    desc:"Encrypt & decrypt a string using Caesar cipher. Preserve case, skip non-alpha chars. Support any shift value.",
    hint:"Use ord()/chr(). Keep within a-z range: (ord(c)-65+shift)%26 + 65 for uppercase." },
  { id:"m1c3", title:"Number System Converter", diff:"Easy",   xp:35,  month:1,
    desc:"Convert numbers between binary, decimal, octal, and hex WITHOUT using bin()/hex()/oct(). Support fractions.",
    hint:"For dec→bin: repeatedly divide by 2, collect remainders. For fractions: multiply × 2." },
  { id:"m1c4", title:"Roman Numeral Converter", diff:"Medium", xp:65,  month:1,
    desc:"Convert integers (1–3999) to Roman numerals and back. Handle all subtractive forms (IV, IX, XL, etc.).",
    hint:"Use [(1000,'M'),(900,'CM'),...(1,'I')] pairs. Greedy subtraction for int→Roman." },
  { id:"m1c5", title:"Sorting Visualizer",      diff:"Medium", xp:75,  month:1,
    desc:"Implement bubble, selection & insertion sort. Count comparisons & swaps. Print array state after each step.",
    hint:"Nested loops for each. Track ops with a counter variable. Print array as bar chart using '#'." },
  { id:"m1c6", title:"Mini In-Memory Database", diff:"Hard",   xp:110, month:1,
    desc:"Build a simple in-memory database supporting INSERT, SELECT with WHERE (AND/OR), UPDATE, DELETE.",
    hint:"Store as list of dicts. Parse WHERE string manually. Support int/str type coercion in comparisons." },

  // ── Month 2: Advanced Python ──
  { id:"m2c1", title:"Decorator Stack",         diff:"Easy",   xp:45,  month:2,
    desc:"Write 3 decorators: @timer, @retry(n), and @memoize. Stack them. Show that order changes behavior.",
    hint:"@retry loops n times on exception. @memoize uses a dict cache. functools.wraps preserves signature." },
  { id:"m2c2", title:"Class Hierarchy Zoo",     diff:"Easy",   xp:50,  month:2,
    desc:"Build Animal→Mammal→Dog/Cat class hierarchy. Use abstract methods, properties, dunder methods. Make sortable by age.",
    hint:"from abc import ABC, abstractmethod. __lt__ for <. __repr__ for clean display. @property for computed attrs." },
  { id:"m2c3", title:"Async Web Scraper",       diff:"Medium", xp:85,  month:2,
    desc:"Use asyncio + aiohttp to fetch 10 URLs concurrently. Collect titles, status codes, and response times.",
    hint:"async def + await aiohttp.ClientSession(). asyncio.gather() for concurrent fetching. Try/except per URL." },
  { id:"m2c4", title:"Pandas Data Pipeline",   diff:"Medium", xp:90,  month:2,
    desc:"Load a messy CSV, clean nulls, normalize types, detect outliers via IQR, export clean data + stats report.",
    hint:"Chain .pipe() calls. IQR = Q3-Q1, outlier if <Q1-1.5*IQR. df.to_csv() + df.describe().to_json()." },
  { id:"m2c5", title:"Custom ORM",             diff:"Hard",   xp:125, month:2,
    desc:"Build a mini ORM over SQLite. Define models as classes. Support: User.where(age>18).order_by('name').limit(5).",
    hint:"Metaclass to register models. Build SQL from method chain (return self for chaining). sqlite3 for execution." },
  { id:"m2c6", title:"Plugin Architecture",    diff:"Hard",   xp:115, month:2,
    desc:"Design a plugin system: plugins are .py files in a folder, auto-discovered, registered by name, hot-reloadable.",
    hint:"importlib.import_module() for dynamic loading. importlib.reload() for hot reload. Registry as dict." },

  // ── Month 3: LLM Fundamentals ──
  { id:"m3c1", title:"Prompt Template Engine", diff:"Easy",   xp:55,  month:3,
    desc:"Build a prompt template system with {variables}, version history, A/B test tracking, and usage statistics.",
    hint:"str.format(**kwargs) for templates. Store versions in list. Dict for usage stats." },
  { id:"m3c2", title:"Token Counter & Optimizer",diff:"Easy", xp:50,  month:3,
    desc:"Build a token counter (using tiktoken) that estimates cost for GPT-3.5/4 and Claude. Show cost breakdown per message.",
    hint:"import tiktoken. cl100k_base encoding for GPT. Cost = token_count × price_per_token. Show a table." },
  { id:"m3c3", title:"Streaming Chatbot CLI",   diff:"Medium", xp:85, month:3,
    desc:"Terminal chatbot using Claude API with streaming output, full conversation history, system prompt, and /commands.",
    hint:"stream=True in API call. Append assistant message to history after each turn. /clear resets history." },
  { id:"m3c4", title:"Semantic Search Engine",  diff:"Medium", xp:95, month:3,
    desc:"Semantic search over 50+ text snippets: generate embeddings, store in numpy, search by cosine similarity, top-k results.",
    hint:"sentence-transformers or OpenAI embeddings. np.dot(a,b)/(norm(a)*norm(b)) for cosine. np.argsort for ranking." },
  { id:"m3c5", title:"Structured Data Extractor",diff:"Hard", xp:130, month:3,
    desc:"Reliably extract structured data from any text using LLMs. Handle validation, retries on invalid output, schema enforcement.",
    hint:"Pydantic schemas. Retry with corrective prompt on ValidationError. Include schema in system prompt." },
  { id:"m3c6", title:"Multi-Persona Chatbot",   diff:"Hard",  xp:135, month:3,
    desc:"Chatbot with 3 personas (teacher, code reviewer, debugger) that can hand off context between each other.",
    hint:"Separate system prompt per persona. Shared message history. Parse 'HANDOFF:persona' trigger in responses." },

  // ── Month 4: AI Engineering ──
  { id:"m4c1", title:"Basic RAG System",        diff:"Easy",  xp:70,  month:4,
    desc:"Load a PDF, chunk it, embed with any model, store in dict, retrieve by similarity, answer questions with LLM.",
    hint:"PyPDF2 for PDF. Split by paragraph. Store {idx: (text, embedding)}. Retrieve top-3 for context." },
  { id:"m4c2", title:"Tool-Calling Agent",       diff:"Medium",xp:105, month:4,
    desc:"ReAct agent with 3 tools: web_search, calculator, and code_runner. Solve multi-step problems autonomously.",
    hint:"Define tools as JSON schema. Loop: LLM decides → call tool → return result. Max 5 iterations." },
  { id:"m4c3", title:"RAG Evaluation Harness",  diff:"Medium", xp:95, month:4,
    desc:"Evaluate a RAG pipeline: measure faithfulness, answer relevance, and context precision. Generate test QA dataset.",
    hint:"Create QA pairs from docs manually. Use second LLM as judge. Score 0-1 per metric. Average across questions." },
  { id:"m4c4", title:"Memory-Augmented Agent",  diff:"Hard",  xp:140, month:4,
    desc:"Agent with episodic memory: stores session summaries, retrieves relevant past context, uses it to improve responses.",
    hint:"Summarize past sessions with LLM. Embed summaries. Retrieve top-2 on each new query. Inject as context." },
  { id:"m4c5", title:"Multi-Agent Pipeline",    diff:"Hard",  xp:155, month:4,
    desc:"3-agent pipeline: Researcher → Analyst → Writer. Each specializes and builds on the previous agent's structured output.",
    hint:"Pass outputs as structured JSON between agents. Each agent has specialized system prompt and unique tools." },
  { id:"m4c6", title:"Hybrid Search RAG",       diff:"Hard",  xp:145, month:4,
    desc:"Combine BM25 (keyword) + vector search. Merge results with reciprocal rank fusion (RRF). Compare vs each alone.",
    hint:"rank_bm25 library. Chroma for vectors. RRF: score = Σ 1/(k+rank_i). k=60 is standard." },

  // ── Month 5: ML & Deep Learning ──
  { id:"m5c1", title:"Linear Regression from Scratch",diff:"Easy",xp:65, month:5,
    desc:"Implement linear regression with gradient descent in pure NumPy. Plot loss curve. Compare to sklearn's result.",
    hint:"Loss = MSE. Gradient = -(2/n)*X.T @ (y-Xw). Update: w -= lr*grad. Track loss every 100 steps." },
  { id:"m5c2", title:"Decision Tree from Scratch",diff:"Medium",xp:105, month:5,
    desc:"Implement decision tree classifier using gini impurity. No sklearn. Compare to sklearn's DecisionTreeClassifier.",
    hint:"Recursive splitting. Gini: 1-Σp². Best split: max info gain. Base cases: pure node or max depth." },
  { id:"m5c3", title:"Neural Net from Scratch", diff:"Hard",  xp:160, month:5,
    desc:"2-layer neural net in pure NumPy: forward pass, backprop, SGD. Train on XOR, then MNIST subset.",
    hint:"Linear→ReLU→Linear→Softmax. Backprop with chain rule. dW1 = X.T @ (dA1 * relu_grad). Small learning rate." },
  { id:"m5c4", title:"BERT Sentiment Classifier",diff:"Medium",xp:95, month:5,
    desc:"Fine-tune DistilBERT on custom sentiment dataset using HuggingFace Trainer API. Achieve >90% accuracy.",
    hint:"AutoTokenizer + AutoModelForSequenceClassification. TrainingArguments. Trainer.train(). evaluate()." },
  { id:"m5c5", title:"Feature Engineering Pipeline",diff:"Medium",xp:85, month:5,
    desc:"Robust sklearn pipeline: feature selection, categorical encoding, scaling, imputation for a messy tabular dataset.",
    hint:"ColumnTransformer for mixed types. SelectKBest(f_classif). StandardScaler. SimpleImputer. Pipeline chaining." },
  { id:"m5c6", title:"Mini AutoML System",      diff:"Hard",  xp:145, month:5,
    desc:"Try 5 models with different hyperparameters, select best by cross-validation, explain with SHAP values.",
    hint:"GridSearchCV per model. Best: max cv_score. SHAP: shap.TreeExplainer for trees, KernelExplainer for others." },

  // ── Month 6: Production AI ──
  { id:"m6c1", title:"FastAPI ML Service",      diff:"Easy",  xp:75,  month:6,
    desc:"Wrap a trained model in FastAPI: /predict endpoint, /health check, Pydantic validation, auto-swagger docs.",
    hint:"@app.post('/predict'). Load model at startup with lifespan context manager. BaseModel for request/response." },
  { id:"m6c2", title:"Docker ML Pipeline",      diff:"Medium",xp:105, month:6,
    desc:"Containerize ML service: multi-stage Docker build. Docker Compose: model server + Redis cache + nginx proxy.",
    hint:"FROM python:3.11-slim. Multi-stage: builder → runner. COPY requirements.txt first for caching." },
  { id:"m6c3", title:"Prompt Injection Defense",diff:"Medium",xp:115, month:6,
    desc:"Build a system that detects & blocks prompt injection attacks. Test against 20 known patterns. Measure false positive rate.",
    hint:"Hybrid classifier + rule-based. Train on injection examples dataset. Threshold tuning for false positive balance." },
  { id:"m6c4", title:"LLM Cost Router",         diff:"Hard",  xp:145, month:6,
    desc:"Auto-route queries to cheapest model meeting quality requirements. Benchmark cost vs quality tradeoff.",
    hint:"Complexity classifier (tiny model). Route: simple→Haiku, medium→Sonnet, complex→Opus. Log cost per request." },
  { id:"m6c5", title:"A/B Testing Framework",   diff:"Hard",  xp:135, month:6,
    desc:"A/B test LLM prompts: split traffic, collect ratings, compute statistical significance, auto-select winner.",
    hint:"Hash(user_id) for consistent routing. Wilson score for confidence. Chi-square test for significance at p<0.05." },
  { id:"m6c6", title:"Full MLOps Pipeline",     diff:"Hard",  xp:155, month:6,
    desc:"Complete MLOps: data versioning, model training, evaluation gates, staging, production deploy with rollback.",
    hint:"DVC for data. MLflow for experiments. GitHub Actions for CI/CD. Blue-green deployment with health checks." },

  // ── Month 7: Capstone ──
  { id:"m7c1", title:"Implement an ML Paper",   diff:"Hard",  xp:200, month:7,
    desc:"Pick a recent arXiv paper (last 6 months). Implement the key algorithm from scratch. Write a blog post explaining it.",
    hint:"Start with papers that have clear pseudocode. Test on toy dataset first. Papers With Code is a great resource." },
  { id:"m7c2", title:"Capstone AI Product",     diff:"Hard",  xp:300, month:7,
    desc:"Build your signature AI project: novel application combining LLMs, RAG, or fine-tuning that solves a real problem.",
    hint:"What daily problem can AI solve? Build MVP first. Add features iteratively. Deploy on Hugging Face Spaces or Railway." },
].map(c => {
  const m = CURRICULUM.find(x => x.id === c.month);
  return { ...c, monthTitle: m?.title || "", monthColor: m?.color || T.purple, monthEmoji: m?.emoji || "📚" };
});

/* ===================================================================
   WEEKEND MODULES (6 enhanced modules)
=================================================================== */
const WEEKEND_MODULES = [
  {
    id:"git", emoji:"🌿", title:"Git & GitHub Mastery", color:"#f97316", day:"Saturday",
    description:"Version control is a superpower. Track history, collaborate, and build your public portfolio.",
    topics:[
      { title:"Git Basics", content:"init, add, commit, status, log — daily workflow", exercises:["5 commits with conventional messages (feat:, fix:, docs:)","Practice git log --oneline --graph","Run git diff HEAD~3 to see changes"] },
      { title:"Branching", content:"Feature branches, merge, rebase, conflict resolution", exercises:["Create feature/calculator branch","Intentionally create and resolve a merge conflict","Cherry-pick a commit from another branch"] },
      { title:"GitHub Remote", content:"push, pull, clone, fork, pull requests", exercises:["Push local repo to GitHub","Fork a public repo and open a PR","Add a CI badge to your README"] },
      { title:"Best Practices", content:"Conventional commits, .gitignore, README badges", exercises:["Write a perfect README with setup instructions","Set up .gitignore for Python projects","Add GitHub Actions workflow for auto-testing"] },
    ],
    challenge:"Fork any open-source Python project, fix a bug or add a feature, and open a real Pull Request.",
  },
  {
    id:"dsa", emoji:"🧮", title:"DSA Interview Prep", color:"#3b82f6", day:"Sunday",
    description:"The language of technical interviews. Master these patterns to crack FAANG.",
    topics:[
      { title:"Arrays & Two Pointers", content:"Sliding window, prefix sums, two pointer patterns", exercises:["Two Sum with HashMap","Longest substring without repeating chars","Maximum subarray sum (Kadane's)"] },
      { title:"Recursion & Backtracking", content:"Call stack, base cases, recursive trees", exercises:["Fibonacci with memoization","All permutations of a string","Solve N-Queens for N=4"] },
      { title:"Sorting & Searching", content:"QuickSort, MergeSort, Binary Search", exercises:["Implement QuickSort from scratch","Binary search on rotated sorted array","Find kth largest element"] },
      { title:"Trees & Graphs", content:"BFS, DFS, tree traversals", exercises:["Level-order traversal (BFS)","Detect cycle in directed graph","Lowest common ancestor of BST"] },
    ],
    challenge:"Solve 3 LeetCode Mediums using patterns learned today. Document time/space complexity for each.",
  },
  {
    id:"llmarch", emoji:"🧬", title:"LLM Architecture Deep Dive", color:"#a855f7", day:"Saturday",
    description:"Understand what's really happening inside large language models.",
    topics:[
      { title:"Transformer Architecture", content:"Encoder/decoder, attention heads, positional encoding", exercises:["Draw the full transformer architecture from memory","Explain why positional encoding is needed","Calculate params in a 7B model"] },
      { title:"Training Dynamics", content:"Pre-training, fine-tuning, RLHF, Constitutional AI", exercises:["Explain what happens during pre-training","How does RLHF change model behavior?","What is Constitutional AI and why does it matter?"] },
      { title:"Model Families", content:"GPT, Claude, Llama, Mistral — key differences", exercises:["Compare GPT-4 vs Claude 3 architecturally","Why do some models have different context lengths?","What is mixture-of-experts (MoE)?"] },
      { title:"Inference & Optimization", content:"KV cache, quantization, speculative decoding", exercises:["Explain how KV caching reduces compute","What does 4-bit quantization sacrifice?","How does speculative decoding work?"] },
    ],
    challenge:"Write a detailed blog post explaining one LLM concept (your choice) to a general technical audience.",
  },
  {
    id:"prompteng", emoji:"⚡", title:"Advanced Prompt Engineering", color:"#10b981", day:"Sunday",
    description:"Master the craft of getting the best out of LLMs through expert prompting.",
    topics:[
      { title:"Advanced Techniques", content:"CoT, ToT, self-consistency, meta-prompting", exercises:["Implement chain-of-thought for a math problem","Try tree-of-thought on a planning problem","Self-consistency: run 5x, take majority vote"] },
      { title:"Prompt Optimization", content:"DSPy, automatic prompt optimization, eval-driven", exercises:["Set up DSPy for a simple task","A/B test two prompt versions on 20 examples","Measure prompt performance with custom metric"] },
      { title:"Safety & Red-teaming", content:"Jailbreaks, injection, refusal calibration", exercises:["Try 10 known jailbreak attempts on Claude","Document 5 prompt injection vectors","Design safety system prompt for a chatbot"] },
      { title:"Production Prompts", content:"Versioning, testing, deployment best practices", exercises:["Create a prompt registry with versioning","Write tests for your most critical prompts","Measure latency impact of prompt length"] },
    ],
    challenge:"Build a prompt optimization system: given a task and examples, automatically improve a prompt.",
  },
  {
    id:"opensrc", emoji:"🌍", title:"Open Source AI Projects", color:"#f59e0b", day:"Saturday",
    description:"Learn by contributing to real AI projects used by millions.",
    topics:[
      { title:"Finding Good Issues", content:"good-first-issue, help-wanted, documentation", exercises:["Browse LangChain/LlamaIndex open issues","Find 3 issues you could realistically fix","Read the contributing guide of any major AI repo"] },
      { title:"Code Reading Skills", content:"Understanding large codebases quickly", exercises:["Map the architecture of LangChain in 30 min","Trace a request through the codebase","Find where a specific feature is implemented"] },
      { title:"Making Contributions", content:"Forking, PR etiquette, reviews", exercises:["Fix a documentation typo (any repo)","Add a test for an untested function","Improve an error message in any library"] },
      { title:"Building in Public", content:"Blogging, X/Twitter threads, demos", exercises:["Write a tutorial for something you built","Post a demo on Hugging Face Spaces","Tweet about what you learned this week"] },
    ],
    challenge:"Make your first merged contribution to any open-source AI/ML project by end of the week.",
  },
  {
    id:"sysdesign", emoji:"🏛️", title:"AI System Design", color:"#ec4899", day:"Sunday",
    description:"Design scalable AI systems like a senior engineer at a top tech company.",
    topics:[
      { title:"AI System Patterns", content:"Caching, async queues, model routing, fallbacks", exercises:["Design caching strategy for LLM responses","When to use async vs sync for ML inference?","Design a fallback chain: Claude → GPT-4 → cached"] },
      { title:"Scalability", content:"Horizontal scaling, load balancing, batch inference", exercises:["How would you scale to 1M users?","Design batch inference for overnight jobs","Estimate cost for 10K daily AI queries"] },
      { title:"Data Architecture", content:"Vector DBs, SQL, event streaming", exercises:["Design schema for a RAG system","Choose between Pinecone, Chroma, and PgVector","When would you use Kafka for an AI system?"] },
      { title:"Case Studies", content:"ChatGPT, Claude, Gemini — production learnings", exercises:["Estimate ChatGPT's infrastructure cost per query","How does Anthropic likely handle Claude's safety filters?","Design the architecture for a coding assistant like Cursor"] },
    ],
    challenge:"Design the full system architecture for a Perplexity-like AI search engine. Draw the diagram, estimate costs.",
  },
];

/* ===================================================================
   DETAILED WEEK DATA (Month 1 — kept for Day Tracker)
=================================================================== */
const WEEKS_DATA = [
  {
    id:"w1", n:1, month:1, title:"Dev Setup & Computer Basics", color:"#3b82f6",
    topics:[
      { text:"Hardware: CPU, RAM, Storage, GPU roles",           idea:"Build: System Info Printer using platform module" },
      { text:"Binary & hexadecimal number systems",             idea:"Build: Number Converter CLI — binary/decimal/hex" },
      { text:"Terminal commands: cd, ls, mkdir, touch, rm",      idea:"Build: Folder Organiser using os.walk()" },
      { text:"Python installation, VS Code, Git setup",          idea:"Build: Dev Environment Checker script" },
      { text:"Running your first .py file from terminal",        idea:"Build: Hello World → Personal Bio program" },
    ],
    days:[
      { n:1, label:"System Explorer",     plan:"List PC specs in specs.txt via terminal" },
      { n:2, label:"Binary Converter",    plan:"Convert 0–15 to binary by hand, verify with Python" },
      { n:3, label:"First .py File",      plan:"Create hello.py — print name, age, college" },
      { n:4, label:"Folder Structure",    plan:"mkdir my-projects/week{1..26} from terminal" },
      { n:5, label:"About Me Program",    plan:"Use input() to ask name/age/city, print formatted" },
      { n:6, label:"Number Systems Quiz", plan:"Convert 42→binary, 0b11010→decimal, 0xFF→decimal" },
      { n:7, label:"Week README Push",    plan:"Write README.md with learnings and push to GitHub" },
    ],
  },
  {
    id:"w2", n:2, month:1, title:"Python Syntax & Variables", color:"#3b82f6",
    topics:[
      { text:"Variables: int, float, str, bool, None",  idea:"Build: Personal Bio Card with all data types" },
      { text:"input() and print() with f-strings",      idea:"Build: Greeting Generator — 5 styles" },
      { text:"Type casting: int(), str(), float()",     idea:"Build: Unit Converter — km to miles" },
      { text:"String methods: .upper(),.lower(),.split()", idea:"Build: Name Formatter" },
      { text:"Comments and PEP 8 style",                idea:"Build: Well-commented Receipt Calculator" },
    ],
    days:[
      { n:1, label:"Variable Zoo",        plan:"Create all 5 data types, print with type()" },
      { n:2, label:"Simple Calculator",   plan:"Take two inputs, show 6 operations" },
      { n:3, label:"String Surgeon",      plan:"Input sentence, transform 6 ways" },
      { n:4, label:"Receipt Generator",   plan:"3 items + prices + 18% GST = formatted receipt" },
      { n:5, label:"ID Card Printer",     plan:"Ask 4 details, print bordered card with f-strings" },
      { n:6, label:"Type Converter",      plan:"Input number, show 6 representations" },
      { n:7, label:"Mad Libs Push",       plan:"2 story templates + random pick + push to GitHub" },
    ],
  },
  {
    id:"w3", n:3, month:1, title:"Control Flow & Logic", color:"#3b82f6",
    topics:[
      { text:"if / elif / else statements",     idea:"Build: Smart Discount Calculator" },
      { text:"Logical operators: and, or, not", idea:"Build: Login Validator" },
      { text:"Comparison operators",            idea:"Build: Number Comparator" },
      { text:"Nested conditions",               idea:"Build: Ticket Price Calculator" },
      { text:"Boolean logic & truth tables",    idea:"Build: Logic Gate Simulator" },
    ],
    days:[
      { n:1, label:"Traffic Light",       plan:"Input color → correct instruction + 'broken' state" },
      { n:2, label:"FizzBuzz+",           plan:"Odd/even + div by 3,5 + prime check" },
      { n:3, label:"Grade Calculator",    plan:"5 subjects → average → grade letter (elif)" },
      { n:4, label:"Leap Year Detector",  plan:"Implement real leap year rule with ÷400 case" },
      { n:5, label:"Vending Machine",     plan:"5 items, handle exact/too little/too much money" },
      { n:6, label:"Rock Paper Scissors", plan:"User vs computer, win/lose/draw" },
      { n:7, label:"BMI Analyzer Push",   plan:"Add body-fat estimate formula + README + push" },
    ],
  },
  {
    id:"w4", n:4, month:1, title:"Loops & Iteration", color:"#3b82f6",
    topics:[
      { text:"for loops with range(start, stop, step)", idea:"Build: Times Table App" },
      { text:"while loops, break, continue, pass",      idea:"Build: ATM PIN system — 3 attempts lockout" },
      { text:"Nested loops & patterns",                 idea:"Build: Star Pyramid Generator" },
      { text:"enumerate() and zip()",                   idea:"Build: Numbered Inventory Printer" },
      { text:"Loop patterns: sum, count, min, max",     idea:"Build: Number Stats CLI" },
    ],
    days:[
      { n:1, label:"Multiplication Tables", plan:"Nested loops, formatted columns" },
      { n:2, label:"Star Patterns",         plan:"5 ASCII art patterns from nested loops" },
      { n:3, label:"Sum Calculator",        plan:"Sum 1-100 / evens / odds / squares / factorial" },
      { n:4, label:"PIN Lock Simulator",    plan:"3 attempts, while loop, lockout, show remaining" },
      { n:5, label:"Stats Tool",            plan:"Enter numbers until 'done', show min/max/sum/avg" },
      { n:6, label:"Password Strength",     plan:"Check 5 criteria, score 1-5 with label" },
      { n:7, label:"Guessing Game Push",    plan:"Add replay, session stats, difficulty — push!" },
    ],
  },
];

/* ===================================================================
   STORAGE HOOK
=================================================================== */
function useStorage(key, defaultVal) {
  const [val, setVal] = useState(defaultVal);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(key);
        if (r && r.value !== undefined) setVal(JSON.parse(r.value));
      } catch {}
      setLoaded(true);
    })();
  }, [key]);
  const save = useCallback(async (newVal) => {
    const v = typeof newVal === "function" ? newVal(val) : newVal;
    setVal(v);
    try { await window.storage.set(key, JSON.stringify(v)); } catch {}
  }, [key, val]);
  return [val, save, loaded];
}

/* ===================================================================
   SHARED COMPONENTS
=================================================================== */
const Spinner = ({ size = 18 }) => <span className="spin" style={{ fontSize: size }}>⟳</span>;

const ProgressRing = ({ pct, size = 80, stroke = 6, color = T.purple, label }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#0f0f2a" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 0.9s ease", filter:`drop-shadow(0 0 4px ${color}80)` }} />
      </svg>
      {label && <div style={{ fontSize:11, color:T.t2, textAlign:"center" }}>{label}</div>}
    </div>
  );
};

const SectionHeader = ({ title, sub, action }) => (
  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:22, flexWrap:"wrap" }}>
    <div>
      <h2 className="sec-h">{title}</h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </div>
    {action}
  </div>
);

const XPBadge = ({ xp }) => (
  <span style={{
    background:"linear-gradient(135deg,#f59e0b,#f97316)", color:"#000",
    fontWeight:800, fontSize:11, padding:"3px 10px", borderRadius:999,
    fontFamily:"'JetBrains Mono',monospace"
  }}>+{xp} XP</span>
);

const LevelBadge = ({ xp }) => {
  const lvl = getLevel(xp);
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px",
      background: lvl.color + "20", border:`1px solid ${lvl.color}40`,
      borderRadius:999, fontSize:12, fontWeight:700, color: lvl.color
    }}>
      <span>{lvl.emoji}</span>
      <span>Lv.{lvl.level} {lvl.title}</span>
    </div>
  );
};

const CO_CLS = { Google:"co-google", OpenAI:"co-openai", Anthropic:"co-anthropic", Meta:"co-meta", Microsoft:"co-google" };

/* ===================================================================
   APP HEADER (Live XP / Streak)
=================================================================== */
const AppHeader = ({ totalXP, streak, solvedCount }) => {
  const lvl = getLevel(totalXP);
  const nextLvl = XP_LEVELS[lvl.level] || lvl;
  const pct = lvl.level < 7 ? Math.round(((totalXP - lvl.min) / (nextLvl.min - lvl.min)) * 100) : 100;

  return (
    <div style={{
      background:"linear-gradient(180deg,#08081e 0%,#050510 100%)",
      borderBottom:`1px solid ${T.border}`,
      padding:"12px clamp(14px,4vw,28px)",
      display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap"
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{
          width:46, height:46, borderRadius:"50%",
          background:"linear-gradient(135deg,#7c3aed,#00d4ff)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:20, fontWeight:800, color:"#fff", flexShrink:0,
          boxShadow:"0 0 20px #8b5cf650"
        }}>S</div>
        <div>
          <div style={{ fontSize:"clamp(15px,2.5vw,20px)", fontWeight:800, color:T.t1, lineHeight:1.1 }}>Shyam Baghel</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4, flexWrap:"wrap" }}>
            <LevelBadge xp={totalXP} />
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width: "clamp(80px,12vw,140px)", height:4, background:"#0f0f2a", borderRadius:999, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${lvl.color},${nextLvl.color})`, borderRadius:999, transition:"width .8s ease" }} />
              </div>
              <span style={{ fontSize:10, color:T.t2 }}>{pct}%</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {[
          { icon:"⭐", val: totalXP.toLocaleString(), label:"Total XP", glow:"#f59e0b" },
          { icon:"🔥", val: `${streak}d`, label:"Streak", glow:"#ef4444" },
          { icon:"⚡", val: solvedCount, label:"Solved", glow:"#8b5cf6" },
        ].map(s => (
          <div key={s.label} style={{
            background:T.card, border:`1px solid ${T.border}`, borderRadius:10,
            padding:"6px 12px", display:"flex", alignItems:"center", gap:7,
            boxShadow:`0 0 12px ${s.glow}20`
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

/* ===================================================================
   SIDEBAR
=================================================================== */
const NAV_ITEMS = [
  { id:"dashboard",  icon:"📊", label:"Dashboard" },
  { id:"roadmap",    icon:"🗺️", label:"Roadmap",     badge:"7 Months" },
  { id:"tracker",    icon:"📅", label:"Daily Tracker" },
  { id:"challenges", icon:"⚡", label:"Challenges",   badge:"NEW" },
  { id:"weekend",    icon:"🗓️", label:"Weekend" },
  { id:"mentor",     icon:"🤖", label:"AI Mentor",    badge:"AI" },
  { id:"mlpath",     icon:"🌌", label:"ML Path",      badge:"NEW" },
];

const Sidebar = ({ active, onNav, totalXP, solvedCount }) => {
  const lvl = getLevel(totalXP);
  return (
    <div className="sidebar">
      <div style={{ padding:"16px 16px 8px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.t3, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8 }}>
          Navigation
        </div>
      </div>
      {NAV_ITEMS.map(item => (
        <div key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`}
          onClick={() => onNav(item.id)}>
          <span style={{ fontSize:16 }}>{item.icon}</span>
          <span style={{ flex:1 }}>{item.label}</span>
          {item.badge && (
            <span style={{
              fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4,
              background: item.badge === "NEW" ? "#7c3aed30" : item.badge === "AI" ? "#00d4ff20" : "#f59e0b20",
              color: item.badge === "NEW" ? T.purple : item.badge === "AI" ? T.cyan : T.amber,
              border: `1px solid ${item.badge === "NEW" ? T.purple+"40" : item.badge === "AI" ? T.cyan+"30" : T.amber+"40"}`
            }}>{item.badge}</span>
          )}
        </div>
      ))}
      <div style={{ flex:1 }} />
      <div style={{ padding:"14px 16px", borderTop:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:12, color:T.t2 }}>{lvl.emoji} {lvl.title}</span>
          <span style={{ fontSize:12, color: lvl.color, fontWeight:700 }}>{totalXP} XP</span>
        </div>
        <div className="prog-track">
          <div className="prog-fill xp-shimmer" style={{ width:`${Math.min(100, Math.round(((totalXP - lvl.min)/(XP_LEVELS[lvl.level]?.min - lvl.min || 1))*100))}%` }} />
        </div>
        <div style={{ fontSize:11, color:T.t3, marginTop:8, textAlign:"center" }}>
          ⚡ {solvedCount} challenges solved
        </div>
      </div>
    </div>
  );
};

const MobileNav = ({ active, onNav }) => (
  <div className="mob-nav">
    {NAV_ITEMS.map(item => (
      <div key={item.id} onClick={() => onNav(item.id)}
        style={{
          display:"flex", flexDirection:"column", alignItems:"center", gap:2,
          padding:"4px 6px", borderRadius:8, cursor:"pointer", flex:1,
          color: active === item.id ? T.purple : T.t3,
          background: active === item.id ? "#10103a" : "transparent",
        }}>
        <span style={{ fontSize:17 }}>{item.icon}</span>
        <span style={{ fontSize:8, fontWeight:600 }}>{item.label.split(" ")[0]}</span>
      </div>
    ))}
  </div>
);

/* ===================================================================
   DASHBOARD VIEW
=================================================================== */
const DashboardView = ({ trackerData, solvedChallenges, totalXP }) => {
  const totalDays = WEEKS_DATA.reduce((a, w) => a + w.days.length, 0);
  const completedDays = Object.values(trackerData).filter(d => d.completed?.trim()).length;
  const pct = Math.round((completedDays / totalDays) * 100) || 0;
  const lvl = getLevel(totalXP);
  const solvedCount = Object.values(solvedChallenges).filter(Boolean).length;
  const [topicProgress] = useStorage("topic-progress-v1", {});

  const getWeekTopicDone = (w) => w.topics.filter((_, j) => topicProgress[`m${w.n}-t${j}`]).length;
  const isWeekDone = (w) => getWeekTopicDone(w) >= MIN_TOPICS_PER_WEEK;

  const monthStats = CURRICULUM.map(m => {
    const total = m.weeks.reduce((a, w) => a + w.topics.length, 0);
    const done  = m.weeks.reduce((a, w) => a + getWeekTopicDone(w), 0);
    const weeksComplete = m.weeks.filter(w => isWeekDone(w)).length;
    const complete = m.weeks.every(w => isWeekDone(w));
    return { ...m, total, done, weeksComplete, pct: total ? Math.round(done/total*100) : 0, complete };
  });

  return (
    <div className="fade-up" style={{ padding:"clamp(14px,4vw,28px)" }}>
      <SectionHeader title="📊 Dashboard" sub="Your complete 7-month AI engineering journey" />

      {/* Level card */}
      <div className="card card-glow" style={{ padding:"20px 24px", marginBottom:16, background:`linear-gradient(135deg, #0c0c28, #0a0a20)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
          <div style={{ textAlign:"center", flexShrink:0 }}>
            <ProgressRing pct={pct} size={88} color={lvl.color} />
            <div style={{ fontSize:13, fontWeight:700, color:T.t1, marginTop:4 }}>{pct}% Journey</div>
          </div>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontSize:22, fontWeight:900, color:T.t1, marginBottom:4 }}>
              {lvl.emoji} Level {lvl.level} — <span style={{ color:lvl.color }}>{lvl.title}</span>
            </div>
            <div style={{ fontSize:13, color:T.t2, marginBottom:14 }}>
              {completedDays}/{totalDays} days tracked · {solvedCount} challenges solved
            </div>
            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
              <div style={{ flex:1, height:6, background:"#0a0a28", borderRadius:999, overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:999, transition:"width .8s ease",
                  width:`${Math.min(100,Math.round(((totalXP-lvl.min)/((XP_LEVELS[lvl.level]?.min||lvl.max)-lvl.min))*100))}%`,
                  background:`linear-gradient(90deg,${lvl.color},${T.cyan})`
                }} />
              </div>
              <span style={{ fontSize:12, color:T.t2, whiteSpace:"nowrap" }}>{totalXP} / {XP_LEVELS[lvl.level]?.min || "∞"} XP</span>
            </div>
          </div>
          <div className="g4" style={{ minWidth:"min(100%,260px)" }}>
            {[
              { icon:"📅", val:7, label:"Months" },
              { icon:"📆", val:26, label:"Weeks" },
              { icon:"⚡", val:ALL_CHALLENGES.length, label:"Challenges" },
              { icon:"✅", val:solvedCount, label:"Solved" },
            ].map(s => (
              <div key={s.label} style={{ background:T.surface, borderRadius:10, padding:"10px 8px", textAlign:"center", border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:18 }}>{s.icon}</div>
                <div style={{ fontSize:20, fontWeight:800, color:T.t1 }}>{s.val}</div>
                <div style={{ fontSize:10, color:T.t2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Month grid */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.t3, textTransform:"uppercase", letterSpacing:1.2, marginBottom:10 }}>
          7-Month Roadmap Progress
        </div>
        <div className="g3" style={{ gap:10 }}>
          {monthStats.map(m => (
            <div key={m.id} className="card" style={{ padding:"14px 16px", borderColor: m.complete ? T.emerald+"50" : T.border, boxShadow: m.complete ? `0 0 14px ${T.emerald}18` : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:24 }}>{m.complete ? "✅" : m.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color: m.complete ? T.emerald : T.t1, lineHeight:1.2 }}>{m.title}</div>
                  <div style={{ fontSize:11, color:T.t2 }}>{m.sub}</div>
                </div>
                <div style={{ fontSize:16, fontWeight:800, color: m.complete ? T.emerald : m.color }}>{m.pct}%</div>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width:`${m.pct}%`, background: m.complete ? T.emerald : m.color, boxShadow:`0 0 8px ${m.complete ? T.emerald : m.color}60` }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, flexWrap:"wrap", gap:4 }}>
                <span style={{ fontSize:11, color:T.t3 }}>
                  {m.complete ? "🎉 Month Complete!" : `${m.weeksComplete}/${m.weeks.length} weeks done · ${m.done}/${m.total} topics`}
                </span>
                <span style={{ fontSize:11, fontWeight:700, color:m.color }}>{m.totalXP} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Mission */}
      <div className="card card-glow-cyan" style={{ padding:"18px 20px", marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.cyan, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>
          🎯 Today's Mission
        </div>
        <div className="g2">
          {[
            { icon:"📚", title:"Study", desc:"Complete Week 1, Day 3 — First .py File", color:T.blue },
            { icon:"⚡", title:"Challenge", desc:"Solve 1 challenge from Month 1", color:T.purple },
            { icon:"📤", title:"Git Push", desc:"Commit today's work to GitHub", color:T.emerald },
          ].map(t => (
            <div key={t.title} style={{ display:"flex", gap:12, padding:"10px 14px", background:T.surface, borderRadius:10, border:`1px solid ${t.color}25` }}>
              <span style={{ fontSize:22 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:t.color }}>{t.title}</div>
                <div style={{ fontSize:12, color:T.t2 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent challenges solved */}
      <div className="card" style={{ padding:"18px 20px" }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.t2, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>
          ⚡ Recent Challenges Solved
        </div>
        {solvedCount === 0 ? (
          <div style={{ textAlign:"center", padding:"16px", color:T.t3, fontSize:13 }}>
            No challenges solved yet — head to <strong style={{ color:T.purple }}>Challenges</strong> to earn XP!
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {ALL_CHALLENGES.filter(c => solvedChallenges[c.id]).slice(-4).reverse().map(c => {
              const ds = DIFF_STYLE[c.diff] || DIFF_STYLE.Easy;
              return (
                <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:T.surface, borderRadius:8 }}>
                  <span style={{ fontSize:16 }}>✅</span>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:T.t1 }}>{c.title}</span>
                    <span style={{ fontSize:11, color:T.t2, marginLeft:8 }}>{c.monthEmoji} {c.monthTitle}</span>
                  </div>
                  <span className={`badge ${ds.cls}`}>{c.diff}</span>
                  <XPBadge xp={c.xp} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ===================================================================
   NEXT MONTH PREVIEW PANEL — shown when current month is complete
=================================================================== */
const MIN_TOPICS_PER_WEEK = 3; // student must tick at least 3 of 5 topics

const NextMonthPreview = ({ currentMonth, nextMonth, onGo }) => {
  if (!nextMonth) {
    return (
      <div style={{
        margin:"24px 0", padding:"28px 24px",
        background:"linear-gradient(135deg,#06062a,#0a0a24)",
        border:"1px solid #00d4ff40", borderRadius:16,
        boxShadow:"0 0 40px #00d4ff18", textAlign:"center"
      }}>
        <div style={{ fontSize:52, marginBottom:12 }} className="float">🎓</div>
        <div style={{ fontSize:22, fontWeight:900, color:"#00d4ff", marginBottom:8 }}>
          You've Completed the Full 7-Month Journey!
        </div>
        <p style={{ fontSize:14, color:T.t2, lineHeight:1.7, maxWidth:480, margin:"0 auto 16px" }}>
          Congratulations, Shyam! You've mastered Python, LLMs, AI Engineering, ML, Production Systems, and beyond.
          Head to the <strong style={{ color:T.purple }}>ML Path</strong> section to continue your research journey. 🚀
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          {["🐍 Python","🤖 LLMs","🧠 AI Engineering","🔬 ML & DL","🚀 Production","🌌 Capstone"].map(t => (
            <span key={t} style={{ fontSize:12, color:"#00d4ff", background:"#00d4ff18", padding:"4px 12px", borderRadius:999, border:"1px solid #00d4ff40", fontWeight:600 }}>{t}</span>
          ))}
        </div>
      </div>
    );
  }

  // what to focus on next month
  const NEXT_MONTH_GUIDE = {
    2: { focus:"Advanced Python & Real Projects", actions:["Practice OOP by rebuilding your Month 1 projects as classes","Learn async with asyncio — build a concurrent web scraper","Explore NumPy for numerical computing","Start using pandas for any dataset you can find"], watchOut:"Don't skip decorators — they appear constantly in AI codebases" },
    3: { focus:"LLM Fundamentals & Prompt Engineering", actions:["Get your OpenAI or Anthropic API key set up","Read 'Attention Is All You Need' paper summary (not full paper yet)","Build a simple chatbot with message history","Experiment with different temperature values — log results"], watchOut:"Tokenization is confusing at first — spend extra time here" },
    4: { focus:"Building Real AI Systems (RAG + Agents)", actions:["Set up a local vector DB (Chroma) and embed 50+ documents","Build a basic ReAct agent from scratch — no frameworks first","Read LangChain docs, but understand what it abstracts","Evaluate your RAG — don't skip this step"], watchOut:"Agents can loop infinitely — always add a max iterations guard" },
    5: { focus:"Machine Learning & Deep Learning", actions:["Install PyTorch and run a MNIST classifier in the first week","Implement linear regression from scratch before using sklearn","Read fast.ai's Practical Deep Learning (free, great quality)","Build intuition on gradient descent visually — watch 3Blue1Brown"], watchOut:"Math will feel hard — understand the intuition, don't memorize formulas" },
    6: { focus:"Production AI & Career Prep", actions:["Containerize one of your Month 4/5 projects with Docker","Build a FastAPI endpoint for your best ML model","Start your portfolio: pick your 3 best projects, write READMEs","Begin interview prep: solve 2 LeetCode mediums per day"], watchOut:"Prompt injection is a real security issue — learn it seriously" },
    7: { focus:"Capstone & Real-World Impact", actions:["Define your capstone scope in week 1 — be specific","Choose a real problem (your community, your interests)","Open source it from day 1 — commit every day","Share progress on LinkedIn/X — build your audience"], watchOut:"Scope creep kills capstone projects — MVP first, features later" },
  };

  const guide = NEXT_MONTH_GUIDE[nextMonth.id] || {};

  return (
    <div style={{
      margin:"24px 0", borderRadius:16, overflow:"hidden",
      border:`1px solid ${nextMonth.color}50`,
      boxShadow:`0 0 32px ${nextMonth.color}18`
    }}>
      {/* Header bar */}
      <div style={{
        padding:"18px 22px",
        background:`linear-gradient(135deg, ${nextMonth.color}22, ${nextMonth.color}10)`,
        borderBottom:`1px solid ${nextMonth.color}30`,
        display:"flex", alignItems:"center", gap:14, flexWrap:"wrap"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
          <span style={{ fontSize:36 }} className="float">{nextMonth.emoji}</span>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:nextMonth.color, textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>
              🎉 Month {currentMonth.id} Complete! Up Next →
            </div>
            <div style={{ fontSize:18, fontWeight:800, color:T.t1 }}>Month {nextMonth.id}: {nextMonth.title}</div>
            <div style={{ fontSize:13, color:T.t2 }}>{nextMonth.sub}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:900, color:nextMonth.color }}>{nextMonth.totalXP}</div>
            <div style={{ fontSize:10, color:T.t2 }}>XP Available</div>
          </div>
          <button className="btn btn-primary" onClick={onGo}
            style={{ background:`linear-gradient(135deg,${nextMonth.color},${nextMonth.color}bb)` }}>
            Start Month {nextMonth.id} →
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:"18px 22px", background:"#07071e" }}>
        <div className="g2" style={{ gap:14 }}>
          {/* What to focus on */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:10, textTransform:"uppercase", letterSpacing:.8 }}>
              🎯 Main Focus
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:nextMonth.color, marginBottom:12 }}>
              {guide.focus}
            </div>
            <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:8, textTransform:"uppercase", letterSpacing:.8 }}>
              ✅ Your First-Week Action Plan
            </div>
            {guide.actions?.map((a, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:8, padding:"8px 12px", background:T.surface, borderRadius:8, border:`1px solid ${T.border}` }}>
                <span style={{ color:nextMonth.color, fontWeight:800, flexShrink:0, fontSize:12 }}>{i+1}.</span>
                <span style={{ fontSize:13, color:T.t1, lineHeight:1.5 }}>{a}</span>
              </div>
            ))}
          </div>

          {/* Weeks preview + Watch out */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:10, textTransform:"uppercase", letterSpacing:.8 }}>
              📆 What You'll Learn ({nextMonth.weeks.length} Weeks)
            </div>
            {nextMonth.weeks.map((w, i) => (
              <div key={i} style={{
                display:"flex", gap:10, marginBottom:8, padding:"10px 14px",
                background:T.surface, borderRadius:10, border:`1px solid ${T.border}`,
                alignItems:"flex-start"
              }}>
                <div style={{
                  width:28, height:28, borderRadius:6, background:nextMonth.color+"20",
                  border:`1px solid ${nextMonth.color}40`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:11, fontWeight:800, color:nextMonth.color, flexShrink:0
                }}>W{w.n}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.t1, marginBottom:3 }}>{w.title}</div>
                  <div style={{ fontSize:11, color:T.t2, lineHeight:1.5 }}>
                    {w.topics.slice(0, 3).join(" · ")}{w.topics.length > 3 ? " …" : ""}
                  </div>
                </div>
              </div>
            ))}
            {guide.watchOut && (
              <div style={{ marginTop:10, padding:"12px 14px", background:"#1a0a0a", border:"1px solid #7f1d1d", borderRadius:10 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.red, marginBottom:4 }}>⚠️ Watch Out</div>
                <div style={{ fontSize:13, color:"#fca5a5", lineHeight:1.5 }}>{guide.watchOut}</div>
              </div>
            )}
          </div>
        </div>

        {/* Capstone preview */}
        <div style={{ marginTop:14, padding:"14px 16px", background:`${nextMonth.color}10`, border:`1px solid ${nextMonth.color}30`, borderRadius:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:nextMonth.color, marginBottom:4, textTransform:"uppercase", letterSpacing:.8 }}>
            🏆 Month {nextMonth.id} Capstone
          </div>
          <div style={{ fontSize:13, color:T.t1, lineHeight:1.5 }}>{nextMonth.capstone}</div>
        </div>
      </div>
    </div>
  );
};

/* ===================================================================
   WEEK CARD with topic checkboxes + min-target system
=================================================================== */
const WeekTopicCard = ({ week, monthColor, topicProgress, onToggle, weekIndex, expanded, onExpand }) => {
  const TOTAL = week.topics.length;
  const doneTopic = week.topics.filter((_, j) => topicProgress[`m${week.n}-t${j}`]).length;
  const goalMet = doneTopic >= MIN_TOPICS_PER_WEEK;
  const pct = Math.round((doneTopic / TOTAL) * 100);

  return (
    <div style={{
      marginBottom:10,
      borderRadius:12,
      border:`1px solid ${goalMet ? T.emerald+"60" : expanded ? monthColor+"50" : T.border}`,
      background: goalMet ? "#021208" : T.card,
      overflow:"hidden",
      transition:"border-color .3s, background .3s",
      boxShadow: goalMet ? `0 0 16px ${T.emerald}20` : "none"
    }}>
      {/* Header */}
      <div style={{ padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}
        onClick={() => onExpand(expanded ? null : weekIndex)}>
        <div style={{
          width:34, height:34, borderRadius:8, flexShrink:0,
          background: goalMet ? T.emerald+"25" : monthColor+"20",
          border:`1px solid ${goalMet ? T.emerald+"50" : monthColor+"40"}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:12, fontWeight:800, color: goalMet ? T.emerald : monthColor
        }}>{goalMet ? "✓" : `W${week.n}`}</div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:700, color: goalMet ? T.emerald : T.t1, marginBottom:4 }}>
            {week.title}
          </div>
          {/* mini progress bar */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flex:1, height:4, background:"#0a0a20", borderRadius:999, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", borderRadius:999, transition:"width .5s ease",
                background: goalMet ? T.emerald : `linear-gradient(90deg,${monthColor},${monthColor}99)`,
                boxShadow: goalMet ? `0 0 6px ${T.emerald}80` : "none"
              }} />
            </div>
            <span style={{ fontSize:11, fontWeight:700, color: goalMet ? T.emerald : T.t2, whiteSpace:"nowrap" }}>
              {doneTopic}/{TOTAL} topics
            </span>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
          {goalMet ? (
            <span style={{ fontSize:10, fontWeight:700, background:T.emerald+"20", color:T.emerald,
              padding:"2px 8px", borderRadius:999, border:`1px solid ${T.emerald}40` }}>
              ✅ Week Done!
            </span>
          ) : doneTopic > 0 ? (
            <span style={{ fontSize:10, fontWeight:700, background:monthColor+"18", color:monthColor,
              padding:"2px 8px", borderRadius:999, border:`1px solid ${monthColor}40` }}>
              Need {MIN_TOPICS_PER_WEEK - doneTopic} more
            </span>
          ) : (
            <span style={{ fontSize:10, color:T.t3 }}>Target: {MIN_TOPICS_PER_WEEK}/{TOTAL}</span>
          )}
          <span style={{ fontSize:11, color:T.t3 }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded: topic checkboxes */}
      {expanded && (
        <div style={{ padding:"0 16px 16px", borderTop:`1px solid ${T.border}` }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.t3, textTransform:"uppercase", letterSpacing:1, padding:"12px 0 8px" }}>
            Tick topics as you complete them — need at least {MIN_TOPICS_PER_WEEK} of {TOTAL}
          </div>

          {/* Target meter */}
          <div style={{
            display:"flex", gap:6, marginBottom:12, padding:"8px 12px",
            background: goalMet ? T.emerald+"12" : "#0a0a20",
            borderRadius:10, border:`1px solid ${goalMet ? T.emerald+"40" : T.border}`,
            alignItems:"center", flexWrap:"wrap"
          }}>
            <div style={{ display:"flex", gap:4 }}>
              {Array.from({ length: TOTAL }).map((_, j) => (
                <div key={j} style={{
                  width:18, height:18, borderRadius:4,
                  background: j < doneTopic
                    ? (j < MIN_TOPICS_PER_WEEK ? T.emerald : monthColor)
                    : (j < MIN_TOPICS_PER_WEEK ? "#0a2010" : "#0a0a20"),
                  border:`1px solid ${j < doneTopic ? (j < MIN_TOPICS_PER_WEEK ? T.emerald : monthColor) : T.border}`,
                  transition:"all .2s"
                }} />
              ))}
            </div>
            <span style={{ fontSize:12, fontWeight:700, color: goalMet ? T.emerald : T.t2, marginLeft:6 }}>
              {goalMet ? "🎉 Week goal met!" : `${doneTopic}/${MIN_TOPICS_PER_WEEK} minimum target`}
            </span>
          </div>

          {/* Topic checkboxes */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {week.topics.map((topic, j) => {
              const key = `m${week.n}-t${j}`;
              const done = !!topicProgress[key];
              return (
                <div key={j}
                  onClick={() => onToggle(key)}
                  style={{
                    display:"flex", gap:12, padding:"10px 14px", borderRadius:10, cursor:"pointer",
                    background: done ? (j < MIN_TOPICS_PER_WEEK ? T.emerald+"14" : monthColor+"14") : T.surface,
                    border:`1px solid ${done ? (j < MIN_TOPICS_PER_WEEK ? T.emerald+"50" : monthColor+"50") : T.border}`,
                    transition:"all .2s", alignItems:"flex-start"
                  }}>
                  {/* Custom checkbox */}
                  <div style={{
                    width:20, height:20, borderRadius:6, flexShrink:0, marginTop:1,
                    background: done ? (j < MIN_TOPICS_PER_WEEK ? T.emerald : monthColor) : "transparent",
                    border:`2px solid ${done ? "transparent" : T.t3}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, color:"#000", fontWeight:900, transition:"all .2s"
                  }}>{done ? "✓" : ""}</div>

                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color: done ? T.t1 : T.t2, lineHeight:1.4, textDecoration: done ? "none" : "none" }}>
                      {topic}
                    </div>
                    {j < MIN_TOPICS_PER_WEEK && (
                      <span style={{ fontSize:10, color: done ? T.emerald : T.t3 }}>
                        {done ? "✅ Counts toward target" : "Required for week goal"}
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize:10, fontWeight:700, color:T.t3, flexShrink:0 }}>Topic {j+1}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================================================================
   ROADMAP VIEW (7 months, topic tracking, monthly unlock)
=================================================================== */
const RoadmapView = () => {
  const [selMonth, setSelMonth] = useState(1);
  const [tab, setTab] = useState("weeks");
  const [expandedWeek, setExpandedWeek] = useState(0);
  const [topicProgress, saveTopicProgress] = useStorage("topic-progress-v1", {});
  const month = CURRICULUM.find(m => m.id === selMonth);
  const nextMonth = CURRICULUM.find(m => m.id === selMonth + 1) || null;

  const toggleTopic = (key) => {
    saveTopicProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate per-month and per-week stats
  const getWeekDone = (w) =>
    w.topics.filter((_, j) => topicProgress[`m${w.n}-t${j}`]).length;
  const isWeekComplete = (w) => getWeekDone(w) >= MIN_TOPICS_PER_WEEK;
  const isMonthComplete = (m) => m.weeks.every(w => isWeekComplete(w));

  const monthComplete = isMonthComplete(month);
  const totalTopicsThisMonth = month.weeks.reduce((a, w) => a + w.topics.length, 0);
  const doneTopicsThisMonth = month.weeks.reduce((a, w) => a + getWeekDone(w), 0);
  const monthPct = Math.round((doneTopicsThisMonth / totalTopicsThisMonth) * 100);

  return (
    <div className="fade-up" style={{ padding:"clamp(14px,4vw,28px)" }}>
      <SectionHeader
        title="🗺️ Learning Roadmap"
        sub={`Complete at least ${MIN_TOPICS_PER_WEEK} topics per week to unlock next month`}
      />

      {/* Month selector with completion dots */}
      <div className="scroll-row" style={{ marginBottom:16 }}>
        {CURRICULUM.map(m => {
          const mc = isMonthComplete(m);
          return (
            <button key={m.id}
              onClick={() => { setSelMonth(m.id); setTab("weeks"); setExpandedWeek(0); }}
              style={{
                flex:"0 0 auto", padding:"8px 16px", borderRadius:10, border:"1px solid",
                borderColor: mc ? T.emerald+"80" : selMonth === m.id ? m.color : T.border,
                background: mc ? T.emerald+"15" : selMonth === m.id ? m.color+"22" : T.card,
                color: mc ? T.emerald : selMonth === m.id ? m.color : T.t2,
                cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13,
                display:"flex", alignItems:"center", gap:7, transition:"all .2s",
                boxShadow: selMonth === m.id ? `0 0 16px ${mc ? T.emerald : m.color}30` : "none"
              }}>
              <span>{mc ? "✅" : m.emoji}</span>
              <span>M{m.id}: {m.title.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Month header with live progress */}
      <div className="card" style={{
        padding:"18px 22px", marginBottom:16,
        borderColor: monthComplete ? T.emerald+"60" : month.color+"40",
        boxShadow:`0 0 20px ${monthComplete ? T.emerald : month.color}15`
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <span style={{ fontSize:40 }} className="float">{monthComplete ? "🏆" : month.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:20, fontWeight:800, color:T.t1 }}>
              Month {month.id}: {month.title}
              {monthComplete && <span style={{ color:T.emerald, fontSize:16, marginLeft:10 }}>— Complete! ✅</span>}
            </div>
            <div style={{ fontSize:13, color:T.t2, marginBottom:10 }}>{month.sub}</div>
            {/* Month-level progress bar */}
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
              <div style={{ flex:1, height:6, background:"#0a0a28", borderRadius:999, overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:999, transition:"width .7s ease",
                  width:`${monthPct}%`,
                  background: monthComplete
                    ? `linear-gradient(90deg,${T.emerald},#4ade80)`
                    : `linear-gradient(90deg,${month.color},${month.color}99)`,
                  boxShadow: monthComplete ? `0 0 8px ${T.emerald}80` : `0 0 8px ${month.color}60`
                }} />
              </div>
              <span style={{ fontSize:12, fontWeight:700, color: monthComplete ? T.emerald : month.color, whiteSpace:"nowrap" }}>
                {doneTopicsThisMonth}/{totalTopicsThisMonth} topics
              </span>
            </div>
            {/* Week completion dots */}
            <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
              {month.weeks.map(w => {
                const done = getWeekDone(w);
                const wc = isWeekComplete(w);
                return (
                  <div key={w.n} style={{
                    display:"flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:999,
                    background: wc ? T.emerald+"18" : "#0a0a20",
                    border:`1px solid ${wc ? T.emerald+"50" : T.border}`,
                    fontSize:11, fontWeight:700, color: wc ? T.emerald : T.t2
                  }}>
                    {wc ? "✅" : `${done}/${w.topics.length}`} W{w.n}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ textAlign:"center", flexShrink:0 }}>
            <ProgressRing pct={monthPct} size={72} color={monthComplete ? T.emerald : month.color}
              label={`${monthPct}%`} />
            <div style={{ fontSize:11, color:T.t2, marginTop:4 }}>{month.totalXP} XP</div>
          </div>
        </div>
      </div>

      {/* Content tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:18, borderBottom:`1px solid ${T.border}`, paddingBottom:4 }}>
        {[
          { id:"weeks",     label:"📆 Weekly Topics" },
          { id:"interview", label:"🎯 Interview Qs" },
          { id:"capstone",  label:"🏆 Capstone" },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`}
            style={tab === t.id ? { color:month.color, background:month.color+"18" } : {}}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── WEEKLY TOPICS (main tab) ── */}
      {tab === "weeks" && (
        <div>
          {/* Legend */}
          <div style={{ display:"flex", gap:12, marginBottom:14, flexWrap:"wrap", padding:"8px 12px", background:T.surface, borderRadius:8, border:`1px solid ${T.border}` }}>
            <span style={{ fontSize:12, color:T.t2, fontWeight:600 }}>How it works:</span>
            <span style={{ fontSize:12, color:T.emerald }}>✅ Check a topic when you've studied it</span>
            <span style={{ fontSize:12, color:month.color }}>🎯 Complete {MIN_TOPICS_PER_WEEK}+ topics to finish the week</span>
            <span style={{ fontSize:12, color:T.cyan }}>🔓 Finish all weeks to unlock next month</span>
          </div>

          {month.weeks.map((w, i) => (
            <WeekTopicCard
              key={w.n}
              week={w}
              monthColor={month.color}
              topicProgress={topicProgress}
              onToggle={toggleTopic}
              weekIndex={i}
              expanded={expandedWeek === i}
              onExpand={setExpandedWeek}
            />
          ))}

          {/* Month Complete → Next Month Preview */}
          {monthComplete && (
            <NextMonthPreview
              currentMonth={month}
              nextMonth={nextMonth}
              onGo={() => { if (nextMonth) { setSelMonth(nextMonth.id); setExpandedWeek(0); } }}
            />
          )}

          {/* Not yet complete hint */}
          {!monthComplete && doneTopicsThisMonth > 0 && (
            <div style={{
              marginTop:16, padding:"14px 18px",
              background:"#06060e", border:`1px solid ${month.color}30`,
              borderRadius:12, display:"flex", gap:12, alignItems:"flex-start"
            }}>
              <span style={{ fontSize:24 }}>💡</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:month.color, marginBottom:4 }}>
                  Keep going — {month.weeks.filter(w => !isWeekComplete(w)).length} week(s) left to complete Month {month.id}
                </div>
                <p style={{ fontSize:12, color:T.t2, lineHeight:1.6 }}>
                  Complete at least <strong style={{ color:T.t1 }}>{MIN_TOPICS_PER_WEEK} topics</strong> in each week.
                  {" "}Weeks completed: <strong style={{ color:T.emerald }}>{month.weeks.filter(w => isWeekComplete(w)).length}/{month.weeks.length}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── INTERVIEW QS ── */}
      {tab === "interview" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {month.interviewQ?.map((q, i) => {
            const ds = DIFF_STYLE[q.diff] || DIFF_STYLE.Easy;
            return (
              <div key={i} className="q-card">
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-start" }}>
                  <span className={`badge ${ds.cls}`}>{q.diff}</span>
                  <span className={`badge ${CO_CLS[q.co] || "co-google"}`}>{q.co}</span>
                  <p style={{ flex:1, minWidth:200, fontSize:14, color:T.t1, lineHeight:1.6 }}>{q.q}</p>
                </div>
              </div>
            );
          })}
          <div style={{ padding:"14px 18px", background:month.color+"12", border:`1px solid ${month.color}30`, borderRadius:12, marginTop:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:month.color, marginBottom:6 }}>💡 Interview Tip for {month.title}</div>
            <p style={{ fontSize:13, color:T.t2, lineHeight:1.6 }}>
              Always explain your thinking out loud. Companies want to see how you reason — not just the answer.
              Link every answer to a real project you've built this month.
            </p>
          </div>
        </div>
      )}

      {/* ── CAPSTONE ── */}
      {tab === "capstone" && (
        <div>
          <div className="card" style={{ padding:"24px", borderColor:month.color+"50", boxShadow:`0 0 28px ${month.color}20` }}>
            <div style={{ display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>
              <div style={{ fontSize:48 }} className="float">🏆</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:month.color, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
                  Month {month.id} Capstone Project
                </div>
                <div style={{ fontSize:18, fontWeight:800, color:T.t1, marginBottom:12, lineHeight:1.4 }}>
                  {month.capstone}
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontSize:12, color:T.t2, background:T.surface, padding:"4px 10px", borderRadius:6, border:`1px solid ${T.border}` }}>📦 GitHub repo</span>
                  <span style={{ fontSize:12, color:T.t2, background:T.surface, padding:"4px 10px", borderRadius:6, border:`1px solid ${T.border}` }}>📝 README + demo</span>
                  <span style={{ fontSize:12, color:T.amber, background:T.amber+"15", padding:"4px 10px", borderRadius:6, border:`1px solid ${T.amber}40` }}>
                    ⭐ {Math.round(month.totalXP * 0.4)} XP Reward
                  </span>
                </div>
                {!monthComplete && (
                  <div style={{ marginTop:12, fontSize:12, color:T.amber, background:T.amber+"12", padding:"8px 12px", borderRadius:8, border:`1px solid ${T.amber}30` }}>
                    ⚠️ Complete all weekly topics first before starting the capstone project.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================================================================
   DAILY TRACKER VIEW
=================================================================== */
const DailyTrackerView = ({ trackerData, saveTracker }) => {
  const [selWeek, setSelWeek] = useState(WEEKS_DATA[0]);
  const [selDay, setSelDay] = useState(1);
  const day = selWeek.days.find(d => d.n === selDay) || selWeek.days[0];
  const key = `${selWeek.id}-d${selDay}`;
  const entry = trackerData[key] || {};
  const update = (field, val) => saveTracker(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));

  const weekDays = selWeek.days.map(d => ({
    ...d, done: !!trackerData[`${selWeek.id}-d${d.n}`]?.completed?.trim()
  }));
  const doneCnt = weekDays.filter(d => d.done).length;
  const weekPct = Math.round(doneCnt / weekDays.length * 100);

  const fields = [
    { key:"planned",   label:"📋 What I planned to study",      placeholder:"e.g., " + day.plan },
    { key:"completed", label:"✅ What I actually completed",      placeholder:"What did you build/learn today?" },
    { key:"notes",     label:"📝 Notes, struggles & learnings",  placeholder:"What was confusing? What do you need to revisit?" },
  ];

  return (
    <div className="fade-up" style={{ padding:"clamp(14px,4vw,28px)" }}>
      <SectionHeader title="📅 Daily Tracker" sub="Track what you planned vs what you actually completed every day" />

      {/* Week selector */}
      <div style={{ marginBottom:12 }}>
        <div className="tab-bar">
          {WEEKS_DATA.map(w => (
            <button key={w.id} className={`tab-btn ${selWeek.id === w.id ? "active" : ""}`}
              onClick={() => { setSelWeek(w); setSelDay(1); }}>
              W{w.n}: {w.title.split(" ").slice(0,2).join(" ")}
            </button>
          ))}
        </div>
      </div>

      {/* Week progress bar */}
      <div className="card" style={{ padding:"12px 16px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:13, fontWeight:600, color:T.t1 }}>Week {selWeek.n} — {selWeek.title}</span>
          <span style={{ fontSize:13, fontWeight:700, color:selWeek.color }}>{weekPct}% ({doneCnt}/7 days)</span>
        </div>
        <div className="prog-track">
          <div className="prog-fill" style={{ width:`${weekPct}%`, background:selWeek.color, boxShadow:`0 0 8px ${selWeek.color}60` }} />
        </div>
      </div>

      {/* Day selector */}
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        {weekDays.map(d => (
          <button key={d.n} onClick={() => setSelDay(d.n)}
            style={{
              padding:"8px 14px", borderRadius:10, border:"1px solid",
              borderColor: selDay === d.n ? selWeek.color : T.border,
              background: selDay === d.n ? selWeek.color+"22" : T.card,
              color: d.done ? T.emerald : selDay === d.n ? T.t1 : T.t2,
              cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"'Outfit',sans-serif",
              display:"flex", alignItems:"center", gap:6,
              boxShadow: selDay === d.n ? `0 0 12px ${selWeek.color}30` : "none"
            }}>
            <span>{d.done ? "✅" : "○"}</span>
            <span>Day {d.n}</span>
          </button>
        ))}
      </div>

      <div className="g2">
        {/* Left: entry fields */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div className="card" style={{ padding:18, borderColor: selWeek.color+"30" }}>
            <div style={{ background:selWeek.color+"12", border:`1px solid ${selWeek.color}35`, borderRadius:10, padding:12, marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:selWeek.color, marginBottom:3 }}>
                Day {selDay}: {day.label}
              </div>
              <div style={{ fontSize:13, color:T.t1 }}>{day.plan}</div>
            </div>
            {fields.map(f => (
              <div key={f.key} style={{ marginBottom:12 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:T.t2, marginBottom:6, textTransform:"uppercase", letterSpacing:.8 }}>
                  {f.label}
                </label>
                <textarea className="inp" rows={3}
                  placeholder={f.placeholder}
                  value={entry[f.key] || ""}
                  onChange={e => update(f.key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: progress sheet */}
        <div>
          <div className="card" style={{ padding:18, marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:12, textTransform:"uppercase", letterSpacing:.8 }}>
              📊 Day Completion Sheet
            </div>
            {[
              { label:"Planned", done:!!entry.planned?.trim() },
              { label:"Completed", done:!!entry.completed?.trim() },
              { label:"Notes", done:!!entry.notes?.trim(), optional:true },
              { label:"Git Push", done:!!entry.pushed },
            ].map(item => (
              <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:13, color:T.t2 }}>{item.label}</span>
                <span style={{ fontSize:12, fontWeight:700, color: item.done ? T.emerald : item.optional ? T.t3 : T.red }}>
                  {item.done ? "✅ Done" : item.optional ? "⚪ Optional" : "❌ Missing"}
                </span>
              </div>
            ))}
            <div style={{ marginTop:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:600, color:T.t1 }}>Day Score</span>
                <span style={{ fontSize:13, fontWeight:800, color:T.emerald }}>
                  {Math.round(([entry.planned,entry.completed,entry.notes,entry.pushed?"x":""].filter(Boolean).length/4)*100)}%
                </span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width:`${Math.round(([entry.planned,entry.completed,entry.notes,entry.pushed?"x":""].filter(Boolean).length/4)*100)}%`, background:T.emerald }} />
              </div>
            </div>
            <button className="btn btn-success" style={{ marginTop:14, width:"100%", justifyContent:"center" }}
              onClick={() => update("pushed", !entry.pushed)}>
              {entry.pushed ? "✅ Pushed to GitHub!" : "📤 Mark Git Push Done"}
            </button>
          </div>

          <div className="card" style={{ padding:18 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:10, textTransform:"uppercase", letterSpacing:.8 }}>
              ⏱ Hours Studied
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[0.5,1,1.5,2,3,4].map(h => (
                <button key={h} onClick={() => update("hours", h)}
                  style={{
                    padding:"6px 14px", borderRadius:8, border:"1px solid",
                    borderColor: entry.hours === h ? T.purple : T.border,
                    background: entry.hours === h ? T.purple+"25" : T.surface,
                    color: entry.hours === h ? T.purple : T.t2,
                    cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"'Outfit',sans-serif"
                  }}>{h}h</button>
              ))}
            </div>
            {entry.hours && (
              <div style={{ marginTop:8, fontSize:12, color:T.emerald }}>
                ✅ {entry.hours} hours logged today
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================================================================
   CHALLENGES VIEW (with XP system + AI solutions)
=================================================================== */
const ChallengesView = ({ solvedChallenges, saveSolved, totalXP, saveXP }) => {
  const [diffFilter, setDiffFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [aiLoading, setAiLoading] = useState(null);
  const [aiSolutions, setAiSolutions] = useState({});

  const filtered = ALL_CHALLENGES.filter(c => {
    if (diffFilter !== "all" && c.diff !== diffFilter) return false;
    if (monthFilter !== "all" && c.month !== parseInt(monthFilter)) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const solvedCount = Object.values(solvedChallenges).filter(Boolean).length;
  const earnedXP = ALL_CHALLENGES.filter(c => solvedChallenges[c.id]).reduce((a, c) => a + c.xp, 0);

  const markSolved = (c) => {
    const wasSolved = solvedChallenges[c.id];
    saveSolved(prev => ({ ...prev, [c.id]: !prev[c.id] }));
    saveXP(prev => prev + (wasSolved ? -c.xp : c.xp));
  };

  const getAISolution = async (c) => {
    if (aiSolutions[c.id]) return;
    setAiLoading(c.id);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{ role:"user", content:`Solve this Python coding challenge cleanly:

Challenge: ${c.title}
Description: ${c.desc}

Provide:
1. Clean Python solution (well-commented)
2. Time complexity: O(?)
3. Space complexity: O(?)
4. Key insight in 1 sentence

Format as JSON:
{"code": "...", "time": "O(?)", "space": "O(?)", "insight": "..."}` }]
        })
      });
      const data = await res.json();
      const text = data.content.map(x=>x.text||"").join("").replace(/```json|```/g,"").trim();
      setAiSolutions(prev => ({ ...prev, [c.id]: JSON.parse(text) }));
    } catch { setAiSolutions(prev => ({ ...prev, [c.id]: { code:"# Error fetching solution", time:"N/A", space:"N/A", insight:"Try again." } })); }
    setAiLoading(null);
  };

  const diffCounts = { Easy:0, Medium:0, Hard:0 };
  ALL_CHALLENGES.forEach(c => diffCounts[c.diff]++);
  const solvedByDiff = { Easy:0, Medium:0, Hard:0 };
  ALL_CHALLENGES.filter(c => solvedChallenges[c.id]).forEach(c => solvedByDiff[c.diff]++);

  return (
    <div className="fade-up" style={{ padding:"clamp(14px,4vw,28px)" }}>
      <SectionHeader title="⚡ Coding Challenges" sub={`${solvedCount}/${ALL_CHALLENGES.length} solved · ${earnedXP} XP earned`}
        action={<XPBadge xp={earnedXP} />} />

      {/* Stats row */}
      <div className="g4" style={{ marginBottom:16 }}>
        {[
          { label:"🟢 Easy", total:diffCounts.Easy, solved:solvedByDiff.Easy, color:T.emerald },
          { label:"🟡 Medium", total:diffCounts.Medium, solved:solvedByDiff.Medium, color:T.amber },
          { label:"🔴 Hard", total:diffCounts.Hard, solved:solvedByDiff.Hard, color:T.red },
          { label:"⭐ Total XP", total:ALL_CHALLENGES.reduce((a,c)=>a+c.xp,0), solved:earnedXP, color:T.purple },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding:"12px 14px" }}>
            <div style={{ fontSize:12, color:T.t2, marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:18, fontWeight:800, color:s.color }}>{s.solved}<span style={{ fontSize:12, color:T.t2, fontWeight:400 }}>/{s.total}</span></div>
            <div className="prog-track" style={{ marginTop:6 }}>
              <div className="prog-fill" style={{ width:`${Math.round(s.solved/s.total*100)}%`, background:s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        <input className="inp" placeholder="🔍 Search challenges..." value={search}
          onChange={e=>setSearch(e.target.value)} style={{ flex:1, minWidth:180 }} />
        <div className="scroll-row">
          {["all","Easy","Medium","Hard"].map(d => (
            <button key={d} className={`btn ${diffFilter===d?"btn-primary":"btn-ghost"}`}
              style={{ padding:"8px 12px" }} onClick={()=>setDiffFilter(d)}>
              {d==="all"?"All":d==="Easy"?"🟢 Easy":d==="Medium"?"🟡 Medium":"🔴 Hard"}
            </button>
          ))}
        </div>
        <select value={monthFilter} onChange={e=>setMonthFilter(e.target.value)}
          style={{ background:T.card, border:`1px solid ${T.border}`, color:T.t1, borderRadius:8, padding:"8px 12px", fontFamily:"'Outfit',sans-serif", fontSize:13 }}>
          <option value="all">All Months</option>
          {CURRICULUM.map(m => <option key={m.id} value={m.id}>{m.emoji} M{m.id}: {m.title}</option>)}
        </select>
      </div>

      <div style={{ fontSize:12, color:T.t2, marginBottom:10 }}>Showing {filtered.length} challenges</div>

      {/* Challenge cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(c => {
          const solved = solvedChallenges[c.id];
          const ds = DIFF_STYLE[c.diff] || DIFF_STYLE.Easy;
          const expanded = expandedId === c.id;
          const sol = aiSolutions[c.id];
          return (
            <div key={c.id} className={`ch-card ${solved?"solved":""}`}>
              {/* Card header */}
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <div style={{ flex:1, cursor:"pointer" }} onClick={()=>setExpandedId(expanded?null:c.id)}>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:6 }}>
                    <span className={`badge ${ds.cls}`}>{c.diff}</span>
                    <span style={{ fontSize:11, background:c.monthColor+"18", color:c.monthColor, padding:"2px 8px", borderRadius:999, border:`1px solid ${c.monthColor}40`, fontWeight:600 }}>
                      {c.monthEmoji} M{c.month}
                    </span>
                    <span style={{ fontSize:14, fontWeight:700, color: solved ? T.emerald : T.t1 }}>
                      {solved && "✅ "}{c.title}
                    </span>
                    <XPBadge xp={c.xp} />
                  </div>
                  <p style={{ fontSize:13, color:T.t2, lineHeight:1.5 }}>{c.desc}</p>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                  <button className={`btn ${solved?"btn-success":"btn-ghost"}`}
                    style={{ padding:"6px 14px", fontSize:12 }}
                    onClick={()=>markSolved(c)}>
                    {solved ? "✅ Solved" : "○ Mark Solved"}
                  </button>
                  <button className="btn btn-ghost" style={{ padding:"6px 14px", fontSize:12 }}
                    onClick={()=>{ setExpandedId(c.id); getAISolution(c); }}
                    disabled={aiLoading === c.id}>
                    {aiLoading===c.id ? <><Spinner size={12}/> Solving...</> : "🤖 AI Solution"}
                  </button>
                </div>
              </div>

              {/* Expanded: hint */}
              {expanded && (
                <div style={{ marginTop:12, padding:"10px 14px", background:T.surface, borderRadius:8, border:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:T.t3, marginBottom:4, textTransform:"uppercase" }}>💡 Hint</div>
                  <p style={{ fontSize:13, color:T.t1, lineHeight:1.6 }}>{c.hint}</p>
                </div>
              )}

              {/* AI Solution */}
              {sol && (
                <div style={{ marginTop:12 }}>
                  <div style={{ display:"flex", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, background:"#0f1e0f", color:T.emerald, padding:"2px 8px", borderRadius:6, border:`1px solid #14532d`, fontWeight:700 }}>
                      ⏱ {sol.time}
                    </span>
                    <span style={{ fontSize:11, background:"#0a0a1e", color:T.blue, padding:"2px 8px", borderRadius:6, border:`1px solid #1e3a8a`, fontWeight:700 }}>
                      💾 {sol.space}
                    </span>
                    <span style={{ fontSize:12, color:T.amber }}>💡 {sol.insight}</span>
                  </div>
                  <pre className="code-block" style={{ fontSize:12 }}>{sol.code}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===================================================================
   WEEKEND VIEW
=================================================================== */
const WeekendView = () => {
  const [selMod, setSelMod] = useState(null);
  const [selTopic, setSelTopic] = useState(0);

  if (selMod) {
    const m = WEEKEND_MODULES.find(x => x.id === selMod);
    const t = m.topics[selTopic];
    return (
      <div className="fade-up" style={{ padding:"clamp(14px,4vw,28px)" }}>
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:20, flexWrap:"wrap" }}>
          <button className="btn btn-ghost" onClick={()=>setSelMod(null)}>← Back</button>
          <h2 className="sec-h" style={{ color:m.color }}>{m.emoji} {m.title}</h2>
          <span style={{ fontSize:11, color:T.t2, background:T.card, padding:"3px 10px", borderRadius:999, border:`1px solid ${T.border}` }}>📅 {m.day}</span>
        </div>
        <div style={{ display:"flex", gap:4, marginBottom:18, flexWrap:"wrap" }}>
          {m.topics.map((tp, i) => (
            <button key={i} className={`tab-btn ${selTopic===i?"active":""}`}
              style={selTopic===i?{color:m.color,background:m.color+"18"}:{}}
              onClick={()=>setSelTopic(i)}>{tp.title}</button>
          ))}
        </div>
        <div className="g2">
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:m.color, marginBottom:8 }}>{t.title}</div>
            <p style={{ fontSize:13, color:T.t2, lineHeight:1.7, marginBottom:16 }}>{t.content}</p>
            <div style={{ fontSize:11, fontWeight:700, color:T.t3, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Hands-on Exercises</div>
            {t.exercises.map((ex, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:8, padding:"8px 12px", background:T.surface, borderRadius:8 }}>
                <span style={{ color:m.color, fontWeight:700 }}>{i+1}.</span>
                <span style={{ fontSize:13, color:T.t1 }}>{ex}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="card" style={{ padding:18, marginBottom:12, borderColor:m.color+"40" }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>🏆 Weekend Challenge</div>
              <p style={{ fontSize:14, color:T.t1, lineHeight:1.6 }}>{m.challenge}</p>
            </div>
            <div className="card" style={{ padding:18 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>All Topics</div>
              {m.topics.map((tp, i) => (
                <div key={i} onClick={()=>setSelTopic(i)}
                  style={{ padding:"10px 12px", marginBottom:4, borderRadius:8, cursor:"pointer",
                    background: selTopic===i ? m.color+"18" : T.surface,
                    border: `1px solid ${selTopic===i ? m.color+"40" : "transparent"}` }}>
                  <div style={{ fontSize:13, fontWeight:600, color: selTopic===i ? m.color : T.t1 }}>{tp.title}</div>
                  <div style={{ fontSize:11, color:T.t2 }}>{tp.content.slice(0,50)}...</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up" style={{ padding:"clamp(14px,4vw,28px)" }}>
      <SectionHeader title="🗓️ Weekend Learning"
        sub="Git, DSA, LLM Architecture, Prompt Engineering, Open Source & System Design" />
      <div className="g2">
        {WEEKEND_MODULES.map(m => (
          <div key={m.id} onClick={()=>{ setSelMod(m.id); setSelTopic(0); }}
            style={{ background:"linear-gradient(135deg,#0b0b26,#0e0e30)", border:`1px solid ${T.border}`,
              borderRadius:14, padding:20, cursor:"pointer", transition:"all .25s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor=m.color+"60";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=T.border;}}>
            <div style={{ display:"flex", gap:12, marginBottom:10 }}>
              <span style={{ fontSize:34 }} className="float">{m.emoji}</span>
              <div>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:T.t1 }}>{m.title}</span>
                  <span style={{ fontSize:11, background:m.color+"20", color:m.color, padding:"2px 8px", borderRadius:999, fontWeight:700 }}>{m.day}</span>
                </div>
                <p style={{ fontSize:13, color:T.t2, lineHeight:1.5 }}>{m.description}</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {m.topics.map((t, i) => (
                <span key={i} style={{ fontSize:11, color:T.t2, background:"#06061a", padding:"2px 8px", borderRadius:6, border:`1px solid ${T.border}` }}>{t.title}</span>
              ))}
            </div>
            <div style={{ marginTop:12, display:"flex", justifyContent:"flex-end" }}>
              <span style={{ fontSize:12, color:m.color, fontWeight:700 }}>Start Module →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===================================================================
   AI MENTOR VIEW (Code Review + Progress Analysis)
=================================================================== */
const AIMentorView = ({ totalXP, solvedChallenges, trackerData }) => {
  const [tab, setTab] = useState("review");
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [lang, setLang] = useState("Python");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const fileRef = useRef();

  const handleFile = f => {
    if (!f) return;
    setFileName(f.name);
    const r = new FileReader();
    r.onload = e => setCode(e.target.result);
    r.readAsText(f);
  };

  const analyzeCode = async () => {
    if (!code.trim()) { alert("Paste or upload code first!"); return; }
    setLoading(true); setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1800,
          messages:[{ role:"user", content:`You are an expert code reviewer. Analyze this ${lang} code:

\`\`\`${lang.toLowerCase()}
${code}
\`\`\`

Respond ONLY with valid JSON:
{
  "overall_score": 0-100,
  "correctness_score": 0-100,
  "quality_score": 0-100,
  "originality_score": 0-100,
  "is_correct": true/false,
  "correctness_explanation": "brief",
  "is_human_written": true/false,
  "writing_analysis": "brief analysis",
  "strengths": ["3 strengths"],
  "improvements": ["3 improvements"],
  "bugs": ["bugs if any, else empty array"],
  "next_steps": ["2 learning recommendations"],
  "summary": "2-3 sentence assessment"
}` }]
        })
      });
      const data = await res.json();
      const text = data.content.map(x=>x.text||"").join("").replace(/```json|```/g,"").trim();
      setResult(JSON.parse(text));
    } catch { alert("Review failed. Please try again."); }
    setLoading(false);
  };

  const analyzeProgress = async () => {
    setAnalysisLoading(true); setAnalysis(null);
    const solvedCount = Object.values(solvedChallenges).filter(Boolean).length;
    const trackedDays = Object.values(trackerData).filter(d=>d.completed?.trim()).length;
    const lvl = getLevel(totalXP);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1200,
          messages:[{ role:"user", content:`You are a personalized AI learning coach for a Python/AI engineering student.

Student stats:
- Total XP: ${totalXP}
- Level: ${lvl.level} (${lvl.title})
- Challenges solved: ${solvedCount}/${ALL_CHALLENGES.length}
- Days tracked: ${trackedDays}

Based on these stats, respond ONLY with valid JSON:
{
  "headline": "one compelling sentence assessment",
  "overall_assessment": "2-3 sentences on overall progress",
  "momentum": "Excellent|Good|Building|Needs Boost",
  "strong_areas": ["2-3 things going well"],
  "weak_areas": ["2-3 areas to improve"],
  "action_items": ["3 specific things to do this week"],
  "next_focus": "what to focus on next",
  "job_ready_estimate": "X months",
  "motivational_message": "personal, encouraging closing message"
}` }]
        })
      });
      const data = await res.json();
      const text = data.content.map(x=>x.text||"").join("").replace(/```json|```/g,"").trim();
      setAnalysis(JSON.parse(text));
    } catch { alert("Analysis failed. Please try again."); }
    setAnalysisLoading(false);
  };

  const ScoreBar = ({ label, val, color }) => (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:13, color:T.t2 }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:700, color }}>{val}/100</span>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{ width:`${val}%`, background:color, boxShadow:`0 0 6px ${color}60` }} />
      </div>
    </div>
  );

  return (
    <div className="fade-up" style={{ padding:"clamp(14px,4vw,28px)" }}>
      <SectionHeader title="🤖 AI Mentor" sub="Code review, progress analysis & personalized learning guidance" />

      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:`1px solid ${T.border}`, paddingBottom:4 }}>
        {[
          { id:"review", label:"💻 Code Review" },
          { id:"progress", label:"📈 Progress Analysis" },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${tab===t.id?"active":""}`}
            style={tab===t.id?{color:T.cyan,background:T.cyan+"15"}:{}}
            onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── CODE REVIEW TAB ── */}
      {tab === "review" && (
        <div className="g2" style={{ alignItems:"start" }}>
          <div>
            <div className="upload-zone" style={{ marginBottom:12 }}
              onClick={()=>fileRef.current?.click()}
              onDragOver={e=>{e.preventDefault();setDragging(true)}}
              onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0])}}
            >
              <div style={{ fontSize:32, marginBottom:8 }}>📂</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.t1, marginBottom:4 }}>{fileName||"Drop your code file here"}</div>
              <div style={{ fontSize:12, color:T.t2 }}>or click to browse · .py .js .ts .cpp .java</div>
              <input ref={fileRef} type="file" style={{ display:"none" }} accept=".py,.js,.ts,.cpp,.java,.txt" onChange={e=>handleFile(e.target.files[0])} />
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
              <span style={{ fontSize:13, color:T.t2 }}>Language:</span>
              <select value={lang} onChange={e=>setLang(e.target.value)}
                style={{ background:T.card, border:`1px solid ${T.border}`, color:T.t1, borderRadius:8, padding:"6px 10px", fontFamily:"'Outfit',sans-serif", fontSize:13 }}>
                {["Python","JavaScript","TypeScript","Java","C++","C"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <textarea className="inp mono" rows={14}
              placeholder={`# Paste your ${lang} code here...\n\ndef solution():\n    pass`}
              value={code} onChange={e=>setCode(e.target.value)}
              style={{ fontSize:12, lineHeight:1.7, marginBottom:12 }} />
            <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:12 }}
              onClick={analyzeCode} disabled={loading||!code.trim()}>
              {loading ? <><Spinner /> Analyzing...</> : "🤖 Review My Code"}
            </button>
          </div>

          <div>
            {!result && !loading && (
              <div style={{ textAlign:"center", padding:"60px 20px", color:T.t3 }}>
                <div style={{ fontSize:56, marginBottom:12 }}>🤖</div>
                <div style={{ fontSize:14, fontWeight:600, color:T.t2 }}>Ready to Review</div>
                <div style={{ fontSize:13, color:T.t3, marginTop:4 }}>Paste code or upload a file</div>
              </div>
            )}
            {loading && (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{ fontSize:40, marginBottom:12 }} className="float">🔍</div>
                <div style={{ fontSize:14, color:T.t2 }}>Analyzing your code...</div>
              </div>
            )}
            {result && (
              <div>
                <div className="card" style={{ padding:20, marginBottom:12, textAlign:"center" }}>
                  <div style={{ fontSize:52, fontWeight:900, background:
                    result.overall_score>=80?"linear-gradient(135deg,#10b981,#4ade80)":
                    result.overall_score>=60?"linear-gradient(135deg,#f59e0b,#fbbf24)":
                    "linear-gradient(135deg,#ef4444,#f87171)",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                    {result.overall_score}
                  </div>
                  <div style={{ fontSize:12, color:T.t2 }}>Overall Score / 100</div>
                  <p style={{ fontSize:13, color:T.t1, lineHeight:1.5, marginTop:8 }}>{result.summary}</p>
                </div>
                <div className="rev-sec">
                  <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Score Breakdown</div>
                  <ScoreBar label="✅ Correctness" val={result.correctness_score} color={T.emerald} />
                  <ScoreBar label="✍️ Originality" val={result.originality_score} color={T.blue} />
                  <ScoreBar label="⭐ Code Quality" val={result.quality_score} color={T.purple} />
                </div>
                <div className="g2" style={{ marginBottom:10 }}>
                  <div className="rev-sec" style={{ margin:0 }}>
                    <div style={{ fontSize:11, fontWeight:700, color: result.is_correct ? T.emerald : T.red, marginBottom:5 }}>
                      {result.is_correct ? "✅ Code is Correct" : "❌ Has Issues"}
                    </div>
                    <p style={{ fontSize:12, color:T.t2, lineHeight:1.5 }}>{result.correctness_explanation}</p>
                  </div>
                  <div className="rev-sec" style={{ margin:0 }}>
                    <div style={{ fontSize:11, fontWeight:700, color: result.is_human_written ? T.emerald : T.amber, marginBottom:5 }}>
                      {result.is_human_written ? "👤 Looks Human-Written" : "⚠️ May Not Be Original"}
                    </div>
                    <p style={{ fontSize:12, color:T.t2, lineHeight:1.5 }}>{result.writing_analysis}</p>
                  </div>
                </div>
                {result.strengths?.length>0 && (
                  <div className="rev-sec">
                    <div style={{ fontSize:11, fontWeight:700, color:T.emerald, marginBottom:8 }}>💪 Strengths</div>
                    {result.strengths.map((s,i)=>(
                      <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                        <span style={{ color:T.emerald }}>✓</span>
                        <span style={{ fontSize:13, color:T.t1 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
                {result.improvements?.length>0 && (
                  <div className="rev-sec">
                    <div style={{ fontSize:11, fontWeight:700, color:T.amber, marginBottom:8 }}>🔧 Improvements</div>
                    {result.improvements.map((s,i)=>(
                      <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                        <span style={{ color:T.amber }}>→</span>
                        <span style={{ fontSize:13, color:T.t1 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
                {result.bugs?.filter(Boolean).length>0 && (
                  <div className="rev-sec">
                    <div style={{ fontSize:11, fontWeight:700, color:T.red, marginBottom:8 }}>🐛 Bugs</div>
                    {result.bugs.filter(Boolean).map((s,i)=>(
                      <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                        <span style={{ color:T.red }}>!</span>
                        <span style={{ fontSize:13, color:T.t1 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
                {result.next_steps?.length>0 && (
                  <div className="rev-sec">
                    <div style={{ fontSize:11, fontWeight:700, color:T.purple, marginBottom:8 }}>📚 Next Steps</div>
                    {result.next_steps.map((s,i)=>(
                      <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                        <span style={{ color:T.purple }}>→</span>
                        <span style={{ fontSize:13, color:T.t2 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROGRESS ANALYSIS TAB ── */}
      {tab === "progress" && (
        <div>
          <div className="card" style={{ padding:"24px", marginBottom:16, textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }} className="float">📈</div>
            <div style={{ fontSize:18, fontWeight:800, color:T.t1, marginBottom:6 }}>AI Progress Analysis</div>
            <p style={{ fontSize:13, color:T.t2, lineHeight:1.6, maxWidth:500, margin:"0 auto 20px" }}>
              Get personalized feedback on your learning journey based on your XP, challenges solved, and daily tracking data.
            </p>
            <button className="btn btn-primary" style={{ padding:"12px 28px" }}
              onClick={analyzeProgress} disabled={analysisLoading}>
              {analysisLoading ? <><Spinner /> Analyzing your journey...</> : "✨ Analyze My Progress"}
            </button>
          </div>

          {analysis && (
            <div className="fade-in">
              {/* Headline */}
              <div className="card card-glow-cyan" style={{ padding:"20px 24px", marginBottom:14, textAlign:"center" }}>
                <div style={{ fontSize:16, fontWeight:700, color:T.cyan, marginBottom:4 }}>{analysis.headline}</div>
                <p style={{ fontSize:13, color:T.t2, lineHeight:1.6 }}>{analysis.overall_assessment}</p>
                <div style={{ marginTop:10, display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:11, color:T.t2 }}>Momentum</div>
                    <div style={{ fontSize:14, fontWeight:800, color:
                      analysis.momentum==="Excellent"?T.emerald:
                      analysis.momentum==="Good"?T.blue:
                      analysis.momentum==="Building"?T.amber:T.red }}>
                      {analysis.momentum}
                    </div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:11, color:T.t2 }}>Job-Ready In</div>
                    <div style={{ fontSize:14, fontWeight:800, color:T.purple }}>{analysis.job_ready_estimate}</div>
                  </div>
                </div>
              </div>

              <div className="g2" style={{ marginBottom:14 }}>
                <div className="card" style={{ padding:18 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.emerald, marginBottom:10, textTransform:"uppercase", letterSpacing:.8 }}>
                    💪 Strong Areas
                  </div>
                  {analysis.strong_areas?.map((s,i)=>(
                    <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
                      <span style={{ color:T.emerald }}>✓</span>
                      <span style={{ fontSize:13, color:T.t1 }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ padding:18 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.amber, marginBottom:10, textTransform:"uppercase", letterSpacing:.8 }}>
                    🎯 Focus Areas
                  </div>
                  {analysis.weak_areas?.map((s,i)=>(
                    <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
                      <span style={{ color:T.amber }}>→</span>
                      <span style={{ fontSize:13, color:T.t1 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding:18, marginBottom:14 }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.purple, marginBottom:10, textTransform:"uppercase", letterSpacing:.8 }}>
                  ⚡ This Week's Action Items
                </div>
                {analysis.action_items?.map((s,i)=>(
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:8, padding:"8px 12px", background:T.surface, borderRadius:8 }}>
                    <span style={{ fontWeight:800, color:T.purple }}>{i+1}.</span>
                    <span style={{ fontSize:13, color:T.t1 }}>{s}</span>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding:18, borderColor:T.cyan+"40", background:`linear-gradient(135deg,#06061a,#080828)` }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.cyan, marginBottom:6, textTransform:"uppercase", letterSpacing:.8 }}>
                  💬 Next Focus: {analysis.next_focus}
                </div>
                <p style={{ fontSize:14, color:T.t1, lineHeight:1.6, fontStyle:"italic" }}>"{analysis.motivational_message}"</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ===================================================================
   ML PATH VIEW (Post-6-month transition guide)
=================================================================== */
const MLPathView = () => {
  const [activeModule, setActiveModule] = useState(0);

  const ML_MODULES = [
    {
      id:0, emoji:"🔢", title:"ML Foundations", color:"#3b82f6",
      desc:"The mathematical and conceptual foundations of machine learning",
      topics:["Linear algebra for ML (vectors, matrices, eigenvalues)","Calculus: gradients, chain rule, optimization","Probability & statistics: distributions, Bayes theorem","Information theory: entropy, KL divergence","Numpy & scipy for numerical computing"],
      resources:["fast.ai Practical Deep Learning (free)","Stanford CS229 lecture notes","3Blue1Brown Linear Algebra series","Andrej Karpathy's YouTube lectures"],
      project:"Implement linear regression, logistic regression, and k-means from scratch using only NumPy.",
      xp:600,
    },
    {
      id:1, emoji:"🧠", title:"Deep Learning", color:"#a855f7",
      desc:"Neural networks, backpropagation, and modern deep learning architectures",
      topics:["Feedforward networks, activation functions","Backpropagation math & implementation","CNNs, RNNs, LSTMs & Transformers","Batch norm, dropout, residual connections","PyTorch Lightning & training at scale"],
      resources:["fast.ai Part 2: Deep Learning from the Foundations","Goodfellow's Deep Learning book (free PDF)","PyTorch official tutorials","Andrej Karpathy's 'Neural Networks: Zero to Hero'"],
      project:"Build a character-level language model from scratch using backpropagation. Then upgrade to a mini GPT.",
      xp:700,
    },
    {
      id:2, emoji:"🌐", title:"Advanced NLP & LLMs", color:"#10b981",
      desc:"From BERT to GPT — deep understanding of modern language models",
      topics:["Attention is All You Need — implement from scratch","BERT: pre-training & fine-tuning in depth","GPT architecture: autoregressive generation","Instruction tuning & RLHF deep dive","Efficient fine-tuning: LoRA, QLoRA, PEFT"],
      resources:["Hugging Face NLP Course (free)","Annotated Transformer (Harvard NLP)","LLM University by Cohere","Sebastian Ruder's NLP Progress"],
      project:"Fine-tune a small LLM (Phi-2 or Mistral-7B) on a custom dataset using QLoRA. Evaluate with standard benchmarks.",
      xp:800,
    },
    {
      id:3, emoji:"⚙️", title:"MLOps & Research", color:"#f59e0b",
      desc:"Production ML systems, research skills, and contributing to the field",
      topics:["Experiment tracking: MLflow, W&B","Data versioning: DVC, LakeFS","Model serving: Triton, BentoML, Ray Serve","Distributed training: FSDP, DeepSpeed","Reading & implementing research papers"],
      resources:["Full Stack Deep Learning (free)","Made With ML MLOps course","ML Engineering by Andriy Burkov","arXiv Sanity Preserver"],
      project:"Build a full ML pipeline: experiment tracking → model registry → CI/CD → production serving → monitoring.",
      xp:900,
    },
  ];

  const module = ML_MODULES[activeModule];

  const path = [
    { step:1, label:"Python + LLMs", color:"#3b82f6", emoji:"🐍", done:true },
    { step:2, label:"AI Engineering", color:"#10b981", emoji:"🧠", done:true },
    { step:3, label:"ML Foundations", color:"#a855f7", emoji:"📐", done:false },
    { step:4, label:"Deep Learning", color:"#f59e0b", emoji:"🔥", done:false },
    { step:5, label:"NLP Research", color:"#ec4899", emoji:"📜", done:false },
    { step:6, label:"AI Scientist", color:"#00d4ff", emoji:"🌌", done:false },
  ];

  return (
    <div className="fade-up" style={{ padding:"clamp(14px,4vw,28px)" }}>
      <SectionHeader title="🌌 ML Transition Path" sub="After 6 months of Python + AI Engineering, here's your ML journey" />

      {/* Learning path visualization */}
      <div className="card" style={{ padding:"20px 24px", marginBottom:20, overflow:"hidden" }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.t2, marginBottom:16, textTransform:"uppercase", letterSpacing:1 }}>
          Your Full Learning Journey
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:0, overflowX:"auto", paddingBottom:4 }}>
          {path.map((p, i) => (
            <div key={p.step} style={{ display:"flex", alignItems:"center" }}>
              <div style={{ textAlign:"center", flexShrink:0 }}>
                <div style={{
                  width:48, height:48, borderRadius:"50%", margin:"0 auto 6px",
                  background: p.done ? p.color+"30" : "#0a0a20",
                  border: `2px solid ${p.done ? p.color : T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22, boxShadow: p.done ? `0 0 14px ${p.color}40` : "none"
                }}>{p.emoji}</div>
                <div style={{ fontSize:10, fontWeight:700, color: p.done ? p.color : T.t3, whiteSpace:"nowrap", maxWidth:60, textAlign:"center" }}>
                  {p.label}
                </div>
                {p.done && <div style={{ fontSize:9, color:T.emerald, marginTop:2 }}>✅ Done</div>}
              </div>
              {i < path.length-1 && (
                <div style={{
                  width:"clamp(20px,4vw,50px)", height:2, flexShrink:0, margin:"0 4px",
                  background: p.done && path[i+1].done ? `linear-gradient(90deg,${p.color},${path[i+1].color})` : T.border
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Module tabs */}
      <div className="scroll-row" style={{ marginBottom:16 }}>
        {ML_MODULES.map((m, i) => (
          <button key={m.id} onClick={()=>setActiveModule(i)}
            style={{
              flex:"0 0 auto", padding:"8px 16px", borderRadius:10, border:"1px solid",
              borderColor: activeModule===i ? m.color : T.border,
              background: activeModule===i ? m.color+"22" : T.card,
              color: activeModule===i ? m.color : T.t2,
              cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13,
              display:"flex", alignItems:"center", gap:7, transition:"all .2s"
            }}>
            <span>{m.emoji}</span>
            <span>{m.title}</span>
          </button>
        ))}
      </div>

      {/* Module detail */}
      <div className="card" style={{ padding:"20px 24px", marginBottom:14, borderColor:module.color+"40", boxShadow:`0 0 20px ${module.color}15` }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14, flexWrap:"wrap" }}>
          <span style={{ fontSize:44 }} className="float">{module.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:20, fontWeight:800, color:T.t1, marginBottom:4 }}>{module.title}</div>
            <p style={{ fontSize:13, color:T.t2, lineHeight:1.6, marginBottom:10 }}>{module.desc}</p>
            <span style={{ fontSize:12, fontWeight:700, color:T.amber, background:T.amber+"15", padding:"3px 12px", borderRadius:999, border:`1px solid ${T.amber}40` }}>
              {module.xp} XP reward
            </span>
          </div>
        </div>
      </div>

      <div className="g2">
        {/* Topics */}
        <div>
          <div className="card" style={{ padding:18, marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>
              📋 Core Topics
            </div>
            {module.topics.map((t, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:8, padding:"8px 12px", background:T.surface, borderRadius:8, border:`1px solid ${T.border}` }}>
                <span style={{ color:module.color, fontWeight:700, flexShrink:0 }}>{i+1}.</span>
                <span style={{ fontSize:13, color:T.t1 }}>{t}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding:18 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>
              📚 Best Resources
            </div>
            {module.resources.map((r, i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
                <span style={{ color:module.color }}>▸</span>
                <span style={{ fontSize:13, color:T.t2 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capstone + Prerequisites */}
        <div>
          <div className="card" style={{ padding:20, marginBottom:12, borderColor:module.color+"40" }}>
            <div style={{ fontSize:12, fontWeight:700, color:module.color, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>
              🏆 Module Project
            </div>
            <p style={{ fontSize:14, color:T.t1, lineHeight:1.7 }}>{module.project}</p>
          </div>

          <div className="card" style={{ padding:18 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.t2, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>
              ✅ Prerequisites from Your Journey
            </div>
            {[
              "Python proficiency (Months 1-2) ✅",
              "LLM APIs & embeddings (Month 3) ✅",
              "RAG & AI Engineering (Month 4) ✅",
              "Production deployment (Month 6) ✅",
            ].map((p, i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom:6, fontSize:13, color:T.emerald }}>
                <span>✅</span><span>{p.replace(" ✅","")}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop:12, padding:"16px 18px", background:"linear-gradient(135deg,#06061a,#08082a)", border:`1px solid ${T.cyan}30`, borderRadius:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.cyan, marginBottom:6 }}>🌌 Career Paths After This</div>
            {["ML Engineer at FAANG","AI Research Scientist","LLM Fine-tuning Specialist","AI Product Engineer","ML Infrastructure Engineer"].map((p,i)=>(
              <div key={i} style={{ fontSize:12, color:T.t2, padding:"3px 0", display:"flex", gap:6 }}>
                <span style={{ color:T.cyan }}>→</span><span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================================================================
   MAIN APP
=================================================================== */
export default function PythonAIPlatform() {
  const [nav, setNav] = useState("dashboard");
  const [trackerData, saveTracker, trackerLoaded] = useStorage("tracker-v2", {});
  const [solvedChallenges, saveSolved] = useStorage("challenges-v3", {});
  const [challengeXP, saveChallengeXP] = useStorage("xp-challenges-v3", 0);

  const totalXP = challengeXP;
  const solvedCount = Object.values(solvedChallenges).filter(Boolean).length;
  const streak = 3; // Could be derived from trackerData in future

  const views = {
    dashboard:  <DashboardView trackerData={trackerData} solvedChallenges={solvedChallenges} totalXP={totalXP} />,
    roadmap:    <RoadmapView />,
    tracker:    <DailyTrackerView trackerData={trackerData} saveTracker={saveTracker} />,
    challenges: <ChallengesView solvedChallenges={solvedChallenges} saveSolved={saveSolved} totalXP={totalXP} saveXP={saveChallengeXP} />,
    weekend:    <WeekendView />,
    mentor:     <AIMentorView totalXP={totalXP} solvedChallenges={solvedChallenges} trackerData={trackerData} />,
    mlpath:     <MLPathView />,
  };

  return (
    <div className="app">
      <style>{GLOBAL_STYLES}</style>
      <AppHeader totalXP={totalXP} streak={streak} solvedCount={solvedCount} />
      <div className="layout">
        <Sidebar active={nav} onNav={setNav} totalXP={totalXP} solvedCount={solvedCount} />
        <div className="main-content" style={{ paddingBottom:80 }}>
          {!trackerLoaded
            ? <div style={{ display:"flex", justifyContent:"center", padding:80, color:T.t3 }}><Spinner size={32}/></div>
            : (views[nav] || views.dashboard)
          }
        </div>
      </div>
      <MobileNav active={nav} onNav={setNav} />
    </div>
  );
}
