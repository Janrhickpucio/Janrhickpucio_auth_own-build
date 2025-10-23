import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: 
  authDomain:
  projectId: 
  storageBucket: 
  messagingSenderId: 
  appId: 
  measurementId: 
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { 
  auth, 
  googleProvider, 
  githubProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
};

