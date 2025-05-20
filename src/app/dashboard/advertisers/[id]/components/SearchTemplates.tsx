import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, Search as SearchIcon, Grid, Copy, Trash2, AlertTriangle, Edit2, FileText } from "lucide-react";
import { useAdvertiserStore } from '@/store/advertiserStore';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import type { Advertiser } from "@/types/advertiser";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function SearchTemplates({ advertiser }: { advertiser: Advertiser }) {
  const advertisers = useAdvertiserStore(state => state.advertisers);
  const [showImport, setShowImport] = React.useState(false);
  const [showCampaigns, setShowCampaigns] = React.useState(false);

  // Handlers para menús (copiados de Campaigns)
  const handleAutoTemplates = (action: string) => {
    if (action === 'New Template') {
      window.location.href = '/dashboard/campaigns/new-auto-template';
    } else if (action === 'Product Alias') {
      window.location.href = '/dashboard/product-alias';
    } else if (action === 'Negative Keywords') {
      window.location.href = '/dashboard/negative-keywords';
    } else {
      alert(`Auto-Templates: ${action}`);
    }
  };
  const handlePrebuildTemplates = (action: string) => {
    if (action === 'New Template') {
      window.location.href = '/dashboard/campaigns/new-prebuild-template';
    } else if (action === 'Edit Libraries') {
      window.location.href = '/dashboard/campaigns/edit-libraries';
    } else if (action === 'Negative Keywords') {
      window.location.href = '/dashboard/negative-keywords';
    } else {
      alert(`Prebuild-Templates: ${action}`);
    }
  };

  // Exportación CSV
  function exportCSV() {
    if (!advertisers.length) return;
    const header = [
      'Advertiser Name', 'Template Name', 'Associated Account', 'Library', 'Campaign Name', 'Max. CPC', 'Template Filter'
    ];
    const csv = [header.join(",")].concat(
      advertisers.map(row =>
        [row.name, '', '', '', '', '', ''].map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")
      )
    ).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "search_templates.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Exportación Excel (HTML table)
  function exportExcel() {
    if (!advertisers.length) return;
    const header = [
      'Advertiser Name', 'Template Name', 'Associated Account', 'Library', 'Campaign Name', 'Max. CPC', 'Template Filter'
    ];
    const table = `
      <table>
        <tr>${header.map(h => `<th>${h}</th>`).join("")}</tr>
        ${advertisers.map(row => `<tr>${[row.name, '', '', '', '', '', ''].map(val => `<td>${val}</td>`).join("")}</tr>`).join("")}
      </table>
    `;
    const blob = new Blob([
      `\ufeff<html><head><meta charset='UTF-8'></head><body>${table}</body></html>`
    ], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "search_templates.xls";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-none">
      {/* Ad Customizers */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2 w-full max-w-none">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-[#404042]">Ad Customizers</span>
          {advertiser?.FeatureSearch && (
            <div className="flex items-center gap-3">
              <Download size={22} className="text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625] cursor-pointer transition-colors" />
              <Grid size={22} className="text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625] cursor-pointer transition-colors" />
              <SearchIcon size={22} className="text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625] cursor-pointer transition-colors" />
              <FileText size={22} className="text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625] cursor-pointer transition-colors" />
            </div>
          )}
        </div>
        {advertiser?.FeatureSearch ? (
          <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-3 text-[#404042] text-sm font-medium">Google Ads Ad Customizer Feed - RSA</div>
        ) : null}
      </div>

      {/* Campaigns */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2 w-full max-w-none">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-[#404042]">Campaigns</span>
          <Button variant="secondary" className="text-blue-700 border-blue-300" type="button">Re-Authenticate</Button>
        </div>
        <div className="mt-2 font-medium text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
          0 Eligible campaigns - <span className="underline cursor-pointer text-[#2A6BE9]" onClick={() => setShowCampaigns(true)}>Show Campaigns</span>
        </div>
      </div>

      {/* Search Templates */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-4 w-full max-w-none">
        <span className="text-base font-bold text-[#404042]">Search Templates</span>
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Auto-Templates</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleAutoTemplates('New Template')}>New Template</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAutoTemplates('Product Alias')}>Product Alias</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAutoTemplates('Negative Keywords')}>Negative Keywords</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Prebuild-Templates</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handlePrebuildTemplates('New Template')}>New Template</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrebuildTemplates('Edit Libraries')}>Edit Libraries</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrebuildTemplates('Negative Keywords')}>Negative Keywords</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={() => setShowImport(true)}>Import Template</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Switch id="activeOnly" />
            <span className="text-sm font-medium text-[#404042]">Active Only</span>
          </div>
          <Button variant="outline" size="sm" onClick={exportExcel}>Excel</Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>CSV</Button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-[#404042]">Search:</span>
            <input className="border rounded px-2 py-1 text-sm" placeholder="" />
          </div>
        </div>
        <div className="overflow-x-auto mt-2 w-full max-w-none">
          <Table className="w-full max-w-none">
            <TableHeader>
              <TableRow>
                <TableHead>Advertiser Name</TableHead>
                <TableHead>Template Name</TableHead>
                <TableHead>Associated Account</TableHead>
                <TableHead>Library</TableHead>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Max. CPC</TableHead>
                <TableHead>Template Filter</TableHead>
                <TableHead>Functions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {advertisers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-400 py-8">No advertisers found.</TableCell>
                </TableRow>
              ) : (
                advertisers.map((adv) => (
                  <TableRow key={adv.id}>
                    <TableCell>{adv.name}</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell>
                      <TooltipProvider>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span><Edit2 size={22} className="text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625] cursor-pointer transition-colors" /></span>
                            </TooltipTrigger>
                            <TooltipContent>Edit Template</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span><AlertTriangle size={22} className="text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625] cursor-pointer transition-colors" /></span>
                            </TooltipTrigger>
                            <TooltipContent>Template Warning</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span><Copy size={22} className="text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625] cursor-pointer transition-colors" /></span>
                            </TooltipTrigger>
                            <TooltipContent>Copy Template</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span><FileText size={22} className="text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625] cursor-pointer transition-colors" /></span>
                            </TooltipTrigger>
                            <TooltipContent>Template File</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span><Trash2 size={22} className="text-[#404042] hover:text-[#FAAE3A] active:text-[#F17625] cursor-pointer transition-colors" /></span>
                            </TooltipTrigger>
                            <TooltipContent>Delete Template</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>Showing {advertisers.length} entries</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <span>1</span>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </div>
        <Dialog open={showImport} onOpenChange={setShowImport}>
          <DialogContent className="max-w-lg w-full border-2" style={{ borderColor: '#FAAE3A' }}>
            <DialogHeader>
              <DialogTitle>Import Template</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="font-semibold text-[#404042]">Copy From</div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">Advertiser:</label>
                <select className="border rounded px-2 py-1">
                  {advertisers.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <label className="text-sm">Template:</label>
                <select className="border rounded px-2 py-1">
                  <option value="">(Select template)</option>
                </select>
              </div>
              <div className="font-semibold text-[#404042] mt-2">To</div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">Advertiser:</label>
                <input className="border rounded px-2 py-1 bg-gray-100" value={advertiser?.name || ""} readOnly />
                <label className="text-sm">Google Ads Customer:</label>
                <select className="border rounded px-2 py-1">
                  <option value="">(Select customer)</option>
                </select>
                <label className="text-sm">New Template Name:</label>
                <input className="border rounded px-2 py-1" />
                <label className="text-sm">Google Ads Campaign:</label>
                <input className="border rounded px-2 py-1" />
              </div>
            </div>
            <DialogFooter className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setShowImport(false)}>Close</Button>
              <Button variant="default">Copy template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Dialog open={showCampaigns} onOpenChange={setShowCampaigns}>
        <DialogContent className="max-w-2xl w-full border-2" style={{ borderColor: '#FAAE3A' }}>
          <DialogHeader>
            <DialogTitle>Google Ads Campaigns for {advertiser?.name || ''}</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Customer ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Campaign Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Inclusion Label</th>
                  <th className="px-4 py-2 text-left font-semibold">Eligibility</th>
                </tr>
              </thead>
              <tbody>
                {/* No rows yet */}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="default" onClick={() => setShowCampaigns(false)}>OK</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 