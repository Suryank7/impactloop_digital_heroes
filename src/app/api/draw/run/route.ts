import { NextResponse } from "next/server";
import { DrawEngineService } from "../../../../server/services/draw-engine.service";
import { DrawRunSchema, verifyAuthFromRequest, requireAdmin, handleApiError } from "../../../../server/security/auth";

// POST /api/draw/run — Admin only: Execute the monthly draw
export async function POST(req: Request) {
  try {
    const auth = verifyAuthFromRequest(req);
    requireAdmin(auth);

    const body = await req.json();
    const data = DrawRunSchema.parse(body);

    const result = await DrawEngineService.executeDraw(
      body.drawId,
      data.mode as "RANDOM" | "ALGORITHM"
    );

    return NextResponse.json(
      { status: "success", message: "Draw executed successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
