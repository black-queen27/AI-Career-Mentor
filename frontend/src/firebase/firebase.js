import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-pQH_5oGHo6_vjYArn1_wVUH3Udb0rwY",
  authDomain: "airesume2007.firebaseapp.com",
  projectId: "airesume2007",
  storageBucket: "airesume2007.firebasestorage.app",
  messagingSenderId: "87654396335",
  appId: "1:87654396335:web:7e7f79f07d83c77d22ff5a",
  measurementId: "G-8WEH4KQ0D5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;