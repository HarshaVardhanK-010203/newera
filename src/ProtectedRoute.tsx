import React from 'react';
import { useAuth } from './AuthContext';
import AuthModal from './components/AuthModal';
import { Cpu, Terminal, Sparkles, Orbit } from 'lucide-react';
import { motion } from 'motion/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, loginEmailPassword } = useAuth();

  // Futuristic orbital loader with progress mechanics and tips
  if (loading) {
    return (
      <div id="immersive-loader" className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center text-white overflow-hidden z-50">
        
        {/* Glowing background meshes */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

        {/* 3D-Like Orbit Assitant Loader */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-4 border-2 border-indigo-500/30 rounded-full"
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-8 border border-cyan-500/40 rounded-full"
          />
          
          {/* Orbital Satellite Node */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="z-10 w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400"
          >
            <Cpu className="w-8 h-8 text-white animate-pulse" />
          </motion.div>

          <div className="absolute top-0 left-12 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-glow" />
          <div className="absolute bottom-6 right-3 w-4 h-4 rounded-full bg-indigo-400 shadow-glow" />
        </div>

        {/* AI Academy assist text and status lines */}
        <div className="text-center mt-8 space-y-3 px-6 max-w-sm z-10">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <h4 className="text-sm font-black tracking-widest text-indigo-300 uppercase font-mono">Quantum Login Gateway</h4>
          </div>
          <p className="text-xs text-neutral-400 font-medium leading-relaxed">
            "Connecting your neural node to Firestore cloud arrays. Verified certificates unlocking momentarily."
          </p>

          {/* Tips loop */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-neutral-500 font-mono" />
            <p className="text-[10px] text-neutral-500 font-bold font-mono">
              TIP: Deep Learning Mode maps live FAANG interview rubrics!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, render registration portal beautifully
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Floating planet elements */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8 rounded-full bg-amber-500 shadow-[0_0_20px_#f59e0b] opacity-20 animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-10 w-12 h-12 rounded-full bg-indigo-500 shadow-[0_0_30px_#6366f1] opacity-25 animate-pulse" />

        <div className="z-10 w-full max-w-md">
          <AuthModal onAuthSuccess={() => {}} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
