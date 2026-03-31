import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { endpoint?: string } | null;

  if (!body?.endpoint) {
    return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: subscription, error } = await admin
    .from("push_subscriptions")
    .select("user_id")
    .eq("endpoint", body.endpoint)
    .maybeSingle<{ user_id: string }>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    enabled: subscription?.user_id === user.id,
    assignedToCurrentUser: subscription?.user_id === user.id,
    assignedElsewhere: Boolean(subscription?.user_id && subscription.user_id !== user.id),
  });
}
