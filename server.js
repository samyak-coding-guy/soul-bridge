import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateWhisperHandler from './api/generate-whisper.js';

dotenv.config(); // ← load .env variables

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/generate-whisper', generateWhisperHandler);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Optional: friendly message for root
app.get('/', (req, res) => {
  res.send('Soul Bridge API is running. Use POST /api/generate-whisper to get whispers.');
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
