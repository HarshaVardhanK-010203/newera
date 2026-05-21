import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, Layout, Layers, HelpCircle, Terminal, Cpu, Award, Zap, 
  Play, RefreshCw, CheckCircle, AlertTriangle, FileText, Bookmark, 
  Code, Eye, Check, ChevronRight, HelpCircle as QuestionIcon, Clock, Lock, BookOpen, Share, ArrowRight,
  Search, Info
} from 'lucide-react';
import { Topic, UserProfile } from '../types';
import { EXHAUSTIVE_DEEP_CONTENT, EXHAUSTIVE_HTML_TAGS } from '../data/exhaustiveDeepContent';
import ArrayMethodVisualizer from './ArrayMethodVisualizer';
import { 
  EXHAUSTIVE_CSS_PROPERTIES, 
  EXHAUSTIVE_JS_METHODS, 
  EXHAUSTIVE_REACT_HOOKS, 
  EXHAUSTIVE_NODE_MODULES, 
  EXHAUSTIVE_EXPRESS_METHODS, 
  EXHAUSTIVE_API_CONCEPTS, 
  EXHAUSTIVE_SQL_COMMANDS 
} from '../data/exhaustiveEcosystems';

interface DeepLearningProps {
  topic: Topic;
  profile: UserProfile;
  onSaveProgress: (payload: { topicId: string; quizCompleted?: boolean; isChallenge?: boolean; isProject?: boolean; xpBonus?: number; quizScore?: number }) => void;
  onOpenPlayground: (code: string, tab: 'html' | 'css' | 'js' | 'react') => void;
  onReturnToRoadmap?: () => void;
}

