"use client";

import { Hobby } from "../types";
import HobbyCard from "./hobby-card";

interface HobbyGridProps {
  hobbies: Hobby[];
  bookmarkedHobbyIds: string[];
  onToggleBookmark: (hobbyId: string) => Promise<void>;
}

export default function HobbyGrid({ hobbies, bookmarkedHobbyIds, onToggleBookmark }: HobbyGridProps) {
  if (hobbies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
        <p className="text-neutral-500 font-medium">표시할 취미가 없습니다.</p>
        <p className="text-sm text-neutral-400">다른 카테고리를 선택해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 px-6 py-8 md:px-20 mx-auto max-w-7xl w-full">
      {hobbies.map((hobby) => (
        <HobbyCard
          key={hobby.id}
          hobby={hobby}
          isBookmarked={bookmarkedHobbyIds.includes(hobby.id)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}
