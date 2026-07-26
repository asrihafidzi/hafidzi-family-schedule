import React, { useState } from 'react';
import { 
  Home, BookOpen, CheckSquare, Calendar, Utensils, 
  ChevronRight, Plus, User, Coffee, Star, Sun, Moon 
} from 'lucide-react';
import TodoManager from './TodoManager';
import EventManager from './EventManager';
import MessageBoard from './MessageBoard'; // <-- Import MessageBoard
import MenuManager from './MenuManager';
import ScheduleManager from './ScheduleManager';

const FAMILY_MEMBERS = [
  { id: 'ibu', name: 'Ibu', avatar: '👩🏻', color: '#e82271' },
  { id: 'papa', name: 'Papa', avatar: '👨🏻', color: '#1c95e6' },
  { id: 'bella', name: 'Bella', avatar: '👧🏻', color: '#e01f96' },
  { id: 'aca', name: 'Aca', avatar: '👧🏻', color: '#a157e1' },
  { id: 'ciya', name: 'Ciya', avatar: '👶🏻', color: '#eea7f3' },
];


const SCHEDULE = [
  { day: 'Senin', lessons: ['Matematika', 'IPA'], activity: 'Les Piano' },
  { day: 'Selasa', lessons: ['Bahasa Indo', 'Olahraga'], activity: 'Eskul Menari' },
];

export default function HafidziApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-serif font-bold text-slate-800 mb-8">Halo, Hafidzi Family!</h1>
        <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
          {FAMILY_MEMBERS.map(m => (
            <button key={m.id} onClick={() => setUser(m)} className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center hover:shadow-md transition">
              <span className="text-4xl mb-2">{m.avatar}</span>
              <span className="font-bold text-slate-700">{m.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] w-full max-w-md mx-auto flex flex-col shadow-2xl border-x border-slate-200 relative">
      <header className="p-6 bg-white/60 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hafidzi Hub</p>
          <h2 className="font-serif text-2xl font-bold text-slate-800">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
        </div>
        <div onClick={() => setUser(null)} className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm cursor-pointer" style={{backgroundColor: user.color}} title="Ganti Profil">
          {user.avatar}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto pb-28">
       {activeTab === 'home' && (
          <div className="space-y-6">
            <MessageBoard currentUser={user} />
          </div>
        )}

        {activeTab === 'schedule' && (
  <ScheduleManager />
)}

        

        {activeTab === 'todo' && (
          <TodoManager userId={user.id} />
        )}

        {activeTab === 'event' && (
          <EventManager />
        )}
        {activeTab === 'menu' && (
       <MenuManager />
     )}
      </main>

      <nav className="fixed bottom-0 w-full max-w-md bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-around p-4 rounded-t-[2rem] z-20 shadow-lg">
        <button onClick={() => setActiveTab('home')} className={`p-2 rounded-2xl transition ${activeTab === 'home' ? 'text-pink-500 bg-pink-50' : 'text-slate-400 hover:text-slate-600'}`}><Home size={22} /></button>
        <button onClick={() => setActiveTab('schedule')} className={`p-2 rounded-2xl transition ${activeTab === 'schedule' ? 'text-pink-500 bg-pink-50' : 'text-slate-400 hover:text-slate-600'}`}><BookOpen size={22} /></button>
        <button onClick={() => setActiveTab('menu')} className={`p-2 rounded-2xl transition ${activeTab === 'menu' ? 'text-pink-500 bg-pink-50' : 'text-slate-400 hover:text-slate-600'}`}><Utensils size={22} /></button>
        <button onClick={() => setActiveTab('todo')} className={`p-2 rounded-2xl transition ${activeTab === 'todo' ? 'text-pink-500 bg-pink-50' : 'text-slate-400 hover:text-slate-600'}`}><CheckSquare size={22} /></button>
        <button onClick={() => setActiveTab('event')} className={`p-2 rounded-2xl transition ${activeTab === 'event' ? 'text-pink-500 bg-pink-50' : 'text-slate-400 hover:text-slate-600'}`}><Calendar size={22} /></button>
      </nav>
    </div>
  );
}