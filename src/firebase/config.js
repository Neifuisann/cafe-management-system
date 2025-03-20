// Firebase configuration for the cafe management system
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU8tY1xrHgNVMGs7S4kvInl3GNYH-Ku7U",
  authDomain: "warm-buckeye-450609-r4.firebaseapp.com",
  projectId: "warm-buckeye-450609-r4",
  storageBucket: "warm-buckeye-450609-r4.firebasestorage.app",
  messagingSenderId: "743390997812",
  appId: "1:743390997812:web:5d83c67c484e967715c961",
  measurementId: "G-WTZMZ8DWMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }; 