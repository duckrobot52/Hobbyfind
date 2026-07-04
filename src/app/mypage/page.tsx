"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Compass, 
  BookOpen, 
  User, 
  Mail, 
  Calendar, 
  BarChart3, 
  Bookmark, 
  Brain, 
  Palette, 
  Dumbbell,
  Lightbulb
} from "lucide-react";
import { HOBBIES } from "@/features/hobbies/constants/hobby-list";
import HobbyGrid from "@/features/hobbies/components/hobby-grid";

export const dynamic = "force-dynamic";

type TabType = "bookmarks" | "stats";

export default function MyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("bookmarks");

  // 비로그인 사용자 리다이렉트
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 사용자의 북마크 목록 조회 쿼리
  const { data: bookmarkedHobbyIds = [], isLoading: isQueryLoading } = useQuery<string[]>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const response = await axios.get("/api/bookmarks");
      return response.data.hobbyIds;
    },
    enabled: status === "authenticated",
    initialData: [],
  });

  // 북마크 토글 뮤테이션
  const toggleBookmarkMutation = useMutation({
    mutationFn: async (hobbyId: string) => {
      await axios.post("/api/bookmarks", { hobbyId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const handleToggleBookmark = async (hobbyId: string) => {
    await toggleBookmarkMutation.mutateAsync(hobbyId);
  };

  if (status === "loading" || isQueryLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">마이페이지 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // 리다이렉션 중 화면 깜빡임 방지
  }

  // 사용자 프로필 정보 바인딩
  const username = session?.user?.name || "임효정";
  const userEmail = session?.user?.email || "이메일 정보 없음";
  const avatarChar = username.charAt(0);

  // 북마크된 취미 필터링
  const bookmarkedHobbies = HOBBIES.filter((hobby) =>
    bookmarkedHobbyIds.includes(hobby.id)
  );

  const totalCount = bookmarkedHobbies.length;

  // 카테고리별 통계 계산
  const sportsCount = bookmarkedHobbies.filter((h) => h.category === "sports").length;
  const intelligenceCount = bookmarkedHobbies.filter((h) => h.category === "intelligence").length;
  const artCount = bookmarkedHobbies.filter((h) => h.category === "art").length;

  const sportsPercent = totalCount > 0 ? Math.round((sportsCount / totalCount) * 100) : 0;
  const intelligencePercent = totalCount > 0 ? Math.round((intelligenceCount / totalCount) * 100) : 0;
  const artPercent = totalCount > 0 ? Math.round((artCount / totalCount) * 100) : 0;

  // 활성 카테고리 개수 계산
  let activeCategoriesCount = 0;
  if (sportsCount > 0) activeCategoriesCount++;
  if (intelligenceCount > 0) activeCategoriesCount++;
  if (artCount > 0) activeCategoriesCount++;

  // 가장 인기 있는 카테고리 도출
  let mostPopularCategory = "없음";
  let maxCount = 0;
  let maxPercent = 0;
  let popularIcon = <Brain className="w-8 h-8 text-neutral-400" />;

  const categories = [
    { name: "지능형", count: intelligenceCount, percent: intelligencePercent, icon: <Brain className="w-5 h-5 text-blue-500" />, barColor: "bg-brand-500" },
    { name: "예술형", count: artCount, percent: artPercent, icon: <Palette className="w-5 h-5 text-purple-500" />, barColor: "bg-brand-500" },
    { name: "운동형", count: sportsCount, percent: sportsPercent, icon: <Dumbbell className="w-5 h-5 text-emerald-500" />, barColor: "bg-brand-500" },
  ];

  // 비율에 따른 내림차순 정렬
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);

  if (totalCount > 0) {
    const top = sortedCategories[0];
    if (top.count > 0) {
      mostPopularCategory = top.name;
      maxCount = top.count;
      maxPercent = top.percent;
      if (top.name === "지능형") {
        popularIcon = <Brain className="w-10 h-10 text-blue-500" />;
      } else if (top.name === "예술형") {
        popularIcon = <Palette className="w-10 h-10 text-purple-500" />;
      } else if (top.name === "운동형") {
        popularIcon = <Dumbbell className="w-10 h-10 text-emerald-500" />;
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/50">
      <div className="mx-auto max-w-7xl w-full px-6 py-10 md:px-20 flex flex-col space-y-8 text-left">
        {/* 마이페이지 헤더 */}
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">마이페이지</h1>
          <p className="text-sm text-neutral-500 mt-2">{username}님의 취미 북마크를 관리하세요</p>
        </div>

        {/* 프로필 정보 카드 */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-5 w-full sm:w-auto">
            {/* 아바타 */}
            <div className="bg-brand-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
              {avatarChar}
            </div>
            {/* 세부 정보 */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                <User className="w-4 h-4 text-neutral-400" />
                <span>{username}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-500 text-xs">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span>{userEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-500 text-xs">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>가입일: 정보 없음</span>
              </div>
            </div>
          </div>

          {/* 우측 북마크 카운터 */}
          <div className="flex flex-col items-center sm:items-end shrink-0">
            <span className="text-4xl font-extrabold text-brand-500">{totalCount}</span>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">북마크</span>
          </div>
        </div>

        {/* 탭 내비게이션 */}
        <div className="w-full max-w-md bg-neutral-200/50 p-1 rounded-2xl grid grid-cols-2">
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all duration-200 ${
              activeTab === "bookmarks"
                ? "bg-white shadow-xs text-neutral-900 font-bold"
                : "text-neutral-500 hover:text-neutral-950 font-semibold"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>북마크 ({totalCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all duration-200 ${
              activeTab === "stats"
                ? "bg-white shadow-xs text-neutral-900 font-bold"
                : "text-neutral-500 hover:text-neutral-950 font-semibold"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>통계</span>
          </button>
        </div>

        {/* 하단 콘텐트 전환 뷰 */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === "bookmarks" ? (
              <motion.div
                key="bookmarks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {totalCount === 0 ? (
                  <div className="bg-white border border-neutral-200 rounded-2xl flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="p-4 rounded-full bg-neutral-100 text-neutral-400">
                      <BookOpen className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-neutral-900 font-semibold text-base">
                        아직 북마크한 취미가 없습니다.
                      </p>
                      <p className="text-neutral-400 text-sm font-light">
                        마음에 드는 취미를 보관함에 담아 나만의 취미 리포트를 채워보세요!
                      </p>
                    </div>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-xs transition-colors duration-200"
                    >
                      <Compass className="w-4 h-4" />
                      취미 탐색하러 가기
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white border border-neutral-200 rounded-2xl p-4 md:p-6">
                    <h2 className="text-lg font-bold text-neutral-900 px-6 pt-4 mb-2">내가 보관한 취미 목록</h2>
                    <HobbyGrid
                      hobbies={bookmarkedHobbies}
                      bookmarkedHobbyIds={bookmarkedHobbyIds}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col space-y-8 w-full"
              >
                {/* 전체 통계 카드 */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 flex flex-col space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-brand-500">
                      <BarChart3 className="w-5 h-5" />
                      <h2 className="text-lg font-bold text-neutral-900">전체 통계</h2>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">카테고리별 북마크 분포를 확인하세요</p>
                  </div>

                  {/* 3단 요약 배너 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-neutral-50 rounded-2xl py-5 px-4 flex flex-col items-center justify-center space-y-1">
                      <span className="text-xl md:text-2xl font-bold text-brand-500">{totalCount}</span>
                      <span className="text-[10px] md:text-xs text-neutral-500 font-medium">총 북마크</span>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl py-5 px-4 flex flex-col items-center justify-center space-y-1">
                      <span className="text-xl md:text-2xl font-bold text-neutral-900">{activeCategoriesCount}</span>
                      <span className="text-[10px] md:text-xs text-neutral-500 font-medium">활성 카테고리</span>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl py-5 px-4 flex flex-col items-center justify-center space-y-1">
                      <span className="text-sm md:text-base font-bold text-amber-500 truncate max-w-full">
                        {mostPopularCategory}
                      </span>
                      <span className="text-[10px] md:text-xs text-neutral-500 font-medium">가장 인기</span>
                    </div>
                  </div>

                  {/* 카테고리별 진행 바 (듀얼 배색 프로그레스 바) */}
                  <div className="flex flex-col space-y-6 pt-4">
                    {sortedCategories.map((cat) => {
                      return (
                        <div key={cat.name} className="flex flex-col space-y-2">
                          {/* 정보 레이블 */}
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <div className="flex items-center gap-2 font-semibold text-neutral-800">
                              {cat.icon}
                              <span>{cat.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-500 font-medium">{cat.count}개</span>
                              <span className="text-brand-500 font-bold">{cat.percent}%</span>
                            </div>
                          </div>
                          {/* 프로그레스 바 (붉은색 활성 + 청록색 배경) */}
                          <div className="w-full h-3 rounded-full overflow-hidden bg-[#006A70] relative">
                            {cat.percent > 0 && (
                              <div
                                style={{ width: `${cat.percent}%` }}
                                className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 인사이트 카드 */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 flex flex-col space-y-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Lightbulb className="w-5 h-5" />
                    <h2 className="text-base font-bold text-neutral-900">인사이트</h2>
                  </div>

                  <div className="flex items-center gap-5 pt-2">
                    <div className="p-2 bg-neutral-50 rounded-2xl shrink-0">
                      {popularIcon}
                    </div>
                    {totalCount > 0 ? (
                      <div className="flex flex-col space-y-1">
                        <h3 className="font-bold text-neutral-900 text-sm md:text-base">
                          {mostPopularCategory} 취미를 가장 좋아하시는군요!
                        </h3>
                        <p className="text-xs text-neutral-500 font-light">
                          총 {totalCount}개 중 {maxCount}개({maxPercent}%)가 {mostPopularCategory} 카테고리입니다.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-1">
                        <h3 className="font-bold text-neutral-900 text-sm md:text-base">
                          분석을 시작해 보세요!
                        </h3>
                        <p className="text-xs text-neutral-500 font-light">
                          마음에 드는 취미를 보관함에 담으면 이곳에 맞춤 취미 리포트가 생성됩니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
