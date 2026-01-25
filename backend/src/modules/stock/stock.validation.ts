import { z } from "zod";

export const stockFilterSchema = z.object({
  tanggalFrom: z.string().optional(),
  tanggalTo: z.string().optional(),
  jenis_mutasi: z.string().optional(),
});
