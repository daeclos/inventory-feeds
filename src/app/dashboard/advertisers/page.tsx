"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import AdvertiserTable from "./components/AdvertiserTable";

import AddAdvertiserModal from "./components/AddAdvertiserModal";
import { useDebounce } from "use-debounce";
import { AdvertiserFormData } from "@/types/advertiser";
import { Advertiser } from "@/types/advertiser";

import DashboardLayout from "@/components/ui/DashboardLayout";
import { useAdvertiserStore } from '@/store/advertiserStore';
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

export default function AdvertiserPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [advertiserData, setAdvertiserData] = useState<AdvertiserFormData>({});
  const advertisers = useAdvertiserStore(state => state.advertisers);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedsByAdvertiser, setFeedsByAdvertiser] = useState<Record<string, any[]>>({});

  // Calcular el total de registros por anunciante
  const advertisersWithFeedCounts = advertisers.map(adv => ({
    ...adv,
    totalRecords: adv.id ? feedsByAdvertiser[adv.id]?.length || 0 : 0
  }));

  const filteredAdvertisers: Advertiser[] = advertisersWithFeedCounts.filter((adv) => {
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

  // Función para obtener los datos visibles en la tabla
  const getTableData = () => {
    return showingAdvertisers.map((adv) => ({
      Name: adv.name,
      "Total Records": adv.totalRecords,
      "Last Update": adv.lastUpdate,
      History: adv.history,
      "Custom Feeds": adv.customFeeds,
      "Video Templates": adv.videoTemplates,
      "Video Ad Versions": adv.videoAdVersions,
    }));
  };

  // Copy al portapapeles
  const handleCopy = () => {
    const data = getTableData();
    if (data.length === 0) return;
    const header = Object.keys(data[0]).join("\t");
    const rows = data.map((row) => Object.values(row).join("\t"));
    const text = [header, ...rows].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("¡Copiado al portapapeles!");
  };

  // Descargar CSV
  const handleCSV = () => {
    const data = getTableData();
    if (data.length === 0) return;
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).map(v => `"${v}"`).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "advertisers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Descargar Excel
  const handleExcel = () => {
    const data = getTableData();
    if (data.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Advertisers");
    XLSX.writeFile(wb, "advertisers.xlsx");
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto px-6 py-8 bg-gray-50 min-h-[90vh] rounded-xl shadow border border-gray-100">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-[#404042] mb-1">Advertisers</h1>
              <p className="text-gray-500 text-sm">Manage, search and export your advertisers.</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search advertiser..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-72 border-gray-300"
              />
              <AddAdvertiserModal
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                advertiserData={advertiserData}
                setAdvertiserData={setAdvertiserData}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full max-w-none">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#404042]">Status:</span>
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
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#404042]">Show</span>
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
              <span className="text-sm text-[#404042]">entries</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="bg-[#404042] text-white font-semibold text-sm px-3 py-1 rounded hover:bg-[#FAAE3A] active:bg-[#F17625]"
                onClick={handleCopy}
              >
                Copy
              </button>
              <button
                className="bg-[#404042] text-white font-semibold text-sm px-3 py-1 rounded hover:bg-[#FAAE3A] active:bg-[#F17625]"
                onClick={handleCSV}
              >
                CSV
              </button>
              <button
                className="bg-[#404042] text-white font-semibold text-sm px-3 py-1 rounded hover:bg-[#FAAE3A] active:bg-[#F17625]"
                onClick={handleExcel}
              >
                Excel
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <AdvertiserTable data={showingAdvertisers} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-4">
          <div className="text-sm text-gray-600">
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
