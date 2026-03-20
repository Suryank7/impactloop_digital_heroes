import { NextResponse } from "next/server";
import { ScoreService } from "../../../server/services/score.service";
import { ScoreSubmissionSchema, verifyAuthFromRequest, handleApiError } from "../../../server/security/auth";
import { RateLimiter } from "../../../server/security/rate-limiter";

export async function POST(req: Request) {
  try {
    const auth = verifyAuthFromRequest(req);

    // Rate limit: max 10 score submissions per minute per user
    await RateLimiter.limitOrThrow(`scores:${auth.userId}`, { limit: 10, windowSec: 60 });

    const body = await req.json();
    const data = ScoreSubmissionSchema.parse(body);

    const result = await ScoreService.submitScore(auth.userId, data.score);

    return NextResponse.json(
      { status: "success", message: "Score submitted successfully", data: result },
      { status: 201 }
    );
  } catch (error) {
    const rateLimitResponse = RateLimiter.handleRateLimitError(error);
    if (rateLimitResponse) return rateLimitResponse;
    return handleApiError(error);
  }
}

export async function GET(req: Request) {
  try {
    const auth = verifyAuthFromRequest(req);
    const scores = await ScoreService.getUserScores(auth.userId);

    return NextResponse.json({ status: "success", data: scores });
  } catch (error) {
    return handleApiError(error);
  }
}
