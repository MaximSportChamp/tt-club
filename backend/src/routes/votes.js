import { Router } from 'express';
import authenticate from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /votes:
 *   get:
 *     summary: List votes
 *     responses:
 *       200:
 *         description: Array of votes
 *   post:
 *     summary: Create vote
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Created vote
 */
router.route('/').get(async (req, res) => {
  const list = await req.db('votes');
  res.json(list);
}).post(authenticate, async (req, res) => {
  const { challenge_id, value } = req.body;
  const [vote] = await req.db('votes').insert({
    challenge_id,
    value,
    user_id: req.user.id
  }).returning('*');
  res.json(vote);
});

export default router;
