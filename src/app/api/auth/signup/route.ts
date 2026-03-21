import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { hashPassword } from "../../../../server/security/auth";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27" as any,
});

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_in_production";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // 2. Create User
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
      },
    });

    // 3. Generate Session
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
       maxAge: 60 * 60 * 24 * 7,
       path: "/",
    });

    // 4. Create Stripe Session
    // Using the price ID from env or a hardcoded one for now if not provided
    const priceId = process.env.STRIPE_MONTHLY_PRICE_ID || "price_1P..."; 
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
      customer_email: user.email,
      metadata: { userId: user.id },
    });

    return NextResponse.json({ 
      status: "success", 
      data: { user: { id: user.id, name: user.name, email: user.email } },
      checkoutUrl: session.url 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
