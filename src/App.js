import React, { useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  auth, 
  googleProvider, 
  githubProvider
} from './firebaseConfig';
import LoggedIn from './LoggedIn';
import './theme.css';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      alert(error.message);
    }
  };

  const loginWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);
    } catch (error) {
      // handle account-exists-with-different-credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        // pending credential from the failed sign-in
        const pendingCred = GithubAuthProvider.credentialFromError
          ? GithubAuthProvider.credentialFromError(error)
          : error.credential;
        const email = error.customData?.email || error.email;
        if (!email) {
          alert('Email not available from error; cannot resolve automatically.');
          return;
        }

        // find which provider the email is already signed up with
        const methods = await fetchSignInMethodsForEmail(auth, email);
        const existingProviderId = methods[0]; // e.g. "google.com"

        // ask user to sign in with the existing provider and then link accounts
        if (existingProviderId === 'google.com') {
          const res = await signInWithPopup(auth, googleProvider);
          await linkWithCredential(res.user, pendingCred);
          setUser(res.user);
          return;
        }

        // fallback: tell the user which provider to use
        alert(`An account already exists with ${email}. Sign in using: ${existingProviderId}`);
      } else {
        alert(error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setUser(result.user);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUser(result.user);
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  if (user) {
    return <LoggedIn user={user} onLogout={handleLogout} />;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 20,
      position: 'relative'
    }}>
      <div style={{ position: 'fixed', top: 12, right: 12 }}>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            background: 'var(--btn-surface)',
            color: 'var(--text)',
            boxShadow: 'var(--shadow)'
          }}
        >
          {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
        </button>
      </div>

      <div className="glass-card" style={{ width: '300px' }}>
        <h1>Janrhick Pucio</h1>

        <form onSubmit={handleEmailAuth} style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px',
          width: '100%'
        }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--muted)',
              background: 'var(--btn-surface)',
              color: 'var(--text)',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--muted)',
              background: 'var(--btn-surface)',
              color: 'var(--text)',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%'
        }}>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>

          <button
            onClick={loginWithGoogle}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--btn-google)',
              color: 'white',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={loginWithGitHub}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--btn-github)',
              color: 'white',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
