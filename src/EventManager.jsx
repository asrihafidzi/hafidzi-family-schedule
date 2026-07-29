import React, { useState, useEffect } from 'react';
import { Calendar, Plus, MapPin, Clock, Trash2 } from 'lucide-react';

export default function EventManager() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('hafidzi_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return []; // Kosong tanpa data bawaan yang membandel
  });
  
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    localStorage.setItem('hafidzi_events', JSON.stringify(events));
  }, [events]);

  const addEvent = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvt = {
      id: Date.now(),
      title: newTitle,
      time: newTime || 'Waktu fleksibel',
      location: newLocation || 'Rumah',
    };

    setEvents([newEvt, ...events]);
    setNewTitle('');
    setNewTime('');
    setNewLocation('');
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="font-serif font-bold text-lg mb-4 text-slate-800">📅 Rencana Kegiatan & Event</h3>
        
        {/* Form Tambah Event */}
        <form onSubmit={addEvent} className="space-y-3 mb-6">
          <input 
            type="text" 
            placeholder="Nama kegiatan (Contoh: Piknik ke Taman)..." 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text" 
              placeholder="Waktu (Cth: Jam 3 sore)..." 
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <input 
              type="text" 
              placeholder="Lokasi (Cth: Jakarta)..." 
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-pink-400 text-white font-bold rounded-2xl shadow-sm hover:bg-pink-500 transition flex items-center justify-center gap-2 cursor-pointer">
            <Plus size={18} /> Tambah Kegiatan
          </button>
        </form>

        {/* Daftar Event */}
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-4">Belum ada agenda kegiatan.</p>
          ) : (
            events.map(ev => (
              <div key={ev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">{ev.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {ev.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {ev.location}</span>
                  </div>
                </div>
                <button onClick={() => deleteEvent(ev.id)} className="text-slate-300 hover:text-red-400 transition p-1 cursor-pointer">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}