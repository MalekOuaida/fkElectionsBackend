import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

// ✅ Import Database Connections
import pool from "./config/db"; // PostgreSQL connection
import "./config/mongo"; // MongoDB connection

// ✅ Import Middleware
import { errorHandler } from "./middlewares/errorMiddleware";
import { authenticateUser, authorizeRole } from "./middlewares/authMiddleware";

// ✅ Import Routes
import authRoutes from "./routes/authRoutes";
import voterRoutes from "./routes/voterRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import voterImportRoutes from "./routes/voterImportRoutes";

// ✅ Initialize Express App
const app = express();

// ✅ Security & Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// ✅ PostgreSQL Connection Test
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW();");
        res.json({ message: "✅ PostgreSQL Database Connected", timestamp: result.rows[0] });
    } catch (error: any) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Database connection error" });
    }
});

// ✅ Register API Routes
app.use("/api/auth", authRoutes); // Login & authentication
app.use("/api/voters", authenticateUser, authorizeRole(["Admin", "Delegate"]), voterRoutes);
app.use("/api/services", authenticateUser, authorizeRole(["Admin", "Delegate"]), serviceRoutes);
app.use("/api/voter-import", authenticateUser, authorizeRole(["Admin"]), voterImportRoutes);

// ✅ Error Handling Middleware (must be last)
app.use(errorHandler);

// ✅ Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
