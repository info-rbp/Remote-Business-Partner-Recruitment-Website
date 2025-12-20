
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Using the provided environment API_KEY as the primary key for Firebase services
const firebaseConfig = {
  apiKey: process.env.API_KEY || "AIzaSyDummyKey",
  authDomain: "remote-business-partner.firebaseapp.com",
  projectId: "remote-business-partner",
  storageBucket: "remote-business-partner.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
