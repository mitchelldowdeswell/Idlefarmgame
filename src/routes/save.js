import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { authRequired } from '../auth.js';

const router = Router();

const SaveSchema = z.object({
  version: z.number().int().min(1),
  data: z.any()
});

router.get('/', authRequired, async (req, res) => {
  const save = await prisma.playerSave.findUnique({ where: { userId: req.user.userId } });
  if (!save) return res.json({ ok: true, save: null });
  res.json({ ok: true, save: { version: save.version, data: save.data, updatedAt: save.updatedAt } });
});

router.put('/', authRequired, async (req, res) => {
  const parsed = SaveSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid save payload' });

  const { version, data } = parsed.data;

  const saved = await prisma.playerSave.upsert({
    where: { userId: req.user.userId },
    update: { data, version },
    create: { userId: req.user.userId, data, version }
  });

  res.json({ ok: true, updatedAt: saved.updatedAt });
});

router.delete('/', authRequired, async (req, res) => {
  await prisma.playerSave.deleteMany({ where: { userId: req.user.userId } });
  res.json({ ok: true });
});

export default router;
