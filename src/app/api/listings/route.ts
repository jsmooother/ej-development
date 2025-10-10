import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    const allListings = await db.select().from(listings);
    
    return NextResponse.json(allListings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: "Failed to fetch listings" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const newListing = await db.insert(listings).values({
      slug: body.slug,
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      facts: body.facts,
      location: body.location,
      status: body.status || 'for_sale',
      heroImagePath: body.heroImagePath,
      heroVideoUrl: body.heroVideoUrl,
      brochurePdfPath: body.brochurePdfPath,
      isPublished: body.isPublished ?? true,
      publishedAt: body.isPublished ? new Date() : null,
    }).returning();
    
    return NextResponse.json(newListing[0], { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: "Failed to create listing" }, 
      { status: 500 }
    );
  }
}

