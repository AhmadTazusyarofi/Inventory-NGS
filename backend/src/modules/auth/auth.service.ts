import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { generateToken } from "../../utils/jwt";

export class AuthService {
  async login(identifier: string, password: string) {
    // identifier di sini dianggap sebagai email
    const user = await prisma.user.findFirst({
      where: {
        email: identifier,
        aktif: true,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id);

    return {
      token,
      user,
    };
  }

  async register(input: {
    nama: string;
    username: string;
    email: string;
    password: string;
    role: string;
  }) {
    const { nama, username, email, password, role } = input;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      throw new Error("Email atau username sudah digunakan");
    }

    const hashed = await bcrypt.hash(password, 10);

    const normalizedRole = role.toLowerCase();
    const finalRole =
      normalizedRole === "admin" || normalizedRole === "staf_gudang"
        ? normalizedRole
        : "staf_gudang";

    const user = await prisma.user.create({
      data: {
        nama,
        username,
        email,
        password_hash: hashed,
        role: finalRole,
        aktif: true,
      },
    });

    const token = generateToken(user.id);

    return {
      token,
      user,
    };
  }
}
