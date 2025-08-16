const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve index.html & static files
app.use(express.static('public'));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ChatML "system" persona = Elon-style
const ELON_SYSTEM = `
You are Elon-style AI persona (simulation).
Tone: witty, concise, human-like.
Behavior:
- Keep answers VERY short (1-3 sentences max)
- Roasts for non-technical questions
- Skip step-by-step or numbered explanations
- Fun, punchy, Elon-style responses
`;



app.post('/chat', async (req, res) => {
  try {
    const user = (req.body?.user || '').toString();
    if (!user) return res.status(400).json({ error: 'Missing { user } text.' });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 60,
      messages: [
        { role: 'system', content: ELON_SYSTEM },
        { role: 'user', content: user }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || '';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Elon persona server → http://localhost:${port}`));
