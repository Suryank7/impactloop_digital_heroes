import { NextResponse } from "next/server";
import { DrawEngineService } from "../../../../server/services/draw-engine.service";
import { handleApiError } from "../../../../server/security/auth";

// GET /api/draw/results — Public: View past draw results
export async function GET() {
  try {
    const results = await DrawEngineService.getDrawResults(10);
    return NextResponse.json({ status: "success", data: results });
  } catch (error) {
    return handleApiError(error);
  }
}
