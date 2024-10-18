// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; 

const firebaseConfig = {
  apiKey: "AIzaSyBkUQie-MWABGwLfU2u82fD7neo7Ven630",
  authDomain: "auth---development-9e3d7.firebaseapp.com",
  projectId: "auth---development-9e3d7",
  storageBucket: "auth---development-9e3d7.appspot.com",
  messagingSenderId: "274675114100",
  appId: "1:274675114100:web:79397a630e36586822f121"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
