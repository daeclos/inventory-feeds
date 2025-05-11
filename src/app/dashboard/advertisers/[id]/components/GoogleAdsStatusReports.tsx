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

  // Filtrado básico (puedes reemplazarlo por lógica real cuando conectes datos)
  const filteredRows = rows.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {[
          "Activated Adgroups",
          "Status Changes",
          "No Results",
          "Error Responses"
        ].map((label, i) => (
          <div key={i} className="bg-background border border-border rounded-lg p-6 flex flex-col items-center shadow-sm min-h-[90px] w-full">
            <span
              className="text-sm mb-2"
              style={{ color: '#404042', fontFamily: 'Geist-ExtraBold, Geist, sans-serif', fontWeight: 800 }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Changed AdGroups Table */}
      <div className="bg-background rounded-xl shadow-sm border border-border p-6 w-full max-w-none">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Excel</Button>
            <Button variant="outline" size="sm">CSV</Button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show</label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={showCount}
              onChange={e => setShowCount(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">entries</span>
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