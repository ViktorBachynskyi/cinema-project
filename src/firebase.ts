import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCd3rO1aqyJ8nVunTNU841zkRFc-uyxgds",
  authDomain: "cinema-1da46.firebaseapp.com",
  projectId: "cinema-1da46",
  storageBucket: "cinema-1da46.firebasestorage.app",
  messagingSenderId: "915993641719",
  appId: "1:915993641719:web:f47b7fae69da91d96e09f2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;