import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldCheck, Volume2, Pause, Play, Square } from 'lucide-react';

const AIChatbot = ({ appLanguage = 'English' }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello, I am your SoulCare Clinical Assistant. I am here to provide professional psychological support and active listening. How can I assist you with your mental wellness today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // TTS State tracking [activeMessageId, status(playing/paused)]
  const [activeSpeech, setActiveSpeech] = useState({ id: null, status: 'idle' });
  
  const messagesEndRef = useRef(null);

  // Clean up speech synthesis if component unmounts
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          appLanguage: appLanguage
        })
      });

      if (!res.ok) {
        throw new Error(`Backend API Error: ${res.status}`);
      }

      const data = await res.json();
      
      if (!data.response) throw new Error("Empty response from AI backend");

      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: data.response }]);

    } catch (error) {
      console.warn("Connection to backend failed:", error.message);
      
      // Basic fallback if backend is unreachable
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "I'm having trouble connecting to my secure server right now. Please take a deep breath. You are safe here." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTTS = (msgId, text) => {
    if (activeSpeech.id === msgId) {
       // Toggle pause/play on current
       if (activeSpeech.status === 'playing') {
          window.speechSynthesis.pause();
          setActiveSpeech({ id: msgId, status: 'paused' });
       } else if (activeSpeech.status === 'paused') {
          window.speechSynthesis.resume();
          setActiveSpeech({ id: msgId, status: 'playing' });
       }
    } else {
       // Play entirely new message
       window.speechSynthesis.cancel();
       const utterance = new SpeechSynthesisUtterance(text);
       
       // Map to BCP-47 voice codes
       const LANG_CODES = { 'English':'en-US', 'Hindi':'hi-IN', 'Telugu':'te-IN', 'Tamil':'ta-IN', 'Kannada':'kn-IN', 'Malayalam':'ml-IN' };
       const targetLang = LANG_CODES[appLanguage] || 'en-US';
       utterance.lang = targetLang;
       
       const voices = window.speechSynthesis.getVoices();
       // Filter voices by selected language prefix (e.g. 'hi')
       const localVoices = voices.filter(v => v.lang.startsWith(targetLang.split('-')[0]));
       
       // Prioritize high-quality calming voices natively in that language
       const femaleVoice = localVoices.find(v => 
          v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira')
       ) || localVoices[0];
       
       if (femaleVoice) utterance.voice = femaleVoice;
       
       utterance.rate = 0.88; // Slightly slower to sound deliberate and conversational
       utterance.pitch = 1.15; // Softens the digital tone
       
       utterance.onend = () => setActiveSpeech({ id: null, status: 'idle' });
       utterance.onerror = () => setActiveSpeech({ id: null, status: 'idle' });
       
       window.speechSynthesis.speak(utterance);
       setActiveSpeech({ id: msgId, status: 'playing' });
    }
  };

  const handleStopTTS = () => {
     window.speechSynthesis.cancel();
     setActiveSpeech({ id: null, status: 'idle' });
  };

  return (
    <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '500px', padding: '0', overflow: 'hidden' }}>
      <div className="card-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-bg-tertiary)', margin: 0, backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#ffffff" />
          </div>
          <div>
            <h3 className="card-title" style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>SoulCare Clinical AI</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-calm)', fontWeight: '600' }}>● Active & Secure</span>
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#F8FAFC' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', width: '100%', maxWidth: msg.sender === 'user' ? '80%' : '100%' }}>
            
            {msg.sender === 'user' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem', fontWeight: '500' }}>You</span>
                <div style={{ padding: '1rem 1.25rem', borderRadius: '12px 12px 0 12px', backgroundColor: 'white', color: 'var(--color-text-primary)', border: '1px solid var(--color-bg-tertiary)', boxShadow: 'var(--shadow-sm)' }}>
                  <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: '1.5' }}>{msg.text}</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E1EFF6', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.25rem' }}>
                  <ShieldCheck size={16} color="var(--color-brand-dark)" />
                </div>
                <div style={{ flex: 1, paddingLeft: '1rem', borderLeft: '2px solid var(--color-brand-light)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600', display: 'block' }}>SoulCare Assistant</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleTTS(msg.id, msg.text)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: activeSpeech.id === msg.id ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)', padding: '0' }}
                        title={activeSpeech.id === msg.id && activeSpeech.status === 'playing' ? "Pause" : "Listen"}
                      >
                        {activeSpeech.id === msg.id && activeSpeech.status === 'playing' ? <Pause size={14} /> : <Volume2 size={14} />}
                      </button>
                      
                      {activeSpeech.id === msg.id && activeSpeech.status !== 'idle' && (
                         <button 
                           onClick={handleStopTTS}
                           style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-accent-critical)', padding: '0' }}
                           title="Stop"
                         >
                           <Square size={14} />
                         </button>
                      )}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              </div>
            )}
            
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E1EFF6', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={16} color="var(--color-brand-dark)" />
            </div>
            <div style={{ flex: 1, paddingLeft: '1rem', borderLeft: '2px solid var(--color-brand-light)', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem', fontWeight: '600', display: 'block' }}>SoulCare Assistant</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '0.5rem' }}>
                <span className="dot-typing" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-brand-primary)', animation: 'fade 1s infinite alternate' }}></span>
                <span className="dot-typing" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-brand-primary)', animation: 'fade 1s infinite alternate 0.3s' }}></span>
                <span className="dot-typing" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-brand-primary)', animation: 'fade 1s infinite alternate 0.6s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-bg-tertiary)', backgroundColor: '#ffffff', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Share how you're feeling securely..."
          style={{ flex: 1, padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid var(--color-bg-tertiary)', outline: 'none', backgroundColor: '#F8FAFC', color: 'var(--color-text-primary)', fontSize: '0.9375rem', transition: 'border 0.2s' }}
        />
        <button 
          onClick={handleSend}
          className="btn btn-primary" 
          style={{ padding: '0.875rem', borderRadius: '8px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;
