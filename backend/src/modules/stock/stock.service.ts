import { prisma } from "../../config/db";

export class StockService {
  async getMutations() {
    return prisma.mutasiStok.findMany({
      orderBy: { created_at: "desc" },
      include: {
        barang: true,
        gudang: true,
        user: true,
      },
    });
  }

  async createIn(data: {
    id_barang: number;
    id_gudang: number;
    jumlah: number;
    catatan?: string | null;
    dibuat_oleh: number;
    tanggal?: Date;
    nomor_batch?: string | null;
    tanggal_kedaluwarsa?: Date | null;
  }) {
    const result = await prisma.$transaction(async (tx) => {
      let batchId: number | null = null;

      if (data.nomor_batch && data.tanggal_kedaluwarsa) {
        const batch = await tx.batchBarang.create({
          data: {
            id_barang: data.id_barang,
            id_gudang: data.id_gudang,
            nomor_batch: data.nomor_batch,
            tanggal_kedaluwarsa: data.tanggal_kedaluwarsa,
            jumlah: data.jumlah,
          },
        });

        batchId = batch.id;
      }

      const mutation = await tx.mutasiStok.create({
        data: {
          id_barang: data.id_barang,
          id_gudang: data.id_gudang,
          jumlah: data.jumlah,
          jenis_mutasi: "masuk",
          id_batch: batchId,
          catatan: data.catatan ?? null,
          dibuat_oleh: data.dibuat_oleh,
          created_at: data.tanggal ?? new Date(),
        },
        include: {
          barang: true,
          gudang: true,
          user: true,
        },
      });

      await tx.stokGudang.upsert({
        where: {
          id_barang_id_gudang: {
            id_barang: data.id_barang,
            id_gudang: data.id_gudang,
          },
        },
        update: {
          stok_now: {
            increment: data.jumlah,
          },
        },
        create: {
          id_barang: data.id_barang,
          id_gudang: data.id_gudang,
          stok_now: data.jumlah,
        },
      });

      return mutation;
    });

    return result;
  }

  async createAdjustment(data: {
    id_barang: number;
    id_gudang: number;
    jumlah: number;
    jenis_penyesuaian: string;
    catatan?: string | null;
    dibuat_oleh: number;
    tanggal?: Date;
  }) {
    const stokGudang = await prisma.stokGudang.findUnique({
      where: {
        id_barang_id_gudang: {
          id_barang: data.id_barang,
          id_gudang: data.id_gudang,
        },
      },
    });

    const isIncrease = data.jenis_penyesuaian === "retur";

    if (!stokGudang && !isIncrease) {
      throw new Error(
        "Tidak dapat mengurangi stok karena stok gudang belum ada"
      );
    }

    if (stokGudang && !isIncrease && stokGudang.stok_now < data.jumlah) {
      throw new Error("Stok gudang tidak mencukupi untuk penyesuaian");
    }

    const mutation = await prisma.mutasiStok.create({
      data: {
        id_barang: data.id_barang,
        id_gudang: data.id_gudang,
        jumlah: data.jumlah,
        jenis_mutasi: "penyesuaian",
        jenis_penyesuaian: data.jenis_penyesuaian,
        catatan: data.catatan ?? null,
        dibuat_oleh: data.dibuat_oleh,
        created_at: data.tanggal ?? new Date(),
      },
      include: {
        barang: true,
        gudang: true,
        user: true,
      },
    });

    if (isIncrease) {
      await prisma.stokGudang.upsert({
        where: {
          id_barang_id_gudang: {
            id_barang: data.id_barang,
            id_gudang: data.id_gudang,
          },
        },
        update: {
          stok_now: {
            increment: data.jumlah,
          },
        },
        create: {
          id_barang: data.id_barang,
          id_gudang: data.id_gudang,
          stok_now: data.jumlah,
        },
      });
    } else {
      await prisma.stokGudang.update({
        where: {
          id_barang_id_gudang: {
            id_barang: data.id_barang,
            id_gudang: data.id_gudang,
          },
        },
        data: {
          stok_now: {
            decrement: data.jumlah,
          },
        },
      });
    }

    return mutation;
  }

  async createOut(data: {
    id_barang: number;
    id_gudang: number;
    jumlah: number;
    catatan?: string | null;
    dibuat_oleh: number;
    tanggal?: Date;
  }) {
    const stokGudang = await prisma.stokGudang.findUnique({
      where: {
        id_barang_id_gudang: {
          id_barang: data.id_barang,
          id_gudang: data.id_gudang,
        },
      },
    });

    if (!stokGudang || stokGudang.stok_now < data.jumlah) {
      throw new Error("Stok gudang tidak mencukupi untuk barang keluar");
    }

    const mutation = await prisma.mutasiStok.create({
      data: {
        id_barang: data.id_barang,
        id_gudang: data.id_gudang,
        jumlah: data.jumlah,
        jenis_mutasi: "keluar",
        catatan: data.catatan ?? null,
        dibuat_oleh: data.dibuat_oleh,
        created_at: data.tanggal ?? new Date(),
      },
      include: {
        barang: true,
        gudang: true,
        user: true,
      },
    });

    await prisma.stokGudang.update({
      where: {
        id_barang_id_gudang: {
          id_barang: data.id_barang,
          id_gudang: data.id_gudang,
        },
      },
      data: {
        stok_now: {
          decrement: data.jumlah,
        },
      },
    });

    return mutation;
  }

