import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Calendar, Shield, User, Shirt, BookOpen, FileText, Plus, Trash2, Sparkles, Star, Award, LogOut } from 'lucide-react';

export default function ScheduleManager() {
  const [currentUserName, setCurrentUserName] = useState('');
  const [inputName, setInputName] = useState('');
  const [nameError, setNameError] = useState('');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Senin');
  const [selectedChild, setSelectedChild] = useState('BEBE');

  const [pelajaranData, setPelajaranData] = useState({});
  const [seragamData, setSeragamData] = useState({});
  const [catatanData, setCatatanData] = useState({});

  const [itemListPelajaran, setItemListPelajaran] = useState(['']);
  const [itemListSeragam, setItemListSeragam] = useState(['']);
  const [catatanText, setCatatanText] = useState('');

  const daysList = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  const schoolKids = ['BEBE', 'ACA'];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const formattedName = inputName.trim().toUpperCase();

    const parents = ['ASRI', 'REZQI'];
    const kids = ['BEBE', 'ACA', 'CIYA', 'BELLA'];

    if (parents.includes(formattedName)) {
      setCurrentUserName(formattedName);
      setIsAdmin(true);
      setNameError('');
    } else if (kids.includes(formattedName)) {
      setCurrentUserName(formattedName);
      setIsAdmin(false);
      setNameError('');
      if (schoolKids.includes(formattedName)) {
        setSelectedChild(formattedName);
      }
    } else {
      setNameError('Nama tidak terdaftar! Gunakan nama Asri, Rezqi, Bebe, Aca, atau Ciya.');
    }
  };

  const handleLogout = () => {
    setCurrentUserName('');
    setInputName('');
  };

  useEffect(() => {
    if (!currentUserName) return;

    const docKeyPelajaran = `Jadwal Pelajaran_${selectedChild}`;
    const docKeySeragam = `Jadwal Seragam_${selectedChild}`;
    const docKeyCatatan = `Catatan Hari Ini_${selectedChild}`;

    const unsubPelajaran = onSnapshot(doc(db, 'family_data', docKeyPelajaran), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPelajaranData(data);
        if (Array.isArray(data[selectedDay])) setItemListPelajaran(data[selectedDay]);
        else setItemListPelajaran(['']);
      } else {
        setPelajaranData({});
        setItemListPelajaran(['']);
      }
    });

    const unsubSeragam = onSnapshot(doc(db, 'family_data', docKeySeragam), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSeragamData(data);
        setItemListSeragam(Array.isArray(data[selectedDay]) ? data[selectedDay] : ['']);
      } else {
        setSeragamData({});
        setItemListSeragam(['']);
      }
    });

    const unsubCatatan = onSnapshot(doc(db, 'family_data', docKeyCatatan), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCatatanData(data);
        setCatatanText(data[selectedDay] || '');
      } else {
        setCatatanData({});
        setCatatanText('');
      }
    });

    return () => {
      unsubPelajaran();
      unsubSeragam();
      unsubCatatan();
    };
  }, [currentUserName, selectedDay, selectedChild]);

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const handleChildTabChange = (childName) => {
    setSelectedChild(childName);
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

      const docKeyPelajaran = `Jadwal Pelajaran_${selectedChild}`;
      const docKeySeragam = `Jadwal Seragam_${selectedChild}`;
      const docKeyCatatan = `Catatan Hari Ini_${selectedChild}`;

      await setDoc(doc(db, 'family_data', docKeyPelajaran), { [selectedDay]: filteredPelajaran }, { merge: true });
      await setDoc(doc(db, 'family_data', docKeySeragam), { [selectedDay]: filteredSeragam }, { merge: true });
      await setDoc(doc(db, 'family_data', docKeyCatatan), { [selectedDay]: catatanText }, { merge: true });

      alert(`Berhasil menyimpan data ${selectedChild} hari ${selectedDay}! ✨`);
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Gagal menyimpan ke Firebase. Periksa koneksi internet atau aturan Firestore.");
    }
  };

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
              placeholder="Contoh: Asri, Bebe, Aca..."
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
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:from-amber-500 hover:to-orange-500 transition text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              Masuk Aplikasi 🚀
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex flex-wrap justify-center gap-2">
            <span className="bg-slate-50 px-2 py-1 rounded-lg">Orang Tua: Asri, Rezqi</span>
            <span className="bg-slate-50 px-2 py-1 rounded-lg">Anak: Bebe, Aca, Ciya</span>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="glitter-badge p-5 rounded-[2.5rem] border border-amber-200/60 flex items-center justify-between shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles size={15} className="text-amber-500 animate-pulse" /> 
            {isAdmin ? 'Mode Orang Tua (Admin)' : `Mode Anak (${currentUserName})`}
          </div>
          <h1 className="font-serif font-bold text-xl text-slate-800">
            Halo, <span className="glitter-text font-extrabold">{currentUserName}!</span> ✨
          </h1>
        </div>
        <button 
          onClick={handleLogout}
          title="Keluar / Ganti Nama"
          className="p-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl shadow-xs border border-amber-100 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Ganti Nama</span>
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex gap-2">
        {schoolKids.map((child) => (
          <button
            key={child}
            onClick={() => handleChildTabChange(child)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
              selectedChild === child
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 scale-[1.02]'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span>🎒</span> Jadwal Sekolah: <span className="uppercase">{child}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {daysList.map((d) => (
          <button
            key={d}
            onClick={() => handleDayChange(d)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
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
        <form onSubmit={handleSaveAll} className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="p-2 bg-amber-50 text-amber-500 rounded-2xl"><Calendar size={18} /></span>
              Input Jadwal <span className="text-pink-500 font-extrabold uppercase">{selectedChild}</span> - Hari: <span className="text-amber-500 font-extrabold">{selectedDay}</span>
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-indigo-500" /> JADWAL PELAJARAN {selectedChild}
                </label>
                <button type="button" onClick={handleAddPelajaran} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer">
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
                      <button type="button" onClick={() => handleRemovePelajaran(index)} className="text-slate-300 hover:text-red-400 p-2 transition cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Shirt size={14} className="text-sky-500" /> JADWAL SERAGAM / ATRIBUT {selectedChild}
                </label>
                <button type="button" onClick={handleAddSeragam} className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer">
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
                      <button type="button" onClick={() => handleRemoveSeragam(index)} className="text-slate-300 hover:text-red-400 p-2 transition cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText size={14} className="text-amber-500" /> CATATAN KHUSUS {selectedChild}
              </label>
              <textarea 
                rows="3"
                placeholder="Contoh: Bawa buku cerita, uang kas, dll..."
                value={catatanText}
                onChange={(e) => setCatatanText(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:from-amber-500 hover:to-orange-500 transition text-sm flex items-center justify-center gap-2 cursor-pointer">
              <Sparkles size={16} /> Simpan Jadwal {selectedChild} ({selectedDay})
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="text-center pb-1">
            <span className="text-xs font-bold text-pink-500 uppercase tracking-widest flex items-center justify-center gap-1">
              <Award size={14} /> Jadwal Sekolah & Seragam {selectedChild}
            </span>
            <h2 className="font-serif font-bold text-3xl text-slate-800 mt-0.5 glitter-text">{selectedDay}</h2>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0 opacity-60"></div>
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-2 uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100/60">
                <BookOpen size={15} className="text-indigo-500" /> Pelajaran {selectedChild}
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
                <p className="text-slate-400 text-sm text-center py-3">Belum ada jadwal pelajaran untuk {selectedChild} hari ini. ✨</p>
              )}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-0 opacity-60"></div>
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-sky-600 flex items-center gap-2 uppercase tracking-wider bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100/60">
                <Shirt size={15} className="text-sky-500" /> Seragam / Atribut {selectedChild}
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
                <p className="text-slate-400 text-sm text-center py-3">Belum ada jadwal seragam untuk {selectedChild} hari ini. ✨</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-3xl border border-amber-200/60 shadow-sm space-y-2 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-amber-200/30 rounded-full blur-xl pointer-events-none"></div>
            <span className="text-xs font-bold text-amber-700 flex items-center gap-2 uppercase tracking-wider bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200/50 w-fit shadow-2xs">
              <FileText size={15} className="text-amber-500" /> Catatan {selectedChild} 📌
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