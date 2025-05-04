"use client";

import DashboardLayout from "@/components/ui/DashboardLayout";
import { Button } from "@/components/ui/button";

export default function CustomFeedsPage() {
  return (
    <DashboardLayout>
      <div className="text-[#404042]">
        <h1 className="text-2xl font-bold text-[#404042] mb-4">Subscribed Feeds per Advertiser</h1>
        <div className="flex gap-2 mb-4">
          <Button className="bg-[#404042] text-white text-xs px-3 py-1">+ Feed Subscription</Button>
          <Button className="bg-[#404042] text-white text-xs px-3 py-1">Product Alias</Button>
          <Button className="bg-[#404042] text-white text-xs px-3 py-1 ml-auto">Agency Feeds</Button>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-[#404042] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Advertiser</th>
                <th className="px-4 py-2 text-left">Feed Name</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[#404042]">
              <tr>
                <td className="px-4 py-2">Ejemplo Corp</td>
                <td className="px-4 py-2">Main Inventory</td>
                <td className="px-4 py-2">Active</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Marketing Plus</td>
                <td className="px-4 py-2">Seasonal Campaign</td>
                <td className="px-4 py-2">Paused</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
