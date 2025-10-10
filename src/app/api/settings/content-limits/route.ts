import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ContentLimits, isContentLimits } from "@/lib/types/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    
    // Fetch content limits
    const settings = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.keyName, "content_limits")
    });

    const defaultLimits: ContentLimits = {
      frontpage: {
        projects: 3,
        editorials: 10,
        instagram: 3
      }
    };

    if (!settings) {
      return NextResponse.json(defaultLimits);
    }

    return NextResponse.json(settings.value);
  } catch (error) {
    console.error("Error fetching content limits:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();

    // Validate input using type guard
    if (!isContentLimits(body)) {
      return NextResponse.json(
        { error: "Invalid content limits format" },
        { status: 400 }
      );
    }

    // Update content limits
    await db
      .insert(siteSettings)
      .values({
        keyName: "content_limits",
        value: { frontpage },
      })
      .onConflictDoUpdate({
        target: siteSettings.keyName,
        set: {
          value: { frontpage },
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ frontpage });
  } catch (error) {
    console.error("Error updating content limits:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
