"use client";

import DashboardLayout from "@/components/ui/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState } from "react";
import { useAdvertiserStore } from "@/app/dashboard/advertisers/store";

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
  // Obtener advertisers reales
  const advertisers = useAdvertiserStore(state => state.advertisers);

  // Estado para feeds custom locales
  const [customFeeds, setCustomFeeds] = useState<any[]>([]);

  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [feedName, setFeedName] = useState("");
  const [feedType, setFeedType] = useState("Default");
  const [feedFormat, setFeedFormat] = useState("Google Ads");
  const [step, setStep] = useState(1);
  const [advertiserId, setAdvertiserId] = useState("");
  const [excludePrices, setExcludePrices] = useState(false);
  const [urlAppends, setUrlAppends] = useState<string[]>([]);
  const [urlAppendInput, setUrlAppendInput] = useState("");

  const campaignUrlPreview = `https://example.com/feed?name=${feedName}&type=${feedType}&format=${feedFormat}${excludePrices ? "&excludePrices=1" : ""}${urlAppends.map(u => `&${u}`).join("")}`;

  // Guardar nuevo feed
  const handleSaveFeed = () => {
    setCustomFeeds([
      ...customFeeds,
      {
        id: Date.now().toString(),
        name: feedName,
        advertiserId,
        totalRecords: 0,
        noPrice: 0,
        noImage: 0,
        customFeeds: 1,
      },
    ]);
    setModalOpen(false);
    setFeedName("");
    setFeedType("Default");
    setFeedFormat("Google Ads");
    setAdvertiserId("");
    setExcludePrices(false);
    setUrlAppends([]);
    setUrlAppendInput("");
    setStep(1);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-[#404042]">Subscribed Feeds per Advertiser</h1>
          <Button variant="secondary">Agency Feeds</Button>
        </div>
        <div className="flex gap-2 mb-4">
          <Dialog open={modalOpen} onOpenChange={open => { setModalOpen(open); setStep(1); }}>
            <DialogTrigger asChild>
              <Button variant="default">+ Feed Subscription</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl w-full">
              {step === 1 && (
                <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); if(feedFormat === 'Google Ads') setStep(2); }}>
                  <h2 className="text-xl font-bold text-[#2A6BE9] mb-4">New Feed Subscription</h2>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">Feed Name</label>
                    <Input value={feedName} onChange={e => setFeedName(e.target.value)} placeholder="Feed Name" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">Feed Type</label>
                    <select className="border rounded px-3 py-2" value={feedType} onChange={e => setFeedType(e.target.value)}>
                      <option value="Default">Default</option>
                      <option value="Aging inventory">Aging inventory</option>
                      <option value="Highest Prices">Highest Prices</option>
                      <option value="Lowest Prices">Lowest Prices</option>
                      <option value="Now Available">Now Available</option>
                      <option value="Price Drops">Price Drops</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">Feed Format</label>
                    <select className="border rounded px-3 py-2" value={feedFormat} onChange={e => setFeedFormat(e.target.value)}>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Meta Ads">Meta Ads</option>
                      <option value="Amazon Display">Amazon Display</option>
                      <option value="Bing AIA">Bing AIA</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">Advertisers</label>
                    <select className="border rounded px-3 py-2" value={advertiserId} onChange={e => setAdvertiserId(e.target.value)} required>
                      <option value="">Select advertiser</option>
                      {advertisers.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4 justify-end mt-4">
                    <Button type="button" variant="destructive" onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button type="submit" variant="default">Next</Button>
                  </div>
                </form>
              )}
              {step === 2 && feedFormat === 'Google Ads' && (
                <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleSaveFeed(); }}>
                  <h2 className="text-xl font-bold text-[#2A6BE9] mb-4">New Feed Subscription</h2>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">Feed Name</label>
                    <Input value={feedName} readOnly className="bg-gray-100" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">Feed Type</label>
                    <Input value={feedType} readOnly className="bg-gray-100" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">Feed Format</label>
                    <Input value={feedFormat} readOnly className="bg-gray-100" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">Advertisers</label>
                    <Input value={advertisers.find(a => a.id === advertiserId)?.name || "-"} readOnly className="bg-gray-100" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">Exclude Prices</label>
                    <input type="checkbox" checked={excludePrices} onChange={e => setExcludePrices(e.target.checked)} />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">URL Appends</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Input value={urlAppendInput} onChange={e => setUrlAppendInput(e.target.value)} placeholder="param=value" />
                        <Button type="button" onClick={() => { if(urlAppendInput) { setUrlAppends([...urlAppends, urlAppendInput]); setUrlAppendInput(""); } }}>
                          +Add new
                        </Button>
                      </div>
                      <ul className="list-disc ml-4">
                        {urlAppends.map((u, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {u}
                            <Button type="button" size="sm" variant="ghost" onClick={() => setUrlAppends(urlAppends.filter((_, idx) => idx !== i))}>Remove</Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right font-semibold">Campaign URL Preview</label>
                    <Input value={campaignUrlPreview} readOnly className="bg-gray-100" />
                  </div>
                  <div className="flex gap-4 justify-end mt-4">
                    <Button type="button" variant="destructive" onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button type="submit" variant="default">Save</Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
          <Button variant="secondary">Product Alias</Button>
          <Button variant="ghost"><Download className="w-5 h-5" /></Button>
        </div>
        {/* Tabla de Custom Feeds: ahora muestra todos los advertisers */}
        <div className="mt-8">
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
                {advertisers.map((adv) => {
                  // Buscar si hay un feed creado para este advertiser
                  const feed = customFeeds.find(f => f.advertiserId === adv.id);
                  return (
                    <TableRow key={adv.id} className="cursor-pointer hover:bg-gray-100">
                      <TableCell className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-400 inline-block" />
                        {adv.name}
                      </TableCell>
                      <TableCell className="text-right">{feed?.totalRecords ?? 0}</TableCell>
                      <TableCell className="text-right">{feed?.noPrice ?? 0}</TableCell>
                      <TableCell className="text-right">{feed?.noImage ?? 0}</TableCell>
                      <TableCell className="text-right">{feed?.customFeeds ?? 0} <span className="ml-1">▼</span></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 