"use client";

import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AgencyFeedsPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen bg-[#f7f7f9] font-geist">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onAlertClick={() => {}} />
        <main className="max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-[#404042]">Agency Feeds</h1>
            <Button variant="default" onClick={() => router.push("/dashboard/feeds/agency-feeds/new")}>+ Agency Feeds</Button>
          </div>
          <div className="bg-[#FFF6D8] text-[#404042] rounded-lg p-6 text-lg font-medium shadow">
            Esta es la página de Agency Feeds.
          </div>
        </main>
      </div>
    </div>
  );
} 