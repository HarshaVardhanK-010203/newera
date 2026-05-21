import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle, AlertCircle, Play, Sparkles, RefreshCw, Trophy, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';

interface ES6ChallengeProps {
  profile: UserProfile;
  onSaveProgress: (payload: { topicId: string; isChallenge?: boolean; isProject?: boolean; xpBonus?: number }) => void;
}

export default function ES6Challenge({ profile, onSaveProgress }: ES6ChallengeProps) {
  const defaultCode = `function processIncomes(transactions) {
  // TODO: Implement the array methods pipeline!
  // 1. Filter out all elements where type is NOT 'income'
  // 2. Map the filtered array, multiplying each amount by 1.10 (adding 10% bonus cash-back)
  // 3. Reduce the array to calculate the total sum of all rewards.
  
  return transactions
    .filter(t => t.type === 'income')
    .map(t => t.amount * 1.1)
    .reduce((sum, current) => sum + current, 0);
}`;

  const [code, setCode] = useState(defaultCode);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [running, setRunning] = useState<boolean>(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState<boolean>(false);

  // Challenge test inputs
  const sampleTransactions = [
    { amount: 100, type: 'income' },
    { amount: 50, type: 'expense' },
    { amount: 200, type: 'income' },
    { amount: 80, type: 'expense' }
  ];

  const handleRunVerify = () => {
    setRunning(true);
    setErrorMsg("");
    setConsoleLogs([]);
    setSuccess(false);

    setTimeout(() => {
      try {
        // String checks on code to make sure filter, map, and reduce are explicitly used
        const codeNormalized = code.replace(/\s+/g, '');
        if (!codeNormalized.includes('.filter(')) {
          throw new Error("Pipeline Requirement Failed: You must employ the '.filter()' array method.");
        }
        if (!codeNormalized.includes('.map(')) {
          throw new Error("Pipeline Requirement Failed: You must employ the '.map()' array method.");
        }
        if (!codeNormalized.includes('.reduce(')) {
          throw new Error("Pipeline Requirement Failed: You must employ the '.reduce()' array method.");
        }

        // Initialize user function manually using Function constructor
        // eslint-disable-next-line no-new-func
        const userFunc = new Function(`return ${code}`)();
        
        if (typeof userFunc !== 'function') {
          throw new Error("Output failure: Could not compile valid executable processIncomes() function closure.");
        }

        // Dry Run tests
        const testCase1 = [
          { amount: 100, type: 'income' },
          { amount: 50, type: 'expense' },
          { amount: 300, type: 'income' }
        ]; // should evaluate to (100 * 1.1) + (300 * 1.1) = 110 + 330 = 440
        const result1 = userFunc(testCase1);
        if (Math.abs(result1 - 440) > 0.01) {
          throw new Error(`Test Case 1 Failed: Expected balance sum 440, but function evaluated to ${result1}.`);
        }

        const testCase2 = [
          { amount: 50, type: 'expense' },
          { amount: 10, type: 'expense' }
        ]; // should evaluate to 0
        const result2 = userFunc(testCase2);
        if (Math.abs(result2 - 0) > 0.01) {
          throw new Error(`Test Case 2 Failed: Expected income sum of 0, but function evaluated to ${result2}.`);
        }

        const testCase3 = [
          { amount: 77, type: 'income' }
        ]; // should evaluate to 77 * 1.1 = 84.7
        const result3 = userFunc(testCase3);
        if (Math.abs(result3 - 84.7) > 0.01) {
          throw new Error(`Test Case 3 Failed: Expected balance of 84.7, but function evaluated to ${result3}.`);
        }

        setConsoleLogs([
          "🚀 Initializing dry pipeline execution...",
          "📦 Feeding test transactions array sample to processIncomes()...",
          `✅ Test Case 1 Passed: Evaluated correctly to 440.`,
          `✅ Test Case 2 Passed: Evaluated correctly to 0.`,
          `✅ Test Case 3 Passed: Evaluated correctly to 84.7.`,
          "🏆 Complete Pipeline Suite validated successfully. All checks are GREEN!"
        ]);
        setSuccess(true);
        setBadgeUnlocked(true);

        // Save progress to trigger XP boost + Badge creation update on server
        onSaveProgress({
          topicId: 'js-core',
          isChallenge: true,
          xpBonus: 300
        });

      } catch (err: any) {
        setErrorMsg(err.message || "Syntactic Exception encountered.");
        setConsoleLogs(prev => [...prev, `❌ Compilation / Validation error: ${err.message}`]);
      } finally {
        setRunning(false);
      }
    }, 850);
  };

  const handleReset = () => {
    setCode(defaultCode);
    setConsoleLogs([]);
    setErrorMsg("");
    setSuccess(false);
    setBadgeUnlocked(false);
  };

  return (
    <div id="js-es6-challenge-card" className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-5">
      
      {/* Challenge Title Banner */}
      <div className="flex border-b border-neutral-150 dark:border-neutral-850 pb-3 items-center justify-between">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/15 rounded uppercase">
            Interactive Laboratory
          </span>
          <h4 className="text-sm font-black text-neutral-900 dark:text-white mt-1.5 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
            ES6 Array Pipelines Mastery Challenge
          </h4>
        </div>
        <span className="text-[10px] bg-yellow-500/10 text-yellow-500 font-bold px-2 py-0.5 rounded font-mono">
          +300 XP Bonus
        </span>
      </div>

      {/* Narrative & specifications */}
      <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
        <p>
          High-performance systems filter data before maps and reductions to minimize computational cycles. Your task is to process an array of transaction records and calculate clean reward metrics.
        </p>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 rounded-xl space-y-2">
          <h5 className="font-bold text-neutral-850 dark:text-neutral-200 text-xs">Mathematical Blueprint Guidelines:</h5>
          <ol className="list-decimal pl-4 space-y-1.5 text-xs text-neutral-550">
            <li>
              Apply <strong className="text-indigo-600 dark:text-indigo-400">.filter()</strong> to remove all elements where <code className="font-mono bg-neutral-100 p-0.5 rounded">type !== 'income'</code>.
            </li>
            <li>
              Apply <strong className="text-indigo-600 dark:text-indigo-400">.map()</strong> to multiply the remaining amounts by <code className="font-mono text-emerald-500 bg-neutral-100 dark:bg-neutral-900 px-0.5 rounded">1.10</code> representing a 10% cash-back incentive.
            </li>
            <li>
              Apply <strong className="text-indigo-600 dark:text-indigo-400">.reduce()</strong> to sum all cash-back rewards up to evaluate a single total balance.
            </li>
          </ol>
        </div>
      </div>

      {/* Editor & code box grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Editor Box */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-neutral-550 text-[10px] uppercase font-bold">JavaScript Sandbox Editor</span>
            <button onClick={handleReset} className="text-[10px] text-neutral-400 hover:text-indigo-600">Reset Skeleton</button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-80 bg-neutral-950 p-4 border border-neutral-800 font-mono text-xs text-green-400 rounded-xl focus:ring-1 focus:ring-indigo-500 leading-relaxed shadow-inner"
            placeholder="Write ES6 array pipeline here..."
          />
        </div>

        {/* Diagnostics & outputs */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4 flex-1">
            <span className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider font-mono block">
              Test Suite Diagnostics Console
            </span>

            <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl min-h-36 font-mono text-[10px] sm:text-xs text-neutral-400 space-y-2 max-h-56 overflow-y-auto leading-relaxed shadow-inner">
              {consoleLogs.length === 0 ? (
                <span className="text-neutral-550 italic block mt-4 text-center">Diagnostics standby. Awaiting verification pipeline activation...</span>
              ) : (
                consoleLogs.map((log, i) => (
                  <div key={i} className={log.startsWith('✅') ? 'text-green-400' : log.startsWith('🏆') ? 'text-amber-400 font-bold' : log.startsWith('❌') ? 'text-red-400 font-semibold' : 'text-neutral-450'}>
                    {log}
                  </div>
                ))
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/5 text-[11px] text-red-500 border border-red-500/15 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleRunVerify}
            disabled={running}
            className="w-full text-center py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:bg-neutral-300 text-white font-black rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:cursor-not-allowed"
          >
            {running ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Array Pipelines...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Compile, Run, & Validate Pipeline
              </>
            )}
          </button>

        </div>

      </div>

      {/* Dynamic custom award celebrating unlocked achievement */}
      <AnimatePresence>
        {badgeUnlocked && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="p-5 rounded-2xl bg-linear-to-r from-amber-500/5 via-yellow-500/10 to-indigo-500/5 border border-yellow-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 select-none relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-500/5 rounded-full blur-2xl"></div>

            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              <div className="w-14 h-14 bg-yellow-500 text-white flex items-center justify-center rounded-xl shadow-lg ring-4 ring-yellow-500/15 text-2xl shrink-0">
                ⭐
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-widest font-mono text-yellow-600 dark:text-yellow-400 font-black">
                  New Badge Unlocked 🎉
                </span>
                <h4 className="text-sm font-black text-neutral-850 dark:text-neutral-200 mt-1">
                  CSS & ES6 Array Master
                </h4>
                <p className="text-[11px] text-neutral-500">You successfully crafted map, filter, and reduce chaining loops to process transaction collections.</p>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end justify-center shrink-0">
              <span className="text-2xl font-black font-mono text-yellow-505 dark:text-yellow-400 leading-none">
                +300 XP
              </span>
              <span className="text-[9px] font-mono font-bold text-neutral-450 mt-1 uppercase">Added to profile</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
