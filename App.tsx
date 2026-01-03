
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RoomSelector from './components/RoomSelector';
import MappingDisplay from './components/MappingDisplay';
import { generateRoomMapping } from './services/geminiService';
import { MappingResult } from './types';

const App: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [mapping, setMapping] = useState<MappingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoomSelect = async (room: string) => {
    setLoading(true);
    setSelectedRoom(room);
    setError(null);
    try {
      const result = await generateRoomMapping(room);
      setMapping(result);
    } catch (err) {
      setError("Synchronous link failed. The AI engine encountered a buffer overflow or connection error.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Corporate-Chore</span> Matrix
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Infrastructure maintenance never stops—whether it's scrubbing the floor or refactoring legacy modules. 
            Choose an area of your house to generate a professional engineering equivalent task map.
          </p>
        </section>

        <RoomSelector 
          onSelect={handleRoomSelect} 
          selectedRoom={selectedRoom} 
          isLoading={loading} 
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-400 font-mono text-sm animate-pulse tracking-widest uppercase">
              Compiling Domestic Logic...
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center mb-8">
            <p className="font-semibold">{error}</p>
            <button 
              onClick={() => selectedRoom && handleRoomSelect(selectedRoom)}
              className="mt-2 text-xs underline hover:text-rose-300"
            >
              Retry Protocol
            </button>
          </div>
        )}

        {!loading && mapping && (
          <MappingDisplay data={mapping} />
        )}

        {!loading && !mapping && !error && (
          <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-white/5">
            <div className="mb-4 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Select a system sector (room) to initialize mapping.</p>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-white/5 glass mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            &copy; 2024 Domos2DevOps Engineering. Built for high-availability households.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-xs font-mono uppercase tracking-widest">Documentation</a>
            <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-xs font-mono uppercase tracking-widest">API Status</a>
            <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-xs font-mono uppercase tracking-widest">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
