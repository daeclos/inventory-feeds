import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit2, Search, Copy, FileText, Trash2 } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { AdvertiserFeedsAccordion, FeedAdvertiser } from "@/app/dashboard/feeds/components/AdvertiserFeedsAccordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Colores corporativos
const CORPORATE = {
  dark: "#404042",
  yellow: "#FAAE3A",
  orange: "#F17625",
};

async function fetchAdvertisersWithFeeds() {
  // Get feeds from localStorage
  const customFeeds = JSON.parse(localStorage.getItem('customFeeds') || '{}');
  
  // Transform the data into the expected format
  const groups = Object.entries(customFeeds).map(([advertiserId, feeds]) => {
    const feedsArray = Array.isArray(feeds) ? feeds : [];

    // Preparar contadores
    let totalRecords = 0;
    let noPrice = 0;
    let noImage = 0;

    // Si algún día agregas productos dentro de cada feed, puedes recorrerlos aquí:
    // feedsArray.forEach(feed => {
    //   if (Array.isArray(feed.items)) {
    //     totalRecords += feed.items.length;
    //     noPrice += feed.items.filter(item => !item.price).length;
    //     noImage += feed.items.filter(item => !item.image).length;
    //   }
    // });

    // Por ahora, solo contamos la cantidad de feeds
    totalRecords = feedsArray.length;
    // noPrice y noImage quedan en 0 hasta que haya productos reales

    return {
      advertiser: advertiserId,
      advertiserName: feedsArray[0]?.advertiserName || '',
      ads: feedsArray,
      totalRecords,
      noPrice,
      noImage,
      addresses: feedsArray[0]?.addresses || []
    };
  });

  return groups;
}

export function InventoryFeeds() {
  const params = useParams();
  const router = useRouter();
  const advertiserId = String(params.id);
  const [feeds, setFeeds] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState<{ total: number; noPrice: number; noImage: number }>({ total: 0, noPrice: 0, noImage: 0 });
  const [advertiser, setAdvertiser] = React.useState<FeedAdvertiser | null>(null);

  React.useEffect(() => {
    const loadFeeds = async () => {
      const groups = await fetchAdvertisersWithFeeds();
      const group = groups.find((g: any) => g.advertiser === advertiserId);
      if (group) {
        setFeeds(group.ads || []);
        setSummary({
          total: group.totalRecords || 0,
          noPrice: group.noPrice || 0,
          noImage: group.noImage || 0,
        });
        setAdvertiser({
          id: advertiserId,
          name: group.advertiserName || '',
          totalRecords: group.totalRecords || 0,
          noPrice: group.noPrice || 0,
          noImage: group.noImage || 0,
          customFeeds: (group.ads || []).length,
          hasAds: true,
          status: true,
          addresses: group.addresses || [],
        });
      } else {
        setAdvertiser({
          id: advertiserId,
          name: '',
          totalRecords: 0,
          noPrice: 0,
          noImage: 0,
          customFeeds: 0,
          hasAds: false,
          status: false,
          addresses: [],
        });
      }
    };

    loadFeeds();
  }, [advertiserId]);

  return (
    <div className="bg-background rounded-xl shadow-sm border border-border p-6 w-full max-w-none flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <span className="text-lg font-bold text-[#404042]">Dynamic Display Feeds</span>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2 bg-[#404042] text-white hover:bg-[#FAAE3A] hover:text-[#404042] active:bg-[#F17625] active:text-white transition-colors"
            onClick={() => router.push('/dashboard/feeds/subscription')}
          >
            + Feed Subscription
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 rounded hover:bg-[#FAAE3A] transition-colors"
                  style={{ border: 'none', background: 'none' }}
                  onClick={() => {
                    // Create a temporary link element
                    const link = document.createElement('a');
                    link.href = `/api/feeds/${advertiserId}/download`;
                    link.download = `feed-${advertiser?.name || 'data'}-${new Date().toISOString().split('T')[0]}.xls`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download size={28} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Feed Data (XLS)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          className="ml-auto px-4 py-2 bg-[#FAAE3A] text-[#404042] hover:bg-[#404042] hover:text-white active:bg-[#F17625] active:text-white transition-colors"
          onClick={() => router.push(`/dashboard/advertisers/${advertiserId}?tab=settings&step=2`)}
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
      {advertiser && <AdvertiserFeedsAccordion advertisers={[advertiser]} simple={true} />}
    </div>
  );
}