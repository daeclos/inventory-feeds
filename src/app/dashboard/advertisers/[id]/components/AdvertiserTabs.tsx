import { Settings, BarChart2, FileText, Rss, Video } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

const TABS = [
  {
    value: "settings",
    label: "Settings",
    icon: <Settings size={20} />,
    path: (id: string) => `/dashboard/advertisers/${id}`,
  },
  {
    value: "google-ads-status",
    label: "Google Ads Status",
    icon: <BarChart2 size={20} />,
    path: (id: string) => `/dashboard/advertisers/${id}?tab=google-ads-status`,
  },
  {
    value: "search-templates",
    label: "Search Templates",
    icon: <FileText size={20} />,
    path: (id: string) => `/dashboard/advertisers/${id}?tab=search-templates`,
  },
  {
    value: "inventory-feeds",
    label: "Inventory Feeds",
    icon: <Rss size={20} />,
    path: (id: string) => `/dashboard/advertisers/${id}?tab=inventory-feeds`,
  },
  {
    value: "video-ads",
    label: "Video Ads",
    icon: <Video size={20} />,
    path: (id: string) => `/dashboard/advertisers/${id}?tab=video-ads`,
  },
];

interface AdvertiserTabsProps {
  currentStep: number;
  stepLabel: string;
}

export function AdvertiserTabs({ currentStep, stepLabel }: AdvertiserTabsProps) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const advertiserId = params.id as string;
  const activeTab = searchParams.get("tab") || "settings";

  return (
    <div className="w-full mb-8">
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.value}
            className={`
              px-6 py-2 rounded-t-lg font-semibold text-sm transition-colors
              flex items-center gap-2
              ${activeTab === tab.value 
                ? "bg-[#FAAE3A] text-[#404042] shadow" 
                : "bg-gray-100 text-[#404042] hover:bg-[#FFF3D1]"}
            `}
            onClick={() => router.push(tab.path(advertiserId))}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
} 