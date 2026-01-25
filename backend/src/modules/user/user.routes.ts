import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { UserController } from "./user.controller";

const router = Router();
const controller = new UserController();

router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.put("/me", authMiddleware, (req, res) => controller.updateMe(req, res));
router.put("/me/password", authMiddleware, (req, res) =>
  controller.changeMyPassword(req, res)
);

export const userRoutes = router;
