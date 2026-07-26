import React, { useState } from 'react';
import { 
  Home, BookOpen, CheckSquare, Calendar, Utensils, Sparkles, Heart 
} from 'lucide-react';
import TodoManager from './TodoManager';
import EventManager from './EventManager';
import MessageBoard from './MessageBoard';
import MenuManager from './MenuManager';
import ScheduleManager from './ScheduleManager';

const FAMILY_MEMBERS = [
  { id: 'ibu', name: 'Ibu', avatar: '👩🏻' },
  { id: 'papa', name: 'Papa', avatar: '👨🏻' },
  { id: 'bella', name: 'Bella', avatar: '👧🏻' },
  { id: 'aca', name: 'Aca', avatar: '👧🏻' },
  { id: 'ciya', name: 'Ciya', avatar: '👶🏻' },
];

export default function HafidziApp() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hafidzi_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('home');

  const handleSelectUser = (member) => {
    setUser(member);
    localStorage.setItem('hafidzi_profile', JSON.stringify(member));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hafidzi_profile');
  };

  // 1. HALAMAN PEMILIHAN PROFIL (Tema Glad2Glow: Pink Soft & Putih Bersih)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fff5f7] flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-[36px] shadow-xl w-full max-w-sm border border-pink-100 text-center space-y-6">
          <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner">
            🌸
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Hafidzi Family Hub</h1>
            <p className="text-slate-400 text-xs mt-1">Pilih profil kamu untuk mulai masuk</p>
          </div>
          
          {/* Tombol Profil Ditata Rapi ke Bawah dengan Jarak Longgar */}
          <div className="space-y-3.5">
            {FAMILY_MEMBERS.map(m => (
              <button 
                key={m.id} 
                onClick={() => handleSelectUser(m)} 
                className="w-full p-4 bg-pink-50/70 hover:bg-pink-100 rounded-2xl border border-pink-100 flex items-center justify-between transition-all active:scale-95 shadow-sm group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">{m.avatar}</span>
                  <span className="font-bold text-slate-700 text-sm">{m.name}</span>
                </div>
                <span className="text-xs text-pink-500 font-semibold group-hover:translate-x-1 transition-transform">
                  Masuk ➔
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. TAMPILAN UTAMA APLIKASI
  return (
    <div className="min-h-screen bg-[#fff5f7] w-full max-w-md mx-auto flex flex-col shadow-2xl border-x border-pink-100 relative font-sans">
      
      {/* Header Aplikasi */}
      <header className="px-6 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center border-b border-pink-100 shadow-sm">
        <div>
          <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Hafidzi Hub</span>
          <h2 className="text-lg font-extrabold text-slate-800 capitalize">{activeTab === 'home' ? 'Beranda' : activeTab}</h2>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 px-3.5 py-1.5 rounded-full border border-pink-200 transition-all shadow-sm"
          title="Ganti Profil"
        >
          <span className="text-sm">{user.avatar}</span>
          <span className="text-xs font-bold text-slate-700">{user.name}</span>
          <span className="text-xs text-pink-400">🔄</span>
        </button>
      </header>

      {/* Konten Utama (Tanpa Foto, Jarak Lega & Warna Ceria) */}
      <main className="flex-1 p-5 overflow-y-auto pb-32 space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Kartu Sambutan Ceria ala Skincare Aesthetic */}
            <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-6 rounded-[28px] shadow-sm text-white flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 border border-white/30">
                {user.avatar}
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">Halo, {user.name}! ✨</h2>
                <p className="text-pink-100 text-xs mt-0.5">Semoga hari ini menyenangkan dan penuh berkah.</p>
              </div>
            </div>

            {/* Papan Pengumuman / Message Board */}
            <MessageBoard currentUser={user} />
          </div>
        )}

        {activeTab === 'schedule' && <ScheduleManager />}
        {activeTab === 'todo' && <TodoManager userId={user.id} />}
        {activeTab === 'event' && <EventManager />}
        {activeTab === 'menu' && <MenuManager />}
      </main>

      {/* Toolbar Navigasi Bawah (Jarak Longgar, Tidak Mepet, Warna Pink Ceria) */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-pink-100 flex justify-around p-3 rounded-t-[28px] z-30 shadow-[0_-5px_20px_rgba(255,182,193,0.2)]">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`p-3 rounded-2xl transition-all flex items-center justify-center ${activeTab === 'home' ? 'text-white bg-pink-400 shadow-md shadow-pink-200 scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-pink-50'}`}
        >
          <Home size={22} />
        </button>
        <button 
          onClick={() => setActiveTab('schedule')} 
          className={`p-3 rounded-2xl transition-all flex items-center justify-center ${activeTab === 'schedule' ? 'text-white bg-pink-400 shadow-md shadow-pink-200 scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-pink-50'}`}
        >
          <BookOpen size={22} />
        </button>
        <button 
          onClick={() => setActiveTab('menu')} 
          className={`p-3 rounded-2xl transition-all flex items-center justify-center ${activeTab === 'menu' ? 'text-white bg-pink-400 shadow-md shadow-pink-200 scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-pink-50'}`}
        >
          <Utensils size={22} />
        </button>
        <button 
          onClick={() => setActiveTab('todo')} 
          className={`p-3 rounded-2xl transition-all flex items-center justify-center ${activeTab === 'todo' ? 'text-white bg-pink-400 shadow-md shadow-pink-200 scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-pink-50'}`}
        >
          <CheckSquare size={22} />
        </button>
        <button 
          onClick={() => setActiveTab('event')} 
          className={`p-3 rounded-2xl transition-all flex items-center justify-center ${activeTab === 'event' ? 'text-white bg-pink-400 shadow-md shadow-pink-200 scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-pink-50'}`}
        >
          <Calendar size={22} />
        </button>
      </nav>
    </div>
  );
}