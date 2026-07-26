import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGKc20Hue70wsSdrMrkAkEYKiK0kKgxA",
  authDomain: "hafidzi-family.firebaseapp.com",
  projectId: "hafidzi-family",
  storageBucket: "hafidzi-family.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:517039990063:web:420592418f710309e0edda"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);