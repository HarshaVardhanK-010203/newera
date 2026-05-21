import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Layers, Terminal, Database, Sliders, Cpu, Activity, AlertCircle, RefreshCw, Zap } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

const INITIAL_CART: CartItem[] = [
  { id: '1', name: 'Premium Monitor', price: 400, category: 'Tech', image: '🖥️' },
  { id: '2', name: 'Nordic Mug', price: 20, category: 'Home', image: '☕' },
  { id: '3', name: 'Ergo Keyboard', price: 150, category: 'Tech', image: '⌨️' },
  { id: '4', name: 'Minimalist Poster', price: 30, category: 'Art', image: '🖼️' },
  { id: '5', name: 'Studio Headset', price: 220, category: 'Tech', image: '🎧' },
];

export default function ArrayMethodVisualizer() {
  const [activeTab, setActiveTab] = useState<'map' | 'filter' | 'reduce' | 'async'>('map');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1500); // ms
  const [errorSimulated, setErrorSimulated] = useState<boolean>(false);

  // Animation results arrays
  const [processedItems, setProcessedItems] = useState<any[]>([]);
  const [accumulator, setAccumulator] = useState<number>(0);
  const [activeElements, setActiveElements] = useState<{ inputIdx: number; status: 'processing' | 'success' | 'filtered' | 'idle' }>({
    inputIdx: -1,
    status: 'idle',
  });

  // Async loop simulation steps
  const [asyncTimeline, setAsyncTimeline] = useState<{
    callStack: string[];
    webApis: string[];
    callbackQueue: string[];
    terminalLogs: string[];
    phase: string;
  }>({
    callStack: [],
    webApis: [],
    callbackQueue: [],
    terminalLogs: ['System Ready. Click Play to trace the Async Async/Await Pipeline.'],
    phase: 'idle',
  });

  useEffect(() => {
    resetSimulator();
  }, [activeTab]);

  // Handle Play Timer
  useEffect(() => {
    let timerID: any = null;
    if (isPlaying) {
      timerID = setTimeout(() => {
        handleStepForward();
      }, speed);
    }
    return () => clearTimeout(timerID);
  }, [isPlaying, currentStep, activeTab, speed]);

  const resetSimulator = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProcessedItems([]);
    setAccumulator(0);
    setActiveElements({ inputIdx: -1, status: 'idle' });
    setErrorSimulated(false);
    setAsyncTimeline({
      callStack: ['global()'],
      webApis: [],
      callbackQueue: [],
      phase: 'idle',
      terminalLogs: [`Loaded tab: ${activeTab.toUpperCase()} simulation environment standard. Ready.`],
    });
  };

  const handleStepForward = () => {
    if (activeTab === 'async') {
      stepAsyncForward();
      return;
    }

    const maxSteps = INITIAL_CART.length;
    if (currentStep >= maxSteps) {
      setIsPlaying(false);
      return;
    }

    const item = INITIAL_CART[currentStep];
    setActiveElements({ inputIdx: currentStep, status: 'processing' });

    setTimeout(() => {
      if (activeTab === 'map') {
        const discounted = { ...item, price: Math.round(item.price * 0.9), originalPrice: item.price };
        setProcessedItems(prev => [...prev, discounted]);
        setActiveElements({ inputIdx: currentStep, status: 'success' });
      } else if (activeTab === 'filter') {
        const passes = item.price > 100;
        if (passes) {
          setProcessedItems(prev => [...prev, item]);
          setActiveElements({ inputIdx: currentStep, status: 'success' });
        } else {
          setActiveElements({ inputIdx: currentStep, status: 'filtered' });
        }
      } else if (activeTab === 'reduce') {
        setAccumulator(prev => prev + item.price);
        setActiveElements({ inputIdx: currentStep, status: 'success' });
      }
      
      setCurrentStep(prev => prev + 1);
    }, 400);
  };

  const stepAsyncForward = () => {
    const totalAsyncPhases = 7;
    if (currentStep >= totalAsyncPhases) {
      setIsPlaying(false);
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    switch (nextStep) {
      case 1:
        setAsyncTimeline({
          callStack: ['global()', 'fetchProductData()'],
          webApis: [],
          callbackQueue: [],
          phase: 'invoke',
          terminalLogs: [
            ...asyncTimeline.terminalLogs,
            '🕒 Phase 1: Called fetchProductData(). Invoking JS event cycle.',
            '⚡ Pushed fetchProductData() to the main Call Stack.',
          ],
        });
        break;
      case 2:
        setAsyncTimeline({
          callStack: ['global()', 'fetchProductData()', 'fetch(/api/products) [Pending]'],
          webApis: [],
          callbackQueue: [],
          phase: 'wait-promise',
          terminalLogs: [
            ...asyncTimeline.terminalLogs,
            '🌐 Phase 2: Encountered fetch() promise inside fetchProductData().',
            '📦 Pushing HTTP Request to browser network layer (Web APIs domain).',
          ],
        });
        break;
      case 3:
        setAsyncTimeline({
          callStack: ['global()', 'fetchProductData() [Awaiting...]'],
          webApis: ['HTTP GET Request: /api/products'],
          callbackQueue: [],
          phase: 'background',
          terminalLogs: [
            ...asyncTimeline.terminalLogs,
            '⏳ Phase 3: fetch() request is running concurrently in the background.',
            '💤 Thread state: Pushing fetchProductData() frame aside. Main thread unblocks!',
          ],
        });
        break;
      case 4:
        setAsyncTimeline({
          callStack: ['global()'],
          webApis: [],
          callbackQueue: ['OnFetchFulfilled()'],
          phase: 'callback-queued',
          terminalLogs: [
            ...asyncTimeline.terminalLogs,
            '📦 Phase 4: Server returned 200 OK! HTTP Promise resolved.',
            '📬 Pushing OnFetchFulfilled task to the Microtasks queue.',
          ],
        });
        break;
      case 5:
        setAsyncTimeline({
          callStack: ['global()', 'OnFetchFulfilled()'],
          webApis: [],
          callbackQueue: [],
          phase: 'event-loop',
          terminalLogs: [
            ...asyncTimeline.terminalLogs,
            '🔄 Phase 5: Event Loop ticks. Main stack is empty.',
            '✨ Popping OnFetchFulfilled from queue and pushing to the Stack.',
          ],
        });
        break;
      case 6:
        setAsyncTimeline({
          callStack: ['global()', 'OnFetchFulfilled()', 'JSON.parse()'],
          webApis: [],
          callbackQueue: [],
          phase: 'parse',
          terminalLogs: [
            ...asyncTimeline.terminalLogs,
            '🔍 Phase 6: Parsing response bytes. Applying validation check blocks.',
          ],
        });
        break;
      case 7:
        setAsyncTimeline({
          callStack: ['global()'],
          webApis: [],
          callbackQueue: [],
          phase: 'completed',
          terminalLogs: [
            ...asyncTimeline.terminalLogs,
            '🏆 Phase 7: fetchProductData() successfully returned 5 product nodes! Task Completed.',
          ],
        });
        setProcessedItems(INITIAL_CART);
        break;
    }
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden shadow-2xl space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 pb-6 border-b border-white/5 gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-wider font-semibold text-[#06B6D4] uppercase">INTERACTIVE GRAPHICAL LABS</span>
          </div>
          <h4 className="text-lg font-black font-display text-white mt-1">Array Pipeline & Async/Await Live Tracer</h4>
          <p className="text-xs text-[#94A3B8] mt-0.5">Visualize map, filter, reduce arrays, or trace the event loop stack operations sequentially.</p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-[#0A0F1C] p-1 rounded-xl border border-white/5 shrink-0 self-stretch md:self-auto justify-between sm:justify-start">
          {[
            { id: 'map', label: 'map()' },
            { id: 'filter', label: 'filter()' },
            { id: 'reduce', label: 'reduce()' },
            { id: 'async', label: 'async / await' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer transition ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#7C3AED]/80 text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Controller Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Playground */}
        <div className="md:col-span-8 space-y-6">
          {/* Visual source / code line mapping context */}
          <div className="p-4 bg-[#0A0F1C] border border-white/5 rounded-xl">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-3">
              <span className="text-[10px] font-mono font-bold text-[#94A3B8]">// ACTIVE CALLBACK CONTEXT</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#7C3AED]/20 text-[#06B6D4] rounded font-semibold">ES6 Syntax</span>
            </div>
            
            <pre className="text-xs font-mono leading-relaxed text-white whitespace-pre overflow-x-auto select-text">
              {activeTab === 'map' && (
                <span className="text-emerald-400">
                  {`// Applying 10% holiday discount mapping pure functions\nconst discountedCart = cart.map(item => {\n  return { ...item, price: Math.round(item.price * 0.9) };\n});`}
                </span>
              )}
              {activeTab === 'filter' && (
                <span className="text-[#06B6D4]">
                  {`// Slicing dataset to filter layout items exceeding $100\nconst expensiveCart = cart.filter(item => {\n  return item.price > 100;\n});`}
                </span>
              )}
              {activeTab === 'reduce' && (
                <span className="text-[#F59E0B]">
                  {`// Accumulating vector balances down to unified cart total\nconst cartSum = cart.reduce((total, item) => {\n  return total + item.price;\n}, 0);`}
                </span>
              )}
              {activeTab === 'async' && (
                <span className="text-purple-400">
                  {`// Trace execution across background Web APIs and Event-loop\nasync function fetchProductData() {\n  const res = await fetch('/api/products'); // Async block\n  const items = await res.json();\n  return items;\n}`}
                </span>
              )}
            </pre>
          </div>

          {/* Interactive Steps Stages */}
          <div className="space-y-4">
            <h5 className="text-[10px] font-mono font-black text-[#94A3B8] uppercase tracking-wider">Input Collection ({INITIAL_CART.length} Data nodes)</h5>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {INITIAL_CART.map((item, idx) => {
                const isCurrent = activeElements.inputIdx === idx;
                const isDone = idx < currentStep;
                const isFilteredOut = activeTab === 'filter' && isDone && !processedItems.some(i => i.id === item.id);

                return (
                  <motion.div
                    key={item.id}
                    layoutId={`cart-${item.id}`}
                    className={`p-3 rounded-xl border relative transition-all flex flex-col items-center justify-between h-28 ${
                      isCurrent
                        ? 'bg-[#1A2234] border-[#06B6D4] scale-102 shadow-glow-cyan'
                        : isFilteredOut
                        ? 'bg-[#111827] border-red-500/20 opacity-40'
                        : isDone
                        ? 'bg-[#111827] border-emerald-500/20 opacity-60'
                        : 'bg-[#1A2234] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <span className="text-2xl mt-1">{item.image}</span>
                    <div className="text-center w-full mt-2">
                      <p className="text-[11px] font-bold text-white truncate px-1">{item.name}</p>
                      <p className="text-[10px] font-mono font-bold text-[#06B6D4] mt-0.5">${item.price}</p>
                    </div>

                    {isCurrent && (
                      <span className="absolute -top-2 px-2 py-0.5 bg-[#06B6D4] text-black text-[8px] font-mono font-bold rounded-full">
                        PROCESSING
                      </span>
                    )}
                    {isFilteredOut && (
                      <span className="absolute -top-2 px-2 py-0.5 bg-red-500 text-white text-[8px] font-mono font-bold rounded-full">
                        DISCARD
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Core Pipeline Arrow Indicator */}
          <div className="flex justify-center items-center py-2">
            <div className="p-2.5 bg-[#0A0F1C] border border-white/5 rounded-full flex items-center justify-center relative shadow-inner">
              <Activity className="w-5 h-5 text-[#06B6D4] animate-pulse" />
              <div className="absolute -top-5 text-[9px] font-mono text-[#94A3B8] font-bold uppercase tracking-wider">Transformer Loop</div>
            </div>
          </div>

          {/* Output collection area */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="text-[10px] font-mono font-black text-[#94A3B8] uppercase tracking-wider">Output Collection Pipeline</h5>
              {activeTab === 'reduce' && (
                <div className="px-3 py-1 bg-[#1A2234] border border-white/5 rounded-xl flex items-center gap-1.5 text-xs text-white">
                  <Database className="w-4 h-4 text-[#F59E0B]" />
                  <span className="font-mono">Accumulator Total: <strong className="text-[#F59E0B]">${accumulator}</strong></span>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#0A0F1C] border border-white/5 rounded-xl min-h-36 flex flex-wrap gap-3 items-center justify-center">
              <AnimatePresence>
                {activeTab === 'reduce' && processedItems.length === 0 && currentStep > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-[#1A2234] border border-[#F59E0B]/30 rounded-2xl text-center space-y-1"
                  >
                    <Cpu className="w-8 h-8 text-[#F59E0B] mx-auto animate-spin" />
                    <p className="text-xs font-bold font-mono text-white">Accumulating Scalar value...</p>
                    <p className="text-base font-black text-[#F59E0B]">${accumulator}</p>
                  </motion.div>
                )}

                {processedItems.length === 0 && (activeTab !== 'reduce' || currentStep === 0) && (
                  <div className="text-[#94A3B8] text-xs font-mono py-6">
                    [ Empty Pipeline. Click Play or Step Forward to process data objects ]
                  </div>
                )}

                {processedItems.map((item, idx) => (
                  <motion.div
                    key={item.id + '-out'}
                    initial={{ opacity: 0, scale: 0.8, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-gradient-to-br from-[#1A2234] to-[#111827] border border-emerald-500/20 rounded-xl flex items-center gap-3 shadow-md w-full sm:w-44"
                  >
                    <span className="text-xl">{item.image}</span>
                    <div className="truncate text-left">
                      <p className="text-[11px] font-bold text-white truncate">{item.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono font-bold text-emerald-400">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-[9px] font-mono text-gray-400 line-through">${item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Execution Environment Console */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-[#0A0F1C] border border-white/5 rounded-xl p-4 space-y-4">
            <h5 className="text-[10px] font-mono font-black text-white uppercase tracking-wider pb-2 border-b border-white/5">Engine Diagnostic</h5>
            
            <div className="space-y-3 font-mono text-[11px]">
              <div>
                <span className="text-[#94A3B8] block">Current Pointer Index:</span>
                <span className="text-[#06B6D4] font-black">{currentStep} / {activeTab === 'async' ? 7 : INITIAL_CART.length}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Active Execution State:</span>
                <span className={`font-black ${isPlaying ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                  {isPlaying ? '● RUNNING' : '■ STANDBY'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[#94A3B8] block">Sandbox Speed:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="500"
                    value={speed}
                    onChange={e => setSpeed(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] text-white shrink-0 font-bold">{speed / 1000}s</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  isPlaying ? 'bg-amber-600 text-white' : 'bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pause' : 'Play Loop'}
              </button>

              <button
                onClick={handleStepForward}
                disabled={isPlaying}
                className="px-2.5 py-1.5 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={resetSimulator}
                className="px-2.5 py-1.5 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Event Loop Stack visualization inside loop tab */}
          {activeTab === 'async' && (
            <div className="bg-[#0A0F1C] border border-white/5 rounded-xl p-4 space-y-4 font-mono text-[10px]">
              <div className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span className="text-[#06B6D4] font-black uppercase">// V8 EVENT LOOP VISUALIZER</span>
              </div>

              {/* Call Stack Section */}
              <div className="space-y-1">
                <span className="text-[#94A3B8] font-bold block">CALL STACK (LIFO)</span>
                <div className="border border-white/5 bg-[#111827] rounded-lg p-2 min-h-16 flex flex-col-reverse gap-1.5 justify-end">
                  {asyncTimeline.callStack.length === 0 ? (
                    <span className="text-gray-600 italic">[ Empty Stack ]</span>
                  ) : (
                    asyncTimeline.callStack.map((frame, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#7C3AED]/20 hover:bg-[#7C3AED]/30 border border-[#7C3AED]/40 text-white px-2 py-1 rounded text-left truncate font-bold"
                      >
                        {frame}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Web API Section */}
              <div className="space-y-1">
                <span className="text-[#94A3B8] font-bold block">BROWSER APIS / BACKGROUND THREADS</span>
                <div className="border border-white/5 bg-[#111827] rounded-lg p-2 min-h-14 flex flex-col gap-1.5 justify-center">
                  {asyncTimeline.webApis.length === 0 ? (
                    <span className="text-gray-600 italic">[ Idle Background Pools ]</span>
                  ) : (
                    asyncTimeline.webApis.map((api, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [0.98, 1.02, 0.98] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-1 rounded text-left truncate flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                        {api}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Callback / Microtask Queue */}
              <div className="space-y-1">
                <span className="text-[#94A3B8] font-bold block">MICROTASKS CALLBACK QUEUE (FIFO)</span>
                <div className="border border-white/5 bg-[#111827] rounded-lg p-2 min-h-14 flex items-center gap-1.5">
                  {asyncTimeline.callbackQueue.length === 0 ? (
                    <span className="text-gray-600 italic">[ Queue Empty ]</span>
                  ) : (
                    asyncTimeline.callbackQueue.map((cb, i) => (
                      <motion.span
                        key={i}
                        className="bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2.5 py-1 rounded text-[9px] font-bold"
                      >
                        {cb}
                      </motion.span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Code Execution Logs */}
          <div className="p-4 bg-[#0A0F1C] border border-white/5 rounded-xl font-mono text-[10px] space-y-2">
            <div className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold uppercase">Terminal Simulator</span>
            </div>
            <div className="bg-[#111827] rounded-lg p-2 h-36 overflow-y-auto space-y-1 text-left select-text">
              {asyncTimeline.terminalLogs.map((log, i) => (
                <div key={i} className="text-[#94A3B8] leading-relaxed border-b border-white/5 pb-1">
                  <span className="text-emerald-400/80 mr-1">&gt;</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
