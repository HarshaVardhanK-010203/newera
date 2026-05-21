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

// Setup config wrapper. If credentials are empty during initial setup,
// we will run standard initializeApp with empty parameters or custom descriptors
const firebaseConfig = {
  apiKey: "env-mock-api-key-safe-for-previewing-webdev-academy",
  authDomain: "webdev-academy.firebaseapp.com",
  projectId: "webdev-academy",
  storageBucket: "webdev-academy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:123456789"
};

let app;
let auth: any;
let db: any;
let googleProvider: any;
let githubProvider: any;
let isRealFirebase = false;

try {
  // If the sandbox provides native applet config json, load it
  const activeConfig = require("./firebase-applet-config.json");
  if (activeConfig && activeConfig.apiKey) {
    app = initializeApp(activeConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();
    isRealFirebase = true;
    console.log("🔥 Firebase initialized successfully with cloud configuration.");
  }
} catch (e) {
  // Fallback safe initialization
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();
    console.log("📦 Loaded standard Firebase Sandbox Wrapper successfully.");
  } catch (err) {
    console.warn("⚠️ Firebase configuration error, using mock authentication context:", err);
  }
}

export {
  app,
  auth,
  db,
  googleProvider,
  githubProvider,
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
