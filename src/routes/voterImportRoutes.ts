import express from "express";
import VoterImportController from "../controllers/VoterImportController";
import uploadFile from "../middlewares/fileUploadMiddleware";
import { authenticateUser, authorizeRole } from "../middlewares/authMiddleware";

const router = express.Router();

// ✅ Pass function reference, not an executed function
router.post(
    "/upload",
    authenticateUser,
    authorizeRole(["Admin"]),
    uploadFile,
    VoterImportController.uploadVoters
);

export default router;
