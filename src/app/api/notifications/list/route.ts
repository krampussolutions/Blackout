import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ notifications: [] }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("notifications")
    .select(
      "id, user_id, actor_id, type, post_id, comment_id, group_id, message_id, metadata, read_at, created_at, profiles!notifications_actor_id_fkey(username, display_name)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message, notifications: [] }, { status: 500 });
  }

  return NextResponse.json({ notifications: data || [] });
}
