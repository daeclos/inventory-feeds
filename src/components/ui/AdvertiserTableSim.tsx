"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Search as SearchIcon,
  Users,
  Rss,
  FileText,
  Info,
} from "lucide-react";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

interface Advertiser {
  name: string;
  totalFeeds: number;
  lastUpdate: string;
  history: string;
  customFeeds: number;
  videoTemplates: number;
  videoAdVersions: number;
  isActive: boolean;
}

function convertToWorksheet(data: Advertiser[]) {
  const clean = data.map(({ name, totalFeeds, lastUpdate, history, customFeeds, videoTemplates, videoAdVersions }) => ({
    Name: name,
    TotalFeeds: totalFeeds,
    LastUpdate: lastUpdate,
    History: history,
    CustomFeeds: customFeeds,
    VideoTemplates: videoTemplates,
    VideoAdVersions: videoAdVersions,
  }));
  return XLSX.utils.json_to_sheet(clean);
}

function exportToFile(data: Advertiser[], type: "csv" | "xlsx") {
  if (!data.length) {
    toast.error("No data to export");
    return;
  }
  const ws = convertToWorksheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Advertisers");

  const filename = type === "csv" ? "advertisers.csv" : "advertisers.xlsx";
  XLSX.writeFile(wb, filename, { bookType: type });
  toast.success(`${type.toUpperCase()} file exported!`);
}

function copyToClipboard(data: Advertiser[]) {
  if (!data.length) {
    toast.error("No data to copy");
    return;
  }
  const rows = data.map(a =>
    `${a.name}, ${a.totalFeeds}, ${a.lastUpdate}, ${a.history}, ${a.customFeeds}, ${a.videoTemplates}, ${a.videoAdVersions}`
  );
  const header = "Name, Total Feeds, Last Update, History, Custom Feeds, Video Templates, Video Ad Versions";
  const all = [header, ...rows].join("\n");
  navigator.clipboard.writeText(all).then(() => {
    toast.success("Table data copied to clipboard!");
  });
}

export default function AdvertisersPage() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([{
    name: "Alliance Auto Group LTD",
    totalFeeds: 211,
    lastUpdate: "05/04/2025 12:12 AM",
    history: "73 days",
    customFeeds: 5,
    videoTemplates: 0,
    videoAdVersions: 0,
    isActive: true,
  }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [activeOnly, setActiveOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAdvertiserName, setNewAdvertiserName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddAdvertiser = () => {
    if (!newAdvertiserName.trim()) return;
    const newAdvertiser: Advertiser = {
      name: newAdvertiserName,
      totalFeeds: 100,
      lastUpdate: new Date().toLocaleString(),
      history: "0 days",
      customFeeds: 0,
      videoTemplates: 0,
      videoAdVersions: 0,
      isActive: true,
    };
    setAdvertisers((prev) => [...prev, newAdvertiser]);
    setNewAdvertiserName("");
    setIsDialogOpen(false);
  };

  const filteredAdvertisers = advertisers.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = activeOnly ? a.isActive : true;
    return matchesSearch && matchesActive;
  });

  const totalPages = Math.ceil(filteredAdvertisers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedAdvertisers = filteredAdvertisers.slice(startIdx, startIdx + itemsPerPage);

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-[#404042]">Advertiser Dashboard</h2>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-[#404042] text-white font-bold rounded hover:bg-[#FAAE3A] active:bg-[#F17625] transition">
                + Advertiser
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">Add Advertiser</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="advertiserName">Advertiser Name</Label>
                  <Input
                    id="advertiserName"
                    value={newAdvertiserName}
                    onChange={(e) => setNewAdvertiserName(e.target.value)}
                    placeholder="Enter advertiser name"
                  />
                </div>
                <Button
                  onClick={handleAddAdvertiser}
                  className="bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625] font-bold"
                >
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="text-[#404042]">
            <div className="flex items-center space-x-2 mb-2">
              <Switch
                id="active-switch"
                checked={activeOnly}
                onCheckedChange={(checked) => setActiveOnly(checked)}
              />
              <label htmlFor="active-switch" className="text-sm font-bold">Active Only</label>
            </div>

            <div className="flex items-center gap-2 text-sm mb-1">
              <span>Show</span>
              <input
                type="number"
                min="1"
                value={itemsPerPage}
                onChange={(e) => {
                  const newVal = parseInt(e.target.value);
                  if (!isNaN(newVal) && newVal > 0) {
                    setItemsPerPage(newVal);
                    setCurrentPage(1);
                  }
                }}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-[#FAAE3A]"
              />
              <span>entries</span>
            </div>

            <p className="text-sm">
              Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filteredAdvertisers.length)} of {filteredAdvertisers.length} entries
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="flex items-center border border-gray-300 focus-within:border-[#FAAE3A] shadow-sm focus-within:shadow-md rounded px-2 py-1 transition-all">
                <SearchIcon className="w-4 h-4 text-[#404042] mr-2" />
                <input
                  id="search"
                  type="text"
                  placeholder="Search advertisers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="outline-none text-sm text-[#404042] placeholder:text-gray-400 bg-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(filteredAdvertisers)}
              className="px-3 py-1 rounded font-bold text-white bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] transition"
            >
              Copy
            </button>
            <button
              onClick={() => exportToFile(filteredAdvertisers, "csv")}
              className="px-3 py-1 rounded font-bold text-white bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] transition"
            >
              CSV
            </button>
            <button
              onClick={() => exportToFile(filteredAdvertisers, "xlsx")}
              className="px-3 py-1 rounded font-bold text-white bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] transition"
            >
              Excel
            </button>
          </div>
        </div>
        {/* Tabla y paginación omitidas aquí para brevedad */}
      </div>
    </DashboardLayout>
  );
}
