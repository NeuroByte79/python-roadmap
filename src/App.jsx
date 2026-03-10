import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN SYSTEM — "Neon Terminal Editorial"
   Deep void backgrounds · acid-green terminal accents · Bebas Neue display
   type · Instrument Serif italics · DM Mono body · glassmorphism cards ·
   animated mesh orbs · micro-interactions on everything.
───────────────────────────────────────────────────────────────────────────── */

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');`;

const T = {
  void:    "#03030a",
  deep:    "#07071a",
  surface: "#0c0c22",
  card:    "#10102a",
  glass:   "rgba(16,16,42,0.7)",
  rim:     "#1c1c3e",
  rimHi:   "#2e2e60",
  l1c:"#00ffc8", l1g:"rgba(0,255,200,0.15)",   l1s:"rgba(0,255,200,0.04)",
  l2c:"#b87fff", l2g:"rgba(184,127,255,0.15)", l2s:"rgba(184,127,255,0.04)",
  l3c:"#ff9f43", l3g:"rgba(255,159,67,0.15)",  l3s:"rgba(255,159,67,0.04)",
  l4c:"#ff4d7c", l4g:"rgba(255,77,124,0.15)",  l4s:"rgba(255,77,124,0.04)",
  l5c:"#fcdc4d", l5g:"rgba(252,220,77,0.15)",  l5s:"rgba(252,220,77,0.04)",
  ink:"#eeeef8", mid:"#9090b8", dim:"#45456a",
  ok:"#00ffc8",  undo:"#ff9f43",
};

const LEVELS = [
  { id:1, icon:"01", emoji:"◈", label:"Python Basics",
    caption:"Variables · Loops · Strings · Patterns",
    desc:"Master the absolute fundamentals. Build fluency with Python syntax, control flow, and string manipulation through 500 progressively harder variations.",
    color:T.l1c, glow:T.l1g, subtle:T.l1s, total:500,
    topics:["Even / Odd Check","Factorial","Fibonacci Sequence","Prime Check","Reverse Digits","Digit Count","Digit Sum","Palindrome Number","Largest of Three","Multiplication Table","Celsius → Fahrenheit","Vowel Count","Reverse String","Palindrome String","Word Count","ASCII Value","Remove Spaces","Replace Character","Star Pyramid","Print 1 to N"],
    skills:["Variables & Types","Conditionals","For / While Loops","String Methods","Basic Math","Pattern Printing"],
  },
  { id:2, icon:"02", emoji:"◈", label:"Data Structures",
    caption:"Lists · Dicts · Sets · Tuples",
    desc:"Unlock Python's core containers. Learn to manipulate, transform and query data with idiomatic Python — comprehensions, sorting, and set operations.",
    color:T.l2c, glow:T.l2g, subtle:T.l2s, total:500,
    topics:["Min in List","Second Largest","Remove Duplicates","Merge Lists","Intersection","Union","Rotate List","Frequency Count","Sort Ascending","Sort Descending","Flatten Nested","Split to Words","Join Words","Longest Word","Dict from Lists","Sort Dict by Value","Char Frequency","Unique with Set","Subset Check","Max in List"],
    skills:["Lists & Slicing","Dictionaries","Sets & Frozensets","Tuples","List Comprehensions","Sorting & Searching"],
  },
  { id:3, icon:"03", emoji:"◈", label:"Advanced Python",
    caption:"OOP · Decorators · Generators · File I/O",
    desc:"Level up with Python's power features. Write elegant classes, craft reusable decorators, build memory-efficient generators, and handle files and JSON.",
    color:T.l3c, glow:T.l3g, subtle:T.l3s, total:500,
    topics:["BankAccount Class","Inheritance","Override Method","Class Variables","Static Methods","Log Decorator","Timing Decorator","Auth Decorator","Fibonacci Generator","Even Number Gen","Custom Iterator","Read & Count Words","Append to File","Exception Handling","Custom Exception","Read JSON","Write JSON","Context Manager","Logging System","Student Class"],
    skills:["OOP & Classes","Inheritance","Decorators","Generators & Yield","File I/O","Exception Handling"],
  },
  { id:4, icon:"04", emoji:"◈", label:"Algorithms & DSA",
    caption:"Sorting · Searching · Trees · Linked Lists",
    desc:"Think algorithmically. Implement classic data structures from scratch to develop the problem-solving instincts every senior dev needs.",
    color:T.l4c, glow:T.l4g, subtle:T.l4s, total:500,
    topics:["Binary Search","Bubble Sort","Selection Sort","Insertion Sort","Merge Sort","Quick Sort","Stack with List","Queue with List","Circular Queue","Insert Linked Node","Delete Linked Node","Reverse Linked List","Middle of List","Detect Cycle","Inorder Traversal","Preorder Traversal","Postorder Traversal","Tree Height","BFS Traversal","Linear Search"],
    skills:["Big-O Complexity","Sorting Algorithms","Search Algorithms","Stacks & Queues","Linked Lists","Trees & Graphs"],
  },
  { id:5, icon:"05", emoji:"◈", label:"Real Python Systems",
    caption:"APIs · Automation · Scrapers · CLI Tools",
    desc:"Ship real software. Build web scrapers, REST APIs, CLI tools, automation scripts, and mini-systems that solve actual problems.",
    color:T.l5c, glow:T.l5g, subtle:T.l5s, total:500,
    topics:["Scrape News Titles","FastAPI REST","Login API","File Organizer","Password Generator","CLI Todo App","Simple Chatbot","Email Automation","Weather API Client","File Search Tool","Log Analyzer","URL Shortener","Markdown → HTML","CSV Analyzer","Backup Script","Recommendation System","Stock Tracker","CLI Password Mgr","Multiplayer TicTacToe","Web Scraper"],
    skills:["Web Scraping","REST APIs","CLI Tools","File Automation","Testing Basics","Deployment"],
  },
];

