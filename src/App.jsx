import React, { useState } from 'react';
import Dashboard from './Dashboard';
import TodoManager from './TodoManager';

/**
 * Komponen App berfungsi sebagai router utama aplikasi
 * yang mengelola navigasi antar layar.
 */
export default function App() {
  const [userId, setUserId] = useState("bella_id"); // Default login sebagai Bella
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans">
      {/* Header Aplikasi */}
      <header className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Hafidzi Family Hub</h1>
        <div className="w-10 h-10 rounded-full bg-[#B8A7F8] text-white flex items-center justify-center font-bold text-sm">
          {userId.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* Konten Utama */}
      <main className="p-4">
        {activeTab === 'dashboard' ? (
          <Dashboard onNavigate={setActiveTab} />
        ) : (
          <TodoManager userId={userId} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-100 flex justify-around p-4">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`font-bold ${activeTab === 'dashboard' ? 'text-[#B8A7F8]' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`font-bold ${activeTab === 'tasks' ? 'text-[#B8A7F8]' : 'text-slate-400'}`}
        >
          Tugas
        </button>
      </nav>
    </div>
  );
}