import express from "express";
import ServiceController from "../controllers/ServiceController";

const router = express.Router();

router.post("/", ServiceController.addService);  // ✅ Use function reference

export default router;