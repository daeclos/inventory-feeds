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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('customFeeds') || '{}');
    setFeedsByAdvertiser(stored);
  }, []);

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
    localStorage.setItem('customFeeds', JSON.stringify(updated));
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
                          <React.Fragment key={feed.id}>
                            <li
                              className="flex items-center justify-between border-b last:border-b-0 px-6 py-2 cursor-pointer hover:bg-[#FFF3D1]/40 transition"
                              onClick={e => { e.stopPropagation(); handleFeedNameClick(adv.id, feed.id); }}
                            >
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
                            {/* Dropdown de detalles del feed */}
                            {openFeedDetails[adv.id]?.has(feed.id) && (
                              <li className="bg-[#f7f7f9] border-b last:border-b-0 px-10 py-4 text-sm text-[#404042]">
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-y-1 gap-x-4 items-center">
                                  <div className="md:col-span-1"><span className="text-[#404042]">Feed Type</span></div>
                                  <div className="md:col-span-5 font-bold">{feed.type}</div>
                                  <div className="md:col-span-1"><span className="text-[#404042]">Feed Format</span></div>
                                  <div className="md:col-span-5 font-bold">{feed.format}</div>
                                  <div className="md:col-span-1"><span className="text-[#404042]">Address</span></div>
                                  <div className="md:col-span-5 font-bold">{feed.address || (Array.isArray(adv.addresses) && adv.addresses[0]?.address) || '-'}</div>
                                  {feed.filters && feed.filters.length > 0 && (
                                    <><div className="md:col-span-1"><span className="text-[#404042]">Filter</span></div>
                                    <div className="md:col-span-5">
                                      {feed.filters.map((f: any, i: number) => (
                                        <span key={i}>
                                          <span className="text-blue-700 font-semibold">({f.field} {f.operator} <span className="text-[#F17625]">{Array.isArray(f.value) ? f.value.map((v: string) => `"${v}"`).join(', ') : `"${f.value}"`}</span>)</span>
                                        </span>
                                      ))}
                                    </div></>
                                  )}
                                  {/* Url: principal y extras */}
                                  <div className="md:col-span-1"><span className="text-[#404042]">Url</span></div>
                                  <div className="md:col-span-5 flex flex-col gap-1">
                                    {/* URL principal */}
                                    {feed.url ? (
                                      <a href={feed.url} className="text-blue-600 underline break-all" target="_blank" rel="noopener noreferrer">{feed.url}</a>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                    {/* URLs adicionales de urlAppends si existen y tienen value que parezca url */}
                                    {feed.urlAppends && Array.isArray(feed.urlAppends) && feed.urlAppends.length > 0 && feed.urlAppends.map((u: { name: string; value: string }, idx: number) => (
                                      u.value && (u.value.startsWith('http://') || u.value.startsWith('https://')) ? (
                                        <a key={idx} href={u.value} className="text-blue-600 underline break-all ml-2" target="_blank" rel="noopener noreferrer">{u.value}</a>
                                      ) : null
                                    ))}
                                  </div>
                                </div>
                              </li>
                            )}
                          </React.Fragment>
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
  // Obtener advertisers reales
  const advertisers = useAdvertiserStore(state => state.advertisers);

  // Estado para feeds custom locales
  const [customFeeds, setCustomFeeds] = useState<any[]>([]);

  // Convertir advertisers a FeedAdvertiser y agregar addresses
  const feedAdvertisers: FeedAdvertiser[] = advertisers.map(adv => ({
    id: adv.id,
    name: adv.name,
    totalRecords: 0,
    noPrice: 0,
    noImage: 0,
    customFeeds: 0,
    hasAds: adv.hasAds,
    status: adv.status,
    addresses: adv.addresses || []
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