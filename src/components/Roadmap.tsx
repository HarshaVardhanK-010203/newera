import React, { useState, useEffect } from 'react';
import { Network, Star, CheckCircle, Lock, ArrowRight, BookOpen, Globe, Cpu, Database, Flame } from 'lucide-react';
import { Topic, UserProfile } from '../types';

interface RoadmapProps {
  topics: Topic[];
  profile: UserProfile;
  onSelectTopic: (topicId: string) => void;
  justCompletedTopicId?: string | null;
  onClearJustCompleted?: () => void;
}

interface MilestonesRoadNode {
  id: string;
  label: string;
  relatedTopicId?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon: string;
}

export default function Roadmap({ topics, profile, onSelectTopic, justCompletedTopicId, onClearJustCompleted }: RoadmapProps) {
  const [activePlan, setActivePlan] = useState<'frontend' | 'backend' | 'fullstack'>('frontend');
  const [unlockedPopupState, setUnlockedPopupState] = useState<MilestonesRoadNode | null>(null);

  // Modular roadmap step configs
  const plans: { [key: string]: MilestonesRoadNode[] } = {
    frontend: [
      { id: "f-1", label: "Web Fundamentals & DNS", relatedTopicId: "fundamentals-intro", level: "Beginner", icon: "🌐" },
      { id: "f-2", label: "HTML5 Semantic Boilerplates", relatedTopicId: "html-boilerplate", level: "Beginner", icon: "🧾" },
      { id: "f-3", label: "CSS3 Box Models & Layouts", relatedTopicId: "css-boxmodel", level: "Beginner", icon: "🎨" },
      { id: "f-4", label: "Flexbox Layout Distributions", relatedTopicId: "css-flexbox", level: "Intermediate", icon: "🏹" },
      { id: "f-5", label: "CSS Grid Bento Matrixes", relatedTopicId: "css-grid", level: "Intermediate", icon: "🏁" },
      { id: "f-6", label: "UI Design & Accessible Colors", relatedTopicId: "uiux-intro", level: "Intermediate", icon: "🌈" },
      { id: "f-7", label: "JS ES6 Closures & Async Arrays", relatedTopicId: "js-core", level: "Intermediate", icon: "🧠" },
      { id: "f-8", label: "Interactive DOM Event Listeners", relatedTopicId: "dom-manipulation", level: "Advanced", icon: "🎯" },
      { id: "f-9", label: "React Components, Props & Hooks", relatedTopicId: "react-hooks", level: "Advanced", icon: "⚛️" }
    ],
    backend: [
      { id: "b-1", label: "Unix commands Navigation", relatedTopicId: "unix-terminal", level: "Beginner", icon: "🐚" },
      { id: "b-2", label: "Version Trackers & Git Graph workflows", relatedTopicId: "git-basics", level: "Beginner", icon: "🌲" },
      { id: "b-3", label: "NodeJS & Express Server Rest APIs", relatedTopicId: "node-server", level: "Intermediate", icon: "📦" },
      { id: "b-4", label: "Relational Tables & PG SQL databases", relatedTopicId: "databases-sql", level: "Advanced", icon: "💾" },
      { id: "b-5", label: "REST APIs & Fetching protocols", relatedTopicId: "apis-networking", level: "Advanced", icon: "🛰️" }
    ],
    fullstack: [
      { id: "fs-1", label: "Frontend Foundations Core", relatedTopicId: "fundamentals-intro", level: "Beginner", icon: "🌐" },
      { id: "fs-2", label: "Variables & Closures JS logic", relatedTopicId: "js-core", level: "Beginner", icon: "🧠" },
      { id: "fs-3", label: "Interactive State Management", relatedTopicId: "react-hooks", level: "Intermediate", icon: "⚛️" },
      { id: "fs-4", label: "Secure server Rest interfaces", relatedTopicId: "node-server", level: "Advanced", icon: "📦" },
      { id: "fs-5", label: "Relational database links & keys", relatedTopicId: "databases-sql", level: "Expert", icon: "💾" },
      { id: "fs-6", label: "Decentralized trust EVM Web3", relatedTopicId: "web3-intro", level: "Expert", icon: "🪙" }
    ]
  };

  const steps = plans[activePlan] || [];

  // Handle auto-unlock selection and smooth scrolling when a topic was just completed
  useEffect(() => {
    if (justCompletedTopicId) {
      let foundPlan = activePlan;
      for (const [planName, planSteps] of Object.entries(plans)) {
        if (planSteps.some(step => step.relatedTopicId === justCompletedTopicId)) {
          foundPlan = planName as any;
          if (activePlan !== foundPlan) {
            setActivePlan(foundPlan as any);
          }
          break;
        }
      }

      const activeSteps = plans[foundPlan] || [];
      const idx = activeSteps.findIndex(s => s.relatedTopicId === justCompletedTopicId);
      if (idx !== -1 && idx + 1 < activeSteps.length) {
        const nextNode = activeSteps[idx + 1];
        setUnlockedPopupState(nextNode);
      }

      setTimeout(() => {
        const currentSteps = plans[foundPlan] || [];
        const index = currentSteps.findIndex(s => s.relatedTopicId === justCompletedTopicId);
        const nextNode = index !== -1 && index + 1 < currentSteps.length ? currentSteps[index + 1] : null;
        const targetNodeId = nextNode ? nextNode.id : (index !== -1 ? currentSteps[index].id : null);
        if (targetNodeId) {
          const targetEl = document.getElementById(`node-${targetNodeId}`);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 600);
    }
  }, [justCompletedTopicId]);

  // Calculate completion score
  const completedCount = steps.filter(s => s.relatedTopicId && profile.completedTopics.includes(s.relatedTopicId)).length;
  const planPct = Math.round((completedCount / steps.length) * 100);

  return (
    <div id="syllabus-roadmap" className="space-y-8 animate-fade-in p-1">
      
      {/* Header roadmap selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-600" />
            Adaptive Learning Roadmaps
          </h3>
          <p className="text-xs text-neutral-500 mt-1 dark:text-neutral-400">Unlock syllabus units progressively. Reach higher ranks by studying milestones.</p>
        </div>

        <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-lg shrink-0 select-none">
          <button 
            onClick={() => setActivePlan('frontend')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${activePlan === 'frontend' ? 'bg-white dark:bg-neutral-900 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Frontend Path
          </button>
          <button 
            onClick={() => setActivePlan('backend')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${activePlan === 'backend' ? 'bg-white dark:bg-neutral-900 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Backend Path
          </button>
          <button 
            onClick={() => setActivePlan('fullstack')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${activePlan === 'fullstack' ? 'bg-white dark:bg-neutral-900 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Full Stack Path
          </button>
        </div>
      </div>

      {/* Completion gauge banner */}
      <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-xl text-white">
            <Network className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-white capitalize">{activePlan} Path Progression Gauge</h4>
            <p className="text-xs text-neutral-500 mt-1">Unlock next chapters automatically. Current roadmap completed percentage is at <strong className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">{planPct}%</strong>.</p>
          </div>
        </div>

        {/* Progress gauge wheel */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="32" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeWidth="6" fill="transparent" />
            <circle cx="40" cy="40" r="32" stroke="currentColor" className="text-indigo-600 dark:text-indigo-400" strokeWidth="6" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - planPct / 100)} fill="transparent" />
          </svg>
          <span className="absolute font-mono text-sm font-black text-neutral-900 dark:text-white">{planPct}%</span>
        </div>
      </div>

      {/* Vertical nodes road timeline representation */}
      <div className="max-w-xl mx-auto p-2 relative">
        <div className="absolute left-[31px] top-4 bottom-4 w-px bg-neutral-200 dark:bg-neutral-800 z-0"></div>

        <div className="space-y-8 relative z-10">
          {steps.map((s, index) => {
            const isCompleted = s.relatedTopicId && profile.completedTopics.includes(s.relatedTopicId);
            
            // Auto lock if previous not completed (for gamifying tracking)
            const isLocked = index > 0 && steps[index - 1].relatedTopicId && !profile.completedTopics.includes(steps[index - 1].relatedTopicId!);

            // Detect if this is the newly unlocked node
            const isNewlyUnlocked = unlockedPopupState && s.id === unlockedPopupState.id;

            return (
              <div 
                id={`node-${s.id}`}
                key={s.id} 
                className={`flex items-start gap-6 transition relative ${isLocked && !isNewlyUnlocked ? 'opacity-40' : 'hover:scale-[1.01]'} ${isNewlyUnlocked ? 'z-20' : ''}`}
              >
                {/* Progress line connection pulse animation */}
                {isNewlyUnlocked && (
                  <div className="absolute -left-[30px] top-1/2 -translate-y-1/2 w-[24px] h-[3px] bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse"></div>
                )}

                {/* Node bubble */}
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-md border relative transition-all duration-700 ${
                    isCompleted 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : isNewlyUnlocked
                        ? 'bg-neutral-900 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)] scale-110'
                        : isLocked 
                          ? 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850 text-neutral-400' 
                          : 'bg-white dark:bg-neutral-900 border-indigo-500/40 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {isNewlyUnlocked && (
                    <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md animate-ping pointer-events-none"></div>
                  )}
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 animate-pulse" />
                  ) : isNewlyUnlocked ? (
                    <span className="text-2xl select-none animate-spin" style={{ animationDuration: '6s' }}>🌀</span>
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <span className="text-2xl select-none">{s.icon}</span>
                  )}
                </div>

                {/* Node details */}
                <div className={`flex-1 p-5 rounded-2xl border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-700 ${
                  isNewlyUnlocked 
                    ? 'border-cyan-400 bg-gradient-to-r from-neutral-900 via-neutral-900 to-cyan-950/20 shadow-[0_0_25px_rgba(6,182,212,0.35)]'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-neutral-400">Chapter {index + 1}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        s.level === 'Beginner' ? 'bg-green-500/10 text-green-500' : s.level === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-500' : s.level === 'Advanced' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {s.level}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white mt-1.5">{s.label}</h4>
                  </div>

                  {s.relatedTopicId && (!isLocked || isNewlyUnlocked) && (
                    <button 
                      onClick={() => onSelectTopic(s.relatedTopicId!)}
                      className="px-3.5 py-1.5 bg-neutral-100 dark:bg-neutral-950 hover:bg-indigo-600 hover:text-white transition rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      Study <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Animated Portal Open / Chapter Unlocked Modal Popup */}
      {unlockedPopupState && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-sm w-full bg-gradient-to-b from-indigo-950 via-neutral-950 to-neutral-950 border-2 border-cyan-400 p-8 rounded-3xl shadow-[0_0_55px_rgba(6,182,212,0.4)] text-center overflow-hidden">
            {/* Animated Background portal vortex rings */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 m-auto w-48 h-48 border border-cyan-500/30 rounded-full animate-spin [animation-duration:8s] opacity-45"></div>
              <div className="absolute inset-0 m-auto w-40 h-40 border-2 border-dashed border-indigo-400/20 rounded-full animate-spin [animation-duration:12s] opacity-35"></div>
              <div className="absolute inset-0 m-auto w-32 h-32 bg-cyan-500/5 rounded-full blur-xl animate-pulse"></div>
            </div>

            {/* Glowing unlocked portal icon */}
            <div className="relative inline-flex items-center justify-center p-5 bg-gradient-to-tr from-cyan-500 to-indigo-500 text-neutral-950 rounded-full shadow-lg mb-6 shadow-cyan-500/20">
              <span className="text-3xl select-none animate-bounce">⚡</span>
              <div className="absolute inset-0 rounded-full border-2 border-cyan-300 animate-ping opacity-50"></div>
            </div>

            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-black">// MAP PATHWAY STABILIZED</span>
            <h2 className="text-2xl font-black text-white mt-1 mb-2">🎉 Chapter Unlocked!</h2>
            
            <p className="text-[10px] text-neutral-500 uppercase font-mono font-bold tracking-widest mt-3">// NEXT TARGET COMPASS</p>
            <h3 className="text-base font-black text-cyan-200 mt-1 mb-4">
              {unlockedPopupState.label}
            </h3>
            
            <p className="text-xs text-neutral-400 mb-6 px-1 leading-relaxed">
              Fantastic progression! You initialized the parameters of the previous phase. A portal to the subsequent domain has activated.
            </p>

            <button
              onClick={() => {
                setUnlockedPopupState(null);
                if (onClearJustCompleted) {
                  onClearJustCompleted();
                }
              }}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-neutral-950 font-black rounded-xl text-xs tracking-wider transition shadow-lg cursor-pointer"
            >
              Enter Domain Portal
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
