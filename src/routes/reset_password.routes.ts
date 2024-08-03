import { Router } from "express";
import { ResetPasswordController } from "../controllers/ResetPasswordController";

const router = Router();

router.get("/verify", ResetPasswordController.render);
router.post("/send", ResetPasswordController.send);
router.post("/reset/:id", ResetPasswordController.reset);

export default router;
