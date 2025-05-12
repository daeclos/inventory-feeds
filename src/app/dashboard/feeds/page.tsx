"use client";

import DashboardLayout from "@/components/ui/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Edit2, Copy, Search, FileText, Trash2, Download } from "lucide-react";
import React, { useState, useEffect } from "react";
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
  hasAds?: boolean;
  status?: boolean;
}

interface CustomFeedsTableProps {
  advertisers: FeedAdvertiser[];
  onRowClick?: (advertiser: FeedAdvertiser) => void;
}

function CustomFeedsTable({ advertisers, onRowClick }: CustomFeedsTableProps) {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [feedsByAdvertiser, setFeedsByAdvertiser] = useState<Record<string, any[]>>({});
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('customFeeds') || '{}');
    setFeedsByAdvertiser(stored);
  }, []);

  const handleRowClick = (advId: string) => {
    setOpenRow(openRow === advId ? null : advId);
  };

  // Handlers básicos para acciones
  const handleEdit = (feed: any) => alert(`Edit feed: ${feed.name}`);
  const handleDuplicate = (feed: any) => alert(`Duplicate feed: ${feed.name}`);
  const handleView = (feed: any) => alert(`View feed: ${feed.name}`);
  const handleCopy = (feed: any) => alert(`Copy feed: ${feed.name}`);
  const handleDownload = (feed: any) => alert(`Download feed: ${feed.name}`);
  const handleDelete = (feed: any, advId: string) => {
    if (window.confirm(`Delete feed: ${feed.name}?`)) {
      const updated = { ...feedsByAdvertiser };
      updated[advId] = updated[advId].filter((f: any) => f.id !== feed.id);
      setFeedsByAdvertiser(updated);
      localStorage.setItem('customFeeds', JSON.stringify(updated));
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow p-4">
      <Table>
        <thead>
          <TableRow>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Advertiser Name</TableHead>
            <TableHead className="text-right">Total Feed Records</TableHead>
            <TableHead className="text-right">No Price</TableHead>
            <TableHead className="text-right">No Image</TableHead>
            <TableHead className="text-right">Custom Feeds</TableHead>
          </TableRow>
        </thead>
        <TableBody>
          {advertisers.map((adv) => (
            <React.Fragment key={adv.id}>
              <TableRow
                className={`cursor-pointer hover:bg-gray-100 ${openRow === adv.id ? 'bg-yellow-50' : ''}`}
                onClick={() => handleRowClick(adv.id)}
              >
                <TableCell className="px-4 py-2 text-center">
                  {adv.hasAds || adv.status ? (
                    <span className="px-3 py-1 rounded font-semibold text-sm bg-green-100 text-green-600">Active</span>
                  ) : (
                    <span className="px-3 py-1 rounded font-semibold text-sm bg-red-100 text-red-600">Inactive</span>
                  )}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  {adv.name}
                </TableCell>
                <TableCell className="text-right">{adv.totalRecords}</TableCell>
                <TableCell className="text-right">{adv.noPrice}</TableCell>
                <TableCell className="text-right">{adv.noImage}</TableCell>
                <TableCell className="text-right">{(feedsByAdvertiser[adv.id]?.length || 0)} <span className="ml-1">▼</span></TableCell>
              </TableRow>
              {openRow === adv.id && (
                <TableRow>
                  <TableCell colSpan={6} className="bg-yellow-50 p-0">
                    {feedsByAdvertiser[adv.id]?.length ? (
                      <ul className="pl-0">
                        {feedsByAdvertiser[adv.id].map(feed => (
                          <li key={feed.id} className="flex items-center justify-between border-b last:border-b-0 px-6 py-2">
                            <span className="font-semibold text-[#404042]">{feed.name}</span>
                            <span className="flex gap-2">
                              <Edit2 size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Edit" onClick={e => { e.stopPropagation(); router.push(`/dashboard/feeds/edit/${feed.id}`); }} />
                              <Copy size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Duplicate" onClick={e => { e.stopPropagation(); handleDuplicate(feed); }} />
                              <Search size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="View" onClick={e => { e.stopPropagation(); handleView(feed); }} />
                              <FileText size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Copy" onClick={e => { e.stopPropagation(); handleCopy(feed); }} />
                              <Download size={18} className="cursor-pointer text-[#404042] hover:text-[#FAAE3A] transition-colors" aria-label="Download" onClick={e => { e.stopPropagation(); handleDownload(feed); }} />
                              <Trash2 size={18} className="cursor-pointer text-[#F17625] hover:text-[#FAAE3A] transition-colors" aria-label="Delete" onClick={e => { e.stopPropagation(); handleDelete(feed, adv.id); }} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">No feeds for this advertiser.</span>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
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
    customFeeds: 0,
    hasAds: adv.hasAds,
    status: adv.status
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