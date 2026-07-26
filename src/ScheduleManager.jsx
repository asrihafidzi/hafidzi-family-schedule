import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Calendar, Shield, User, Shirt, BookOpen, FileText, Plus, Trash2, Sparkles, Star, Award, LogOut } from 'lucide-react';

export default function ScheduleManager() {
  // State untuk Nama Pengguna & Status Admin
  const [currentUserName, setCurrentUserName] = useState(() => {
    return localStorage.getItem('family_user_name') || '';
  });
  const [inputName, setInputName] = useState('');
  const [nameError, setNameError] = useState('');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Senin');

  // State Data dari Firebase
  const [pelajaranData, setPelajaranData] = useState({});
  const [seragamData, setSeragamData] = useState({});
  const [catatanData, setCatatanData] = useState({});

  // Form Input State
  const [itemListPelajaran, setItemListPelajaran] = useState(['']);
  const [itemListSeragam, setItemListSeragam] = useState(['']);
  const [catatanText, setCatatanText] = useState('');

  const daysList = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];

  // Validasi Nama saat Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const formattedName = inputName.trim().toUpperCase();

    // Daftar nama orang tua
    const parents = ['ASRI', 'REZQI'];
    // Daftar nama anak-anak
    const kids = ['BELLA', 'ACA', 'CIYA'];

    if (parents.includes(formattedName)) {
      localStorage.setItem('family_user_name', formattedName);
      setCurrentUserName(formattedName);
      setIsAdmin(true);
      setNameError('');
    } else if (kids.includes(formattedName)) {
      localStorage.setItem('family_user_name', formattedName);
      setCurrentUserName(formattedName);
      setIsAdmin(false);
      setNameError('');
    } else {
      setNameError('Nama tidak terdaftar! Gunakan nama Asri, Rezqi, Bella, Aca, atau Ciya.');
    }
  };

  // Tombol Keluar / Ganti Nama
  const handleLogout = () => {
    localStorage.removeItem('family_user_name');
    setCurrentUserName('');
    setInputName('');
  };

  // Ambil data real-time dari Firebase
  useEffect(() => {
    if (!currentUserName) return;

    const unsubPelajaran = onSnapshot(doc(db, 'family_data', 'Jadwal Pelajaran'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPelajaranData(data);
        if (Array.isArray(data[selectedDay])) setItemListPelajaran(data[selectedDay]);
      }
    });

    const unsubSeragam = onSnapshot(doc(db, 'family_data', 'Jadwal Seragam'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSeragamData(data);
        if (Array.isArray(data[selectedDay])) setItemListSeragam(data[selectedDay]);
      }
    });

    const unsubCatatan = onSnapshot(doc(db, 'family_data', 'Catatan Hari Ini'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCatatanData(data);
        setCatatanText(data[selectedDay] || '');
      }
    });

    return () => {
      unsubPelajaran();
      unsubSeragam();
      unsubCatatan();
    };
  }, [currentUserName, selectedDay]);

  const handleDayChange = (day) => {
    setSelectedDay(day);
    setItemListPelajaran(pelajaranData[day] && pelajaranData[day].length > 0 ? pelajaranData[day] : ['']);
    setItemListSeragam(seragamData[day] && seragamData[day].length > 0 ? seragamData[day] : ['']);
    setCatatanText(catatanData[day] || '');
  };

  const handleAddPelajaran = () => setItemListPelajaran([...itemListPelajaran, '']);
  const handlePelajaranChange = (i, val) => {
    const updated = [...itemListPelajaran];
    updated[i] = val;
    setItemListPelajaran(updated);
  };
  const handleRemovePelajaran = (i) => {
    const updated = itemListPelajaran.filter((_, idx) => idx !== i);
    setItemListPelajaran(updated.length > 0 ? updated : ['']);
  };

  const handleAddSeragam = () => setItemListSeragam([...itemListSeragam, '']);
  const handleSeragamChange = (i, val) => {
    const updated = [...itemListSeragam];
    updated[i] = val;
    setItemListSeragam(updated);
  };
  const handleRemoveSeragam = (i) => {
    const updated = itemListSeragam.filter((_, idx) => idx !== i);
    setItemListSeragam(updated.length > 0 ? updated : ['']);
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    try {
      const filteredPelajaran = itemListPelajaran.filter(item => item.trim() !== '');
      const filteredSeragam = itemListSeragam.filter(item => item.trim() !== '');

      await updateDoc(doc(db, 'family_data', 'Jadwal Pelajaran'), { [selectedDay]: filteredPelajaran });
      await updateDoc(doc(db, 'family_data', 'Jadwal Seragam'), { [selectedDay]: filteredSeragam });
      await updateDoc(doc(db, 'family_data', 'Catatan Hari Ini'), { [selectedDay]: catatanText });

      alert(`Berhasil menyimpan data hari ${selectedDay}! ✨`);
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Gagal menyimpan ke Firebase.");
    }
  };

  // ================= HALAMAN LOGIN NAMA =================
  if (!currentUserName) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .glitter-text {
            background: linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6, #f59e0b);
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: shimmer 4s linear infinite;
          }
        `}</style>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-amber-100 max-w-md w-full space-y-6 text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
            <Sparkles size={32} className="animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif font-bold text-2xl text-slate-800">
              Halo, Siapa Kamu? 👋
            </h1>
            <p className="text-slate-500 text-xs">
              Masukkan nama panggilanmu untuk masuk ke aplikasi Hafidzi Family.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input 
              type="text"
              placeholder="Contoh: Asri, Bella, Ciya..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center font-bold text-slate-700 text-base focus:outline-none focus:ring-2 focus:ring-amber-300 uppercase tracking-wider"
              autoFocus
            />

            {nameError && (
              <p className="text-rose-500 text-xs font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                {nameError}
              </p>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:from-amber-500 hover:to-orange-500 transition text-sm flex items-center justify-center gap-2"
            >
              Masuk Aplikasi 🚀
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex flex-wrap justify-center gap-2">
            <span className="bg-slate-50 px-2 py-1 rounded-lg">Orang Tua: Asri, Rezqi</span>
            <span className="bg-slate-50 px-2 py-1 rounded-lg">Anak: Bella, Aca, Ciya</span>
          </div>
        </div>
      </div>
    );
  }

  // Data Tampilan Mode Anak
  const activePelajaran = pelajaranData[selectedDay] || [];
  const activeSeragam = seragamData[selectedDay] || [];
  const activeCatatan = catatanData[selectedDay] || 'Tidak ada catatan khusus untuk hari ini. Tetap semangat ya! ✨';

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .glitter-text {
          background: linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6, #f59e0b);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .glitter-badge {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          box-shadow: 0 4px 15px -3px rgba(245, 158, 11, 0.15);
        }
      `}</style>

      {/* Header Banner dengan Informasi Pengguna yang Sedang Login */}
      <div className="glitter-badge p-5 rounded-[2.5rem] border border-amber-200/60 flex items-center justify-between shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles size={15} className="text-amber-500 animate-pulse" /> 
            {isAdmin ? 'Mode Orang Tua (Admin)' : 'Mode Anak'}
          </div>
          <h1 className="font-serif font-bold text-xl text-slate-800">
            Halo, <span className="glitter-text font-extrabold">{currentUserName}!</span> ✨
          </h1>
        </div>
        <button 
          onClick={handleLogout}
          title="Keluar / Ganti Nama"
          className="p-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl shadow-xs border border-amber-100 transition flex items-center gap-1.5 text-xs font-bold"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Ganti Nama</span>
        </button>
      </div>

      {/* Pilihan Hari */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {daysList.map((d) => (
          <button
            key={d}
            onClick={() => handleDayChange(d)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedDay === d 
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md shadow-amber-200 scale-105' 
                : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            {selectedDay === d && <Sparkles size={12} className="text-white animate-bounce" />}
            {d}
          </button>
        ))}
      </div>

      {isAdmin ? (
        /* ================= MODE ORANG TUA (INPUT) ================= */
        <form onSubmit={handleSaveAll} className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="p-2 bg-amber-50 text-amber-500 rounded-2xl"><Calendar size={18} /></span>
              Input Data Hari: <span className="text-amber-500 font-extrabold">{selectedDay}</span>
            </h3>

            {/* 1. Form Jadwal Pelajaran */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-indigo-500" /> JADWAL PELAJARAN
                </label>
                <button type="button" onClick={handleAddPelajaran} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                  <Plus size={12} /> Tambah Pelajaran
                </button>
              </div>
              <div className="space-y-2">
                {itemListPelajaran.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-slate-400 w-6 text-center">{index + 1}.</span>
                    <input 
                      type="text" 
                      placeholder="Contoh: Matematika, IPA, dll" 
                      value={item}
                      onChange={(e) => handlePelajaranChange(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    {itemListPelajaran.length > 1 && (
                      <button type="button" onClick={() => handleRemovePelajaran(index)} className="text-slate-300 hover:text-red-400 p-2 transition">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Form Jadwal Seragam */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Shirt size={14} className="text-sky-500" /> JADWAL SERAGAM / ATRIBUT
                </label>
                <button type="button" onClick={handleAddSeragam} className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                  <Plus size={12} /> Tambah Seragam
                </button>
              </div>
              <div className="space-y-2">
                {itemListSeragam.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-slate-400 w-6 text-center">{index + 1}.</span>
                    <input 
                      type="text" 
                      placeholder="Contoh: Putih Merah, Pramuka, dll" 
                      value={item}
                      onChange={(e) => handleSeragamChange(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                    {itemListSeragam.length > 1 && (
                      <button type="button" onClick={() => handleRemoveSeragam(index)} className="text-slate-300 hover:text-red-400 p-2 transition">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 3. Form Catatan Hari Ini */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText size={14} className="text-amber-500" /> CATATAN HARI INI
              </label>
              <textarea 
                rows="3"
                placeholder="Contoh: Bawa buku cerita, uang kas, dll..."
                value={catatanText}
                onChange={(e) => setCatatanText(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:from-amber-500 hover:to-orange-500 transition text-sm flex items-center justify-center gap-2">
              <Sparkles size={16} /> Simpan Semua Perubahan Hari {selectedDay}
            </button>
          </div>
        </form>
      ) : (
        /* ================= MODE ANAK (TAMPILAN) ================= */
        <div className="space-y-5">
          <div className="text-center pb-1">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center justify-center gap-1">
              <Award size={14} /> Jadwal & Catatan Harian
            </span>
            <h2 className="font-serif font-bold text-3xl text-slate-800 mt-0.5 glitter-text">{selectedDay}</h2>
          </div>

          {/* Bagian 1: Jadwal Pelajaran */}
          <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0 opacity-60"></div>
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-2 uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100/60">
                <BookOpen size={15} className="text-indigo-500" /> Daftar Pelajaran
              </span>
              <span className="text-xs text-indigo-400 font-semibold">{activePelajaran.length} Mapel</span>
            </div>
            <div className="space-y-2 relative z-10">
              {activePelajaran.length > 0 ? (
                activePelajaran.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 transition hover:bg-indigo-50/70">
                    <span className="w-7 h-7 rounded-xl bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">{idx + 1}</span>
                    <span className="text-slate-800 text-sm font-semibold">{val}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm text-center py-3">Belum ada jadwal pelajaran untuk hari ini. ✨</p>
              )}
            </div>
          </div>

          {/* Bagian 2: Jadwal Seragam */}
          <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-0 opacity-60"></div>
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-sky-600 flex items-center gap-2 uppercase tracking-wider bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100/60">
                <Shirt size={15} className="text-sky-500" /> Jadwal Seragam / Atribut
              </span>
              <span className="text-xs text-sky-400 font-semibold">Atribut Sekolah</span>
            </div>
            <div className="space-y-2 relative z-10">
              {activeSeragam.length > 0 ? (
                activeSeragam.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-sky-50/30 rounded-2xl border border-sky-100/50 transition hover:bg-sky-50/70">
                    <span className="w-7 h-7 rounded-xl bg-sky-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">{idx + 1}</span>
                    <span className="text-slate-800 text-sm font-semibold">{val}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm text-center py-3">Belum ada jadwal seragam untuk hari ini. ✨</p>
              )}
            </div>
          </div>

          {/* Bagian 3: Catatan Hari Ini */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-3xl border border-amber-200/60 shadow-sm space-y-2 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-amber-200/30 rounded-full blur-xl pointer-events-none"></div>
            <span className="text-xs font-bold text-amber-700 flex items-center gap-2 uppercase tracking-wider bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200/50 w-fit shadow-2xs">
              <FileText size={15} className="text-amber-500" /> Catatan Hari Ini 📌
            </span>
            <p className="text-slate-700 text-sm bg-white/90 p-4 rounded-2xl border border-amber-100 shadow-2xs leading-relaxed font-medium">
              {activeCatatan}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}