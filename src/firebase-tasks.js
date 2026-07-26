import { db } from './firebase-config';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';

/**
 * Struktur dokumen tugas (Task) yang disarankan:
 * {
 *   title: "Nama Tugas",
 *   assignee: "ID Anggota Keluarga",
 *   completed: false,
 *   dueDate: Timestamp,
 *   points: 10,
 *   createdAt: serverTimestamp()
 * }
 */


// 1. Menambah tugas baru ke koleksi 'tasks'
export const addNewTask = async (title, assigneeId, points = 10) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      title,
      assignee: assigneeId,
      completed: false,
      points: points,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Gagal menambah tugas:", error);
    throw error;
  }
};

// 2. Mendengarkan perubahan tugas secara real-time berdasarkan anggota
export const subscribeToMemberTasks = (memberId, callback) => {
  const q = query(
    collection(db, "tasks"), 
    where("assignee", "==", memberId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(tasks);
  });
};