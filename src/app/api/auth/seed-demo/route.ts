import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "../../../../server/security/auth";

export async function GET() {
  try {
    const email = "demo@example.com";
    const name = "demo user";
    const password = "pass@123";

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Demo user already exists", user: { email: existing.email, role: existing.role } });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "ADMIN",
      },
    });

    return NextResponse.json({ message: "Demo user created successfully!", user: { email: user.email, role: user.role } });
  } catch (error: any) {
    console.error("Seed Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
