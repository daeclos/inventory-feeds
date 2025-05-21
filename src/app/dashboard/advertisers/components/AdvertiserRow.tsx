"use client";

import { Advertiser } from "@/types/advertiser";
import {
  Settings,
  Search,
  Rss,
  Video,
  Package,
  Info,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AlertsReportModal } from "./AlertsReportModal";
import React from "react";

interface Props {
  advertiser: Advertiser;
}

export function AdvertiserRow({ advertiser }: Props) {
  const router = useRouter();
  const [openAlerts, setOpenAlerts] = React.useState(false);

  // Función para calcular los días de historia
  const calculateHistoryDays = (createdAt: string) => {
    const startDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  // Mock de alertas para este anunciante
  const alerts = [
    {
      advertiser: advertiser.name,
      reported: "04/29/2025 07:04 AM",
      updated: "04/29/2025 07:04 AM",
      subject: "No eligible campaigns in Google Ads for Hoot Monitor!",
    },
  ];

  const goToTab = (tab: string) => {
    router.push(`/dashboard/advertisers/${advertiser.id}?tab=${tab}`);
  };

  const handleInfoClick = () => {
    router.push(`/dashboard/advertisers/${advertiser.id}/info`);
  };

  return (
    <tr className="border-b text-sm text-[#404042] hover:bg-gray-100">
      {/* Status LED */}
      <td className="px-4 py-2 text-center">
        {advertiser.hasAds ? (
          <span className="px-3 py-1 rounded-lg font-semibold text-sm bg-green-100 text-green-600">Active</span>
        ) : (
          <span className="px-3 py-1 rounded-lg font-semibold text-sm bg-red-100 text-red-600">Inactive</span>
        )}
      </td>

      {/* Name */}
      <td className="px-4 py-2 font-medium whitespace-nowrap">{advertiser.name}</td>

      {/* Actions */}
      <td className="px-4 py-2">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 text-[#404042] overflow-x-auto md:overflow-visible">
          <Settings
            className="w-5 h-5 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={() => goToTab("settings")}
          />
          <Search
            className="w-5 h-5 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={() => goToTab("google-ads-status")}
          />
          <Rss
            className="w-5 h-5 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={() => goToTab("inventory-feeds")}
          />
          <Package
            className="w-5 h-5 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={() => goToTab("search-templates")}
          />
          <Video
            className="w-5 h-5 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={() => goToTab("video-ads")}
          />
          <Info
            className="w-5 h-5 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={() => setOpenAlerts(true)}
          />
        </div>
      </td>

      {/* Responsive: solo mostrar estas columnas en md+ */}
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.totalRecords}</td>
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.lastUpdate}</td>
      <td className="px-4 py-2 text-center hidden md:table-cell">{calculateHistoryDays(advertiser.createdAt)}</td>
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.customFeeds}</td>
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.videoTemplates}</td>
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.videoAdVersions}</td>

      <AlertsReportModal
        open={openAlerts}
        onOpenChange={setOpenAlerts}
        advertiser={advertiser.name}
        alerts={alerts}
      />
    </tr>
  );
}
