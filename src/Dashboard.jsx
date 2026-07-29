import React, { useState, useEffect } from 'react';
import { Calendar, ShoppingBag, Star, Moon } from 'lucide-react';

export default function Dashboard({ onNavigate, currentUser }) {
  const [nextPrayer, setNextPrayer] = useState({ name: 'Memuat...', time: '--:--' });
  const [cityName, setCityName] = useState('Bandung');

  // Ambil jadwal sholat realtime dari API Aladhan
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
        
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=Bandung&country=Indonesia&method=2`);
        const data = await response.json();
        
        if (data && data.data) {
          const timings = data.data.timings;
          
          // Daftar waktu sholat penting dalam format 24 jam untuk perbandingan
          const prayers = [
            { key: 'Fajr', label: 'SUBUH', time: timings.Fajr },
            { key: 'Dhuhr', label: 'DZUHUR', time: timings.Dhuhr },
            { key: 'Asr', label: 'ASHAR', time: timings.Asr },
            { key: 'Maghrib', label: 'MAGHRIB', time: timings.Maghrib },
            { key: 'Isha', label: 'ISYA', time: timings.Isha }
          ];

          // Dapatkan jam saat ini dalam format "HH:MM"
          const now = new Date();
          const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

          // Cari jadwal sholat berikutnya hari ini
          let upcoming = prayers.find(p => p.time > currentTimeStr);
          
          // Jika sudah lewat semua, berarti jadwal berikutnya adalah Subuh besok
          if (!upcoming) {
            upcoming = prayers[0]; 
            upcoming.label = 'SUBUH (Besok)';
          }

          setNextPrayer({ name: upcoming.label, time: upcoming.time });
        }
      } catch (error) {
        setNextPrayer({ name: 'SUBUH', time: '04:40' }); // Fallback jika offline
      }
    };

    fetchPrayerTimes();
  }, []);

  const features = [
    { 
      name: 'Jadwal', 
      icon: Calendar, 
      gradient: 'from-violet-500 to-purple-600', 
      bgCard: 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 text-violet-900',
      align: 'text-left', 
      path: 'schedule' 
    },
    { 
      name: 'Belanja', 
      icon: ShoppingBag, 
      gradient: 'from-pink-500 to-rose-600', 
      bgCard: 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 text-rose-900',
      align: 'text-right', 
      path: 'shopping' 
    },
    { 
      name: 'Tugas', 
      icon: Star, 
      gradient: 'from-amber-500 to-orange-600', 
      bgCard: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 text-amber-900',
      align: 'text-center', 
      path: 'tasks' 
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Widget Jadwal Sholat Berikutnya (Menggantikan Kartu Halo) */}
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
        <div className="text-right hidden sm:block">
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium backdrop-blur-sm">
            ✨ Realtime
          </span>
        </div>
      </div>

      {/* Menu / Tombol Pintasan */}
      <div className="grid grid-cols-1 gap-4">
        {features.map((item) => {
          const IconComponent = item.icon;
          return (
            <button 
              key={item.name}
              onClick={() => onNavigate(item.path)}
              className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all duration-200 hover:shadow-md active:scale-95 cursor-pointer ${item.bgCard}`}
            >
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