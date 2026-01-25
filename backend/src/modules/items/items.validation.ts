import { z } from "zod";

export const createItemSchema = z.object({
  kode: z.string().min(1),
  nama: z.string().min(1),
  id_kategori: z.coerce.number(),
  id_supplier: z.coerce.number(),
  satuan: z.string().min(1),
  stok_minimum: z.coerce.number(),
  deskripsi: z.string().optional(),
});

export const updateItemSchema = createItemSchema.partial();
