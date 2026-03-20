import Stripe from "stripe";
import { SubscriptionRepository } from "../repositories/user.repository";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  typescript: true,
});

export class StripeService {
  /**
   * Creates a Stripe Checkout Session for subscription
   */
  static async createCheckoutSession(userId: string, email: string) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_MONTHLY_PRICE_ID || "price_placeholder",
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/`,
      customer_email: email,
      client_reference_id: userId,
      subscription_data: { metadata: { userId } },
    });

    return { url: session.url };
  }

  /**
   * Handles Stripe webhook events with strict signature verification
   */
  static async handleWebhook(body: string, signature: string) {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as any; // Cast to any to bypass strict Stripe type conflicts in Vercel environment
        const userId = sub.metadata?.userId;
        if (!userId) throw new Error("Missing userId in subscription metadata");

        await SubscriptionRepository.upsert(userId, {
          planType: "monthly",
          status: sub.status === "active" ? "ACTIVE" : "PAST_DUE",
          stripeCustomerId: sub.customer as string,
          renewalDate: new Date((sub.current_period_end as number) * 1000),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        if (sub.customer) {
          await SubscriptionRepository.updateByStripeCustomerId(
            sub.customer as string,
            "CANCELLED",
            new Date((sub.current_period_end as number) * 1000)
          );
        }
        break;
      }
    }

    return { received: true };
  }
}
