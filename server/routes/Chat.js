import express from 'express';
import { proxyGemini } from '../controllers/GeminiChat.js';

const router = express.Router();

// Route: POST /add -> proxyGemini
router.post('/add', proxyGemini);

export default router;