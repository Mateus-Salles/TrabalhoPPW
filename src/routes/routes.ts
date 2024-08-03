import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware.js";
import { RecordsController } from "../controllers/RecordsController.js";

import authRoutes from "./auth.routes.js";
import usersRoutes from "./user.routes.js";
import recordsRoutes from "./records.routes.js";
import renderRoutes from "./render.routes.js";
import passwordRoutes from "./reset_password.routes.js";

export const router = Router();

router.get("/", authMiddleware, RecordsController.index);

router.use("/auth", authRoutes);
router.use("/user", usersRoutes);
router.use("/records", recordsRoutes);
router.use("/render", renderRoutes);
router.use("/password", passwordRoutes);
