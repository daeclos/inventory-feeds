"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AlertDetailModal } from "./AlertDetailModal";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";

interface Alert {
  advertiser: string;
  advertiserId: string;
  reported: string;
  updated: string;
  subject: string;
}

interface AlertDetail {
  advertiser: string;
  alert_type: string;
  source: string;
  severity: "info" | "warning" | "critical";
  description: string;
  possible_causes: string[];
  recommended_action: string;
  status: string;
  timestamp_created: string;
  timestamp_updated: string;
}

// Elimina el mock data y deja la estructura para datos reales
// const MOCK_ALERTS: Alert[] = [ ... ];

const PAGE_SIZE = 10;

export default function AlertsReportPage() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedAlert, setSelectedAlert] = React.useState<AlertDetail | null>(null);

  // Aquí deberías obtener los datos reales, por ejemplo desde props, context o una llamada a la API
  const alerts: Alert[] = [];
  const filteredAlerts = alerts.filter(alert =>
    alert.advertiser.toLowerCase().includes(search.toLowerCase()) ||
    alert.subject.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredAlerts.length / PAGE_SIZE);
  const paginatedAlerts = filteredAlerts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleOpenDetail = (alert: Alert) => {
    setSelectedAlert({
      advertiser: alert.advertiser,
      alert_type: "Google Ads Eligibility",
      source: "Fountain Hub",
      severity: "critical",
      description: "No eligible campaigns in Google Ads for Fountain Hub!",
      possible_causes: [
        "No campaigns are active in Google Ads.",
        "Budget is missing or exhausted.",
        "Integration error with Google Ads account."
      ],
      recommended_action: "Check your Google Ads account and ensure at least one campaign is active and eligible.",
      status: "open",
      timestamp_created: alert.reported,
      timestamp_updated: alert.updated,
    });
    setOpenDetail(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#404042' }}>Alerts Report</h2>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <Input type="number" className="w-16" value={PAGE_SIZE} readOnly />
              <span>entries</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Search:</span>
              <Input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-48"
              />
            </div>
          </div>
          <table className="w-full border text-sm mb-2">
            <thead>
              <tr className="bg-[#FFF3D1]">
                <th className="text-left px-3 py-2 text-[#404042]">Advertiser</th>
                <th className="text-left px-3 py-2 text-[#404042]">Reported</th>
                <th className="text-left px-3 py-2 text-[#404042]">Updated</th>
                <th className="text-left px-3 py-2 text-[#404042]">Subject</th>
                <th className="text-center px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlerts.length > 0 ? (
                paginatedAlerts.map((alert, idx) => (
                  <tr key={idx} className="even:bg-[#FFF3D1]">
                    <td className="px-3 py-2 font-semibold">
                      <Link href={`/dashboard/advertisers/${alert.advertiserId}/settings`} className="text-[#FAAE3A] hover:underline">
                        {alert.advertiser}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-[#404042]">{alert.reported}</td>
                    <td className="px-3 py-2 text-[#404042]">{alert.updated}</td>
                    <td className="px-3 py-2 text-[#404042]">{alert.subject}</td>
                    <td className="px-3 py-2 text-center">
                      <Search className="w-5 h-5 text-[#FAAE3A] cursor-pointer hover:text-[#F17625]" onClick={() => handleOpenDetail(alert)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">No alerts found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Paginación */}
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 rounded bg-[#FFF3D1] text-[#404042] border border-[#FAAE3A] hover:bg-[#FAAE3A] hover:text-white transition"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >Previous</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-[#FAAE3A] text-white' : 'bg-[#FFF3D1] text-[#404042] border border-[#FAAE3A]'} transition`}
                onClick={() => setPage(i + 1)}
              >{i + 1}</button>
            ))}
            <button
              className="px-3 py-1 rounded bg-[#FFF3D1] text-[#404042] border border-[#FAAE3A] hover:bg-[#FAAE3A] hover:text-white transition"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >Next</button>
          </div>
          <AlertDetailModal open={openDetail} onOpenChange={setOpenDetail} alert={selectedAlert} />
        </main>
      </div>
    </div>
  );
}
