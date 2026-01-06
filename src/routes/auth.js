import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import { prisma } from '../prisma.js';
import { signToken, setAuthCookie } from '../auth.js';

const router = Router();

const AuthSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscore'),
  password: z.string().min(6).max(100)
});

router.post('/register', async (req, res) => {
  const parsed = AuthSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { username, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return res.status(409).json({ error: 'Username taken' });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { username, passwordHash }
  });

  // Create an initial empty save row (optional, but convenient)
  await prisma.playerSave.create({
    data: {
      userId: user.id,
      data: { version: 1, timestamp: Date.now(), note: 'empty' },
      version: 1
    }
  });

  const token = signToken({ userId: user.id, username: user.username });
  setAuthCookie(res, token);
  res.json({ ok: true, username: user.username });
});

router.post('/login', async (req, res) => {
  const parsed = AuthSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Bad credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Bad credentials' });

  const token = signToken({ userId: user.id, username: user.username });
  setAuthCookie(res, token);
  res.json({ ok: true, username: user.username });
});

router.post('/logout', async (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

export default router;
