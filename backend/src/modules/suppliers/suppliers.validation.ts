import { z } from "zod";

export const createSupplierSchema = z.object({
  nama: z.string().min(1),
  telepon: z.string().min(1),
  email: z.string().email(),
  alamat: z.string().min(1),
  kota: z.string().optional(),
  provinsi: z.string().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();
