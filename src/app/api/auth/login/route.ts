import { NextResponse } from "next/server";
import { UserRepository } from "../../../../server/repositories/user.repository";
import { LoginSchema, verifyPassword, generateToken, handleApiError } from "../../../../server/security/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = LoginSchema.parse(body);

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
