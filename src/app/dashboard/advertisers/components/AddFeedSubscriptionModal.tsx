"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AddFeedSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFeedSubscriptionModal({ open, onOpenChange }: AddFeedSubscriptionModalProps) {
  const [feedName, setFeedName] = React.useState("");
  const [feedType, setFeedType] = React.useState("Default");
  const [feedFormat, setFeedFormat] = React.useState("Google Ads");
  const [advertiser, setAdvertiser] = React.useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] p-0">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#404042' }}>New Feed Subscription</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold text-[#404042] mb-1">Feed Name</label>
              <Input
                value={feedName}
                onChange={e => setFeedName(e.target.value)}
                placeholder="Feed Name"
                className="border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#404042] mb-1">Feed Type</label>
              <select
                value={feedType}
                onChange={e => setFeedType(e.target.value)}
                className="border border-gray-300 rounded w-full px-2 py-2"
              >
                <option value="Default">Default</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#404042] mb-1">Feed Format</label>
              <select
                value={feedFormat}
                onChange={e => setFeedFormat(e.target.value)}
                className="border border-gray-300 rounded w-full px-2 py-2"
              >
                <option value="Google Ads">Google Ads</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#404042] mb-1">Advertisers</label>
              <select
                value={advertiser}
                onChange={e => setAdvertiser(e.target.value)}
                className="border border-gray-300 rounded w-full px-2 py-2"
              >
                <option value="">Select advertiser</option>
                <option value="1">Advertiser 1</option>
                <option value="2">Advertiser 2</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button
              className="px-5 py-2 rounded bg-[#F17625] text-white font-semibold hover:bg-[#FAAE3A] transition"
              onClick={() => onOpenChange(false)}
            >Cancel</button>
            <button
              className="px-5 py-2 rounded bg-[#404042] text-white font-semibold hover:bg-[#FAAE3A] transition"
              onClick={() => {/* TODO: Siguiente paso */}}
            >Next</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 