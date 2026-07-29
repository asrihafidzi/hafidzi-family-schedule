import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, CheckSquare, Calendar, Utensils, Moon, LogOut, Lock, X 
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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hafidzi_current_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { return null; }
    }
    return null;
  });

  // State untuk Modal PIN Orang Tua
  const [showPinModal, setShowPinModal] = useState(false);
  const [targetParent, setTargetParent] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // PIN Rahasia Orang Tua (Bisa diubah sesuka hati di sini, misal: '1234')
  const PARENT_PIN = '1234';

  // State untuk Jadwal Sholat Realtime
  const [nextPrayer, setNextPrayer] = useState({ name: 'Memuat...', time: '--:--' });
  const cityName = 'Bandung';

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
        
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=Bandung&country=Indonesia&method=2`);
        const data = await response.json();
        
        if (data && data.data) {
          const timings = data.data.timings;
          const prayers = [
            { key: 'Fajr', label: 'SUBUH', time: timings.Fajr },
            { key: 'Dhuhr', label: 'DZUHUR', time: timings.Dhuhr },
            { key: 'Asr', label: 'ASHAR', time: timings.Asr },
            { key: 'Maghrib', label: 'MAGHRIB', time: timings.Maghrib },
            { key: 'Isha', label: 'ISYA', time: timings.Isha }
          ];

          const now = new Date();
          const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

          let upcoming = prayers.find(p => p.time > currentTimeStr);
          if (!upcoming) {
            upcoming = prayers[0]; 
            upcoming.label = 'SUBUH (Besok)';
          }

          setNextPrayer({ name: upcoming.label, time: upcoming.time });
        }
      } catch (error) {
        setNextPrayer({ name: 'SUBUH', time: '04:40' });
      }
    };

    fetchPrayerTimes();
  }, []);

  // Data profil anggota keluarga
  const familyProfiles = [
    { name: 'Asri', avatar: '👩🏻', isParent: true },
    { name: 'Rezqi', avatar: '👨🏻', isParent: true },
    { name: 'Bebe', avatar: '👧🏻', isParent: false },
    { name: 'Aca', avatar: '👧🏻', isParent: false },
    { name: 'Ciya', avatar: '👧🏻', isParent: false }
  ];

  const handleSelectUser = (profile) => {
    if (profile.isParent) {
      // Jika yang dipilih profil orang tua, munculkan modal PIN
      setTargetParent(profile);
      setPinInput('');
      setPinError(false);
      setShowPinModal(true);
    } else {
      // Jika anak-anak, langsung masuk tanpa PIN
      setUser(profile);
      localStorage.setItem('hafidzi_current_user', JSON.stringify(profile));
    }
  };

  const verifyPin = (e) => {
    e.preventDefault();
    if (pinInput === PARENT_PIN) {
      setUser(targetParent);
      localStorage.setItem('hafidzi_current_user', JSON.stringify(targetParent));
      setShowPinModal(false);
      setTargetParent(null);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hafidzi_current_user');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 flex flex-col justify-center items-center p-6 max-w-md mx-auto font-sans shadow-2xl relative">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-[32px] shadow-xl w-full text-center border border-pink-200 space-y-6">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-pink-400 uppercase">Hafidzi Hub</span>
            <h1 className="text-2xl font-black text-slate-800 mt-1">Halo, Siapa Kamu? 👋</h1>
            <p className="text-xs text-slate-500 mt-1">Pilih profilmu untuk masuk ke aplikasi!</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {familyProfiles.map((profile) => (
              <button
                key={profile.name}
                onClick={() => handleSelectUser(profile)}
                className="flex items-center justify-between p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-all shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl bg-white p-2 rounded-xl shadow-sm">{profile.avatar}</span>
                  <div>
                    <span className="font-bold text-slate-800 block text-base">{profile.name}</span>
                    <span className="text-xs text-pink-600 font-medium">
                      {profile.isParent ? '🔒 Akses Orang Tua' : 'Masuk sebagai ' + profile.name}
                    </span>
                  </div>
                </div>
                {profile.isParent && <Lock size={16} className="text-pink-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Masukkan PIN Orang Tua */}
        {showPinModal && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[32px] p-6 w-full max-w-xs shadow-2xl space-y-4 border border-pink-100 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">Verifikasi PIN</span>
                <button 
                  onClick={() => setShowPinModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                  <Lock size={22} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Masuk as {targetParent?.name}</h3>
                <p className="text-xs text-slate-400">Masukkan 4 digit PIN rahasia orang tua.</p>
              </div>

              <form onSubmit={verifyPin} className="space-y-3">
                <input 
                  type="password"
                  maxLength="4"
                  placeholder="• • • •"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  autoFocus
                  className="w-full text-center tracking-[1em] text-lg py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 font-bold"
                />

                {pinError && (
                  <p className="text-center text-xs text-red-500 font-medium">PIN salah! Coba lagi ya.</p>
                )}

                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold rounded-2xl shadow-md hover:from-pink-500 hover:to-rose-500 transition cursor-pointer text-sm"
                >
                  Buka Kunci 🔓
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

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

        <button 
          onClick={handleLogout}
          title="Ganti Profil"
          className="flex items-center gap-2 bg-pink-100/70 hover:bg-rose-100 px-3 py-1.5 rounded-full transition shadow-sm border border-pink-200 cursor-pointer text-slate-700 hover:text-rose-600"
        >
          <span className="text-base">{user.avatar}</span>
          <span className="text-xs font-bold">{user.name}</span>
          <LogOut size={14} className="text-pink-500 ml-0.5" />
        </button>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 p-5 overflow-y-auto pb-32 space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-[28px] shadow-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner shrink-0 border border-white/30">
                  <Moon size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-pink-100 block">
                    Jadwal Sholat • {cityName}
                  </span>
                  <h2 className="text-xl font-black tracking-tight mt-0.5">
                    {nextPrayer.name} <span className="font-light opacity-90">{nextPrayer.time}</span>
                  </h2>
                </div>
              </div>
            </div>

            <InteractiveNewsletter />
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
          className={`flex flex-col items-center transition ${activeTab === 'home' ? 'text-pink-500 scale-115' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Beranda</span>
        </button>

        <button 
          onClick={() => setActiveTab('todos')} 
          className={`flex flex-col items-center transition ${activeTab === 'todos' ? 'text-pink-500 scale-115' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <CheckSquare className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Tugas</span>
        </button>

        <button 
          onClick={() => setActiveTab('menu')} 
          className={`flex flex-col items-center transition ${activeTab === 'menu' ? 'text-pink-500 scale-115' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Utensils className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Menu</span>
        </button>

        <button 
          onClick={() => setActiveTab('schedule')} 
          className={`flex flex-col items-center transition ${activeTab === 'schedule' ? 'text-pink-500 scale-115' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Catatan</span>
        </button>

        <button 
          onClick={() => setActiveTab('events')} 
          className={`flex flex-col items-center transition ${activeTab === 'events' ? 'text-pink-500 scale-115' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Kalender</span>
        </button>
      </nav>

    </div>
  );
}