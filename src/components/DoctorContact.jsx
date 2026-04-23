import React from 'react';
import { PhoneCall, MessageSquareWarning } from 'lucide-react';

const DoctorContact = ({ guardian }) => {
  
  const handleContact = (type) => {
    if (!guardian || !guardian.phone) {
      alert("Please configure your Guardian's phone number in Settings first!");
      return;
    }
    
    if (type === 'call') {
      window.location.href = `tel:${guardian.phone}`;
    } else if (type === 'sms') {
      // Create a pre-filled panic message
      const message = encodeURIComponent("I am currently experiencing severe anxiety/panic. Please help or check in on me.");
      window.location.href = `sms:${guardian.phone}?body=${message}`;
    }
  };

  return (
    <div className="card glass-panel" style={{ backgroundColor: 'white' }}>
      <div className="card-header">
        <h3 className="card-title">Professional Help</h3>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
        If you are feeling overwhelmed, it is always okay to ask for professional help immediately. 
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={() => handleContact('call')}
          className="btn" 
          style={{ 
            backgroundColor: 'var(--color-bg-primary)', 
            color: 'var(--color-brand-dark)',
            border: '1px solid var(--color-brand-light)'
          }}
        >
          <PhoneCall size={18} />
          {guardian?.name ? `Call ${guardian.name}` : "Call Doctor"}
        </button>
        
        <button 
          onClick={() => handleContact('sms')}
          className="btn" 
          style={{ 
            backgroundColor: 'var(--color-accent-critical)', 
            color: 'white',
            border: 'none'
          }}
        >
          <MessageSquareWarning size={18} />
          Text Emergency Contact (SOS)
        </button>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-bg-tertiary)', paddingTop: '1.5rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Hyderabad Resources
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div>
               <p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Tele MANAS (Free 24/7)</p>
               <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Govt Mental Health Helpline</p>
            </div>
             <a href="tel:14416" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>14416</a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div>
               <p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Mindtalk Clinics</p>
               <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Psychiatrists in Hyderabad</p>
            </div>
             <a href="tel:+917353400999" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Call</a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div>
               <p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Goutam Neuro Care</p>
               <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Stress & Anxiety Treatments</p>
            </div>
             <a href="tel:+919666219699" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Call</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DoctorContact;
