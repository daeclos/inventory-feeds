"use client";

import { Advertiser } from "@/types/advertiser";
import {
  Settings,
  Search,
  Rss,
  FileText,
  AlertTriangle,
  Package,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  advertiser: Advertiser;
}

export function AdvertiserRow({ advertiser }: Props) {
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push(`/dashboard/advertisers/${advertiser.id}`);
  };

  const handleSearchClick = () => {
    router.push(`/dashboard/advertisers/${advertiser.id}/details`);
  };

  const handleFeedsClick = () => {
    router.push(`/dashboard/feeds?advertiserId=${advertiser.id}`);
  };

  const handlePackageClick = () => {
    router.push(`/dashboard/packages?advertiserId=${advertiser.id}`);
  };

  const handleAlertClick = () => {
    router.push(`/dashboard/alerts?advertiserId=${advertiser.id}`);
  };

  const handleVideoDocClick = () => {
    alert("Funcionalidad de documentos de video aún no implementada.");
  };

  const handleInfoClick = () => {
    router.push(`/dashboard/advertisers/${advertiser.id}/info`);
  };

  return (
    <tr className="border-b text-sm text-[#404042] hover:bg-gray-50">
      {/* Status LED */}
      <td className="px-4 py-2">
        <div
          className={`w-4 h-4 rounded-full mx-auto ${
            advertiser.hasAds ? "bg-[#FAAE3A]" : "bg-gray-300"
          }`}
        ></div>
      </td>

      {/* Name */}
      <td className="px-4 py-2 font-medium whitespace-nowrap">{advertiser.name}</td>

      {/* Actions */}
      <td className="px-4 py-2">
        <div className="flex items-center gap-2 text-[#404042]">
          <Settings
            className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={handleSettingsClick}
          />
          <Search
            className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={handleSearchClick}
          />
          <Rss
            className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={handleFeedsClick}
          />
          <Package
            className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={handlePackageClick}
          />
          <AlertTriangle
            className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={handleAlertClick}
          />
          <FileText
            className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A] active:text-[#F17625]"
            onClick={handleVideoDocClick}
          />
          <Info
            className="w-4 h-4 cursor-pointer text-gray-400"
            onClick={handleInfoClick}
          />
        </div>
      </td>

      <td className="px-4 py-2 text-center">{advertiser.totalRecords}</td>
      <td className="px-4 py-2 text-center">{advertiser.lastUpdate}</td>
      <td className="px-4 py-2 text-center">{advertiser.history}</td>
      <td className="px-4 py-2 text-center">{advertiser.customFeeds}</td>
      <td className="px-4 py-2 text-center">{advertiser.videoTemplates}</td>
      <td className="px-4 py-2 text-center">{advertiser.videoAdVersions}</td>
    </tr>
  );
}
