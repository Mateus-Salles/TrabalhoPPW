import { Router, Request, Response } from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./user.routes.js";
import recordsRoutes from "./records.routes.js";

export const router = Router();

router.get("/", (request: Request, response: Response) =>
  response.redirect("/auth/register")
);

router.use("/auth", authRoutes);
router.use("/user", usersRoutes);
router.use(recordsRoutes);
