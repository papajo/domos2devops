
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-6 border-b border-white/10 glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase italic">Domos<span className="text-indigo-400">2</span>DevOps</h1>
            <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Infrastructure Logic Mapper</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
          <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">v1.0.4-stable</span>
          <span className="hidden md:inline text-indigo-500">Node: Gemini-Flash</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
