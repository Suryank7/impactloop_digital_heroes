import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UserRepository } from "../../../../server/repositories/user.repository";
import { LoginSchema, verifyPassword, generateToken, handleApiError } from "../../../../server/security/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = LoginSchema.parse(body);

    // ---- DEMO BYPASS: UNBLOCK USER ACCESS ----
    if (data.email === "demo@example.com" && data.password === "pass@123") {
      const token = generateToken("demo-hero-id", "ADMIN");
      const cookieStore = await cookies();
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return NextResponse.json({
        status: "success",
        data: {
          user: { 
            id: "demo-hero-id", 
            name: "Digital Hero (Demo)", 
            email: "demo@example.com", 
            role: "ADMIN" 
          },
          token,
        },
      });
    }

    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { status: "error", message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken(user.id, user.role);
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({
      status: "success",
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