const MILESTONES = [
  {icon:"🌱",label:"First Step",   at:1,    color:T.l1c},
  {icon:"⚡",label:"Sparked",      at:50,   color:T.l2c},
  {icon:"🔥",label:"On Fire",      at:200,  color:T.l3c},
  {icon:"💎",label:"250 Club",     at:250,  color:T.l4c},
  {icon:"🚀",label:"Halfway",      at:1250, color:T.l2c},
  {icon:"⭐",label:"Star Coder",   at:1750, color:T.l1c},
  {icon:"👑",label:"Elite",        at:2000, color:T.l5c},
  {icon:"🏆",label:"Python Master",at:2500, color:"#FFD700"},
];

/* ── storage ── */
const SKEY = "pyroad_v3";
const load = () => { try { return JSON.parse(localStorage.getItem(SKEY))||{}; } catch { return {}; } };
const persist = s => { try { localStorage.setItem(SKEY, JSON.stringify(s)); } catch {} };

function boot() {
  const s = load();
  return { done:s.done||{}, streak:s.streak||0, lastDay:s.lastDay||null,
           activity:s.activity||{}, notes:s.notes||"",
           todayIds:s.todayIds||null, todayDate:s.todayDate||null, xp:s.xp||0 };
}

const toDate = () => new Date().toISOString().split("T")[0];
const lvDone = (s,id) => Object.keys(s.done).filter(k=>k.startsWith(`L${id}_`)&&s.done[k]).length;
const allDone = s => Object.values(s.done).filter(Boolean).length;

function tasksFor(li) {
  const lv = LEVELS[li];
  return Array.from({length:lv.total},(_,i)=>({
    id:`L${lv.id}_${i+1}`, num:i+1,
    name: lv.topics[i % lv.topics.length],
  }));
}

