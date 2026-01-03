
import React from 'react';
import { MappingResult } from '../types';

interface MappingDisplayProps {
  data: MappingResult;
}

const MappingDisplay: React.FC<MappingDisplayProps> = ({ data }) => {
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
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-indigo-400">#</span> Deployment Map: {data.roomName}
        </h2>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Schema: Domos-Mapping-v1
        </span>
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
