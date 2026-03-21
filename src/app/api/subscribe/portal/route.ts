import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27" as any,
});

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_in_production";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        subscriptions: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    if (!user || user.subscriptions.length === 0) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.subscriptions[0].stripeId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Portal Error:", error);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
