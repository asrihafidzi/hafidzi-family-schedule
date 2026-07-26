import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Utensils, Plus, Trash2 } from 'lucide-react';

export default function MenuManager() {
  const [menus, setMenus] = useState([]);
  const [menuItem, setMenuItem] = useState('');

  // Mengambil data secara real-time dari Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menus'), (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenus(menuData);
    });
    return () => unsubscribe();
  }, []);

  const addMenu = async (e) => {
    e.preventDefault();
    if (!menuItem.trim()) return;

    try {
      await addDoc(collection(db, 'menus'), {
        name: menuItem,
        createdAt: Date.now()
      });
      setMenuItem('');
    } catch (error) {
      console.error("Gagal menambah menu: ", error);
    }
  };

  const deleteMenu = async (id) => {
    try {
      await deleteDoc(doc(db, 'menus', id));
    } catch (error) {
      console.error("Gagal menghapus menu: ", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h3 className="font-serif font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
          <span className="p-2 bg-amber-50 text-amber-500 rounded-2xl"><Utensils size={18} /></span>
          Daftar Menu Makanan 🍳
        </h3>

        {/* Form Tambah Menu */}
        <form onSubmit={addMenu} className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="Contoh: Rendang Daging, Soto Ayam..." 
            value={menuItem}
            onChange={(e) => setMenuItem(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button type="submit" className="px-5 py-3 bg-amber-400 text-white font-bold rounded-2xl shadow-md shadow-amber-100 hover:bg-amber-500 transition flex items-center justify-center gap-2 text-sm">
            <Plus size={18} /> Tambah
          </button>
        </form>

        {/* Daftar List Menu */}
        <div className="space-y-2.5">
          {menus.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-4">Belum ada daftar menu makanan.</p>
          ) : (
            menus.map(m => (
              <div key={m.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex justify-between items-center transition hover:bg-slate-50">
                <span className="text-sm font-medium text-slate-700">{m.name}</span>
                <button onClick={() => deleteMenu(m.id)} className="text-slate-300 hover:text-red-400 transition p-1.5 rounded-xl hover:bg-red-50">
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