import { prisma } from "../../config/db";

export class SuppliersService {
  async getAll() {
    return prisma.supplier.findMany();
  }

  async create(data: {
    nama: string;
    telepon: string;
    email: string;
    alamat: string;
    kota?: string | null;
    provinsi?: string | null;
  }) {
    const existing = await prisma.supplier.findFirst({
      where: { nama: data.nama },
    });

    if (existing) {
      throw new Error("Nama supplier sudah digunakan");
    }

    const supplier = await prisma.supplier.create({
      data: {
        nama: data.nama,
        telepon: data.telepon,
        email: data.email,
        alamat: data.alamat,
        kota: data.kota ?? null,
        provinsi: data.provinsi ?? null,
      },
    });

    return supplier;
  }

  async update(
    id: number,
    data: {
      nama?: string;
      telepon?: string;
      email?: string;
      alamat?: string;
      kota?: string | null;
      provinsi?: string | null;
    }
  ) {
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        ...(data.nama !== undefined ? { nama: data.nama } : {}),
        ...(data.telepon !== undefined ? { telepon: data.telepon } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.alamat !== undefined ? { alamat: data.alamat } : {}),
        ...(data.kota !== undefined ? { kota: data.kota } : {}),
        ...(data.provinsi !== undefined ? { provinsi: data.provinsi } : {}),
      },
    });

    return supplier;
  }

  async delete(id: number) {
    await prisma.supplier.delete({ where: { id } });
  }
}
