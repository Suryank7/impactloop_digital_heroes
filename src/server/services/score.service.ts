import { ScoreRepository } from "../repositories/score.repository";
import { DrawRepository } from "../repositories/draw.repository";

export class ScoreService {
  /**
   * Submits a score enforcing the strict business rule:
   * - Score must be between 1 and 45 (Stableford system)
   * - Maximum 5 scores per user per month
   */
  static async submitScore(userId: string, score: number) {
    // Validate range
    if (score < 1 || score > 45) {
      throw new Error("VALIDATION: Score must be between 1 and 45");
    }

    // Get current month boundaries
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Enforce max 5 scores constraint
    const count = await ScoreRepository.countUserScoresForMonth(userId, startOfMonth, endOfMonth);
    if (count >= 5) {
      throw new Error("VALIDATION: Maximum 5 scores per month reached");
    }

    // Check for duplicate score on same date
    const existingScores = await ScoreRepository.getScoresForCurrentMonth(userId);
    const today = now.toDateString();
    const duplicate = existingScores.find((s) => new Date(s.date).toDateString() === today && s.score === score);
    if (duplicate) {
      throw new Error("VALIDATION: Duplicate score already submitted today");
    }

    const newScore = await ScoreRepository.createScore(userId, score, now);
    return {
      score: newScore,
      remainingSubmissions: 4 - count,
    };
  }

  static async getUserScores(userId: string) {
    return ScoreRepository.getUserScores(userId, 10);
  }

  static async getCurrentMonthScores(userId: string) {
    return ScoreRepository.getScoresForCurrentMonth(userId);
  }
}
