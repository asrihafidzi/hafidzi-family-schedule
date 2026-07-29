import React, { useState } from 'react';
import { 
  Home, BookOpen, CheckSquare, Calendar, Utensils, Sparkles, Heart 
} from 'lucide-react';
import TodoManager from './TodoManager';
import EventManager from './EventManager';
import MessageBoard from './MessageBoard';
import MenuManager from './MenuManager';
import ScheduleManager from './ScheduleManager';

// Komponen Newsletter / Pengumuman Keluarga yang Bisa Diedit Interaktif
function InteractiveNewsletter() {
  const [newsletterText, setNewsletterText] = useState(() => {
    return localStorage.getItem('family_newsletter') || "✨ Pengumuman penting: Jangan lupa cek jadwal kegiatan keluarga minggu ini ya!";
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(newsletterText);

  const handleSave = () => {
    setNewsletterText(tempText);
    localStorage.setItem('family_newsletter', tempText);
    setIsEditing(false);
  };

  return (
    <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 p-6 rounded-[28px] shadow-lg text-white overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-2">
        <span className="bg-white/25 backdrop-blur-md text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-sm">
          📢 HAFIDZI NEWSLETTER
        </span>
        <button 
          onClick={() => { setIsEditing(!isEditing); setTempText(newsletterText); }}
          className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1 rounded-xl transition border border-white/20 font-medium cursor-pointer"
        >
          {isEditing ? 'Batal' : '✏️ Ubah Info'}
        </button>
      </div>

      {isEditing ? (
        <div className="mt-3 space-y-3">
          <textarea
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            className="w-full p-3 bg-black/20 backdrop-blur-md rounded-2xl text-sm text-white placeholder-pink-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
            rows="3"
            placeholder="Tulis info atau pengumuman baru..."
          />
          <button 
            onClick={handleSave}
            className="w-full py-2 bg-white text-rose-600 font-bold rounded-xl text-sm shadow-md hover:bg-pink-50 transition cursor-pointer"
          >
            Simpan Pengumuman ✨
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-white text-sm font-medium leading-relaxed drop-shadow-sm">
            "{newsletterText}"
          </p>
        </div>
      )}
    </div>
  );
}

export default function HafidziApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState({ name: 'Ibu', avatar: '👩🏻' });

  // Data profil anggota keluarga untuk tombol ganti profil di pojok kanan atas
  const familyProfiles = [
    { name: 'Ibu', avatar: '👩🏻' },
    { name: 'Papa', avatar: '👨🏻' },
    { name: 'Kakak', avatar: '👧🏻' },
    { name: 'Adik', avatar: '👦🏻' }
  ];

  const cycleUser = () => {
    const currentIndex = familyProfiles.findIndex(p => p.name === user.name);
    const nextIndex = (currentIndex + 1) % familyProfiles.length;
    setUser(familyProfiles[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-pink-50/50 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
      
      {/* Header Atas */}
      <header className="px-6 pt-6 pb-2 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-pink-100/50">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-pink-400 uppercase">Hafidzi Hub</span>
          <h1 className="text-xl font-black text-slate-800 capitalize">
            {activeTab === 'home' ? 'Beranda' : 
             activeTab === 'todos' ? 'Tugas' : 
             activeTab === 'events' ? 'Kalender' : 
             activeTab === 'menu' ? 'Menu Masakan' : 'Catatan'}
          </h1>
        </div>

        {/* Tombol Ganti Profil */}
        <button 
          onClick={cycleUser}
          className="flex items-center gap-2 bg-pink-100/70 hover:bg-pink-200/70 px-3 py-1.5 rounded-full transition shadow-sm border border-pink-200 cursor-pointer"
        >
          <span className="text-base">{user.avatar}</span>
          <span className="text-xs font-bold text-slate-700">{user.name}</span>
          <span className="text-xs text-pink-500">🔄</span>
        </button>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 p-5 overflow-y-auto pb-32 space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Kartu Sambutan Ceria Sederhana */}
            <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-6 rounded-[28px] shadow-sm text-white flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 border border-white/30">
                {user.avatar}
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">Halo, {user.name}! ✨</h2>
              </div>
            </div>

            {/* Kotak Newsletter Interaktif Keluarga */}
            <InteractiveNewsletter />

            {/* Papan Pengumuman / Message Board */}
            <MessageBoard currentUser={user} />
          </div>
        )}

        {activeTab === 'todos' && <TodoManager currentUser={user} />}
        {activeTab === 'events' && <EventManager currentUser={user} />}
        {activeTab === 'menu' && <MenuManager currentUser={user} />}
        {activeTab === 'schedule' && <ScheduleManager currentUser={user} />}
      </main>

      {/* Navigasi Menu Bawah */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-pink-100 py-3 px-6 flex justify-around items-center z-30 shadow-lg">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`flex flex-col items-center transition ${activeTab === 'home' ? 'text-pink-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Beranda</span>
        </button>

        <button 
          onClick={() => setActiveTab('todos')} 
          className={`flex flex-col items-center transition ${activeTab === 'todos' ? 'text-pink-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <CheckSquare className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Tugas</span>
        </button>

        <button 
          onClick={() => setActiveTab('menu')} 
          className={`flex flex-col items-center transition ${activeTab === 'menu' ? 'text-pink-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Utensils className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Menu</span>
        </button>

        <button 
          onClick={() => setActiveTab('schedule')} 
          className={`flex flex-col items-center transition ${activeTab === 'schedule' ? 'text-pink-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Catatan</span>
        </button>

        <button 
          onClick={() => setActiveTab('events')} 
          className={`flex flex-col items-center transition ${activeTab === 'events' ? 'text-pink-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Kalender</span>
        </button>
      </nav>

    </div>
  );
}