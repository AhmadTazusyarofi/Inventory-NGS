import fs from "fs";
import path from "path";
import { prisma } from "../../config/db";

export class ItemsService {
  async getAll() {
    const items = await prisma.barang.findMany({
      include: {
        kategori: true,
        supplier: true,
      },
    });
    return items;
  }

  async create(data: {
    kode: string;
    nama: string;
    id_kategori: number;
    id_supplier: number;
    satuan: string;
    stok?: number | null;
    stok_minimum: number;
    deskripsi?: string | null;
    url_gambar?: string | null;
  }) {
    const {
      kode,
      nama,
      id_kategori,
      id_supplier,
      satuan,
      stok,
      stok_minimum,
      deskripsi,
      url_gambar,
    } = data;

    const existing = await prisma.barang.findUnique({ where: { kode } });
    if (existing) {
      throw new Error("Kode barang sudah digunakan");
    }

    const item = await prisma.barang.create({
      data: {
        kode,
        nama,
        id_kategori,
        id_supplier,
        satuan,
        stok: stok ?? 0,
        stok_minimum,
        deskripsi: deskripsi ?? null,
        url_gambar: url_gambar ?? null,
      },
      include: {
        kategori: true,
        supplier: true,
      },
    });

    return item;
  }

  async update(
    id: number,
    data: {
      kode?: string;
      nama?: string;
      id_kategori?: number;
      id_supplier?: number;
      satuan?: string;
      stok?: number | null;
      stok_minimum?: number;
      deskripsi?: string | null;
      url_gambar?: string | null;
    }
  ) {
    if (data.kode) {
      const existing = await prisma.barang.findFirst({
        where: {
          kode: data.kode,
          NOT: { id },
        },
      });

      if (existing) {
        throw new Error("Kode barang sudah digunakan");
      }
    }

    // Fetch existing item to handle image replacement
    const existing = await prisma.barang.findUnique({ where: { id } });

    const item = await prisma.barang.update({
      where: { id },
      data: {
        ...(data.kode !== undefined ? { kode: data.kode } : {}),
        ...(data.nama !== undefined ? { nama: data.nama } : {}),
        ...(data.id_kategori !== undefined
          ? { id_kategori: data.id_kategori }
          : {}),
        ...(data.id_supplier !== undefined
          ? { id_supplier: data.id_supplier }
          : {}),
        ...(data.satuan !== undefined ? { satuan: data.satuan } : {}),
        ...(data.stok !== undefined ? { stok: data.stok } : {}),
        ...(data.stok_minimum !== undefined
          ? { stok_minimum: data.stok_minimum }
          : {}),
        ...(data.deskripsi !== undefined ? { deskripsi: data.deskripsi } : {}),
        ...(data.url_gambar !== undefined
          ? { url_gambar: data.url_gambar }
          : {}),
      },
      include: {
        kategori: true,
        supplier: true,
      },
    });

    // If a new image path is provided and there was an old image, delete the old file
    if (
      data.url_gambar &&
      existing?.url_gambar &&
      data.url_gambar !== existing.url_gambar
    ) {
      const oldPath = existing.url_gambar.replace(/^\/+/, "");
      const filePath = path.join("public", oldPath);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          // swallow filesystem errors to avoid breaking the response
          console.error("Failed to delete old image", err);
        }
      }
    }

    return item;
  }

  async delete(id: number) {
    const existing = await prisma.barang.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Item not found");
    }

    // Delete associated image file if exists
    if (existing.url_gambar) {
      const oldPath = existing.url_gambar.replace(/^\/+/, "");
      const filePath = path.join("public", oldPath);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("Failed to delete image on item delete", err);
        }
      }
    }

    const deleted = await prisma.barang.delete({ where: { id } });
    return deleted;
  }
}
