import { NextRequest, NextResponse } from "next/server";
import { getInstagramPosts, createInstagramPost } from "@/lib/db";

export async function GET() {
  try {
    const posts = await getInstagramPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Instagram posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPost = await createInstagramPost(body);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create Instagram post" }, { status: 500 });
  }
}

