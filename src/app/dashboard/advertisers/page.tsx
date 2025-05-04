"use client";

import DashboardLayout from "@/components/ui/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AdvertisersPage() {
  const [tab, setTab] = useState("step1");

  return (
    <DashboardLayout>
      <div className="text-[#404042]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#404042]">Advertiser Dashboard</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#404042] text-white hover:bg-[#333]">+ Advertiser</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-center">Add Advertiser</DialogTitle>
              </DialogHeader>

              <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="step1">1</TabsTrigger>
                  <TabsTrigger value="step2">2</TabsTrigger>
                  <TabsTrigger value="step3">3</TabsTrigger>
                  <TabsTrigger value="step4">4</TabsTrigger>
                  <TabsTrigger value="step5">5</TabsTrigger>
                </TabsList>

                <TabsContent value="step1">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Name</Label><Input placeholder="Name" /></div>
                    <div><Label>Advertiser DBA</Label><Input placeholder="Advertiser DBA" /></div>
                    <div><Label>Status</Label><Input placeholder="Status" /></div>
                    <div><Label>Website</Label><Input placeholder="http://yourwebsite.com" /></div>
                    <div><Label>Country</Label><Input placeholder="Country" /></div>
                    <div><Label>Address</Label><Input placeholder="Address" /></div>
                    <div><Label>City</Label><Input placeholder="City" /></div>
                    <div><Label>State</Label><Input placeholder="State" /></div>
                    <div><Label>ZIP</Label><Input placeholder="ZIP" /></div>
                    <div><Label>Advertiser Phone</Label><Input placeholder="Phone" /></div>
                    <div><Label>GMB Store Code</Label><Input placeholder="Store Code" /></div>
                    <div><Label>Google Place ID</Label><Input placeholder="Place ID" /></div>
                    <div><Label>Category</Label><Input placeholder="Category" /></div>
                    <div><Label>Responsible Users</Label><Input placeholder="User Name" /></div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => setTab("step2")}>Next</Button>
                  </div>
                </TabsContent>

                <TabsContent value="step2">
                  <div className="grid gap-4">
                    <Label>Features</Label>
                    <Input placeholder="Feature 1" />
                    <Input placeholder="Feature 2" />
                    <Input placeholder="Feature 3" />
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => setTab("step1")}>Back</Button>
                    <Button onClick={() => setTab("step3")}>Next</Button>
                  </div>
                </TabsContent>

                <TabsContent value="step3">
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    Dynamic Display Feeds (contenido futuro)
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => setTab("step2")}>Back</Button>
                    <Button onClick={() => setTab("step4")}>Next</Button>
                  </div>
                </TabsContent>

                <TabsContent value="step4">
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    Google Ads Integration (contenido futuro)
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => setTab("step3")}>Back</Button>
                    <Button onClick={() => setTab("step5")}>Next</Button>
                  </div>
                </TabsContent>

                <TabsContent value="step5">
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    Special Requests (contenido futuro)
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => setTab("step4")}>Back</Button>
                    <Button>Submit</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-sm mt-2">
          Showing 1 to 50 of entries (filtered from total entries)
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-[#404042] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Website</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[#404042]">
              <tr>
                <td className="px-4 py-2">Ejemplo Corp</td>
                <td className="px-4 py-2">Active</td>
                <td className="px-4 py-2">ejemplo.com</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Marketing Plus</td>
                <td className="px-4 py-2">Paused</td>
                <td className="px-4 py-2">marketingplus.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
