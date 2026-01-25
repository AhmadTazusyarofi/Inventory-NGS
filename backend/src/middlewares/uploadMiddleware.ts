import fs from "fs";
import multer from "multer";
import path from "path";
import { env } from "../config/env";

// Simpan semua file upload ke folder public/uploads/barang
const baseUploadDir = path.join("public", "uploads");
const barangUploadDir = path.join(baseUploadDir, "barang");

if (!fs.existsSync(barangUploadDir)) {
  fs.mkdirSync(barangUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, barangUploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxFileSize,
  },
});
