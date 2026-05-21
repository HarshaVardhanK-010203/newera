import React, { useState } from 'react';
import { BookOpen, Award, Flame, Calendar, Clock, RotateCcw, TrendingUp, CheckCircle, Target, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface DashboardProps {
  profile: UserProfile;
  analytics: any;
  onSelectTopic: (topicId: string) => void;
  onUpdateStreak: () => void;
}

export default function Dashboard({ profile, analytics, onSelectTopic, onUpdateStreak }: DashboardProps) {
  const [goalAchieved, setGoalAchieved] = useState(false);

  // Generate mock heatmap data representing 52 weeks of learning contributions (GitHub pattern)
  const heatmapDays = Array.from({ length: 91 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (90 - i));
    // Seed higher weights on recent days
    let val = 0;
    if (i % 3 === 0) val = 1;
    if (i % 7 === 0) val = 3;
    if (i % 10 === 0) val = 4;
    if (i > 85) val = 4; // active recent contributions
    return { date: d.toDateString(), value: val };
  });

  const getHeatmapColor = (val: number) => {
    switch (val) {
      case 1: return "bg-emerald-950/40 dark:bg-emerald-900/40";
      case 2: return "bg-emerald-800/60 dark:bg-emerald-700/60";
      case 3: return "bg-emerald-600 dark:bg-emerald-500";
      case 4: return "bg-emerald-400 dark:bg-emerald-300";
      default: return "bg-neutral-200 dark:bg-neutral-800";
    }
  };

  const weeklyActivity = analytics?.weeklyActivity || [
    { day: "Mon", hr: 1.2 },
    { day: "Tue", hr: 1.8 },
    { day: "Wed", hr: 0.5 },
    { day: "Thu", hr: 2.2 },
    { day: "Fri", hr: 1.5 },
    { day: "Sat", hr: 0.3 },
    { day: "Sun", hr: 1.3 }
  ];

  const milestones = analytics?.milestones || [
    { badgeName: "First Steps", description: "Completed structural fundamentals introduction block.", unlocked: true },
    { badgeName: "CSS Explorer", description: "Completed flexbox or grid concepts structures.", unlocked: false },
    { badgeName: "JS Alchemist", description: "Solved custom JavaScript practice runs.", unlocked: false },
    { badgeName: "SaaS Maker", description: "Successfully finished an advanced engineering project.", unlocked: false }
  ];

  const maxWeeklyHours = Math.max(...weeklyActivity.map((d: any) => d.hr), 1);

  return (
    <div id="learning-dashboard" className="space-y-8 animate-fade-in p-1">
      {/* Welcome Banner */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-linear-to-r from-cyan-900 to-indigo-950 border border-indigo-500/20 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                🚀 {profile.role} Track
              </span>
              <span className="text-sm text-indigo-200 uppercase font-mono tracking-wider">
                Level {profile.level}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-linear-to-r from-white via-neutral-100 to-cyan-200 bg-clip-text text-transparent">
              Welcome back, {profile.username}!
            </h1>
            <p className="mt-2 text-neutral-300 max-w-xl text-sm leading-relaxed">
              Your consistency score is at <strong className="text-cyan-400 font-bold">{profile.consistencyScore}%</strong>. Keep up your active coding streak and hit those expert benchmarks!
            </p>
          </div>

          {/* Quick Stats Mini row */}
          <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <button 
              onClick={onUpdateStreak}
              title="Click to increase streak!"
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition group"
            >
              <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg group-hover:scale-110 transition">
                <Flame className="w-6 h-6 fill-orange-500/30" />
              </div>
              <div className="text-left">
                <p className="text-xs text-neutral-400">Daily Streak</p>
                <p className="text-lg font-bold text-white font-mono">{profile.streak} Days</p>
              </div>
            </button>

            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-3 px-3 py-2">
              <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
                <Award className="w-6 h-6 fill-yellow-500/30" />
              </div>
              <div>
                <p className="text-xs text-neutral-400">XP Points</p>
                <p className="text-lg font-bold text-white font-mono">{profile.xp} <span className="text-xs font-normal">XP</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="flex justify-between items-center text-sm mb-2 text-neutral-300">
            <span>Progress to Next Level</span>
            <span className="font-mono text-cyan-300 font-semibold">{profile.xp % 1000} / 1000 XP</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${(profile.xp % 1000) / 10}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Stats bento column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core numbers box */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-950/60 text-cyan-500 dark:text-cyan-400 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-emerald-500 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-1 rounded-md flex items-center gap-1">
                +100%
              </span>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Syllabus Lessons Done</p>
              <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 font-mono">
                {profile.completedTopics.length} <span className="text-xs text-neutral-400 font-normal">topics</span>
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/60 text-purple-500 dark:text-purple-400 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-purple-500 bg-purple-100 dark:bg-purple-950/60 px-2 py-1 rounded-md">
                XP Boosted
              </span>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Practice / Quizzes</p>
              <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 font-mono">
                {profile.completedQuizzedTopics.length} <span className="text-xs text-neutral-400 font-normal">passed</span>
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-indigo-500 bg-indigo-100 dark:bg-indigo-950/60 px-2 py-1 rounded-md">
                Active
              </span>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Total Learning Time</p>
              <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 font-mono">
                {profile.timeSpentMinutes} <span className="text-xs text-neutral-400 font-normal">mins</span>
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Goals block */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Weekly Milestones Goal
            </h3>
            <span className="text-xs text-neutral-500 uppercase font-mono">Goal: 5 Hrs</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={profile.completedTopics.length >= 2} 
                  readOnly 
                  className="w-5 h-5 accent-emerald-500 rounded border-neutral-300 dark:border-neutral-700" 
                />
                <div>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Study 2 Core Topics</p>
                  <p className="text-xs text-neutral-500">Read & test syntaxes</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {profile.completedTopics.length}/2
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={goalAchieved} 
                  onChange={() => setGoalAchieved(!goalAchieved)} 
                  className="w-5 h-5 accent-emerald-500 rounded border-neutral-300 dark:border-neutral-700 cursor-pointer" 
                />
                <div>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Code in Playground</p>
                  <p className="text-xs text-neutral-500">Run code & log outputs</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400">Daily Task</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Heatmap, similar to GitHub contributions */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Activity Ledger & Contribution Matrix
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Your daily interactive web coding sessions captured in real-time.</p>
          </div>
          <span className="text-xs font-mono text-neutral-400">Total: {heatmapDays.filter(h => h.value > 0).length} Dynamic Days</span>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-1.5 min-w-[700px] justify-between p-1">
            {heatmapDays.map((v, i) => (
              <div 
                key={i}
                title={`${v.date} - ${v.value} contribution marks`}
                className={`w-4 h-4 rounded-xs shrink-0 transition-all ${getHeatmapColor(v.value)} hover:scale-115 cursor-pointer`}
              ></div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <span>Older session records (90 days window)</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span>Less</span>
            <div className="w-3.5 h-3.5 rounded-xs bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="w-3.5 h-3.5 rounded-xs bg-emerald-950/40 dark:bg-emerald-900/40"></div>
            <div className="w-3.5 h-3.5 rounded-xs bg-emerald-700/60 dark:bg-emerald-600"></div>
            <div className="w-3.5 h-3.5 rounded-xs bg-emerald-400"></div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Grid: Weekly Hour Graphs + Achievement Badges list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Weekly Progress hours bar columns */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-cyan-500" />
            Weekly Learning Hours Logged
          </h3>

          <div className="flex items-end justify-between h-48 px-2 pt-6 border-b border-neutral-200 dark:border-neutral-800">
            {weeklyActivity.map((w: any, i: number) => {
              const heightPct = (w.hr / maxWeeklyHours) * 100;
              return (
                <div key={i} className="flex flex-col items-center gap-2 w-1/8 group cursor-pointer">
                  <div className="relative w-full flex justify-center">
                    <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition duration-200 bg-neutral-900 text-white text-[10px] py-0.5 px-1.5 rounded-sm font-mono z-10">
                      {w.hr} hrs
                    </span>
                    <div 
                      className="w-8 bg-linear-to-t from-cyan-600 to-indigo-500 group-hover:from-cyan-400 group-hover:to-indigo-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPct}%`, minHeight: w.hr > 0 ? '8px' : '2px' }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase mt-1">
                    {w.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Path Achievements */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-yellow-500" />
            Locked & Unlocked Achievements
          </h3>

          <div className="space-y-4 max-h-50 overflow-y-auto pr-1">
            {milestones.map((m: any, i: number) => (
              <div 
                key={i} 
                className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                  m.unlocked 
                    ? 'bg-yellow-500/5 border-yellow-500/20 text-yellow-900 dark:text-yellow-100' 
                    : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 opacity-60'
                }`}
              >
                <div className={`p-2 rounded-lg ${m.unlocked ? 'bg-yellow-500/10 text-yellow-500' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'}`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">{m.badgeName}</p>
                    {m.unlocked && <span className="text-[10px] bg-yellow-500/20 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 font-semibold px-1.5 py-0.5 rounded-sm">Unlocked</span>}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
