// src/middlewares/authMiddleware.ts

import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallbackSecret';

// authenticateUser => checks token
export const authenticateUser: RequestHandler = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      // We do NOT `return res.status()...`, we just call res.status() then return;
      res.status(401).json({ error: 'No auth token' });
      return; 
    }

    const token = header.split(' ')[1]; // Bearer <token>
    if (!token) {
      res.status(401).json({ error: 'Malformed token' });
      return;
    }

    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    (req as any).user = payload; // attach user
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// authorizeRole => checks user.role is in allowed list
export function authorizeRole(roles: string[]): RequestHandler {
  return (req, res, next) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden: insufficient role' });
      return;
    }
    // success
    next();
  };
}
