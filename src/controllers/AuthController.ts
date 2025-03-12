import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "a3f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2";

export default class AuthController {
    static login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            if (result.rows.length === 0) {
                res.status(400).json({ error: "Invalid Credentials" });
                return;
            }

            const user = result.rows[0];
            const validPassword = await bcrypt.compare(password, user.hashed_password);
            if (!validPassword) {
                res.status(400).json({ error: "Invalid Credentials" });
                return;
            }

            const token = jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "2h" });

            res.json({ token });
        } catch (err: any) {  // ✅ Ensure error handling works correctly
            console.error("Error in login:", err);
            res.status(500).json({ error: "Internal Server Error", details: err instanceof Error ? err.message : err });
        }
    };
}