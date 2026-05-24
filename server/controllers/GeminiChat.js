import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// FIX 1: Pass your Google Cloud project ID so your account-bound key is accepted
const aiClient = new GoogleGenAI({ 
  apiKey: GEMINI_KEY,
  projectId: 'gen-lang-client-0839022398' 
});

export const proxyGemini = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message in request body.' });

    if (!GEMINI_KEY) return res.status(500).json({ error: 'Server misconfigured: missing GEMINI_API_KEY' });

    const prompt = message;

    // Persona instruction for QuereeGPT
    const systemInstruction = `You are QuereeGPT, the friendly, concise developer-focused assistant for the Queree platform. Always begin responses with a short greeting that includes 'Queree' or 'QuereeGPT' (for example: "Hello - QuereeGPT here, how can I help you?") before answering. Keep answers helpful, direct, and short when possible. Preserve code formatting when present.`;

    const fullPrompt = `${systemInstruction}\n\nUser: ${prompt}\nAssistant:`;

    let response;
    try {
      // Use the system instruction + user prompt in one contents string
      response = await aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: fullPrompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 512,
        }
      });
    } catch (upErr) {
      const status = upErr?.status || upErr?.code || 'UPSTREAM_ERROR';
      const body = upErr?.message || JSON.stringify(upErr);
      if (process.env.USE_MOCK_CHAT === 'true') {
        const mock = `Mock reply: I couldn't reach Gemini (status ${status}). Your message was: "${prompt}"`;
        return res.status(200).json({ success: true, assistant: mock, upstreamStatus: status, upstreamBody: body });
      }
      console.error('Gemini upstream error', upErr);
      return res.status(502).json({ error: `Gemini upstream error: ${body}` });
    }

    // Extract text safely using the official SDK wrapper helper property
    let assistant = null;
    if (response?.text) {
      assistant = response.text;
    } else {
      assistant = JSON.stringify(response);
    }

    // Enforce Queree-style greeting at the start of the reply
    try {
      const normalized = String(assistant || '').trim();
      const greetingRegex = /^\s*(hello|hi|hey|greetings)\b|Queree|QuereeGPT/i;
      if (!greetingRegex.test(normalized)) {
        assistant = `Hello — QuereeGPT here, how can I help you?\n\n${normalized}`;
      }
    } catch (e) {
      // ignore greeting enforcement errors
    }

    return res.status(200).json({ success: true, assistant });
  } catch (err) {
    console.error('proxyGemini error', err);
    const causeCode = err?.cause?.code || err?.code;
    if (causeCode === 'ENOTFOUND') return res.status(502).json({ error: 'Upstream DNS resolution failed for generativelanguage.googleapis.com' });
    return res.status(500).json({ error: 'Chat proxy failed' });
  }
};