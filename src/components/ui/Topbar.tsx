"use client";

import Link from "next/link";
import { MessageCircleMore, Power, Menu } from "lucide-react";
import { useSidebarStore } from "@/lib/store/sidebar";

export default function Topbar() {
  const expanded = useSidebarStore((state) => state.expanded);
  const setExpanded = useSidebarStore((state) => state.setExpanded);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white flex justify-between items-center px-6 py-4 border-b">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-[#404042]">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <MessageCircleMore className="text-[#FAAE3A]" size={18} />
          <span className="text-lg font-semibold text-[#404042]">Contact Support</span>
        </div>
      </div>
      <Link href="/" className="text-sm text-[#FAAE3A] flex items-center gap-1">
        <Power size={16} />
        Log out
      </Link>
    </div>
  );
}
