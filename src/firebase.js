import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfhR47hY24jPvmB1vJV-ByF6a80g9UGgc",
  authDomain: "devicecure-91aa.firebaseapp.com",
  projectId: "devicecure-91aa",
  storageBucket: "devicecure-91aa.firebasestorage.app",
  messagingSenderId: "845265210711",
  appId: "1:845265210711:web:0dc3dfddcb47fecf630212"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
