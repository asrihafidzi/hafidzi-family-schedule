import React from 'react';
import { Calendar, ShoppingBag, BookOpen, Star } from 'lucide-react';

/**
 * Dashboard menampilkan ringkasan informasi keluarga
 * dan tombol pintasan ke modul lain.
 */
export default function Dashboard({ onNavigate }) {
  const features = [
    { name: 'Jadwal', icon: Calendar, color: 'bg-blue-50', path: 'schedule' },
    { name: 'Belanja', icon: ShoppingBag, color: 'bg-pink-50', path: 'shopping' },
    { name: 'Tugas', icon: Star, color: 'bg-yellow-50', path: 'tasks' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Halo! 👋</h2>
        <p className="text-slate-500">Semoga harimu menyenangkan!</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {features.map((item) => (
          <button 
            key={item.name}
            onClick={() => onNavigate(item.path === 'tasks' ? 'tasks' : 'dashboard')}
            className={`${item.color} p-6 rounded-3xl flex flex-col items-center gap-3 transition-transform hover:scale-105`}
          >
            <item.icon size={32} className="text-slate-700" />
            <span className="font-bold text-slate-700">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}