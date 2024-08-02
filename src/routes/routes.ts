import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth_middleware.js";
import { RecordsController } from "../controllers/RecordsController.js";

import authRoutes from "./auth.routes.js";
import usersRoutes from "./user.routes.js";
import recordsRoutes from "./records.routes.js";

export const router = Router();

router.get("/", authMiddleware, RecordsController.index);
router.get("/pages", (request: Request, response: Response) => {
  const query = request.query.side

  if (!query) {
    return response.status(400).send()
  }

  const side = query.toString()

  if (side !== 'back' && side !== 'front') {
    return response.status(400).send()
  }

  const renderPageSide = `components/paper/${side}`

  response.render(renderPageSide, { page: { body: null, id: null } }, (err, html) => {
    if (err) {
        console.error(err)
        return response.status(500).send(err.message);
    }

    return response.send(html);
  });
});

router.use("/auth", authRoutes);
router.use("/user", usersRoutes);
router.use("/records", recordsRoutes);
