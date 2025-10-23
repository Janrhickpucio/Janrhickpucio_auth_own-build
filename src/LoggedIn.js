import React from 'react';

export default function LoggedIn({ user, onLogout }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <img
        src={user.photoURL || ''}
        alt="avatar"
        style={{ width: 96, height: 96, borderRadius: '50%', marginBottom: 20 }}
      />
      <h1 style={{ color: 'var(--accent)' }}>Welcome, {user.displayName || user.email || 'user'}!</h1>
      <p style={{ marginTop: 8, color: 'var(--muted)' }}>{user.email}</p>

      <button
        onClick={onLogout}
        style={{
          padding: '10px 20px',
          marginTop: 20,
          border: 'none',
          borderRadius: '6px',
          backgroundColor: 'var(--btn-logout)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Logout
      </button>
    </div>
  );
}