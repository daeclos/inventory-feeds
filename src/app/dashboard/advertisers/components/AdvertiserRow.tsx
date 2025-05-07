"use client";

import { Advertiser } from "@/types/advertiser";
import {
  Settings,
  Search,
  Rss,
  FileText,
  Info,
  Package,
  Copy,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";

interface Props {
  advertiser: Advertiser;
}

export function AdvertiserRow({ advertiser }: Props) {
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
          <Settings className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A]" />
          <Search className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A]" />
          <Rss className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A]" />
          <Package className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A]" />
          <Copy className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A]" />
          <FileDown className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A]" />
          <FileSpreadsheet className="w-4 h-4 cursor-pointer hover:text-[#FAAE3A]" />
          <Info className="w-4 h-4 cursor-pointer text-gray-400" />
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
