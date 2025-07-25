import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaZx_SMB46BDISq7J_g2zT-puy2uKaRgA",
  authDomain: "tutor-hcmue.firebaseapp.com",
  databaseURL: "https://tutor-hcmue-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tutor-hcmue",
  storageBucket: "tutor-hcmue.firebasestorage.app",
  messagingSenderId: "617799958380",
  appId: "1:617799958380:web:f63f2e90ececf7537e7d49",
  measurementId: "G-QQJM942KD1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);