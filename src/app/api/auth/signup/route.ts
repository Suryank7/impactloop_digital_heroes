import { NextResponse } from "next/server";
import { UserRepository } from "../../../../server/repositories/user.repository";
import { SignupSchema, hashPassword, generateToken, handleApiError } from "../../../../server/security/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = SignupSchema.parse(body);

    // Check if user already exists
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(data.password);

    const user = await UserRepository.createUser({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    const token = generateToken(user.id, user.role);

    return NextResponse.json(
      {
        status: "success",
        data: { user: { id: user.id, name: user.name, email: user.email }, token },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
