import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const listing = await db.select()
      .from(listings)
      .where(eq(listings.id, params.id))
      .limit(1);
    
    if (listing.length === 0) {
      return NextResponse.json(
        { error: "Listing not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(listing[0]);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: "Failed to fetch listing" }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const updatedListing = await db.update(listings)
      .set({
        ...body,
        updatedAt: new Date(),
        publishedAt: body.isPublished ? new Date() : null,
      })
      .where(eq(listings.id, params.id))
      .returning();
    
    if (updatedListing.length === 0) {
      return NextResponse.json(
        { error: "Listing not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedListing[0]);
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: "Failed to update listing" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    
    const deletedListing = await db.delete(listings)
      .where(eq(listings.id, params.id))
      .returning();
    
    if (deletedListing.length === 0) {
      return NextResponse.json(
        { error: "Listing not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: "Failed to delete listing" }, 
      { status: 500 }
    );
  }
}

