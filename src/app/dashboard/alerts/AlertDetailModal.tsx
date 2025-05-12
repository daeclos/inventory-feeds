"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

interface AlertDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: AlertDetail | null;
}

const severityColors = {
  info: "text-[#404042]",
  warning: "text-[#FAAE3A]",
  critical: "text-[#F17625] font-bold",
};

export function AlertDetailModal({ open, onOpenChange, alert }: AlertDetailModalProps) {
  const [reply, setReply] = React.useState("");
  if (!alert) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-full p-0">
        <DialogTitle>Alert detail</DialogTitle>
        <div className="border-b px-6 py-4 bg-[#F5F6FA] rounded-t-lg">
          <h2 className="text-lg font-bold text-[#404042]">Alert detail</h2>
        </div>
        <div className="px-6 py-4">
          <div className="mb-2 flex flex-col gap-1">
            <div><span className="font-semibold text-[#404042]">Subject:</span> {alert.description}</div>
            <div><span className="font-semibold text-[#404042]">Advertiser:</span> {alert.advertiser}</div>
          </div>
          <div className="mb-4">
            <span className="font-semibold text-[#404042]">Message</span>
            <div className="my-2 flex flex-col items-center">
              <span className="text-2xl font-bold tracking-wide text-[#404042]">FOUNTAIN HUB</span>
              <span className="block text-center text-[18px] font-bold text-[#F17625] mt-2 mb-1">ERROR : No eligible campaigns in Google Ads for Fountain Hub management!</span>
              <span className="block text-xs text-[#404042] mb-2">Advertiser: 14222, {alert.advertiser}</span>
            </div>
            <div className="text-sm text-[#404042] mb-2">
              Fountain Hub is unable to make updates to dynamic search campaigns because there are not eligible campaigns.<br />
              You can view a list of campaigns and the reason they are ineligible from within Advertiser Settings.<br />
              If you need further assistance to resolve this issue, please contact support.<br />
              <br />
              Once one or more campaigns have been made eligible, the dynamic campaigns will automatically be updated during the next nightly update process.<br />
              If you would like them updated sooner, please request a mid-day update from support.<br />
              <br />
              Email <a href="mailto:support@fountainhub.com" className="text-[#FAAE3A] underline">support@fountainhub.com</a> or reply to this email to contact support.<br />
              Thank you for your attention to this issue.
            </div>
          </div>
          <div className="mb-4">
            <span className="font-semibold text-[#404042]">Reply</span>
            <textarea
              className="w-full min-h-[70px] p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#FAAE3A]"
              placeholder="Write a reply..."
              value={reply}
              onChange={e => setReply(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="px-4 py-2 rounded bg-gray-300 text-[#404042] font-semibold hover:bg-gray-400 transition"
              onClick={() => onOpenChange(false)}
            >Close</button>
            <button
              className="px-4 py-2 rounded bg-[#FAAE3A] text-white font-semibold hover:bg-[#F17625] transition"
              onClick={() => { window.alert('Alert marked to review!'); onOpenChange(false); }}
            >Mark alert to review</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 