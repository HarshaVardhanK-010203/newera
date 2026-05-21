import React, { useState } from 'react';
import { Shield, Sparkles, AlertCircle, ArrowRight, CornerDownRight, Laptop, Linkedin, Github } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

export default function AuthModal({ onAuthSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'verifyOtp'>('login');
  
  // States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("demo@gmail.com"); // Prefill with the demo email to facilitate instant clicks!
  const [password, setPassword] = useState("demo123");
  const [role, setRole] = useState<'Student' | 'Mentor' | 'Admin'>('Student');
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let endpoint = "/api/login";
      let payload: any = { email, password };

      if (authMode === 'register') {
        endpoint = "/api/register";
        payload = { username, email, password, role };
      } else if (authMode === 'forgot') {
        endpoint = "/api/forgot-password";
        payload = { email };
      } else if (authMode === 'verifyOtp') {
        endpoint = "/api/verify-otp";
        payload = { email, otp, newPassword };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        if (authMode === 'login' || authMode === 'register') {
          onAuthSuccess(data.profile);
        } else if (authMode === 'forgot') {
          setSuccessMessage(data.message);
          setAuthMode('verifyOtp');
        } else if (authMode === 'verifyOtp') {
          setSuccessMessage(data.message);
          setAuthMode('login');
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication session could not be established.');
    } finally {
      setLoading(false);
    }
  };

  const executeSocialLogin = (platform: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate successful OAuth sign in
      const mockProfile: UserProfile = {
        username: `Social_${platform}_User`,
        email: `social.${platform}@gmail.com`,
        role: 'Student',
        level: 1,
        xp: 150,
        xpToNextLevel: 850,
        streak: 1,
        weeklyStreak: 1,
        completedTopics: [],
        completedQuizzedTopics: [],
        bookmarks: [],
        completedChallenges: [],
        completedProjects: [],
        timeSpentMinutes: 10,
        consistencyScore: 90,
        projectedCompletionDate: '2026-11-20',
        notes: {}
      };
      onAuthSuccess(mockProfile);
    }, 1000);
  };

  return (
    <div id="auth-panel" className="max-w-md mx-auto p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl backdrop-blur-md animate-fade-in">
      
      {/* Branding Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-500/20">
          <Shield className="w-8 h-8 fill-indigo-500/10 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
          {authMode === 'login' ? 'Welcome to WebDev Academy' : authMode === 'register' ? 'Register New Student' : authMode === 'forgot' ? 'Forgot Password Support' : 'Enter security OPT verification'}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {authMode === 'login' ? 'Sign in to access your dashboard and state tracking' : 'Gain full-stack master certifications today.'}
        </p>
      </div>

      {/* API notifications */}
      {errorMessage && (
        <div className="p-4 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-650 flex gap-2 items-start leading-normal">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-650 flex gap-2 items-start leading-normal">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {authMode === 'register' && (
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Select Student Persona Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Student', 'Mentor', 'Admin'] as const).map((r) => (
                <button 
                  key={r} 
                  type="button" 
                  onClick={() => setRole(r)}
                  className={`py-1.5 rounded-lg border text-xs font-semibold ${role === r ? 'bg-indigo-600/10 border-indigo-500 text-indigo-600' : 'bg-neutral-50 border-neutral-200 text-neutral-500'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {authMode === 'register' && (
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="E.g., HarshaCodex"
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-xl text-neutral-900 dark:text-white"
            />
          </div>
        )}

        {(authMode === 'login' || authMode === 'register' || authMode === 'forgot') && (
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Registered Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-xl text-neutral-900 dark:text-white"
            />
          </div>
        )}

        {(authMode === 'login' || authMode === 'register') && (
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Master Acc Password</label>
              {authMode === 'login' && <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] text-indigo-600 hover:underline">Forgot password?</button>}
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-xl text-neutral-900 dark:text-white"
            />
          </div>
        )}

        {authMode === 'verifyOtp' && (
          <>
            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none font-mono">6-Digit Secure OTP</label>
              <input 
                type="text" 
                required
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="E.g., 123456"
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">New Password</label>
              <input 
                type="password" 
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>
          </>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-450 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {loading ? 'Processing secure protocols...' : authMode === 'login' ? 'Sign In' : authMode === 'register' ? 'Register Account' : authMode === 'forgot' ? 'Send security OTP' : 'Verify & Set Password'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Social credential logs */}
      {authMode === 'login' && (
        <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
          <p className="text-[10px] font-bold text-center text-neutral-400 uppercase tracking-widest">// SECURE SOCIAL DIRECT ENTRY</p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => executeSocialLogin('Google')}
              className="py-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition text-neutral-700 cursor-pointer"
            >
              <Laptop className="w-3.5 h-3.5 text-blue-500" /> Google
            </button>
            <button 
              onClick={() => executeSocialLogin('GitHub')}
              className="py-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition text-neutral-700 cursor-pointer"
            >
              <Github className="w-3.5 h-3.5 text-neutral-900" /> GitHub
            </button>
            <button 
              onClick={() => executeSocialLogin('LinkedIn')}
              className="py-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition text-neutral-700 cursor-pointer"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-700" /> LinkedIn
            </button>
          </div>
        </div>
      )}

      {/* Nav elements */}
      <div className="mt-6 text-center text-xs text-neutral-500">
        {authMode === 'login' ? (
          <p>Don't have an academic profile? <button type="button" onClick={() => setAuthMode('register')} className="font-bold text-indigo-600 hover:underline">Register Now</button></p>
        ) : authMode === 'register' ? (
          <p>Possess standard credentials? <button type="button" onClick={() => setAuthMode('login')} className="font-bold text-indigo-600 hover:underline">Log In</button></p>
        ) : (
          <p>Back to <button type="button" onClick={() => setAuthMode('login')} className="font-bold text-indigo-600 hover:underline">Credentials Access</button></p>
        )}
      </div>

    </div>
  );
}
