import React, { useState, useEffect } from 'react';
import './App.css';
import { Heart, LayoutDashboard, Settings, User as UserIcon, LogOut } from 'lucide-react';
import SmartwatchMonitor from './components/SmartwatchMonitor';
import BreathingExercise from './components/BreathingExercise';
import AIChatbot from './components/AIChatbot';
import HealthChart from './components/HealthChart';
import DoctorContact from './components/DoctorContact';
import Login from './components/Login';
import Profile from './components/Profile';
import SettingsView from './components/Settings';
import CopingStrategies from './components/CopingStrategies';

// Firebase imports
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [isAnxious, setIsAnxious] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Global App States
  const [guardian, setGuardian] = useState({ name: '', relation: '', phone: '', notifyOnPanic: true });
  const [appLanguage, setAppLanguage] = useState('English');
  const [theme, setTheme] = useState('light');

  // Apply theme to document body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.settings) {
              if (data.settings.guardian) setGuardian(data.settings.guardian);
              if (data.settings.appLanguage) setAppLanguage(data.settings.appLanguage);
              if (data.settings.theme) setTheme(data.settings.theme);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Loading SoulCare...</div>;
  }

  // If user is not logged in, show the Login screen
  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-accent-calm))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart color="white" size={24} />
          </div>
          <h1>SoulCare</h1>
        </div>
        
        <nav className="nav-links">
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} 
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem' }}
          >
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('profile')} 
            className={`nav-item ${currentView === 'profile' ? 'active' : ''}`} 
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem' }}
          >
            <UserIcon size={20} /> <span>Profile</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('settings')}
            className={`nav-item ${currentView === 'settings' ? 'active' : ''}`} 
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem' }}
          >
            <Settings size={20} /> <span>Settings</span>
          </button>
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'flex-start', color: 'var(--color-accent-critical)', fontSize: '1rem' }}>
            <LogOut size={20} /> <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-bar">
          <div className="greeting">
            <h2>{currentView === 'dashboard' ? 'Welcome back.' : currentView === 'profile' ? 'Your Profile.' : 'App Settings.'}</h2>
            <p>{currentView === 'dashboard' ? 'Your mental wellness is our priority today.' : currentView === 'profile' ? 'Keep your medical records up to date for better AI assistance.' : 'Customize your SoulCare experience.'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-secondary)', border: '2px solid var(--color-bg-tertiary)', overflow: 'hidden' }}>
              <img src={`https://ui-avatars.com/api/?name=${user.email || 'User'}&background=E1EFF6&color=1D4ED8`} alt="Profile" style={{ width: '100%' }} />
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{user.email}</span>
            </div>
          </div>
        </header>

        {currentView === 'dashboard' ? (
          <div className="dashboard-grid">
            {/* Left Panel */}
            <div className="left-panel">
              <SmartwatchMonitor onStressDetected={setIsAnxious} />
              <BreathingExercise autoStart={isAnxious} />
              <HealthChart />
            </div>

            <div className="right-panel">
              <DoctorContact guardian={guardian} />
              <CopingStrategies appLanguage={appLanguage} />
              <AIChatbot appLanguage={appLanguage} />
            </div>
          </div>
        ) : currentView === 'profile' ? (
          <Profile user={user} />
        ) : (
          <SettingsView 
            user={user}
            guardian={guardian} setGuardian={setGuardian} 
            appLanguage={appLanguage} setAppLanguage={setAppLanguage} 
            theme={theme} setTheme={setTheme}
          />
        )}
      </main>
    </div>
  );
}

export default App;
