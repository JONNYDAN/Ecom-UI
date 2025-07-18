import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkcyhAn5EksjnXp0D4dlhyk3GfdOKsauE",
  authDomain: "ecom-29213.firebaseapp.com",
  projectId: "ecom-29213",
  storageBucket: "ecom-29213.firebasestorage.app",
  messagingSenderId: "355433958047",
  appId: "1:355433958047:web:ca770151b700e3a25b70aa",
  measurementId: "G-F2X87RFRLP"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };