import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Trash2, HelpCircle, Code, Shuffle, RefreshCw } from 'lucide-react';

interface LinkedListNode {
  id: string;
  value: string;
  isNew?: boolean;
  isRemoving?: boolean;
}

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<LinkedListNode[]>([
    { id: '1', value: '10' },
    { id: '2', value: '20' },
    { id: '3', value: '30' }
  ]);
  const [inputValue, setInputValue] = useState('40');
  const [insertPos, setInsertPos] = useState<'head' | 'tail' | 'index'>('tail');
  const [insertIndex, setInsertIndex] = useState(1);
  const [logs, setLogs] = useState<string[]>([
    "Linked List initialized with default nodes 10 -> 20 -> 30.",
  ]);
  const [animating, setAnimating] = useState(false);

  const writeLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 9)]);
  };

  const handleInsert = async () => {
    if (!inputValue.trim() || animating) return;
    setAnimating(true);
    const newVal = inputValue.trim();
    const newId = String(Date.now());

    writeLog(`[Step 1] Allocating memory for a new Node with value "${newVal}"...`);
    
    // Simulate pointer layout steps
    const newNode: LinkedListNode = { id: newId, value: newVal, isNew: true };

    if (insertPos === 'head') {
      writeLog(`[Step 2] Setting newNode.next = head (pointing node ${newVal} to ${nodes[0]?.value || 'null'})`);
      setTimeout(() => {
        setNodes(prev => [newNode, ...prev.map(n => ({ ...n, isNew: false }))]);
        writeLog(`[Step 3] Updating head pointer to point directly to newNode. Success!`);
        setAnimating(false);
      }, 700);
    } else if (insertPos === 'tail') {
      const lastNode = nodes[nodes.length - 1];
      writeLog(`[Step 2] Traversing list to locate the tail node (${lastNode ? lastNode.value : 'null'})...`);
      setTimeout(() => {
        writeLog(`[Step 3] Updating lastNode.next = newNode (connecting node ${lastNode ? lastNode.value : 'null'} -> ${newVal})`);
        setTimeout(() => {
          setNodes(prev => [...prev.map(n => ({ ...n, isNew: false })), newNode]);
          setAnimating(false);
        }, 600);
      }, 700);
    } else {
      // index
      const idx = Math.max(0, Math.min(nodes.length, insertIndex));
      if (idx === 0) {
        writeLog(`[Step 2] Index is 0. Treating as insertion at head.`);
        setTimeout(() => {
          setNodes(prev => [newNode, ...prev.map(n => ({ ...n, isNew: false }))]);
          setAnimating(false);
        }, 750);
      } else {
        const prevNode = nodes[idx - 1];
        const nextNode = nodes[idx];
        writeLog(`[Step 2] Traversing index to node at position ${idx - 1} (${prevNode?.value}). Setting newNode.next = ${nextNode ? nextNode.value : 'null'}.`);
        setTimeout(() => {
          writeLog(`[Step 3] Adjusting legacy pointer: setting node ${prevNode?.value}.next directly to newNode.`);
          setTimeout(() => {
            setNodes(prev => {
              const copy = [...prev];
              copy.splice(idx, 0, newNode);
              return copy.map(n => ({ ...n, isNew: false }));
            });
            setAnimating(false);
          }, 600);
        }, 750);
      }
    }
  };

  const handleDelete = (indexToDelete: number) => {
    if (nodes.length <= 1 || animating) return;
    setAnimating(true);

    const matchNode = nodes[indexToDelete];
    writeLog(`[Step 1] Initiating deletion process for node index ${indexToDelete} (value: "${matchNode.value}")...`);

    if (indexToDelete === 0) {
      writeLog(`[Step 2] Resetting head pointer to point directly to the second node (${nodes[1]?.value}).`);
      setTimeout(() => {
        setNodes(prev => prev.slice(1));
        writeLog(`[Step 3] Deallocating memory for node "${matchNode.value}". Success!`);
        setAnimating(false);
      }, 800);
    } else {
      const prevNode = nodes[indexToDelete - 1];
      const skipToNode = nodes[indexToDelete + 1];
      writeLog(`[Step 2] Remapping link: setting node ${prevNode.value}.next = ${skipToNode ? skipToNode.value : 'null'} (skipping node ${matchNode.value}).`);
      
      // Visual feedback setting isRemoving
      setNodes(prev => prev.map((n, i) => i === indexToDelete ? { ...n, isRemoving: true } : n));

      setTimeout(() => {
        setNodes(prev => prev.filter((_, idx) => idx !== indexToDelete));
        writeLog(`[Step 3] Re-routed successfully. Memory reclaimed from node "${matchNode.value}".`);
        setAnimating(false);
      }, 900);
    }
  };

  const randomizeList = () => {
    const listLen = 3 + Math.floor(Math.random() * 3);
    const newItems = Array.from({ length: listLen }, () => {
      const val = String(10 + Math.floor(Math.random() * 80));
      return { id: String(Math.random()), value: val };
    });
    setNodes(newItems);
    writeLog(`Randomized Linked List with nodes: ${newItems.map(n => n.value).join(' -> ')}.`);
  };

  return (
    <div id="linked-list-animator" className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 space-y-6">
      
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-100 dark:border-neutral-850 pb-3">
        <div>
          <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin-slow" />
            Animated Single Linked List Simulator
          </h4>
          <p className="text-[11px] text-neutral-500">Visualize nodes, pointer changes, traversing steps, and garbage collection.</p>
        </div>
        <button 
          onClick={randomizeList}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-neutral-200 dark:border-neutral-805 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-950 rounded-lg transition cursor-pointer"
        >
          <Shuffle className="w-3 h-3" /> Randomize List
        </button>
      </div>

      {/* Control console rows */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-150 dark:border-neutral-850">
        
        {/* Node value input */}
        <div className="md:col-span-3 space-y-1">
          <label className="text-[10px] font-bold text-neutral-550 uppercase tracking-widest font-mono">New Node Value</label>
          <input 
            type="text"
            maxLength={10}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. 99"
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Pointer Position selection radio */}
        <div className="md:col-span-5 space-y-1">
          <label className="text-[10px] font-bold text-neutral-550 uppercase tracking-widest font-mono">Insert Location</label>
          <div className="flex gap-1 bg-white dark:bg-neutral-900 p-1 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <button 
              onClick={() => setInsertPos('head')}
              className={`flex-1 py-1 text-[10px] sm:text-xs font-bold rounded-md transition cursor-pointer ${insertPos === 'head' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-neutral-550'}`}
            >
              Head [0]
            </button>
            <button 
              onClick={() => setInsertPos('tail')}
              className={`flex-1 py-1 text-[10px] sm:text-xs font-bold rounded-md transition cursor-pointer ${insertPos === 'tail' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-neutral-550'}`}
            >
              Tail [Last]
            </button>
            <button 
              onClick={() => setInsertPos('index')}
              className={`flex-1 py-1 text-[10px] sm:text-xs font-bold rounded-md transition cursor-pointer ${insertPos === 'index' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-neutral-550'}`}
            >
              Index
            </button>
          </div>
        </div>

        {/* Index input (only enabled if custom indexing is selected) */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-[10px] font-bold text-neutral-550 uppercase tracking-widest font-mono">Custom Index</label>
          <input 
            type="number"
            min={0}
            max={nodes.length}
            disabled={insertPos !== 'index'}
            value={insertIndex}
            onChange={(e) => setInsertIndex(Number(e.target.value))}
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-lg text-xs leading-none focus:outline-hidden focus:ring-1 focus:ring-indigo-500 disabled:opacity-40"
          />
        </div>

        {/* Trigger execution button */}
        <div className="md:col-span-2">
          <button 
            onClick={handleInsert}
            disabled={animating}
            className="w-full bg-indigo-650 hover:bg-indigo-700 disabled:bg-neutral-300 text-white font-black text-xs py-2 rounded-lg transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            Insert Node
          </button>
        </div>

      </div>

      {/* Visual Animation Stage container */}
      <div className="p-6 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 rounded-xl overflow-x-auto min-h-48 flex items-center justify-start scrollbar-thin">
        <div className="flex items-center gap-6 min-w-full justify-center py-6 px-4">
          
          {/* Head Indicator tag */}
          <div className="flex flex-col items-center gap-0.5 justify-center shrink-0">
            <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black">
              HEAD
            </span>
            <span className="text-neutral-400 text-lg">➔</span>
          </div>

          <AnimatePresence mode="popLayout">
            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                
                {/* Visual node component layout */}
                <motion.div 
                  layout
                  initial={node.isNew ? { scale: 0, y: -20, opacity: 0 } : false}
                  animate={{ scale: 1, y: 0, opacity: node.isRemoving ? 0.3 : 1 }}
                  exit={{ scale: 0, y: 20, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className={`relative flex flex-col sm:flex-row items-stretch border rounded-xl shadow-md overflow-hidden ${
                    node.isNew 
                      ? 'border-indigo-500 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20 shadow-indigo-500/10' 
                      : node.isRemoving
                        ? 'border-red-500 bg-red-650/10 text-red-500 shadow-red-500/10'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                  } shrink-0 w-36 h-18`}
                >
                  {/* Left block: Node Data value */}
                  <div className="flex-1 flex flex-col justify-center px-3.5 select-none bg-neutral-50/20 dark:bg-neutral-900/10 border-r border-dashed border-neutral-150 dark:border-neutral-800 relative">
                    <span className="text-[8px] font-mono text-neutral-400 block leading-tight font-black">
                      Val [ {index} ]
                    </span>
                    <span className="text-sm font-black font-mono truncate leading-normal block mt-0.5 max-w-full text-neutral-900 dark:text-neutral-100">
                      {node.value}
                    </span>
                  </div>

                  {/* Right block: Node Pointer Reference Next */}
                  <div className="w-12 bg-neutral-50/50 dark:bg-neutral-950/40 font-mono text-[9px] flex flex-col items-center justify-center relative p-1 text-center font-bold">
                    <span className="text-[7px] text-neutral-400 block uppercase scale-90">Next</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black scale-95 mt-0.5 truncate max-w-full">
                      {index === nodes.length - 1 ? 'NULL' : `*ptr`}
                    </span>

                    {/* Delete Node Hover Button */}
                    <button 
                      onClick={() => handleDelete(index)}
                      disabled={nodes.length <= 1 || animating}
                      className="absolute inset-0 bg-red-600 hover:bg-red-700 text-white opacity-0 hover:opacity-100 transition flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                      title="Destroy node from memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Staged element flags */}
                  {node.isNew && (
                    <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                  )}
                </motion.div>

                {/* Node Pointer line connecting nodes */}
                {index < nodes.length - 1 && (
                  <motion.div 
                    layout
                    className="flex flex-col items-center justify-center font-bold font-mono text-neutral-300 dark:text-neutral-700 select-none text-sm leading-none shrink-0"
                  >
                    <span className="text-indigo-500/70 text-lg leading-tight">➔</span>
                  </motion.div>
                )}

              </React.Fragment>
            ))}
          </AnimatePresence>

          {/* Null Reference Box tag */}
          <div className="flex flex-col items-center gap-0.5 justify-center shrink-0">
            <span className="text-[9px] font-mono text-neutral-400 uppercase bg-neutral-200 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-800 px-1.5 py-0.5 rounded font-black">
              NULL
            </span>
          </div>

        </div>
      </div>

      {/* Pointer Step log tracking */}
      <div className="space-y-2">
        <h5 className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider font-mono">
          Memory Stack Pointer logs (Traversal Tracing)
        </h5>
        
        <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-850 text-xs font-mono text-neutral-400 space-y-1.5 max-h-36 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className={`leading-normal ${idx === 0 ? 'text-green-400 font-bold' : 'opacity-60 text-neutral-300'}`}>
              <span className="text-neutral-550 mr-1.5 font-bold select-none">&gt;&gt;</span>
              {log}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
