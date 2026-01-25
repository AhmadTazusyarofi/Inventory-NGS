import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { StockController } from "./stock.controller";

const router = Router();
const controller = new StockController();

router.get("/mutations", authMiddleware, (req, res) =>
  controller.getMutations(req, res)
);

router.post("/in", authMiddleware, (req, res) =>
  controller.createStockIn(req, res)
);

router.post("/out", authMiddleware, (req, res) =>
  controller.createStockOut(req, res)
);

router.get("/transfers", authMiddleware, (req, res) =>
  controller.getTransfers(req, res)
);

router.post("/transfer", authMiddleware, (req, res) =>
  controller.createTransfer(req, res)
);

router.post("/adjustment", authMiddleware, (req, res) =>
  controller.createAdjustment(req, res)
);

router.get("/opnames", authMiddleware, (req, res) =>
  controller.getOpnames(req, res)
);

router.post("/opname", authMiddleware, (req, res) =>
  controller.startOpname(req, res)
);

router.get("/expired", authMiddleware, (req, res) =>
  controller.getExpiredItems(req, res)
);

export const stockRoutes = router;
