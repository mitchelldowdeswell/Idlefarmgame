import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import meRoutes from './routes/me.js';
import saveRoutes from './routes/save.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// Dev-friendly CORS. In production, set a specific origin.
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/me', meRoutes);
app.use('/save', saveRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Idle Farm API listening on http://localhost:${port}`);
});
