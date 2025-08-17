import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List users
 *     responses:
 *       200:
 *         description: Array of users
 */
router.get('/', async (req, res) => {
  const users = await req.db('users');
  res.json(users);
});

export default router;
