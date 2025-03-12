import express from "express";
import VoterController from "../controllers/VoterController";

const router = express.Router();

router.post("/", VoterController.register);
router.get("/:id", VoterController.getVoter);
router.put("/:id", VoterController.updateVoter);

export default router;
