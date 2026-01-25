import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

const JWT_SECRET = env.jwtSecret || "change-me";

export const generateToken = (userId: number | string): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign({ userId }, JWT_SECRET, options);
};

export const verifyToken = (token: string): { userId: number | string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: number | string };
};
