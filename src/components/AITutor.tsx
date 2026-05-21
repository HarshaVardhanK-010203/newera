import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Bug, Eye, BookOpen, AlertCircle, Bot, User, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface AITutorProps {
  activeTopic?: string;
  activeCode?: string;
  onCodeImport?: (code: string) => void;
}

export default function AITutor({ activeTopic = "", activeCode = "", onCodeImport }: AITutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "👋 Hello! I am your AI Coding Mentor. I can explain code line-by-line, fix bugs instantly, prepare personalized lessons, or resolve web design doubts! Try typing a question below or click a quick assistant block.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle post to Express server integration
  const sendMessage = async (text: string, overrideQuery?: { lineByLine?: boolean; fixErrors?: boolean }) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      codeSnippet: activeCode || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          activeTopicContext: activeTopic,
          codeSnippet: activeCode,
          lineByLine: overrideQuery?.lineByLine || false,
          fixErrors: overrideQuery?.fixErrors || false
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.text || "I was unable to structure an AI response right now.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ Mentor communication warning: ${err.message || 'Server timeout'}. Please verify secrets configurations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeShortcut = (type: 'explain' | 'fix' | 'questions' | 'project') => {
    let text = "";
    if (type === 'explain') {
      text = activeTopic 
        ? `Explain the core syntax of "${activeTopic}" line-by-line with simple comments.` 
        : "Can you explain the current code block line-by-line and show how parameters connect?";
      sendMessage(text, { lineByLine: true });
    } else if (type === 'fix') {
      text = "Review my current playground design code. Fix spacing errors, logical bugs, and optimization parameters.";
      sendMessage(text, { fixErrors: true });
    } else if (type === 'questions') {
      text = `Generate 3 interactive interview style mock questions on: "${activeTopic || 'Web fundamentals'}".`;
      sendMessage(text);
    } else {
      text = `Provide a full mini project layout task designed around "${activeTopic || 'CSS Flexbox'}".`;
      sendMessage(text);
    }
  };

  // Extracts potential code snippets from AI markdown response (for interactive edit triggers)
  const applySuggestedCodeToPlayground = (messageText: string) => {
    const match = messageText.match(/```(?:js|javascript|html|css)?\s*([\s\S]+?)\s*```/);
    if (match && match[1] && onCodeImport) {
      onCodeImport(match[1]);
    }
  };

  return (
    <div id="ai-mentor-assistant" className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden flex flex-col h-[75vh]">
      
      {/* Mentor Panel Header */}
      <div className="p-4 bg-linear-to-r from-purple-800 to-indigo-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              NewEra AI Coding Mentor
              <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded-sm bg-white/20 text-yellow-200 border border-white/15">Active</span>
            </h3>
            {activeTopic && <p className="text-[10px] text-indigo-200 mt-0.5">Topic Target: <strong className="text-white">{activeTopic}</strong></p>}
          </div>
        </div>
        <Bot className="w-6 h-6 text-indigo-300" />
      </div>

      {/* Messages layout */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-950">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : ''}`}
          >
            {m.sender === 'assistant' && (
              <div className="p-1.5 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-lg shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}
            
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
              m.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none'
            }`}>
              {/* Optional Active Code references box */}
              {m.codeSnippet && m.sender === 'user' && (
                <div className="mb-3 bg-indigo-900/40 p-2 rounded-lg text-xs max-h-24 overflow-y-auto font-mono text-indigo-200 border border-indigo-500/20">
                  <p className="font-semibold text-[10px] text-white uppercase tracking-wider mb-1">Attached playground snippet:</p>
                  <pre className="whitespace-pre-wrap">{m.codeSnippet.substring(0, 150)}...</pre>
                </div>
              )}

              {/* Message Core Text (Basic clean formatting) */}
              <div className="whitespace-pre-line text-xs font-sans select-text">
                {m.text}
              </div>

              {/* Action item inside AI text if they suggest a codeblock */}
              {m.sender === 'assistant' && m.text.includes('```') && onCodeImport && (
                <button 
                  onClick={() => applySuggestedCodeToPlayground(m.text)}
                  className="mt-3 flex items-center gap-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/15 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" /> Load Code to Playground
                </button>
              )}

              <span className={`block text-[9 px] mt-1.5 font-mono ${m.sender === 'user' ? 'text-indigo-200 text-right' : 'text-neutral-400'}`}>
                {m.timestamp}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-stone-500 text-xs font-mono py-2 pl-2">
            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-ping"></span>
            <span>AI Mentor is compiling response...</span>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Quick shortcuts controller */}
      <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-2">
        <button 
          onClick={() => executeShortcut('explain')}
          className="flex items-center justify-center gap-1.5 bg-white dark:bg-neutral-950 hover:bg-neutral-50 border border-neutral-200 dark:border-neutral-800 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Explain Line-by-Line
        </button>

        <button 
          onClick={() => executeShortcut('fix')}
          className="flex items-center justify-center gap-1.5 bg-white dark:bg-neutral-950 hover:bg-neutral-50 border border-neutral-200 dark:border-neutral-800 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
        >
          <Bug className="w-3.5 h-3.5 text-red-500" /> Find & Fix Errors
        </button>

        <button 
          onClick={() => executeShortcut('questions')}
          className="flex items-center justify-center gap-1.5 bg-white dark:bg-neutral-950 hover:bg-neutral-50 border border-neutral-200 dark:border-neutral-800 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-yellow-500" /> Lesson Quiz Questions
        </button>

        <button 
          onClick={() => executeShortcut('project')}
          className="flex items-center justify-center gap-1.5 bg-white dark:bg-neutral-950 hover:bg-neutral-50 border border-neutral-200 dark:border-neutral-800 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Ask Mini-Project
        </button>
      </div>

      {/* Sending text block inputs */}
      <form 
        onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }}
        className="p-3 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex gap-2"
      >
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask a doubt about ${activeTopic || 'web development'}...`}
          disabled={isLoading}
          className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 text-neutral-900 dark:text-white"
        />
        <button 
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-400 text-white rounded-xl transition cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
