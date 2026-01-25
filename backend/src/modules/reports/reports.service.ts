import { prisma } from "../../config/db";

export class ReportsService {
  async getCurrentStockReport(options?: { lowStockOnly?: boolean }) {
    const stokList = await prisma.stokGudang.findMany({
      include: {
        barang: true,
        gudang: true,
      },
      orderBy: {
        id_gudang: "asc",
      },
    });

    const rows = stokList
      .filter((s) => {
        if (!options?.lowStockOnly) return true;
        if (s.barang.stok_minimum == null) return false;
        return s.stok_now < s.barang.stok_minimum;
      })
      .map((s) => ({
        warehouseCode: s.gudang.kode,
        warehouseName: s.gudang.nama,
        itemCode: s.barang.kode,
        itemName: s.barang.nama,
        currentStock: s.stok_now,
        minStock: s.barang.stok_minimum,
      }));

    return rows;
  }

  async getStockMovementReport(filters?: {
    tanggalFrom?: string;
    tanggalTo?: string;
    jenis_mutasi?: string;
  }) {
    const where: any = {};

    if (filters?.tanggalFrom || filters?.tanggalTo) {
      where.created_at = {};
      if (filters.tanggalFrom) {
        where.created_at.gte = new Date(filters.tanggalFrom);
      }
      if (filters.tanggalTo) {
        const to = new Date(filters.tanggalTo);
        // set ke akhir hari
        to.setHours(23, 59, 59, 999);
        where.created_at.lte = to;
      }
    }

    if (filters?.jenis_mutasi) {
      where.jenis_mutasi = filters.jenis_mutasi;
    }

    const mutations = await prisma.mutasiStok.findMany({
      where,
      orderBy: { created_at: "asc" },
      include: {
        barang: true,
        gudang: true,
        user: true,
      },
    });

    const rows = mutations.map((m) => ({
      date: m.created_at,
      mutationType: m.jenis_mutasi,
      adjustmentType: m.jenis_penyesuaian ?? "",
      itemCode: m.barang.kode,
      itemName: m.barang.nama,
      warehouseName: m.gudang.nama,
      quantity: m.jumlah,
      userName: m.user.nama,
      notes: m.catatan ?? "",
    }));

    return rows;
  }
}
