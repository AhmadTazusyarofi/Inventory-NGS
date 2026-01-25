import { z } from "zod";

export const createCategorySchema = z.object({
  nama: z.string().min(1),
  deskripsi: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
