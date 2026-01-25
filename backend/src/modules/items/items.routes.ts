import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { upload } from "../../middlewares/uploadMiddleware";
import { ItemsController } from "./items.controller";

const router = Router();
const controller = new ItemsController();

router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.post("/", authMiddleware, upload.single("image"), (req, res) =>
  controller.create(req, res)
);
router.put("/:id", authMiddleware, upload.single("image"), (req, res) =>
  controller.update(req, res)
);
router.delete("/:id", authMiddleware, (req, res) =>
  controller.delete(req, res)
);

export const itemsRoutes = router;
