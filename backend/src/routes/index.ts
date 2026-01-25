import { Router } from "express";
import { activityRoutes } from "../modules/activity/activity.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { categoriesRoutes } from "../modules/categories/categories.routes";
import { itemsRoutes } from "../modules/items/items.routes";
import { reportsRoutes } from "../modules/reports/reports.routes";
import { stockRoutes } from "../modules/stock/stock.routes";
import { suppliersRoutes } from "../modules/suppliers/suppliers.routes";
import { userRoutes } from "../modules/user/user.routes";
import { warehousesRoutes } from "../modules/warehouses/warehouses.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/items", itemsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/warehouses", warehousesRoutes);
router.use("/stock", stockRoutes);
router.use("/reports", reportsRoutes);
router.use("/activity", activityRoutes);
router.use("/users", userRoutes);

export { router };
