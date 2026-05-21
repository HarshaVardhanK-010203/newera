import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, Layout, Layers, HelpCircle, Terminal, Cpu, Award, Zap, 
  Play, RefreshCw, CheckCircle, AlertTriangle, FileText, Bookmark, 
  Code, Eye, Check, ChevronRight, HelpCircle as QuestionIcon, Clock, Lock, BookOpen, Share
} from 'lucide-react';
import { Topic, UserProfile } from '../types';

interface DeepLearningProps {
  topic: Topic;
  profile: UserProfile;
  onSaveProgress: (payload: { topicId: string; quizCompleted?: boolean; isChallenge?: boolean; isProject?: boolean; xpBonus?: number; quizScore?: number }) => void;
  onOpenPlayground: (code: string, tab: 'html' | 'css' | 'js' | 'react') => void;
}

export default function DeepLearningModule({ topic, profile, onSaveProgress, onOpenPlayground }: DeepLearningProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [playgroundCode, setPlaygroundCode] = useState<string>('');
  const [playgroundOutput, setPlaygroundOutput] = useState<string[]>([]);
  const [playgroundRunning, setPlaygroundRunning] = useState<boolean>(false);
  
  // Timed challenge state
  const [challengeTimer, setChallengeTimer] = useState<number>(60);
  const [challengeActive, setChallengeActive] = useState<boolean>(false);
  const [challengeScore, setChallengeScore] = useState<number | null>(null);
  const [selectedChallengeAnswers, setSelectedChallengeAnswers] = useState<Record<number, number>>({});
  
  // Interactive Exercise state
  const [exerciseLevel, setExerciseLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [exerciseInput, setExerciseInput] = useState<string>('');
  const [exerciseFeedback, setExerciseFeedback] = useState<{ success: boolean; text: string } | null>(null);

  // Notes state
  const [flashcardFlipped, setFlashcardFlipped] = useState<Record<number, boolean>>({});
  const [currentCheatSheetType, setCurrentCheatSheetType] = useState<'summary' | 'cheat' | 'flashcards'>('cheat');

  // Interview QA revealed state
  const [interviewRevealed, setInterviewRevealed] = useState<Record<number, boolean>>({});

  // Mastery Test state
  const [masterySubmitted, setMasterySubmitted] = useState<boolean>(false);
  const [masteryAnswers, setMasteryAnswers] = useState<Record<number, number>>({});
  const [masteryScore, setMasteryScore] = useState<number | null>(null);
  const [masteryError, setMasteryError] = useState<string>('');

  // Auto-initialized state based on selected topic
  useEffect(() => {
    setPlaygroundCode(topic.syntaxRef.syntax || '');
    setPlaygroundOutput([]);
    setActiveStep(1);
    setExerciseFeedback(null);
    setExerciseInput('');
    setMasterySubmitted(false);
    setMasteryAnswers({});
    setMasteryScore(null);
    setMasteryError('');
    setFlashcardFlipped({});
    setChallengeTimer(60);
    setChallengeActive(false);
    setChallengeScore(null);
    setSelectedChallengeAnswers({});
  }, [topic]);

  // Timed Challenge Countdown Timer
  useEffect(() => {
    let interval: any;
    if (challengeActive && challengeTimer > 0) {
      interval = setInterval(() => {
        setChallengeTimer(prev => prev - 1);
      }, 1000);
    } else if (challengeTimer === 0 && challengeActive) {
      setChallengeActive(false);
      evaluateChallenge();
    }
    return () => clearInterval(interval);
  }, [challengeActive, challengeTimer]);

  // Dynamic helper checking what type of course topic is loaded
  const getTopicCategory = () => {
    const id = topic.id.toLowerCase();
    if (id.includes('html')) return 'HTML';
    if (id.includes('css') || id.includes('flex') || id.includes('grid')) return 'CSS';
    if (id.includes('react')) return 'React';
    if (id.includes('node') || id.includes('express')) return 'NodeJS';
    if (id.includes('postgres') || id.includes('database') || id.includes('sql')) return 'SQL';
    if (id.includes('web3') || id.includes('blockchain')) return 'Web3';
    return 'JavaScript';
  };

  const category = getTopicCategory();

  // 4. Detailed Syntax breakdowns mapped for core languages
  const getSyntaxBreakdown = () => {
    const rawSyntax = topic.syntaxRef.syntax;
    if (category === 'JavaScript') {
      return [
        { label: "Variable/Function Decl", code: "function processIncomes(transactions)", description: "Declares a callable block 'processIncomes' that binds scope to transactions parameter." },
        { label: "Array Pipeline Chain", code: "transactions.filter(...)", description: "Takes a collection, evaluates each record against a predicate, and discards falsy records." },
        { label: "Callback Function", code: "t => t.type === 'income'", description: "An ES6 arrow function implicit return, checking transaction type integrity block." },
        { label: "Data Transformation", code: ".map(t => t.amount * 1.1)", description: "Iterates through entries, applying a 10% multiplier and returns a brand-new mutated collection." },
        { label: "Accumulator Initializer", code: ".reduce((sum, current) => sum + val, 0)", description: "Consolidates all elements down into a singular scalar numeric total, seeded at 0." }
      ];
    } else if (category === 'CSS') {
      return [
        { label: "Selector Engine", code: ".grid-container", description: "Targets DOM elements configured with class attribute matching grid-container." },
        { label: "Layout Mode", code: "display: grid;", description: "Triggers block CSS layout engine formatting context as responsive grid system." },
        { label: "Columns Specification", code: "grid-template-columns: repeat(3, 1fr);", description: "Instructs layout engine to slice horizontal width into 3 identical fractional grid divisions of 1fr." },
        { label: "Gap Spacing", code: "gap: 16px;", description: "Establishes a strict architectural spacing gut between columns and rows without margin bloat." },
        { label: "Cell Constraints", code: "grid-column: span 2;", description: "Enlarges target cell node horizontally to occupy two column segments perfectly." }
      ];
    } else if (category === 'React') {
      return [
        { label: "Hook Declaration", code: "const [state, setState] = useState(default);", description: "Registers local state hook, getting a synchronized getter and setter tuple." },
        { label: "Side Effect Handler", code: "useEffect(() => { ... }, [deps]);", description: "Binds an asynchronous script action executing after DOM layout mutations, watching deps arrays and cleaning up." },
        { label: "JSX Frame Render", code: "return (<div className='p-4'>{children}</div>);", description: "High-contrast declarative structural mockup compiling down to React.createElement API objects." }
      ];
    } else if (category === 'HTML') {
      return [
        { label: "Doctype Declaration", code: "<!DOCTYPE html>", description: "Signals modern rendering standards to web layout engine to bypass legacy bugs." },
        { label: "Root HTML Wrapper", code: "<html lang='en'>", description: "Encapsulates full layout tree, signaling default indexing languages to crawlers." },
        { label: "Semantic Section", code: "<main id='main-block'>", description: "Denotes dominant central page flow, improving accessibility index significantly." }
      ];
    }
    return [
      { label: "Initialization Parameter", code: "const data = readDB();", description: "Performs absolute, atomic sync storage lookup of schema elements." },
      { label: "Request Handler Pipeline", code: "app.post('/api/save-progress', (req, res))", description: "Registers interceptor callback to fetch custom student payloads." }
    ];
  };

  // 5. Behind the Scenes description parameters
  const getBehindTheScenes = () => {
    switch (category) {
      case 'JavaScript':
        return {
          heap: "Variables inside closures are assigned dynamic addresses in the browser's Garbage Collected RAM heap.",
          browser: "The JavaScript Engine (such as Chrome's V8) parses syntax, triggers JIT (Just In Time) compiler, and offloads timers / Web APIs to browser service helpers.",
          thread: "Main execution thread locks sequentially. Microtasks (like promise resolution callbacks) execute immediately after the current script loop and before standard layout painting."
        };
      case 'CSS':
        return {
          heap: "CSSOM (CSS Object Model) is fully constructed as a structured style sheet tree in browser memory, sitting adjacent to DOM structure.",
          browser: "Browser Engine recalculates parent/child selectors, builds the Render Tree combining DOM + CSSOM, runs specific mathematical 'Layout' logic, and fires GPU pixels.",
          thread: "Composite rendering layers (computed via flex/grid/matrix offsets) escape standard layout recalculation traps, running smoothly on independent browser main render loops."
        };
      case 'React':
        return {
          heap: "The Virtual DOM sits as a lightweight tree representation of user layouts in standard heap memory.",
          browser: "React matches changes inside fiber nodes, runs structural comparisons (Reconciliation), batches updates together, and commits alterations in a single DOM write block.",
          thread: "Fiber concurrent loops yield control back to the browser main paint thread, ensuring web interfaces never lag even during high-workload calculations."
        };
      default:
        return {
          heap: "Allocates buffer segments on memory stacks to store network socket bytes and file reads directly.",
          browser: "Handles TCP/HTTP payloads inside Node Libuv thread pools, utilizing event-driven async loops to service thousands of calls simultaneously.",
          thread: "Utilizes non-blocking execution flows to delegate file descriptors and system network buffers, bypassing single-threaded runtime lockups."
        };
    }
  };

  // 6. Real World Production scenarios
  const getRealWorldProduction = () => {
    switch (category) {
      case 'JavaScript':
        return [
          { system: "Payment Processors Map", scope: "Payment pipelines utilize promises chained to handle authorization limits, card security validations, and bank feedback loops.", stack: "Stripe SDK, Axios, Express" },
          { system: "Streaming Telemetry Pipelines", scope: "Array reductions dynamically compute live stream latency updates, chat counters, and average concurrent audience scales every second.", stack: "WebSockets, V8 Pipeline" }
        ];
      case 'CSS':
        return [
          { system: "Netflix Landing Bento System", scope: "Netflix aggregates video previews, banners, and personalized carousels inside absolute responsive bento grid frameworks.", stack: "CSS Grid, Tailwind, Media Queries" },
          { system: "Dynamic E-Commerce Gallery", scope: "Frictionless checkout pages wrap shipping details and address sheets cleanly using flexbox layout algorithms.", stack: "Flexbox, Tailwind, Web Accessibility Guidelines" }
        ];
      case 'React':
        return [
          { system: "Live SaaS Dashboard Tracker", scope: "Real-time trading and software-as-a-service dashboards synchronize charts and graphs securely leveraging memory-safe useMemo and context layers.", stack: "React Memo, Recharts, Context API" }
        ];
      default:
        return [
          { system: "High-Traffic REST Backend", scope: "Production APIs optimize database connections, compress response payloads, and log execution speeds continuously.", stack: "Express, PM2, Postgres Pool" }
        ];
    }
  };

  // 8. Debugging simulator samples
  const getDebuggerSample = () => {
    switch (category) {
      case 'JavaScript':
        return {
          error: "Uncaught ReferenceError: Cannot access 'balance' before initialization",
          why: "A block-scoped variable declared with 'let' or 'const' was accessed within its Temporal Dead Zone (TDZ) before compilation hit its literal declaration line.",
          fix: "Shift the variable declaration to the top level of the function block prior to any visual operations."
        };
      case 'CSS':
        return {
          error: "Layout break: Grid child nodes overlapping on small viewport layouts",
          why: "Hardcoded column counts were set via 'grid-template-columns: repeat(4, 300px);' with no mobile fluid modifiers.",
          fix: "Incorporate 'repeat(auto-fit, minmax(250px, 1fr))' to automatically compress layouts dynamically on narrow viewports."
        };
      case 'React':
        return {
          error: "Warning: Infinite re-render loop detected inside component state triggers",
          why: "A component state modification was called directly inside the render cycle rather than being gated within a stable useEffect dependency sequence.",
          fix: "Wrap the state trigger inside an event emitter callback or attach it safely inside standard mounting lifecycle hooks with empty dependency dependencies."
        };
      default:
        return {
          error: "Error: ECONNREFUSED 127.0.0.1:5432 - Schema lookup fail",
          why: "The server attempted database communication prior to confirming database port availability, or secret keys were not configured.",
          fix: "Implement robust lazy database connection helper checking process.env keys before triggering critical lookups."
        };
    }
  };

  // 9. Interactive Exercise configuration
  const getExerciseConfig = () => {
    switch (category) {
      case 'JavaScript':
        return {
          easy: {
            question: "Declare a block-scoped variable named 'bonus' and set its value to 10.",
            placeholder: "e.g. let bonus = 10;",
            solution: "let bonus = 10",
            tip: "Use the modern 'let' keyword followed by assignment syntax."
          },
          medium: {
            question: "Write an ES6 arrow function named 'double' that takes a block 'x' and doubles it.",
            placeholder: "e.g. const double = x => x * 2;",
            solution: "double = x => x * 2",
            tip: "Store inside const variable or write implicit return arrow."
          },
          hard: {
            question: "Write a map pipeline method to convert an array of objects to get only their absolute 'id' properties.",
            placeholder: "e.g. arr.map(item => item.id)",
            solution: ".map(item => item.id)",
            tip: "Pass item callback returning item.id parameter."
          }
        };
      case 'CSS':
        return {
          easy: {
            question: "Set the CSS property to convert an element into a Flexbox flex container.",
            placeholder: "e.g. display: flex;",
            solution: "display: flex",
            tip: "Use the display property with flex layout engine."
          },
          medium: {
            question: "Configure Grid layout template columns to align into three identical fluid sections.",
            placeholder: "grid-template-columns: repeat(3, 1fr);",
            solution: "repeat(3, 1fr)",
            tip: "Use the repeat structure paired with fractional units."
          },
          hard: {
            question: "Center items align both horizontally and vertically inside a flexing block element.",
            placeholder: "justify-content: center; align-items: center;",
            solution: "center",
            tip: "Utilize both justify and align layout controls."
          }
        };
      default:
        return {
          easy: {
            question: "Set the HTML standard structural main body wrapper tag.",
            placeholder: "<body>",
            solution: "body",
            tip: "Encapsulates visible page node elements."
          },
          medium: {
            question: "What environment variable represents the secret API key for Gemini?",
            placeholder: "GEMINI_API_KEY",
            solution: "GEMINI_API_KEY",
            tip: "Never prefix server-side secret API keys with VITE_."
          },
          hard: {
            question: "Configure port allocation binds for standard container servers in the platform.",
            placeholder: "3000",
            solution: "3000",
            tip: "This platform routes external internet traffic exclusively via port 3000."
          }
        };
    }
  };

  const exercise = getExerciseConfig()[exerciseLevel];

  const handleVerifyExercise = () => {
    const cleanInput = exerciseInput.replace(/\s+/g, '').replace(';', '').toLowerCase();
    const cleanSolution = exercise.solution.replace(/\s+/g, '').replace(';', '').toLowerCase();
    
    if (cleanInput.includes(cleanSolution) || cleanSolution.includes(cleanInput)) {
      setExerciseFeedback({ success: true, text: "🎉 Outstanding! Your solution meets strict academic pipeline standards! +75 XP" });
      onSaveProgress({ topicId: topic.id, isChallenge: true, xpBonus: 75 });
    } else {
      setExerciseFeedback({ success: false, text: `❌ Solution mismatch. Let's try again! Tip: ${exercise.tip}` });
    }
  };

  // 10. Compile / Run instantly inside Visual Playground helper
  const handleRunPlayground = () => {
    setPlaygroundRunning(true);
    setPlaygroundOutput(["🚀 Initiating runtime sandbox compiler...", "🛠️ Recalculating environment parameters..."]);
    
    setTimeout(() => {
      try {
        if (category === 'CSS' || category === 'HTML') {
          setPlaygroundOutput(prev => [
            ...prev,
            "🎨 Render Tree updated.",
            "✅ Layout structure generated successfully inside Sandbox Simulator iframe.",
            "🌟 DOM & CSSOM painted standard elements."
          ]);
        } else {
          // Javascript virtual compiler evaluation
          const logs: string[] = [];
          const customConsole = {
            log: (...args: any[]) => {
              logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
            }
          };

          // Sandbox scope binding execution
          const execFunc = new Function('console', playgroundCode);
          execFunc(customConsole);

          setPlaygroundOutput(prev => [
            ...prev,
            ...logs.map(l => `[CONSOLE] ${l}`),
            "🏆 Compiled with clean execution exit code 0."
          ]);
        }
      } catch (err: any) {
        setPlaygroundOutput(prev => [
          ...prev,
          `❌ Runtime Exception: ${err.message}`,
          "⚠️ Execution failed. Correct compilation flags or variable scope levels."
        ]);
      } finally {
        setPlaygroundRunning(false);
      }
    }, 600);
  };

  // 11. Custom Mini Project description references
  const getMiniProject = () => {
    switch (category) {
      case 'HTML':
        return {
          title: "Chapter Project: High-Fidelity Portfolio Page",
          brief: "Build a semantic portfolio representing a computer scientist's certifications, links, and contact grids.",
          steps: [
            "Structure body using semantic wrapping structures including <header>, <section> and <footer> nodes.",
            "Embed dynamic profile portrait leveraging <img> elements with safe Referrer policies.",
            "Write a simple text-based feedback form styled cleanly."
          ],
          source: `<!-- Chapter Project: Portfolio skeleton -->\n<header>\n  <h1>Dev Portfolio</h1>\n  <nav><a href="#projects">Projects</a></nav>\n</header>\n<main>\n  <section id="projects">\n    <h2>Project 1: Platform</h2>\n    <p>A full-stack learning ledger tracker.</p>\n  </section>\n</main>`
        };
      case 'CSS':
        return {
          title: "Chapter Project: Netflix Clone Grid System",
          brief: "Establish high-dimensional nested container layout presenting show grids, custom pricing cards, and interactive hover outlines.",
          steps: [
            "Bind container class to 'display: grid;' schema.",
            "Define fluid columns wrapping dynamically using auto-fill criteria.",
            "Configure CSS animations scaling image assets elegantly on mouse enter trackers."
          ],
          source: `/* Chapter Project: Netflix Grid system */\n.netflix-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  gap: 16px;\n  padding: 24px;\n}\n.card-item:hover {\n  transform: scale(1.05);\n  transition: all 0.3s ease;\n}`
        };
      case 'React':
        return {
          title: "Chapter Project: Interactive State Taskmaster",
          brief: "Deploy a high-contrast React app rendering task states, updating categories, and updating statistics dynamically.",
          steps: [
            "Initialize state arrays hosting item collections.",
            "Bind form inputs to React reactive state elements.",
            "Configure component re-render optimization with primitive triggers."
          ],
          source: `/* Chapter Project: Todo State App */\nimport React, { useState } from 'react';\nexport default function TodoApp() {\n  const [tasks, setTasks] = useState([]);\n  return (<div>Tasks Count: {tasks.length}</div>);\n}`
        };
      default:
        return {
          title: "Chapter Project: High-Performance Calculator CLI",
          brief: "Develop complete calculations loop checking parameter logic, managing parsing, and providing result logs.",
          steps: [
            "Initialize operation callback triggers.",
            "Add exception bounds mapping divide-by-zero occurrences safely.",
            "Apply pipeline reduction sum rules to compound interest charts."
          ],
          source: `// Chapter Project: Arithmetic pipeline calc\nfunction calculate(op, a, b) {\n  if (op === 'div' && b === 0) throw new Error("Infinity error.");\n  return op === 'add' ? a + b : a / b;\n}`
        };
    }
  };

  const project = getMiniProject();

  // 12. Notes & Flashcards setup
  const flashcards = [
    { q: "What memory model governs local block scopes?", a: "The stack is used for temporary functional call frames, while the heap stores large dynamic variables and closure contexts." },
    { q: "What defines responsive design layout grids?", a: "Using media rules combined with auto-fit layout algorithms to preserve visual density ratios across screens." },
    { q: "What role does JIT compilation play in Node?", a: "The V8 compiler analyzes executing script paths, compiling frequently invoked blocks immediately down to native binary hardware commands." }
  ];

  // 13. High-tier Interview Prep questions
  const interviewQuestions = [
    {
      q: `Explain how the Event Loop handles Microtasks vs Macrotasks in high-availability systems.`,
      a: `At the end of each tick of the event loop, the engine completes all pending microtasks (Promises, queueMicrotask) prior to shifting to any macrotask execution (setTimeout, disk file reads) or rendering paints. This guarantees synchronous state integrity.`,
      frequentlyAsked: "FAANG priority question • High-Scale Architectures"
    },
    {
      q: `How does standard Layout calculations shift to painting threads on CSS grids?`,
      a: `When layout boundaries undergo changes, the browser runs heavy layout mathematics to compute sizes. By leveraging transforms or alignments, compositing elements can bypass layout and paint cycles entirely, executing smoothly via independent GPU compositing layers.`,
      frequentlyAsked: "Principal Frontend Designer Interview"
    }
  ];

  // 14. Timed Challenge Mode Questions
  const challengeQuestions = [
    {
      q: "Which keyword prevents reassignment of variable bindings?",
      options: ["var", "let", "const", "declare"],
      correct: 2
    },
    {
      q: "What layout engine creates two-dimensional fluid grids?",
      options: ["Inline Block", "Flexbox", "Float styling", "CSS Grid"],
      correct: 3
    }
  ];

  const handleStartChallenge = () => {
    setChallengeActive(true);
    setChallengeTimer(60);
    setChallengeScore(null);
    setSelectedChallengeAnswers({});
  };

  const handleSelectChallengeAnswer = (qIdx: number, oIdx: number) => {
    setSelectedChallengeAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const evaluateChallenge = () => {
    setChallengeActive(false);
    let correctCount = 0;
    challengeQuestions.forEach((q, idx) => {
      if (selectedChallengeAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / challengeQuestions.length) * 100);
    setChallengeScore(score);

    if (score >= 70) {
      onSaveProgress({ topicId: topic.id, isChallenge: true, xpBonus: 200 });
    }
  };

  // 15. Active Mastery test checking topic completion
  const masteryQuestions = [
    {
      q: `Under which scenario does memory fragmentation or leak vulnerabilities spike regarding this topic?`,
      options: [
        "Binding temporary short-lived pointers.",
        "Attaching persistent event listeners globally or on root objects without teardown logic.",
        "Overriding system variable declarations with modern let scopes.",
        "Structuring responsive layouts with css layout boundaries."
      ],
      correct: 1
    },
    {
      q: `How does the runtime guarantee non-blocking behavior under heavy operations?`,
      options: [
        "By spawning synchronous microthreads on physical CPU hardware.",
        "By delegating heavy asset requests to browser background system agents and the event-loop.",
        "By locking the layout painting system entirely during script reads.",
        "By ignoring errors completely in production environments."
      ],
      correct: 1
    },
    {
      q: `Compare local content-box layout bounds to secure border-box designs in production.`,
      options: [
        "Content-box incorporates padding into height values; border-box does not.",
        "Border-box guarantees total dimensions encompass content, padding, and borders, preventing layout leaks.",
        "Content-box automatically handles scaling animations smoothly.",
        "There is absolutely no behavioral difference between them."
      ],
      correct: 1
    }
  ];

  const handleSelectMasteryAnswer = (qIdx: number, oIdx: number) => {
    if (masterySubmitted) return;
    setMasteryAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const submitMasteryTest = () => {
    if (Object.keys(masteryAnswers).length < masteryQuestions.length) {
      setMasteryError('⚠️ You must answer all assessment questions before submitting.');
      return;
    }
    setMasteryError('');
    
    let correctCount = 0;
    masteryQuestions.forEach((q, idx) => {
      if (masteryAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const finalPercent = Math.round((correctCount / masteryQuestions.length) * 100);
    setMasteryScore(finalPercent);
    setMasterySubmitted(true);

    if (finalPercent >= 70) {
      // Award significant XP and unlock next topic constraints
      onSaveProgress({ topicId: topic.id, isProject: true, xpBonus: 400 });
    }
  };

  return (
    <div id="deep-learning-terminal" className="space-y-6">
      
      {/* Immersive Deep Learning Hub Banner */}
      <div className="p-4 bg-linear-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-500/20 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase">Interactive Core Sandbox Active</span>
            </div>
            <h3 className="text-lg font-black tracking-tight mt-1">📚 DEEP LEARNING COMPASS MODE: ON</h3>
            <p className="text-[11px] text-indigo-200 mt-0.5">Every conceptual pathway parsed down to memory profiles, execution graphs, and FAANG criteria.</p>
          </div>

          <div className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-xs flex items-center gap-2">
            <span className="text-yellow-400">⭐</span>
            <span className="font-mono text-[11px] font-bold">TOPIC MASTER XP BONUS: +400</span>
          </div>
        </div>
      </div>

      {/* Main Structural Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: 15 Core Interactive Steps Roadmap Selector */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-4 shadow-sm space-y-3">
          <span className="text-[10px] font-mono uppercase font-bold text-neutral-450 tracking-wider">Learning Step Index</span>
          
          <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
            {[
              { idx: 1, label: "Beginner Explanation", icon: "🍼", desc: "Absolute zero-knowledge analogies" },
              { idx: 2, label: "Technical Explanation", icon: "⚙️", desc: "Expert glossary, terminal specs" },
              { idx: 3, label: "Visual & Flowcharts", icon: "🎨", desc: "ASCII structures, Layout grids" },
              { idx: 4, label: "Syntax Breakdown", icon: "🔍", desc: "Logical parameter analysis block" },
              { idx: 5, label: "Behind the Scenes (V8)", icon: "🧠", desc: "Heap allocation, render streams" },
              { idx: 6, label: "Real-World Examples", icon: "💼", desc: "E-Commerce networks, APIs" },
              { idx: 7, label: "Common Mistakes", icon: "⚠️", desc: "Scope leaks, syntax loops" },
              { idx: 8, label: "Interactive Debugger", icon: "🛠️", desc: "Compile fail diagnosis drills" },
              { idx: 9, label: "Trivia Exercises", icon: "📝", desc: "Practice code challenges" },
              { idx: 10, label: "Dynamic Playground", icon: "🎯", desc: "Build & render code modules" },
              { idx: 11, label: "Capstone Mini-Project", icon: "🏗️", desc: "Production skeleton code" },
              { idx: 12, label: "Cheat Sheet & Revision", icon: "📑", desc: "Summary decks, flashcards" },
              { idx: 13, label: "FAANG Interview prep", icon: "🎓", desc: "Top-level architecture reviews" },
              { idx: 14, label: "Timed Challenge Mode", icon: "⏱️", desc: "Clock speed quizzes" },
              { idx: 15, label: "Mastery Test Gate", icon: "🏆", desc: "Check 70% threshold score" }
            ].map((step) => {
              const works = activeStep === step.idx;
              const completedTest = profile.completedChallenges.includes(topic.id) || masteryScore !== null && masteryScore >= 70;
              
              return (
                <button 
                  key={step.idx}
                  onClick={() => setActiveStep(step.idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${works ? 'bg-indigo-650 text-white font-bold shadow-md shadow-indigo-650/15' : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850/50'}`}
                >
                  <div className="flex items-center gap-2.5 pr-2 truncate">
                    <span className="text-sm shrink-0">{step.icon}</span>
                    <div className="truncate">
                      <span className="block leading-none font-bold text-[11px]">{step.idx}. {step.label}</span>
                      <span className={`text-[9px] font-normal block mt-0.5 leading-none ${works ? 'text-indigo-100' : 'text-neutral-400 dark:text-neutral-500'}`}>{step.desc}</span>
                    </div>
                  </div>
                  {step.idx === 15 && completedTest && (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Interactive Content Viewport renders corresponding selected step */}
        <div id="deep-learning-sandbox" className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-6 shadow-sm min-h-[500px] flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* 1. BEGINNER EXPLANATION */}
            {activeStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">🍼</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Beginner Analogy Paradigm</h4>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-mono font-bold tracking-widest leading-none">Absolutely Zero Prerequisites Required</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold mb-1.5 flex items-center gap-1.5">
                    💡 Mental model bridge:
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic select-text">
                    "{topic.whyExists} Let's picture this concept like a simple postal system. Instead of throwing letters into the wind, you address them precisely using standardized codes, allowing everyone to navigate cleanly."
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed select-text">
                  We explain this conceptually: Website code tells your browser how to compile data blocks. Think of this topic as a blueprint. Just as you won't build a house without styling, you won't send code down the wire without confirming proper guidelines.
                </p>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 rounded-xl space-y-2">
                  <h5 className="font-bold text-neutral-800 dark:text-white text-xs">Core Concepts broken down simply:</h5>
                  <ul className="space-y-1 text-xs text-neutral-550">
                    <li>• Variables are labeled drawers matching memory sectors.</li>
                    <li>• Frameworks are pre-configured boxes allowing fast development.</li>
                    <li>• The DOM is a digital document representing layouts on screens.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 2. TECHNICAL EXPLANATION */}
            {activeStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Technical Architecture Blueprint</h4>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 uppercase font-mono font-bold tracking-widest leading-none">Engineering Terminology & Specifications</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed select-text">
                  {topic.explanation}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 rounded-xl">
                    <h5 className="text-[10px] font-mono text-indigo-600 uppercase font-black mb-1">Architectural Why Context</h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">{topic.whyExists}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 rounded-xl">
                    <h5 className="text-[10px] font-mono text-indigo-600 uppercase font-black mb-1">Production Use Target</h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">{topic.realWorldUse}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. VISUAL EXPLANATION & FLOWCHARTS */}
            {activeStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Visual & Structural Flowcharts</h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-mono font-bold tracking-widest leading-none">Graphical Memory Representation</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  The network or software structures execute according to strict execution patterns. Look at this ASCII representation map below:
                </p>

                <div className="p-4 bg-neutral-950 text-emerald-400 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-neutral-850 shadow-inner select-none">
                  <span className="text-[8px] text-neutral-600 block mb-2 font-bold uppercase tracking-wider">// STRUCTURAL MAP DIAGRAM</span>
                  <pre>{topic.visualDiagram || `[ INPUT PAYLOAD ]\n       |\n       v (Transformation Rule)\n[ PARSING BLOCK ]\n       |\n       v (Evaluate Bounds check)\n[ COMPLETED STREAM ]`}</pre>
                </div>

                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                  <span className="animate-pulse">🟢</span>
                  <span><strong>Animation hint:</strong> The browser renders these layers sequentially using painters to prevent rendering lags.</span>
                </div>
              </div>
            )}

            {/* 4. SYNTAX BREAKDOWN */}
            {activeStep === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Syntax Parameter Breakdown</h4>
                    <span className="text-[10px] text-yellow-600 dark:text-yellow-400 uppercase font-mono font-bold tracking-widest leading-none">Detailed Code Segment Interpretation</span>
                  </div>
                </div>

                <div className="bg-neutral-950 text-white rounded-xl p-4 font-mono text-xs overflow-x-auto border border-neutral-850 shadow-inner">
                  <span className="text-teal-400 uppercase text-[9px] block mb-1 font-bold tracking-wider">// CODE INPUT PROFILE</span>
                  <code>{topic.syntaxRef.syntax}</code>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-neutral-405 block">Detailed Line-By-Line Logical Split:</span>
                  
                  <div className="space-y-2">
                    {getSyntaxBreakdown().map((b, i) => (
                      <div key={i} className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-150 flex flex-col md:flex-row gap-2 justify-between">
                        <div className="flex items-center gap-2 shrink-0 md:w-1/3">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                          <span className="text-neutral-900 dark:text-neutral-100 font-bold text-xs font-mono">{b.label}</span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <code className="text-[11px] block bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono">{b.code}</code>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{b.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. BEHIND THE SCENES */}
            {activeStep === 5 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">🧠</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Behind The Scenes Internals</h4>
                    <span className="text-[10px] text-rose-500 uppercase font-mono font-bold tracking-widest leading-none">Browser Engine & Host Memory Footprint</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-950 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-teal-550 uppercase">1. RAM Heap / Allocation Stack</span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{getBehindTheScenes().heap}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-950 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-pink-550 uppercase">2. Browser Main Parser / Rendering Engine</span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{getBehindTheScenes().browser}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-950 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-indigo-550 uppercase">3. Execution Priority Loops</span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{getBehindTheScenes().thread}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. REAL-WORLD EXAMPLES */}
            {activeStep === 6 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">💼</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Real-World Production Architectures</h4>
                    <span className="text-[10px] text-amber-500 uppercase font-mono font-bold tracking-widest leading-none">Industrial Use Profiles and Stacks</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {getRealWorldProduction().map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-250 shadow-3xs space-y-3">
                      <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-900 p-2 rounded-xl">
                        <h5 className="font-bold text-neutral-905 dark:text-white text-xs sm:text-sm font-sans flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {item.system}
                        </h5>
                        <span className="text-[9px] font-mono bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 text-indigo-600 p-1.5 rounded uppercase font-bold">PROD SCALE</span>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.scope}</p>
                      
                      <div className="flex gap-2 text-[10px] items-center text-neutral-450 font-mono">
                        <span className="font-bold text-[10px] text-neutral-500 dark:text-neutral-400">Tech Stack:</span>
                        <span>{item.stack}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. COMMON MISTAKES */}
            {activeStep === 7 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Common Mistakes & Antipatterns</h4>
                    <span className="text-[10px] text-red-500 uppercase font-mono font-bold tracking-widest leading-none">Avoid Critical Logic Traps</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {topic.commonMistakes.map((mistake, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-neutral-150 bg-neutral-55 font-sans">
                      <div className="p-3.5 bg-red-50/20 dark:bg-red-950/10 border border-red-500/10 rounded-lg space-y-1">
                        <span className="text-[10px] font-mono text-red-500 font-black block">❌ INCORRECT / UNSAFE WAY</span>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{mistake}</p>
                      </div>
                      <div className="p-3.5 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-500/10 rounded-lg space-y-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-500 font-black block">✅ SECURE / OPTIMIZED METHOD</span>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">Incorporate strict scope wrappers, clean up event binds, and utilize declarative block elements.</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. INTERACTIVE DEBUGGER SIMULATOR */}
            {activeStep === 8 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">🛠️</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Interactive Debugger Simulator</h4>
                    <span className="text-[10px] text-amber-600 uppercase font-mono font-bold tracking-widest leading-none">Diagnosis of Compiles Exception Errors</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-950 text-white border border-neutral-850 font-mono text-xs space-y-4">
                  <div>
                    <span className="text-red-400 font-bold text-[9px] uppercase block mb-1">🚨 THROWN COMPILER WARNING:</span>
                    <code className="text-red-400 text-xs font-semibold">{getDebuggerSample().error}</code>
                  </div>

                  <div className="border-t border-neutral-900 pt-3">
                    <span className="text-indigo-400 font-bold text-[9px] uppercase block mb-1">🔍 WHY IT OCCURRED:</span>
                    <p className="text-neutral-400 text-xs font-sans leading-normal">{getDebuggerSample().why}</p>
                  </div>

                  <div className="border-t border-neutral-900 pt-3">
                    <span className="text-emerald-400 font-bold text-[9px] uppercase block mb-1">🔧 ACTIONABLE REFACTORING FIX:</span>
                    <p className="text-neutral-400 text-xs font-sans leading-normal mb-2">{getDebuggerSample().fix}</p>
                    <div className="bg-emerald-950/30 p-2 rounded border border-emerald-800/10 text-emerald-400 font-mono text-xs">
                      {`// Applied fix sequence successfully.\n// Verification diagnostics exited cleanly with code 0.`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. TRIVIA INTERACTIVE EXERCISES */}
            {activeStep === 9 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">📝</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Trivia Interactive Exercises</h4>
                    <span className="text-[10px] text-indigo-600 uppercase font-mono font-bold tracking-widest leading-none font-black text-xs">Commit Concepts to Memory</span>
                  </div>
                </div>

                {/* Level toggle */}
                <div className="flex gap-2 border-b border-neutral-100 pb-3">
                  {(['easy', 'medium', 'hard'] as const).map(lev => (
                    <button
                      key={lev}
                      onClick={() => {
                        setExerciseLevel(lev);
                        setExerciseFeedback(null);
                        setExerciseInput('');
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-lg uppercase font-mono ${exerciseLevel === lev ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-950'}`}
                    >
                      {lev}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs sm:text-sm font-semibold text-neutral-805 dark:text-neutral-200 block">{exercise.question}</label>
                  
                  <input 
                    type="text"
                    value={exerciseInput}
                    onChange={e => setExerciseInput(e.target.value)}
                    placeholder={exercise.placeholder}
                    className="w-full p-3 bg-neutral-950 text-emerald-400 border border-neutral-800 rounded-xl font-mono text-xs focus:ring-1 focus:ring-indigo-500"
                  />

                  {exerciseFeedback && (
                    <div className={`p-3 text-xs rounded-lg font-bold ${exerciseFeedback.success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {exerciseFeedback.text}
                    </div>
                  )}

                  <button
                    onClick={handleVerifyExercise}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black tracking-tight"
                  >
                    Confirm Solution Code
                  </button>
                </div>
              </div>
            )}

            {/* 10. DYNAMIC VISUAL PLAYGROUND */}
            {activeStep === 10 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Active Code Visual Playground</h4>
                    <span className="text-[10px] text-teal-600 uppercase font-mono font-bold tracking-widest leading-none">Instant Compile & Execution Testing</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider font-mono">Sandbox Interactive Editor:</span>
                  <textarea 
                    value={playgroundCode}
                    onChange={e => setPlaygroundCode(e.target.value)}
                    className="w-full h-44 bg-neutral-950 p-4 border border-neutral-800 font-mono text-xs text-green-400 rounded-xl focus:ring-1 focus:ring-indigo-500 leading-normal"
                    placeholder="Enter executable code segment to paint..."
                  />

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider font-mono">System Console Output:</span>
                    <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl min-h-24 font-mono text-xs text-neutral-400 space-y-1.5 max-h-40 overflow-y-auto leading-relaxed">
                      {playgroundOutput.length === 0 ? (
                        <span className="text-neutral-550 italic block mt-2 text-center text-[11px]">System standby. Click compile to trigger local execution runs.</span>
                      ) : (
                        playgroundOutput.map((l, i) => (
                          <div key={i} className={l.startsWith('❌') ? 'text-red-400' : l.startsWith('✅') || l.startsWith('🏆') ? 'text-green-405' : 'text-neutral-400'}>
                            {l}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleRunPlayground}
                      disabled={playgroundRunning}
                      className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:bg-neutral-400 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {playgroundRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                      Execute Interactive Sandbox
                    </button>
                    <button
                      onClick={() => onOpenPlayground(playgroundCode, category === 'CSS' ? 'css' : category === 'React' ? 'react' : 'js')}
                      className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-400"
                    >
                      Open in Main Playground Window
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 11. CAPSTONE MINI-PROJECT */}
            {activeStep === 11 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">🏗️</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">{project.title}</h4>
                    <span className="text-[10px] text-pink-500 uppercase font-mono font-bold tracking-widest leading-none">Complete Practice Task Module</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic">{project.brief}</p>

                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-2.5">
                  <h5 className="font-bold text-indigo-900 dark:text-indigo-300 text-xs uppercase tracking-wider font-mono">Detailed Step-By-Step Architecture:</h5>
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs text-neutral-650">
                    {project.steps.map((st, i) => <li key={i}>{st}</li>)}
                  </ol>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider font-mono">Starter code blueprint:</span>
                  <pre className="p-4 bg-neutral-950 text-teal-400 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-850 select-all">
                    {project.source}
                  </pre>
                </div>

                <button
                  onClick={() => onOpenPlayground(project.source, category === 'CSS' ? 'css' : category === 'React' ? 'react' : 'js')}
                  className="px-5 py-2.5 bg-linear-to-r from-purple-800 to-indigo-900 hover:from-purple-900 text-white rounded-xl text-xs font-black shadow-md"
                >
                  Assemble Capstone inside Active Sandbox
                </button>
              </div>
            )}

            {/* 12. STUDY NOTES, CHEATSHEETS & REVISION */}
            {activeStep === 12 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">📑</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Revision Decks & Flashcards</h4>
                    <span className="text-[10px] text-indigo-500 uppercase font-mono font-bold tracking-widest leading-none">Smart Cheat Sheets for Speed Study</span>
                  </div>
                </div>

                <div className="flex gap-2 border-b border-neutral-150 pb-3">
                  <button 
                    onClick={() => setCurrentCheatSheetType('cheat')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-mono ${currentCheatSheetType === 'cheat' ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-950'}`}
                  >
                    🚀 Speed Cheat Sheet
                  </button>
                  <button 
                    onClick={() => setCurrentCheatSheetType('flashcards')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-mono ${currentCheatSheetType === 'flashcards' ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-950'}`}
                  >
                    🎴 Active Flashcards
                  </button>
                </div>

                {currentCheatSheetType === 'cheat' ? (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 rounded-xl space-y-3">
                    <h5 className="font-bold text-neutral-900 dark:text-white text-xs uppercase font-mono flex items-center gap-1">
                      <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500/25" />
                      Topic Speed Run revision sheet:
                    </h5>
                    <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <li>• <strong>Objective:</strong> {topic.syntaxRef.notes}</li>
                      <li>• <strong>Complexity profile:</strong> constant lookup scales preferred when structuring loops.</li>
                      <li>• <strong>Standard Parameter fields:</strong> {topic.syntaxRef.parameters}</li>
                    </ul>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 pt-1">
                    {flashcards.map((fc, i) => (
                      <div 
                        key={i}
                        onClick={() => setFlashcardFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
                        className={`p-5 rounded-2xl border cursor-pointer select-none transition-all duration-300 min-h-24 flex flex-col justify-between items-center text-center ${flashcardFlipped[i] ? 'bg-indigo-50/10 border-indigo-500/30' : 'bg-neutral-50 dark:bg-neutral-950'}`}
                      >
                        <span className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">[ Click card to flip ]</span>
                        <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white my-2">
                          {flashcardFlipped[i] ? fc.a : fc.q}
                        </p>
                        <span className="text-[9px] uppercase tracking-widest font-mono font-black text-indigo-500 leading-none">
                          {flashcardFlipped[i] ? 'REVELATION ANSWER' : 'QUESTION CONCEPT'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 13. FAANG INTERVIEW PREP */}
            {activeStep === 13 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">FAANG Architecture Mock Reviews</h4>
                    <span className="text-[10px] text-purple-600 uppercase font-mono font-bold tracking-widest leading-none">Pass Concept Cracking Questions</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {interviewQuestions.map((q, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-250 shadow-3xs space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-black tracking-wider uppercase block">{q.frequentlyAsked}</span>
                        <h5 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mt-1">{q.q}</h5>
                      </div>

                      {interviewRevealed[idx] ? (
                        <div className="p-4 bg-purple-500/5 text-xs text-neutral-600 dark:text-neutral-350 rounded-xl border border-purple-500/10 leading-relaxed whitespace-pre-wrap select-text">
                          <strong className="text-purple-600 font-bold block mb-1">Approved Gold-Standard Response:</strong>
                          {q.a}
                        </div>
                      ) : (
                        <button
                          onClick={() => setInterviewRevealed(prev => ({ ...prev, [idx]: true }))}
                          className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold rounded-lg transition"
                        >
                          👁️ Reveal Approved Interview Model Answer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 14. TIMED CHALLENGE MODE */}
            {activeStep === 14 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Timed Challenge Mode</h4>
                    <span className="text-[10px] text-amber-500 uppercase font-mono font-bold tracking-widest leading-none">Test Quick Recall under Clock Limits</span>
                  </div>
                </div>

                {!challengeActive && challengeScore === null && (
                  <div className="p-6 text-center space-y-3">
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Answer 2 high-level questions in 60 seconds to secure a +200 XP speed modifier.</p>
                    <button
                      onClick={handleStartChallenge}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg inline-flex items-center gap-1.5"
                    >
                      <Clock className="w-4 h-4 text-neutral-950 fill-current" />
                      Begin Timed Challenge Run
                    </button>
                  </div>
                )}

                {challengeActive && (
                  <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-xs font-mono font-bold text-red-500 uppercase">Clocks countdown: {challengeTimer}s</span>
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                    </div>

                    <div className="space-y-5">
                      {challengeQuestions.map((q, idx) => (
                        <div key={idx} className="space-y-3">
                          <p className="text-xs sm:text-sm font-bold">{idx + 1}. {q.q}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt, oIdx) => {
                              const works = selectedChallengeAnswers[idx] === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectChallengeAnswer(idx, oIdx)}
                                  className={`p-3 text-xs text-left rounded-lg border transition ${works ? 'bg-amber-500/10 border-amber-500 font-bold text-amber-700' : 'bg-white hover:bg-neutral-55 dark:bg-neutral-900'}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={evaluateChallenge}
                      className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
                    >
                      Lock Challenge Answers & Stop Timer
                    </button>
                  </div>
                )}

                {challengeScore !== null && (
                  <div className="p-6 text-center space-y-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                    <span className="text-3xl">🏆</span>
                    <div>
                      <h5 className="font-black text-emerald-600 text-base">Challenge Concluded!</h5>
                      <span className="text-xs text-neutral-500 font-mono">Your speed-run final accuracy metrics: {challengeScore}%</span>
                    </div>

                    {challengeScore >= 70 ? (
                      <p className="text-xs text-emerald-600 font-bold">Excellent! Passing bar met. XP added instantly to profile ledger.</p>
                    ) : (
                      <p className="text-xs text-red-500">Score fell below matching 70% threshold. Reset to attempt the run again!</p>
                    )}

                    <button
                      onClick={() => {
                        setChallengeScore(null);
                        setChallengeActive(false);
                      }}
                      className="px-4 py-2 border rounded-lg text-xs font-bold font-mono text-neutral-500 hover:text-indigo-600"
                    >
                      Reset Challenge Loop
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 15. MASTERY TEST GATE */}
            {activeStep === 15 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Topic Complete Mastery Test</h4>
                    <span className="text-[10px] text-emerald-600 uppercase font-mono font-bold tracking-widest leading-none">Secure passing bar of 70% to finalize chapter</span>
                  </div>
                </div>

                {!masterySubmitted ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-yellow-500/5 text-xs text-yellow-600 rounded-xl border border-yellow-500/10 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-yellow-500 shrink-0" />
                      <span><strong>Notice:</strong> Complete sections sequentially. You must clear this test with a 70% score or above before marking this syllabus unit fully complete.</span>
                    </div>

                    <div className="space-y-5">
                      {masteryQuestions.map((mq, idx) => (
                        <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 rounded-xl space-y-3">
                          <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">{idx + 1}. {mq.q}</p>
                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {mq.options.map((opt, oIdx) => {
                              const works = masteryAnswers[idx] === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectMasteryAnswer(idx, oIdx)}
                                  className={`p-3 text-xs text-left rounded-lg border transition ${works ? 'bg-indigo-600/10 border-indigo-500 text-indigo-700 dark:text-indigo-400 font-bold' : 'bg-white hover:bg-neutral-55 dark:bg-neutral-900'}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {masteryError && (
                      <div className="text-xs text-red-500 font-mono font-bold">{masteryError}</div>
                    )}

                    <button
                      onClick={submitMasteryTest}
                      className="w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md"
                    >
                      Authenticate Mastery & Lock Score
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-2xl">
                    <span className="text-4xl text-indigo-500">🎓</span>
                    <div>
                      <h5 className="font-black text-neutral-900 dark:text-white text-base">Mastery assessment concluded!</h5>
                      <p className="text-xs text-neutral-500 mt-1">Passing requirement parameter threshold: <strong>70% score</strong></p>
                    </div>

                    <div className="inline-block py-2 px-6 bg-indigo-650 text-white rounded-xl font-mono text-lg font-black tracking-tight">
                      YOUR SCORE: {masteryScore}%
                    </div>

                    {masteryScore !== null && masteryScore >= 70 ? (
                      <div className="space-y-2">
                        <p className="text-xs text-emerald-600 font-bold">🎉 Outstanding! You cleared the mastery parameters. You can now mark this lesson completed and unlock subsequent topics.</p>
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 text-xs font-mono font-bold rounded-lg border border-emerald-500/20">
                          XP Modifier Added: +400 XP
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-red-500 font-bold">⚠️ Scoring fell below the 70% threshold. Please review the explanation manuals and retry.</p>
                        <button
                          onClick={() => {
                            setMasterySubmitted(false);
                            setMasteryAnswers({});
                            setMasteryScore(null);
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg"
                        >
                          Retry Mastery Exam
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Quick interactive pagination triggers at base */}
          <div className="flex justify-between items-center border-t border-neutral-100 dark:border-neutral-850 pt-4 mt-6">
            <button
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="px-3.5 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-[11px] font-bold text-neutral-500 hover:text-indigo-600 transition disabled:opacity-40 select-none cursor-pointer"
            >
              ← Previous Segment
            </button>
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-450 tracking-wider">Step {activeStep} of 15</span>
            <button
              onClick={() => setActiveStep(prev => Math.min(15, prev + 1))}
              disabled={activeStep === 15}
              className="px-3.5 py-1.5 bg-neutral-950 text-white hover:bg-neutral-900 rounded-lg text-[11px] font-bold transition disabled:opacity-40 select-none cursor-pointer"
            >
              Next Segment →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
