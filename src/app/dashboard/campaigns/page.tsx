// app/dashboard/campaigns/page.tsx
"use client";

import DashboardLayout from "@/components/ui/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function CampaignBuilderPage() {
  return (
    <DashboardLayout>
      <div className="text-[#404042]">
        <h1 className="text-2xl font-bold text-[#404042] mb-4">Search Templates</h1>

        <div className="flex gap-2 mb-4">
          <Button className="bg-[#404042] text-white text-xs px-3 py-1">Auto-Templates</Button>
          <Button className="bg-[#404042] text-white text-xs px-3 py-1">Prebuild-Templates</Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">Active Only</span>
          <Switch defaultChecked />
          <Button className="bg-[#404042] text-white text-xs px-3 py-1">Excel</Button>
          <Button className="bg-[#404042] text-white text-xs px-3 py-1">CSV</Button>
        </div>

        <p className="text-sm mt-2">
          Showing 1 to 25 of entries (filtered)
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-[#404042] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Template</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[#404042]">
              <tr>
                <td className="px-4 py-2">Template A</td>
                <td className="px-4 py-2">Active</td>
                <td className="px-4 py-2">Auto</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Template B</td>
                <td className="px-4 py-2">Inactive</td>
                <td className="px-4 py-2">Prebuild</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
