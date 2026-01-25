import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ActivityController } from "./activity.controller";

const router = Router();
const controller = new ActivityController();

router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));

export const activityRoutes = router;
