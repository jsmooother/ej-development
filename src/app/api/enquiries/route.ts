import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { enquiries } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const allEnquiries = await db.select()
      .from(enquiries)
      .orderBy(desc(enquiries.createdAt));
    
    return NextResponse.json(allEnquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: "Failed to fetch enquiries" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Build context from additional fields
    const context: Record<string, string | null> = {
      projectType: body.projectType || null,
      budget: body.budget || null,
      firstName: body.firstName || null,
      lastName: body.lastName || null,
      timeline: body.timeline || null,
    };

    const newEnquiry = await db.insert(enquiries).values({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      message: body.message,
      context,
      source: body.source || 'contact',
    }).returning();
    
    return NextResponse.json({
      success: true,
      enquiry: newEnquiry[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: "Failed to create enquiry" }, 
      { status: 500 }
    );
  }
}

