import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, CheckSquare, Calendar, Utensils, Sparkles, Heart 
} from 'lucide-react';
import TodoManager from './TodoManager';
import EventManager from './EventManager';
import MessageBoard from './MessageBoard';
import MenuManager from './MenuManager';
import ScheduleManager from './ScheduleManager';

const FAMILY_MEMBERS = [
  { id: 'ibu', name: 'Ibu', avatar: '👩🏻', color: '#ff75a0' },
  { id: 'papa', name: 'Papa', avatar: '👨🏻', color: '#70a1ff' },
  { id: 'bella', name: 'Bella', avatar: '👧🏻', color: '#ffaf40' },
  { id: 'aca', name: 'Aca', avatar: '👧🏻', color: '#ff6b81' },
  { id: 'ciya', name: 'Ciya', avatar: '👶🏻', color: '#7bed9f' },
];

export default function HafidziApp() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hafidzi_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('home');

  // State untuk slide foto di halaman utama
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const familyPhotos = [
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1609243173916-2df6e410b0fb?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % familyPhotos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [familyPhotos.length]);

  const handleSelectUser = (member) => {
    setUser(member);
    localStorage.setItem('hafidzi_profile', JSON.stringify(member));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hafidzi_profile');
  };

  // HALAMAN PEMILIHAN PROFIL (Awal Masuk)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fff5f7] flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-[32px] shadow-xl w-full max-w-md border border-pink-100 text-center">
          <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-inner">
            🌸
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Hafidzi Family Hub</h1>
          <p className="text-slate-400 mb-6 text-xs">Pilih profil kamu untuk mulai masuk</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {FAMILY_MEMBERS.map(m => (
              <button 
                key={m.id} 
                onClick={() => handleSelectUser(m)} 
                className="p-4 bg-pink-50/50 hover:bg-pink-100/60 rounded-2xl border border-pink-100 flex items-center gap-3 transition-all active:scale-95 text-left shadow-sm"
              >
                <span className="text-3xl">{m.avatar}</span>
                <div>
                  <span className="font-bold text-slate-700 block text-sm">{m.name}</span>
                  <span className="text-[10px] text-pink-400 font-medium">Masuk Profil</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN UTAMA APLIKASI
  return (
    <div className="min-h-screen bg-[#fff5f7] w-full max-w-md mx-auto flex flex-col shadow-2xl border-x border-pink-100 relative font-sans">
      
      {/* Header Aplikasi */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center border-b border-pink-100">
        <div>
          <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest">Hafidzi Hub</span>
          <h2 className="text-lg font-black text-slate-800 capitalize">{activeTab === 'home' ? 'Beranda' : activeTab}</h2>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full border border-pink-200 transition-all shadow-sm"
          title="Ganti Profil"
        >
          <span className="text-sm">{user.avatar}</span>
          <span className="text-xs font-bold text-slate-700">{user.name}</span>
          <span className="text-xs text-pink-400">🔄</span>
        </button>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 p-5 overflow-y-auto pb-32 space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Slide Foto Estetik */}
            <div className="relative w-full h-52 rounded-[28px] overflow-hidden shadow-md border-4 border-white bg-white">
              {familyPhotos.map((photo, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentPhoto ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                >
                  <img src={photo} alt="Keluarga" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white font-semibold text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/30">
                      <Sparkles size={12} className="text-pink-200" /> Hafidzi Family Moments
                    </span>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
                {familyPhotos.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentPhoto ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                  />
                ))}
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

      {/* Toolbar Navigasi Bawah (Jarak longgar, tidak mepet, estetik) */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-pink-100 flex justify-around p-3 rounded-t-[28px] z-30 shadow-[0_-5px_20px_rgba(255,182,193,0.2)]">
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