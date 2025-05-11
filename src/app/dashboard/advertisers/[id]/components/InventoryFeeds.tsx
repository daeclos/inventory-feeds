import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit2, Search, Copy, FileText, Trash2 } from "lucide-react";
import { fetchAdvertisersWithFeeds } from "@/lib/supabaseFeeds";
import { useParams } from "next/navigation";
import type { FeedAd, AdvertiserGroup } from "@/app/dashboard/feeds/data/feeds";

// Colores corporativos
const CORPORATE = {
  dark: "#404042",
  yellow: "#FAAE3A",
  orange: "#F17625",
};

export function InventoryFeeds() {
  const params = useParams();
  const advertiserId = params.id as string;
  const [feeds, setFeeds] = React.useState<FeedAd[]>([]);
  const [summary, setSummary] = React.useState<{ total: number; noPrice: number; noImage: number }>({ total: 0, noPrice: 0, noImage: 0 });

  React.useEffect(() => {
    fetchAdvertisersWithFeeds().then((groups: AdvertiserGroup[]) => {
      const group = groups.find((g: AdvertiserGroup) => g.advertiser === advertiserId);
      if (group) {
        setFeeds(group.ads || []);
        setSummary({
          total: group.totalRecords || 0,
          noPrice: group.noPrice || 0,
          noImage: group.noImage || 0,
        });
      }
    });
  }, [advertiserId]);

  return (
    <div className="bg-background rounded-xl shadow-sm border border-border p-6 w-full max-w-none flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <span className="text-lg font-bold text-[#404042]">Dynamic Display Feeds</span>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2 bg-[#404042] text-white hover:bg-[#FAAE3A] hover:text-[#404042] active:bg-[#F17625] active:text-white transition-colors"
          >
            + Feed Subscription
          </Button>
          <Button
            className="flex items-center gap-2 border border-[#404042] text-[#404042] hover:bg-[#FAAE3A] hover:text-[#404042] active:bg-[#F17625] active:text-white transition-colors"
          >
            <Download size={18} />
          </Button>
        </div>
        <Button
          className="ml-auto px-4 py-2 bg-[#404042] text-white hover:bg-[#FAAE3A] hover:text-[#404042] active:bg-[#F17625] active:text-white transition-colors"
        >
          Script Installation
        </Button>
      </div>
      <div className="flex justify-center">
        <div className="rounded-md px-8 py-3 flex gap-8 items-center" style={{ background: '#FFF3D1', border: '1px solid #FAAE3A' }}>
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-[#FAAE3A]">Total Feed Records</span>
            <span className="text-lg font-bold text-[#404042]">{summary.total}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-[#FAAE3A]">No Price</span>
            <span className="text-lg font-bold text-[#404042]">{summary.noPrice}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-[#FAAE3A]">No Image</span>
            <span className="text-lg font-bold text-[#404042]">{summary.noImage}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-md border border-gray-200 mt-2">
        {feeds.map((feed) => (
          <div key={feed.id} className="flex items-center justify-between px-6 py-3 border-b last:border-b-0 border-gray-200">
            <span className="font-medium text-[#404042]">{feed.name}</span>
            <div className="flex gap-2">
              <Edit2 size={22} className="cursor-pointer transition-colors text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625]" />
              <Search size={22} className="cursor-pointer transition-colors text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625]" />
              <Copy size={22} className="cursor-pointer transition-colors text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625]" />
              <FileText size={22} className="cursor-pointer transition-colors text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625]" />
              <Trash2 size={22} className="cursor-pointer transition-colors text-[#F17625] hover:text-[#FAAE3A] active:text-[#404042]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 