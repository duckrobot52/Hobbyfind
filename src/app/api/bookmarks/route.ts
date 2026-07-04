import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookmarks")
    .select("hobby_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch bookmarks:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const hobbyIds = data.map((item: { hobby_id: string }) => item.hobby_id);
  return NextResponse.json({ hobbyIds });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { hobbyId } = await request.json();

  if (!hobbyId) {
    return NextResponse.json({ error: "Hobby ID is required" }, { status: 400 });
  }

  const supabase = await createClient();

  // 기존 북마크가 있는지 조회
  const { data: existing, error: selectError } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("hobby_id", hobbyId)
    .maybeSingle();

  if (selectError) {
    console.error("Failed to check bookmark existence:", selectError);
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  if (existing) {
    // 이미 있다면 북마크 해제
    const { error: deleteError } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("hobby_id", hobbyId);

    if (deleteError) {
      console.error("Failed to delete bookmark:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ bookmarked: false });
  } else {
    // 없다면 북마크 등록
    const { error: insertError } = await supabase
      .from("bookmarks")
      .insert({ user_id: userId, hobby_id: hobbyId });

    if (insertError) {
      console.error("Failed to insert bookmark:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ bookmarked: true });
  }
}
