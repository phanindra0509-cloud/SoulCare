import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Brain, HeartCrack, Zap, Moon, AlertOctagon, Pause, Play, Square } from 'lucide-react';

// Minimal translation dictionary for the Coping Library
const TRANSLATIONS = {
  English: [
    { id: 'panic', title: 'Panic Attack', icon: <AlertOctagon size={18} color="var(--color-accent-critical)" />, advice: ["Acknowledge it is a panic attack, and it will physically pass.", "Grounding: Splash cold water on your face or hold an ice cube.", "The 5-4-3-2-1 Method: Focus on 5 things you see, 4 you touch, 3 you hear, 2 smell, 1 taste.", "Use the Guided Breathing tool."] },
    { id: 'anxiety', title: 'High Anxiety', icon: <Brain size={18} color="var(--color-brand-primary)" />, advice: ["Limit caffeine immediately and drink cold water.", "Challenge spiraling thoughts: 'What evidence do I have?'", "Do a brain dump: Write down everything making you anxious.", "Channel adrenaline into a quick walk."] },
    { id: 'depression', title: 'Depressive Episode', icon: <HeartCrack size={18} color="#6366F1" />, advice: ["Lower your expectations today. Basic hygiene is enough.", "Break tasks into micro-steps.", "Get 5 minutes of direct sunlight.", "Reach out to a safe friend."] },
    { id: 'burnout', title: 'Burnout & Overstimulation', icon: <Zap size={18} color="#F59E0B" />, advice: ["Step into a dark room for 15 mins without screens.", "Practice 'No' as a full sentence.", "Do a low-dopamine repetitive task.", "Use 4-7-8 breathing."] },
    { id: 'insomnia', title: 'Insomnia', icon: <Moon size={18} color="#8B5CF6" />, advice: ["Get out of bed if awake for 20 mins and do something boring.", "Do not look at the clock.", "Relax every muscle starting from your face (Military Method).", "Use the Breathing Exercise tool."] }
  ],
  Hindi: [
    { id: 'panic', title: 'पैनिक अटैक (Panic Attack)', icon: <AlertOctagon size={18} color="var(--color-accent-critical)" />, advice: ["स्वीकार करें कि यह एक पैनिक अटैक है और यह गुजर जाएगा।", "ठंडे पानी से चेहरा धोएं या बर्फ का टुकड़ा पकड़ें।", "५-४-३-२-१ नियम अपनाएं: ५ चीजें जो आप देखते हैं, ४ जिन्हें छू सकते हैं, ३ जो सुनते हैं।", "ब्रीदिंग टूल का उपयोग करें।"] },
    { id: 'anxiety', title: 'उच्च चिंता (High Anxiety)', icon: <Brain size={18} color="var(--color-brand-primary)" />, advice: ["कैफीन को तुरंत कम करें और पानी पिएं।", "अपने विचारों को चुनौती दें।", "अपनी सभी चिंताओं को एक कागज पर लिखें।", "अतिरिक्त ऊर्जा को टहलने में लगाएं।"] },
    { id: 'depression', title: 'अवसाद (Depressive Episode)', icon: <HeartCrack size={18} color="#6366F1" />, advice: ["आज उम्मीदें कम रखें।", "कार्यों को छोटे-छोटे कदमों में बांटें।", "५ मिनट के लिए धूप में रहें।", "किसी मित्र से बात करें।"] },
    { id: 'burnout', title: 'अत्यधिक थकान (Burnout)', icon: <Zap size={18} color="#F59E0B" />, advice: ["१५ मिनट के लिए बिना स्क्रीन के एक शांत कमरे में बैठें।", "ना कहना सीखें।", "कोई सरल और दोहराए जाने वाला कार्य करें।", "४-७-८ श्वास व्यायाम करें।"] },
    { id: 'insomnia', title: 'अनिद्रा (Insomnia)', icon: <Moon size={18} color="#8B5CF6" />, advice: ["अगर २० मिनट में नींद न आए, तो उठें और कुछ उबाऊ काम करें।", "घड़ी मत देखें।", "मांसपेशियों को आराम दें।", "श्वास व्यायाम करें।"] }
  ],
  Telugu: [
    { id: 'panic', title: 'భయాందోళన (Panic Attack)', icon: <AlertOctagon size={18} color="var(--color-accent-critical)" />, advice: ["ఇది పానిక్ ఎటాక్ అని గుర్తించండి, ఇది త్వరలో తగ్గిపోతుంది.", "ముఖం మీద చల్లటి నీరు చల్లుకోండి.", "కంటికి కనిపించే 5 వస్తువులను, చేతితో తాకగలిగే 4 వస్తువులను పరిశీలించండి.", "శ్వాస వ్యాయామం చేయండి."] },
    { id: 'anxiety', title: 'తీవ్ర ఆందోళన (Anxiety)', icon: <Brain size={18} color="var(--color-brand-primary)" />, advice: ["కాఫీ తాగడం తగ్గించి, చల్లటి నీరు తాగండి.", "ప్రతికూల ఆలోచనలను ప్రశ్నించుకోండి.", "మీ ఆందోళనలను ఒక కాగితంపై రాయండి.", "కొద్దిసేపు నడవండి."] },
    { id: 'depression', title: 'నిరాశ (Depression)', icon: <HeartCrack size={18} color="#6366F1" />, advice: ["ఈరోజు మీ నుండి తక్కువ ఆశించండి.", "పనులను చిన్నవిగా విభజించండి.", "5 నిమిషాలు ఎండలో ఉండండి.", "ఆత్మీయులతో మాట్లాడండి."] },
    { id: 'burnout', title: 'మానసిక అలసట (Burnout)', icon: <Zap size={18} color="#F59E0B" />, advice: ["15 నిమిషాలు ప్రశాంతంగా, చీకటి గదిలో కూర్చోండి.", "కాదు అని చెప్పడం సాధన చేయండి.", "సాధారణ పనులపై దృష్టి పెట్టండి.", "గాఢంగా శ్వాస పీల్చుకోండి."] },
    { id: 'insomnia', title: 'నిద్రలేమి (Insomnia)', icon: <Moon size={18} color="#8B5CF6" />, advice: ["20 నిమిషాలైనా నిద్ర రాకపోతే మంచం పైనుంచి లేచి పుస్తకం చదవండి.", "గడియారం వంక చూడకండి.", "మీ కండరాలను సడలించండి.", "శ్వాస వ్యాయామం చేయండి."] }
  ],
  Tamil: [
    { id: 'panic', title: 'பீதி (Panic Attack)', icon: <AlertOctagon size={18} color="var(--color-accent-critical)" />, advice: ["இது ஒரு பீதி தாக்குதல் என்பதை உணருங்கள், இது கடந்துபோகும்.", "முகத்தில் குளிர்ந்த நீரை தெளிக்கவும்.", "சுற்றுப்புறத்தில் உள்ள பொருட்களை கவனிக்கவும்.", "மூச்சுப்பயிற்சி செய்யுங்கள்."] },
    { id: 'anxiety', title: 'அதிக கவலை (Anxiety)', icon: <Brain size={18} color="var(--color-brand-primary)" />, advice: ["காபியை குறைத்து நீர் அருந்தவும்.", "எதிர்மறை எண்ணங்களை கேளுங்கள்.", "கவலைகளை பேப்பரில் எழுதவும்.", "சிறிது நேரம் நடக்கவும்."] },
    { id: 'depression', title: 'மனச்சோர்வு (Depression)', icon: <HeartCrack size={18} color="#6366F1" />, advice: ["இன்று சிறிய எதிர்பார்ப்புகளை மட்டும் रखिए.", "வேலைகளை சிறிதாக பிரிக்கவும்.", "5 நிமிடம் சூரிய ஒளியில் நிற்கவும்.", "நண்பர்களிடம் பேசவும்."] },
    { id: 'burnout', title: 'சோர்வு (Burnout)', icon: <Zap size={18} color="#F59E0B" />, advice: ["ஸ்கிரீன் இன்றி 15 நிமிடம் இருட்டறையில் இருக்கவும்.", "இல்லை என்று பழகவும்.", "எளிய வேலைகளில் ஈடுபடவும்.", "மூச்சுப்பயிற்சி செய்யவும்."] },
    { id: 'insomnia', title: 'தூக்கமின்மை (Insomnia)', icon: <Moon size={18} color="#8B5CF6" />, advice: ["20 நிமிடம் தூக்கம் வரவில்லை என்றால் எதையாவது படிக்கவும்.", "அடிக்கடி நேரத்தை பார்க்க வேண்டாம்.", "உடலை தளர்த்தவும்.", "மூச்சுப்பயிற்சி செய்யவும்."] }
  ],
  Kannada: [
    { id: 'panic', title: 'ಆತಂಕದ ದಾಳಿ (Panic Attack)', icon: <AlertOctagon size={18} color="var(--color-accent-critical)" />, advice: ["ಇದು ಆತಂಕದ ದಾಳಿ, ಸ್ವಲ್ಪ ಹೊತ್ತಿಗೆ சரியಾಗುತ್ತದೆ.", "ಮುಖಕ್ಕೆ ತಣ್ಣೀರು ಬೀಳಿಸಿ.", "ನಿಮ್ಮ ಸುತ್ತಲಿನ ವಸ್ತುಗಳನ್ನು ಗಮನಿಸಿ.", "ಉಸಿರಾಟದ ವ್ಯಾಯಾಮ ಮಾಡಿ."] },
    { id: 'anxiety', title: 'ತೀವ್ರ ಆತಂಕ (Anxiety)', icon: <Brain size={18} color="var(--color-brand-primary)" />, advice: ["ಕಾಫಿ ಕಡಿಮೆ ಮಾಡಿ ನೀರು ಕುಡಿಯಿರಿ.", "ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಪ್ರಶ್ನಿಸಿ.", "ಆತಂಕವನ್ನು ಕಾಗದದ ಮೇಲೆ ಬರೆಯಿರಿ.", "ಸ್ವಲ್ಪ ಹೊತ್ತು ನಡೆಯಿರಿ."] },
    { id: 'depression', title: 'ಖಿನ್ನತೆ (Depression)', icon: <HeartCrack size={18} color="#6366F1" />, advice: ["ಇಂದು ಕಡಿಮೆ ಕೆಲಸಗಳನ್ನು ಮಾಡಿ.", "ಕೆಲಸವನ್ನು ಸಣ್ಣ ಭಾಗಗಳಾಗಿ ವಿಂಗಡಿಸಿ.", "5 ನಿಮಿಷ ಬಿಸಿಲಿನಲ್ಲಿ ನಿಲ್ಲಿ.", "ಆಪ್ತರೊಂದಿಗೆ ಮಾತನಾಡಿ."] },
    { id: 'burnout', title: 'ದಣಿವು (Burnout)', icon: <Zap size={18} color="#F59E0B" />, advice: ["15 ನಿಮಿಷ ಸ್ಕ್ರೀನ್ ಬಿಟ್ಟು ಪ್ರಶಾಂತವಾಗಿ ಕುಳಿತುಕೊಳ್ಳಿ.", "ಇಲ್ಲ ಎಂದು ಹೇಳಲು ಕಲಿಯಿರಿ.", "ಸುಲಭದ ಕೆಲಸ ಮಾಡಿ.", "ಉಸಿರಾಟದ ವ್ಯಾಯಾಮ ಮಾಡಿ."] },
    { id: 'insomnia', title: 'ನಿದ್ರಾಹೀನತೆ (Insomnia)', icon: <Moon size={18} color="#8B5CF6" />, advice: ["20 ನಿಮಿಷ ನಿದ್ದೆ ಬರದಿದ್ದರೆ ಎದ್ದು ಪುಸ್ತಕ ಓದಿ.", "ಗಡಿಯಾರ ನೋಡಬೇಡಿ.", "ನಿಮ್ಮ ಶರೀರವನ್ನು ಸಡಿಲಗೊಳಿಸಿ.", "ಉಸಿರಾಟದ ವ್ಯಾಯಾಮ ಮಾಡಿ."] }
  ],
  Malayalam: [
    { id: 'panic', title: 'പരിഭ്രാന്തി (Panic Attack)', icon: <AlertOctagon size={18} color="var(--color-accent-critical)" />, advice: ["ഇത് ഒരു പാനിക് അറ്റാക്ക് ആണ്, ഇത് പെട്ടെന്ന് മാറും.", "മുഖത്ത് തണുത്ത വെള്ളം തളിക്കുക.", "ചുറ്റുപാടുമുള്ള കാര്യങ്ങൾ ശ്രദ്ധിക്കുക.", "ശ്വാസോച്ഛ്വാസ വ്യായാമം ചെയ്യുക."] },
    { id: 'anxiety', title: 'ഉത്കണ്ഠ (High Anxiety)', icon: <Brain size={18} color="var(--color-brand-primary)" />, advice: ["കഫീൻ കുറയ്ക്കുക, തണുത്ത വെള്ളം കുടിക്കുക.", "നിങ്ങളുടെ ചിന്തകളെ ചോദ്യം ചെയ്യുക.", "ഉത്കണ്ഠയുണ്ടാക്കുന്ന കാര്യങ്ങൾ എഴുതി വെക്കുക.", "കുറച്ച് നേരം നടക്കാൻ പോകുക."] },
    { id: 'depression', title: 'വിഷാദം (Depression)', icon: <HeartCrack size={18} color="#6366F1" />, advice: ["ഇന്ന് കുറച്ചു കാര്യങ്ങൾ മാത്രം ചെയ്യുക.", "ജോലികൾ ചെറുതായി വിഭജിക്കുക.", "5 മിനിറ്റ് സൂര്യപ്രകാശത്തിൽ നിൽക്കുക.", "സുഹൃത്തുക്കളോട് സംസാരിക്കുക."] },
    { id: 'burnout', title: 'ക്ഷീണം (Burnout)', icon: <Zap size={18} color="#F59E0B" />, advice: ["15 മിനിറ്റ് ഇരുട്ടിൽ ശാന്തമായി ഇരിക്കുക.", "ഇല്ല എന്ന് പറയാൻ പഠിക്കുക.", "ലളിതമായ കാര്യങ്ങൾ ചെയ്യുക.", "ശ്വാസോച്ഛ്വാസ വ്യായാമം ചെയ്യുക."] },
    { id: 'insomnia', title: 'ഉറക്കമില്ലായ്മ (Insomnia)', icon: <Moon size={18} color="#8B5CF6" />, advice: ["20 മിനിറ്റിനുള്ളിൽ ഉറക്കം വന്നില്ലെങ്കിൽ എഴുന്നേൽക്കുക.", "ക്ലോക്കിൽ സമയം നോക്കരുത്.", "ശരീരം ശാന്തമാക്കുക.", "ശ്വാസോച്ഛ്വാസ വ്യായാമം ചെയ്യുക."] }
  ]
};

