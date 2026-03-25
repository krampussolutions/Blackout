import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: actorProfile } = await supabase
    .from("profiles")
    .select("id, membership_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (actorProfile?.membership_tier !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (id === user.id) {
    return NextResponse.json({ error: "You cannot remove your own account here." }, { status: 400 });
  }

  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.auth.admin.deleteUser(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to remove user." }, { status: 500 });
  }
}
