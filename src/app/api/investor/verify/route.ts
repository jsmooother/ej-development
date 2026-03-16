import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    const expected =
      process.env.INVESTOR_PASSWORD ??
      process.env.NEXT_PUBLIC_INVESTOR_PASSWORD ??
      "";
    if (!expected) {
      return NextResponse.json(
        { error: "Investor portal is not configured." },
        { status: 503 }
      );
    }

    if (password === expected) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Incorrect access code." }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