/* ══════════════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [st,  setSt]  = useState(boot);
  const [view,setView]= useState("roadmap");
  const [alv, setAlv] = useState(null);
  const [q,   setQ]   = useState("");
  const [flt, setFlt] = useState("all");
  const [toast,setToast] = useState(null);
  const tRef = useRef();

  useEffect(()=>{ persist(st); },[st]);
  useEffect(()=>{
    setSt(prev=>{
      const td=toDate(), yd=new Date(Date.now()-86400000).toISOString().split("T")[0];
      if(prev.lastDay===td) return prev;
      return {...prev,streak:prev.lastDay===yd?prev.streak+1:1,lastDay:td};
    });
  },[]);

  const pop = (msg,kind="ok") => {
    clearTimeout(tRef.current);
    setToast({msg,kind});
    tRef.current = setTimeout(()=>setToast(null),2400);
  };

  const toggle = useCallback(id => {
    setSt(prev=>{
      const was=!!prev.done[id], td=toDate();
      const act={...prev.activity,[td]:Math.max(0,(prev.activity[td]||0)+(was?-1:1))};
      return{...prev,done:{...prev.done,[id]:!was},activity:act,xp:prev.xp+(was?-10:10)};
    });
  },[]);

  const genToday = useCallback(()=>{
    const picks=[];
    LEVELS.forEach((_,i)=>{
      const pend=tasksFor(i).filter(t=>!st.done[t.id]).sort(()=>Math.random()-.5);
      picks.push(...pend.slice(0,2));
    });
    const extra=LEVELS.flatMap((_,i)=>tasksFor(i).filter(t=>!st.done[t.id]&&!picks.find(p=>p.id===t.id))).sort(()=>Math.random()-.5);
    picks.push(...extra);
    setSt(prev=>({...prev,todayIds:picks.slice(0,10).map(t=>t.id),todayDate:toDate()}));
  },[st.done]);

  const total=allDone(st), pct=Math.round(total/2500*100);
  const shared={st,setSt,total,pct,toggle,pop,setView,setAlv,toast};

  return (
    <>
      <style>{FONTS+CSS}</style>
      {view==="roadmap" && <RoadmapView {...shared}/>}
      {view==="level"   && alv!==null && <LevelView {...shared} lv={LEVELS[alv]} lvIdx={alv} q={q} setQ={setQ} flt={flt} setFlt={setFlt}/>}
      {view==="today"   && <TodayView  {...shared} genToday={genToday}/>}
      {view==="stats"   && <StatsView  {...shared}/>}
    </>
  );
}

/* ── Global CSS ────────────────────────────────────────────────────────────── */
const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:${T.void};color:${T.ink};font-family:'DM Mono',monospace;}

  @keyframes fadeUp  {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
  @keyframes float   {0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes pulse   {0%,100%{opacity:.45}50%{opacity:1}}
  @keyframes glow    {0%,100%{box-shadow:0 0 8px -2px var(--gc,#00ffc8)}50%{box-shadow:0 0 26px 2px var(--gc,#00ffc8)}}
  @keyframes toastIn {from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes scanH   {from{transform:translateX(-100%)}to{transform:translateX(100%)}}

  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:${T.deep};}
  ::-webkit-scrollbar-thumb{background:${T.rimHi};border-radius:4px;}

  .display{font-family:'Bebas Neue',sans-serif;letter-spacing:.04em;}
  .serif{font-family:'Instrument Serif',serif;}
  .mono{font-family:'DM Mono',monospace;}

  .glass-card{
    background:${T.glass};border:1px solid ${T.rim};border-radius:16px;
    backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
    transition:border-color .2s,box-shadow .25s,transform .22s;
  }
  .glass-card:hover{border-color:${T.rimHi};}

  .btn{
    display:inline-flex;align-items:center;gap:6px;
    padding:8px 18px;border-radius:9px;border:1px solid ${T.rim};
    background:${T.card};color:${T.mid};font-family:'DM Mono',monospace;
    font-size:11px;cursor:pointer;transition:all .15s;white-space:nowrap;
    letter-spacing:.04em;
  }
  .btn:hover{border-color:${T.rimHi};color:${T.ink};}
  .btn-c{background:color-mix(in srgb,var(--c) 12%,transparent);border-color:color-mix(in srgb,var(--c) 35%,transparent);color:var(--c);}
  .btn-c:hover{background:color-mix(in srgb,var(--c) 22%,transparent);}

  .tag{
    display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;letter-spacing:.06em;
    background:color-mix(in srgb,var(--c) 13%,transparent);
    color:var(--c);border:1px solid color-mix(in srgb,var(--c) 28%,transparent);
  }

  .topnav{
    position:sticky;top:0;z-index:200;
    background:rgba(7,7,26,.88);border-bottom:1px solid ${T.rim};
    backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
    padding:0 28px;height:58px;
    display:flex;align-items:center;justify-content:space-between;gap:14px;
  }
  .navbrand{
    font-family:'Bebas Neue',sans-serif;font-size:23px;letter-spacing:.12em;
    background:linear-gradient(135deg,${T.l1c},${T.l2c});
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;flex-shrink:0;
  }
  .navlinks{display:flex;gap:2px;}
  .navlink{
    padding:6px 15px;border-radius:8px;border:1px solid transparent;
    background:transparent;color:${T.dim};cursor:pointer;
    font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.05em;
    text-transform:uppercase;transition:all .15s;
  }
  .navlink:hover{color:${T.mid};background:${T.card};}
  .navlink.active{color:${T.ink};background:${T.surface};border-color:${T.rim};}

  .gbar-wrap{flex:1;max-width:180px;height:3px;background:${T.rim};border-radius:3px;overflow:hidden;}
  .gbar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,${T.l1c},${T.l5c});transition:width .8s cubic-bezier(.16,1,.3,1);}

  .mesh{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
  .orb{position:absolute;border-radius:50%;filter:blur(80px);}

  .sec-label{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${T.dim};margin-bottom:6px;}
  .bigstat{font-family:'Bebas Neue',sans-serif;line-height:1;}

  .inp{
    background:${T.surface};border:1px solid ${T.rim};color:${T.ink};
    padding:9px 14px;border-radius:9px;font-family:'DM Mono',monospace;font-size:12px;
    outline:none;transition:border-color .15s;
  }
  .inp:focus{border-color:${T.rimHi};}
  .inp::placeholder{color:${T.dim};}
  textarea.inp{resize:vertical;line-height:1.6;min-height:110px;width:100%;}
  select.inp{cursor:pointer;}

  .rnode{cursor:pointer;transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s;}
  .rnode:hover{transform:translateY(-5px) scale(1.012);}

  .trow{display:flex;align-items:center;gap:12px;padding:10px 16px;cursor:pointer;border-bottom:1px solid ${T.rim};transition:background .1s;}
  .trow:last-child{border-bottom:none;}
  .trow:hover{background:rgba(255,255,255,.02);}
  .trow.done{opacity:.48;}
  .tcheck{width:18px;height:18px;border-radius:5px;flex-shrink:0;border:1.5px solid ${T.rimHi};display:flex;align-items:center;justify-content:center;transition:all .15s;}
  .trow.done .tcheck{background:var(--lc);border-color:var(--lc);}

  .tcard{
    background:${T.glass};border:1px solid ${T.rim};border-radius:14px;
    padding:18px;cursor:pointer;overflow:hidden;position:relative;
    backdrop-filter:blur(12px);
    transition:transform .22s cubic-bezier(.34,1.56,.64,1),border-color .2s,box-shadow .2s;
  }
  .tcard:hover{transform:translateY(-5px);border-color:var(--tc);box-shadow:0 10px 36px -10px var(--tc);}
  .tcard.done{opacity:.5;}
  .tcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--tc);}
  .tcard-shimmer{position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent);animation:scanH 2.5s ease infinite;}

  .hcell{aspect-ratio:1;border-radius:2px;transition:transform .1s;cursor:default;}
  .hcell:hover{transform:scale(1.6);z-index:1;position:relative;}

  .mstone{text-align:center;padding:14px 12px;border-radius:12px;background:${T.surface};border:1px solid ${T.rim};transition:all .3s;min-width:86px;}
  .mstone.unlocked{border-color:color-mix(in srgb,var(--mc) 45%,transparent);box-shadow:0 0 22px -8px var(--mc);}
  .mstone:not(.unlocked){filter:grayscale(.85);opacity:.35;}

  .toast{
    position:fixed;bottom:28px;right:28px;z-index:9999;
    padding:11px 20px;border-radius:10px;
    background:rgba(10,10,28,.95);
    border:1px solid color-mix(in srgb,var(--tc) 50%,transparent);
    color:var(--tc);font-size:12px;letter-spacing:.04em;
    animation:toastIn .25s ease both;pointer-events:none;
    backdrop-filter:blur(16px);
  }

  .divider{height:1px;background:linear-gradient(90deg,transparent,${T.rim},transparent);}
`;

/* ── Shared pieces ─────────────────────────────────────────────────────────── */
const Toast = ({toast}) => toast ? (
  <div className="toast" style={{"--tc":toast.kind==="ok"?T.ok:T.undo}}>{toast.msg}</div>
) : null;

function TopNav({total,pct,view,setView,streak}) {
  return (
    <nav className="topnav">
      <span className="navbrand">PY·MASTERY</span>
      <div className="navlinks">
        {[{k:"roadmap",l:"Roadmap"},{k:"today",l:"Today"},{k:"stats",l:"Stats"}].map(n=>(
          <button key={n.k} className={`navlink${view===n.k?" active":""}`} onClick={()=>setView(n.k)}>{n.l}</button>
        ))}
      </div>
      <div className="gbar-wrap"><div className="gbar-fill" style={{width:pct+"%"}}/></div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <span style={{fontSize:10,color:T.dim,letterSpacing:".05em"}}>{pct}%</span>
        <div style={{display:"flex",alignItems:"center",gap:5,background:T.surface,border:`1px solid ${T.rim}`,borderRadius:20,padding:"4px 11px"}}>
          <span>🔥</span>
          <span className="display" style={{fontSize:18,color:T.l3c,lineHeight:1}}>{streak}</span>
        </div>
      </div>
    </nav>
  );
}

const Orb = ({color,size,style={}}) => (
  <div className="orb" style={{width:size,height:size,background:color,opacity:.15,...style}}/>
);

/* ══════════════════════════════════════════════════════════════════════════
   ROADMAP VIEW
══════════════════════════════════════════════════════════════════════════ */
function RoadmapView({st,total,pct,setView,setAlv,toast}) {
  return (
    <div style={{minHeight:"100vh",background:T.void}}>
      <TopNav total={total} pct={pct} view="roadmap" setView={setView} streak={st.streak}/>

      {/* HERO */}
      <div style={{position:"relative",overflow:"hidden",padding:"80px 32px 64px",textAlign:"center"}}>
        <div className="mesh">
          <Orb color={T.l1c} size="600px" style={{top:-260,left:-120}}/>
          <Orb color={T.l5c} size="500px" style={{top:-200,right:-100,opacity:.1}}/>
          <Orb color={T.l2c} size="350px" style={{bottom:-120,left:"38%",opacity:.08}}/>
        </div>
        {/* Grid texture */}
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.rimHi}09 1px,transparent 1px),linear-gradient(90deg,${T.rimHi}09 1px,transparent 1px)`,backgroundSize:"64px 64px",pointerEvents:"none"}}/>

        <div style={{position:"relative",zIndex:1,animation:"fadeUp .55s ease both"}}>
          <div className="sec-label" style={{color:T.l1c,marginBottom:16,fontSize:11}}>● LIVE CURRICULUM TRACKER</div>

          <h1 className="display" style={{fontSize:"clamp(58px,11vw,120px)",lineHeight:.88,marginBottom:20}}>
            <span style={{display:"block",color:T.ink}}>Python</span>
            <span style={{
              display:"block",
              background:`linear-gradient(135deg,${T.l1c} 0%,${T.l2c} 50%,${T.l5c} 100%)`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            }}>Mastery</span>
          </h1>

          <p className="serif" style={{fontSize:"clamp(15px,2.2vw,19px)",color:T.mid,fontStyle:"italic",maxWidth:500,margin:"0 auto 40px",lineHeight:1.6}}>
            Five levels. 2,500 practice questions.<br/>One path from beginner to elite.
          </p>

          {/* Stats bar */}
          <div style={{
            display:"inline-flex",background:T.glass,border:`1px solid ${T.rim}`,
            borderRadius:18,overflow:"hidden",backdropFilter:"blur(16px)",
          }}>
            {[
              {val:total,       label:"Completed",  color:T.l1c},
              {val:2500-total,  label:"Remaining",  color:T.l4c},
              {val:pct+"%",     label:"Mastered",   color:T.l2c},
              {val:total>=2500?"Done!":Math.ceil((2500-total)/10)+"d", label:"Est. Finish", color:T.l5c},
            ].map((s,i)=>(
              <div key={i} style={{padding:"20px 28px",borderRight:i<3?`1px solid ${T.rim}`:"none",textAlign:"center",minWidth:88}}>
                <div className="bigstat" style={{fontSize:34,color:s.color}}>{s.val}</div>
                <div style={{fontSize:9,color:T.dim,letterSpacing:".1em",marginTop:3,textTransform:"uppercase"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divider" style={{margin:"0 32px 0"}}/>

      {/* LEVEL NODES — zigzag */}
      <div style={{maxWidth:800,margin:"0 auto",padding:"56px 24px 40px",position:"relative"}}>
        {/* Spine */}
        <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:1,background:`linear-gradient(to bottom,${T.l1c}30,${T.l2c}20,${T.l3c}20,${T.l4c}20,${T.l5c}30)`,transform:"translateX(-50%)",pointerEvents:"none"}}/>

        {LEVELS.map((lv,i)=>{
          const done=lvDone(st,lv.id), p=Math.round(done/lv.total*100);
          const started=done>0, complete=done===lv.total, isLeft=i%2===0;
          return (
            <div key={lv.id} style={{
              display:"flex",alignItems:"center",
              flexDirection:isLeft?"row":"row-reverse",
              marginBottom:i<LEVELS.length-1?60:0,
              animation:`fadeUp .5s ease ${i*.1}s both`,
            }}>

              {/* CARD */}
              <div className="glass-card rnode"
                onClick={()=>{setAlv(i);setView("level");}}
                style={{
                  width:"calc(50% - 48px)",padding:"24px 26px",
                  background:started?`linear-gradient(145deg,${lv.subtle},${T.glass})`:T.glass,
                  borderColor:started?lv.color+"50":T.rim,
                  boxShadow:started?`0 4px 40px -12px ${lv.color}40`:"none",
                  "--gc":lv.color,
                  animation:started&&!complete?`glow 3s ease-in-out infinite`:"none",
                  position:"relative",overflow:"hidden",
                }}>

                {/* Accent bar top */}
                <div style={{position:"absolute",top:0,left:20,right:20,height:2,background:`linear-gradient(90deg,transparent,${lv.color},transparent)`,opacity:Math.max(.15,p/100)}}/>

                {/* Decorative number */}
                <div className="display" style={{
                  position:"absolute",bottom:-8,right:10,fontSize:72,
                  color:lv.color,opacity:.06,lineHeight:1,pointerEvents:"none",userSelect:"none",
                }}>{lv.icon}</div>

                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div style={{flex:1,paddingRight:8}}>
                    <div className="sec-label" style={{color:lv.color,marginBottom:6}}>{lv.label}</div>
                    <h3 className="serif" style={{fontSize:22,fontWeight:400,color:T.ink,lineHeight:1.1,marginBottom:5,fontStyle:"italic"}}>
                      {lv.label.split(" ").slice(1).join(" ")}
                    </h3>
                    <p style={{fontSize:11,color:T.dim,lineHeight:1.45}}>{lv.caption}</p>
                  </div>
                  <div className="bigstat" style={{fontSize:38,color:started?lv.color:T.rimHi,lineHeight:1,flexShrink:0,transition:"color .3s"}}>{lv.icon}</div>
                </div>

                {/* Progress */}
                <div style={{height:3,background:T.rim,borderRadius:3,overflow:"hidden",margin:"16px 0 8px"}}>
                  <div style={{height:"100%",width:p+"%",background:`linear-gradient(90deg,${lv.color}70,${lv.color})`,borderRadius:3,transition:"width .9s cubic-bezier(.16,1,.3,1)"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,fontFamily:"monospace",marginBottom:14}}>
                  <span style={{color:lv.color}}>{p}% complete</span>
                  <span style={{color:T.dim}}>{done}/{lv.total}</span>
                </div>

                {/* Skill tags */}
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:16}}>
                  {lv.skills.slice(0,3).map(s=>(
                    <span key={s} className="tag" style={{"--c":lv.color}}>{s}</span>
                  ))}
                </div>

                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:lv.color,letterSpacing:".04em"}}>
                    {complete?"✅ Complete!":started?"Continue →":"Start →"}
                  </span>
                  {complete && <span style={{fontSize:16}}>🏅</span>}
                </div>
              </div>

              {/* CENTER DOT */}
              <div style={{width:96,flexShrink:0,display:"flex",justifyContent:"center",zIndex:2}}>
                <div style={{
                  width:50,height:50,borderRadius:"50%",
                  background:complete?lv.color:started?T.surface:T.deep,
                  border:`2px solid ${started?lv.color:T.rim}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:18,
                  boxShadow:started?`0 0 0 8px ${lv.color}14,0 0 28px ${lv.color}35`:"none",
                  color:complete?T.void:T.ink,
                  transition:"all .35s",
                  animation:started&&!complete?"float 3.5s ease-in-out infinite":"none",
                }}>
                  {complete?"✓":lv.emoji}
                </div>
              </div>

              <div style={{width:"calc(50% - 48px)"}}/>
            </div>
          );
        })}
      </div>

      {/* MILESTONES */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"8px 28px 72px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
          <div className="sec-label" style={{flexShrink:0}}>Milestones</div>
          <div className="divider" style={{flex:1,margin:0}}/>
          <span style={{fontSize:10,color:T.dim,flexShrink:0}}>{total} / 2500</span>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {MILESTONES.map(m=>{
            const unlocked=total>=m.at;
            return (
              <div key={m.label} className={`mstone${unlocked?" unlocked":""}`} style={{"--mc":m.color}}>
                <div style={{fontSize:22,marginBottom:7}}>{m.icon}</div>
                <div style={{fontSize:10,fontWeight:600,color:unlocked?m.color:T.dim,marginBottom:3,letterSpacing:".02em"}}>{m.label}</div>
                <div style={{fontSize:9,color:T.dim,fontFamily:"monospace"}}>{unlocked?"UNLOCKED":m.at}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Toast toast={toast}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LEVEL VIEW
══════════════════════════════════════════════════════════════════════════ */
function LevelView({st,setSt,lv,lvIdx,toggle,pop,setView,total,pct,q,setQ,flt,setFlt,toast}) {
  const tasks  = tasksFor(lvIdx);
  const done   = lvDone(st,lv.id);
  const p      = Math.round(done/lv.total*100);

  const visible = tasks.filter(t=>{
    const d=!!st.done[t.id];
    if(flt==="pending"&&d)  return false;
    if(flt==="done"&&!d)    return false;
    if(q&&!t.name.toLowerCase().includes(q.toLowerCase())&&!String(t.num).includes(q)) return false;
    return true;
  });

  function markAll(val){
    setSt(prev=>{
      const d={...prev.done};let cnt=0;
      visible.forEach(t=>{if(d[t.id]!==val){d[t.id]=val;cnt++;}});
      const td=toDate();
      const act={...prev.activity,[td]:Math.max(0,(prev.activity[td]||0)+(val?cnt:-cnt))};
      return{...prev,done:d,activity:act,xp:prev.xp+(val?cnt*10:-cnt*10)};
    });
    pop(`${val?"✓":"✗"} ${visible.length} tasks`,val?"ok":"undo");
  }

  return (
    <div style={{minHeight:"100vh",background:T.void}}>
      <TopNav total={total} pct={pct} view="level" setView={setView} streak={st.streak}/>

      {/* Level hero */}
      <div style={{position:"relative",overflow:"hidden",background:`linear-gradient(180deg,${lv.glow},transparent)`,borderBottom:`1px solid ${lv.color}22`,padding:"44px 32px 36px"}}>
        <div className="mesh">
          <Orb color={lv.color} size="450px" style={{top:-220,right:-120,opacity:.12}}/>
        </div>
        <div style={{position:"relative",zIndex:1,maxWidth:860,margin:"0 auto"}}>
          <button className="btn" style={{marginBottom:22}} onClick={()=>setView("roadmap")}>← Roadmap</button>
          <div style={{display:"flex",alignItems:"flex-start",gap:24,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:240}}>
              <div className="sec-label" style={{color:lv.color}}>{lv.label}</div>
              <h1 className="display" style={{fontSize:"clamp(34px,6vw,62px)",lineHeight:.9,marginBottom:12}}>
                {lv.label}
              </h1>
              <p className="serif" style={{fontSize:15,color:T.mid,fontStyle:"italic",lineHeight:1.55,maxWidth:520,marginBottom:16}}>{lv.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {lv.skills.map(s=><span key={s} className="tag" style={{"--c":lv.color}}>{s}</span>)}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div className="bigstat" style={{fontSize:68,color:lv.color,lineHeight:1}}>{p}%</div>
              <div style={{fontSize:12,color:T.dim,marginTop:4}}>{done} / {lv.total} done</div>
              <div style={{marginTop:8,display:"inline-block",padding:"4px 13px",borderRadius:20,background:lv.color+"18",border:`1px solid ${lv.color}40`,color:lv.color,fontSize:11}}>
                {done===lv.total?"Complete ✅":done===0?"Not started":"In progress"}
              </div>
            </div>
          </div>
          <div style={{height:4,background:T.rim,borderRadius:4,overflow:"hidden",marginTop:26}}>
            <div style={{height:"100%",width:p+"%",background:`linear-gradient(90deg,${lv.color}60,${lv.color})`,borderRadius:4,transition:"width .9s cubic-bezier(.16,1,.3,1)"}}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"26px 32px 64px"}}>
        {/* Controls */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
          <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tasks…" style={{flex:1,minWidth:160}}/>
          <select className="inp" value={flt} onChange={e=>setFlt(e.target.value)} style={{width:"auto"}}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:20,flexWrap:"wrap"}}>
          <button className="btn btn-c" style={{"--c":T.ok}} onClick={()=>markAll(true)}>✓ Mark all done</button>
          <button className="btn btn-c" style={{"--c":T.undo}} onClick={()=>markAll(false)}>✗ Unmark all</button>
          <span style={{fontSize:11,color:T.dim,marginLeft:4}}>{visible.length} tasks</span>
        </div>

        {/* List */}
        <div style={{border:`1px solid ${T.rim}`,borderRadius:14,overflow:"hidden",background:T.glass,backdropFilter:"blur(12px)"}}>
          {visible.length===0&&<div style={{padding:36,textAlign:"center",color:T.dim,fontSize:12}}>No tasks match.</div>}
          {visible.map((t,i)=>{
            const isDone=!!st.done[t.id];
            return (
              <div key={t.id} className={`trow${isDone?" done":""}`}
                style={{"--lc":lv.color,background:i%2===0?"transparent":"rgba(255,255,255,.01)"}}
                onClick={()=>{toggle(t.id);pop(isDone?"↩ Unmarked":"✓ Done! +10 XP",isDone?"undo":"ok");}}>
                <div className="tcheck">
                  {isDone&&<svg width="9" height="7"><path d="M1 3.5L3 5.5L8 1" stroke={T.void} strokeWidth="1.8" strokeLinecap="round" fill="none"/></svg>}
                </div>
                <span style={{fontSize:10,color:T.dim,fontFamily:"monospace",minWidth:36}}>#{String(t.num).padStart(3,"0")}</span>
                <span style={{flex:1,fontSize:13,textDecoration:isDone?"line-through":"none"}}>{t.name}</span>
                <span style={{fontSize:10,padding:"2px 9px",borderRadius:10,background:T.surface,color:T.dim,border:`1px solid ${T.rim}`,flexShrink:0,fontFamily:"monospace"}}>
                  {lv.topics[t.num%lv.topics.length]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <Toast toast={toast}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TODAY VIEW
══════════════════════════════════════════════════════════════════════════ */
function TodayView({st,toggle,genToday,setView,toast,total,pct,pop}) {
  useEffect(()=>{
    if(!st.todayIds||st.todayDate!==toDate()) genToday();
  },[]);

  const items=(st.todayIds||[]).map(id=>{
    const [,lid,num]=id.match(/L(\d+)_(\d+)/)||[];
    if(!lid) return null;
    const lv=LEVELS.find(l=>l.id===+lid); if(!lv) return null;
    const n=+num;
    return {id,lv,name:lv.topics[(n-1)%lv.topics.length],num:n};
  }).filter(Boolean);

  const doneToday=items.filter(t=>!!st.done[t.id]).length;
  const dayPct=items.length?Math.round(doneToday/items.length*100):0;
  const allComplete=doneToday===items.length&&items.length>0;

  return (
    <div style={{minHeight:"100vh",background:T.void}}>
      <TopNav total={total} pct={pct} view="today" setView={setView} streak={st.streak}/>

      <div style={{position:"relative",overflow:"hidden",padding:"52px 32px 40px",borderBottom:`1px solid ${T.rim}`}}>
        <div className="mesh">
          <Orb color={T.l1c} size="380px" style={{top:-180,left:-80,opacity:.12}}/>
          <Orb color={T.l5c} size="300px" style={{top:-140,right:0,opacity:.09}}/>
        </div>
        <div style={{position:"relative",zIndex:1,maxWidth:860,margin:"0 auto"}}>
          <div className="sec-label" style={{color:T.l1c,marginBottom:10}}>{toDate()}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:14}}>
            <div>
              <h1 className="display" style={{fontSize:"clamp(38px,7vw,76px)",lineHeight:.88}}>
                Today's<br/>Practice
              </h1>
              <p style={{fontSize:13,color:T.mid,marginTop:10}}>
                {doneToday} of {items.length} complete · {dayPct}%
              </p>
            </div>
            <button className="btn" onClick={genToday}>↺ New Plan</button>
          </div>
          <div style={{height:4,background:T.rim,borderRadius:4,overflow:"hidden",marginTop:26}}>
            <div style={{height:"100%",width:dayPct+"%",background:`linear-gradient(90deg,${T.l1c},${T.l3c})`,borderRadius:4,transition:"width .6s ease"}}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"32px 32px 64px"}}>
        {items.length===0&&<div style={{textAlign:"center",padding:48,color:T.dim,fontSize:13}}>🎉 All caught up! Hit New Plan for more.</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(228px,1fr))",gap:14}}>
          {items.map((t,i)=>{
            const isDone=!!st.done[t.id];
            return (
              <div key={t.id} className={`tcard${isDone?" done":""}`}
                style={{"--tc":t.lv.color,animation:`fadeUp .35s ease ${i*.07}s both`}}
                onClick={()=>{toggle(t.id);pop(isDone?"↩ Unmarked":"✓ Done! +10 XP",isDone?"undo":"ok");}}>
                {!isDone && <div className="tcard-shimmer"/>}
                {isDone && <div style={{position:"absolute",top:12,right:14,fontSize:18,color:T.ok}}>✓</div>}
                <div className="sec-label" style={{color:t.lv.color,marginBottom:7}}>{t.lv.label}</div>
                <div style={{fontWeight:500,fontSize:14,lineHeight:1.4,textDecoration:isDone?"line-through":"none",color:isDone?T.dim:T.ink,marginBottom:10}}>{t.name}</div>
                <div style={{fontSize:10,color:T.dim,fontFamily:"monospace"}}>#{String(t.num).padStart(3,"0")}</div>
              </div>
            );
          })}
        </div>

        {allComplete&&(
          <div style={{marginTop:40,padding:36,textAlign:"center",background:`linear-gradient(135deg,${T.l3c}0c,${T.l1c}08)`,border:`1px solid ${T.l3c}30`,borderRadius:18,animation:"fadeUp .4s ease both"}}>
            <div style={{fontSize:44,marginBottom:12}}>🎉</div>
            <div className="display" style={{fontSize:40,color:T.l3c,marginBottom:6}}>Day Complete!</div>
            <div style={{fontSize:13,color:T.mid}}>+{items.length*10} XP · 🔥 {st.streak} day streak</div>
          </div>
        )}
      </div>
      <Toast toast={toast}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STATS VIEW
══════════════════════════════════════════════════════════════════════════ */
function StatsView({st,setSt,total,pct,setView,toast}) {
  const [notes,setNotes]=useState(st.notes||"");
  const [saved,setSaved]=useState(false);

  function saveNotes(){
    setSt(prev=>({...prev,notes}));
    setSaved(true);setTimeout(()=>setSaved(false),2000);
  }

  const cells=[];
  const now=new Date();
  for(let i=181;i>=0;i--){
    const d=new Date(now);d.setDate(now.getDate()-i);
    const k=d.toISOString().split("T")[0];
    cells.push({k,cnt:st.activity[k]||0});
  }

  const maxXP=25000,xpPct=Math.min(100,st.xp/maxXP*100);

  return (
    <div style={{minHeight:"100vh",background:T.void}}>
      <TopNav total={total} pct={pct} view="stats" setView={setView} streak={st.streak}/>

      <div style={{position:"relative",overflow:"hidden",padding:"52px 32px 40px",borderBottom:`1px solid ${T.rim}`}}>
        <div className="mesh">
          <Orb color={T.l2c} size="420px" style={{top:-200,right:-100,opacity:.11}}/>
        </div>
        <div style={{position:"relative",zIndex:1,maxWidth:900,margin:"0 auto"}}>
          <div className="sec-label" style={{color:T.l2c,marginBottom:10}}>Dashboard</div>
          <h1 className="display" style={{fontSize:"clamp(38px,7vw,76px)",lineHeight:.88}}>Progress<br/>Stats</h1>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"32px 32px 64px",display:"flex",flexDirection:"column",gap:18}}>

        {/* XP card */}
        <div className="glass-card" style={{padding:"26px 28px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12,marginBottom:16}}>
            <div>
              <div className="sec-label">Total XP Earned</div>
              <div className="bigstat" style={{fontSize:52,color:T.l5c,lineHeight:1}}>{st.xp.toLocaleString()}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:12,color:T.dim}}>/ {maxXP.toLocaleString()} max</div>
              <div className="bigstat" style={{fontSize:26,color:T.l5c}}>{Math.round(xpPct)}%</div>
            </div>
          </div>
          <div style={{height:6,background:T.rim,borderRadius:6,overflow:"hidden"}}>
            <div style={{height:"100%",width:xpPct+"%",background:`linear-gradient(90deg,${T.l2c},${T.l5c})`,borderRadius:6,transition:"width .9s ease"}}/>
          </div>
        </div>

        {/* Level breakdown */}
        <div>
          <div className="sec-label" style={{marginBottom:12}}>Level Breakdown</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(248px,1fr))",gap:12}}>
            {LEVELS.map((lv)=>{
              const d=lvDone(st,lv.id),p2=Math.round(d/lv.total*100);
              return (
                <div key={lv.id} className="glass-card" style={{padding:"20px 22px",cursor:"pointer",borderColor:d>0?lv.color+"38":T.rim}}
                  onClick={()=>setView("level")}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div>
                      <div className="sec-label" style={{color:lv.color}}>{lv.label}</div>
                      <div className="serif" style={{fontSize:18,fontStyle:"italic",marginTop:3,color:T.ink}}>{lv.label.split(" ").slice(1).join(" ")}</div>
                    </div>
                    <div className="bigstat" style={{fontSize:30,color:lv.color,lineHeight:1}}>{p2}%</div>
                  </div>
                  <div style={{height:3,background:T.rim,borderRadius:3,overflow:"hidden",marginBottom:6}}>
                    <div style={{height:"100%",width:p2+"%",background:lv.color,borderRadius:3,transition:"width .7s ease"}}/>
                  </div>
                  <div style={{fontSize:10,color:T.dim,fontFamily:"monospace"}}>{d} / {lv.total} tasks</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Heatmap */}
        <div className="glass-card" style={{padding:"24px 26px"}}>
          <div className="sec-label" style={{marginBottom:16}}>Activity — Last 26 Weeks</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(26,1fr)",gap:3}}>
            {cells.map(({k,cnt})=>(
              <div key={k} className="hcell" title={`${k}: ${cnt}`}
                style={{background:cnt===0?T.rim:cnt<=2?T.l1c+"40":cnt<=5?T.l1c+"80":cnt<=10?T.l1c+"c0":T.l1c}}/>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:14,justifyContent:"flex-end",fontSize:10,color:T.dim,fontFamily:"monospace"}}>
            Less
            {[T.rim,T.l1c+"40",T.l1c+"80",T.l1c+"c0",T.l1c].map((bg,i)=>(
              <div key={i} style={{width:12,height:12,borderRadius:2,background:bg}}/>
            ))}
            More
          </div>
        </div>

        {/* Milestones */}
        <div className="glass-card" style={{padding:"24px 26px"}}>
          <div className="sec-label" style={{marginBottom:16}}>Milestones</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {MILESTONES.map(m=>{
              const unlocked=total>=m.at;
              return (
                <div key={m.label} className={`mstone${unlocked?" unlocked":""}`} style={{"--mc":m.color}}>
                  <div style={{fontSize:22,marginBottom:7}}>{m.icon}</div>
                  <div style={{fontSize:10,fontWeight:600,color:unlocked?m.color:T.dim,marginBottom:3,letterSpacing:".02em"}}>{m.label}</div>
                  <div style={{fontSize:9,color:T.dim,fontFamily:"monospace"}}>{unlocked?"UNLOCKED":m.at}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="glass-card" style={{padding:"24px 26px"}}>
          <div className="sec-label" style={{marginBottom:12}}>Study Notes</div>
          <textarea className="inp" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Concepts, patterns, reminders…"/>
          <div style={{display:"flex",alignItems:"center",gap:12,marginTop:12}}>
            <button className="btn btn-c" style={{"--c":T.l2c}} onClick={saveNotes}>Save Notes</button>
            {saved&&<span style={{fontSize:11,color:T.ok,fontFamily:"monospace",animation:"fadeIn .2s ease"}}>✓ saved</span>}
          </div>
        </div>

      </div>
      <Toast toast={toast}/>
    </div>
  );
}
