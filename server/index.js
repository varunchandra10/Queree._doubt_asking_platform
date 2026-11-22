import './loadEnv.js';
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import Post from "./models/Post.js";

import userRoutes from "./routes/users.js"
import questionRoutes from './routes/Questions.js'
import answerRoutes from './routes/Answers.js'
import subsRoutes from "./routes/Subscription.js";
import postRoutes from "./routes/Posts.js";
import chatRoutes from "./routes/Chat.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware (Ensures req.body is parsed correctly for your Gemini controller)
app.use(express.json({limit: "30mb", extended: true}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
app.use(cors());

// Simple request logger to help debug routing issues
app.use((req, res, next) => {
  console.log('[incoming]', req.method, req.originalUrl);
  next();
});

app.get('/',(req, res) => {
    res.send("This is a Queree. Server")
})

app.use("/user", userRoutes)
app.use('/questions', questionRoutes)
app.use('/answer', answerRoutes)
app.use('/subscription', subsRoutes)
app.use('/post', postRoutes)
app.use('/chat', chatRoutes) // Maps perfectly to POST /chat/add

const PORT = process.env.PORT || 5000
const DATABASE_URL = process.env.CONNECTION_URL

const startServer = (startingPort = PORT, maxAttempts = 5) => {
  let attempts = 0;
  const tryPort = (port) => {
    const server = app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE' && attempts < maxAttempts) {
        attempts += 1;
        const nextPort = port + 1;
        console.warn(`Port ${port} in use. Trying ${nextPort} (attempt ${attempts}/${maxAttempts})`);
        setTimeout(() => tryPort(nextPort), 200);
      } else {
        console.error('Failed to start server:', err);
        process.exit(1);
      }
    });
  };

  tryPort(startingPort);
};

if (DATABASE_URL) {
  // CLEANUP: Removed deprecated useNewUrlParser and useUnifiedTopology options
  mongoose.connect(DATABASE_URL)
    .then(() => startServer())
    .catch((err) => {
      console.log(err.message);
      startServer();
    });
} else {
  startServer()
}