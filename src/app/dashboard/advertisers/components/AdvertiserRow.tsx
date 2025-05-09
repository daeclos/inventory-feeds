"use client";

import { Advertiser } from "@/types/advertiser";
import {
  Settings,
  Search,
  Rss,
  Video,
  Package,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  advertiser: Advertiser;
}

export function AdvertiserRow({ advertiser }: Props) {
  const router = useRouter();

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
        <div
          className={`w-4 h-4 rounded-full mx-auto ${
            advertiser.hasAds ? "bg-blue-400" : "bg-gray-300"
          }`}
        ></div>
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
            className="w-5 h-5 cursor-pointer text-gray-400"
            onClick={handleInfoClick}
          />
        </div>
      </td>

      {/* Responsive: solo mostrar estas columnas en md+ */}
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.totalRecords}</td>
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.lastUpdate}</td>
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.history}</td>
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.customFeeds}</td>
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.videoTemplates}</td>
      <td className="px-4 py-2 text-center hidden md:table-cell">{advertiser.videoAdVersions}</td>
    </tr>
  );
}