export default function DeepLearningModule({ topic, profile, onSaveProgress, onOpenPlayground, onReturnToRoadmap }: DeepLearningProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [playgroundCode, setPlaygroundCode] = useState<string>('');
  const [playgroundOutput, setPlaygroundOutput] = useState<string[]>([]);
  const [playgroundRunning, setPlaygroundRunning] = useState<boolean>(false);
  
  // Lexicon dictionary states
  const [lexiconSearch, setLexiconSearch] = useState<string>('');
  const [selectedLexiconEcosystem, setSelectedLexiconEcosystem] = useState<string>('');
  const [selectedEcosystemItem, setSelectedEcosystemItem] = useState<any>(null);

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
  const deepContent = EXHAUSTIVE_DEEP_CONTENT[topic.id];

  // Set the default ecosystem tab on load or topic change
  useEffect(() => {
    setSelectedLexiconEcosystem(category);
    setSelectedEcosystemItem(null);
    setLexiconSearch('');
  }, [topic, category]);

  const getSelectedEcosystemItems = () => {
    switch (selectedLexiconEcosystem) {
      case 'HTML':
        return { items: EXHAUSTIVE_HTML_TAGS, labelKey: 'tag', type: 'HTML Tag' };
      case 'CSS':
        return { items: EXHAUSTIVE_CSS_PROPERTIES, labelKey: 'property', type: 'CSS Property' };
      case 'React':
        return { items: EXHAUSTIVE_REACT_HOOKS, labelKey: 'hook', type: 'React Hook' };
      case 'NodeJS':
        return { items: [...EXHAUSTIVE_NODE_MODULES, ...EXHAUSTIVE_EXPRESS_METHODS], labelKey: 'module', type: 'Node/Express API' };
      case 'SQL':
        return { items: EXHAUSTIVE_SQL_COMMANDS, labelKey: 'command', type: 'SQL Command' };
      case 'JavaScript':
        return { items: EXHAUSTIVE_JS_METHODS, labelKey: 'method', type: 'JS Method' };
      default:
        return { items: EXHAUSTIVE_API_CONCEPTS, labelKey: 'concept', type: 'API Concept' };
    }
  };

  const getEcosystemItemLabel = (item: any, platform: string) => {
    if (!item) return '';
    if (platform === 'HTML') return item.tag || '';
    if (platform === 'CSS') return item.property || '';
    if (platform === 'React') return item.hook || '';
    if (platform === 'SQL') return item.command || '';
    if (platform === 'JavaScript') return item.method || '';
    if (platform === 'NodeJS') return item.module || item.method || '';
    return item.concept || '';
  };

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
    if (deepContent?.engineInternals) {
      return {
        heap: deepContent.engineInternals.heap,
        browser: deepContent.engineInternals.runtime,
        thread: deepContent.engineInternals.priority
      };
    }
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
    if (deepContent?.prodUseCases) {
      return deepContent.prodUseCases;
    }
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
    if (deepContent?.debuggerSample) {
      return deepContent.debuggerSample;
    }
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
    if (deepContent?.triviaExercises) {
      const easyEx = deepContent.triviaExercises.find(e => e.level.toLowerCase() === 'easy') || deepContent.triviaExercises[0];
      const medEx = deepContent.triviaExercises.find(e => e.level.toLowerCase() === 'medium') || deepContent.triviaExercises[1] || easyEx;
      const hardEx = deepContent.triviaExercises.find(e => e.level.toLowerCase() === 'hard') || deepContent.triviaExercises[2] || medEx;
      return {
        easy: {
          question: easyEx?.question || "Submit basic code validation.",
          placeholder: `e.g. ${easyEx?.solution || 'code'}`,
          solution: easyEx?.solution || "code",
          tip: easyEx?.tip || "Inspect lessons carefully."
        },
        medium: {
          question: medEx?.question || "Submit intermediate validation.",
          placeholder: `e.g. ${medEx?.solution || 'syntax'}`,
          solution: medEx?.solution || "syntax",
          tip: medEx?.tip || "Recall logical rules."
        },
        hard: {
          question: hardEx?.question || "Submit expert optimization code.",
          placeholder: `e.g. ${hardEx?.solution || 'method'}`,
          solution: hardEx?.solution || "method",
          tip: hardEx?.tip || "Review behind safety standards."
        }
      };
    }
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
  const flashcards = deepContent?.revisionDecks || [
    { q: "What memory model governs local block scopes?", a: "The stack is used for temporary functional call frames, while the heap stores large dynamic variables and closure contexts." },
    { q: "What defines responsive design layout grids?", a: "Using media rules combined with auto-fit layout algorithms to preserve visual density ratios across screens." },
    { q: "What role does JIT compilation play in Node?", a: "The V8 compiler analyzes executing script paths, compiling frequently invoked blocks immediately down to native binary hardware commands." }
  ];

  // 13. High-tier Interview Prep questions
  const interviewQuestions = deepContent?.interviewPrep || [
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
    <div id="deep-learning-terminal" className="space-y-8 text-[#F8FAFC]">
      
      {/* Immersive Deep Learning Hub Banner */}
      <div className="p-6 bg-[#111827] border border-white/5 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-r from-[#7C3AED]/20 to-[#06B6D4]/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-ping"></span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#06B6D4] uppercase font-semibold">Active Syllabus Handbook</span>
            </div>
            <h3 className="text-xl font-black mt-2 font-display tracking-tight text-white uppercase">{topic.title} Core Manual</h3>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-xl">
              A comprehensive single-page article tracing compiled syntax rules, execution paths, memory indices, and interview requirements.
            </p>
          </div>
          <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/5 text-xs flex items-center gap-2">
            <span className="text-[#F59E0B]">⭐</span>
            <span className="font-mono text-[11px] font-bold text-white">CHAPTER XP VALUE: +400</span>
          </div>
        </div>
      </div>

      {/* Main Structural Layout: Sticky ToC Left, Flowing Article Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* Left Column: Sticky Table of Contents & Progress Dashboard */}
        <div className="lg:col-span-3 lg:sticky lg:top-4 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pb-4 pr-1">
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[10px] font-mono uppercase font-black tracking-wider text-[#94A3B8]">Handbook Content</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#7C3AED]/20 text-[#06B6D4] rounded font-bold">15 Lessons</span>
            </div>

            {/* Scroll Progress Metric Card */}
            <div className="p-3 bg-[#1A2234] rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono font-black text-[#94A3B8]">
                <span>Active Reading Step:</span>
                <span className="text-[#22C55E]">STEP {activeStep} / 15</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] h-1.5 rounded-full transition-all duration-350" 
                  style={{ width: `${(activeStep / 15) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Smooth Scroll Navigation Links */}
            <nav className="space-y-1">
              {[
                { idx: 1, label: "Beginner Analogy", icon: "🍼" },
                { idx: 2, label: "Technical Design", icon: "⚙️" },
                { idx: 3, label: "Visual System Map", icon: "🎨" },
                { idx: 4, label: "Syntax Breakdown", icon: "🔍" },
                { idx: 5, label: "Behind V8 Engine", icon: "🧠" },
                { idx: 6, label: "Industrial Cases", icon: "💼" },
                { idx: 7, label: "Avoid Mistakes", icon: "⚠️" },
                { idx: 8, label: "Exception Debugger", icon: "🛠️" },
                { idx: 9, label: "Trivia Exercise", icon: "📝" },
                { idx: 10, label: "Code Sandbox", icon: "🎯" },
                { idx: 11, label: "Capstone Code", icon: "🏗️" },
                { idx: 12, label: "Summary Decks", icon: "📑" },
                { idx: 13, label: "FAANG Prep Q&A", icon: "🎓" },
                { idx: 14, label: "Recall Challenge", icon: "⏱️" },
                { idx: 15, label: "Graduation Gate", icon: "🏆" }
              ].map((step) => {
                const isActive = activeStep === step.idx;
                return (
                  <button 
                    key={step.idx}
                    onClick={() => {
                      setActiveStep(step.idx);
                      const el = document.getElementById(`step-sec-${step.idx}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#7C3AED]/75 text-white font-semibold shadow-md border-l-2 border-[#06B6D4]' 
                        : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-sm shrink-0">{step.icon}</span>
                    <span className="truncate text-[11px] leading-none">{step.idx}. {step.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Widget inside vertical tray */}
          <div className="p-3.5 bg-[#1A2234] border border-white/5 rounded-2xl space-y-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-black">Dynamic Status Track</h4>
            <div className="space-y-1 text-[10px] text-[#94A3B8] leading-normal font-mono">
              <div className="flex items-center gap-1.5">
                <span className={challengeScore !== null ? "text-[#22C55E]" : "text-white/20"}>✓</span>
                <span>Timed Challenge: {challengeScore !== null ? `${challengeScore}%` : "Pending"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={masteryScore !== null && masteryScore >= 70 ? "text-[#22C55E]" : "text-white/20"}>✓</span>
                <span>Mastery Gate: {masteryScore !== null ? `${masteryScore}%` : "Graduation pending"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Exhaustive Long-Form Scrollable Article */}
        <div className="lg:col-span-9 space-y-10">
          
          {/* STEP 1: BEGINNER EXPLANATION */}
          <section id="step-sec-1" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">🍼</span>
              <div>
                <span className="text-[9px] text-[#06B6D4] uppercase font-mono font-black tracking-widest block">Chapter Segment 1 • Conceptual Layman Analogy</span>
                <h4 className="text-lg font-black text-white font-display">Beginner Analogy Bridge</h4>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-[#22C55E]/5 to-transparent border-l-4 border-[#22C55E] rounded-r-xl">
              <p className="text-xs font-black font-mono text-[#22C55E] mb-1.5 tracking-wider uppercase">💡 Simple Metaphor Model:</p>
              <p className="text-xs sm:text-sm text-[#94A3B8] italic leading-relaxed select-text">
                "{deepContent?.beginnerAnalogy || `Let's picture this concept like a structured highway toll system. Instead of throwing vehicles randomly into the lanes, we establish specific toll terminals, forcing cars into categorized paths so traffic flows cleanly and logically.`}"
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed select-text">
              {deepContent?.beginnerDetail || `We break the rules down with high conceptual ease. In standard environments, code execution requires careful blueprints. Think of this topic as a blueprint. Just as you wouldn't build a house without proper framing, you wouldn't write computer code without understanding its structure.`}
            </p>

            <div className="p-4 bg-[#1A2234] border border-white/5 rounded-xl space-y-2">
              <h5 className="font-bold text-[#F8FAFC] text-xs font-mono">Core Pillars Broken Down Simply:</h5>
              <ul className="space-y-1 text-xs text-[#94A3B8]">
                <li>• <strong>Standard Variables:</strong> Named memory addresses caching specific values inside registers.</li>
                <li>• <strong>Application Frameworks:</strong> Pre-assembled templates which accelerate layout rendering speeds.</li>
                <li>• <strong>Dynamic Styles:</strong> Visual transformation pipelines converting raw calculations into graphics on users' screens.</li>
              </ul>
            </div>
          </section>

          {/* STEP 2: TECHNICAL EXPLANATION */}
          <section id="step-sec-2" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">⚙️</span>
              <div>
                <span className="text-[9px] text-[#7C3AED] uppercase font-mono font-black tracking-widest block">Chapter Segment 2 • Specifications Document</span>
                <h4 className="text-lg font-black text-white font-display">Technical Architecture & Engine Theory</h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed whitespace-pre-wrap select-text">
              {deepContent?.technicalDepth || topic.explanation}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 Pt-2">
              <div className="p-4 bg-[#1A2234] border border-white/5 rounded-xl">
                <h5 className="text-[9px] font-mono text-[#06B6D4] uppercase font-black mb-1">Architectural Decoupling</h5>
                <p className="text-xs text-[#94A3B8]">{topic.whyExists}</p>
              </div>
              <div className="p-4 bg-[#1A2234] border border-white/5 rounded-xl">
                <h5 className="text-[9px] font-mono text-[#06B6D4] uppercase font-black mb-1">Production Objectives</h5>
                <p className="text-xs text-[#94A3B8]">{topic.realWorldUse}</p>
              </div>
            </div>
          </section>

          {/* STEP 3: VISUAL EXPLANATION & FLOWCHARTS */}
          <section id="step-sec-3" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">🎨</span>
              <div>
                <span className="text-[9px] text-[#06B6D4] uppercase font-mono font-black tracking-widest block">Chapter Segment 3 • Memory Flow Chart</span>
                <h4 className="text-lg font-black text-white font-display">Visual Graph Map & Render Pathways</h4>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8]">
              Analyze this structured flowchart mapping the parsing process within the engine.
            </p>

            {topic.id === 'js-core' ? (
              <div className="pt-2">
                <ArrayMethodVisualizer />
              </div>
            ) : (
              <div className="p-4 bg-[#0A0F1C] text-[#06B6D4] rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-white/5 shadow-inner">
                <span className="text-[8px] text-[#94A3B8] block mb-2 font-bold uppercase tracking-wider">// SYSTEM EXECUTION RUN PATHS</span>
                <pre>{deepContent?.visualAscii || topic.visualDiagram || `[ INPUT PAYLOAD ]\n       |\n       v (Transformation Rule)\n[ PARSING BLOCK ]\n       |\n       v (Evaluate Bounds check)\n[ COMPLETED STREAM ]`}</pre>
              </div>
            )}
          </section>

          {/* STEP 4: COMPLETE SYNTAX SYSTEM */}
          <section id="step-sec-4" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">🔍</span>
              <div>
                <span className="text-[9px] text-[#F59E0B] uppercase font-mono font-black tracking-widest block">Chapter Segment 4 • Synthetic Reference Layouts</span>
                <h4 className="text-lg font-black text-white font-display">Syntax Directives & Parameter Breakdown</h4>
              </div>
            </div>

            <div className="p-4 bg-[#0A0F1C] text-white rounded-xl font-mono text-xs overflow-x-auto border border-white/5 relative group">
              <button 
                onClick={() => {
                  onOpenPlayground(topic.syntaxRef.syntax, category === 'CSS' ? 'css' : category === 'HTML' ? 'html' : category === 'React' ? 'react' : 'js');
                }}
                className="absolute top-2.5 right-2.5 px-3 py-1 bg-[#1A2234] hover:bg-white/10 text-[10px] text-[#06B6D4] font-semibold rounded border border-white/5 cursor-pointer hover:scale-101 transition duration-150"
              >
                📥 Copy Syntax to Workspace
              </button>
              <span className="text-[#94A3B8] uppercase text-[9px] block mb-2 font-black tracking-widest">// SYNTACTIC TEMPLATE RULES</span>
              <code>{topic.syntaxRef.syntax}</code>
            </div>

            <div className="space-y-3.5 pt-2">
              <span className="text-[10px] font-mono tracking-wider uppercase font-black text-[#94A3B8] block">Semantic Parameters Breakdown:</span>
              <div className="space-y-2.5">
                {getSyntaxBreakdown().map((item, index) => (
                  <div key={index} className="p-3 bg-[#1A2234] border border-white/5 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#06B6D4] font-black">{item.label}</span>
                      <span className="text-[#94A3B8]">{index + 1} of {getSyntaxBreakdown().length}</span>
                    </div>
                    <code className="text-xs block text-white font-mono bg-[#0A0F1C] p-2 rounded mt-1">{item.code}</code>
                    <p className="text-[11px] text-[#94A3B8] pt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* STEP 5: BEHIND THE SCENES */}
          <section id="step-sec-5" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">🧠</span>
              <div>
                <span className="text-[9px] text-[#06B6D4] uppercase font-mono font-black tracking-widest block">Chapter Segment 5 • Mechanical Compile Details</span>
                <h4 className="text-lg font-black text-white font-display">Inside the Engine Architecture</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#1A2234] border border-white/5 rounded-xl space-y-2">
                <span className="text-[9px] font-mono uppercase bg-[#7C3AED]/15 text-[#06B6D4] px-2 py-0.5 rounded font-black">// HEAP REGISTERS</span>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed select-text">{getBehindTheScenes().heap}</p>
              </div>

              <div className="p-4 bg-[#1A2234] border border-white/5 rounded-xl space-y-2">
                <span className="text-[9px] font-mono uppercase bg-[#06B6D4]/15 text-[#06B6D4] px-2 py-0.5 rounded font-black">// COMPILER FLOWS</span>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed select-text">{getBehindTheScenes().browser}</p>
              </div>

              <div className="p-4 bg-[#1A2234] border border-white/5 rounded-xl space-y-2">
                <span className="text-[9px] font-mono uppercase bg-[#22C55E]/15 text-[#22C55E] px-2 py-0.5 rounded font-black">// TASK QUEUE LOCK</span>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed select-text">{getBehindTheScenes().thread}</p>
              </div>
            </div>
          </section>

          {/* STEP 6: REAL-WORLD USE CASES */}
          <section id="step-sec-6" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">💼</span>
              <div>
                <span className="text-[9px] text-[#22C55E] uppercase font-mono font-black tracking-widest block">Chapter Segment 6 • Systems Deployment</span>
                <h4 className="text-lg font-black text-white font-display">Industrial Scenarios & Architectures</h4>
              </div>
            </div>

            <div className="space-y-4">
              {getRealWorldProduction().map((p, idx) => (
                <div key={idx} className="p-4.5 bg-[#1A2234] border border-white/5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center pb-1 border-b border-white/5">
                    <span className="text-xs font-black text-[#06B6D4] font-mono">{p.system}</span>
                    <span className="text-[9px] text-[#94A3B8] font-mono px-2 py-0.5 bg-white/5 rounded border border-white/5">{p.stack}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{p.scope}</p>
                </div>
              ))}
            </div>
          </section>

          {/* STEP 7: COMMON MISTAKES */}
          <section id="step-sec-7" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">⚠️</span>
              <div>
                <span className="text-[9px] text-[#EF4444] uppercase font-mono font-black tracking-widest block">Chapter Segment 7 • Risk Diagnostics</span>
                <h4 className="text-lg font-black text-white font-display">Logical Mistakes & Anti-Patterns</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "❌ Scope Clashing & Collision Limits", text: "Failing to encapsulate closures within modules, overriding system objects randomly during execution ticks." },
                { title: "❌ Excessive Style Recalculation Repaints", text: "Trumping grid coordinates inside animation ticks, forcing the CPU to continuously compile render blocks." }
              ].map((m, idx) => (
                <div key={idx} className="p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-xl space-y-1">
                  <h6 className="text-xs font-black text-[#EF4444] font-display">{m.title}</h6>
                  <p className="text-xs text-[#94A3B8] mt-1 line-clamp-3">{m.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* STEP 8: DIAGNOSTIC EXCEPTION DEBUGGER */}
          <section id="step-sec-8" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">🛠️</span>
              <div>
                <span className="text-[9px] text-[#06B6D4] uppercase font-mono font-black tracking-widest block">Chapter Segment 8 • Stack Exception Simulator</span>
                <h4 className="text-lg font-black text-white font-display">Diagnostic Exception Drills</h4>
              </div>
            </div>

            <div className="p-4 bg-[#1A2234] border border-white/5 rounded-2xl space-y-3.5">
              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl font-mono text-[11px] text-red-400">
                <span className="text-[9px] text-red-500 block uppercase font-bold tracking-wider mb-1">// SYSTEM FAULT DECODER LOGS</span>
                {getDebuggerSample().error}
              </div>

              <div className="space-y-2 text-xs text-[#94A3B8]">
                <p><strong>Logical Fault Analysis:</strong> {getDebuggerSample().why}</p>
                <div className="p-3 bg-[#101B2B] border border-[#22C55E]/20 rounded-xl mt-1">
                  <p className="text-[#22C55E] font-bold">🛠️ The Verified Refactor Method:</p>
                  <pre className="font-mono text-[11px] text-white mt-1.5 whitespace-pre-wrap">{getDebuggerSample().fix}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 9: TRIVIA EXERCISES */}
          <section id="step-sec-9" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">📝</span>
              <div>
                <span className="text-[9px] text-[#06B6D4] uppercase font-mono font-black tracking-widest block">Chapter Segment 9 • Active Quiz Validation</span>
                <h4 className="text-lg font-black text-white font-display">Syntax Validation Challenges</h4>
              </div>
            </div>

            <div className="p-4 bg-[#1A2234] rounded-2xl border border-white/5 space-y-4">
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => { setExerciseLevel(lvl as any); setExerciseFeedback(null); }}
                    className={`px-3 py-1 rounded text-[10px] font-mono uppercase font-black border transition cursor-pointer ${
                      exerciseLevel === lvl 
                        ? 'bg-[#7C3AED] border-[#7C3AED]/20 text-white' 
                        : 'bg-white/5 border-white/5 text-[#94A3B8] hover:bg-white/10'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-semibold">{getExerciseConfig()[exerciseLevel].question}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={getExerciseConfig()[exerciseLevel].placeholder}
                    value={exerciseInput}
                    onChange={(e) => setExerciseInput(e.target.value)}
                    className="flex-1 bg-[#0A0F1C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#7C3AED]"
                  />
                  <button
                    onClick={handleVerifyExercise}
                    className="px-4 py-2 bg-[#7C3AED] hover:bg-[#7C3AED]/85 border border-[#7C3AED]/20 text-xs font-bold rounded-lg text-white font-mono cursor-pointer"
                  >
                    Check Code
                  </button>
                </div>
                {exerciseFeedback && (
                  <p className={`text-xs font-bold font-mono mt-1 ${exerciseFeedback.success ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {exerciseFeedback.text}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* STEP 10: INTERPRETER SANDBOX */}
          <section id="step-sec-10" className="bg-[#111827] border border-[#7C3AED]/15 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">🎯</span>
              <div>
                <span className="text-[9px] text-[#7C3AED] uppercase font-mono font-black tracking-widest block">Chapter Segment 10 • Native Virtual Compiler</span>
                <h4 className="text-lg font-black text-white font-display">Live Interactive Execution Sandbox</h4>
              </div>
            </div>

            <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#0A0F1C] flex flex-col min-h-[300px]">
              <div className="p-3 bg-white/5 border-b border-white/5 flex justify-between items-center text-xs">
                <span className="font-mono text-[9px] text-[#06B6D4] font-black">SANDBOX INTERPRETER ACTIVE</span>
                <button
                  onClick={handleRunPlayground}
                  disabled={playgroundRunning}
                  className="px-3.5 py-1 bg-[#22C55E] hover:bg-[#22C55E]/85 disabled:opacity-40 text-neutral-950 hover:scale-[1.01] shrink-0 font-mono font-semibold text-[10px] rounded border border-white/10 transition cursor-pointer"
                >
                  {playgroundRunning ? 'Compiling...' : '▶ EVALUATE CODE'}
                </button>
              </div>

              <textarea
                value={playgroundCode}
                onChange={(e) => setPlaygroundCode(e.target.value)}
                className="flex-1 p-4 font-mono text-xs text-neutral-200 bg-[#0A0F1C] focus:outline-none resize-none min-h-[140px] leading-relaxed"
                rows={5}
              />

              <div className="p-3 bg-white/5 border-t border-white/5 font-mono text-[11px] space-y-1">
                <span className="text-[9px] font-black text-[#94A3B8] block">// SYSTEM CONSOLE LOGGER:</span>
                <div className="max-h-[100px] overflow-y-auto space-y-0.5 text-neutral-400 pr-2">
                  {playgroundOutput.length === 0 ? (
                    <span className="text-neutral-600 block italic leading-normal font-mono">System compiler idle. Edit values and click evaluate above.</span>
                  ) : (
                    playgroundOutput.map((l, idx) => (
                      <span key={idx} className="block leading-relaxed">{l}</span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* STEP 11: CAPSTONE MINI-PROJECT */}
          <section id="step-sec-11" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">🏗️</span>
              <div>
                <span className="text-[9px] text-[#22C55E] uppercase font-mono font-black tracking-widest block">Chapter Segment 11 • Software Portfolio Blueprint</span>
                <h4 className="text-lg font-black text-white font-display">Capstone Miniature Project</h4>
              </div>
            </div>

            <div className="p-4 bg-[#1A2234] border border-white/5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center pb-1 border-b border-white/5">
                <h5 className="font-extrabold text-xs text-[#06B6D4] font-mono uppercase">{getMiniProject().title}</h5>
                <span className="text-[9px] bg-[#22C55E]/10 text-[#22C55E] font-mono px-2 py-0.5 rounded font-black">// ARCHITECTURE FILE</span>
              </div>
              <p className="text-xs text-[#94A3B8]">{getMiniProject().brief}</p>
              
              <ul className="list-disc list-inside text-xs text-[#94A3B8] space-y-1 pl-1">
                {getMiniProject().steps.map((st, idx) => (
                  <li key={idx}><strong className="text-white">Objective {idx + 1}:</strong> {st}</li>
                ))}
              </ul>

              <div className="bg-[#0A0F1C] border border-white/5 rounded-xl p-4 font-mono text-xs text-neutral-300 relative">
                <button
                  onClick={() => onOpenPlayground(getMiniProject().source, category === 'CSS' ? 'css' : category === 'HTML' ? 'html' : category === 'React' ? 'react' : 'js')}
                  className="absolute top-2 right-2 px-2.5 py-0.5 bg-white/5 hover:bg-white/10 text-[9px] text-[#06B6D4] font-bold rounded cursor-pointer transition border border-white/5"
                >
                  Edit in IDE
                </button>
                <div className="text-[9px] text-neutral-600 font-bold mb-2">// SKELETON SOURCE CODE</div>
                <pre className="overflow-x-auto">{getMiniProject().source}</pre>
              </div>
            </div>
          </section>

          {/* STEP 12: CHEAT SHEETS & FLASHCARDS */}
          <section id="step-sec-12" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">📑</span>
              <div>
                <span className="text-[9px] text-[#94A3B8] uppercase font-mono font-black tracking-widest block">Chapter Segment 12 • Reference Flashcards</span>
                <h4 className="text-lg font-black text-white font-display">Cheat Sheets & Revision Materials</h4>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pb-2">
              {['summary', 'cheat', 'flashcards'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCurrentCheatSheetType(type as any)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase font-black rounded border transition cursor-pointer ${
                    currentCheatSheetType === type 
                      ? 'bg-[#7C3AED]/20 border-[#7C3AED]/40 text-[#06B6D4]' 
                      : 'bg-white/5 border-white/5 text-[#94A3B8] hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="p-4 bg-[#1A2234] border border-white/5 rounded-2xl min-h-[160px] flex flex-col justify-center">
              {currentCheatSheetType === 'summary' && (
                <div className="space-y-2 text-xs text-[#94A3B8] leading-relaxed select-text font-sans">
                  <h6 className="font-bold text-white text-xs uppercase font-mono">Curriculum Syllabus Review Notes:</h6>
                  <p className="border-l-2 border-[#7C3AED] pl-3">
                    Ensure that your variable scopes and CSS structures use standard formatting styles. Redundant layout calculations spike CPU workloads. Keep DB connection pools recycled carefully.
                  </p>
                  {deepContent?.cheatSheet && deepContent.cheatSheet.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <span className="text-[10px] text-white font-mono font-bold block">// EXTENSIVE CHEATSHEET SUMMARY</span>
                      <ul className="list-disc pl-4 space-y-1">
                        {deepContent.cheatSheet.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {currentCheatSheetType === 'cheat' && (
                <div className="space-y-3">
                  <h6 className="font-bold text-white text-xs uppercase font-mono mb-2">// CORE SUMMARY DIRECTORY</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {((deepContent?.cheatSheet && deepContent.cheatSheet.length > 0)
                      ? deepContent.cheatSheet.map((text) => ({
                          term: text.split(":")[0] || "Concept",
                          definition: text.split(":")[1] || text
                        }))
                      : [
                          { term: "Let Closures Allocation", definition: "Persistent local scope variables stored within active CPU heap sectors." },
                          { term: "CSS Grid Divisions", definition: "Slice columns cleanly dynamically using repeat rules and fr width fractions." }
                        ]
                    ).map((item, idx) => (
                      <div key={idx} className="p-3 bg-[#0A0F1C] border border-white/5 rounded-xl">
                        <span className="text-[#06B6D4] font-bold font-mono text-[11px] block">{item.term}</span>
                        <p className="text-[11px] text-[#94A3B8] mt-1 pr-1">{item.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentCheatSheetType === 'flashcards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                  {flashcards.map((card, idx) => {
                    const flipped = flashcardFlipped[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => setFlashcardFlipped(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="p-5 bg-gradient-to-br from-[#1A2234] to-[#111827] hover:to-[#1A2234]/90 border border-white/5 rounded-xl text-center min-h-[110px] flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden group border border-white/10"
                      >
                        <span className="absolute top-1 right-2 text-[8px] font-mono text-white/20 font-black">CLICK TO FLIP</span>
                        {!flipped ? (
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-mono font-bold text-[#94A3B8]">QUESTION DECK {idx + 1}</span>
                            <p className="text-xs font-bold text-white leading-snug">{card.q}</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-mono font-bold text-[#22C55E]">DECLASSIFIED ANSWER</span>
                            <p className="text-xs text-[#94A3B8] leading-relaxed">{card.a}</p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* STEP 13: FAANG INTERVIEW SPECIAL */}
          <section id="step-sec-13" className="bg-[#111827] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">🎓</span>
              <div>
                <span className="text-[9px] text-[#7C3AED] uppercase font-mono font-black tracking-widest block">Chapter Segment 13 • Professional Screening</span>
                <h4 className="text-lg font-black text-white font-display">FAANG Candidate Screening Questions</h4>
              </div>
            </div>

            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Examine these high-difficulty questions frequently requested in elite architectural vetting loops at Stripe, Google, and Meta.
            </p>

            <div className="space-y-3.5 mt-2">
              {interviewQuestions.map((q, idx) => {
                const isRevealed = interviewRevealed[idx];
                return (
                  <div key={idx} className="p-4 bg-[#1A2234] border border-white/5 rounded-xl space-y-2">
                    <p className="text-xs sm:text-sm font-semibold text-[#F8FAFC]">Q: {q.q}</p>
                    {isRevealed ? (
                      <div className="p-3 bg-white/5 rounded-lg border border-[#22C55E]/10 text-xs text-[#94A3B8] leading-relaxed select-text animate-fade-in">
                        <strong className="text-[#22C55E] block mb-1">Elite Consensus Answer:</strong>
                        {q.a}
                      </div>
                    ) : (
                      <button
                        onClick={() => setInterviewRevealed(prev => ({ ...prev, [idx]: true }))}
                        className="px-3.5 py-1.5 bg-[#7C3AED]/20 hover:bg-[#7C3AED]/35 text-[10px] font-mono font-extrabold uppercase text-[#06B6D4] rounded-lg border border-white/5 cursor-pointer transition select-none"
                      >
                        👁️ REVEAL ANSWER VERDICT
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 14: TIMED CHALLENGE */}
          <section id="step-sec-14" className="bg-[#111827] border border-[#F59E0B]/20 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">⏱️</span>
              <div>
                <span className="text-[9px] text-[#F59E0B] uppercase font-mono font-black tracking-widest block">Chapter Segment 14 • Speed Check Tests</span>
                <h4 className="text-lg font-black text-white font-display">Countdown Interactive Recall Recall</h4>
              </div>
            </div>

            {!challengeActive && challengeScore === null && (
              <div className="p-6 text-center space-y-4">
                <p className="text-[#94A3B8] text-xs sm:text-sm">Complete these speed questions inside 60 seconds to lock in speed metrics and score memory modifiers.</p>
                <button
                  onClick={handleStartChallenge}
                  className="px-6 py-3 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-neutral-950 font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg inline-flex items-center gap-1.5 hover:scale-[1.01] transition"
                >
                  <Clock className="w-4 h-4 text-neutral-950 fill-current" />
                  Initiate 60s Timed Recall Challenge
                </button>
              </div>
            )}

            {challengeActive && (
              <div className="p-5 rounded-2xl bg-[#0A0F1C] border border-white/5 space-y-5">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-xs font-mono font-bold text-[#EF4444] uppercase">TIME BURNING: {challengeTimer}s</span>
                  <span className="w-2.5 h-2.5 bg-[#EF4444] rounded-full animate-ping"></span>
                </div>

                <div className="space-y-6">
                  {challengeQuestions.map((q, idx) => (
                    <div key={idx} className="space-y-3">
                      <p className="text-xs sm:text-sm font-semibold text-white">{idx + 1}. {q.q}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selectedChallengeAnswers[idx] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectChallengeAnswer(idx, oIdx)}
                              className={`p-3 text-xs text-left rounded-lg border transition cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#F59E0B]/15 border-[#F59E0B] font-bold text-[#F59E0B]' 
                                  : 'bg-[#1A2234] border-white/5 text-[#94A3B8] hover:bg-white/5 hover:text-white'
                              }`}
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
                  className="w-full text-center py-2 bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-bold rounded-xl text-xs cursor-pointer transition border border-white/5"
                >
                  Grade Speed Responses
                </button>
              </div>
            )}

            {challengeScore !== null && (
              <div className="p-6 text-center space-y-4 bg-[#22C55E]/5 rounded-2xl border border-[#22C55E]/10">
                <span className="text-4xl">⏱️</span>
                <div>
                  <h5 className="font-black text-[#22C55E] text-base">Challenge Finalized!</h5>
                  <span className="text-xs text-[#94A3B8] font-mono">Precision metrics: {challengeScore}% Accuracy</span>
                </div>

                {challengeScore >= 70 ? (
                  <p className="text-xs text-[#22C55E] font-bold">Outstanding! Speed criteria verified. XP points updated on profile indicators.</p>
                ) : (
                  <p className="text-xs text-[#EF4444]">Score fell slightly below parameters threshold score of 70%. Reset and try.</p>
                )}

                <button
                  onClick={() => {
                    setChallengeScore(null);
                    setChallengeActive(false);
                  }}
                  className="px-4 py-2 border border-white/5 rounded-lg text-xs font-bold font-mono text-[#94A3B8] hover:text-[#7C3AED] cursor-pointer"
                >
                  Restart Challenge Loop
                </button>
              </div>
            )}
          </section>

          {/* STEP 15: GRADUATION TEST GATE */}
          <section id="step-sec-15" className="bg-[#111827] border-2 border-[#22C55E]/20 rounded-2xl p-6 md:p-8 space-y-5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex gap-3 items-center pb-3 border-b border-white/5">
              <span className="text-3xl">🏆</span>
              <div>
                <span className="text-[9px] text-[#22C55E] uppercase font-mono font-black tracking-widest block">Chapter Segment 15 • Graduation Certificate</span>
                <h4 className="text-lg font-black text-white font-display">Chapter Graduation Mastery Test</h4>
              </div>
            </div>

            {!masterySubmitted ? (
              <div className="space-y-6">
                <div className="p-4 bg-[#F59E0B]/5 text-xs text-[#F59E0B] rounded-xl border border-[#F59E0B]/10 flex items-center gap-2.5 font-mono">
                  <Lock className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span><strong>Graduation Notice:</strong> Answer all three assessment items with 70% accuracy to certify chapter studies success.</span>
                </div>

                <div className="space-y-5">
                  {masteryQuestions.map((mq, idx) => (
                    <div key={idx} className="p-4 bg-[#0A0F1C] border border-white/5 rounded-xl space-y-3.5">
                      <p className="text-xs sm:text-sm font-semibold text-white">{idx + 1}. {mq.q}</p>
                      <div className="grid grid-cols-1 gap-2 pt-1 font-sans">
                        {mq.options.map((opt, oIdx) => {
                          const isSelected = masteryAnswers[idx] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectMasteryAnswer(idx, oIdx)}
                              className={`p-3 text-xs text-left rounded-lg border transition cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#7C3AED]/15 border-[#7C3AED] text-[#06B6D4] font-bold' 
                                  : 'bg-[#1A2234] border-white/5 text-[#94A3B8] hover:bg-white/5 hover:text-white'
                              }`}
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
                  <div className="text-xs text-[#EF4444] font-mono font-bold">{masteryError}</div>
                )}

                <button
                  onClick={submitMasteryTest}
                  className="w-full text-center py-3.5 bg-[#22C55E] hover:bg-[#22C55E]/90 text-neutral-950 font-black rounded-xl text-xs sm:text-sm shadow-md cursor-pointer transition uppercase font-mono"
                >
                  Grade Answers & Graduate Topic
                </button>
              </div>
            ) : (
              <div className="p-6 text-center space-y-4 bg-[#7C3AED]/5 border border-[#7C3AED]/15 rounded-2xl">
                <span className="text-4xl">🎓</span>
                <div>
                  <h5 className="font-black text-white text-base">Graduation Evaluation Complete</h5>
                  <p className="text-xs text-[#94A3B8] font-mono mt-1">Passing requirement bar: <strong>70% score</strong></p>
                </div>

                <div className="inline-block py-2.5 px-6 bg-[#7C3AED] text-white rounded-xl font-mono text-lg font-black tracking-tight border border-[#7C3AED]/20">
                  YOUR GRADE: {masteryScore}%
                </div>

                {masteryScore !== null && masteryScore >= 70 ? (
                  <div className="space-y-4">
                    <p className="text-xs text-[#22C55E] font-bold">🎉 Outstanding work! You passed the graduation test. Progress synchronized successfully.</p>
                    <div className="p-3 bg-[#22C55E]/10 text-[#22C55E] text-xs font-mono font-bold rounded-lg border border-[#22C55E]/10 inline-block">
                      CREDENTIAL XP BONUS ADDED: +400 XP
                    </div>

                    {/* Premium return trigger */}
                    <div className="p-4 bg-[#0A0F1C] border border-[#06B6D4]/30 rounded-2xl shadow-lg relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/5 to-[#06B6D4]/5 opacity-50 pointer-events-none"></div>
                      <div className="relative z-10 space-y-3">
                        <span className="text-[10px] text-[#06B6D4] font-mono font-bold tracking-wider">// ROADMAP SYNC COMPLIANT</span>
                        <button
                          onClick={() => {
                            if (onReturnToRoadmap) {
                              onReturnToRoadmap();
                            }
                          }}
                          className="w-full relative overflow-hidden py-3 px-5 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-black rounded-xl text-xs sm:text-sm tracking-wide transition-all duration-300 transform hover:scale-[1.01] shadow-[0_0_20px_rgba(124,58,237,0.3)] cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>✓ Advance Roadmap & Unlock Subsequent Scope</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-[#EF4444] font-bold">⚠️ Diagnostic score returned below 70% threshold. Review the explanation sections and retry.</p>
                    <button
                      onClick={() => {
                        setMasterySubmitted(false);
                        setMasteryAnswers({});
                        setMasteryScore(null);
                      }}
                      className="px-4 py-2 bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white text-xs font-bold rounded-lg cursor-pointer transition font-mono"
                    >
                      Restart Mastery Test
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Sabbatical Academic Notes container footer */}
          <div className="p-4 bg-[#111827] border border-white/5 rounded-2xl text-center text-xs text-[#94A3B8]">
            🏆 Thank you for reading. Your study progress in {topic.title} has been logged. Use the Table of Contents on the left to review other chapters.
          </div>

        </div>

      </div>

    </div>
  );
}
