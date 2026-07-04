"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!username || !password) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("아이디 또는 비밀번호가 일치하지 않습니다.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Login client error:", err);
      setError("로그인 처리 중 서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-50 px-4 py-12 md:py-24">
      <div className="w-full max-w-[450px] bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm flex flex-col space-y-6">
        {/* 헤더 타이틀 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">HobbyFind 로그인</h2>
          <p className="text-xs text-neutral-500 mt-2">당신에게 어울리는 특별한 취미를 찾아보세요.</p>
        </div>

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* 수직형 층상 인풋 구조 */}
          <div className="flex flex-col -space-y-px rounded-xl overflow-hidden border border-neutral-200">
            <Input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-none border-0 px-4 py-3 h-12 focus-visible:ring-1 focus-visible:ring-brand-500 text-sm placeholder-neutral-400"
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none border-t border-b-0 border-l-0 border-r-0 border-neutral-200 px-4 py-3 h-12 focus-visible:ring-1 focus-visible:ring-brand-500 text-sm placeholder-neutral-400"
              disabled={isLoading}
            />
          </div>

          {/* 에러 피드백 */}
          {error && (
            <div className="mt-3 text-xs font-medium text-brand-600 text-left transition-all">
              {error}
            </div>
          )}

          {/* 제출 버튼 */}
          <Button
            type="submit"
            className="w-full mt-6 h-12 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        {/* 하단 링크 */}
        <div className="text-center text-xs text-neutral-500">
          <span>계정이 없으신가요? </span>
          <Link href="/signup" className="text-neutral-900 font-semibold underline hover:text-brand-500 transition">
            회원가입하러 가기
          </Link>
        </div>
      </div>
    </div>
  );
}
