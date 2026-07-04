"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-50 px-6 py-6 md:px-20 mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div>
          <span>© 2026 HobbyFind. All rights reserved.</span>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:underline hover:text-neutral-900 transition">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:underline hover:text-neutral-900 transition">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}
