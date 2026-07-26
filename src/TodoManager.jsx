import React, { useState, useEffect } from 'react';
// Sesuaikan import firebase jika Anda menyimpannya di file terpisah, 
// tapi untuk amannya kita buat mandiri di sini juga bisa.

export default function TodoManager({ userId }) {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Merapikan tempat tidur', completed: false },
    { id: 2, title: 'Belajar Matematika 30 menit', completed: false }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
      <h2 className="text-lg font-semibold text-stone-800 mb-4">Daftar Tugas Keluarga</h2>
      
      {/* Form Tambah Tugas */}
      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Tambah tugas baru..."
          className="flex-1 px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
        <button
          type="submit"
          className="bg-stone-800 text-white px-4 py-2 rounded-xl font-medium hover:bg-stone-700 transition"
        >
          Tambah
        </button>
      </form>

      {/* List Tugas */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              task.completed ? 'bg-stone-50 border-stone-200 line-through text-stone-400' : 'bg-white border-stone-100 hover:border-stone-300'
            }`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {}} // Ditangani oleh div di atasnya
              className="w-4 h-4 rounded text-stone-800 accent-stone-800"
            />
            <span className="text-sm font-medium">{task.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}