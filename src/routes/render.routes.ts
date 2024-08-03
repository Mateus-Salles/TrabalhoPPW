import { Router } from "express";
import { RenderTemplateController } from "../controllers/renderTemplateController";
import { authMiddleware } from "../middleware/auth_middleware";

const router = Router()

router.get("/pages", RenderTemplateController.renderPage);
router.get("/self-info", authMiddleware, RenderTemplateController.renderSelfInfo);

export default router;