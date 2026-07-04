"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Hobby } from "../types";

interface HobbyCardProps {
  hobby: Hobby;
  isBookmarked: boolean;
  onToggleBookmark: (hobbyId: string) => Promise<void>;
}

const CATEGORY_MAP = {
  sports: { label: "운동형", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  intelligence: { label: "지능형", color: "bg-blue-50 text-blue-700 border-blue-200" },
  art: { label: "예술형", color: "bg-purple-50 text-purple-700 border-purple-200" },
};

export default function HobbyCard({ hobby, isBookmarked, onToggleBookmark }: HobbyCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      const confirmLogin = window.confirm(
        "로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?"
      );
      if (confirmLogin) {
        router.push("/login");
      }
      return;
    }

    if (isToggling) return;

    try {
      setIsToggling(true);
      await onToggleBookmark(hobby.id);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const categoryInfo = CATEGORY_MAP[hobby.category] || { label: hobby.category, color: "bg-neutral-100 text-neutral-800" };

  return (
    <div className="group relative flex flex-col w-full bg-white rounded-2xl overflow-hidden border border-neutral-200 transition-all duration-300 hover:shadow-md">
      {/* 이미지 영역 */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 rounded-t-2xl">
        <img
          src={hobby.image_url}
          alt={hobby.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* 북마크 하트 버튼 */}
        <button
          onClick={handleBookmarkClick}
          disabled={isToggling}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-xs transition-colors duration-200"
          aria-label="북마크 토글"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isBookmarked
                ? "fill-brand-500 text-brand-500 scale-110"
                : "text-white fill-transparent hover:scale-110"
            }`}
          />
        </button>
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-col p-4 space-y-2">
        <div className="flex items-center">
          <Badge variant="outline" className={`${categoryInfo.color} font-medium text-xs px-2 py-0.5 rounded-md`}>
            {categoryInfo.label}
          </Badge>
        </div>
        <h3 className="text-base font-semibold text-neutral-900 line-clamp-1">
          {hobby.name}
        </h3>
      </div>
    </div>
  );
}
