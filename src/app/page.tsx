"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HOBBIES } from "@/features/hobbies/constants/hobby-list";
import HobbyGrid from "@/features/hobbies/components/hobby-grid";

type CategoryType = "all" | "sports" | "intelligence" | "art";

interface CategoryFilterItem {
  id: CategoryType;
  label: string;
}

const CATEGORIES: CategoryFilterItem[] = [
  { id: "all", label: "전체 보기" },
  { id: "sports", label: "운동형" },
  { id: "intelligence", label: "지능형" },
  { id: "art", label: "예술형" },
];

const heroVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");

  // 사용자의 북마크 목록 조회 쿼리
  const { data: bookmarkedHobbyIds = [] } = useQuery<string[]>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const response = await axios.get("/api/bookmarks");
      return response.data.hobbyIds;
    },
    enabled: !!session,
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

  // 카테고리 필터링 적용
  const filteredHobbies = HOBBIES.filter((hobby) => {
    if (activeCategory === "all") return true;
    return hobby.category === activeCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero 섹션 */}
      <motion.section
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="px-6 py-12 md:px-20 md:py-20 max-w-7xl mx-auto w-full flex flex-col space-y-4"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight md:leading-none"
        >
          나만의 특별한 취미를 찾아보세요
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-neutral-500 max-w-2xl font-light"
        >
          HobbyFind에서 당신의 성향에 맞는 새로운 일상을 가볍게 둘러보고 탐색해보세요.
        </motion.p>
      </motion.section>

      {/* 카테고리 필터 영역 */}
      <section className="sticky top-[73px] z-40 bg-white border-b border-neutral-100 w-full">
        <div className="mx-auto max-w-7xl px-6 md:px-20">
          <div className="flex items-center gap-8 py-4 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`border-b-2 pb-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "border-neutral-900 text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <HobbyGrid
              hobbies={filteredHobbies}
              bookmarkedHobbyIds={bookmarkedHobbyIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
