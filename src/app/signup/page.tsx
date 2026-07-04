"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // 클라이언트 유효성 검사
    if (!username || !password || !passwordConfirm) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }

    if (username.length < 3) {
      setError("아이디는 최소 3자 이상이어야 합니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // 회원가입 API 호출
      await axios.post("/api/auth/signup", {
        username,
        password,
        email: email || undefined,
      });

      // 가입 성공 시 바로 로그인 시도
      const loginResult = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError("회원가입은 완료되었으나 로그인에 실패했습니다. 로그인 페이지로 이동하여 로그인해 주세요.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Signup client error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("회원가입 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-50 px-4 py-12 md:py-24">
      <div className="w-full max-w-[450px] bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm flex flex-col space-y-6">
        {/* 헤더 타이틀 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">HobbyFind 회원가입</h2>
          <p className="text-xs text-neutral-500 mt-2">간단한 정보 입력으로 새로운 취미를 탐색해 보세요.</p>
        </div>

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* 수직형 4단 층상 인풋 구조 */}
          <div className="flex flex-col -space-y-px rounded-xl overflow-hidden border border-neutral-200">
            <Input
              type="text"
              placeholder="아이디 (3자 이상)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-none border-0 px-4 py-3 h-12 focus-visible:ring-1 focus-visible:ring-brand-500 text-sm placeholder-neutral-400"
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none border-t border-b-0 border-l-0 border-r-0 border-neutral-200 px-4 py-3 h-12 focus-visible:ring-1 focus-visible:ring-brand-500 text-sm placeholder-neutral-400"
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="rounded-none border-t border-b-0 border-l-0 border-r-0 border-neutral-200 px-4 py-3 h-12 focus-visible:ring-1 focus-visible:ring-brand-500 text-sm placeholder-neutral-400"
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="이메일 (선택)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? "가입 처리 중..." : "회원가입"}
          </Button>
        </form>

        {/* 하단 링크 */}
        <div className="text-center text-xs text-neutral-500">
          <span>이미 계정이 있으신가요? </span>
          <Link href="/login" className="text-neutral-900 font-semibold underline hover:text-brand-500 transition">
            로그인하러 가기
          </Link>
        </div>
      </div>
    </div>
  );
}
