"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { FeedAd } from "../data/feeds";

interface AddFeedModalProps {
  onAdd: (advertiser: string, feed: FeedAd) => void;
  advertisers: string[];
}

export default function AddFeedModal({ onAdd, advertisers }: AddFeedModalProps) {
  const [open, setOpen] = useState(false);
  const [advertiser, setAdvertiser] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<FeedAd["type"]>("Default");
  const [format, setFormat] = useState<FeedAd["format"]>("Google Ads");

  const isValid = advertiser !== "" && name.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd(advertiser, {
      id: "",
      name,
      type,
      format,
      status: true,
      lastUpdate: new Date().toISOString().slice(0, 10),
    });
    setOpen(false);
    setAdvertiser("");
    setName("");
    setType("Default");
    setFormat("Google Ads");
  };

  return (
    <>
      <Button
        className="bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625]"
        onClick={() => setOpen(true)}
      >
        + Feed Subscription
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#404042]">
              New Feed Subscription
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1">
              <Label>Advertiser</Label>
              <Select
                value={advertiser}
                onValueChange={(value) => setAdvertiser(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select advertiser" />
                </SelectTrigger>
                <SelectContent>
                  {advertisers.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label>Feed Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter feed name"
              />
            </div>

            <div className="grid gap-1">
              <Label>Feed Type</Label>
              <Select value={type} onValueChange={(v: FeedAd["type"]) => setType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">Default</SelectItem>
                  <SelectItem value="Extended">Extended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label>Feed Format</Label>
              <Select
                value={format}
                onValueChange={(v: FeedAd["format"]) => setFormat(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Bing">Bing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!isValid}>
                Next
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
