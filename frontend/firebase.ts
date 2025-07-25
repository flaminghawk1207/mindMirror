import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBprc6qlJboE8x1eq7e0Apufhm2RQ148VU",
  authDomain: "mindmirror-8a5b5.firebaseapp.com",
  projectId: "mindmirror-8a5b5",
  storageBucket: "mindmirror-8a5b5.firebasestorage.app",
  messagingSenderId: "559255569016",
  appId: "1:559255569016:web:0e26b599a82d2b81d2238d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 