const CopingStrategies = ({ appLanguage = 'English' }) => {
  const [expandedId, setExpandedId] = useState(null);
  
  // Get active translation list safely falling back to English
  const currentStrategies = TRANSLATIONS[appLanguage] || TRANSLATIONS['English'];
  const [speechState, setSpeechState] = useState('idle'); // idle, playing, paused

  // Ensure any lingering speech is killed when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleExpand = (id) => {
    if (speechState !== 'idle') {
      window.speechSynthesis.cancel();
      setSpeechState('idle');
    }
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSpeechAction = (strategy) => {
    if (speechState === 'playing') {
      window.speechSynthesis.pause();
      setSpeechState('paused');
    } else if (speechState === 'paused') {
      window.speechSynthesis.resume();
      setSpeechState('playing');
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `Coping strategy for ${strategy.title}. ${strategy.advice.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      const voices = window.speechSynthesis.getVoices();
      
      const LANG_CODES = { 'English':'en-US', 'Hindi':'hi-IN', 'Telugu':'te-IN', 'Tamil':'ta-IN', 'Kannada':'kn-IN', 'Malayalam':'ml-IN' };
      const targetLang = LANG_CODES[appLanguage] || 'en-US';
      utterance.lang = targetLang;

      // Filter local voices
      const localVoices = voices.filter(v => v.lang.startsWith(targetLang.split('-')[0]));
      const femaleVoice = localVoices.find(v => 
        v.name.includes('Google UK English Female') || 
        v.name.includes('Samantha') || 
        v.name.includes('Victoria') || 
        v.name.includes('Zira') || 
        v.name.includes('Female') || 
        v.name.includes('Google')
      ) || localVoices[0];
      
      if (femaleVoice) utterance.voice = femaleVoice;
      
      utterance.rate = 0.85; // Slower, calmer breathing pace
      utterance.pitch = 1.15; // Slightly higher pitch softens the robotic edge
      
      utterance.onend = () => setSpeechState('idle');
      utterance.onerror = () => setSpeechState('idle');

      window.speechSynthesis.speak(utterance);
      setSpeechState('playing');
    }
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setSpeechState('idle');
  };

  return (
    <div className="card glass-panel animate-fade-in" style={{ backgroundColor: 'white' }}>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <h3 className="card-title"><BookOpen size={20} color="var(--color-text-secondary)" /> Coping Library</h3>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
        Quick-action guides for managing sudden mental health symptoms.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {currentStrategies.map((strategy) => {
          const isExpanded = expandedId === strategy.id;
          return (
            <div 
              key={strategy.id} 
              style={{ 
                border: '1px solid var(--color-bg-tertiary)', 
                borderRadius: '8px', 
                overflow: 'hidden',
                backgroundColor: isExpanded ? '#F8FAFC' : 'transparent',
                transition: 'background-color 0.2s'
              }}
            >
              <button 
                onClick={() => toggleExpand(strategy.id)}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {strategy.icon}
                  <span style={{ fontWeight: isExpanded ? '600' : '500', color: 'var(--color-text-primary)' }}>
                    {strategy.title}
                  </span>
                </div>
                {isExpanded ? <ChevronUp size={18} color="var(--color-text-secondary)" /> : <ChevronDown size={18} color="var(--color-text-secondary)" />}
              </button>
              
              {isExpanded && (
                <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <hr style={{ borderTop: '1px solid var(--color-bg-tertiary)', borderBottom: 'none', margin: '0 0 0.5rem 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '0.25rem' }}>
                    <button 
                      onClick={() => handleSpeechAction(strategy)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-brand-primary)', fontSize: '0.75rem', fontWeight: '500' }}
                    >
                      {speechState === 'playing' ? <Pause size={14} /> : <Play size={14} />} 
                      {speechState === 'playing' ? 'Pause Voice' : speechState === 'paused' ? 'Resume Voice' : 'Read Aloud'}
                    </button>
                    
                    {speechState !== 'idle' && (
                      <button 
                        onClick={handleStopSpeech}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent-critical)', fontSize: '0.75rem', fontWeight: '500' }}
                      >
                        <Square size={14} /> Stop
                      </button>
                    )}
                  </div>

                  <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-primary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {strategy.advice.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CopingStrategies;
