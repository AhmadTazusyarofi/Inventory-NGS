import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { WarehousesController } from "./warehouses.controller";

const router = Router();
const controller = new WarehousesController();

router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.put("/:id", authMiddleware, (req, res) => controller.update(req, res));
router.delete("/:id", authMiddleware, (req, res) =>
  controller.delete(req, res)
);

export const warehousesRoutes = router;
