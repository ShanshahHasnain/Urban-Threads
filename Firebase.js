// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfzHM8PNEG5MnQ2pkAemgUIA5AyU3oyIc",
  authDomain: "urban-threads-fa6b9.firebaseapp.com",
  databaseURL: "https://urban-threads-fa6b9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "urban-threads-fa6b9",
  storageBucket: "urban-threads-fa6b9.firebasestorage.app",
  messagingSenderId: "84962872666",
  appId: "1:84962872666:web:945ce941a297f37419f763"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

const database = getDatabase(app);

// Export
export { auth, database };