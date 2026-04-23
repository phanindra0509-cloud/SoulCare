import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJHsdmzQ33_VxdUiPiZ4APcuEVf5iKWJE",
  authDomain: "soulcare-4cd35.firebaseapp.com",
  projectId: "soulcare-4cd35",
  storageBucket: "soulcare-4cd35.firebasestorage.app",
  messagingSenderId: "529731047443",
  appId: "1:529731047443:web:c348ab3f875551ee562fe6",
  measurementId: "G-5NGC9EV642"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
