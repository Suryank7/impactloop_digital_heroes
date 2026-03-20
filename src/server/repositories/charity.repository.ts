import prisma from "../../lib/prisma";

export class CharityRepository {
  static async getAll() {
    return prisma.charity.findMany({
      orderBy: { totalDonations: "desc" },
    });
  }

  static async create(name: string, description?: string, image?: string) {
    return prisma.charity.create({
      data: { name, description, image },
    });
  }

  static async recordDonation(
    userId: string,
    charityId: string,
    amount: number,
    percentage?: number
  ) {
    return prisma.$transaction(async (tx: any) => {
      const donation = await tx.donation.create({
        data: { userId, charityId, amount, percentage },
      });

      await tx.charity.update({
        where: { id: charityId },
        data: { totalDonations: { increment: amount } },
      });

      return donation;
    });
  }
}