  async getTransfers() {
    return prisma.transferStok.findMany({
      orderBy: { tanggal: "desc" },
      include: {
        gudang_asal: true,
        gudang_tujuan: true,
        user: true,
        detail: {
          include: {
            barang: true,
          },
        },
      },
    });
  }

  async createTransfer(data: {
    id_barang: number;
    id_gudang_asal: number;
    id_gudang_tujuan: number;
    jumlah: number;
    catatan?: string | null;
    tanggal?: Date;
    dibuat_oleh: number;
  }) {
    if (data.id_gudang_asal === data.id_gudang_tujuan) {
      throw new Error("Gudang asal dan tujuan tidak boleh sama");
    }

    const result = await prisma.$transaction(async (tx) => {
      const stokAsal = await tx.stokGudang.findUnique({
        where: {
          id_barang_id_gudang: {
            id_barang: data.id_barang,
            id_gudang: data.id_gudang_asal,
          },
        },
      });

      if (!stokAsal || stokAsal.stok_now < data.jumlah) {
        throw new Error("Stok di gudang asal tidak mencukupi untuk transfer");
      }

      const transfer = await tx.transferStok.create({
        data: {
          nomor_transfer: `TRF-${Date.now()}`,
          id_gudang_asal: data.id_gudang_asal,
          id_gudang_tujuan: data.id_gudang_tujuan,
          tanggal: data.tanggal ?? new Date(),
          status: "selesai",
          catatan: data.catatan ?? null,
          dibuat_oleh: data.dibuat_oleh,
        },
      });

      await tx.detailTransferStok.create({
        data: {
          id_transfer: transfer.id,
          id_barang: data.id_barang,
          jumlah: data.jumlah,
        },
      });

      await tx.stokGudang.update({
        where: {
          id_barang_id_gudang: {
            id_barang: data.id_barang,
            id_gudang: data.id_gudang_asal,
          },
        },
        data: {
          stok_now: {
            decrement: data.jumlah,
          },
        },
      });

      await tx.stokGudang.upsert({
        where: {
          id_barang_id_gudang: {
            id_barang: data.id_barang,
            id_gudang: data.id_gudang_tujuan,
          },
        },
        update: {
          stok_now: {
            increment: data.jumlah,
          },
        },
        create: {
          id_barang: data.id_barang,
          id_gudang: data.id_gudang_tujuan,
          stok_now: data.jumlah,
        },
      });

      const fullTransfer = await tx.transferStok.findUnique({
        where: { id: transfer.id },
        include: {
          gudang_asal: true,
          gudang_tujuan: true,
          user: true,
          detail: {
            include: {
              barang: true,
            },
          },
        },
      });

      return fullTransfer!;
    });

    return result;
  }

  async getOpnames() {
    return prisma.opnameStok.findMany({
      orderBy: { tanggal: "desc" },
      include: {
        gudang: true,
        user: true,
        detail: {
          include: {
            barang: true,
          },
        },
      },
    });
  }

  async startOpname(data: {
    id_gudang: number;
    tanggal?: Date;
    dibuat_oleh: number;
  }) {
    return prisma.$transaction(async (tx) => {
      const stokList = await tx.stokGudang.findMany({
        where: { id_gudang: data.id_gudang },
        include: {
          barang: true,
        },
      });

      const nomor = `OP-${new Date().getFullYear()}-${Date.now()}`;

      const opname = await tx.opnameStok.create({
        data: {
          nomor_opname: nomor,
          id_gudang: data.id_gudang,
          tanggal: data.tanggal ?? new Date(),
          status: "proses",
          total_item: stokList.length,
          total_selisih: 0,
          dibuat_oleh: data.dibuat_oleh,
        },
      });

      if (stokList.length > 0) {
        await tx.detailOpnameStok.createMany({
          data: stokList.map((s) => ({
            id_opname: opname.id,
            id_barang: s.id_barang,
            stok_sistem: s.stok_now,
            stok_fisik: s.stok_now,
            selisih: 0,
            status: "sesuai",
          })),
        });
      }

      const full = await tx.opnameStok.findUnique({
        where: { id: opname.id },
        include: {
          gudang: true,
          user: true,
          detail: {
            include: {
              barang: true,
            },
          },
        },
      });

      return full!;
    });
  }

  async getExpiredBatches() {
    const now = new Date();

    // Ambil semua batch; filtering lanjutan bisa dilakukan di controller/FE jika diperlukan
    const batches = await prisma.batchBarang.findMany({
      include: {
        barang: true,
        gudang: true,
      },
    });

    return { now, batches };
  }
}
