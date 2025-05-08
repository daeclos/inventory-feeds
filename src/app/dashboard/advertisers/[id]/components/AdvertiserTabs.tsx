import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, BarChart2, FileText, Rss, Video } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

const TABS = [
  {
    value: "settings",
    label: "Settings",
    icon: <Settings size={22} />, // Icono más grande
    path: (id: string) => `/dashboard/advertisers/${id}`,
  },
  {
    value: "google-ads-status",
    label: "Google Ads Status Reports",
    icon: <BarChart2 size={22} />,
    path: (id: string) => `/dashboard/advertisers/${id}?tab=google-ads-status`,
  },
  {
    value: "search-templates",
    label: "Search Templates",
    icon: <FileText size={22} />,
    path: (id: string) => `/dashboard/advertisers/${id}?tab=search-templates`,
  },
  {
    value: "inventory-feeds",
    label: "Inventory Feeds",
    icon: <Rss size={22} />,
    path: (id: string) => `/dashboard/advertisers/${id}?tab=inventory-feeds`,
  },
  {
    value: "video-ads",
    label: "Video Ads",
    icon: <Video size={22} />,
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
  // Determinar el tab activo por el parámetro 'tab' de la URL
  const activeTab = searchParams.get("tab") || "settings";

  return (
    <div className="w-full mb-8">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="w-full flex border-b border-gray-200 bg-transparent rounded-none p-0 gap-2 relative">
          {TABS.map(tab => (
            <div key={tab.value} className="relative flex-1 flex flex-col items-center justify-end">
              <TabsTrigger
                value={tab.value}
                onClick={() => router.push(tab.path(advertiserId))}
                className={`
                  flex flex-col items-center gap-1 px-7 py-3 text-base font-bold border-b-4
                  transition-all duration-200
                  ${activeTab === tab.value
                    ? "bg-white border-transparent text-[#404042] shadow-[0_2px_12px_0_rgba(250,174,58,0.10)] z-10"
                    : "bg-[#F8F8F8] border-transparent text-gray-400 hover:text-[#404042] hover:bg-[#FFF3D1]"}
                  rounded-t-xl cursor-pointer
                  outline-none
                `}
                style={{ minWidth: 0, height: 64, letterSpacing: 0.2 }}
              >
                <span className="flex items-center gap-2">
                  {tab.icon}
                  <span className="mt-0.5">{tab.label}</span>
                </span>
              </TabsTrigger>
              {/* Indicador debajo del tab activo */}
              {activeTab === tab.value && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full bg-[#FAAE3A] shadow-lg transition-all duration-300 z-10" />
              )}
            </div>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
} 