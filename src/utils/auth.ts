import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  userId: number;
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, SECRET, { expiresIn: "2h" });
}

export function verifyToken(token?: string): JwtPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}