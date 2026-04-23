import React, { useState, useEffect, useRef } from 'react';
import { Wind, ArrowLeft, Play, CheckCircle2, ChevronRight, Settings2 } from 'lucide-react';

const EXERCISES = [
  { id: 'box', name: 'Box Breathing', desc: 'Equal 4s counts. Best for high stress.', pattern: [ {name: 'Inhale', t: 4}, {name: 'Hold', t: 4}, {name: 'Exhale', t: 4}, {name: 'Hold', t: 4} ] },
  { id: '478', name: '4-7-8 Breathing', desc: 'Best for deep relaxation and sleep.', pattern: [ {name: 'Inhale', t: 4}, {name: 'Hold', t: 7}, {name: 'Exhale', t: 8} ] },
  { id: 'res', name: 'Resonant Focus', desc: 'Smooth 5s inhale & exhale for balance.', pattern: [ {name: 'Inhale', t: 5}, {name: 'Exhale', t: 5} ] }
];

// Reusable alert sound (freesound or standard html5 audio fallback)
const ALARM_URL = "https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg"; 

const BreathingExercise = ({ autoStart }) => {
  const [view, setView] = useState('menu'); // 'menu', 'setup', 'active', 'finished'
  const [selectedEx, setSelectedEx] = useState(EXERCISES[0]);
  const [durationMins, setDurationMins] = useState(2);
  
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phase, setPhase] = useState('Ready'); 
  const [timer, setTimer] = useState(0); // Current phase timer
  const [timeLeft, setTimeLeft] = useState(0); // Master session timer
  const [isRunning, setIsRunning] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    // Auto-start Box Breathing for 2 mins if anxiety is detected globally
    if (autoStart && view !== 'active') {
      setSelectedEx(EXERCISES[0]); // Box Breathing
      setDurationMins(2);
      startSession(EXERCISES[0], 2);
    }
  }, [autoStart]);

  // Master Breathing Engine
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Handle Master Timer
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishSession();
          return 0;
        }
        return prev - 1;
      });

      // Handle Phase Timer
      setTimer((prevPhaseTimer) => {
        if (prevPhaseTimer > 1) return prevPhaseTimer - 1;

        // Transition to next phase in the pattern array
        const pArr = selectedEx.pattern;
        const nextIdx = (phaseIndex + 1) >= pArr.length ? 0 : phaseIndex + 1;
        setPhaseIndex(nextIdx);
        setPhase(pArr[nextIdx].name);
        return pArr[nextIdx].t;
      });
      
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phaseIndex, selectedEx]);

  const startSession = (exercise, mins) => {
    setSelectedEx(exercise);
    setTimeLeft(mins * 60);
    setPhaseIndex(0);
    setPhase(exercise.pattern[0].name);
    setTimer(exercise.pattern[0].t);
    setIsRunning(true);
    setView('active');
  };

  const finishSession = () => {
    setIsRunning(false);
    setView('finished');
    
    // Trigger Phone Vibration if supported
    if ("vibrate" in navigator) {
      navigator.vibrate([300, 100, 300, 100, 500]);
    }
    
    // Play Bell Sound
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
    }
  };

  const stopSession = () => {
    setIsRunning(false);
    setView('menu');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hidden Audio for finish bell */}
      <audio ref={audioRef} src={ALARM_URL} preload="auto" />

      {view === 'menu' && (
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            <Wind size={20} color="var(--color-brand-primary)" /> Breathing Exercises
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {EXERCISES.map(ex => (
              <div 
                key={ex.id} 
                onClick={() => { setSelectedEx(ex); setView('setup'); }}
                style={{ padding: '1rem', border: '1px solid var(--color-bg-tertiary)', borderRadius: '12px', backgroundColor: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border 0.2s' }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>{ex.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{ex.desc}</span>
                </div>
                <ChevronRight size={18} color="var(--color-text-secondary)" />
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'setup' && (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setView('menu')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><ArrowLeft size={20} color="var(--color-text-secondary)" /></button>
            <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>{selectedEx.name} Setup</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings2 size={16} /> How long do you want to breathe?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 5, 10].map(m => (
                  <button 
                    key={m}
                    onClick={() => setDurationMins(m)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: durationMins === m ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-bg-tertiary)', backgroundColor: durationMins === m ? 'rgba(59, 130, 246, 0.1)' : 'white', cursor: 'pointer', fontWeight: durationMins === m ? '600' : '400', color: 'var(--color-text-primary)' }}
                  >
                    {m} Min
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--color-bg-tertiary)' }}>
                 <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginLeft: '0.5rem', fontWeight: '500' }}>Custom Time:</span>
                 <input 
                   type="number" 
                   min="1" 
                   max="60" 
                   value={durationMins} 
                   onChange={(e) => setDurationMins(Math.max(1, parseInt(e.target.value) || 1))}
                   style={{ width: '60px', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-bg-tertiary)', textAlign: 'center', color: 'var(--color-text-primary)', outline: 'none', fontWeight: 'bold' }}
                 />
                 <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Minutes</span>
              </div>
            </div>
          </div>
          
          <button onClick={() => startSession(selectedEx, durationMins)} className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <Play size={18} /> Begin Session
          </button>
        </div>
      )}

      {view === 'active' && (
        <div style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-secondary)' }}>{selectedEx.name}</h3>
            <span style={{ fontWeight: '600', color: 'var(--color-brand-dark)', fontSize: '1.25rem' }}>{formatTime(timeLeft)}</span>
          </div>
          
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '2rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute',
              backgroundColor: 'var(--color-brand-light)',
              borderRadius: '50%',
              opacity: 0.3,
              transition: 'all 2s ease-in-out',
              width: phase === 'Inhale' ? '200px' : (phase.includes('Hold') ? '180px' : '120px'),
              height: phase === 'Inhale' ? '200px' : (phase.includes('Hold') ? '180px' : '120px'),
            }} />
            <div style={{
              position: 'absolute',
              backgroundColor: 'var(--color-brand-primary)',
              borderRadius: '50%',
              opacity: 0.2,
              transition: 'all 2s ease-in-out',
              width: phase === 'Inhale' ? '180px' : (phase.includes('Hold') ? '170px' : '100px'),
              height: phase === 'Inhale' ? '180px' : (phase.includes('Hold') ? '170px' : '100px'),
            }} />
            
            <div style={{ zIndex: 10, fontWeight: '600', color: 'var(--color-brand-dark)', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{phase}</span>
              <span style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)' }}>{timer}s</span>
            </div>
          </div>

          <button onClick={stopSession} className="btn" style={{ marginTop: '1.5rem', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}>
            End Exercise
          </button>
        </div>
      )}

      {view === 'finished' && (
        <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <CheckCircle2 size={48} color="var(--color-accent-calm)" />
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-primary)' }}>Session Complete</h2>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>You successfully completed {durationMins} minutes of {selectedEx.name}. Your vitals should be stabilizing.</p>
          </div>
          <button onClick={() => setView('menu')} className="btn btn-primary" style={{ width: '100%' }}>
            Return to Dashboard
          </button>
        </div>
      )}

    </div>
  );
};

export default BreathingExercise;
