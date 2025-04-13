
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-3d902.firebaseapp.com",
  projectId: "blog-app-3d902",
  storageBucket: "blog-app-3d902.firebasestorage.app",
  messagingSenderId: "898308706868",
  appId: "1:898308706868:web:c73ced0e05074bf03a3061"
};

export const app = initializeApp(firebaseConfig);