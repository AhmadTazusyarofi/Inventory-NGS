import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./categories.validation";

const service = new CategoriesService();

export class CategoriesController {
  async getAll(_req: Request, res: Response) {
    try {
      const categories = await service.getAll();
      return res.json({ success: true, data: categories });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch categories",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = createCategorySchema.parse(req.body);

      const kategori = await service.create({
        nama: parsed.nama,
        deskripsi: parsed.deskripsi,
      });

      return res.status(201).json({
        success: true,
        message: "Kategori berhasil dibuat",
        data: kategori,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal membuat kategori";
      return res.status(400).json({ success: false, message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID kategori tidak valid",
        });
      }

      const parsed = updateCategorySchema.parse(req.body);

      const kategori = await service.update(id, {
        nama: parsed.nama,
        deskripsi: parsed.deskripsi,
      });

      return res.json({
        success: true,
        message: "Kategori berhasil diperbarui",
        data: kategori,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal memperbarui kategori";
      return res.status(400).json({ success: false, message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID kategori tidak valid",
        });
      }

      await service.delete(id);

      return res.json({
        success: true,
        message: "Kategori berhasil dihapus",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus kategori";
      return res.status(400).json({ success: false, message });
    }
  }
}
