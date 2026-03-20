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
 * Extracts and verifies JWT from Authorization header
 */
export function verifyAuthFromRequest(req: Request): {
  userId: string;
  role: string;
} {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED: Missing authorization header");
  }
  return verifyToken(authHeader.split(" ")[1]);
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
