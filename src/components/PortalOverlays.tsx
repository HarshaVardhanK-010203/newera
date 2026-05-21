import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, FileText, Award, X } from 'lucide-react';
import { UserProfile, Topic } from '../types';

interface PortalOverlaysProps {
  profile: UserProfile;
  SECTIONS: any[];
  showBookmarks: boolean;
  setShowBookmarks: (v: boolean) => void;
  showNotes: boolean;
  setShowNotes: (v: boolean) => void;
  showCertificates: boolean;
  setShowCertificates: (v: boolean) => void;
  onSelectTopic: (topic: Topic) => void;
  setActiveTab: (tab: any) => void;
}

export default function PortalOverlays({
  profile,
  SECTIONS,
  showBookmarks,
  setShowBookmarks,
  showNotes,
  setShowNotes,
  showCertificates,
  setShowCertificates,
  onSelectTopic,
  setActiveTab
}: PortalOverlaysProps) {
  
  const allTopics = SECTIONS.flatMap(s => s.topics);

  return (
    <>
      {/* 1. BOOKMARKS DRAWER */}
      <AnimatePresence>
        {showBookmarks && (
          <div className="fixed inset-0 z-[200] flex justify-end bg-black/60 backdrop-blur-xs select-none">
            <div onClick={() => setShowBookmarks(false)} className="absolute inset-0"></div>
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-sm h-full bg-[#111827] border-l border-[#1E293B] shadow-2xl p-6 flex flex-col z-20"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">Bookmarked Topics</h3>
                  <p className="text-[10px] text-[#94A3B8] font-mono">Quick syllabus shortcuts</p>
                </div>
                <button 
                  onClick={() => setShowBookmarks(false)} 
                  className="p-1.5 bg-[#1A2234] hover:bg-white/10 rounded-md text-xs font-bold text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mt-4 space-y-3">
                {profile.bookmarks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#94A3B8] font-mono leading-relaxed space-y-2">
                    <span>[ Bookmark list is empty ]</span>
                    <p className="text-[10px] text-[#94A3B8]/60">Navigate to any syllabus topic and click "Bookmark Unit" to save links.</p>
                  </div>
                ) : (
                  allTopics.filter(t => profile.bookmarks.includes(t.id)).map(topic => (
                    <div 
                      key={topic.id}
                      onClick={() => {
                        onSelectTopic(topic);
                        setActiveTab('syllabus');
                        setShowBookmarks(false);
                      }}
                      className="p-3 bg-[#1A2234] border border-white/5 hover:border-[#7C3AED]/30 rounded-xl cursor-pointer hover:-translate-y-0.5 transition duration-150 text-left group"
                    >
                      <span className="text-[8px] font-mono font-bold text-[#06B6D4] uppercase tracking-wider">{topic.id}</span>
                      <h5 className="text-xs font-bold text-white mt-1 group-hover:text-[#7C3AED] transition">{topic.title}</h5>
                      <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">{topic.explanation}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. STORED NOTES DRAWER */}
      <AnimatePresence>
        {showNotes && (
          <div className="fixed inset-0 z-[200] flex justify-end bg-black/60 backdrop-blur-xs select-none">
            <div onClick={() => setShowNotes(false)} className="absolute inset-0"></div>
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-[#111827] border-l border-[#1E293B] shadow-2xl p-6 flex flex-col z-20"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">Saved Study Notes</h3>
                  <p className="text-[10px] text-[#94A3B8] font-mono">Your custom class summaries</p>
                </div>
                <button 
                  onClick={() => setShowNotes(false)} 
                  className="p-1.5 bg-[#1A2234] hover:bg-white/10 rounded-md text-xs font-bold text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mt-4 space-y-4">
                {Object.keys(profile.notes || {}).filter(key => !key.includes('_quiz') && key !== 'last_activity' && key !== 'dsa_solved_problems').length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#94A3B8] font-mono leading-relaxed space-y-2">
                    <span>[ Study notes index empty ]</span>
                    <p className="text-[10px] text-[#94A3B8]/60">Open any syllabus lecture, select the notes panel, and write concepts to save summaries.</p>
                  </div>
                ) : (
                  allTopics.map(topic => {
                    const noteContent = profile.notes[topic.id];
                    if (!noteContent) return null;

                    return (
                      <div key={topic.id} className="p-4 bg-[#1A2234] border border-white/5 rounded-2xl relative text-left">
                        <span className="text-[8px] font-mono font-semibold text-[#06B6D4] uppercase block tracking-wider">// TOPIC SUMMARY</span>
                        <strong className="text-xs text-white block mt-0.5 leading-tight">{topic.title}</strong>
                        
                        <p className="text-[11px] text-[#94A3B8] mt-2 whitespace-pre-wrap leading-relaxed italic bg-[#0A0F1C] p-3 rounded-xl border border-white/5 select-text">
                          {noteContent}
                        </p>

                        <div className="mt-3 flex gap-2">
                          <button 
                            onClick={() => {
                              onSelectTopic(topic);
                              setActiveTab('syllabus');
                              setShowNotes(false);
                            }}
                            className="text-[10px] font-bold text-[#06B6D4] hover:underline"
                          >
                            Jump to Lesson →
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CERTIFICATES PRO MODAL */}
      <AnimatePresence>
        {showCertificates && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
            <div onClick={() => setShowCertificates(false)} className="absolute inset-0"></div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#111827] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 z-20"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="text-left">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">Verified Credentials</h3>
                  <p className="text-[10px] text-[#94A3B8] font-mono">NewEra Certifications and cryptographically signed accomplishments</p>
                </div>
                <button 
                  onClick={() => setShowCertificates(false)} 
                  className="p-1.5 bg-[#1A2234] hover:bg-white/10 rounded-md text-xs font-bold text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* FE Course Completion Card */}
                {profile.completedTopics.length >= 2 ? (
                  <div className="p-5 rounded-2xl border border-emerald-500/25 bg-[#22C55E]/5 relative overflow-hidden flex flex-col justify-between text-left space-y-3 shadow-lg">
                    <div className="absolute top-2 right-2 p-1 bg-[#22C55E]/15 rounded text-emerald-400 font-mono text-[8px] font-bold uppercase">UNLOCKED</div>
                    <span className="text-3xl">📜</span>
                    <div>
                      <strong className="text-sm font-bold text-white block">Frontend Systems Professional</strong>
                      <p className="text-[10px] text-[#94A3B8] leading-tight mt-1">Syllabus modules for styling box models, reactive rendering, and layout workflows completed verified.</p>
                    </div>
                    <div className="bg-[#0A0F1C] p-2.5 rounded-xl border border-white/5 space-y-1 font-mono text-[8px] text-[#94A3B8]">
                      <p>STUDENT: {profile.username}</p>
                      <p>VERIFICATION: NE-FE-8C37DE7A</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-white/5 bg-[#1A2234] opacity-55 text-left relative flex flex-col justify-between h-48">
                    <div className="absolute top-2 right-2 p-1 bg-white/5 rounded text-gray-500 font-mono text-[8px] font-semibold uppercase">LOCKED</div>
                    <span className="text-3xl">🔒</span>
                    <div>
                      <strong className="text-xs font-bold text-[#94A3B8]">Frontend Systems Professional</strong>
                      <p className="text-[9px] text-gray-500 leading-tight mt-1">Fulfill index units across Curriculum checklist lectures to unlock credential certification.</p>
                    </div>
                  </div>
                )}

                {/* DSA Solution Completion Card */}
                {Object.keys(profile.notes || {}).some(k => k === 'dsa_solved_problems') ? (
                  <div className="p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden flex flex-col justify-between text-left space-y-3 shadow-lg">
                    <div className="absolute top-2 right-2 p-1 bg-yellow-500/15 rounded text-yellow-500 font-mono text-[8px] font-bold uppercase">UNLOCKED</div>
                    <span className="text-3xl">🏅</span>
                    <div>
                      <strong className="text-sm font-bold text-white block">DS&A Complexities Specialist</strong>
                      <p className="text-[10px] text-[#94A3B8] leading-tight mt-1">Verified problem-solving execution across balanced structures and recursive bounds.</p>
                    </div>
                    <div className="bg-[#0A0F1C] p-2.5 rounded-xl border border-white/5 space-y-1 font-mono text-[8px] text-[#94A3B8]">
                      <p>STUDENT: {profile.username}</p>
                      <p>VERIFICATION: NE-DSA-15ABCE90</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-white/5 bg-[#1A2234] opacity-55 text-left relative flex flex-col justify-between h-48">
                    <div className="absolute top-2 right-2 p-1 bg-white/5 rounded text-gray-500 font-mono text-[8px] font-semibold uppercase">LOCKED</div>
                    <span className="text-3xl">🔒</span>
                    <div>
                      <strong className="text-xs font-bold text-[#94A3B8]">DS&A Complexities Specialist</strong>
                      <p className="text-[9px] text-gray-500 leading-tight mt-1">Compile and execute correct outputs on active tasks in Algorithm Space tab to unlock.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
