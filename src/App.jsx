import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import TodoManager from './TodoManager';

/**
 * Komponen App berfungsi sebagai router utama aplikasi
 * yang mengelola navigasi antar layar dan halaman masuk/pilih nama.
 */
export default function App() {
  // Mengambil nama yang tersimpan di HP (jika ada) saat pertama kali dibuka
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('hafidzi_user') || "";
  });
  const [nameInput, setNameInput] = useState("");
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fungsi untuk handle saat nama disubmit/dipilih
  const handleLogin = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      const username = nameInput.trim();
      setUserId(username);
      localStorage.setItem('hafidzi_user', username); // Simpan di HP agar tidak ketik ulang terus
    }
  };

  // Fungsi untuk handle klik cepat pada tombol pilihan nama profil (Ibu, Papa, dll)
  const handleSelectProfile = (profileName) => {
    setUserId(profileName);
    localStorage.setItem('hafidzi_user', profileName);
  };

  // Fungsi untuk keluar/ganti nama profil jika diperlukan
  const handleLogout = () => {
    setUserId("");
    localStorage.removeItem('hafidzi_user');
  };

  // JIKA BELUM MASUKKAN NAMA: Tampilkan halaman pilihan nama/profil yang estetik
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf3f3] to-[#e8ddf5] flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-purple-100 text-center">
          <div className="w-16 h-16 bg-[#B8A7F8] text-white rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
            👨‍👩‍👧‍👦
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Hafidzi Family</h1>
          <p className="text-slate-500 mb-6 text-sm">Pilih profil atau masukkan namamu untuk masuk</p>
          
          {/* Tombol Cepat Pilihan Profil Anggota Keluarga (Biar ga capek mengetik di HP) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['Ibu', 'Papa', 'Bella', 'Aca', 'Ciya'].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSelectProfile(name)}
                className="py-3 px-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 font-bold rounded-xl transition-all active:scale-95 text-base flex items-center justify-center gap-2 shadow-sm"
              >
                👤 {name}
              </button>
            ))}
          </div>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-semibold">Atau ketik nama baru</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          
          {/* Form Input Manual */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text"
              placeholder="Ketik namamu di sini..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-[#B8A7F8] text-base text-slate-800 text-center"
              required
            />
            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#B8A7F8] to-[#9982f6] text-white font-bold rounded-xl shadow-md transition-all text-base min-h-[48px] active:scale-95"
            >
              Masuk Aplikasi 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  // JIKA SUDAH ADA NAMA: Tampilkan halaman utama aplikasi
  return (
    <div className="min-h-screen bg-[#faf3f3] font-sans pb-28">
      {/* Header Aplikasi - Dibuat manis & ada tombol ganti profil */}
      <header className="px-6 py-4 bg-white border-b border-purple-100 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <h1 className="text-xl font-black text-purple-950 tracking-tight">Hafidzi Family</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 active:opacity-70 text-left"
          title="Klik untuk ganti profil"
        >
          <span className="text-xs font-bold text-purple-400 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
            {userId} 🔄
          </span>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B8A7F8] to-[#9982f6] text-white flex items-center justify-center font-black text-sm shadow-sm">
            {userId.charAt(0).toUpperCase()}
          </div>
        </button>
      </header>

      {/* Konten Utama */}
      <main className="p-4 max-w-md mx-auto">
        {activeTab === 'dashboard' ? (
          <Dashboard onNavigate={setActiveTab} />
        ) : (
          <TodoManager userId={userId} />
        )}
      </main>

      {/* Bottom Navigation Toolbar - Tombol besar, tebal, empuk buat HP */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-purple-50 flex justify-around p-3 shadow-[0_-5px_15px_rgba(0,0,0,0.03)] z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 text-center font-extrabold text-base transition-all rounded-2xl mx-2 min-h-[50px] flex items-center justify-center gap-2 ${
            activeTab === 'dashboard' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200' 
              : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          📊 Menu
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 text-center font-extrabold text-base transition-all rounded-2xl mx-2 min-h-[50px] flex items-center justify-center gap-2 ${
            activeTab === 'tasks' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200' 
              : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          📝 Tugas
        </button>
      </nav>
    </div>
  );
}