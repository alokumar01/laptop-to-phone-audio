import { NextResponse } from "next/server";
import { publicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  return NextResponse.json(
    {
      origin: requestUrl.origin || publicEnv.baseUrl,
      port: requestUrl.port || undefined,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
