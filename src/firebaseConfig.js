import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9MEhHhNk0UIXQOMHF5-TPZKXFFWrBYfI",
  authDomain: "pucio-auth-main.firebaseapp.com",
  projectId: "pucio-auth-main",
  storageBucket: "pucio-auth-main.firebasestorage.app",
  messagingSenderId: "554177781267",
  appId: "1:554177781267:web:854699ecab1cc5e53829e6",
  measurementId: "G-YMV5KZ1GY7"
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
