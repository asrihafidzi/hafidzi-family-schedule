import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export default function TodoManager({ currentUser }) {
  // Cek apakah yang login adalah orang tua (Rezqi atau Asri)
  const isParent = currentUser && (currentUser.name === 'Rezqi' || currentUser.name === 'Asri');

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('hafidzi_parent_todos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      { id: 1, text: 'Beli token listrik bulanan', completed: false },
      { id: 2, text: 'Bayar SPP sekolah anak-anak', completed: true }
    ];
  });
  
  const [newText, setNewText] = useState('');

  // Simpan permanen ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('hafidzi_parent_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newItem = {
      id: Date.now(),
      text: newText,
      completed: false
    };

    setTodos([newItem, ...todos]);
    setNewText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  // Jika yang login BUKAN orang tua (alias anak-anak), tampilkan halaman khusus terkunci
  if (!isParent) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center space-y-4 my-auto">
        <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
          <Lock size={32} />
        </div>
        <div>
          <h3 className="font-serif font-bold text-xl text-slate-800">Area Khusus Orang Tua</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Maaf {currentUser.name}, daftar tugas ini bersifat rahasia dan hanya dapat diakses oleh Papa (Rezqi) dan Ibu (Asri).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Kartu Informasi Khusus */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-6 rounded-[2.5rem] shadow-sm text-white relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 text-white/10">
          <Sparkles size={96} />
        </div>
        <div className="relative z-10">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-[10px] font-bold rounded-full uppercase tracking-wider">
            🔒 Rahasia Orang Tua
          </span>
          <h3 className="font-serif text-xl font-bold mt-2">Daftar Tugas & Catatan Papa-Ibu</h3>
          <p className="text-xs text-purple-100 mt-1">Data tersimpan otomatis dan aman dari intipan anak-anak.</p>
        </div>
      </div>

      {/* Main Box */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h3 className="font-serif font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
          <span className="p-2 bg-pink-50 text-pink-500 rounded-2xl"><CheckSquare size={18} /></span>
          Kelola Tugas
        </h3>
        
        {/* Form Tambah */}
        <form onSubmit={addTodo} className="space-y-3 mb-6">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Tulis tugas baru (misal: Beli kebutuhan bulanan)..." 
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button type="submit" className="px-5 py-3 bg-pink-400 text-white font-bold rounded-2xl shadow-sm hover:bg-pink-500 transition flex items-center justify-center cursor-pointer">
              <Plus size={20} />
            </button>
          </div>
        </form>

        {/* List Tugas */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-4">Belum ada tugas tercatat.</p>
          ) : (
            todos.map(todo => (
              <div 
                key={todo.id} 
                className={`p-4 rounded-2xl border transition flex items-center justify-between ${todo.completed ? 'bg-slate-50/50 border-slate-100 opacity-75' : 'bg-slate-50 border-slate-200'}`}
              >
                <div className="flex items-center gap-3 flex-1 pr-2">
                  <button 
                    onClick={() => toggleTodo(todo.id)}
                    className={`text-xl transition cursor-pointer ${todo.completed ? 'text-green-500' : 'text-slate-300 hover:text-pink-400'}`}
                  >
                    <CheckCircle2 size={22} className={todo.completed ? 'fill-green-100' : ''} />
                  </button>
                  <span className={`text-sm font-medium ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {todo.text}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTodo(todo.id)} 
                  className="text-slate-300 hover:text-red-400 transition p-1.5 rounded-xl hover:bg-red-50 cursor-pointer"
                >
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