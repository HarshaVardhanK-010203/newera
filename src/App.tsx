import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Award, Flame, LogOut, ChevronRight, Menu, X, Lightbulb, User, BookOpen, 
  Clock, Heart, HelpCircle, Network, Code, Briefcase, ChevronDown, CheckCircle, 
  Search, Bookmark, MessageSquare, Shield, Sun, Moon, Calendar, Users, Cpu, Target,
  FileText, Activity 
} from 'lucide-react';

// Data imports
import { SECTIONS, LEADERBOARD_DATA, INTERVIEW_QUESTIONS, CAREER_PATHS, DATA_STRUCTURE_SECTIONS } from './data/curriculum';
import { UserProfile, Topic } from './types';

// Component imports
import Dashboard from './components/Dashboard';
import Playground from './components/Playground';
import AITutor from './components/AITutor';
import SyllabusLesson from './components/SyllabusLesson';
import InterviewHub from './components/InterviewHub';
import CareerHub from './components/CareerHub';
import Roadmap from './components/Roadmap';
import AuthModal from './components/AuthModal';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import AdminDashboard from './components/AdminDashboard';
import DSALearningEcosystem from './components/DSALearningEcosystem';
import PortalOverlays from './components/PortalOverlays';
import { useAuth } from './AuthContext';


function calculateLevel(xp: number): number {
  if (xp >= 5000) return 8;
  if (xp >= 3500) return 7;
  if (xp >= 2000) return 6;
  if (xp >= 1000) return 5;
  if (xp >= 500) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
}

function getXpToNextLevel(xp: number, currentLevel: number): number {
  const levelXpTargets: { [level: number]: number } = {
    1: 100,
    2: 250,
    3: 500,
    4: 1000,
    5: 2000,
    6: 3500,
    7: 5000,
    8: 5000,
  };
  const target = levelXpTargets[currentLevel] || 5000;
  return Math.max(0, target - xp);
}

