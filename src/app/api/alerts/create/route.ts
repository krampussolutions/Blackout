import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NotificationMetadata, NotificationType } from "@/lib/notifications/types";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    userId?: string;
    actorId?: string;
    type?: NotificationType;
    postId?: string | null;
    commentId?: string | null;
    groupId?: string | null;
    messageId?: string | null;
    metadata?: NotificationMetadata | null;
  } | null;

  if (!body?.userId || !body?.type) {
    return NextResponse.json({ error: "Missing userId or type" }, { status: 400 });
  }

  if (body.actorId && body.actorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (body.userId === user.id) {
    return NextResponse.json({ ok: true, notification: null });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("notifications")
    .insert({
      user_id: body.userId,
      actor_id: user.id,
      type: body.type,
      post_id: body.postId ?? null,
      comment_id: body.commentId ?? null,
      group_id: body.groupId ?? null,
      message_id: body.messageId ?? null,
      metadata: body.metadata ?? {},
    })
    .select("id, user_id, actor_id, type, post_id, comment_id, group_id, message_id, metadata, read_at, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, notification: data });
}
