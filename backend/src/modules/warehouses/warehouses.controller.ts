import { Request, Response } from "express";
import { WarehousesService } from "./warehouses.service";

const service = new WarehousesService();

export class WarehousesController {
  async getAll(_req: Request, res: Response) {
    try {
      const warehouses = await service.getAll();
      return res.json({ success: true, data: warehouses });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch warehouses",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { kode, nama, lokasi, alamat, kapasitas, status } = req.body;

      const warehouse = await service.create({
        kode,
        nama,
        lokasi,
        alamat,
        kapasitas: kapasitas !== undefined ? Number(kapasitas) : null,
        status,
      });

      return res.status(201).json({
        success: true,
        message: "Warehouse created successfully",
        data: warehouse,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create warehouse",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid warehouse id",
        });
      }

      const { kode, nama, lokasi, alamat, kapasitas, status } = req.body;

      const warehouse = await service.update(id, {
        kode,
        nama,
        lokasi,
        alamat,
        kapasitas: kapasitas !== undefined ? Number(kapasitas) : undefined,
        status,
      });

      return res.json({
        success: true,
        message: "Warehouse updated successfully",
        data: warehouse,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update warehouse",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid warehouse id",
        });
      }

      await service.delete(id);

      return res.json({
        success: true,
        message: "Warehouse deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete warehouse",
      });
    }
  }
}
