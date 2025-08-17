import { Router } from 'express';
import authenticate from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /challenges:
 *   get:
 *     summary: List challenges
 *     responses:
 *       200:
 *         description: Array of challenges
 *   post:
 *     summary: Create challenge
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Created challenge
 */
router.route('/').get(async (req, res) => {
  const list = await req.db('challenges');
  res.json(list);
}).post(authenticate, async (req, res) => {
  const { title, description } = req.body;
  const [challenge] = await req.db('challenges').insert({
    title,
    description,
    created_by: req.user.id
  }).returning('*');
  res.json(challenge);
});

export default router;
