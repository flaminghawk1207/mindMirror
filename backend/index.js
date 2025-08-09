import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env first; fallback to repo root .env
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.GEMINI_API_KEY) {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Gemini chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history, mood, intensity } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.status(500).json({ error: 'Gemini API key not set.' });
    }

    // Gemini Pro API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

    // Prepare conversation history for Gemini API
    let contents = [];

    // Behavior-shaping instruction: always infer mood/intensity from latest user message and coach to improve
    const instructionParts = [
      'You are MindMirror, a supportive and practical mood coach.',
      'Task each turn:',
      '- Infer the user\'s current mood label (e.g., Happy, Sad, Angry, Excited, Calm, Anxious, or another succinct label) and intensity 1–10 from the latest user message (use prior context only as secondary signals).',
      `- If provided, treat the previously reported mood as a signal: mood=${mood ?? 'N/A'}, intensity=${typeof intensity === 'number' ? intensity : 'N/A'}. Still prioritize the latest message for inference.`,
      '- Then produce a brief coaching reply that aims to improve the mood by 1–2 points in this chat: empathize (1–2 sentences), ask one open-ended question, and suggest up to 3 concrete, low-effort actions (include one <2-minute option). Keep replies under 120 words, positive, non-judgmental. If you detect risk of harm, show a brief safety message and advise contacting local support.',
      'Output format STRICTLY:',
      '- First line: a single JSON object WITHOUT code fences like {"mood":"Sad","intensity":7}',
      '- Second line onward: the coaching reply text only.'
    ].join(' ');

    contents.push({ role: 'user', parts: [{ text: instructionParts }] });

    if (Array.isArray(history) && history.length > 0) {
      contents.push(
        ...history.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }))
      );
    } else {
      contents.push({ role: 'user', parts: [{ text: message }] });
    }

    const response = await axios.post(
      url,
      {
        contents
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let inferredMood = null;
    let inferredIntensity = null;
    let replyText = aiMessage || '';

    if (aiMessage) {
      const newlineIdx = aiMessage.indexOf('\n');
      if (newlineIdx !== -1) {
        const firstLine = aiMessage.slice(0, newlineIdx).trim();
        const rest = aiMessage.slice(newlineIdx + 1).trim();
        try {
          const meta = JSON.parse(firstLine);
          if (meta && typeof meta.mood === 'string') inferredMood = meta.mood;
          if (meta && typeof meta.intensity === 'number') inferredIntensity = meta.intensity;
          replyText = rest;
        } catch (e) {
          // If parsing fails, keep the whole message as replyText
        }
      } else {
        // Single-line response; attempt to parse as JSON
        try {
          const meta = JSON.parse(aiMessage);
          if (meta && typeof meta.mood === 'string') inferredMood = meta.mood;
          if (meta && typeof meta.intensity === 'number') inferredIntensity = meta.intensity;
          replyText = '';
        } catch (e) {
          // leave as plain text
        }
      }
    }

    res.json({ reply: replyText, inferredMood, inferredIntensity });
  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from Gemini.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 