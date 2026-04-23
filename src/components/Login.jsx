import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(); // Navigate to main app
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="card glass-panel" style={{ width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem' }}>
        
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-accent-calm))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <Heart color="white" size={32} />
        </div>
        
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Welcome to SoulCare</h2>
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
          Your safe space for mental wellness. Please log in to continue.
        </p>

        <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <div style={{ color: 'var(--color-accent-critical)', fontSize: '0.875rem', textAlign: 'center', backgroundColor: '#FEE2E2', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-tertiary)', backgroundColor: 'var(--color-bg-secondary)', outline: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-tertiary)', backgroundColor: 'var(--color-bg-secondary)', outline: 'none' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          {isRegistering ? "Already have an account?" : "New to SoulCare?"}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ background: 'none', border: 'none', color: 'var(--color-brand-primary)', fontWeight: '600', cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            {isRegistering ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;
