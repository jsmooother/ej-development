import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { enquiries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permission
    await requireAdmin();
    
    const db = getDb();
    const enquiryId = params.id;
    
    // Delete the enquiry
    const deletedEnquiry = await db.delete(enquiries)
      .where(eq(enquiries.id, enquiryId))
      .returning();
    
    if (deletedEnquiry.length === 0) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    
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
      { error: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
