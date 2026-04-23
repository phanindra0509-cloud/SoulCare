import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, HeartPulse, Link2 } from 'lucide-react';

const SmartwatchMonitor = ({ onStressDetected }) => {
  const [heartRate, setHeartRate] = useState(72);
  const [stressLevel, setStressLevel] = useState('Low');
  const [isAnxious, setIsAnxious] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isUsingRealDevice, setIsUsingRealDevice] = useState(false);

  // Handle Bluetooth Connection with Real-Time GATT Data
  const handleConnectBluetooth = async () => {
    if (!navigator.bluetooth) {
      alert("Web Bluetooth API is not available in your browser.");
      return;
    }

    try {
      // Trigger the browser's native Bluetooth pairing dialog looking for Heart Rate monitors
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['heart_rate']
      });
      
      console.log(`Paired to: ${device.name}. Connecting to GATT Server...`);
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');

      // Start streaming data in real-time
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        // Standard BLE Heart Rate Measurement format: 2nd byte is usually the BPM if 8-bit format
        const currentBpm = value.getUint8(1);
        setHeartRate(currentBpm);
        
        // Auto-detect anxiety spike from real data
        if (currentBpm > 100) {
           setStressLevel('High');
           setIsAnxious(true);
           if(onStressDetected) onStressDetected(true);
        } else {
           setStressLevel('Low');
        }
      });

      setIsUsingRealDevice(true);
      setIsConnected(true);
      alert(`Successfully connected to ${device.name} in Real-Time!`);
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      
      if (error.name === 'NotFoundError') {
        alert("Your device connected, but it refused to share open Heart Rate data (many consumer smartwatches like Apple/Samsung restrict this to their own apps).");
      } else if (error.name === 'NotAllowedError') {
        alert("Bluetooth pairing was cancelled.");
      } else {
        alert("Bluetooth connection failed.");
      }
      
      // Do not fall back to simulator automatically. Remain disconnected so BPM is hidden.
      setIsConnected(false);
      setIsUsingRealDevice(false);
    }
  };

  const handleVirtualDevice = () => {
    // Activating Virtual Demo triggers the simulated BPM changes
    setIsUsingRealDevice(false); 
    setIsConnected(true);
    alert("Connected to 'SoulCare Virtual Wearable' via simulated BLE.");
  };

  // Simulate Smartwatch data reading
  useEffect(() => {
    if (!isConnected || isUsingRealDevice) return;

    const interval = setInterval(() => {
      // Randomly spike heart rate occasionally to simulate an anxiety attack
      const chance = Math.random();
      if (chance > 0.85 && !isAnxious) {
        setHeartRate(prev => Math.min(prev + 35, 130)); // Spike
        setStressLevel('High');
        setIsAnxious(true);
        if(onStressDetected) onStressDetected(true);
      } else if (!isAnxious) {
        // Normal fluctuation
        setHeartRate(prev => {
          const newRate = prev + (Math.random() > 0.5 ? 2 : -2);
          return Math.max(60, Math.min(newRate, 85));
        });
        setStressLevel('Low');
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [isAnxious, isConnected, isUsingRealDevice, onStressDetected]);

  // Reset function after exercise
  const resetVitals = () => {
    setIsAnxious(false);
    setHeartRate(72);
    setStressLevel('Low');
    if(onStressDetected) onStressDetected(false);
  };

  return (
    <div className="card glass-panel animate-fade-in" style={{ backgroundColor: isAnxious ? 'rgba(239, 68, 68, 0.05)' : '' }}>
      <div className="card-header">
        <h3 className="card-title"><Activity size={20} color="var(--color-brand-primary)" /> Smartwatch Sync</h3>
        {!isConnected ? (
          <Link2 size={24} color="var(--color-text-secondary)" style={{ opacity: 0.5 }} />
        ) : isAnxious ? (
          <AlertTriangle size={24} color="var(--color-accent-critical)" className="btn-pulse" />
        ) : (
          <CheckCircle size={24} color="var(--color-accent-calm)" />
        )}
      </div>
      
      {!isConnected ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem', marginBottom: '0.5rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 'var(--border-radius)' }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>Your smartwatch is not connected.</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={handleConnectBluetooth}>
              Pair Watch
            </button>
            <button className="btn btn-secondary" onClick={handleVirtualDevice} style={{ backgroundColor: 'var(--color-bg-tertiary)', border: 'none' }}>
              Virtual Demo
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Current Heart Rate</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: isAnxious ? 'var(--color-accent-critical)' : 'var(--color-text-primary)' }}>
                  {Math.round(heartRate)}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>BPM</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Status</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '600', color: isAnxious ? 'var(--color-accent-critical)' : 'var(--color-accent-calm)' }}>
                {isUsingRealDevice ? 'Live' : 'Simulated'}
              </span>
            </div>
          </div>

          {isAnxious && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-accent-critical)' }}>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: '500', marginBottom: '0.5rem' }}>We detected a sudden spike in your vitals.</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>It looks like you might be experiencing anxiety. We are here to help. Please try the breathing exercise.</p>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={resetVitals}>
                I'm feeling better now
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SmartwatchMonitor;
