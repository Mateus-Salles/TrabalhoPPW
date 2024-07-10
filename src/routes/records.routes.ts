import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth_middleware";
import { RecordsController } from "../controllers/RecordsController";

const router = Router();

router.get("/home", authMiddleware, RecordsController.index);

export default router;
