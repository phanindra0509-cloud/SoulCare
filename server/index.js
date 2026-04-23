import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Allow cross-origin requests from the Vercel frontend or local Vite server
app.use(cors({
  origin: '*' // In production, replace with your Vercel URL
}));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages, appLanguage } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    const apiKey = process.env.VITE_OPENAI_API_KEY; // Using the same env var name
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      throw new Error("Missing AI Key on server! Please add VITE_OPENAI_API_KEY to your backend environment.");
    }

    const systemPrompt = `You are a highly empathetic, professional mental health and wellness assistant. 
Your primary specialization is supporting users dealing with anxiety, stress, depression, and panic attacks. 
You must reply EXCLUSIVELY in ${appLanguage || 'English'}. Do not use English unless the user asks for it.

Key Guidelines:
1. Provide a calm, grounding, and validating presence. Always validate their feelings.
2. If a user mentions a panic attack or extreme anxiety, immediately pivot to step-by-step grounding exercises (like the 5-4-3-2-1 sensory method or box breathing).
3. If appropriate, you may suggest common natural supplements (e.g., Ashwagandha, Magnesium, Melatonin) or mention general classes of prescription tablets/medications that doctors commonly recommend for their symptoms. However, you MUST explicitly state that they must consult a doctor before taking any tablets, supplements, or medications.
4. Offer actionable, gentle, and practical coping strategies for stress and anxious thoughts.
5. In moments of severe distress, gently remind them they are safe right now and encourage reaching out to a medical professional, therapist, or local helpline.
6. Keep your answers relatively short, conversational, warm, and highly supportive.
7. CRITICAL: Do NOT use ANY Markdown formatting (NO asterisks * or ** for bolding/italics, NO pound signs #). Use plain text only, separated by newlines.`;

    // Format conversation history
    const conversationHistory = messages.map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: `Conversation so far:\n${conversationHistory}` }] }]
      })
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      throw new Error(`Gemini API Error: ${geminiRes.status} ${errorText}`);
    }

    const data = await geminiRes.json();
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!botResponse) throw new Error("Empty response from AI");

    return res.json({ response: botResponse });

  } catch (error) {
    console.warn("OpenAI connection failed or unconfigured:", error.message);
    
    // Attempt to use the Hugging Face Dataset endpoint as the AI Assistant backend
    try {
      const hfDatasetUrl = "https://datasets-server.huggingface.co/rows?dataset=lavita%2FChatDoctor-HealthCareMagic-100k&config=default&split=train&offset=0&length=100";
      
      const hfToken = process.env.VITE_HF_TOKEN; 
      const headers = hfToken ? { "Authorization": `Bearer ${hfToken}` } : {};

      const hfResponse = await fetch(hfDatasetUrl, { headers });
      
      if (hfResponse.ok) {
        const data = await hfResponse.json();
        if (data && data.rows && data.rows.length > 0) {
          // Find a random response from the dataset's rows
          const randomRow = data.rows[Math.floor(Math.random() * data.rows.length)];
          
          // Map to the possible output fields in the dataset
          const botFallback = randomRow.row.output || randomRow.row.response || randomRow.row.answer || "I reviewed the dataset but couldn't find a direct response text.";
          
          return res.json({ response: botFallback });
        }
      } else {
        console.warn("Failed to fetch from Hugging Face API:", await hfResponse.text());
      }
    } catch (datasetError) {
      console.warn("Dataset API request failed:", datasetError);
    }

    // Final fallback if both APIs fail
    // Getting the last user message
    const lastMessage = messages[messages.length - 1];
    const textLower = (lastMessage?.text || "").toLowerCase();
    let fallbackResponse = "";

    if (textLower.includes('anxious') || textLower.includes('panic') || textLower.includes('scared')) {
      const anxiousResponses = [
        "I can see you might be experiencing a heightened state of anxiety right now. Please sit down, try to plant your feet firmly on the ground, and follow the guided breathing exercise on your dashboard.",
        "It sounds like things feel out of control at the moment. Take a deep breath with me. You are safe here. Can you tell me what you are physically feeling right now?",
        "Panic can be incredibly overwhelming. Let's focus on grounding. Can you look around the room and name three things you can see, two things you can touch, and one thing you can hear?"
      ];
      fallbackResponse = anxiousResponses[Math.floor(Math.random() * anxiousResponses.length)];
    } else if (textLower.includes('sad') || textLower.includes('depressed') || textLower.includes('down')) {
      const sadResponses = [
        "I am so sorry you are feeling down. Please remember that taking things one step at a time is completely okay. Your wellness is the priority.",
        "It takes courage to share that you're feeling down. I'm listening. Is there something specific that triggered these feelings today?",
        "Feelings of heaviness and sadness are deeply exhausting. I am here to support you unconditionally. Try to be gentle with yourself today."
      ];
      fallbackResponse = sadResponses[Math.floor(Math.random() * sadResponses.length)];
    } else {
      const generalResponses = [
        "I hear you, and it's completely understandable to feel that way. Please feel free to share more, or we can practice some grounding exercises together.",
        "Thank you for sharing that with me. Acknowledging your feelings is a huge step in the right direction. How long have you been feeling like this?",
        "I understand. Sometimes talking through these moments makes a big difference. I am entirely focused on you. What would feel most helpful right now?"
      ];
      fallbackResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    return res.json({ response: fallbackResponse });
  }
});

app.listen(PORT, () => {
  console.log(`SoulCare Backend Server running on port ${PORT}`);
});
