import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PASSPHRASE = 'blackletter'; // Change this to your desired passphrase
const STORAGE_KEY = 'blackletter_passphrase_ok';

/**
 * PassphraseGate component blocks access to children until the correct passphrase is entered.
 */
export default function PassphraseGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (unlocked) {
      navigate('/');
    }
  }, [unlocked, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === PASSPHRASE) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setUnlocked(true);
    } else {
      setError('Incorrect passphrase.');
      setInput('');
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#111' }}>
      <form onSubmit={handleSubmit} style={{ background: '#222', padding: 32, borderRadius: 8, boxShadow: '0 2px 16px #0008', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label htmlFor="passphrase" style={{ color: '#fff', fontSize: 18 }}>Enter Passphrase</label>
        <input
          id="passphrase"
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ padding: 8, fontSize: 16, borderRadius: 4, border: '1px solid #444', background: '#181818', color: '#fff' }}
          autoFocus
        />
        <button type="submit" style={{ padding: 10, fontSize: 16, borderRadius: 4, background: '#444', color: '#fff', border: 'none', cursor: 'pointer' }}>Unlock</button>
        {error && <div style={{ color: '#f55', fontSize: 14 }}>{error}</div>}
      </form>
    </div>
  );
}
