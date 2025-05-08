import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, Search as SearchIcon, Grid, Copy, Trash2, AlertTriangle, Edit2, FileText } from "lucide-react";
import { useAdvertiserStore } from "../../store";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import type { Advertiser } from "@/types/advertiser";

export function SearchTemplates({ advertiser }: { advertiser: Advertiser }) {
  const advertisers = useAdvertiserStore(state => state.advertisers);
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
          0 Eligible campaigns - <span className="underline cursor-pointer text-[#2A6BE9]">Show Campaigns</span>
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
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Prebuild-Templates</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">Import Template</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Switch id="activeOnly" />
            <span className="text-sm font-medium text-[#404042]">Active Only</span>
          </div>
          <Button variant="outline" size="sm">Excel</Button>
          <Button variant="outline" size="sm">CSV</Button>
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
      </div>
    </div>
  );
} 