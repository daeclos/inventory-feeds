"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import AdvertiserTable from "./components/AdvertiserTable";

import AddAdvertiserModal from "./components/AddAdvertiserModal";
import { useDebounce } from "use-debounce";
import { AdvertiserFormData } from "@/types/advertiser";
import { Advertiser } from "@/types/advertiser";

import DashboardLayout from "@/components/ui/DashboardLayout";
import { useAdvertiserStore } from './store';

export default function AdvertiserPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [advertiserData, setAdvertiserData] = useState<AdvertiserFormData>({});
  const advertisers = useAdvertiserStore(state => state.advertisers);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAdvertisers: Advertiser[] = advertisers.filter((adv) => {
    const matchSearch = adv.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && adv.hasAds) ||
      (statusFilter === "inactive" && !adv.hasAds);
    return matchSearch && matchStatus;
  });

  const totalCount = advertisers.length;
  const filteredCount = filteredAdvertisers.length;
  const totalPages = Math.ceil(filteredCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const showingAdvertisers: Advertiser[] = filteredAdvertisers.slice(startIndex, endIndex);

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#404042]">Advertisers</h1>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search advertiser..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-80 border-gray-300"
          />
          <AddAdvertiserModal
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            advertiserData={advertiserData}
            setAdvertiserData={setAdvertiserData}
            setAdvertisers={() => {}}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        {/* Filter by Status */}
        <div className="flex items-center gap-2 text-sm text-[#404042]">
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
        {/* Dropdown */}
        <div className="flex items-center gap-2 text-sm text-[#404042]">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {[10, 25, 50, 100].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          {["Copy", "CSV", "Excel"].map((label) => (
            <button
              key={label}
              className="bg-[#404042] text-white font-semibold text-sm px-3 py-1 rounded hover:bg-[#FAAE3A] active:bg-[#F17625]"
              onClick={() => alert(`${label} clicked (not implemented)`)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <AdvertiserTable data={showingAdvertisers} />

      <div className="flex justify-between items-center mt-4 text-sm text-[#404042]">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, filteredCount)} of {filteredCount} entries
          {filteredCount !== totalCount && ` (filtered from ${totalCount} total entries)`}
        </div>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange("prev")}
            className="px-3 py-1 rounded bg-[#404042] text-white disabled:bg-gray-300 disabled:text-gray-600 hover:bg-[#FAAE3A] active:bg-[#F17625]"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange("next")}
            className="px-3 py-1 rounded bg-[#404042] text-white disabled:bg-gray-300 disabled:text-gray-600 hover:bg-[#FAAE3A] active:bg-[#F17625]"
          >
            Next
          </button>
        </div>
      </div>
          </div>
    </DashboardLayout>
  );
}
