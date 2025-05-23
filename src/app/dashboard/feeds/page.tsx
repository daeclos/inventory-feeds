"use client";

import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Edit2, Copy, Search, FileText, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useAdvertiserStore } from '@/store/advertiserStore';
import { useRouter } from "next/navigation";
import { AdvertiserFeedsAccordion } from "./components/AdvertiserFeedsAccordion";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";
import { FilterBuilder } from "@/components/ui/FilterBuilder";

// Definición del tipo de props para la tabla
export interface FeedAdvertiser {
  id: string;
  name: string;
  totalRecords: number;
  noPrice: number;
  noImage: number;
  customFeeds: number;
  hasAds?: boolean;
  status?: boolean;
  addresses?: { address: string }[];
}

interface CustomFeedsTableProps {
  advertisers: FeedAdvertiser[];
  onRowClick?: (advertiser: FeedAdvertiser) => void;
}

function CustomFeedsTable({ advertisers, onRowClick }: CustomFeedsTableProps) {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [feedsByAdvertiser, setFeedsByAdvertiser] = useState<Record<string, any[]>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedToDelete, setFeedToDelete] = useState<any>(null);
  const [advIdToDelete, setAdvIdToDelete] = useState<string | null>(null);
  const [openFeedDetails, setOpenFeedDetails] = useState<Record<string, Set<string>>>({}); // { advertiserId: Set<feedId> }
  const router = useRouter();

  const handleRowClick = (advId: string) => {
    setOpenRow(openRow === advId ? null : advId);
  };

  const handleFeedNameClick = (advId: string, feedId: string) => {
    setOpenFeedDetails(prev => {
      const set = new Set(prev[advId] || []);
      if (set.has(feedId)) set.delete(feedId);
      else set.add(feedId);
      return { ...prev, [advId]: set };
    });
  };

  // Handlers básicos para acciones
  const handleEdit = (feed: any) => alert(`Edit feed: ${feed.name}`);
  const handleDuplicate = (feed: any) => alert(`Duplicate feed: ${feed.name}`);
  const handleView = (feed: any) => alert(`View feed: ${feed.name}`);
  const handleCopy = (feed: any) => alert(`Copy feed: ${feed.name}`);
  const handleDownload = (feed: any) => alert(`Download feed: ${feed.name}`);
  const handleDelete = (feed: any, advId: string) => {
    setFeedToDelete(feed);
    setAdvIdToDelete(advId);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    if (!feedToDelete || !advIdToDelete) return;
    const updated = { ...feedsByAdvertiser };
    updated[advIdToDelete] = updated[advIdToDelete].filter((f: any) => f.id !== feedToDelete.id);
    setFeedsByAdvertiser(updated);
    setShowDeleteModal(false);
    setFeedToDelete(null);
    setAdvIdToDelete(null);
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setFeedToDelete(null);
    setAdvIdToDelete(null);
  };

  return (
    <div className="rounded-xl border bg-white shadow p-4">
      <AdvertiserFeedsAccordion advertisers={advertisers} />
      {/* Modal de confirmación para eliminar feed */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f7f9]/80">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw]">
            <div className="mb-4 text-lg font-semibold text-[#404042]">Delete Feed</div>
            <div className="mb-6 text-[#404042]">Are you sure you want to delete the feed <span className="font-bold">{feedToDelete?.name}</span>?</div>
            <div className="flex justify-end gap-4">
              <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-200 text-[#404042] font-semibold hover:bg-gray-300">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded bg-[#F17625] text-white font-semibold hover:bg-[#FAAE3A]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomFeedsPage() {
  const router = useRouter();
  const advertisers = useAdvertiserStore(state => state.advertisers);

  const feedAdvertisers = advertisers.map(adv => ({
    ...adv,
    id: adv.id || `adv-${Math.random().toString(36).substr(2, 9)}`,
    totalRecords: 0,
    noPrice: 0,
    noImage: 0,
    customFeeds: 0,
  }));

  return (
    <div className="flex min-h-screen bg-[#f7f7f9] font-geist">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onAlertClick={() => {}} />
        <main className="max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-[#404042]">Subscribed Feeds per Advertiser</h1>
            <Button variant="outline" onClick={() => router.push("/dashboard/feeds/agency-feeds")}>Agency Feeds</Button>
          </div>
          <div className="flex gap-2 mb-4">
            <Button 
              variant="default"
              onClick={() => router.push("/dashboard/feeds/subscription")}
            >
              + Feed Subscription
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/product-alias")}
            >
              Product Alias
            </Button>
          </div>
          <CustomFeedsTable advertisers={feedAdvertisers} />
        </main>
      </div>
    </div>
  );
} 