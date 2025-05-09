"use client";

import DashboardLayout from "@/components/ui/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Download } from "lucide-react";
import { useState } from "react";
import { useAdvertiserStore } from "@/app/dashboard/advertisers/store";
import { useRouter } from "next/navigation";

// Definición del tipo de props para la tabla
export interface FeedAdvertiser {
  id: string;
  name: string;
  totalRecords: number;
  noPrice: number;
  noImage: number;
  customFeeds: number;
}

interface CustomFeedsTableProps {
  advertisers: FeedAdvertiser[];
  onRowClick?: (advertiser: FeedAdvertiser) => void;
}

function CustomFeedsTable({ advertisers, onRowClick }: CustomFeedsTableProps) {
  return (
    <div className="rounded-xl border bg-white shadow p-4">
      <Table>
        <thead>
          <TableRow>
            <TableHead>Advertiser Name</TableHead>
            <TableHead className="text-right">Total Feed Records</TableHead>
            <TableHead className="text-right">No Price</TableHead>
            <TableHead className="text-right">No Image</TableHead>
            <TableHead className="text-right">Custom Feeds</TableHead>
          </TableRow>
        </thead>
        <TableBody>
          {advertisers.map((adv) => (
            <TableRow
              key={adv.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => onRowClick?.(adv)}
            >
              <TableCell className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-400 inline-block" />
                {adv.name}
              </TableCell>
              <TableCell className="text-right">{adv.totalRecords}</TableCell>
              <TableCell className="text-right">{adv.noPrice}</TableCell>
              <TableCell className="text-right">{adv.noImage}</TableCell>
              <TableCell className="text-right">{adv.customFeeds} <span className="ml-1">▼</span></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function CustomFeedsPage() {
  const router = useRouter();
  // Obtener advertisers reales
  const advertisers = useAdvertiserStore(state => state.advertisers);

  // Estado para feeds custom locales
  const [customFeeds, setCustomFeeds] = useState<any[]>([]);

  // Convertir advertisers a FeedAdvertiser
  const feedAdvertisers: FeedAdvertiser[] = advertisers.map(adv => ({
    id: adv.id,
    name: adv.name,
    totalRecords: 0,
    noPrice: 0,
    noImage: 0,
    customFeeds: 0
  }));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-[#404042]">Subscribed Feeds per Advertiser</h1>
          <Button variant="secondary">Agency Feeds</Button>
        </div>
        <div className="flex gap-2 mb-4">
          <Button 
            variant="default"
            onClick={() => router.push("/dashboard/feeds/subscription")}
          >
            + Feed Subscription
          </Button>
        </div>
        <CustomFeedsTable advertisers={feedAdvertisers} />
      </div>
    </DashboardLayout>
  );
} 