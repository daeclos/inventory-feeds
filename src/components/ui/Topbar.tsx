"use client";

import { useState } from "react";
import Link from "next/link";
import { Power, Menu, MessageCircle, Search, X as CloseIcon } from "lucide-react";
import ContactSupportModal from "@/components/ui/ContactSupportModal";
import { Input } from "@/components/ui/input";
import { useSidebarStore } from "@/lib/store/sidebar";

export default function Topbar() {
  const [showSupport, setShowSupport] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { expanded, setExpanded } = useSidebarStore();

  return (
    <>
      <div className="bg-white border-b border-[#FAAE3A]/40 shadow-sm">
        <div className="px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Botón hamburguesa o cerrar solo móvil */}
            {!expanded ? (
              <button
                className="md:hidden mr-2 bg-[#404042] p-2 rounded-full shadow-lg border border-[#FAAE3A]"
                onClick={() => setExpanded(true)}
                aria-label="Open sidebar"
              >
                <Menu size={28} className="text-[#FAAE3A]" />
              </button>
            ) : (
              <button
                className="md:hidden mr-2 bg-[#404042] p-2 rounded-full shadow-lg border border-[#FAAE3A]"
                onClick={() => setExpanded(false)}
                aria-label="Close sidebar"
              >
                <CloseIcon size={28} className="text-[#FAAE3A]" />
              </button>
            )}
            {/* Barra de búsqueda */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#404042]" size={20} />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#FAAE3A] focus:ring-[#FAAE3A]/30 text-[#404042] font-medium"
              />
            </div>

            {/* Botón Contact Support */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSupport(true)}
                className="font-bold text-[#404042] hover:text-[#FAAE3A] transition flex items-center gap-2 px-4 py-2 rounded-md border border-transparent hover:border-[#FAAE3A] bg-white hover:bg-[#FFF3D1] shadow-sm"
                title="Contact Support"
              >
                <MessageCircle size={20} className="text-[#404042] group-hover:text-[#FAAE3A]" />
                <span className="text-base font-bold">Contact Support</span>
              </button>
            </div>
          </div>

          {/* Botón Log out */}
          <Link
            href="/"
            className="text-sm font-bold text-[#404042] hover:text-[#FAAE3A] flex items-center gap-1 transition px-3 py-2 rounded-md border border-transparent hover:border-[#FAAE3A] bg-white hover:bg-[#FFF3D1] shadow-sm"
          >
            <Power size={18} />
            Log out
          </Link>
        </div>
      </div>

      <ContactSupportModal isOpen={showSupport} onClose={() => setShowSupport(false)} />
    </>
  );
}
