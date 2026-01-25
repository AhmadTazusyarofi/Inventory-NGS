import { z } from "zod";

export const createUserSchema = z.object({
  nama: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().min(1),
});

export const updateUserSchema = createUserSchema.partial();
