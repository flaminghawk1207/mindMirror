import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Gemini chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
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
    if (Array.isArray(history) && history.length > 0) {
      contents = history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
    } else {
      contents = [
        {
          parts: [
            { text: message }
          ]
        }
      ];
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
    res.json({ reply: aiMessage });
  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from Gemini.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 