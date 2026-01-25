import { Request, Response } from "express";
import { StockService } from "./stock.service";

const service = new StockService();

export class StockController {
  async getMutations(_req: Request, res: Response) {
    try {
      const data = await service.getMutations();
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch stock mutations",
      });
    }
  }

  async createStockIn(req: Request, res: Response) {
    try {
      const {
        id_barang,
        id_gudang,
        jumlah,
        catatan,
        tanggal,
        nomor_batch,
        tanggal_kedaluwarsa,
      } = req.body;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const mutation = await service.createIn({
        id_barang: Number(id_barang),
        id_gudang: Number(id_gudang),
        jumlah: Number(jumlah),
        catatan: catatan ?? null,
        dibuat_oleh: Number(userId),
        tanggal: tanggal ? new Date(tanggal) : undefined,
        nomor_batch: nomor_batch ?? null,
        tanggal_kedaluwarsa: tanggal_kedaluwarsa
          ? new Date(tanggal_kedaluwarsa)
          : null,
      });

      return res.status(201).json({
        success: true,
        message: "Stock IN berhasil dicatat",
        data: mutation,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create stock IN",
      });
    }
  }

  async createStockOut(req: Request, res: Response) {
    try {
      const { id_barang, id_gudang, jumlah, catatan, tanggal } = req.body;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const mutation = await service.createOut({
        id_barang: Number(id_barang),
        id_gudang: Number(id_gudang),
        jumlah: Number(jumlah),
        catatan: catatan ?? null,
        dibuat_oleh: Number(userId),
        tanggal: tanggal ? new Date(tanggal) : undefined,
      });

      return res.status(201).json({
        success: true,
        message: "Stock OUT berhasil dicatat",
        data: mutation,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create stock OUT",
      });
    }
  }

  async getTransfers(_req: Request, res: Response) {
    try {
      const data = await service.getTransfers();
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch stock transfers",
      });
    }
  }

  async createTransfer(req: Request, res: Response) {
    try {
      const {
        id_barang,
        id_gudang_asal,
        id_gudang_tujuan,
        jumlah,
        catatan,
        tanggal,
      } = req.body;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const transfer = await service.createTransfer({
        id_barang: Number(id_barang),
        id_gudang_asal: Number(id_gudang_asal),
        id_gudang_tujuan: Number(id_gudang_tujuan),
        jumlah: Number(jumlah),
        catatan: catatan ?? null,
        tanggal: tanggal ? new Date(tanggal) : undefined,
        dibuat_oleh: Number(userId),
      });

      return res.status(201).json({
        success: true,
        message: "Transfer stok berhasil dicatat",
        data: transfer,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create stock transfer",
      });
    }
  }

  async createAdjustment(req: Request, res: Response) {
    try {
      const {
        id_barang,
        id_gudang,
        jumlah,
        jenis_penyesuaian,
        catatan,
        tanggal,
      } = req.body;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const mutation = await service.createAdjustment({
        id_barang: Number(id_barang),
        id_gudang: Number(id_gudang),
        jumlah: Number(jumlah),
        jenis_penyesuaian,
        catatan: catatan ?? null,
        dibuat_oleh: Number(userId),
        tanggal: tanggal ? new Date(tanggal) : undefined,
      });

      return res.status(201).json({
        success: true,
        message: "Penyesuaian stok berhasil dicatat",
        data: mutation,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create stock adjustment",
      });
    }
  }

  async getOpnames(_req: Request, res: Response) {
    try {
      const data = await service.getOpnames();
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch stock opnames",
      });
    }
  }

  async startOpname(req: Request, res: Response) {
    try {
      const { id_gudang, tanggal } = req.body;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const opname = await service.startOpname({
        id_gudang: Number(id_gudang),
        tanggal: tanggal ? new Date(tanggal) : undefined,
        dibuat_oleh: Number(userId),
      });

      return res.status(201).json({
        success: true,
        message: "Stock opname berhasil dibuat",
        data: opname,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to start stock opname",
      });
    }
  }

  async getExpiredItems(_req: Request, res: Response) {
    try {
      const { now, batches } = await service.getExpiredBatches();

      const today = new Date(now);

      const data = batches.map((b) => {
        const expiry = new Date(b.tanggal_kedaluwarsa);
        const diffMs = expiry.getTime() - today.getTime();
        const daysUntilExpiry = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let status = "normal";
        if (daysUntilExpiry < 0) {
          status = "expired";
        } else if (daysUntilExpiry < 7) {
          status = "critical";
        } else if (daysUntilExpiry < 30) {
          status = "warning";
        }

        return {
          id: b.id,
          itemCode: b.barang.kode,
          itemName: b.barang.nama,
          warehouse: b.gudang.nama,
          stock: b.jumlah,
          expiryDate: b.tanggal_kedaluwarsa,
          daysUntilExpiry,
          status,
        };
      });

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch expired items",
      });
    }
  }
}
