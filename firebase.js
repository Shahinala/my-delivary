import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbFgem5RUj7zUr8oLoHh77uznsFbvEY74",
  authDomain: "delivery-count.firebaseapp.com",
  projectId: "delivery-count",
  storageBucket: "delivery-count.appspot.com",
  messagingSenderId: "501034218452",
  appId: "1:501034218452:web:cf0ab7a52f6e3108fbdc41",
  measurementId: "G-LH43RLZZ5B"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig); // একবার ইনিশিয়ালাইজ করা হচ্ছে
const db = getFirestore(firebaseApp); // Firestore এর জন্য ডাটাবেস ইন্সট্যান্স
const auth = getAuth(firebaseApp); // Auth এর জন্য ইন্সট্যান্স

// এক্সপোর্ট করা হচ্ছে যাতে অন্য ফাইলগুলোতে ব্যবহার করা যায়
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut };
export { db };