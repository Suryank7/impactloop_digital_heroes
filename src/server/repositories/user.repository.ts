import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

export class UserRepository {
  static async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { subscriptions: true },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { subscriptions: true },
    });
  }
}

export class SubscriptionRepository {
  static async upsert(
    userId: string,
    data: {
      planType: string;
      status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
      stripeCustomerId?: string;
      renewalDate?: Date;
    }
  ) {
    const existing = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (existing) {
      return prisma.subscription.update({
        where: { id: existing.id },
        data,
      });
    }

    return prisma.subscription.create({
      data: { userId, ...data },
    });
  }

  static async updateByStripeCustomerId(
    stripeCustomerId: string,
    status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE",
    renewalDate: Date
  ) {
    return prisma.subscription.update({
      where: { stripeCustomerId },
      data: { status, renewalDate },
    });
  }
}