export default function App() {
  const { profile, syncProfileData, logout } = useAuth();
  const [activeTab, setActiveTab ] = useState<'dashboard' | 'syllabus' | 'playground' | 'tutor' | 'interviews' | 'careers' | 'dsa' | 'growth' | 'admin'>('dashboard');
  
  // App states
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [justCompletedTopicId, setJustCompletedTopicId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<string | null>("sec-1");

  // Level up overlay states
  const [levelUpOverlay, setLevelUpOverlay] = useState<{ oldLevel: number; newLevel: number } | null>(null);
  const [prevLevel, setPrevLevel] = useState<number | null>(null);

  // Additional modal UI states
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);

  // Left Sidebar Collapsibility State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [justCollapsed, setJustCollapsed] = useState(false);
  const sidebarIsExpanded = !sidebarCollapsed || (sidebarHovered && !justCollapsed);

  // Notification Indicator Alert
  const [showNotifications, setShowNotifications] = useState(false);
  const mockNotifications = [
    { id: 1, text: "🔥 Consistent Coding: Daily streak verified!", time: "2 mins ago" },
    { id: 2, text: "🤖 AI Mentor solved current compiler exception.", time: "1 hour ago" },
    { id: 3, text: "🎓 Striver DSA Sheet: Reverse Linked List recommended.", time: "4 hours ago" }
  ];

  // Monitor profile level change events to trigger level up screens
  useEffect(() => {
    if (profile && profile.level) {
      if (prevLevel !== null && profile.level > prevLevel) {
        setLevelUpOverlay({ oldLevel: prevLevel, newLevel: profile.level });
      }
      setPrevLevel(profile.level);
    } else if (!profile) {
      setPrevLevel(null);
    }
  }, [profile?.level]);

  // Real-time study session timer tracking
  useEffect(() => {
    if (!profile) return;
    
    // Increment study time minutes + learning hours every 1 minute
    const interval = setInterval(async () => {
      try {
        const updatedProfile = {
          ...profile,
          timeSpentMinutes: (profile.timeSpentMinutes || 0) + 1,
          learningHours: Number(((profile.learningHours || 0) + (1 / 60)).toFixed(4))
        };
        await syncProfileData(updatedProfile);
      } catch (err) {
        console.error("Failed to sync study session timer:", err);
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [profile?.uid, profile ? "" : "stale"]);

  // Daily login streak & last activity tracker runs once User Profile loads
  useEffect(() => {
    if (!profile) return;
    
    const lastActivity = profile.notes?.last_activity;
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (lastActivity !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newStreak = profile.streak || 1;
      if (lastActivity === yesterdayStr) {
        newStreak += 1;
      } else if (lastActivity && lastActivity !== todayStr) {
        newStreak = 1;
      }
      
      const updatedProfile = {
        ...profile,
        streak: newStreak,
        notes: {
          ...profile.notes,
          last_activity: todayStr
        }
      };
      
      syncProfileData(updatedProfile);
    }
  }, [profile?.uid]);

  // Playground code override trigger
  const [overridePlaygroundCode, setOverridePlaygroundCode] = useState<string>("");
  const [overridePlaygroundLang, setOverridePlaygroundLang] = useState<'html' | 'css' | 'js' | 'react'>('html');

  const handleAuthSuccess = (newProfile: UserProfile) => {
    syncProfileData(newProfile);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async (topicId: string) => {
    if (!profile) return;
    try {
      const isBookmarked = profile.bookmarks.includes(topicId);
      const updatedBookmarks = isBookmarked
        ? profile.bookmarks.filter(b => b !== topicId)
        : [...profile.bookmarks, topicId];
        
      const updatedProfile = {
        ...profile,
        bookmarks: updatedBookmarks
      };
      
      await syncProfileData(updatedProfile);

      // Trigger backend bookmark API as backup
      try {
        await fetch('/api/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topicId })
        });
      } catch (bkErr) {
        console.warn("Express bookmarks sync backup ignored:", bkErr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProgress = async (payload: { topicId: string; quizCompleted?: boolean; isChallenge?: boolean; isProject?: boolean; xpBonus?: number; quizScore?: number }) => {
    if (!profile) return;
    try {
      let updatedProfile = { ...profile };
      let gainedXP = 0;

      // Initialize structures securely
      if (!updatedProfile.completedLessons) updatedProfile.completedLessons = [];
      if (!updatedProfile.completedTopics) updatedProfile.completedTopics = [];
      if (!updatedProfile.completedQuizzedTopics) updatedProfile.completedQuizzedTopics = [];
      if (!updatedProfile.completedChallenges) updatedProfile.completedChallenges = [];
      if (!updatedProfile.completedProjects) updatedProfile.completedProjects = [];

      // 1. Lesson Completed Tracker
      if (payload.topicId && !payload.quizCompleted && !payload.isChallenge && !payload.isProject) {
        if (!updatedProfile.completedLessons.includes(payload.topicId)) {
          updatedProfile.completedLessons.push(payload.topicId);
        }
        if (!updatedProfile.completedTopics.includes(payload.topicId)) {
          updatedProfile.completedTopics.push(payload.topicId);
        }
        gainedXP += 20;

        const totalTopicsCount = 15;
        updatedProfile.completionPercentage = Math.round((updatedProfile.completedTopics.length / totalTopicsCount) * 100);
      }

      // 2. Quiz Completed Tracker
      if (payload.quizCompleted && payload.topicId) {
        if (!updatedProfile.completedQuizzedTopics.includes(payload.topicId)) {
          updatedProfile.completedQuizzedTopics.push(payload.topicId);
        }
        gainedXP += 10;

        // Save Score
        const score = payload.quizScore !== undefined ? payload.quizScore : 100;
        updatedProfile.notes = {
          ...updatedProfile.notes,
          [`${payload.topicId}_quiz_score`]: String(score)
        };
      }

      // 3. Challenge Completed Tracker
      if (payload.isChallenge && payload.topicId) {
        if (!updatedProfile.completedChallenges.includes(payload.topicId)) {
          updatedProfile.completedChallenges.push(payload.topicId);
        }
        updatedProfile.consistencyScore = Math.min(100, (updatedProfile.consistencyScore || 0) + 10);
      }

      // 4. Project Completed Tracker
      if (payload.isProject && payload.topicId) {
        if (!updatedProfile.completedProjects.includes(payload.topicId)) {
          updatedProfile.completedProjects.push(payload.topicId);
        }
        if (!updatedProfile.completedLessons.includes(payload.topicId)) {
          updatedProfile.completedLessons.push(payload.topicId);
        }
        if (!updatedProfile.completedTopics.includes(payload.topicId)) {
          updatedProfile.completedTopics.push(payload.topicId);
        }
        gainedXP += 100;

        const totalTopicsCount = 15;
        updatedProfile.completionPercentage = Math.round((updatedProfile.completedTopics.length / totalTopicsCount) * 100);
      }

      if (payload.xpBonus) {
        gainedXP += payload.xpBonus;
      }

      updatedProfile.xp += gainedXP;

      // Level recalculations
      const oldLevel = updatedProfile.level || 1;
      const newLevel = calculateLevel(updatedProfile.xp);
      updatedProfile.level = newLevel;
      updatedProfile.xpToNextLevel = getXpToNextLevel(updatedProfile.xp, newLevel);

      // Write changes
      await syncProfileData(updatedProfile);

      // Sync backend API as backup
      try {
        await fetch('/api/save-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            quizScore: payload.quizScore !== undefined ? payload.quizScore : 100
          })
        });
      } catch (apiErr) {
        console.warn("Express backend sync backup ignored:", apiErr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStreak = async () => {
    if (!profile) return;
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const updatedProfile = {
        ...profile,
        streak: (profile.streak || 0) + 1,
        notes: {
          ...profile.notes,
          last_activity: todayStr
        }
      };
      await syncProfileData(updatedProfile);

      try {
        await fetch('/api/streak', { method: 'POST' });
      } catch (err) {
        console.warn("Rest streak api backup sync warning:", err);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadSnippetIntoSandbox = (code: string, lang: 'html' | 'css' | 'js' | 'react') => {
    setOverridePlaygroundCode(code);
    setOverridePlaygroundLang(lang);
    setActiveTab('playground');
  };

  // Syllabus search filtering helper
  const allFilteredTopics = SECTIONS.flatMap(s => s.topics).filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans antialiased select-none tracking-tight flex transition-all duration-300 bg-[#0A0F1C] text-[#F8FAFC]">
      
      {/* AUTH SCREEN CONTROLLER */}
      {!profile ? (
        <div id="welcome-authentication-container" className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-radial from-[#1A103C] via-[#0A0F1C] to-black min-h-screen">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#06B6D4]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-3xl"></div>
          
          <div className="relative text-center mb-8 space-y-3 max-w-lg z-10 animate-fade-in">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-bold bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/25 uppercase tracking-wider font-mono">
              ⚡ BEGINNER TO EXPERT TRACK
            </span>
            <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-white via-neutral-100 to-[#06B6D4]/45 bg-clip-text text-transparent">
              NewEra
            </h1>
            <p className="text-[10px] uppercase font-mono font-black tracking-widest text-[#7C3AED]">
              AI Powered Learning Universe
            </p>
            <p className="text-[#94A3B8] text-xs sm:text-sm mt-3 leading-relaxed">
              Discover compiler sandboxes, real-time quizzes, FAANG mock simulations, and private AI coding mentors. Login using the credentials <strong className="text-white">demo@gmail.com / demo123</strong> to experience instant authentication.
            </p>
          </div>

          <AuthModal onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : (
        
        /* AUTHENTICATED PLATFORM SIDEBAR & PANELS */
        <div className="flex-1 flex flex-row min-h-screen relative overflow-hidden">
          {/* MOBILE SIDEBAR TRIGGER MENU BAR */}
          <div className="lg:hidden fixed top-3 left-4 z-50 bg-[#111827] text-white p-2.5 rounded-xl border border-[#1E293B] shadow-md">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle side drawer menu selection">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* DUAL MODE COLLAPSIBLE SIDEBAR WITH HOVER EXPANSION */}
          <aside 
            onMouseEnter={() => {
              setSidebarHovered(true);
              setJustCollapsed(false);
            }}
            onMouseLeave={() => {
              setSidebarHovered(false);
              setJustCollapsed(false);
            }}
            className={`fixed lg:sticky top-0 left-0 z-40 bg-[#0A0F1C] border-r border-[#1E293B]/65 h-screen shrink-0 transition-all duration-300 ease-out flex flex-col justify-between select-none ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } ${sidebarIsExpanded ? 'w-64' : 'w-16'}`}
          >
            <div className="p-4 space-y-6 overflow-y-auto flex-1">
              {/* NewEra Premium Logo Badge */}
              <div 
                onClick={() => { setActiveTab('dashboard'); setSelectedTopic(null); }}
                className="flex items-center gap-3 border-b border-[#1E293B]/40 pb-4 cursor-pointer"
              >
                <div className="p-2 bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] text-white rounded-xl shadow-md shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                {sidebarIsExpanded && (
                  <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="leading-none">
                    <h2 className="text-sm font-black tracking-tight text-white uppercase font-display">NewEra</h2>
                    <span className="text-[8px] uppercase tracking-wider font-mono text-[#06B6D4] font-bold">AI Core Space</span>
                  </motion.div>
                )}
              </div>

              {/* Navigation Actions Menu */}
              <div className="space-y-1 select-none">
                {[
                  { id: 'dashboard', label: 'Home Dashboard', icon: Target },
                  { id: 'syllabus', label: 'Curriculum Timeline', icon: BookOpen },
                  { id: 'dsa', label: 'DSA Cosmos Space', icon: Cpu },
                  { id: 'playground', label: 'IDE Sandboxes', icon: Code },
                  { id: 'tutor', label: 'AI Mentorship Coach', icon: MessageSquare },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  const IconComp = item.icon;

                  return (
                    <button 
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setSelectedTopic(null); if(window.innerWidth < 1024) setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3.5 py-2.5 px-3 rounded-lg text-xs font-bold transition duration-150 cursor-pointer ${
                        isActive 
                          ? 'bg-[#1A2234] text-white border border-[#7C3AED]/25 shadow-xs' 
                          : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 shrink-0 transition ${isActive ? 'text-[#06B6D4]' : ''}`} />
                      {sidebarIsExpanded && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                          {item.label}
                        </motion.span>
                      )}
                    </button>
                  );
                })}

                {/* Sidebar visual divider line */}
                <div className="h-px bg-white/5 my-3"></div>

                {/* Redesigned interactive slide options inside dashboard list */}
                {[
                  { key: 'bookmarks', label: 'Bookmarked Sheets', icon: Bookmark, action: () => setShowBookmarks(true) },
                  { key: 'notes', label: 'Stored Summary Notes', icon: FileText, action: () => setShowNotes(true) },
                  { key: 'certificates', label: 'Security Certs', icon: Award, action: () => setShowCertificates(true) },
                  { key: 'growth', label: 'Analytics Growth', icon: Activity, action: () => setActiveTab('growth') },
                ].map((util) => {
                  const Icon = util.icon;
                  return (
                    <button 
                      key={util.key}
                      onClick={util.action}
                      className="w-full flex items-center gap-3.5 py-2.5 px-3 rounded-lg text-xs font-semibold text-[#94A3B8] hover:bg-white/5 hover:text-white transition cursor-pointer"
                    >
                      <Icon className="w-4 h-4 shrink-0 text-gray-500 hover:text-white transition" />
                      {sidebarIsExpanded && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {util.label}
                        </motion.span>
                      )}
                    </button>
                  );
                })}

                {profile.role === 'Admin' && (
                  <button 
                    onClick={() => { setActiveTab('admin'); if(window.innerWidth < 1024) setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3.5 py-2.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition ${
                      activeTab === 'admin' ? 'bg-[#7C3AED]/15 text-white border border-[#7C3AED]/30' : 'text-[#7C3AED] hover:bg-[#7C3AED]/5'
                    }`}
                  >
                    <Shield className="w-4 h-4 shrink-0" />
                    {sidebarIsExpanded && <span className="truncate">Root Admin Shell</span>}
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar Bottom triggers */}
            <div className="p-4 border-t border-white/5 space-y-3">
              <button 
                onClick={() => {
                  const targetState = !sidebarCollapsed;
                  setSidebarCollapsed(targetState);
                  if (targetState) {
                    setJustCollapsed(true);
                  } else {
                    setJustCollapsed(false);
                  }
                }}
                className="w-full hidden lg:flex items-center gap-3.5 py-2 px-3 text-xs font-semibold text-[#94A3B8] hover:text-white cursor-pointer transition"
              >
                <ChevronRight className={`w-4 h-4 transform transition-transform duration-300 ${sidebarIsExpanded ? 'rotate-180' : ''}`} />
                {sidebarIsExpanded && <span>Collapse Sidebar</span>}
              </button>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3.5 py-2.5 px-3 text-left hover:bg-red-500/10 text-red-400 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {sidebarIsExpanded && <span>Logout Account</span>}
              </button>
            </div>
          </aside>

          {/* MAIN PAGE CONTAINER BAR */}
          <main className="flex-1 flex flex-col h-screen overflow-y-auto">
            
            {/* UPPER GLOBAL NAV HEADER BAR (Sticky Wide design) */}
            <header className="sticky top-0 z-[100] h-14 bg-[#0A0F1C]/80 backdrop-blur-md border-b border-[#1E293B]/65 flex items-center justify-between px-6 select-none max-w-full">
              {/* Left search */}
              <div className="relative max-w-xs w-full lg:max-w-sm">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#94A3B8] opacity-60" />
                <input 
                  type="text" 
                  value={searchQuery}
                  aria-label="Smart global platform query finder"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'syllabus') setActiveTab('syllabus');
                  }}
                  placeholder="Ask curriculum, matching HTML, DOM..."
                  className="w-full bg-[#111827] border border-[#1E293B] pl-9 pr-4 py-1.5 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#7C3AED] text-white placeholder-[#94A3B8]/50"
                />
              </div>

              {/* Upper status metrics row */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleUpdateStreak}
                  title="Force increase active streak counter!"
                  className="flex items-center gap-1.5 py-1 px-2.5 bg-[#1A2234] hover:bg-[#1E293B] text-orange-400 border border-white/5 rounded-lg text-xs font-bold font-mono transition cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>{profile.streak} Days</span>
                </button>

                <div className="text-xs font-bold py-1 px-2.5 rounded-lg flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">
                  <span>🏆</span>
                  <span>{profile.xp} XP</span>
                </div>

                {/* Notifications trigger */}
                <div className="relative select-none">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-1.5 bg-[#1A2234] opacity-80 hover:opacity-100 transition rounded-lg text-[#94A3B8] cursor-pointer"
                  >
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EF4444] rounded-full border border-[#0A0F1C]"></span>
                    <Clock className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <div className="absolute right-0 mt-3 w-72 bg-[#1A2234] border border-[#1E293B] rounded-2xl shadow-2xl p-4 space-y-3 z-[1000] text-left">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[9px] font-mono font-bold text-[#06B6D4] uppercase tracking-wider">NOTIFICATIONS</span>
                          <button onClick={() => setShowNotifications(false)} className="text-[10px] text-gray-500 hover:text-white">Dismiss</button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {mockNotifications.map(n => (
                            <div key={n.id} className="p-2 bg-[#111827] rounded-lg border border-white/5 text-[10px] leading-relaxed">
                              <p className="text-white font-medium">{n.text}</p>
                              <span className="text-[8px] text-[#94A3B8]/60 font-mono block mt-0.5">{n.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 border-l border-[#1E293B] pl-4">
                  <div 
                    onClick={() => setActiveTab('growth')}
                    className="w-7 h-7 rounded-lg bg-indigo-950 text-[#06B6D4] font-black font-mono text-xs cursor-pointer flex items-center justify-center border border-white/10 active:scale-95 transition"
                  >
                    {profile.username.substring(0, 1).toUpperCase()}
                  </div>
                </div>
              </div>
            </header>

            {/* Dynamic tabs context switches */}
            <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
              
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Roadmaps quick triggers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setActiveTab('syllabus')}
                      className="p-5 rounded-2xl bg-linear-to-r from-indigo-700 to-indigo-900 text-white flex items-center justify-between text-left group hover:scale-101 transition-all shadow-md cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-white/20 rounded font-semibold text-indigo-200 uppercase">Core Platform Course</span>
                        <h4 className="text-lg font-black mt-2">Active syllabus curriculum classes</h4>
                        <p className="text-xs text-indigo-200 mt-1">20 structured sections covering React, CSS Grids, Node JS, Databases.</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-indigo-300 group-hover:translate-x-1.5 transition" />
                    </button>

                    <button 
                      onClick={() => { setActiveTab('tutor'); }}
                      className="p-5 rounded-2xl bg-linear-to-r from-purple-700 to-purple-950 text-white flex items-center justify-between text-left group hover:scale-101 transition-all shadow-lg cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-white/20 rounded font-semibold text-purple-200 uppercase text-yellow-300">AI Mentor</span>
                        <h4 className="text-lg font-black mt-2 font-sans tracking-tight">Active coaching & custom lessons</h4>
                        <p className="text-xs text-purple-200 mt-1">Chat in natural language, explain compiler errors, receive recommendations.</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-purple-300 group-hover:translate-x-1.5 transition" />
                    </button>
                  </div>

                  <Dashboard 
                    profile={profile} 
                    analytics={{
                      weeklyActivity: [
                        { day: "Mon", hr: 1.2 },
                        { day: "Tue", hr: 1.8 },
                        { day: "Wed", hr: 0.5 },
                        { day: "Thu", hr: 2.2 },
                        { day: "Fri", hr: 1.5 },
                        { day: "Sat", hr: 0.3 },
                        { day: "Sun", hr: 1.3 }
                      ],
                      milestones: [
                        { badgeName: "First Steps", description: "Successfully logged into Academic Platform Portal.", unlocked: true },
                        { badgeName: "CSS Specialist", description: "Completes styling box models or CSS grid rules.", unlocked: profile.completedTopics.some(t => t.includes('css') || t.includes('grid')) },
                        { badgeName: "JavaScript Sorcerer", description: "Completes DOM integrations or variables scopes.", unlocked: profile.completedTopics.some(t => t.includes('js') || t.includes('dom')) },
                        { badgeName: "Professional Suite Maker", description: "Successfully completes structured final code projects.", unlocked: profile.completedTopics.includes('react-hooks') }
                      ]
                    }} 
                    onSelectTopic={(topicId) => {
                      const found = SECTIONS.flatMap(s => s.topics).find(t => t.id === topicId);
                      if (found) {
                        setSelectedTopic(found);
                        setActiveTab('syllabus');
                      }
                    }}
                    onUpdateStreak={handleUpdateStreak}
                  />
                </div>
              )}

              {activeTab === 'syllabus' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Index accordion of course segments */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-neutral-100 dark:bg-radial dark:from-neutral-900/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-850">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-950 dark:text-white">Curriculum Timeline</h4>
                        <p className="text-[11px] text-neutral-500">Search matching results: {allFilteredTopics.length} Units</p>
                      </div>
                      <Network className="w-5 h-5 text-indigo-500 animate-pulse" />
                    </div>

                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                      {SECTIONS.map((sec) => {
                        const isOpen = activeSectionId === sec.id;
                        return (
                          <div key={sec.id} className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-850 shadow-2xs">
                            <button 
                              onClick={() => setActiveSectionId(isOpen ? null : sec.id)}
                              className="w-full flex items-center justify-between text-xs font-black uppercase text-left text-neutral-800 dark:text-neutral-300"
                            >
                              <span className="truncate pr-2">{sec.title}</span>
                              <ChevronDown className={`w-4 h-4 shrink-0 transition ${isOpen ? 'transform rotate-180' : ''}`} />
                            </button>

                            {isOpen && (
                              <div className="mt-3 space-y-1.5 border-t border-neutral-100 dark:border-neutral-850 pt-3">
                                {sec.topics.map((top) => {
                                  const completed = profile.completedTopics.includes(top.id);
                                  const topicIsSelected = selectedTopic?.id === top.id;

                                  return (
                                    <button 
                                      key={top.id}
                                      onClick={() => setSelectedTopic(top)}
                                      className={`w-full text-left p-2.5 rounded-lg text-xs leading-snug font-semibold flex items-center justify-between transition ${topicIsSelected ? 'bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850/40'}`}
                                    >
                                      <span className="truncate pr-3">{top.title}</span>
                                      {completed && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column (2/3): Active Lesson View or Selector */}
                  <div className="lg:col-span-2">
                    {selectedTopic ? (
                      <SyllabusLesson 
                        topic={selectedTopic} 
                        profile={profile}
                        onBookmark={handleBookmark}
                        onSaveProgress={handleSaveProgress}
                        onOpenPlayground={loadSnippetIntoSandbox}
                        onReturnToRoadmap={() => {
                          setJustCompletedTopicId(selectedTopic.id);
                          setSelectedTopic(null);
                        }}
                      />
                    ) : (
                      <div className="space-y-6">
                        <Roadmap 
                          topics={SECTIONS.flatMap(s => s.topics)} 
                          profile={profile} 
                          onSelectTopic={(id) => {
                            const found = SECTIONS.flatMap(s => s.topics).find(t => t.id === id);
                            if (found) setSelectedTopic(found);
                          }}
                          justCompletedTopicId={justCompletedTopicId}
                          onClearJustCompleted={() => setJustCompletedTopicId(null)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'playground' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">Built-In Multi mode IDE Playgrounds</h3>
                    <p className="text-xs text-neutral-500">Develop standard layouts, review output, and write stateful React programs. Changes auto-save securely.</p>
                  </div>

                  <Playground 
                    initialHtml={overridePlaygroundCode && overridePlaygroundLang === 'html' ? overridePlaygroundCode : undefined}
                    initialCss={overridePlaygroundCode && overridePlaygroundLang === 'css' ? overridePlaygroundCode : undefined}
                    initialJs={overridePlaygroundCode && overridePlaygroundLang === 'js' ? overridePlaygroundCode : undefined}
                    initialReact={overridePlaygroundCode && overridePlaygroundLang === 'react' ? overridePlaygroundCode : undefined}
                    initialLanguage={overridePlaygroundLang}
                    onSaveProgress={(xp) => {
                      handleSaveProgress({ topicId: 'editor-sandbox', xpBonus: xp });
                    }}
                    onAskMentor={(code) => {
                      setOverridePlaygroundCode(code);
                      setActiveTab('tutor');
                    }}
                  />
                </div>
              )}

              {activeTab === 'tutor' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">AI Coach Mentorship portal</h3>
                    <p className="text-xs text-neutral-500">Explain custom files line-by-line, diagnostic syntactic exceptions, prepare personalized quiz tasks.</p>
                  </div>

                  <AITutor 
                    activeTopic={selectedTopic?.title || "Fundamentals"} 
                    activeCode={overridePlaygroundCode || undefined}
                    onCodeImport={(code) => {
                      setOverridePlaygroundCode(code);
                      setOverridePlaygroundLang('html');
                      setActiveTab('playground');
                    }}
                  />
                </div>
              )}

              {activeTab === 'interviews' && (
                <InterviewHub questions={INTERVIEW_QUESTIONS} />
              )}

              {activeTab === 'careers' && (
                <CareerHub careerPaths={CAREER_PATHS} />
              )}

              {activeTab === 'dsa' && (
                <DSALearningEcosystem />
              )}

              {activeTab === 'growth' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Glassmorphic growth header */}
                  <div className="p-6 md:p-8 rounded-3xl bg-linear-to-r from-emerald-950 via-neutral-900 to-indigo-950 border border-emerald-500/20 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                          🌱 Absolute Personal Focus Space
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black">Your Digital Learning Command Workspace</h2>
                        <p className="text-xs text-neutral-300 max-w-xl">
                          No scoreboards. No comparative distraction. Real mastery comes from persistent daily habits. You have accumulated <strong className="text-emerald-400 font-bold">{profile.xp} XP</strong> across all topics.
                        </p>
                      </div>

                      {/* Micro stats widgets */}
                      <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                        <div className="text-center font-mono">
                          <p className="text-[9px] uppercase font-bold text-neutral-450 leading-none">Your Level</p>
                          <p className="text-xl font-bold text-white mt-1">Level {profile.level}</p>
                        </div>
                        <div className="w-px bg-white/10 h-8Self" />
                        <div className="text-center font-mono">
                          <p className="text-[9px] uppercase font-bold text-neutral-450 leading-none">Days Active</p>
                          <p className="text-xl font-bold text-emerald-400 mt-1">🔥 {profile.streak} Days</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* High fidelity split panels (Timer & Achievements) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left column: Study Timer & Bookmarks */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* Interactive focus timer block */}
                      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-xs space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-wider text-indigo-650 dark:text-indigo-400 font-mono">Immersive Focus Study Timer</h3>
                            <p className="text-xs text-neutral-500">Enable flow state. Block out notifications and track active coding sessions.</p>
                          </div>
                          <span className="text-xs text-indigo-500 font-mono font-bold">FLOW STATE ACTIVE</span>
                        </div>

                        {/* Interactive local timer container */}
                        <div className="p-6 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-150 dark:border-neutral-850 flex flex-col items-center justify-center space-y-4">
                          <div className="text-center space-y-1">
                            <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-neutral-900 dark:text-white">
                              25:00
                            </span>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-mono">Standard Pomodoro Interval</p>
                          </div>

                          <div className="flex gap-3">
                            <button className="px-5 py-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black transition cursor-pointer">
                              Start Session
                            </button>
                            <button className="px-4 py-1.5 rounded-lg border border-neutral-220 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-bold hover:bg-white dark:hover:bg-neutral-900 transition cursor-pointer">
                              Reset
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Cumulative completed checkpoints */}
                      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-xs space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-wider text-indigo-650 dark:text-indigo-400 font-mono">Curriculum Syllabus Milestones</h3>
                        <p className="text-xs text-neutral-500">Review sections you have completed. Each node is digitally signed to verify credentials.</p>
                        
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Chapter 1: HTML Core Boilerplates</span>
                            <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold px-2 py-0.5 rounded">Verified Completed</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Chapter 2: CSS Flexbox & Coordinate Grids Layouts</span>
                            <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold px-2 py-0.5 rounded">Verified Completed</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 opacity-60">
                            <span className="text-xs font-bold text-neutral-500">Chapter 3: Advanced JS Closure & Promises Unwinding</span>
                            <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 text-neutral-500 font-mono font-bold px-2 py-0.5 rounded">Pending Evaluation</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right column: 3D-like glow achievement cards */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Accomplished Badges collection */}
                      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-xs space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-wider text-indigo-650 dark:text-indigo-400 font-mono">Your Milestones Collection</h3>
                        <p className="text-xs text-neutral-500">Premium unlocked interactive credential badges.</p>

                        <div className="space-y-3 pt-2">
                          {/* Badge 1 */}
                          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden flex items-center gap-3">
                            <span className="text-2xl">🏆</span>
                            <div>
                              <strong className="text-xs font-black text-yellow-905 dark:text-yellow-100">Foundational Master</strong>
                              <p className="text-[10px] text-neutral-550">Completed initial complexity matrix test suite perfectly.</p>
                            </div>
                          </div>

                          {/* Badge 2 */}
                          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex items-center gap-3">
                            <span className="text-2xl">🔥</span>
                            <div>
                              <strong className="text-xs font-black text-indigo-905 dark:text-indigo-400">Consistency Alchemist</strong>
                              <p className="text-[10px] text-neutral-550">Maintained study streak for 7 consecutive days.</p>
                            </div>
                          </div>

                          {/* Badge 3 */}
                          <div className="p-4 rounded-xl border border-neutral-250 dark:border-neutral-800 bg-neutral-100/30 dark:bg-neutral-950/40 opacity-55 flex items-center gap-3">
                            <span className="text-2xl">🛡️</span>
                            <div>
                              <strong className="text-xs font-bold text-neutral-400">FAANG Sentinel Badge</strong>
                              <p className="text-[10px] text-neutral-505">Identify BST balance constraints dynamically (Locked).</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Diagnostic active notes block */}
                      <div className="p-6 rounded-2xl bg-slate-950 text-white border border-neutral-800 shadow-xl space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">Sabbatical Focus Guidelines</h4>
                        <ul className="space-y-2 text-[11px] text-neutral-300 leading-normal list-disc pl-3">
                          <li>Review algorithm parameters thoroughly before compiling code blocks.</li>
                          <li>Ensure recursive Base Case terminals are active first to prevent overflow errors.</li>
                          <li>Apply Floyd&rsquo;s tortoise speeds for cyclic indices to protect system memory.</li>
                        </ul>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {activeTab === 'admin' && (
                <AdminDashboard />
              )}

            </div>
          </main>
        </div>
      )}

      {/* PERSISTENT PORTAL DRAWER OVERLAYS */}
      {profile && (
        <PortalOverlays
          profile={profile}
          SECTIONS={SECTIONS}
          showBookmarks={showBookmarks}
          setShowBookmarks={setShowBookmarks}
          showNotes={showNotes}
          setShowNotes={setShowNotes}
          showCertificates={showCertificates}
          setShowCertificates={setShowCertificates}
          onSelectTopic={(topic) => setSelectedTopic(topic)}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Dynamic Level Up Popup Modal Screen Overlay */}
      <AnimatePresence>
        {levelUpOverlay && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-md w-full bg-linear-to-b from-indigo-950 via-neutral-950 to-neutral-950 border border-cyan-500/30 p-8 rounded-3xl shadow-2xl text-center overflow-hidden"
            >
              {/* Animated particles backing */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                
                {/* Simulated XP burst particles */}
                <div className="absolute top-12 left-12 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-12 right-12 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-500"></div>
                <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-200"></div>
                <div className="absolute bottom-1/3 left-8 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping delay-700"></div>
              </div>

              {/* Sparkling Crown / Level Up Trophy */}
              <div className="relative inline-flex items-center justify-center p-5 bg-gradient-to-tr from-yellow-500 to-amber-400 text-neutral-950 rounded-full shadow-lg mb-6 shadow-yellow-500/20">
                <Sparkles className="w-10 h-10 animate-bounce" />
                <div className="absolute inset-0 rounded-full border-2 border-yellow-300 animate-ping opacity-30"></div>
              </div>

              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-black">// ACADEMIC MASTERY UPGRADED</span>
              <h2 className="text-3xl font-black text-white mt-1 mb-2 bg-linear-to-r from-yellow-300 via-amber-200 to-cyan-200 bg-clip-text text-transparent">
                LEVEL UPGRADE!
              </h2>
              
              <p className="text-neutral-400 text-xs mb-6 px-4">
                You have gained legendary computer science credentials. New concepts and experimental learning sandboxes are unlocked.
              </p>

              {/* Old vs New Level Visual representation */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">CADET LEVEL</span>
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 font-bold font-mono text-xl">
                    Lvl {levelUpOverlay.oldLevel}
                  </div>
                </div>
                
                <div className="h-0.5 w-12 bg-linear-to-r from-neutral-800 via-cyan-500 to-neutral-800 relative">
                  <div className="absolute -top-1 right-5 text-cyan-400">⚡</div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-yellow-400 uppercase font-bold tracking-widest">RANK UP</span>
                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border-2 border-yellow-400 flex items-center justify-center text-yellow-400 font-black font-mono text-2xl shadow-lg shadow-yellow-500/10">
                    Lvl {levelUpOverlay.newLevel}
                  </div>
                </div>
              </div>

              {/* Achievement Award Banner */}
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl mb-6 flex items-center gap-3 text-left">
                <Award className="w-8 h-8 text-yellow-400 shrink-0 fill-yellow-500/10" />
                <div>
                  <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Achievement Secured</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Unlocked level {levelUpOverlay.newLevel} certification and FAANG interview pathways.</p>
                </div>
              </div>

              <button
                onClick={() => setLevelUpOverlay(null)}
                className="w-full py-3 bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black rounded-xl text-xs sm:text-sm tracking-wide transition shadow-xl cursor-pointer"
              >
                Acknowledge & Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
