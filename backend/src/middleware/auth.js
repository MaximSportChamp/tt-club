import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (e) {
    res.sendStatus(401);
  }
}
