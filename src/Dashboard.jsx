import React from 'react';
import { Calendar, ShoppingBag, Star } from 'lucide-react';

/**
 * Dashboard menampilkan ringkasan informasi keluarga
 * dan tombol pintasan ke modul lain dengan ukuran yang ramah layar HP.
 */
export default function Dashboard({ onNavigate }) {
  const features = [
    { 
      name: 'Jadwal', 
      icon: Calendar, 
      gradient: 'from-blue-400 to-indigo-500', 
      bgLight: 'bg-blue-50 border-blue-200 text-blue-700',
      path: 'schedule' 
    },
    { 
      name: 'Belanja', 
      icon: ShoppingBag, 
      gradient: 'from-pink-400 to-rose-500', 
      bgLight: 'bg-pink-50 border-pink-200 text-pink-700',
      path: 'shopping' 
    },
    { 
      name: 'Tugas', 
      icon: Star, 
      gradient: 'from-amber-400 to-orange-500', 
      bgLight: 'bg-amber-50 border-amber-200 text-amber-700',
      path: 'tasks' 
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Kartu Sambutan */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-3xl shadow-md text-white">
        <h2 className="text-2xl font-bold mb-1">Halo, Hafidzi Family! 👋</h2>
        <p className="text-purple-100 text-sm sm:text-base">Semoga harimu menyenangkan dan penuh berkah!</p>
      </div>

      {/* Menu / Tombol Pintasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map((item) => {
          const IconComponent = item.icon;
          return (
            <button 
              key={item.name}
              onClick={() => onNavigate(item.path)}
              className={`p-6 rounded-3xl border-2 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 transition-all duration-200 hover:shadow-lg active:scale-95 bg-white ${item.bgLight}`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md`}>
                <IconComponent size={36} />
              </div>
              <div className="text-left sm:text-center flex-1 sm:flex-none">
                <span className="text-xl font-bold block">{item.name}</span>
                <span className="text-xs opacity-75">Kelola menu {item.name.toLowerCase()}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}