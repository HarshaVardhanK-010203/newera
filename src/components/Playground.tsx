import React, { useState, useEffect, useRef } from 'react';
import { Play, Download, HelpCircle, Terminal, Eye, Code, FileCode, Check, Copy, Share2 } from 'lucide-react';

interface PlaygroundProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  initialReact?: string;
  initialLanguage?: 'html' | 'css' | 'js' | 'react';
  onSaveProgress?: (xpGained: number) => void;
  onAskMentor?: (code: string) => void;
}

export default function Playground({
  initialHtml = "<h1>Hello, World!</h1>\n<p>Start editing to build something epic.</p>",
  initialCss = "body {\n  font-family: system-ui, sans-serif;\n  background: #fdfdfd;\n  color: #111;\n  padding: 2rem;\n  text-align: center;\n}",
  initialJs = "console.log('Hello from the interactive web console!');",
  initialReact = `// Simple React component with clean Tailwind CSS utilities
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="p-8 text-center max-w-sm mx-auto bg-white rounded-3xl border border-indigo-100 shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-800">React Counter</h2>
      <p className="text-5xl font-extrabold text-indigo-600 my-4">{count}</p>
      <div className="flex justify-center gap-3">
        <button 
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
        >
          Minus
        </button>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Add 
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Counter />);`,
  initialLanguage = 'html',
  onSaveProgress,
  onAskMentor
}: PlaygroundProps) {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [reactCode, setReactCode] = useState(initialReact);
  const [language, setLanguage] = useState<'html' | 'css' | 'js' | 'react'>(initialLanguage);
  
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync inputs with topic states if they alter
  useEffect(() => {
    if (initialHtml) setHtml(initialHtml);
    if (initialCss) setCss(initialCss);
    if (initialJs) setJs(initialJs);
    if (initialReact) setReactCode(initialReact);
    if (initialLanguage) setLanguage(initialLanguage);
  }, [initialHtml, initialCss, initialJs, initialReact, initialLanguage]);

  // Captures compiler updates from iframe environment
  useEffect(() => {
    const handleConsoleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'CONSOLE_LOG') {
        setConsoleLogs(prev => [...prev, `[LOG] ${e.data.content}`]);
      } else if (e.data && e.data.type === 'CONSOLE_ERROR') {
        setConsoleLogs(prev => [...prev, `[ERROR] ${e.data.content}`]);
      }
    };
    window.addEventListener('message', handleConsoleMessage);
    return () => window.removeEventListener('message', handleConsoleMessage);
  }, []);

  // Auto-save compiler code loops to standard memory state
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLastSaved(new Date().toLocaleTimeString());
    }, 1500);
    return () => clearTimeout(timeout);
  }, [html, css, js, reactCode]);

  // Execute compiler sequence and update Iframe document
  const runCode = () => {
    setConsoleLogs([]);
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (language === 'react') {
      const srcDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: system-ui, sans-serif; background: #fafafa; padding: 1.5rem; text-align: center; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script>
              const _log = console.log;
              console.log = function(...args) {
                window.parent.postMessage({ type: 'CONSOLE_LOG', content: args.join(' ') }, '*');
                _log.apply(console, args);
              };
              window.onerror = function(message, source, lineno, colno, error) {
                window.parent.postMessage({ type: 'CONSOLE_ERROR', content: message }, '*');
              };
            </script>
            <script type="text/babel">
              try {
                ${reactCode}
              } catch (err) {
                window.parent.postMessage({ type: 'CONSOLE_ERROR', content: err.message }, '*');
              }
            </script>
          </body>
        </html>
      `;
      iframe.srcdoc = srcDoc;
    } else {
      // HTML/CSS/JS Standard compiling
      const srcDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>
              const _log = console.log;
              console.log = function(...args) {
                window.parent.postMessage({ type: 'CONSOLE_LOG', content: args.join(' ') }, '*');
                _log.apply(console, args);
              };
              window.onerror = function(message, source, lineno, colno, error) {
                window.parent.postMessage({ type: 'CONSOLE_ERROR', content: message }, '*');
              };
              try {
                ${js}
              } catch(err) {
                window.parent.postMessage({ type: 'CONSOLE_ERROR', content: err.message }, '*');
              }
            </script>
          </body>
        </html>
      `;
      iframe.srcdoc = srcDoc;
    }

    if (onSaveProgress) {
      onSaveProgress(50); // Give 50 XP on compilation run!
    }
  };

  const downloadFiles = () => {
    let content = "";
    let filename = "project.zip";
    if (language === 'react') {
      content = reactCode;
      filename = "App.jsx";
    } else {
      content = `
<!-- INDEX.HTML -->
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    ${html}
    <script src="script.js"></script>
  </body>
</html>
      `;
      filename = "index.html";
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCodeToClipboard = () => {
    const activeCode = language === 'html' ? html : language === 'css' ? css : language === 'js' ? js : reactCode;
    navigator.clipboard.writeText(activeCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const activeValue = () => {
    if (language === 'html') return html;
    if (language === 'css') return css;
    if (language === 'js') return js;
    return reactCode;
  };

  const handleTextareaChange = (val: string) => {
    if (language === 'html') setHtml(val);
    else if (language === 'css') setCss(val);
    else if (language === 'js') setJs(val);
    else setReactCode(val);
  };

  return (
    <div id="editor-sandbox" className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden flex flex-col h-[75vh]">
      
      {/* Playground Header control bars */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex p-0.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg">
            <button 
              onClick={() => { setLanguage('html'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${language === 'html' ? 'bg-white dark:bg-neutral-900 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-neutral-600 dark:text-neutral-400'}`}
            >
              <FileCode className="w-3.5 h-3.5" /> HTML
            </button>
            <button 
              onClick={() => { setLanguage('css'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${language === 'css' ? 'bg-white dark:bg-neutral-900 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-neutral-600 dark:text-neutral-400'}`}
            >
              <FileCode className="w-3.5 h-3.5" /> CSS
            </button>
            <button 
              onClick={() => { setLanguage('js'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${language === 'js' ? 'bg-white dark:bg-neutral-900 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-neutral-600 dark:text-neutral-400'}`}
            >
              <FileCode className="w-3.5 h-3.5" /> JavaScript
            </button>
            <button 
              onClick={() => { setLanguage('react'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${language === 'react' ? 'bg-white dark:bg-neutral-900 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-neutral-600 dark:text-neutral-400'}`}
            >
              <FileCode className="w-3.5 h-3.5" /> React ES6
            </button>
          </div>
          {lastSaved && <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">Saved {lastSaved}</span>}
        </div>

        {/* Compile / Download controls row */}
        <div className="flex items-center gap-2">
          <button 
            onClick={copyCodeToClipboard}
            className="p-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg text-neutral-500 transition"
            title="Copy current tab code"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button 
            onClick={downloadFiles}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center gap-1.5 transition"
            title="Download target resource files"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>

          {onAskMentor && (
            <button 
              onClick={() => onAskMentor(activeValue())}
              className="px-3 py-1.5 rounded-lg border border-purple-500/30 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 flex items-center gap-1.5 transition"
              title="Send active code to AI Mentor doubts stream"
            >
              <HelpCircle className="w-3.5 h-3.5" /> AI Review
            </button>
          )}

          <button 
            onClick={runCode}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition shadow-md cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run Code
          </button>
        </div>
      </div>

      {/* Main Split Screens Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-neutral-100 dark:bg-neutral-950">
        
        {/* Left Hand: Editor window */}
        <div className="flex flex-col border-r border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-900 text-neutral-200 font-mono">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-xs">
            <span className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-semibold">
              <Code className="w-3.5 h-3.5" /> SOURCE CODE EDITOR
            </span>
            <span className="text-cyan-400 text-[10px]">{language.toUpperCase()} FILE MODE</span>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Gutter Line numbers */}
            <div className="w-12 bg-neutral-950/80 text-neutral-600 text-right pr-3 select-none py-4 text-xs space-y-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editing field */}
            <textarea
              value={activeValue()}
              onChange={e => handleTextareaChange(e.target.value)}
              className="flex-1 bg-transparent px-4 py-4 text-xs font-normal font-mono text-neutral-100 placeholder-neutral-700 resize-none outline-hidden focus:ring-0 overflow-y-auto leading-relaxed"
              placeholder={`Write your code here...`}
            />
          </div>
        </div>

        {/* Right Hand: Compiled Output & Console Terminal Split */}
        <div className="flex flex-col overflow-hidden bg-white dark:bg-neutral-950">
          
          {/* Upper Right: Live preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                <Eye className="w-3.5 h-3.5 text-cyan-600" /> LIVE COMPILER PREVIEW WINDOW
              </span>
              <span className="text-[10px] text-neutral-400">AUTORUN PREVIEW</span>
            </div>

            <div className="flex-1 bg-white relative">
              <iframe 
                ref={iframeRef}
                title="Live playground frame compiling"
                className="w-full h-full bg-white text-black"
                sandbox="allow-scripts"
              />
            </div>
          </div>

          {/* Lower Right: Interactive logs terminal */}
          <div className="h-44 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-950/95 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-neutral-900 bg-neutral-950 text-[11px] font-medium text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-yellow-500" /> INTERACTIVE SYSTEM TERMINAL
              </span>
              <button 
                onClick={() => setConsoleLogs([])}
                className="text-[10px] text-neutral-500 hover:text-white transition"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed space-y-1 bg-neutral-950 text-white select-text">
              {consoleLogs.length === 0 ? (
                <p className="text-neutral-500 text-[11px] italic">No console logs captures printed. Deploy compiler (Run Code) to query logs.</p>
              ) : (
                consoleLogs.map((log, index) => (
                  <div key={index} className={log.startsWith('[ERROR]') ? 'text-red-400' : 'text-neutral-200'}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
