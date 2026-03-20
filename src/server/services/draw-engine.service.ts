import { DrawRepository } from "../repositories/draw.repository";
import { ScoreRepository } from "../repositories/score.repository";
import prisma from "../../lib/prisma";
import crypto from "crypto";

interface WinnerRecord {
  userId: string;
  matchCount: number;
  prizeAmount: number;
}

export class DrawEngineService {
  /**
   * Executes the monthly draw:
   * 1. Lock the draw
   * 2. Generate 5 winning numbers (1-45)
   * 3. Compare against all user scores for the month
   * 4. Calculate prizes using 40/35/25 split
   * 5. Handle jackpot rollover if no 5-match winners
   */
  static async executeDraw(
    drawId: string,
    mode: "RANDOM" | "ALGORITHM" = "RANDOM"
  ) {
    // 1. Lock the draw
    await DrawRepository.lockDrawForProcessing(drawId);

    // 2. Generate winning numbers
    let winningNumbers: number[];
    if (mode === "ALGORITHM") {
      winningNumbers = await this.generateAlgorithmicNumbers();
    } else {
      winningNumbers = this.generateRandomNumbers();
    }

    // 3. Fetch the draw to get the current pool + jackpot
    const draw = await DrawRepository.getDrawById(drawId);
    if (!draw) throw new Error("Draw not found");

    // 4. Get all users' scores for the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const allScores = await prisma.score.findMany({
      where: { date: { gte: startOfMonth, lte: endOfMonth } },
      select: { userId: true, score: true },
    });

    // 5. Group scores by user and find matches
    const userScoresMap = new Map<string, number[]>();
    for (const s of allScores) {
      if (!userScoresMap.has(s.userId)) {
        userScoresMap.set(s.userId, []);
      }
      userScoresMap.get(s.userId)!.push(s.score);
    }

    // 6. Calculate matches for each user
    const winningSet = new Set(winningNumbers);
    const match5: string[] = [];
    const match4: string[] = [];
    const match3: string[] = [];

    for (const [userId, scores] of userScoresMap.entries()) {
      const uniqueScores = [...new Set(scores)];
      const matchCount = uniqueScores.filter((s) => winningSet.has(s)).length;

      if (matchCount >= 5) match5.push(userId);
      else if (matchCount === 4) match4.push(userId);
      else if (matchCount === 3) match3.push(userId);
    }

    // 7. Prize Distribution: 40% (5-match) / 35% (4-match) / 25% (3-match)
    const totalPool = draw.jackpot + (draw.jackpot > 0 ? 0 : 10000); // Base pool or jackpot
    const pool5 = totalPool * 0.4;
    const pool4 = totalPool * 0.35;
    const pool3 = totalPool * 0.25;

    let newJackpot = 0;
    const winnerRecords: WinnerRecord[] = [];

    // 5-match winners
    if (match5.length > 0) {
      const prizeEach = pool5 / match5.length;
      match5.forEach((uid) =>
        winnerRecords.push({ userId: uid, matchCount: 5, prizeAmount: prizeEach })
      );
    } else {
      newJackpot = pool5; // Rollover
    }

    // 4-match winners
    if (match4.length > 0) {
      const prizeEach = pool4 / match4.length;
      match4.forEach((uid) =>
        winnerRecords.push({ userId: uid, matchCount: 4, prizeAmount: prizeEach })
      );
    }

    // 3-match winners
    if (match3.length > 0) {
      const prizeEach = pool3 / match3.length;
      match3.forEach((uid) =>
        winnerRecords.push({ userId: uid, matchCount: 3, prizeAmount: prizeEach })
      );
    }

    // 8. Finalize atomically
    const finalizedDraw = await DrawRepository.finalizeDraw(
      drawId,
      winningNumbers,
      newJackpot,
      winnerRecords
    );

    return {
      drawId,
      winningNumbers,
      totalWinners: winnerRecords.length,
      match5Count: match5.length,
      match4Count: match4.length,
      match3Count: match3.length,
      jackpotRolledOver: match5.length === 0,
      newJackpot,
    };
  }

  /**
   * Cryptographic random number generation (1-45, 5 unique)
   */
  private static generateRandomNumbers(): number[] {
    const numbers: Set<number> = new Set();
    while (numbers.size < 5) {
      const byte = crypto.randomBytes(1)[0];
      const num = (byte % 45) + 1;
      numbers.add(num);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  /**
   * Algorithm mode: uses frequency analysis of historical scores
   * to weight number selection (least frequent = harder to win = jackpot preservation)
   */
  private static async generateAlgorithmicNumbers(): Promise<number[]> {
    // Get frequency of all scores submitted this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const frequencies = await prisma.score.groupBy({
      by: ["score"],
      where: { date: { gte: startOfMonth } },
      _count: { score: true },
      orderBy: { _count: { score: "asc" } }, // Least frequent first
    });

    if (frequencies.length >= 5) {
      // Pick the 5 least frequent scores as winning numbers
      return frequencies.slice(0, 5).map((f) => f.score).sort((a, b) => a - b);
    }

    // Fallback to random if not enough data
    return this.generateRandomNumbers();
  }

  static async getDrawResults(limit = 5) {
    return DrawRepository.getCompletedDraws(limit);
  }
}
