import { NextRequest, NextResponse } from "next/server";
import { revalidatePublicPages } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  revalidatePublicPages();
  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
