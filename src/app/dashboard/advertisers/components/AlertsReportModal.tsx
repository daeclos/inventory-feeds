"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Alert {
  advertiser: string;
  reported: string;
  updated: string;
  subject: string;
}

interface AlertsReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advertiser: string;
  alerts: Alert[];
}

export function AlertsReportModal({ open, onOpenChange, advertiser, alerts }: AlertsReportModalProps) {
  const [search, setSearch] = React.useState("");
  const filteredAlerts = alerts.filter(alert =>
    alert.advertiser.toLowerCase().includes(search.toLowerCase()) ||
    alert.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[90vw]">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#404042' }}>Alerts Report</h2>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <Input type="number" className="w-16" value={10} readOnly />
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
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
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, idx) => (
                <tr key={idx} className="even:bg-[#FFF3D1]">
                  <td className="px-3 py-2 text-[#404042] font-semibold cursor-pointer hover:underline">{alert.advertiser}</td>
                  <td className="px-3 py-2 text-[#404042]">{alert.reported}</td>
                  <td className="px-3 py-2 text-[#404042]">{alert.updated}</td>
                  <td className="px-3 py-2 text-[#404042]">{alert.subject}</td>
                  <td className="px-3 py-2 text-center">
                    <Search className="w-5 h-5 text-[#FAAE3A] cursor-pointer hover:text-[#F17625]" />
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
        {/* Paginación UI básica */}
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 rounded bg-[#FFF3D1] text-[#404042] border border-[#FAAE3A] hover:bg-[#FAAE3A] hover:text-white transition">Previous</button>
          <span className="px-3 py-1 rounded bg-[#FAAE3A] text-white">1</span>
          <button className="px-3 py-1 rounded bg-[#FFF3D1] text-[#404042] border border-[#FAAE3A] hover:bg-[#FAAE3A] hover:text-white transition">Next</button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 