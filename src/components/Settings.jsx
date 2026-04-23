import React from 'react';
import { Settings as SettingsIcon, Shield, Moon, Sun, Monitor, Bell, Globe } from 'lucide-react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Settings = ({ user, guardian, setGuardian, appLanguage, setAppLanguage, theme, setTheme }) => {
  
  const saveSettingsToFirestore = async (newSettings) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), {
        settings: newSettings
      }, { merge: true });
    } catch (error) {
      console.error("Error saving settings to Firestore:", error);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    saveSettingsToFirestore({ theme: newTheme });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setAppLanguage(newLang);
    saveSettingsToFirestore({ appLanguage: newLang });
  };

  const handleGuardianChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGuardian(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSaveGuardian = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), {
        settings: { guardian }
      }, { merge: true });
      alert("Guardian Settings Saved!");
    } catch (error) {
      console.error("Error saving guardian data:", error);
      alert("Failed to save Guardian Settings. Please try again.");
    }
  };

  return (
    <div className="card glass-panel animate-fade-in" style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--color-bg-tertiary)', paddingBottom: '1.5rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}><SettingsIcon size={24} color="var(--color-brand-primary)" /> Application Settings</h2>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, marginTop: '0.5rem' }}>Preferences and emergency contacts.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Appearance Settings */}
        <section>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>
            <Monitor size={18} color="var(--color-brand-primary)" /> Appearance
          </h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => handleThemeChange('light')}
              style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: theme === 'light' ? '2px solid var(--color-brand-primary)' : '2px solid var(--color-bg-tertiary)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <Sun size={18} /> Light Mode
            </button>
            <button 
              onClick={() => handleThemeChange('dark')}
              style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: theme === 'dark' ? '2px solid var(--color-brand-primary)' : '2px solid var(--color-bg-tertiary)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <Moon size={18} /> Dark Mode
            </button>
          </div>
        </section>

        {/* Localization & Language */}
        <section>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>
            <Globe size={18} color="var(--color-brand-primary)" /> Voice & AI Language
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Choose the language SoulCare will read aloud and chat with you in.
          </p>
          <select 
            value={appLanguage} 
            onChange={handleLanguageChange}
            style={{ width: '100%', maxWidth: '300px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-tertiary)', backgroundColor: 'var(--color-bg-secondary)', outline: 'none', color: 'var(--color-text-primary)', fontSize: '1rem' }}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिन्दी)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
          </select>
        </section>

        {/* Guardian Information */}
        <section>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>
            <Shield size={18} color="var(--color-accent-calm)" /> Guardian / Emergency Contact
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            This person will be automatically suggested in the SOS dashboard and can receive SMS updates if you allow it.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)' }}>Guardian Name</label>
              <input 
                type="text"
                name="name"
                value={guardian.name}
                onChange={handleGuardianChange}
                placeholder="e.g. John Doe"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-tertiary)', backgroundColor: 'var(--color-bg-secondary)', outline: 'none', color: 'var(--color-text-primary)' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)' }}>Relationship</label>
              <input 
                type="text"
                name="relation"
                value={guardian.relation}
                onChange={handleGuardianChange}
                placeholder="e.g. Spouse, Parent"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-tertiary)', backgroundColor: 'var(--color-bg-secondary)', outline: 'none', color: 'var(--color-text-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)' }}>Phone Number</label>
              <input 
                type="tel"
                name="phone"
                value={guardian.phone}
                onChange={handleGuardianChange}
                placeholder="(123) 456-7890"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-tertiary)', backgroundColor: 'var(--color-bg-secondary)', outline: 'none', color: 'var(--color-text-primary)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-bg-tertiary)' }}>
            <input 
              type="checkbox" 
              name="notifyOnPanic"
              id="notifyPanic"
              checked={guardian.notifyOnPanic} 
              onChange={handleGuardianChange}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="notifyPanic" style={{ cursor: 'pointer', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={16} color="var(--color-accent-warning)" />
              Automatically send an SMS to my guardian if a panic attack is detected by my smartwatch.
            </label>
          </div>

          <button className="btn btn-primary" onClick={handleSaveGuardian}>
            Verify and Save Guardian
          </button>
        </section>

      </div>
    </div>
  );
};

export default Settings;
