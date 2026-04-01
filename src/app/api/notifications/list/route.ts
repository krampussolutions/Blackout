import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActorProfile = { id: string; username: string | null; display_name: string | null };

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("id, user_id, actor_id, type, post_id, comment_id, group_id, message_id, metadata, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const actorIds = Array.from(new Set((data || []).map((item) => item.actor_id).filter(Boolean))) as string[];
  let actorMap = new Map<string, ActorProfile>();

  if (actorIds.length) {
    const { data: actors } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .in("id", actorIds);

    actorMap = new Map((actors || []).map((actor) => [actor.id, actor as ActorProfile]));
  }

  const notifications = (data || []).map((item) => ({
    ...item,
    actor: item.actor_id ? actorMap.get(item.actor_id) || null : null,
  }));

  return NextResponse.json({ notifications });
}
