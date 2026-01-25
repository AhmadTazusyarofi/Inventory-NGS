import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { CategoriesController } from "./categories.controller";

const router = Router();
const controller = new CategoriesController();

router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.put("/:id", authMiddleware, (req, res) => controller.update(req, res));
router.delete("/:id", authMiddleware, (req, res) =>
  controller.delete(req, res)
);

export const categoriesRoutes = router;
