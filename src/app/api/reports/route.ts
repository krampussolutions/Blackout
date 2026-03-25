import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please log in to report a post." }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { postId?: string; reason?: string | null } | null;
  const postId = body?.postId?.trim();
  const reason = body?.reason?.trim() || null;

  if (!postId) {
    return NextResponse.json({ error: "Missing post id." }, { status: 400 });
  }

  const { error } = await supabase.from("post_reports").insert({
    post_id: postId,
    reporter_id: user.id,
    reason,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
