"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white px-6 py-4 md:px-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* 서비스 메인 로고 영역 */}
        <Link href="/" className="text-brand-500 text-xl font-bold tracking-tight cursor-pointer">
          HobbyFind
        </Link>

        {/* 중앙 카테고리 메뉴 영역 */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-500">
          <Link href="/category/sports" className="hover:text-neutral-900 transition">
            운동형
          </Link>
          <Link href="/category/intelligence" className="hover:text-neutral-900 transition">
            지능형
          </Link>
          <Link href="/category/art" className="hover:text-neutral-900 transition">
            예술형
          </Link>
        </nav>

        {/* 우측 유저 인증 세션 상태 메뉴 컨트롤 영역 */}
        <div className="flex items-center gap-4 text-sm font-semibold text-neutral-900">
          {isLoading ? (
            <div className="w-16 h-8 bg-neutral-100 rounded-full animate-pulse" />
          ) : session ? (
            <>
              <Link href="/mypage" className="hover:bg-neutral-50 px-3 py-2 rounded-full transition text-neutral-500 hover:text-neutral-900">
                마이페이지
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border border-neutral-200 px-4 py-2 rounded-full hover:bg-neutral-50 transition text-neutral-500 hover:text-neutral-900"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:bg-neutral-50 px-3 py-2 rounded-full transition text-neutral-500 hover:text-neutral-900">
                로그인
              </Link>
              <Link href="/signup" className="bg-brand-500 text-white px-4 py-2 rounded-full hover:bg-brand-600 transition">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
