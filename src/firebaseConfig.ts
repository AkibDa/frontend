import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "greenplate-242c9.firebaseapp.com",
  projectId: "greenplate-242c9",
  storageBucket: "greenplate-242c9.firebasestorage.app",
  messagingSenderId: "1068433096042",
  appId: "1:1068433096042:web:9a4766108b35abc2d2f913",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db  =getFirestore(app);
