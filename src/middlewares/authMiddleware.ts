import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "a3f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2";

// ✅ Define Authenticated Request Type
interface AuthRequest extends Request {
    user?: { user_id: number; role: string };
}

// ✅ Authenticate User Middleware
export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Access Denied. No Token Provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { user_id: number; role: string };
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid Token" });
    }
};

// ✅ Authorize Role Middleware
export const authorizeRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ error: "Access Forbidden" });
            return;
        }
        next();
    };
};
