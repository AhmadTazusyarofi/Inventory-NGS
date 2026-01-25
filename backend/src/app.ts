import cors from "cors";
import express from "express";
import path from "path";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { router } from "./routes";

const app = express();

app.use(
  cors({
    origin: env.allowedOrigins.length > 0 ? env.allowedOrigins : true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded assets (e.g., /uploads/barang/...)
const publicDir = path.join(__dirname, "..", "public");
app.use("/uploads", express.static(path.join(publicDir, "uploads")));

// Health check route
app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: env.nodeEnv });
});

// API routes
app.use("/api", router);

// Global error handler
app.use(errorHandler);

export { app };
