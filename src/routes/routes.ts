import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth_middleware.js";
import { RecordsController } from "../controllers/RecordsController.js";

import authRoutes from "./auth.routes.js";
import usersRoutes from "./user.routes.js";
import recordsRoutes from "./records.routes.js";

export const router = Router();

router.get("/", authMiddleware, RecordsController.index);

router.use("/auth", authRoutes);
router.use("/user", usersRoutes);
router.use("/records", recordsRoutes);
