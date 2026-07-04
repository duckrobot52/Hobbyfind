import { NextRequest, NextResponse } from "next/server";
import { createPureClient } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { username, password, email } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "아이디와 비밀번호를 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "아이디는 최소 3자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "비밀번호는 최소 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    const supabase = await createPureClient();

    // 중복 체크
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (checkError) {
      console.error("Database user check error:", checkError);
      return NextResponse.json(
        { error: "사용자 정보를 확인하는 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 사용 중인 아이디입니다." },
        { status: 409 }
      );
    }

    // 비밀번호 해싱 후 유저 삽입
    const hashedPassword = hashPassword(password);
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        username,
        password: hashedPassword,
        email: email || null,
      });

    if (insertError) {
      console.error("Database user registration error:", insertError);
      return NextResponse.json(
        { error: "회원 등록에 실패했습니다. 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Signup handler error:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
