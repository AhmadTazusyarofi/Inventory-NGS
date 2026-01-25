import { prisma } from "../../config/db";

interface LogPayload {
  userId: number;
  action: string;
  description: string;
}

export class ActivityService {
  async log(payload: LogPayload) {
    return prisma.logAktivitas.create({
      data: {
        id_user: payload.userId,
        aksi: payload.action,
        deskripsi: payload.description,
      },
    });
  }

  async getAll() {
    return prisma.logAktivitas.findMany({
      orderBy: { created_at: "desc" },
    });
  }
}
