import prisma from "../../lib/prisma";

export class ScoreRepository {
  static async countUserScoresForMonth(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    return prisma.score.count({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
    });
  }

  static async createScore(
    userId: string,
    score: number,
    date: Date
  ) {
    return prisma.score.create({
      data: { userId, score, date },
    });
  }

  static async getUserScores(userId: string, limit = 10) {
    return prisma.score.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
  }

  static async getScoresForCurrentMonth(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    return prisma.score.findMany({
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      orderBy: { date: "desc" },
    });
  }
}
