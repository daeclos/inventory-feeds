"use client";

import { useState } from "react";
import Link from "next/link";
import { Power, Menu, MessageCircle } from "lucide-react";
import { useSidebarStore } from "@/lib/store/sidebar";
import ContactSupportModal from "@/components/ui/ContactSupportModal";

export default function Topbar() {
  const expanded = useSidebarStore((state) => state.expanded);
  const setExpanded = useSidebarStore((state) => state.setExpanded);
  const [showSupport, setShowSupport] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div className="bg-white flex justify-between items-center px-6 py-4 border-b z-40">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="text-[#404042]">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSupport(true)}
              className="text-[#404042] hover:text-[#FAAE3A] transition flex items-center gap-2"
              title="Contact Support"
            >
              <MessageCircle size={20} />
              <span className="text-lg font-semibold text-[#404042]">Contact Support</span>
            </button>
          </div>
        </div>

        <Link href="/" className="text-sm text-[#FAAE3A] flex items-center gap-1">
          <Power size={16} />
          Log out
        </Link>
      </div>

      <ContactSupportModal isOpen={showSupport} onClose={() => setShowSupport(false)} />
    </>
  );
}


