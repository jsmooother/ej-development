import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    
    // Fetch content limits
    const settings = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.key, "content_limits")
    });

    if (!settings) {
      return NextResponse.json({
        frontpage: {
          projects: 3,
          editorials: 10,
          instagram: 3
        }
      });
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

    // Validate input
    const { frontpage } = body;
    if (!frontpage || typeof frontpage !== "object") {
      return NextResponse.json(
        { error: "Invalid content limits format" },
        { status: 400 }
      );
    }

    // Ensure all required fields are numbers
    const requiredFields = ["projects", "editorials", "instagram"];
    for (const field of requiredFields) {
      if (typeof frontpage[field] !== "number" || frontpage[field] < 0) {
        return NextResponse.json(
          { error: `Invalid ${field} value` },
          { status: 400 }
        );
      }
    }

    // Update content limits
    await db
      .insert(siteSettings)
      .values({
        key: "content_limits",
        value: { frontpage },
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
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
