"use client";

import { useState } from "react";
import DashboardLayout from "@/components/ui/DashboardLayout";
import CustomFeedsTable from "./components/CustomFeedsTable";
import AddFeedModal from "./components/AddFeedModal";
import { sampleAdvertisers, AdvertiserGroup, FeedAd } from "./data/feeds";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function FeedsPage() {
  const [advertisers, setAdvertisers] = useState<AdvertiserGroup[]>(sampleAdvertisers);

  const handleAddFeed = (advertiser: string, feed: FeedAd) => {
    setAdvertisers((prev) =>
      prev.map((group) =>
        group.advertiser === advertiser
          ? { ...group, ads: [...group.ads, feed] }
          : group
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#404042]">Subscribed Feeds per Advertiser</h1>
          <Button className="bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625]">
            Agency Feeds
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <AddFeedModal
            onAdd={handleAddFeed}
            advertisers={advertisers.map((g) => g.advertiser)}
          />
          <Button className="bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625]">
            Product Alias
          </Button>
          <Button className="bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625]">
            <Download className="w-4 h-4" />
          </Button>
        </div>

        <CustomFeedsTable data={advertisers} />
      </div>
    </DashboardLayout>
  );
}
