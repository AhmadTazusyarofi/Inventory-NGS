import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ReportsController } from "./reports.controller";

const router = Router();
const controller = new ReportsController();

router.get("/current-stock", authMiddleware, (req, res) =>
  controller.downloadCurrentStock(req, res)
);

router.get("/stock-movements", authMiddleware, (req, res) =>
  controller.downloadStockMovements(req, res)
);

export const reportsRoutes = router;
