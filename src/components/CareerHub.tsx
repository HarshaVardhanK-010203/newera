import React, { useState } from 'react';
import { Award, Briefcase, FileText, Globe, DollarSign, ListTodo, Edit, Download, Eye, Sparkles } from 'lucide-react';
import { CareerPath } from '../types';

interface CareerProps {
  careerPaths: CareerPath[];
}

export default function CareerHub({ careerPaths }: CareerProps) {
  const [activeTab, setActiveTab] = useState<'paths' | 'resume' | 'gigs'>('paths');
  
  // Custom interactive resume builder fields
  const [resName, setResName] = useState("Harsha Vardhan");
  const [resTitle, setResTitle] = useState("Full Stack Web Developer");
  const [resEmail, setResEmail] = useState("harshavardhanhv119@gmail.com");
  const [resSkills, setResSkills] = useState("React, Node.js, Express, TailwindCSS, MongoDB, JavaScript ES6");
  const [resExp, setResExp] = useState("Developing stateful learning platform integrations, structuring server routes, and compiling interactive live coding playgrounds.");

  const [resumeMode, setResumeMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div id="career-hub" className="space-y-8 animate-fade-in p-1">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-teal-900 to-indigo-900 border border-teal-500/20 shadow-xl text-white">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/20 text-teal-300 border border-teal-400/30">
          💼 Professional Acceleration Suite
        </span>
        <h2 className="text-2xl font-black mt-2">Executive Portfolio & Professional Builder Services</h2>
        <p className="text-xs sm:text-sm text-neutral-300 mt-1">Export resumes, view remote gigs roadmaps, select salary paths, and polish LinkedIn credentials.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <button 
          onClick={() => setActiveTab('paths')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'paths' ? 'border-teal-600 text-teal-600 dark:text-teal-400' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <DollarSign className="w-4 h-4" /> Career Roads & Salary Roadmaps
        </button>

        <button 
          onClick={() => setActiveTab('resume')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'resume' ? 'border-teal-600 text-teal-600 dark:text-teal-400' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <FileText className="w-4 h-4" /> Executive Resume Architect
        </button>

        <button 
          onClick={() => setActiveTab('gigs')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'gigs' ? 'border-teal-600 text-teal-600 dark:text-teal-400' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <Globe className="w-4 h-4" /> Freelancing & Jobs Hub
        </button>
      </div>

      {/* Tab: Career path metrics */}
      {activeTab === 'paths' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {careerPaths.map((c) => (
            <div key={c.id} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl">
                  <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-teal-500" />
                    {c.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">{c.salaryRange}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">{c.description}</p>
                
                <div className="mt-4 pt-4 border-t border-neutral-150">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Core Tech Stacks</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {c.keySkills.map((sk, idx) => (
                      <span key={idx} className="text-[10px] bg-neutral-100 dark:bg-neutral-950 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 font-mono text-neutral-600 dark:text-neutral-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Milestone Path Checklist</h4>
                <ol className="space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                  {c.timeline.map((line, idx) => (
                    <li key={idx} className="flex gap-1">
                      <span className="text-teal-500 font-bold">{idx + 1}.</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: resume builder */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Edit Mode inputs */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Edit className="w-4 h-4 text-teal-600" /> Resume Metadata Inputs
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Developer Name</label>
                <input type="text" value={resName} onChange={e => setResName(e.target.value)} className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2 rounded-xl text-neutral-900 dark:text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Target Role Title</label>
                <input type="text" value={resTitle} onChange={e => setResTitle(e.target.value)} className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2 rounded-xl text-neutral-900 dark:text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Public Contact Email</label>
                <input type="text" value={resEmail} onChange={e => setResEmail(e.target.value)} className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2 rounded-xl text-neutral-900 dark:text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Core Stack Skills (comma separated)</label>
                <input type="text" value={resSkills} onChange={e => setResSkills(e.target.value)} className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2 rounded-xl text-neutral-900 dark:text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Core Experience Narrative</label>
                <textarea value={resExp} onChange={e => setResExp(e.target.value)} className="w-full h-32 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2 rounded-xl text-neutral-900 dark:text-white" />
              </div>
            </div>

            <div className="flex gap-2 font-semibold">
              <button onClick={() => setResumeMode('preview')} className="flex-1 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs text-center cursor-pointer">Preview Resume</button>
              <button onClick={() => setResumeMode('edit')} className="py-2 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs">Edit Layout</button>
            </div>
          </div>

          {/* Preview panel printable form */}
          <div className="lg:col-span-2 p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden min-h-[500px] flex flex-col justify-between">
            <div className="bg-white text-black p-8 rounded-xl shadow-md border border-neutral-100 flex-1 select-text">
              <div className="border-b border-neutral-200 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-neutral-900">{resName}</h2>
                  <p className="text-sm font-semibold text-teal-600 font-mono">{resTitle}</p>
                </div>
                <span className="text-xs text-neutral-500 font-mono">{resEmail}</span>
              </div>

              <div className="my-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">// PROFESSIONAL STACK SUMMARY</h3>
                <p className="text-xs text-neutral-500 leading-normal font-mono">{resSkills}</p>
              </div>

              <div className="my-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">// EXPERIENCE TIMELINE</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <strong className="text-neutral-850 font-bold">WebDev Academy Academic Graduate</strong>
                    <span className="text-neutral-450 font-mono">Present</span>
                  </div>
                  <p className="text-neutral-650 leading-relaxed italic">{resExp}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-dashed border-neutral-200 pt-4 text-[10px] text-center text-neutral-400">
                Generated via DevAcad Executive Career Architect • Print (Ctrl+P) to compile PDF backups securely.
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:bg-black text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Print / Export PDF
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab: remote gigs matching */}
      {activeTab === 'gigs' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 dark:border-neutral-850 pb-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500 animate-pulse" />
              DevAcad Career matching: Remote internships & freelancing gigs
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Mock junior postings that fit your current learning level automatically.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded font-bold">Remote Position</span>
              <h4 className="font-bold text-neutral-900 dark:text-white">Junior React/Tailwind Frontend Intern</h4>
              <p className="text-xs text-neutral-500">Duration: 3 Months • Compensation: $2500 / month • Stack requested: React ES6 hooks, Responsive CSS grids, Git flows.</p>
              <button className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-xs text-white" onClick={() => alert("Simulated: Application drafted using DevAcad portfolio credentials!")}>Apply Intern</button>
            </div>

            <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded font-bold">Freelance Gig</span>
              <h4 className="font-bold text-neutral-900 dark:text-white">Custom landing site using Tailwind CSS</h4>
              <p className="text-xs text-neutral-500">Compensation: $800 fixed fee • Timeline: 10 Days • Stack requested: Clean HTML boilerplate, responsive design, typography visual hierarchies.</p>
              <button className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-xs text-white" onClick={() => alert("Simulated: Pitch sent including live CSS Grid pricing card sandbox attachments!")}>Apply Proposal</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
