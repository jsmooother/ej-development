import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check admin permission
    await requireAdmin();

    const db = getDb();

    // Fetch integration settings
    const settings = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.keyName, "integrations")
    });

    if (!settings) {
      // Return default empty settings
      return NextResponse.json({
        hubspot: {
          enabled: false,
          apiKey: "",
          portalId: "",
        },
        airtable: {
          enabled: false,
          apiKey: "",
          baseId: "",
          tableId: "",
        },
        googleAnalytics: {
          enabled: false,
          measurementId: "",
          trackingId: "",
        },
      });
    }

    return NextResponse.json(settings.value);
  } catch (error) {
    console.error("Error fetching integration settings:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    await requireAdmin();

    const db = getDb();
    const body = await request.json();

    // Check if settings already exist
    const existing = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.keyName, "integrations")
    });

    if (existing) {
      // Update existing settings
      await db
        .update(siteSettings)
        .set({
          value: body,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.keyName, "integrations"));
    } else {
      // Insert new settings
      await db.insert(siteSettings).values({
        keyName: "integrations",
        value: body,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving integration settings:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

