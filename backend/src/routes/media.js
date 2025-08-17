import { Router } from 'express';
import authenticate from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /media:
 *   get:
 *     summary: List media
 *     responses:
 *       200:
 *         description: Array of media
 *   post:
 *     summary: Create media record
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Created media
 */
router.route('/').get(async (req, res) => {
  const list = await req.db('media');
  res.json(list);
}).post(authenticate, async (req, res) => {
  const { url, challenge_id } = req.body;
  const [item] = await req.db('media').insert({
    url,
    challenge_id,
    user_id: req.user.id
  }).returning('*');
  res.json(item);
});

export default router;
