import React, { useState } from 'react';
import { Network, Star, CheckCircle, Lock, ArrowRight, BookOpen, Globe, Cpu, Database, Flame } from 'lucide-react';
import { Topic, UserProfile } from '../types';

interface RoadmapProps {
  topics: Topic[];
  profile: UserProfile;
  onSelectTopic: (topicId: string) => void;
}

interface MilestonesRoadNode {
  id: string;
  label: string;
  relatedTopicId?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon: string;
}

export default function Roadmap({ topics, profile, onSelectTopic }: RoadmapProps) {
  const [activePlan, setActivePlan] = useState<'frontend' | 'backend' | 'fullstack'>('frontend');

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

            return (
              <div 
                key={s.id} 
                className={`flex items-start gap-6 transition ${isLocked ? 'opacity-40' : 'hover:scale-101'}`}
              >
                {/* Node bubble */}
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-md border ${
                    isCompleted 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : isLocked 
                        ? 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850 text-neutral-400' 
                        : 'bg-white dark:bg-neutral-900 border-indigo-500/40 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-6 h-6 animate-pulse" /> : isLocked ? <Lock className="w-5 h-5 text-neutral-400" /> : <span className="text-2xl select-none">{s.icon}</span>}
                </div>

                {/* Node details */}
                <div className="flex-1 bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-neutral-400">Chapter {index + 1}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        s.level === 'Beginner' ? 'bg-green-550/10 text-green-500' : s.level === 'Intermediate' ? 'bg-yellow-550/10 text-yellow-500' : s.level === 'Advanced' ? 'bg-indigo-550/10 text-indigo-500' : 'bg-red-550/10 text-red-500'
                      }`}>
                        {s.level}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white mt-1.5">{s.label}</h4>
                  </div>

                  {s.relatedTopicId && !isLocked && (
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

    </div>
  );
}
