import express from 'express';
import { proxyGemini } from '../controllers/GeminiChat.js';

const router = express.Router();

// Route: POST /add -> proxyGemini
router.post('/add', proxyGemini);

// Route: GET /get/:id -> returns chat history (or empty placeholder if session-based)
router.get('/get/:id', (req, res) => {
  res.status(200).json({ success: true, messages: [] });
});

export default router;