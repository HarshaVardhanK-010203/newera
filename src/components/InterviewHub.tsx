import React, { useState } from 'react';
import { HelpCircle, Star, Award, MessageSquare, ShieldAlert, BookOpen, Send, Sparkles, Clock, RefreshCw, BarChart2 } from 'lucide-react';
import { InterviewHubQuestion } from '../types';

interface InterviewHubProps {
  questions: InterviewHubQuestion[];
}

export default function InterviewHub({ questions }: InterviewHubProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewHubQuestion | null>(questions[0] || null);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState<'faang' | 'tips'>('faang');
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);

  // Timed session mock variables
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes mock counter
  const [timerActive, setTimerActive] = useState(false);
  const [timerIntervalRef, setTimerIntervalRef] = useState<any>(null);

  const startTimer = () => {
    if (timerActive) return;
    setTimerActive(true);
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerIntervalRef(interval);
  };

  const stopTimer = () => {
    if (!timerActive) return;
    clearInterval(timerIntervalRef);
    setTimerActive(false);
  };

  const resetTimer = () => {
    stopTimer();
    setSecondsRemaining(600);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const evaluateAnswer = async () => {
    if (!selectedQuestion || !studentAnswer.trim()) return;
    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const response = await fetch('/api/mentor/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          questionTitle: selectedQuestion.question,
          studentAnswer,
          category: selectedQuestion.category
        })
      });

      const data = await response.json();
      if (response.ok) {
        setEvaluationResult(data.text);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setEvaluationResult(`⚠️ Evaluation failed: ${err.message || 'Network delay'}.`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const selectNewQuestion = (q: InterviewHubQuestion) => {
    setSelectedQuestion(q);
    setStudentAnswer("");
    setEvaluationResult(null);
  };

  return (
    <div id="career-interview-hub" className="space-y-8 animate-fade-in p-1">
      
      {/* Header Banner */}
      <div className="relative p-6 rounded-2xl bg-linear-to-r from-purple-900 to-indigo-950 border border-purple-500/20 text-white shadow-xl overflow-hidden">
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-400/20 text-purple-300 border border-purple-400/30">
            💼 FAANG Core Prep Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 bg-linear-to-r from-white to-neutral-200 bg-clip-text text-transparent">
            Web Development Career & Interview Hub
          </h2>
          <p className="mt-2 text-neutral-300 max-w-2xl text-xs sm:text-sm">
            Acclimate yourself to senior level developer assessments! Write answers to complex conceptual queries and receive grading, score analytics, and interview notes in real-time.
          </p>
        </div>
      </div>

      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <button 
          onClick={() => setActiveTab('faang')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'faang' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <Award className="w-4 h-4" /> FAANG Interview Questions
        </button>

        <button 
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'tips' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <BookOpen className="w-4 h-4" /> Interview Success Cheatsheet
        </button>
      </div>

      {activeTab === 'faang' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column Left: Question pool list */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none mb-2">TECHNICAL CONCEPTS INDEX</h4>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {questions.map((q) => (
                <button 
                  key={q.id}
                  onClick={() => selectNewQuestion(q)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selectedQuestion?.id === q.id 
                      ? 'bg-purple-500/5 border-purple-500 text-neutral-900 dark:text-white' 
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850/50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 border border-purple-150 px-2 py-0.5 rounded">
                      {q.category}
                    </span>
                    <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded uppercase ${
                      q.difficulty === 'FAANG' ? 'bg-red-500/10 text-red-500' : q.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold mt-2.5 line-clamp-2 leading-snug">{q.question}</h4>
                </button>
              ))}
            </div>
          </div>

          {/* Column Right (2/3): Live response testing card */}
          {selectedQuestion ? (
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                
                <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-150">
                  <span className="text-xs font-mono text-neutral-500">Timed Sandbox Challenge Simulator</span>
                  
                  {/* Digital Clock counter */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-neutral-700 dark:text-neutral-300">{formatTimer(secondsRemaining)}</span>
                    <div className="flex gap-1">
                      <button onClick={startTimer} disabled={timerActive} className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-[10px] rounded hover:bg-neutral-350 shrink-0">Start</button>
                      <button onClick={stopTimer} disabled={!timerActive} className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-[10px] rounded hover:bg-neutral-350 shrink-0">Stop</button>
                      <button onClick={resetTimer} className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-[10px] rounded"><RefreshCw className="w-3 h-3 text-neutral-600" /></button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white">{selectedQuestion.question}</h3>
                  <p className="text-xs text-neutral-450 mt-1">Review the tips before draft submission. Ensure your explanation covers time, space complexity, or DOM optimizations where applicable.</p>
                </div>

                {/* Hints panel */}
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs">
                  <h4 className="font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1.5 mb-1.5">
                    <Star className="w-4 h-4 fill-current" /> Recommended Interview Key Points
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-neutral-400">
                    {selectedQuestion.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                  </ul>
                </div>

                {/* Candidate response area */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Candidate Submission Response</label>
                  <textarea 
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    placeholder="Draft your comprehensive technical explanation here. Try to use professional vocabulary, structured loops, and memory optimization terms."
                    disabled={isEvaluating}
                    className="w-full h-48 p-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-850 dark:text-neutral-200 border border-neutral-250 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={evaluateAnswer}
                    disabled={isEvaluating || !studentAnswer.trim()}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-purple-700 disabled:bg-neutral-400 transition flex items-center gap-2 cursor-pointer"
                  >
                    <BarChart2 className="w-4 h-4 animate-bounce" /> {isEvaluating ? 'Recruiter AI Evaluator Running...' : 'Evaluate Submission Response'}
                  </button>
                </div>

              </div>

              {/* grading evaluator outputs */}
              {evaluationResult && (
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-purple-500">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-spin" />
                    <h4 className="text-sm font-extrabold uppercase tracking-widest font-mono">RECRUITER AI EVALUATION ASSESSMENT REPORT</h4>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-line leading-relaxed font-sans border-t border-neutral-100 dark:border-neutral-850 pt-4 select-text">
                    {evaluationResult}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="lg:col-span-2 flex items-center justify-center p-12 text-center text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
              Select an interview technical question from lists to begin assessment.
            </div>
          )}

        </div>
      )}

      {activeTab === 'tips' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">FAANG Coding Interview Success Blueprint</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="text-2xl">⚡</span>
              <h4 className="font-bold text-neutral-900 dark:text-white">The STAR Method Formula</h4>
              <p className="text-xs text-neutral-500 leading-normal">Structure answers in Situation, Task, Action, and Quantitative Result. Focus strictly on your specific personal codebase contributions.</p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="text-2xl">🧬</span>
              <h4 className="font-bold text-neutral-900 dark:text-white">Dry Coding Performance</h4>
              <p className="text-xs text-neutral-500 leading-normal">Always discuss Big O time complexity and space complexity calculations instantly. Outline optimal nested routes over nested iterations.</p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="text-2xl">🎖️</span>
              <h4 className="font-bold text-neutral-900 dark:text-white">Portfolio Construction</h4>
              <p className="text-xs text-neutral-500 leading-normal">Your custom resume should contain real-world live responsive URL deployments, clean documentation, and robust unit checking files.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
