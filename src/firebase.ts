import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Setup config wrapper with exact requested details
const firebaseConfig = {
  apiKey: "AIzaSyDySEIdATIZzifTxI-Njdqvd6ZvTwGhKAI",
  authDomain: "newera-f1fd6.firebaseapp.com",
  projectId: "newera-f1fd6",
  storageBucket: "newera-f1fd6.firebasestorage.app",
  messagingSenderId: "1058723890974",
  appId: "1:1058723890974:web:9717cbacb17242d6522b0f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const provider = googleProvider; // alias matching user request
const isRealFirebase = true;

export {
  app,
  auth,
  db,
  googleProvider,
  githubProvider,
  provider,
  isRealFirebase,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged
};
