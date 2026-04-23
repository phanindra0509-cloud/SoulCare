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
    
    // Return the actual error message to the frontend for debugging
    return res.json({ response: `[DEBUG ERROR]: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`SoulCare Backend Server running on port ${PORT}`);
});
