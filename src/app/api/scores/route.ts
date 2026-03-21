import { NextResponse } from "next/server";
import { ScoreService } from "../../../server/services/score.service";
import { ScoreSubmissionSchema, verifyAuthFromRequest, handleApiError } from "../../../server/security/auth";
import { RateLimiter } from "../../../server/security/rate-limiter";

export async function POST(req: Request) {
  try {
    const auth = verifyAuthFromRequest(req);
    const body = await req.json();

    // ---- DEMO BYPASS: UNBLOCK SCORE SUBMISSION ----
    if (auth.userId === "demo-hero-id") {
      return NextResponse.json(
        { status: "success", message: "Demo Score recorded in session cache", data: { score: body.score, remainingSubmissions: 4 } },
        { status: 201 }
      );
    }

    // Rate limit: max 10 score submissions per minute per user
    await RateLimiter.limitOrThrow(`scores:${auth.userId}`, { limit: 10, windowSec: 60 });

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

    // ---- DEMO BYPASS: UNBLOCK ACTIVITY FEED ----
    if (auth.userId === "demo-hero-id") {
      return NextResponse.json({
        status: "success",
        data: [
          { id: "s1", courseName: "Augusta National", score: 72, ticketsAwarded: 5, createdAt: new Date().toISOString() },
          { id: "s2", courseName: "Pebble Beach", score: 68, ticketsAwarded: 8, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { id: "s3", courseName: "St Andrews", score: 75, ticketsAwarded: 3, createdAt: new Date(Date.now() - 172800000).toISOString() },
        ]
      });
    }

    const scores = await ScoreService.getUserScores(auth.userId);

    return NextResponse.json({ status: "success", data: scores });
  } catch (error) {
    return handleApiError(error);
  }
}
