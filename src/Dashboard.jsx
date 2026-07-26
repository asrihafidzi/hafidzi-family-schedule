import React from 'react';
import { Calendar, ShoppingBag, Star } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const features = [
    { 
      name: 'Jadwal', 
      icon: Calendar, 
      gradient: 'from-violet-500 to-purple-600', 
      bgCard: 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 text-violet-900',
      align: 'text-left', // Estetik: Rata kiri
      path: 'schedule' 
    },
    { 
      name: 'Belanja', 
      icon: ShoppingBag, 
      gradient: 'from-pink-500 to-rose-600', 
      bgCard: 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 text-rose-900',
      align: 'text-right', // Estetik: Rata kanan
      path: 'shopping' 
    },
    { 
      name: 'Tugas', 
      icon: Star, 
      gradient: 'from-amber-500 to-orange-600', 
      bgCard: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 text-amber-900',
      align: 'text-center', // Estetik: Di tengah
      path: 'tasks' 
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Kartu Sambutan dengan Warna Baru */}
      <div className="bg-gradient-to-r from-slate-900 to-purple-950 p-6 rounded-3xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-1">Halo, Hafidzi Family! 👋</h2>
        <p className="text-purple-200 text-sm">Pilih menu di bawah untuk mulai mengelola aktivitas.</p>
      </div>

      {/* Menu / Tombol Pintasan dengan Posisi Teks Bervariasi */}
      <div className="grid grid-cols-1 gap-4">
        {features.map((item) => {
          const IconComponent = item.icon;
          return (
            <button 
              key={item.name}
              onClick={() => onNavigate(item.path)}
              className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all duration-200 hover:shadow-md active:scale-95 ${item.bgCard}`}
            >
              {/* Jika ingin ikon di kiri dan teks menyesuaikan */}
              <div className={`flex items-center gap-4 w-full ${item.align === 'text-right' ? 'flex-row-reverse justify-between' : item.align === 'text-center' ? 'flex-col sm:flex-row justify-center text-center' : 'justify-start'}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md shrink-0`}>
                  <IconComponent size={35} />
                </div>
                <div className={item.align}>
                  <span className="text-xl font-extrabold block">{item.name}</span>
                  <span className="text-xs opacity-75">Buka menu {item.name.toLowerCase()} keluarga</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}