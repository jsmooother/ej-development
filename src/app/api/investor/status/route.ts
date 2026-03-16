import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasPassword =
    Boolean(process.env.INVESTOR_PASSWORD) ||
    Boolean(process.env.NEXT_PUBLIC_INVESTOR_PASSWORD);
  return NextResponse.json({
    configured: hasPassword,
    hint: hasPassword
      ? "Password is set. Try logging in."
      : "Add INVESTOR_PASSWORD or NEXT_PUBLIC_INVESTOR_PASSWORD to .env or .env.local, then restart the dev server.",
  });
}
