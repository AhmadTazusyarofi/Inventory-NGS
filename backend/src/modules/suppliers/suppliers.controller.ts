import { Request, Response } from "express";
import { SuppliersService } from "./suppliers.service";
import {
  createSupplierSchema,
  updateSupplierSchema,
} from "./suppliers.validation";

const service = new SuppliersService();

export class SuppliersController {
  async getAll(_req: Request, res: Response) {
    try {
      const suppliers = await service.getAll();
      return res.json({ success: true, data: suppliers });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch suppliers",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = createSupplierSchema.parse(req.body);

      const supplier = await service.create({
        nama: parsed.nama,
        telepon: parsed.telepon,
        email: parsed.email,
        alamat: parsed.alamat,
        kota: parsed.kota,
        provinsi: parsed.provinsi,
      });

      return res.status(201).json({
        success: true,
        message: "Supplier berhasil dibuat",
        data: supplier,
      });
    } catch (error: any) {
      const message = error?.message || "Gagal membuat supplier";
      return res.status(400).json({ success: false, message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID supplier tidak valid",
        });
      }

      const parsed = updateSupplierSchema.parse(req.body);

      const supplier = await service.update(id, {
        nama: parsed.nama,
        telepon: parsed.telepon,
        email: parsed.email,
        alamat: parsed.alamat,
        kota: parsed.kota,
        provinsi: parsed.provinsi,
      });

      return res.json({
        success: true,
        message: "Supplier berhasil diperbarui",
        data: supplier,
      });
    } catch (error: any) {
      const message = error?.message || "Gagal memperbarui supplier";
      return res.status(400).json({ success: false, message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID supplier tidak valid",
        });
      }

      await service.delete(id);

      return res.json({
        success: true,
        message: "Supplier berhasil dihapus",
      });
    } catch (error: any) {
      const message = error?.message || "Gagal menghapus supplier";
      return res.status(400).json({ success: false, message });
    }
  }
}
