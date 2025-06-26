// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
	apiKey: "AIzaSyCsyXBbS_xvK-SnjHDgDaEcB6-eUBUI4B4",
	authDomain: "chat-3c4a4.firebaseapp.com",
	projectId: "chat-3c4a4",
	storageBucket: "chat-3c4a4.firebasestorage.app",
	messagingSenderId: "376951286568",
	appId: "1:376951286568:web:7e9df020d42a860972fe1d",
	measurementId: "G-H0G5Z86E49"
   };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth (compatible Expo Go)
export const auth = getAuth(app);

// database
export const firestore = getFirestore(app);
export const storage = getStorage(app);
