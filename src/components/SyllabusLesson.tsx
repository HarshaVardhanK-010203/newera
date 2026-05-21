import React, { useState, useEffect } from 'react';
import { BookOpen, Bookmark, Save, Sparkles, Check, Play, FileText, AlertTriangle, Eye, Video, HelpCircle, ArrowRight, CornerDownRight, Code, MessageSquare, X } from 'lucide-react';
import { Topic, UserProfile } from '../types';
import GridVisualizer from './GridVisualizer';
import ES6Challenge from './ES6Challenge';
import AICodeExplainer from './AICodeExplainer';
import DeepLearningModule from './DeepLearningModule';

interface SyllabusLessonProps {
  topic: Topic;
  profile: UserProfile;
  onBookmark: (topicId: string) => void;
  onSaveProgress: (payload: { topicId: string; quizCompleted?: boolean; isChallenge?: boolean; isProject?: boolean; xpBonus?: number; quizScore?: number }) => void;
  onOpenPlayground: (code: string, tab: 'html' | 'css' | 'js' | 'react') => void;
}

export default function SyllabusLesson({ topic, profile, onBookmark, onSaveProgress, onOpenPlayground }: SyllabusLessonProps) {
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'practice' | 'videos'>('learn');
  const [isDeepLearningActive, setIsDeepLearningActive] = useState<boolean>(true);
  const [noteText, setNoteText] = useState(profile.notes[topic.id] || "");
  const [isNoteSaving, setIsNoteSaving] = useState(false);
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  useEffect(() => {
    setNoteText(profile.notes[topic.id] || "");
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizSuccess(false);
    setActiveTab('learn');
  }, [topic, profile]);

  const saveNotes = async () => {
    setIsNoteSaving(true);
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: topic.id, noteText })
      });
      profile.notes[topic.id] = noteText;
      setNoteSavedAlert(true);
      setTimeout(() => setNoteSavedAlert(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsNoteSaving(false);
    }
  };

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const submitQuiz = () => {
    if (quizSubmitted) return;
    setQuizSubmitted(true);

    const correctCount = topic.mcqs.filter(q => selectedAnswers[q.id] === q.correctAnswerIndex).length;
    const scoreVal = Math.round((correctCount / topic.mcqs.length) * 100);
    const isAllCorrect = correctCount === topic.mcqs.length;
    setQuizSuccess(isAllCorrect);

    // Call progress tracker
    onSaveProgress({
      topicId: topic.id,
      quizCompleted: true,
      xpBonus: isAllCorrect ? 150 : 50,
      quizScore: scoreVal
    });
  };

  const loadPracticeIntoEditor = () => {
    const defaultPlaygroundTab = topic.id.includes('css') || topic.id.includes('flex') || topic.id.includes('grid') ? 'css' : topic.id.includes('html') ? 'html' : topic.id.includes('react') ? 'react' : 'js';
    onOpenPlayground(topic.practiceTask.startingCode || topic.syntaxRef.example || "", defaultPlaygroundTab);
  };

  const isBookmarked = profile.bookmarks.includes(topic.id);

  return (
    <div id="lesson-page" className="space-y-6 animate-fade-in p-1">
      
      {/* Lesson Header Title banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-semibold px-2.5 py-1 rounded-md">
            Syllabus Unit Master
          </span>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight mt-2">{topic.title}</h2>
          <p className="text-xs text-neutral-500 mt-1 dark:text-neutral-400">Section ID: {topic.sectionId} • Complete sections to boost XP metrics.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => onBookmark(topic.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${isBookmarked ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400' : 'bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100'}`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} /> 
            {isBookmarked ? 'Bookmarked' : 'Bookmark Topic'}
          </button>

          <button 
            onClick={() => onSaveProgress({ topicId: topic.id })}
            disabled={profile.completedTopics.includes(topic.id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 disabled:bg-emerald-600/30 text-white rounded-lg hover:bg-emerald-700 text-xs font-bold transition shadow-md disabled:cursor-not-allowed cursor-pointer"
          >
            <Check className="w-4 h-4" /> 
            {profile.completedTopics.includes(topic.id) ? 'Completed Lesson' : 'Mark Completed (+100 XP)'}
          </button>
        </div>
      </div>

      {/* Classroom Delivery Format Switcher Card */}
      <div id="delivery-format-switcher" className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600">
            <Sparkles className="w-5 h-5 text-indigo-650" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-neutral-950 dark:text-white">Active Classroom Delivery Mode</h4>
            <p className="text-[10px] text-neutral-500">Deep Learning Mode reveals advanced memory mappings, code runtimes, and FAANG criteria.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsDeepLearningActive(!isDeepLearningActive)}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${isDeepLearningActive ? 'bg-indigo-650 text-white font-black shadow-lg shadow-indigo-650/15' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}
        >
          {isDeepLearningActive ? '⚡ DEEP LEARNING MODE: ACTIVE' : '📚 BASIC SYLLABUS TABS'}
        </button>
      </div>

      {isDeepLearningActive ? (
        <DeepLearningModule 
          topic={topic}
          profile={profile}
          onSaveProgress={onSaveProgress}
          onOpenPlayground={onOpenPlayground}
        />
      ) : (
        <>
          {/* Course Area sub navigations */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <button 
          onClick={() => setActiveTab('learn')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'learn' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <BookOpen className="w-4 h-4" /> Explanation & Diagrams
        </button>

        <button 
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'quiz' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <HelpCircle className="w-4 h-4" /> Interactive Quiz (+150 XP)
        </button>

        <button 
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'practice' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <Sparkles className="w-4 h-4" /> Coding Challenges
        </button>

        <button 
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'videos' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <Video className="w-4 h-4" /> YouTube Tutorials
        </button>
      </div>

      {/* Tab Contents: LEARN (Explanation & Diagrams) */}
      {activeTab === 'learn' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* simple description block */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Syllabus Explanation
              </h3>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line select-text">
                {topic.explanation}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <h4 className="text-xs uppercase font-mono text-neutral-500 font-bold mb-1">Why it exists</h4>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-normal">{topic.whyExists}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <h4 className="text-xs uppercase font-mono text-neutral-500 font-bold mb-1">Real world use case</h4>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-normal">{topic.realWorldUse}</p>
                </div>
              </div>
            </div>

            {/* Syntax reference guide */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-600" />
                Syntax Reference Standard
              </h3>

              <div className="space-y-4">
                <div className="bg-neutral-950 text-neutral-200 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800 shadow-inner">
                  <span className="text-cyan-400 text-[10px] font-bold block mb-1 uppercase tracking-wider">// CODE SYNTAX DEPLOY</span>
                  <pre className="select-all">{topic.syntaxRef.syntax}</pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-normal">
                  <div>
                    <h4 className="font-bold text-neutral-800 dark:text-neutral-200">Execution Parameters</h4>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">{topic.syntaxRef.parameters}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800 dark:text-neutral-200 font-mono">Example Output Preview</h4>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">{topic.syntaxRef.output}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs">
                  <h4 className="font-bold text-purple-800 dark:text-purple-400 flex items-center gap-1 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-500" /> Topic Notes
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400">{topic.syntaxRef.notes}</p>
                </div>
              </div>
            </div>

            {/* Visual Line-by-Line AI Explainer Sensei */}
            <AICodeExplainer initialCode={topic.syntaxRef.syntax} activeTopic={topic.title} userXp={profile.xp} />

            {/* Visual Diagrams in ASCII representation */}
            {topic.id === 'css-grid' ? (
              <GridVisualizer />
            ) : topic.visualDiagram ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-xs space-y-3">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  Structural Architecture Maps & Diagrams
                </h3>
                <div className="p-4 bg-neutral-950 text-green-400 rounded-xl font-mono text-xs overflow-x-auto border border-neutral-900">
                  <pre>{topic.visualDiagram}</pre>
                </div>
              </div>
            ) : null}

            {/* Common Mistakes tracker */}
            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/15 shadow-xs space-y-3">
              <h3 className="text-lg font-bold text-red-900 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Critical Common Mistakes to Avoid
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                {topic.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-red-500 select-none">✕</span>
                    <span className="select-text">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Hand Side: personal notes and bookmarks */}
          <div className="space-y-6">
            
            {/* Interactive Notes textarea pad */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
              <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-yellow-500" />
                  My Local Study Notes
                </h3>
                {noteSavedAlert && <span className="text-[10px] text-emerald-500 font-bold font-mono">Saved!</span>}
              </div>
              
              <textarea 
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Write your custom notes, cheatsheets or snippets for this lesson here... Notes save securely to the system database."
                className="w-full h-44 p-3 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-500" 
              />

              <button 
                onClick={saveNotes}
                disabled={isNoteSaving}
                className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-400 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" /> {isNoteSaving ? 'Saving Notes...' : 'Save Notes'}
              </button>
            </div>

            {/* external links resources */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none">Curriculum Resources</h4>
              <div className="space-y-2">
                {topic.externalResources.map((res, i) => (
                  <a 
                    key={i} 
                    href={res.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                  >
                    {res.title} →
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab Contents: QUIZ (Interactive MCQ Session) */}
      {activeTab === 'quiz' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Module Assessment Challenge</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Correct response maps award streak boosters and +150 XP bonus.</p>
            </div>
            {quizSubmitted && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${quizSuccess ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                {quizSuccess ? 'Passed (Perfect Score!)' : 'Assessment Evaluated'}
              </span>
            )}
          </div>

          <div className="space-y-6">
            {topic.mcqs.map((q, qIdx) => (
              <div key={q.id} className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{qIdx + 1}. {q.question}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[q.id] === oIdx;
                    const isCorrect = q.correctAnswerIndex === oIdx;
                    
                    let bgClass = "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50";
                    if (isSelected && !quizSubmitted) {
                      bgClass = "bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-400";
                    } else if (quizSubmitted) {
                      if (isCorrect) bgClass = "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold";
                      else if (isSelected && !isCorrect) bgClass = "bg-red-500/15 border-red-500 text-red-700 dark:text-red-400";
                    }

                    return (
                      <button 
                        key={oIdx}
                        onClick={() => handleSelectOption(q.id, oIdx)}
                        disabled={quizSubmitted}
                        className={`p-3.5 rounded-lg border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${bgClass}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Question Explanation */}
                {quizSubmitted && (
                  <div className="mt-3 p-3 bg-indigo-500/5 text-xs text-neutral-600 dark:text-neutral-400 rounded-lg border border-indigo-500/10 whitespace-pre-wrap">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">Answer Logic:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button 
              onClick={submitQuiz}
              disabled={quizSubmitted || Object.keys(selectedAnswers).length < topic.mcqs.length}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md disabled:cursor-not-allowed cursor-pointer"
            >
              Submit Assessment Answers (+150 XP)
            </button>
          </div>
        </div>
      )}

      {/* Tab Contents: PRACTICE (Tasks & Code Playground trigger links) */}
      {activeTab === 'practice' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            
            {topic.id === 'js-core' ? (
              <ES6Challenge profile={profile} onSaveProgress={onSaveProgress} />
            ) : (
              /* Task Card */
              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-pink-600 bg-pink-100 dark:bg-pink-950/60 border border-pink-100 dark:border-pink-900 px-2 py-1 rounded">Practice Task</span>
                <h3 className="text-lg font-black text-neutral-950 dark:text-white mt-1">Syllabus Practice Task</h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap select-text leading-relaxed p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-150">
                  {topic.practiceTask.instructions}
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={loadPracticeIntoEditor}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Play className="w-4 h-4 fill-current" /> Load in Sandbox Editor
                  </button>
                  <button 
                    onClick={() => onSaveProgress({ topicId: topic.id, isChallenge: true, xpBonus: 200 })}
                    className="px-4 py-2 border border-emerald-500/30 font-bold hover:bg-emerald-500/10 text-emerald-500 rounded-lg text-xs transition"
                  >
                    Verify Solution (+200 XP)
                  </button>
                </div>
              </div>
            )}

            {/* mini challenges */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-purple-600 bg-purple-100 dark:bg-purple-950/60 border border-purple-150 px-2 py-1 rounded">Mini Sandbox Challenge</span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">{topic.miniChallenge.title}</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 select-text leading-relaxed">{topic.miniChallenge.description}</p>
              
              <button 
                onClick={() => onOpenPlayground(topic.miniChallenge.startingCode, 'html')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                Load challenge starting code in sandbox editor <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* Project challenge parameters sidebar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-yellow-600 bg-yellow-100 dark:bg-yellow-950/60 border border-yellow-250 px-2 py-1 rounded">Unified Project Challenge</span>
              <h3 className="text-base font-black text-neutral-950 dark:text-white mt-3">{topic.projectChallenge.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 select-text leading-relaxed">{topic.projectChallenge.description}</p>
            </div>

            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
              <button 
                onClick={() => onOpenPlayground(topic.projectChallenge.startingCode, 'html')}
                className="w-full text-center py-2 bg-linear-to-r from-purple-800 to-indigo-900 text-white font-bold rounded-xl text-xs hover:from-purple-900 shadow-lg cursor-pointer"
              >
                Assemble Project Sandbox
              </button>
              <button 
                onClick={() => onSaveProgress({ topicId: topic.id, isProject: true, xpBonus: 500 })}
                className="w-full text-center py-2 border border-neutral-200 dark:border-neutral-850 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 cursor-pointer"
              >
                Complete Master Project (+500 XP)
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab Contents: VIDEOS (Embedded YouTube guides) */}
      {activeTab === 'videos' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">YouTube Dynamic Video Modules</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Top-vetted industry experts discussing core conceptual models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {topic.youtubeVideos.map((vid, idx) => (
              <div key={idx} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden shadow-xs flex flex-col justify-between">
                
                {/* Embed player */}
                <div className="aspect-video w-full bg-neutral-900">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${vid.videoId}`} 
                    title={vid.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>

                <div className="p-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded font-semibold">{vid.level} Course</span>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-1.5 leading-snug line-clamp-1">{vid.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}

      {/* Persistent Beautiful Floating AI Assistant Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-650 via-indigo-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-black text-xs sm:text-sm rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open AI Tutor Coach"
        >
          <Sparkles className="w-4.5 h-4.5 animate-pulse text-yellow-350 fill-yellow-350" />
          <span>AI Tutor Sensei</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
        </button>
      </div>

      {/* Floating Side Sheet Panel Overlay */}
      {isAISidebarOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
          {/* Backdrop mask */}
          <div 
            className="absolute inset-0 bg-neutral-950/65 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAISidebarOpen(false)}
          />

          {/* Drawer container body */}
          <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 h-full shadow-2xl flex flex-col justify-between animate-slide-in p-6 overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-150 dark:border-neutral-850">
              <div className="flex items-center gap-2">
                <div className="p-1 px-2.5 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-indigo-600 font-mono text-[10px] font-bold">
                  STUDY ASSISTANT ACTIVE
                </div>
              </div>
              <button 
                onClick={() => setIsAISidebarOpen(false)}
                className="p-1.5 rounded-lg text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4">
              <AICodeExplainer 
                initialCode={topic.syntaxRef.syntax} 
                activeTopic={topic.title} 
                userXp={profile.xp} 
              />
            </div>

            <div className="pt-4 border-t border-neutral-150 dark:border-neutral-850 text-center text-[11px] text-neutral-450 font-mono">
              ⚡ Highlight lines above and ask any questions for custom context insights!
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
