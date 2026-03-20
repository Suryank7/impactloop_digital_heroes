import { NextResponse } from "next/server";
import { StripeService } from "../../../server/services/stripe.service";
import { verifyAuthFromRequest, handleApiError } from "../../../server/security/auth";
import { UserRepository } from "../../../server/repositories/user.repository";

// POST /api/subscribe — Create a Stripe checkout session
export async function POST(req: Request) {
  try {
    const auth = verifyAuthFromRequest(req);
    const user = await UserRepository.findById(auth.userId);
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      );
    }

    const result = await StripeService.createCheckoutSession(user.id, user.email);

    return NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/subscribe — Get current subscription status
export async function GET(req: Request) {
  try {
    const auth = verifyAuthFromRequest(req);
    const user = await UserRepository.findById(auth.userId);
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: { subscriptions: user.subscriptions },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
