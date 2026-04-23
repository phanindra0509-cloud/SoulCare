import React, { useState, useEffect } from 'react';
import { User, Activity, FileText, AlertCircle, Save } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Profile = ({ user }) => {
  // Initialize state with some dummy data or empty strings
  const [profileData, setProfileData] = useState({
    fullName: '',
    dob: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
    conditions: '',
    medications: '',
    allergies: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().profile) {
          setProfileData(prev => ({ ...prev, ...docSnap.data().profile }));
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), {
        profile: profileData
      }, { merge: true });
      alert("Profile information saved securely to your private database.");
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("Failed to save profile information. Please try again.");
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
  }

  const InputField = ({ label, name, type = "text", placeholder }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)' }}>{label}</label>
      <input 
        type={type}
        name={name}
        value={profileData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-tertiary)', backgroundColor: 'var(--color-bg-secondary)', outline: 'none', color: 'var(--color-text-primary)' }}
      />
    </div>
  );

  const TextAreaField = ({ label, name, placeholder }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)' }}>{label}</label>
      <textarea 
        name={name}
        value={profileData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        rows="3"
        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-tertiary)', backgroundColor: 'var(--color-bg-secondary)', outline: 'none', color: 'var(--color-text-primary)', resize: 'vertical' }}
      />
    </div>
  );

  return (
    <div className="card glass-panel animate-fade-in" style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--color-bg-tertiary)', paddingBottom: '1.5rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}><User size={24} color="var(--color-brand-primary)" /> Personal Profile</h2>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, marginTop: '0.5rem' }}>Manage your personal details and medical history.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={18} /> Save Settings
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Basic Information */}
        <section>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>
            <FileText size={18} color="var(--color-brand-primary)" /> Basic Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <InputField label="Full Name" name="fullName" placeholder="Jane Doe" />
            <InputField label="Date of Birth" name="dob" type="date" />
            <InputField label="Age" name="age" type="number" placeholder="28" />
            <InputField label="Gender" name="gender" placeholder="Female" />
          </div>
        </section>

        {/* Physical Metrics */}
        <section>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>
            <Activity size={18} color="var(--color-brand-primary)" /> Physical Metrics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <InputField label="Height (cm)" name="height" type="number" placeholder="170" />
            <InputField label="Weight (kg)" name="weight" type="number" placeholder="65" />
            <InputField label="Blood Type" name="bloodType" placeholder="O+" />
          </div>
        </section>

        {/* Medical History */}
        <section>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>
            <AlertCircle size={18} color="var(--color-accent-critical)" /> Medical History
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <TextAreaField 
              label="Pre-existing Mental Health Conditions" 
              name="conditions" 
              placeholder="e.g., General Anxiety Disorder, frequent panic attacks..." 
            />
            <TextAreaField 
              label="Current Medications" 
              name="medications" 
              placeholder="e.g., Escitalopram 10mg daily..." 
            />
            <TextAreaField 
              label="Known Allergies" 
              name="allergies" 
              placeholder="e.g., Penicillin, Peanuts..." 
            />
          </div>
        </section>

      </div>
    </div>
  );
};

export default Profile;
