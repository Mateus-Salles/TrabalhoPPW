import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware";
import { UsersController } from "../controllers/UsersController";

const router = Router();

router.get("/", authMiddleware, UsersController.getUser);
router.patch("/edit", authMiddleware, UsersController.update);

export default router;
