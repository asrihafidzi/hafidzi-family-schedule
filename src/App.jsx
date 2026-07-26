import React, { useState } from 'react';
import Dashboard from './Dashboard';
import TodoManager from './TodoManager';

/**
 * Komponen App berfungsi sebagai router utama aplikasi
 * yang mengelola navigasi antar layar dan halaman login nama.
 */
export default function App() {
  const [userId, setUserId] = useState(""); // Kosongkan dulu agar muncul halaman input nama
  const [nameInput, setNameInput] = useState("");
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fungsi untuk handle saat nama disubmit
  const handleLogin = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserId(nameInput.trim());
    }
  };

  // Jika belum memasukkan nama, tampilkan halaman landing / input nama dulu
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf3f3] to-[#f4e8f8] flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-purple-100 text-center">
          <div className="w-16 h-16 bg-[#B8A7F8] text-white rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
            👨‍👩‍👧‍👦
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Hafidzi Family Hub</h1>
          <p className="text-slate-500 mb-6 text-sm">Silakan masukkan nama kamu untuk mulai menggunakan aplikasi</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text"
              placeholder="Contoh: Bella, Ayah, Ibu..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B8A7F8] text-base text-slate-800"
              required
            />
            <button 
              type="submit"
              className="w-full py-3 bg-[#B8A7F8] hover:a-[#a490f6] text-white font-bold rounded-xl shadow-md transition-all text-base min-h-[48px]"
            >
              Masuk Aplikasi
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf3f3] font-sans pb-24">
      {/* Header Aplikasi - Diperbesar agar pas di HP */}
      <header className="px-6 py-4 bg-white border-b border-purple-100 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <h1 className="text-xl font-bold text-slate-800">Hafidzi Family</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 hidden sm:inline">Halo, {userId}</span>
          <div className="w-11 h-11 rounded-full bg-[#B8A7F8] text-white flex items-center justify-center font-bold text-base shadow-sm">
            {userId.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="p-4 max-w-4xl mx-auto">
        {activeTab === 'dashboard' ? (
          <Dashboard onNavigate={setActiveTab} />
        ) : (
          <TodoManager userId={userId} />
        )}
      </main>

      {/* Bottom Navigation - Diperbesar ukuran tombol dan teksnya agar nyaman di jari */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 flex justify-around p-3 shadow-lg z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 text-center font-bold text-base transition-colors rounded-xl mx-2 min-h-[50px] flex items-center justify-center ${
            activeTab === 'dashboard' 
              ? 'bg-[#B8A7F8] text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          📊 Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 text-center font-bold text-base transition-colors rounded-xl mx-2 min-h-[50px] flex items-center justify-center ${
            activeTab === 'tasks' 
              ? 'bg-[#B8A7F8] text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          📝 Tugas
        </button>
      </nav>
    </div>
  );
}