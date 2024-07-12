import { Router, Request, Response } from "express";
import { RecordsController } from "../controllers/RecordsController";
import { authMiddleware } from "../middleware/auth_middleware";

const router = Router();

router.post("/", authMiddleware, RecordsController.store);
router.put("/edit", authMiddleware, RecordsController.update);

export default router;
