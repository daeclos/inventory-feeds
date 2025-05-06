"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import SubscribedFeedsTable from "./components/SubscribedFeedsTable";
import AddSubscriptionModal from "./components/AddSubscriptionModal";

interface AdvertiserFeed {
  advertiser: string;
  totalRecords: number;
  noPrice: number;
  noImage: number;
  customFeeds: number;
}

export default function FeedsPage() {
  const [data, setData] = useState<AdvertiserFeed[]>([
    { advertiser: "Alliance Auto Group LTD", totalRecords: 210, noPrice: 0, noImage: 4, customFeeds: 5 },
    { advertiser: "Am Ford", totalRecords: 115, noPrice: 1, noImage: 0, customFeeds: 5 },
    { advertiser: "Auffenberg Nissan", totalRecords: 940, noPrice: 11, noImage: 135, customFeeds: 5 },
    { advertiser: "Auffenberg Volkswagen", totalRecords: 732, noPrice: 10, noImage: 45, customFeeds: 5 },
    { advertiser: "Bill Dobson Ford", totalRecords: 115, noPrice: 8, noImage: 0, customFeeds: 6 },
  ]);

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#404042]">Subscribed Feeds per Advertiser</h1>
        <Button className="bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625]">
          Agency Feeds
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          className="bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625]"
          onClick={() => setShowSubscriptionModal(true)}
        >
          <Plus className="w-4 h-4 mr-1" /> Feed Subscription
        </Button>
        <Button className="bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625]">
          Product Alias
        </Button>
        <Button className="bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625]">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      <SubscribedFeedsTable rows={data} />

      <AddSubscriptionModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
    </div>
  );
}