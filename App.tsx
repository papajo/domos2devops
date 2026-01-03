
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import RoomSelector from './components/RoomSelector';
import MappingDisplay from './components/MappingDisplay';
import { generateMapping } from './services/geminiService';
import { MappingResult } from './types';

const STORAGE_KEY = 'domos_devops_cache_v2';
const LAST_ROOM_KEY = 'domos_devops_last_room_v2';

const App: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [mapping, setMapping] = useState<MappingResult | null>(null);
  const [cache, setCache] = useState<Record<string, MappingResult>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom Input States
  const [customIdea, setCustomIdea] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedCache = localStorage.getItem(STORAGE_KEY);
    const lastRoom = localStorage.getItem(LAST_ROOM_KEY);
    
    if (savedCache) {
      try {
        const parsedCache = JSON.parse(savedCache);
        setCache(parsedCache);
        
        if (lastRoom && parsedCache[lastRoom]) {
          setSelectedRoom(lastRoom);
          setMapping(parsedCache[lastRoom]);
        }
      } catch (e) {
        console.error("Failed to load cache", e);
      }
    }
  }, []);

  // Persist cache and last room
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  }, [cache]);

  useEffect(() => {
    if (selectedRoom) {
      localStorage.setItem(LAST_ROOM_KEY, selectedRoom);
    }
  }, [selectedRoom]);

  const runMapping = async (input: { room?: string; customIdea?: string; imageData?: { data: string; mimeType: string } }, forceRefresh = false) => {
    const key = input.room || input.customIdea || "last_image_upload";
    
    setError(null);

    // Cache check for standard rooms
    if (!forceRefresh && input.room && cache[input.room]) {
      setSelectedRoom(input.room);
      setMapping(cache[input.room]);
      return;
    }

    setLoading(true);
    if (input.room) setSelectedRoom(input.room);

    try {
      const result = await generateMapping(input);
      setMapping(result);
      if (input.room) {
        setCache(prev => ({ ...prev, [input.room!]: result }));
      } else if (input.customIdea) {
        setCache(prev => ({ ...prev, [input.customIdea!]: result }));
        setSelectedRoom(input.customIdea);
      }
    } catch (err) {
      setError("Synchronous link failed. The AI engine encountered a buffer overflow or connection error.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      runMapping({ 
        imageData: { 
          data: base64Data, 
          mimeType: file.type 
        } 
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRefresh = () => {
    if (selectedRoom) {
      runMapping({ room: selectedRoom }, true);
    }
  };

  const clearCache = () => {
    setCache({});
    setMapping(null);
    setSelectedRoom(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_ROOM_KEY);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Corporate-Chore</span> Matrix
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Infrastructure maintenance never stops—whether it's scrubbing the floor or refactoring legacy modules. 
            Select a room, describe a scenario, or upload a photo to generate your mapping.
          </p>
        </section>

        {/* Custom Input & Image Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="glass p-4 rounded-2xl flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Custom Infrastructure Idea</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                placeholder="e.g., Backyard BBQ, Wine Cellar, Dog House..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
              <button 
                onClick={() => customIdea && runMapping({ customIdea })}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-white font-bold text-sm transition-colors"
              >
                Map
              </button>
            </div>
          </div>
          
          <div className="glass p-4 rounded-2xl flex flex-col gap-3 justify-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Visual Audit (Image Analysis)</label>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 border border-dashed border-white/20 hover:border-indigo-500/50 hover:bg-white/5 rounded-xl py-2 px-4 transition-all text-sm text-slate-400 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Photo for Analysis
            </button>
          </div>
        </div>

        <RoomSelector 
          onSelect={(room) => runMapping({ room })} 
          selectedRoom={selectedRoom} 
          isLoading={loading} 
        />

        <div className="flex justify-between items-center mb-6">
          <p className="text-[10px] text-slate-500 italic max-w-sm">
            Persistence: Data is stored in your browser's <span className="text-indigo-400 font-mono">localStorage</span>. 
            It persists across sessions on this device. For multi-device sync, use the "Export" feature.
          </p>
          {Object.keys(cache).length > 0 && (
            <button 
              onClick={clearCache}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-rose-400 transition-colors"
            >
              Flush Local Cache
            </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-400 font-mono text-sm animate-pulse tracking-widest uppercase">
              Executing Mapping Logic...
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center mb-8">
            <p className="font-semibold">{error}</p>
            <button 
              onClick={() => selectedRoom && runMapping({ room: selectedRoom })}
              className="mt-2 text-xs underline hover:text-rose-300"
            >
              Retry Protocol
            </button>
          </div>
        )}

        {!loading && mapping && (
          <MappingDisplay 
            data={mapping} 
            onRefresh={handleRefresh}
            isCached={!!cache[mapping.roomName]} 
          />
        )}

        {!loading && !mapping && !error && (
          <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-white/5">
            <div className="mb-4 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Select a system sector, upload a scan, or define a custom domain.</p>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-white/5 glass mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            &copy; 2024 Domos2DevOps Engineering. Built for high-availability households.
          </p>
          <div className="flex gap-6">
            <span className="text-indigo-500 text-[10px] font-mono uppercase tracking-widest border border-indigo-500/20 px-2 py-1 rounded">LocalStorage Storage Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
