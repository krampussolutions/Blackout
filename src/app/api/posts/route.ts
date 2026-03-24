import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Replace this stub with a real Supabase-backed posts endpoint."
  });
}
