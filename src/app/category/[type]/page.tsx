"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HOBBIES } from "@/features/hobbies/constants/hobby-list";
import HobbyGrid from "@/features/hobbies/components/hobby-grid";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ type: string }>;
}

const CATEGORY_META = {
  sports: {
    title: "운동형",
    description: "건강한 신체와 활력을 불어넣는 취미 활동입니다.",
  },
  intelligence: {
    title: "지능형",
    description: "지적 자극과 창의적 사고를 기를 수 있는 취미 활동입니다.",
  },
  art: {
    title: "예술형",
    description: "감성을 표현하고 창작의 즐거움을 느끼는 취미 활동입니다.",
  },
};

type CategoryKey = keyof typeof CATEGORY_META;

export default function CategoryPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const type = resolvedParams.type as CategoryKey;
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const categoryMeta = CATEGORY_META[type];

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

  if (!categoryMeta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <h1 className="text-2xl font-bold text-neutral-900">존재하지 않는 카테고리입니다.</h1>
        <p className="text-neutral-500">올바른 카테고리 경로로 접근해 주세요.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 font-semibold transition">
          <ArrowLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // 해당 카테고리에 속한 고정 취미만 필터링
  const categoryHobbies = HOBBIES.filter((hobby) => hobby.category === type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-white animate-fade-in"
    >
      {/* 카테고리 헤더 섹션 */}
      <section className="px-6 py-12 md:px-20 md:py-16 max-w-7xl mx-auto w-full flex flex-col space-y-4 border-b border-neutral-100">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 text-sm font-semibold transition mb-2">
          <ArrowLeft className="w-4 h-4" />
          전체 취미 보기
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-none">
          {categoryMeta.title}
        </h1>
        <p className="text-lg md:text-xl text-neutral-500 max-w-2xl font-light">
          {categoryMeta.description}
        </p>
      </section>

      {/* 필터 콘텐츠 영역 */}
      <main className="flex-1 bg-white">
        <HobbyGrid
          hobbies={categoryHobbies}
          bookmarkedHobbyIds={bookmarkedHobbyIds}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>
    </motion.div>
  );
}
