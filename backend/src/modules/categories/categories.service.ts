import { prisma } from "../../config/db";

export class CategoriesService {
  async getAll() {
    return prisma.kategori.findMany();
  }

  async create(data: { nama: string; deskripsi?: string | null }) {
    const existing = await prisma.kategori.findFirst({
      where: { nama: data.nama },
    });

    if (existing) {
      throw new Error("Nama kategori sudah digunakan");
    }

    const kategori = await prisma.kategori.create({
      data: {
        nama: data.nama,
        deskripsi: data.deskripsi ?? null,
      },
    });

    return kategori;
  }

  async update(id: number, data: { nama?: string; deskripsi?: string | null }) {
    const kategori = await prisma.kategori.update({
      where: { id },
      data: {
        ...(data.nama !== undefined ? { nama: data.nama } : {}),
        ...(data.deskripsi !== undefined ? { deskripsi: data.deskripsi } : {}),
      },
    });

    return kategori;
  }

  async delete(id: number) {
    await prisma.kategori.delete({ where: { id } });
  }
}
