import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, MessageSquare, Terminal, AlertCircle, HelpCircle, 
  Lightbulb, Zap, Code2, Play, BookOpen, Fingerprint, ChevronRight, HelpCircle as AskIcon, Cpu 
} from 'lucide-react';

interface AICodeExplainerProps {
  initialCode: string;
  activeTopic: string;
  userXp?: number;
}

export default function AICodeExplainer({ initialCode, activeTopic, userXp = 0 }: AICodeExplainerProps) {
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<boolean[]>([]);
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPhase, setLoadingPhase] = useState<string>("");
  const [customQuery, setCustomQuery] = useState<string>("");
  const [activeExplainTab, setActiveExplainTab] = useState<'line-by-line' | 'debugger' | 'under-the-hood'>('line-by-line');

  // Dynamic system-suggested level matching user XP credentials
  useEffect(() => {
    if (userXp > 2500) {
      setLevel('Advanced');
    } else if (userXp > 800) {
      setLevel('Intermediate');
    } else {
      setLevel('Beginner');
    }
  }, [userXp]);

  useEffect(() => {
    const lines = initialCode.split('\n');
    setCodeLines(lines);
    setSelectedLines(new Array(lines.length).fill(true));
    setExplanation("");
    setCustomQuery("");
  }, [initialCode]);

  const toggleLine = (index: number) => {
    setSelectedLines(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const selectAll = () => {
    setSelectedLines(new Array(codeLines.length).fill(true));
  };

  const deselectAll = () => {
    setSelectedLines(new Array(codeLines.length).fill(false));
  };

  // Simulated live tutor compiling state phases for a professional educational vibe
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      const phases = [
        "🔍 Parsing targeted syntactic definitions...",
        "🎛️ Mapping lexical scopes & variable declarations...",
        "🤖 Aligning insights to your learning profile...",
        "🧠 Structuring context-specific debugging guidelines...",
        "💡 Rendering visual line annotations..."
      ];
      let currentIdx = 0;
      setLoadingPhase(phases[0]);
      interval = setInterval(() => {
        currentIdx = (currentIdx + 1) % phases.length;
        setLoadingPhase(phases[currentIdx]);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleExplain = async (modeOverride?: 'line-by-line' | 'debugger' | 'under-the-hood') => {
    const activeMode = modeOverride || activeExplainTab;
    const activeCode = codeLines.filter((_, idx) => selectedLines[idx]).join('\n');
    
    if (!activeCode.trim()) {
      setExplanation("⚠️ Please highlight/select at least one line of code above to explain.");
      return;
    }

    setLoading(true);
    setExplanation("");

    try {
      const levelDescriptor = 
        level === 'Beginner' 
          ? "Explain basic syntax terms, function scopes, and variables literally and step-by-step for a complete absolute beginner."
          : level === 'Intermediate' 
            ? "Explain intermediate concept bindings, methods usages, and event flow structures cleanly for an intermediate coder."
            : "Explain high-performance memory considerations, computational complexity, Big O pointers, and advanced modular execution flows.";

      let structuredQuestion = "";
      if (activeMode === 'line-by-line') {
        structuredQuestion = `Please write a comprehensive, friendly, beautiful line-by-line analysis of my selected code lines. 
The user's current level is **${level}**. 
Target Learning Instructions: ${levelDescriptor}
Output the response in clean markdown structure with individual headers for each line. Include context-specific insights.`;
      } else if (activeMode === 'debugger') {
        structuredQuestion = `You are a critical code auditor. Look closely at the selected lines.
Highlight common pitfalls, potential runtime exceptions, off-by-one errors, state mutation loops, spelling bugs, and layout overflows.
Provide 3 tailored debugging tips specifically formulated for a **${level}** coder.`;
      } else {
        structuredQuestion = `Generate a beautiful mental model analogy and 'Under the hood' internal look for the selected code lines.
Describe how the CPU, browser layout engine, virtual DOM, RAM stack/heap, or asynchronous event queue manages these elements.
Direct the terminology to a **${level}** student perspective.`;
      }

      if (customQuery.trim()) {
        structuredQuestion += `\n\nAdditionally, the student has a specific question they want answered: "${customQuery}"`;
      }

      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: structuredQuestion,
          activeTopicContext: activeTopic,
          codeSnippet: activeCode,
          lineByLine: activeMode === 'line-by-line',
          learningLevel: level
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI Mentor proxy service.");
      }

      const data = await response.json();
      setExplanation(data.text || "No response received.");
    } catch (err: any) {
      setExplanation(`❌ Error parsing AI instructions: ${err.message}. Please verify local settings.`);
    } finally {
      setLoading(false);
    }
  };

  // Safe and ultra-responsive lightweight rich markdown renderer
  const renderFormattedText = (rawStr: string) => {
    if (!rawStr) return null;
    const lines = rawStr.split('\n');
    
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-black text-neutral-900 dark:text-neutral-100 font-sans tracking-tight pt-3 pb-1 border-b border-neutral-150 dark:border-neutral-850 flex items-center gap-1.5">
            <span className="w-1 h-3.5 rounded bg-indigo-500"></span>
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h5 key={idx} className="text-[12px] font-bold text-indigo-650 dark:text-indigo-400 font-mono tracking-tight pt-2">
            {line.replace('#### ', '')}
          </h5>
        );
      }
      
      // Blockquotes and Alerts
      if (line.startsWith('> ')) {
        const text = line.replace(/^\s*>\s*/, '');
        // Determine theme based on context highlights
        const isDebugTip = text.includes('Tip') || text.includes('Warning') || text.includes('Attention');
        return (
          <div key={idx} className={`my-2 p-3 rounded-xl border text-xs leading-relaxed ${isDebugTip ? 'bg-amber-500/5 border-amber-500/10 text-neutral-800 dark:text-neutral-200' : 'bg-indigo-500/5 border-indigo-500/10 text-indigo-900 dark:text-indigo-300'}`}>
            {text}
          </div>
        );
      }

      // Bullet points
      if (line.match(/^\s*[-\*+]\s+/)) {
        const text = line.replace(/^\s*[-\*+]\s+/, '');
        return (
          <div key={idx} className="flex gap-2 text-xs text-neutral-650 dark:text-neutral-400 pl-4 items-start py-0.5">
            <span className="text-indigo-500 font-bold shrink-0">•</span>
            <span className="flex-1 select-text">{text}</span>
          </div>
        );
      }

      // Default rows with support for simple inline code tags
      if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      }

      // Inline code replacement logic block
      const parts = line.split(/`([^`]+)`/g);
      return (
        <p key={idx} className="text-xs sm:text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300 select-text">
          {parts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return (
                <code key={pIdx} className="bg-neutral-100 dark:bg-neutral-950 px-1.5 py-0.5 font-mono text-[11px] rounded border border-neutral-200 dark:border-neutral-850 text-pink-600 dark:text-pink-400 font-semibold select-all">
                  {part}
                </code>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div id="ai-mentor-universe" className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6 relative overflow-hidden">
      
      {/* Absolute ambient accent lines */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-150 dark:border-neutral-850 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 shrink-0">
              <Fingerprint className="w-3 h-3" /> COMPILER-SAFE AI SENSEI
            </span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono px-2 py-0.5 rounded font-black">
              topic: {activeTopic}
            </span>
          </div>
          <h4 className="text-lg font-black text-neutral-900 dark:text-white mt-1.5 flex items-center gap-1.5 tracking-tight">
            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse fill-current" />
            Interactive Code Explainer & Debugger
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5 dark:text-neutral-400">
            A dynamic academic tuner providing line level breakdowns, heap maps, and runtime debugger tutorials.
          </p>
        </div>
      </div>

      {/* Level preference options selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider font-mono flex items-center justify-between">
          <span>1. Choose target learning level profile</span>
          <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold font-sans">
            🎯 Auto-suggested level based on your profile progress
          </span>
        </label>
        
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 rounded-xl">
          {[
            { id: 'Beginner', title: 'Beginner', col: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5', icon: '🐣' },
            { id: 'Intermediate', title: 'Intermediate', col: 'text-amber-500 border-amber-500/20 bg-amber-500/5', icon: '⚡' },
            { id: 'Advanced', title: 'Advanced', col: 'text-purple-500 border-purple-500/20 bg-purple-500/5', icon: '🚀' }
          ].map((item) => {
            const isActive = level === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setLevel(item.id as any)}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${isActive ? `${item.col} font-black border-dashed` : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-800'}`}
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive visual line list */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <label className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider font-mono">
            2. Toggle specific lines of code to analyze
          </label>
          <div className="flex gap-2 text-[10px] font-mono">
            <button onClick={selectAll} className="text-indigo-650 hover:underline">Select All</button>
            <span className="text-neutral-300">•</span>
            <button onClick={deselectAll} className="text-indigo-650 hover:underline">Clear</button>
          </div>
        </div>

        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-900 font-mono text-xs text-neutral-300 max-h-56 overflow-y-auto leading-relaxed space-y-1 select-none">
          {codeLines.map((line, idx) => {
            const isSelected = selectedLines[idx];
            return (
              <div 
                key={idx}
                onClick={() => toggleLine(idx)}
                className={`flex items-start gap-4 p-1.5 rounded-lg px-3 cursor-pointer transition ${isSelected ? 'bg-indigo-950/35 text-teal-300 border border-indigo-500/10' : 'opacity-30 text-neutral-500 hover:opacity-50'}`}
              >
                <span className="w-5 text-right select-none font-bold text-neutral-600 dark:text-neutral-500 text-[10px] block mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1 whitespace-pre-wrap font-mono select-text leading-snug">
                  {line || ' '}
                </span>
                <span className={`text-[10px] font-bold text-center w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600/30 text-indigo-400' : 'text-neutral-700'}`}>
                  {isSelected ? '✓' : '•'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Tabs for Explaining Mode */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider font-mono">
          3. Select AI tutor analysis pipeline mode
        </label>
        
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'line-by-line', label: 'Line-by-Line', desc: 'Syntax Pointers', icon: <Code2 className="w-4 h-4" /> },
            { id: 'debugger', label: 'Interactive Debugger', desc: 'Bugs & Solutions', icon: <AlertCircle className="w-4 h-4" /> },
            { id: 'under-the-hood', label: 'Under the Hood', desc: 'Analogies & RAM Heap', icon: <Cpu className="w-4 h-4" /> }
          ].map((tab) => {
            const active = activeExplainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveExplainTab(tab.id as any);
                  if (explanation) {
                    handleExplain(tab.id as any);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition relative cursor-pointer flex flex-col justify-between h-16 ${active ? 'bg-indigo-600/10 border-indigo-500 text-indigo-950 dark:text-indigo-400' : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-150 dark:border-neutral-850 hover:bg-neutral-100/50'}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`${active ? 'text-indigo-500' : 'text-neutral-500'}`}>{tab.icon}</span>
                  {active && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>}
                </div>
                <div>
                  <span className="block font-black text-[11px] leading-tight mt-1">{tab.label}</span>
                  <span className="block text-[8px] opacity-70 leading-none mt-0.5">{tab.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Freeform question custom search bar */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider font-mono flex items-center gap-1">
          <AskIcon className="w-3.5 h-3.5 text-indigo-500" />
          <span>Optional: Ask dynamic doubts or bugs questions</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="e.g. 'Why can't I access bounds here?' or 'Convert this block to ES6 Arrow layout'..."
            className="flex-1 p-2.5 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 border border-neutral-250 dark:border-neutral-850 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-sans"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleExplain();
              }
            }}
          />
        </div>
      </div>

      {/* Action compiler trigger button */}
      <button 
        onClick={() => handleExplain()}
        disabled={loading}
        className="w-full bg-indigo-650 hover:bg-indigo-700 disabled:bg-neutral-300 text-white font-black text-xs sm:text-sm py-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-650/15"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" /> 
            <span>{loadingPhase || "Tuning Academic Analysis..."}</span>
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4 fill-current" /> 
            <span>Draft level-adapted explanation ({level} Layer)</span>
          </>
        )}
      </button>

      {/* Explanation output viewport */}
      {explanation && (
        <div className="p-5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-205 dark:border-neutral-850 rounded-2xl space-y-3 max-h-[50vh] overflow-y-auto animate-fade-in relative">
          
          <div className="flex justify-between items-center pb-2.5 border-b border-neutral-200 dark:border-neutral-850">
            <div className="flex gap-2 items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] uppercase font-black text-neutral-700 dark:text-neutral-300 font-mono tracking-widest block leading-none">
                AI Sensei Evaluation Output
              </span>
            </div>
            <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded uppercase font-bold">
              Level: {level}
            </span>
          </div>

          <div className="space-y-3 text-neutral-850 dark:text-neutral-200">
            {renderFormattedText(explanation)}
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-850/60 flex items-center justify-between text-[10px] text-neutral-450 font-mono">
            <span>Insights updated cleanly • {activeExplainTab}</span>
            <span>Target: {activeTopic}</span>
          </div>
        </div>
      )}

    </div>
  );
}
