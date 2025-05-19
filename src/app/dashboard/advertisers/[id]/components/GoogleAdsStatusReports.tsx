import * as React from "react";
import { Button } from "@/components/ui/button";

interface Metric {
  label: string;
  value: number;
}

interface ReportRow {
  campaign: string;
  adGroup: string;
  prevStatus: string;
  currStatus: string;
  url: string;
  pageContent: string;
  httpCode: string;
}

interface GoogleAdsStatusReportsProps {
  metrics?: Metric[];
  rows?: ReportRow[];
}

export function GoogleAdsStatusReports({ rows = [] }: GoogleAdsStatusReportsProps) {
  const [search, setSearch] = React.useState("");
  const [showCount, setShowCount] = React.useState(50);
  // Filtros avanzados
  const [statusFilter, setStatusFilter] = React.useState("");
  const [httpCodeFilter, setHttpCodeFilter] = React.useState("");
  const [campaignFilter, setCampaignFilter] = React.useState("");

  // Filtrado avanzado
  const filteredRows = rows.filter(row => {
    const matchesSearch = Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchesStatus = statusFilter ? row.currStatus === statusFilter : true;
    const matchesHttp = httpCodeFilter ? String(row.httpCode) === httpCodeFilter : true;
    const matchesCampaign = campaignFilter ? row.campaign === campaignFilter : true;
    return matchesSearch && matchesStatus && matchesHttp && matchesCampaign;
  });

  // Lógica de métricas superiores
  const activatedAdgroups = rows.filter(row => row.currStatus === 'ENABLED').length;
  const statusChanges = rows.filter(row => row.currStatus !== row.prevStatus).length;
  const noResults = rows.filter(row => row.pageContent && String(row.pageContent).toLowerCase() === 'n/a').length;
  const errorResponses = rows.filter(row => Number(row.httpCode) >= 400).length;

  // Exportación CSV
  function exportCSV() {
    if (!filteredRows.length) return;
    const header = Object.keys(filteredRows[0]);
    const csv = [header.join(",")].concat(
      filteredRows.map(row =>
        header.map(key => `"${String((row as any)[key]).replace(/"/g, '""')}"`).join(",")
      )
    ).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "google_ads_status_report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Exportación Excel (HTML table)
  function exportExcel() {
    if (!filteredRows.length) return;
    const header = Object.keys(filteredRows[0]);
    const table = `
      <table>
        <tr>${header.map(h => `<th>${h}</th>`).join("")}</tr>
        ${filteredRows.map(row => `<tr>${header.map(key => `<td>${(row as any)[key]}</td>`).join("")}</tr>`).join("")}
      </table>
    `;
    const blob = new Blob([
      `\ufeff<html><head><meta charset='UTF-8'></head><body>${table}</body></html>`
    ], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "google_ads_status_report.xls";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Obtener valores únicos para los filtros
  const uniqueStatuses = Array.from(new Set(rows.map(r => r.currStatus))).filter(Boolean);
  const uniqueHttpCodes = Array.from(new Set(rows.map(r => r.httpCode))).filter(Boolean);
  const uniqueCampaigns = Array.from(new Set(rows.map(r => r.campaign))).filter(Boolean);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
        <div className="bg-background border border-border rounded-lg p-6 flex flex-col items-center shadow-sm min-h-[90px] w-full">
          <span className="text-sm mb-2" style={{ color: '#404042', fontFamily: 'Geist-ExtraBold, Geist, sans-serif', fontWeight: 800 }}>Activated Adgroups</span>
          <span className="text-2xl font-bold text-[#404042]">{activatedAdgroups}</span>
        </div>
        <div className="bg-background border border-border rounded-lg p-6 flex flex-col items-center shadow-sm min-h-[90px] w-full">
          <span className="text-sm mb-2" style={{ color: '#404042', fontFamily: 'Geist-ExtraBold, Geist, sans-serif', fontWeight: 800 }}>Status Changes</span>
          <span className="text-2xl font-bold text-[#404042]">{statusChanges}</span>
        </div>
        <div className="bg-background border border-border rounded-lg p-6 flex flex-col items-center shadow-sm min-h-[90px] w-full">
          <span className="text-sm mb-2" style={{ color: '#404042', fontFamily: 'Geist-ExtraBold, Geist, sans-serif', fontWeight: 800 }}>No Results</span>
          <span className="text-2xl font-bold text-[#404042]">{noResults}</span>
        </div>
        <div className="bg-background border border-border rounded-lg p-6 flex flex-col items-center shadow-sm min-h-[90px] w-full">
          <span className="text-sm mb-2" style={{ color: '#404042', fontFamily: 'Geist-ExtraBold, Geist, sans-serif', fontWeight: 800 }}>Error Responses</span>
          <span className="text-2xl font-bold text-[#404042]">{errorResponses}</span>
        </div>
      </div>

      {/* Changed AdGroups Table */}
      <div className="bg-background rounded-xl shadow-sm border border-border p-6 w-full max-w-none">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportExcel}>Excel</Button>
            <Button variant="outline" size="sm" onClick={exportCSV}>CSV</Button>
          </div>
          {/* Filtros avanzados */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Status:</label>
            <select className="border rounded px-2 py-1 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="text-sm text-gray-600">HTTP:</label>
            <select className="border rounded px-2 py-1 text-sm" value={httpCodeFilter} onChange={e => setHttpCodeFilter(e.target.value)}>
              <option value="">All</option>
              {uniqueHttpCodes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="text-sm text-gray-600">Campaign:</label>
            <select className="border rounded px-2 py-1 text-sm" value={campaignFilter} onChange={e => setCampaignFilter(e.target.value)}>
              <option value="">All</option>
              {uniqueCampaigns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-600">Search:</label>
            <input
              className="border rounded px-2 py-1 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder=""
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Campaign</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Ad Group</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Previous Status</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Current Status</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">URL</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Page Content</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">HTTP Code</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-8">No results found.</td>
                </tr>
              ) : filteredRows.slice(0, showCount).map((row, i) => (
                <tr key={i} className="border-b last:border-b-0 hover:bg-muted">
                  <td className="px-3 py-2 whitespace-nowrap">{row.campaign}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.adGroup}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.prevStatus}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.currStatus}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <a href={row.url} className="text-blue-600 underline">Link</a>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.pageContent}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.httpCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 