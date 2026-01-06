import { Router } from 'express';
import { authRequired } from '../auth.js';

const router = Router();

router.get('/', authRequired, (req, res) => {
  res.json({ ok: true, user: { userId: req.user.userId, username: req.user.username } });
});

export default router;
