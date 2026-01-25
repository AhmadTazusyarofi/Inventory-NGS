import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";

export class UserService {
  async getAll() {
    return prisma.user.findMany();
  }

  async updateProfile(userId: number, data: { nama: string; email: string }) {
    const { nama, email } = data;

    // Pastikan email tidak dipakai user lain
    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });

    if (existing) {
      throw new Error("Email sudah digunakan oleh pengguna lain");
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { nama, email },
    });

    return user;
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new Error("Password saat ini tidak sesuai");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashed },
    });

    return true;
  }
}
