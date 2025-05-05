// ✅ Simulated advertiser list with Supabase-ready placeholder and typing
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

// 🔒 Define the advertiser type for TypeScript safety
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

export default function AdvertisersPage() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [activeOnly, setActiveOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAdvertiserName, setNewAdvertiserName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // const fetchAdvertisers = async () => {
    //   const { data, error } = await supabase.from("advertisers").select("*");
    //   if (data) setAdvertisers(data);
    // };
    // fetchAdvertisers();
  }, []);

  const handleAddAdvertiser = () => {
    if (!newAdvertiserName.trim()) return;
    const newAdvertiser: Advertiser = {
      name: newAdvertiserName,
      totalFeeds: 0,
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
        {/* Header */}
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
          {/* Left Section */}
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

          {/* Right Section */}
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
            {["Copy", "CSV", "Excel"].map((label) => (
              <button
                key={label}
                className="px-3 py-1 rounded font-bold text-white bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] transition"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Advertiser Table */}
        <table className="min-w-full table-auto text-sm mt-6">
          <thead className="bg-[#404042] text-white">
            <tr className="text-left font-bold">
              <th className="px-4 py-2">Advertiser Name</th>
              <th className="px-4 py-2">Total Feed Records</th>
              <th className="px-4 py-2">Last Update</th>
              <th className="px-4 py-2">History</th>
              <th className="px-4 py-2">Custom Feeds</th>
              <th className="px-4 py-2">Video Templates</th>
              <th className="px-4 py-2">Video Ad Versions</th>
            </tr>
          </thead>
          <tbody className="text-[#404042] bg-white">
            {paginatedAdvertisers.map((adv, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-100">
                <td className="px-4 py-3">
                  <div className="font-semibold text-[#404042]">{adv.name}</div>
                  <div className="flex gap-2 mt-1">
                    <Settings size={16} className="text-gray-400" />
                    <SearchIcon size={16} className="text-gray-400" />
                    <Users size={16} className="text-gray-400" />
                    <Rss size={16} className="text-gray-400" />
                    <FileText size={16} className="text-gray-400" />
                    <Info size={16} className="text-gray-400" />
                  </div>
                </td>
                <td className="px-4 py-3">{adv.totalFeeds}</td>
                <td className="px-4 py-3">{adv.lastUpdate}</td>
                <td className="px-4 py-3">{adv.history}</td>
                <td className="px-4 py-3">{adv.customFeeds}</td>
                <td className="px-4 py-3">{adv.videoTemplates}</td>
                <td className="px-4 py-3">{adv.videoAdVersions}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-end items-center gap-4 mt-4 text-sm text-[#404042]">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded font-bold text-white bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] transition"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 rounded font-bold text-white bg-[#404042] hover:bg-[#FAAE3A] active:bg-[#F17625] transition"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
