import { NextRequest, NextResponse } from "next/server";
import { deleteInstagramPost } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteInstagramPost(id);
    if (!deleted) {
      return NextResponse.json({ error: "Instagram post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete Instagram post" }, { status: 500 });
  }
}

