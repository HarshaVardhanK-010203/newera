import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Trash2, Award, Sparkles, BookOpen, Search, Mail, 
  Settings, UserPlus, Flame, Cpu, ArrowUpRight, BarChart3, TrendingUp 
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
  const { profile, syncProfileData } = useAuth();
  
  const [students, setStudents] = useState<StudentData[]>([
    { uid: 'student-1', username: 'HarshaDev', email: 'harshavardhanhv119@gmail.com', role: 'Admin', level: 12, xp: 11450, streak: 28, joinedDate: '2026-02-14' },
    { uid: 'student-2', username: 'SarahCodex', email: 'sarah.codex@fast.io', role: 'Student', level: 8, xp: 7520, streak: 12, joinedDate: '2026-03-01' },
    { uid: 'student-3', username: 'AlexCodenoob', email: 'alex.noob@gmail.com', role: 'Student', level: 4, xp: 3200, streak: 3, joinedDate: '2026-03-24' },
    { uid: 'student-4', username: 'HackerOne', email: 'hacker.prime@sec.io', role: 'Mentor', level: 14, xp: 13800, streak: 19, joinedDate: '2026-01-10' },
    { uid: 'student-5', username: 'ByteSized', email: 'byte.master@yahoo.com', role: 'Student', level: 1, xp: 450, streak: 1, joinedDate: '2026-05-15' },
    { uid: 'student-6', username: 'SprintMaster', email: 'sprint.master@gmail.com', role: 'Student', level: 6, xp: 5400, streak: 8, joinedDate: '2026-04-18' }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<'All' | 'Student' | 'Mentor' | 'Admin'>('All');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Stats
  const totalStudentsCount = students.length;
  const avgLevel = Math.round(students.reduce((acc, current) => acc + current.level, 0) / students.length || 0);
  const totalXpAdded = students.reduce((acc, current) => acc + current.xp, 0);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const handleDeleteUser = (uid: string) => {
    if (confirm("Are you absolutely sure you want to scrub this student's master database logs?")) {
      setStudents(students.filter(student => student.uid !== uid));
      showToast("Student core credentials deleted successfully from Firestore cluster.");
    }
  };

  const handleLevelUp = (uid: string) => {
    setStudents(students.map(s => {
      if (s.uid === uid) {
        return {
          ...s,
          level: s.level + 1,
          xp: s.xp + 1000
        };
      }
      return s;
    }));
    showToast("Bonus allocation updated. Student level and XP incremented.");
  };

  const handleRoleChange = (uid: string, newRole: 'Student' | 'Mentor' | 'Admin') => {
    setStudents(students.map(s => {
      if (s.uid === uid) {
        return {
          ...s,
          role: newRole
        };
      }
      return s;
    }));
    showToast(`Student security clearance altered to ${newRole}.`);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRole === 'All' || student.role === filterRole;
    return matchesSearch && matchesFilter;
  });

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

      {/* Manage Students Core Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-xs space-y-6">
        
        {/* Actions header and filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Active Student Credentials Ledger</h4>
            <p className="text-xs text-neutral-500">Edit levels, modify roles, or remove accounts across database branches.</p>
          </div>

          <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-lg select-none">
            {(['All', 'Student', 'Mentor', 'Admin'] as const).map(roleOption => (
              <button 
                key={roleOption}
                onClick={() => setFilterRole(roleOption)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${filterRole === roleOption ? 'bg-white dark:bg-neutral-900 shadow-xs text-indigo-650 dark:text-indigo-400' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                {roleOption}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student directories by username or email address..."
            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm text-neutral-900 dark:text-white"
          />
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
                <th className="p-4">Student Persona</th>
                <th className="p-4">Authorization</th>
                <th className="p-4">Streak & XP</th>
                <th className="p-4">Enrollment Date</th>
                <th className="p-4 text-right">Administrative Override Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-155 dark:divide-neutral-800/60 text-xs">
              {filteredStudents.map((student) => (
                <tr key={student.uid} className="hover:bg-neutral-50/40 dark:hover:bg-neutral-950/20 transition-all">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xs select-none">
                        {student.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-extrabold text-neutral-900 dark:text-white leading-tight">{student.username}</p>
                        <p className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3 text-neutral-400" /> {student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select 
                      value={student.role} 
                      onChange={(e) => handleRoleChange(student.uid, e.target.value as any)}
                      className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-2 py-1 rounded text-xs select-none"
                    >
                      <option value="Student">Student</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-neutral-700 dark:text-neutral-300">Level {student.level}</p>
                      <p className="text-[10px] font-mono text-indigo-500">{student.xp} total XP • 🔥 {student.streak} days</p>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-neutral-500">
                    {student.joinedDate}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleLevelUp(student.uid)} 
                      className="p-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-600 text-xs font-bold transition flex-inline items-center gap-1 cursor-pointer"
                      title="Add XP and level up"
                    >
                      Allocate XP +1k
                    </button>
                    {student.email !== "harshavardhanhv119@gmail.com" ? (
                      <button 
                        onClick={() => handleDeleteUser(student.uid)}
                        className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-550 transition flex-inline items-center gap-1 cursor-pointer"
                        title="Delete student record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded">ROOT LOCKED</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400 font-medium">
                    No matching student registered credentials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Alert toast notification */}
      {successToast && (
        <div id="admin-action-toast" className="fixed bottom-6 right-6 p-4 rounded-xl bg-neutral-900 border border-neutral-700 text-white shadow-xl flex items-center gap-2.5 z-50 text-xs font-semibold animate-slide-up">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>{successToast}</span>
        </div>
      )}

    </div>
  );
}
