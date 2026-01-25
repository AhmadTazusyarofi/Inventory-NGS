import { prisma } from "../../config/db";

export class WarehousesService {
  async getAll() {
    const [warehouses, stockByWarehouse] = await Promise.all([
      prisma.gudang.findMany(),
      prisma.stokGudang.groupBy({
        by: ["id_gudang"],
        _sum: { stok_now: true },
      }),
    ]);

    const stockMap = new Map<number, number>();
    for (const row of stockByWarehouse) {
      stockMap.set(row.id_gudang, row._sum.stok_now ?? 0);
    }

    return warehouses.map((w) => ({
      ...w,
      currentStock: stockMap.get(w.id) ?? 0,
    }));
  }

  async create(data: {
    kode: string;
    nama: string;
    lokasi: string;
    alamat: string;
    kapasitas?: number | null;
    status: string;
  }) {
    const existing = await prisma.gudang.findUnique({
      where: { kode: data.kode },
    });
    if (existing) {
      throw new Error("Kode gudang sudah digunakan");
    }

    const warehouse = await prisma.gudang.create({
      data: {
        kode: data.kode,
        nama: data.nama,
        lokasi: data.lokasi,
        alamat: data.alamat,
        kapasitas: data.kapasitas ?? null,
        status: data.status,
      },
    });

    return warehouse;
  }

  async update(
    id: number,
    data: {
      kode?: string;
      nama?: string;
      lokasi?: string;
      alamat?: string;
      kapasitas?: number | null;
      status?: string;
    }
  ) {
    if (data.kode) {
      const existing = await prisma.gudang.findFirst({
        where: {
          kode: data.kode,
          NOT: { id },
        },
      });

      if (existing) {
        throw new Error("Kode gudang sudah digunakan");
      }
    }

    const warehouse = await prisma.gudang.update({
      where: { id },
      data: {
        ...(data.kode !== undefined ? { kode: data.kode } : {}),
        ...(data.nama !== undefined ? { nama: data.nama } : {}),
        ...(data.lokasi !== undefined ? { lokasi: data.lokasi } : {}),
        ...(data.alamat !== undefined ? { alamat: data.alamat } : {}),
        ...(data.kapasitas !== undefined ? { kapasitas: data.kapasitas } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
    });

    return warehouse;
  }

  async delete(id: number) {
    await prisma.gudang.delete({ where: { id } });
  }
}
