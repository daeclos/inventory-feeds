"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddFeedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFeed: (feed: {
    name: string;
    sourceUrl: string;
    lastSynced: string;
    active: boolean;
  }) => void;
}

export default function AddFeedModal({
  open,
  onOpenChange,
  onAddFeed,
}: AddFeedModalProps) {
  const [name, setName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const handleSubmit = () => {
    if (!name || !sourceUrl) return;

    onAddFeed({
      name,
      sourceUrl,
      lastSynced: new Date().toISOString().split("T")[0],
      active: true,
    });

    setName("");
    setSourceUrl("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#404042] text-xl">
            Add New Feed
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1">
            <Label htmlFor="feed-name" className="text-left">
              Feed Name
            </Label>
            <Input
              id="feed-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vehicles Feed"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="feed-url" className="text-left">
              Feed URL
            </Label>
            <Input
              id="feed-url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com/feed.json"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625]"
          >
            Save Feed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
