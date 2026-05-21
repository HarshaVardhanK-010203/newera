import React, { useState } from 'react';
import { 
  Shield, BookOpen, Flame, Cpu, BarChart3, TrendingUp 
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAuth } from '../AuthContext';

interface StudentData {
  uid: string;
  username: string;
  email: string;
  role: 'Student' | 'Mentor' | 'Admin';
  level: number;
  xp: number;
  streak: number;
  joinedDate: string;
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  
  const [students] = useState<StudentData[]>([
    { uid: 'student-1', username: 'HarshaDev', email: 'harshavardhanhv119@gmail.com', role: 'Admin', level: 12, xp: 11450, streak: 28, joinedDate: '2026-02-14' },
    { uid: 'student-2', username: 'SarahCodex', email: 'sarah.codex@fast.io', role: 'Student', level: 8, xp: 7520, streak: 12, joinedDate: '2026-03-01' },
    { uid: 'student-3', username: 'AlexCodenoob', email: 'alex.noob@gmail.com', role: 'Student', level: 4, xp: 3200, streak: 3, joinedDate: '2026-03-24' },
    { uid: 'student-4', username: 'HackerOne', email: 'hacker.prime@sec.io', role: 'Mentor', level: 14, xp: 13800, streak: 19, joinedDate: '2026-01-10' },
    { uid: 'student-5', username: 'ByteSized', email: 'byte.master@yahoo.com', role: 'Student', level: 1, xp: 450, streak: 1, joinedDate: '2026-05-15' },
    { uid: 'student-6', username: 'SprintMaster', email: 'sprint.master@gmail.com', role: 'Student', level: 6, xp: 5400, streak: 8, joinedDate: '2026-04-18' }
  ]);

  // Stats
  const totalStudentsCount = students.length;
  const avgLevel = Math.round(students.reduce((acc, current) => acc + current.level, 0) / students.length || 0);
  const totalXpAdded = students.reduce((acc, current) => acc + current.xp, 0);

  return (
    <div id="admin-dashboard-root" className="space-y-8 animate-fade-in p-1">
      
      {/* Dynamic administrative credentials banner */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-linear-to-r from-neutral-900 to-slate-950 border border-neutral-800 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                🛡️ Master Admin Interface
              </span>
              <span className="text-xs font-mono text-neutral-400">
                ACTIVE PRIVILEGES: AUTHORIZED
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-linear-to-r from-white via-neutral-100 to-indigo-150 bg-clip-text text-transparent">
              Master Academic Control Panel
            </h1>
            <p className="mt-2 text-neutral-400 max-w-xl text-xs sm:text-sm leading-relaxed">
              Execute cross-student updates, review Firestore schema telemetry, edit roles, and delete orphaned cloud registers seamlessly.
            </p>
          </div>

          {/* Quick Metrics display */}
          <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <div className="px-4 py-2 border-r border-white/10 text-center">
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest font-mono">Students Registered</p>
              <p className="text-2xl font-black font-mono leading-none mt-1">{totalStudentsCount}</p>
            </div>
            <div className="px-4 py-2 border-r border-white/10 text-center">
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest font-mono">Average Level</p>
              <p className="text-2xl font-black font-mono leading-none mt-1">{avgLevel}</p>
            </div>
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest font-mono">Cumulative System XP</p>
              <p className="text-2xl font-black font-mono text-indigo-400 leading-none mt-1">{totalXpAdded} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Visualization cards (Bento Style) */}
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-indigo-500" />
        Curriculum & Engagement Telemetry
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Most Difficult Lessons Metric */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-xs space-y-4">
          <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-bold flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-500" /> Tricky Syllabus Challenges
          </h4>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-neutral-500 mb-1">
                <span>React-Hook Closures</span>
                <span className="font-mono text-neutral-900 dark:text-white">82% Fail Rate</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-150 rounded-full overflow-hidden">
                <div className="h-full bg-red-400" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-neutral-500 mb-1">
                <span>CSS Bento Grid Matrices</span>
                <span className="font-mono text-neutral-900 dark:text-white">65% Fail Rate</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-150 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-neutral-500 mb-1">
                <span>JavaScript Asynchronous Arrays</span>
                <span className="font-mono text-neutral-900 dark:text-white">44% Fail Rate</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-150 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: '44%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Firestore Database telemetry status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-500" /> Security Rules & DB Cluster
            </h4>
            <div className="pt-3 space-y-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
              <p className="flex justify-between"><span className="text-neutral-450 uppercase">Firestore:</span> <strong className="text-emerald-500">LIVE (Enterprise)</strong></p>
              <p className="flex justify-between"><span className="text-neutral-450 uppercase">Auth Nodes:</span> <strong className="text-indigo-400">ACTIVE: 3 Methods</strong></p>
              <p className="flex justify-between"><span className="text-neutral-450 uppercase">Read Quota Usage:</span> <span>1.2% daily basis</span></p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-150 dark:border-neutral-850 flex justify-between items-center text-xs">
            <span className="text-neutral-400">Rules deployed: Yes</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded uppercase">FORTRESS SAFE</span>
          </div>
        </div>

        {/* Student Enrollment Trajectory */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> Enrollment Velocity
            </h4>
            <div className="flex items-end gap-2 h-20 pt-4">
              <div className="flex-1 bg-indigo-500/20 hover:bg-indigo-500 transition-all rounded-md h-8" title="March: 12"></div>
              <div className="flex-1 bg-indigo-500/30 hover:bg-indigo-500 transition-all rounded-md h-12" title="April: 19"></div>
              <div className="flex-1 bg-indigo-500/50 hover:bg-indigo-500 transition-all rounded-md h-16" title="May (Current): 28"></div>
              <div className="flex-1 bg-indigo-500 hover:bg-indigo-600 transition-all rounded-md h-20" title="Projected: 44"></div>
            </div>
          </div>
          <p className="text-[10px] text-neutral-400 mt-2 text-right">Updated just now</p>
        </div>

      </div>

    </div>
  );
}
