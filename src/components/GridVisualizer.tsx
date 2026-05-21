import React, { useState } from 'react';
import { Sliders, Plus, RotateCcw, Copy, Check } from 'lucide-react';

interface GridItem {
  id: string;
  name: string;
  colSpan: number;
  rowSpan: number;
  color: string;
}

export default function GridVisualizer() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(16);
  const [items, setItems] = useState<GridItem[]>([
    { id: '1', name: 'Header / Featured', colSpan: 3, rowSpan: 1, color: 'from-cyan-500 to-indigo-500' },
    { id: '2', name: 'Sidebar', colSpan: 1, rowSpan: 2, color: 'from-purple-500 to-pink-500' },
    { id: '3', name: 'Main Content', colSpan: 2, rowSpan: 1, color: 'from-emerald-500 to-teal-500' },
    { id: '4', name: 'Card Left', colSpan: 1, rowSpan: 1, color: 'from-amber-500 to-orange-500' },
    { id: '5', name: 'Card Right', colSpan: 1, rowSpan: 1, color: 'from-rose-500 to-red-500' },
  ]);
  const [copied, setCopied] = useState(false);

  const colors = [
    'from-cyan-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-red-500',
    'from-indigo-500 to-purple-500',
  ];

  const handleAddItem = () => {
    if (items.length >= 10) return;
    const nextId = String(items.length + 1);
    const color = colors[items.length % colors.length];
    setItems(prev => [
      ...prev,
      { id: nextId, name: `Widget ${nextId}`, colSpan: 1, rowSpan: 1, color }
    ]);
  };

  const updateItemWidth = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newSpan = Math.max(1, Math.min(columns, item.colSpan + delta));
        return { ...item, colSpan: newSpan };
      }
      return item;
    }));
  };

  const updateItemHeight = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newSpan = Math.max(1, Math.min(rows, item.rowSpan + delta));
        return { ...item, rowSpan: newSpan };
      }
      return item;
    }));
  };

  const handleReset = () => {
    setColumns(3);
    setRows(3);
    setGap(16);
    setItems([
      { id: '1', name: 'Header / Featured', colSpan: 3, rowSpan: 1, color: 'from-cyan-500 to-indigo-500' },
      { id: '2', name: 'Sidebar', colSpan: 1, rowSpan: 2, color: 'from-purple-500 to-pink-500' },
      { id: '3', name: 'Main Content', colSpan: 2, rowSpan: 1, color: 'from-emerald-500 to-teal-500' },
      { id: '4', name: 'Card Left', colSpan: 1, rowSpan: 1, color: 'from-amber-500 to-orange-500' },
      { id: '5', name: 'Card Right', colSpan: 1, rowSpan: 1, color: 'from-rose-500 to-red-500' },
    ]);
  };

  const generateCSSCode = () => {
    let code = `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(${columns}, 1fr);\n  grid-template-rows: repeat(${rows}, auto);\n  gap: ${gap}px;\n}\n\n`;
    items.forEach((item, index) => {
      if (item.colSpan > 1 || item.rowSpan > 1) {
        code += `.item-${index + 1} {\n`;
        if (item.colSpan > 1) code += `  grid-column: span ${item.colSpan};\n`;
        if (item.rowSpan > 1) code += `  grid-row: span ${item.rowSpan};\n`;
        code += `}\n\n`;
      }
    });
    return code;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCSSCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="css-grid-visual-sandbox" className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
      
      {/* Visual Design Intro */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            Interactive 2D Grid Architect
          </h4>
          <p className="text-[11px] text-neutral-500">Manipulate Grid bounds, rows, columns, and layout items live.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition cursor-pointer"
            title="Reset Grid to default boilerplate"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Controller Settings Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-150 dark:border-neutral-850">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-neutral-550 uppercase tracking-wider block font-mono">
            Grid Columns: {columns}
          </label>
          <input 
            type="range" 
            min={1} 
            max={6} 
            value={columns} 
            onChange={(e) => setColumns(Number(e.target.value))} 
            className="w-full accent-indigo-500 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-[9px] text-neutral-400 block font-mono">grid-template-columns: repeat({columns}, 1fr)</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-neutral-550 uppercase tracking-wider block font-mono">
            Grid Rows (Min/Auto): {rows}
          </label>
          <input 
            type="range" 
            min={1} 
            max={4} 
            value={rows} 
            onChange={(e) => setRows(Number(e.target.value))} 
            className="w-full accent-indigo-500 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-[9px] text-neutral-400 block font-mono">grid-template-rows: repeat({rows}, auto)</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-neutral-550 uppercase tracking-wider block font-mono">
            Gap Padding Size: {gap}px
          </label>
          <input 
            type="range" 
            min={0} 
            max={32} 
            step={4}
            value={gap} 
            onChange={(e) => setGap(Number(e.target.value))} 
            className="w-full accent-indigo-500 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-[9px] text-neutral-400 block font-mono">gap: {gap}px</span>
        </div>
      </div>

      {/* Main Interactive Stage splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Layout Stage */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-neutral-550 text-[10px] uppercase font-bold">Live Layout Sandbox View</span>
            <button 
              onClick={handleAddItem}
              disabled={items.length >= 10}
              className="flex items-center gap-1 bg-indigo-650 hover:bg-indigo-700 disabled:bg-neutral-300 text-white font-bold px-2.5 py-1 rounded-md text-[10px] sm:text-xs transition cursor-pointer shadow-sm disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" /> Add Bento Card
            </button>
          </div>

          {/* Actual live flex/grid display */}
          <div 
            className="relative border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl min-h-80 bg-neutral-50 dark:bg-neutral-950 transition-all duration-300"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, minmax(80px, auto))`,
              gap: `${gap}px`,
            }}
          >
            {items.map((item, index) => (
              <div 
                key={item.id}
                className={`group relative p-3 rounded-lg bg-linear-to-br ${item.color} text-white border border-white/10 flex flex-col justify-between shadow-md overflow-hidden transition-all duration-300`}
                style={{
                  gridColumn: `span ${Math.min(columns, item.colSpan)}`,
                  gridRow: `span ${Math.min(rows, item.rowSpan)}`,
                }}
              >
                <div className="flex justify-between items-start gap-1">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-mono bg-black/25 px-1.5 py-0.5 rounded-sm line-clamp-1 block w-fit mb-1.5 font-bold">
                      Item {index + 1}
                    </span>
                    <h5 className="text-[11px] sm:text-xs font-black truncate max-w-full drop-shadow-sm select-none">
                      {item.name}
                    </h5>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => {
                      if (items.length <= 1) return;
                      setItems(prev => prev.filter(i => i.id !== item.id));
                    }}
                    className="p-1 rounded bg-black/10 hover:bg-black/35 opacity-0 group-hover:opacity-100 text-white hover:text-red-350 transition text-[9px] shrink-0 cursor-pointer"
                    title="Delete item element"
                  >
                    ✕
                  </button>
                </div>

                {/* Grid controls overlay for this item */}
                <div className="flex justify-between items-center gap-1 mt-4 pt-2 border-t border-white/10">
                  <div className="flex flex-col items-start leading-none gap-0.5">
                    <span className="text-[8px] font-mono opacity-80 uppercase tracking-widest font-black text-white/90">Span Settings</span>
                    <span className="text-[10px] font-mono font-bold font-semibold text-cyan-200">
                      {item.colSpan}W × {item.rowSpan}H
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Width Span Adjustment */}
                    <div className="flex bg-black/20 p-0.5 rounded border border-white/5 items-center">
                      <button 
                        onClick={() => updateItemWidth(item.id, -1)}
                        disabled={item.colSpan <= 1}
                        className="w-4 h-4 rounded text-[11px] font-black hover:bg-white/15 disabled:opacity-30 transition flex items-center justify-center cursor-pointer"
                        title="Reduce column span size"
                      >
                        -
                      </button>
                      <span className="text-[9px] font-mono font-bold w-4 text-center select-none">W</span>
                      <button 
                        onClick={() => updateItemWidth(item.id, 1)}
                        disabled={item.colSpan >= columns}
                        className="w-4 h-4 rounded text-[11px] font-black hover:bg-white/15 disabled:opacity-30 transition flex items-center justify-center cursor-pointer"
                        title="Increase column span size"
                      >
                        +
                      </button>
                    </div>

                    {/* Height Span Adjustment */}
                    <div className="flex bg-black/20 p-0.5 rounded border border-white/5 items-center">
                      <button 
                        onClick={() => updateItemHeight(item.id, -1)}
                        disabled={item.rowSpan <= 1}
                        className="w-4 h-4 rounded text-[11px] font-black hover:bg-white/15 disabled:opacity-30 transition flex items-center justify-center cursor-pointer"
                        title="Reduce row span size"
                      >
                        -
                      </button>
                      <span className="text-[9px] font-mono font-bold w-4 text-center select-none">H</span>
                      <button 
                        onClick={() => updateItemHeight(item.id, 1)}
                        disabled={item.rowSpan >= rows}
                        className="w-4 h-4 rounded text-[11px] font-black hover:bg-white/15 disabled:opacity-30 transition flex items-center justify-center cursor-pointer"
                        title="Increase row span size"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtle visual grid overlays */}
                <div className="absolute inset-0 bg-radial from-transparent to-black/15 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Live CSS Code output */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-neutral-550 text-[10px] uppercase font-bold">Dynamic CSS Output</span>
            <button 
              onClick={copyCode}
              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-cyan-400 font-bold font-mono text-[9px] sm:text-xs transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Styles
                </>
              )}
            </button>
          </div>

          <div className="bg-neutral-950 text-neutral-300 p-4 rounded-xl border border-neutral-800 shadow-inner font-mono text-xs overflow-x-auto leading-relaxed select-all">
            <pre>{generateCSSCode()}</pre>
          </div>

          <div className="p-3.5 rounded-lg border border-indigo-500/10 bg-indigo-500/5 text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal">
            <strong className="text-indigo-600 dark:text-indigo-400">Layout Tips:</strong> Click the <strong>W</strong> & <strong>H</strong> controls to stretch cells vertically across rows or horizontally across columns to model classic Bento panel templates.
          </div>
        </div>

      </div>

    </div>
  );
}
