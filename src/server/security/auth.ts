import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_in_production";

// ---- Zod Validation Schemas ----

export const SignupSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).trim().toLowerCase(),
  password: z.string().min(8).max(100),
});

export const LoginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

export const ScoreSubmissionSchema = z.object({
  score: z.number().int().min(1).max(45),
});

export const DrawRunSchema = z.object({
  mode: z.enum(["RANDOM", "ALGORITHM"]).default("RANDOM"),
});

export const CharityCreateSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  description: z.string().max(500).optional(),
  image: z.string().url().optional(),
});

// ---- JWT Utilities ----

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; role: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    throw new Error("UNAUTHORIZED: Invalid or expired token");
  }
}

/**
 * Extracts and verifies JWT from Authorization header OR HttpOnly Cookie
 */
export function verifyAuthFromRequest(req: Request): {
  userId: string;
  role: string;
} {
  // 1. Check Header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return verifyToken(authHeader.split(" ")[1]);
  }

  // 2. Check Cookie (Manual parse for edge/universal compatibility)
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      })
    );
    if (cookies.auth_token) {
      return verifyToken(cookies.auth_token);
    }
  }

  throw new Error("UNAUTHORIZED: Missing authorization session");
}

/**
 * Role guard: throws if user doesn't have admin role
 */
export function requireAdmin(auth: { userId: string; role: string }) {
  if (auth.role !== "ADMIN") {
    throw new Error("FORBIDDEN: Admin access required");
  }
}

// ---- Password Utilities ----

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ---- Error Handler ----

export function handleApiError(error: unknown) {
  if (error instanceof z.ZodError) {
    return Response.json(
      { status: "error", message: "Validation Failed", issues: error.issues },
      { status: 400 }
    );
  }

  const msg = error instanceof Error ? error.message : "Internal Server Error";

  if (msg.startsWith("UNAUTHORIZED")) {
    return Response.json({ status: "error", message: msg }, { status: 401 });
  }
  if (msg.startsWith("FORBIDDEN")) {
    return Response.json({ status: "error", message: msg }, { status: 403 });
  }
  if (msg.startsWith("VALIDATION")) {
    return Response.json({ status: "error", message: msg }, { status: 400 });
  }

  // Log unexpected errors
  console.error("[API ERROR]", error);
  return Response.json(
    { status: "error", message: "Internal Server Error" },
    { status: 500 }
  );
}
