import { Request, Response } from "express";
import { ItemsService } from "./items.service";

const service = new ItemsService();

export class ItemsController {
  async getAll(_req: Request, res: Response) {
    try {
      const items = await service.getAll();
      return res.json({ success: true, data: items });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch items",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const {
        kode,
        nama,
        id_kategori,
        id_supplier,
        satuan,
        stok,
        stok_minimum,
        deskripsi,
      } = req.body;

      const file = req.file as Express.Multer.File | undefined;

      const imagePath = file ? `/uploads/barang/${file.filename}` : undefined;

      const item = await service.create({
        kode,
        nama,
        id_kategori: Number(id_kategori),
        id_supplier: Number(id_supplier),
        satuan,
        stok: stok !== undefined ? Number(stok) : undefined,
        stok_minimum: Number(stok_minimum),
        deskripsi,
        url_gambar: imagePath,
      });

      return res.status(201).json({
        success: true,
        message: "Item created successfully",
        data: item,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create item",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid item id",
        });
      }

      const {
        kode,
        nama,
        id_kategori,
        id_supplier,
        satuan,
        stok,
        stok_minimum,
        deskripsi,
      } = req.body;

      const file = req.file as Express.Multer.File | undefined;
      const imagePath = file ? `/uploads/barang/${file.filename}` : undefined;

      const item = await service.update(id, {
        kode,
        nama,
        id_kategori:
          id_kategori !== undefined ? Number(id_kategori) : undefined,
        id_supplier:
          id_supplier !== undefined ? Number(id_supplier) : undefined,
        satuan,
        stok: stok !== undefined ? Number(stok) : undefined,
        stok_minimum:
          stok_minimum !== undefined ? Number(stok_minimum) : undefined,
        deskripsi,
        url_gambar: imagePath,
      });

      return res.json({
        success: true,
        message: "Item updated successfully",
        data: item,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update item",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid item id",
        });
      }

      await service.delete(id);

      return res.json({
        success: true,
        message: "Item deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete item",
      });
    }
  }
}
