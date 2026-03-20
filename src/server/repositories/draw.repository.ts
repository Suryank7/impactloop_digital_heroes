import prisma from "../../lib/prisma";
import { CacheService } from "../services/cache.service";

export class DrawRepository {
  /**
   * Cached with 60s TTL to shield DB during high traffic Draw Day
   */
  static async getOpenDraw() {
    return CacheService.getOrSet("draw:open", 60, async () => {
      return prisma.draw.findFirst({
        where: { status: "PENDING" },
      });
    });
  }

  static async getDrawById(id: string) {
    return prisma.draw.findUnique({ where: { id } });
  }

  static async lockDrawForProcessing(drawId: string) {
    await CacheService.invalidate("draw:open");
    return prisma.draw.update({
      where: { id: drawId },
      data: { status: "PROCESSING" },
    });
  }

  /**
   * Atomic finalization: updates draw, creates winner records, handles jackpot rollover
   */
  static async finalizeDraw(
    drawId: string,
    winningNumbers: number[],
    newJackpot: number,
    winnerRecords: {
      userId: string;
      matchCount: number;
      prizeAmount: number;
    }[]
  ) {
    return prisma.$transaction(async (tx: any) => {
      // 1. Mark draw as COMPLETED
      const draw = await tx.draw.update({
        where: { id: drawId },
        data: {
          status: "COMPLETED",
          numbers: winningNumbers,
          jackpot: newJackpot,
          drawDate: new Date(),
        },
      });

      // 2. Bulk insert the winner records
      if (winnerRecords.length > 0) {
        await tx.winner.createMany({
          data: winnerRecords.map((w) => ({
            userId: w.userId,
            drawId,
            matchCount: w.matchCount,
            prizeAmount: w.prizeAmount,
          })),
        });
      }

      await CacheService.invalidate("draw:open");
      return draw;
    });
  }

  static async getCompletedDraws(limit = 10) {
    return prisma.draw.findMany({
      where: { status: "COMPLETED" },
      orderBy: { drawDate: "desc" },
      take: limit,
      include: {
        winners: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });
  }
}
