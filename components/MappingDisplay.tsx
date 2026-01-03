
import React, { useState } from 'react';
import { MappingResult } from '../types';

interface MappingDisplayProps {
  data: MappingResult;
  onRefresh: () => void;
  isCached: boolean;
}

const MappingDisplay: React.FC<MappingDisplayProps> = ({ data, onRefresh, isCached }) => {
  const [viewMode, setViewMode] = useState<'narrative' | 'star'>('narrative');

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'medium': return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'security': return '🛡️';
      case 'maintenance': return '🛠️';
      case 'infrastructure': return '🏗️';
      case 'development': return '⌨️';
      case 'operations': return '⚙️';
      default: return '🔹';
    }
  };

  const downloadSessionData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `domos-devops-${data.roomName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Dynamic Content Section */}
      <div className="relative group">
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('narrative')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === 'narrative' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              Domestic Story
            </button>
            <button 
              onClick={() => setViewMode('star')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'star' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-amber-500/60 hover:bg-amber-500/10'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              STAR Interview Mode
            </button>
          </div>
        </div>

        {viewMode === 'narrative' ? (
          <div className="glass rounded-2xl p-6 border-indigo-500/20 relative overflow-hidden transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 text-indigo-500 opacity-10 group-hover:opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              Operational Narrative
            </h3>
            <p className="text-slate-300 italic leading-relaxed text-lg font-medium relative z-10 whitespace-pre-wrap">
              "{data.story}"
            </p>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 border-amber-500/20 relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-amber-500/5 to-transparent">
            <h3 className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
              Technical Case Study: STAR Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tighter block mb-1"># Situation</span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{data.starResponse.situation}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tighter block mb-1"># Task</span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{data.starResponse.task}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tighter block mb-1"># Action</span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{data.starResponse.action}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tighter block mb-1"># Result</span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{data.starResponse.result}</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
              <span className="text-[10px] mono text-slate-500 uppercase">Interview Rank: Senior Engineer L5+</span>
            </div>
          </div>
        )}
      </div>

      {/* Existing Table UI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-indigo-400">#</span> Deployment Map: {data.roomName}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Schema: Domos-Mapping-v3-STAR
            </span>
            {isCached && (
              <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded uppercase font-bold tracking-tighter">
                Disk Cached
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={downloadSessionData}
            className="flex items-center gap-2 px-4 py-2 glass border-slate-500/30 text-slate-300 hover:bg-white/5 rounded-xl transition-all text-sm font-bold uppercase tracking-tight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button 
            onClick={onRefresh}
            className="group flex items-center gap-2 px-4 py-2 glass border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all text-sm font-bold uppercase tracking-tight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Re-Analyze
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Household Chore (A)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">IT Task Counterpart (B)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Analogy Logic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.mappings.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-white font-semibold text-sm mb-1">{item.householdTask}</span>
                      <span className="text-[10px] text-slate-500 italic uppercase">Household Origin</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs">{getCategoryIcon(item.category)}</span>
                        <span className="text-indigo-300 font-bold text-sm mono">{item.itTask}</span>
                      </div>
                      <span className="text-[10px] text-indigo-500/70 font-mono uppercase">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                      {item.rationale}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MappingDisplay;
