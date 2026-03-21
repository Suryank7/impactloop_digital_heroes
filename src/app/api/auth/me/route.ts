import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_in_production";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // ---- DEMO BYPASS: UNBLOCK SESSION ACCESS ----
    if (decoded.userId === "demo-hero-id") {
      return NextResponse.json({
        user: {
          id: "demo-hero-id",
          name: "Digital Hero (Demo)",
          email: "demo@example.com",
          role: "ADMIN",
          isSubscribed: true, // Show premium features
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        ...user,
        isSubscribed: user.subscriptions.length > 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
