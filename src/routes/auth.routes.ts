import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

const router = Router();

router.get("/register", AuthController.renderRegister);
router.get("/login", AuthController.renderLogin);

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

export default router;
