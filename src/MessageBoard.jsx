import React, { useState } from 'react';
import { MessageSquare, Send, Trash2, Sparkles } from 'lucide-react';

export default function MessageBoard({ currentUser }) {
  const [messages, setMessages] = useState([
    { id: 1, author: 'Papa', text: 'Akhir pekan ini kita akan piknik ke taman ya!', time: 'Hari ini, 10:00' }
  ]);
  const [newText, setNewText] = useState('');

  const addMessage = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const msg = {
      id: Date.now(),
      author: currentUser.name,
      text: newText,
      time: 'Baru saja'
    };

    setMessages([msg, ...messages]);
    setNewText('');
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Banner Sambutan Cantik */}
      <div className="relative overflow-hidden p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-amber-50 rounded-[2.5rem] shadow-sm border border-white">
        <div className="absolute -right-4 -bottom-4 text-pink-200/50">
          <Sparkles size={96} />
        </div>
        <div className="relative z-10">
          <span className="px-3 py-1 bg-white/80 backdrop-blur-md text-pink-600 text-xs font-bold rounded-full uppercase tracking-wider">
            Selamat Datang ✨
          </span>
          <h3 className="font-serif text-2xl font-bold text-slate-800 mt-2">
            Halo, {currentUser.name}! {currentUser.avatar}
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            
          </p>
        </div>
      </div>

      {/* Papan Pesan */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-lg text-slate-800 flex items-center gap-2">
            <span className="p-2 bg-pink-50 text-pink-500 rounded-2xl"><MessageSquare size={18} /></span> 
           Let's Talk
          </h3>
        </div>
        
        {/* Form Kirim Pesan */}
        <form onSubmit={addMessage} className="space-y-3 mb-6">
          <div className="relative">
            <textarea 
              rows="2"
              placeholder={`Tulis pesan atau info untuk Papa Ibu Bebe Aca Ciya...`} 
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition resize-none shadow-inner"
            />
          </div>
          <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold rounded-2xl shadow-md shadow-pink-200 hover:from-pink-500 hover:to-rose-500 transition flex items-center justify-center gap-2 text-sm">
            <Send size={16} /> Bagikan Pesan
          </button>
        </form>

        {/* Daftar Pesan */}
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 flex justify-between items-start hover:bg-slate-50 transition">
              <div className="space-y-1 pr-2">
                <p className="text-slate-700 text-sm font-medium leading-relaxed">"{m.text}"</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 bg-white text-slate-700 text-xs font-bold rounded-md shadow-xs border border-slate-100">
                    {m.author}
                  </span>
                  <span className="text-xs text-slate-400">{m.time}</span>
                </div>
              </div>
              <button onClick={() => deleteMessage(m.id)} className="text-slate-300 hover:text-red-400 transition p-1.5 rounded-xl hover:bg-red-50">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}