
import React from 'react';
import { RoomType } from '../types';

interface RoomSelectorProps {
  onSelect: (room: string) => void;
  selectedRoom: string | null;
  isLoading: boolean;
}

const ROOMS: { type: RoomType; icon: string; description: string }[] = [
  { type: 'Kitchen', icon: '🍳', description: 'Production & Resource Management' },
  { type: 'Bathroom', icon: '🚿', description: 'Sanitization & Security Hardening' },
  { type: 'Living Room', icon: '🛋️', description: 'Frontend & UI/UX Presentation' },
  { type: 'Bedroom', icon: '𝌿', description: 'Uptime & Disaster Recovery' },
  { type: 'Garage', icon: '🚗', description: 'Logistics & Version Control' },
  { type: 'Garden', icon: '🌻', description: 'Scalability & Ecosystem Growth' },
  { type: 'Home Office', icon: '💻', description: 'R&D & Knowledge Management' },
  { type: 'Attic', icon: '📦', description: 'Legacy Archives & Cold Storage' },
];

const RoomSelector: React.FC<RoomSelectorProps> = ({ onSelect, selectedRoom, isLoading }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {ROOMS.map((room) => (
        <button
          key={room.type}
          disabled={isLoading}
          onClick={() => onSelect(room.type)}
          className={`group relative p-6 rounded-2xl transition-all duration-300 text-left border overflow-hidden ${
            selectedRoom === room.type 
              ? 'bg-indigo-600/20 border-indigo-500 shadow-xl shadow-indigo-500/10' 
              : 'glass border-white/10 hover:border-indigo-500/50 hover:bg-white/5'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-4xl">{room.icon}</span>
          </div>
          <div className="relative z-10">
            <span className="text-2xl mb-2 block">{room.icon}</span>
            <h3 className={`font-bold text-lg mb-1 ${selectedRoom === room.type ? 'text-indigo-300' : 'text-white'}`}>
              {room.type}
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-tight">
              {room.description}
            </p>
          </div>
          {selectedRoom === room.type && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default RoomSelector;
