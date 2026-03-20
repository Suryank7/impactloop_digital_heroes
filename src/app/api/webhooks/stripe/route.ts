import { NextResponse } from "next/server";
import { StripeService } from "../../../../server/services/stripe.service";

// POST /api/webhooks/stripe — Stripe webhook handler
export async function POST(req: Request) {
  try {
    const body = await req.text(); // Raw body for signature verification
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { status: "error", message: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const result = await StripeService.handleWebhook(body, signature);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[STRIPE WEBHOOK ERROR]", error.message);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 400 }
    );
  }
}
