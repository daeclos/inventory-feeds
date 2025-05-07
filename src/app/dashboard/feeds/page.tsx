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
    <div className="p-8 text-2xl text-[#404042]">Feeds Page (en construcción)</div>
  );
}
