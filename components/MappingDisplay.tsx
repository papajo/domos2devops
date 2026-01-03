
import React from 'react';
import { MappingResult } from '../types';

interface MappingDisplayProps {
  data: MappingResult;
  onRefresh: () => void;
  isCached: boolean;
}

const MappingDisplay: React.FC<MappingDisplayProps> = ({ data, onRefresh, isCached }) => {
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-indigo-400">#</span> Deployment Map: {data.roomName}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Schema: Domos-Mapping-v1
            </span>
            {isCached && (
              <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded uppercase font-bold tracking-tighter">
                Disk Cached
              </span>
            )}
          </div>
        </div>
        
        <button 
          onClick={onRefresh}
          className="group flex items-center gap-2 px-4 py-2 glass border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all text-sm font-bold uppercase tracking-tight"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Re-Analyze Sector
        </button>
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
