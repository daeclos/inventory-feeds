"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AdvertiserGroup, FeedAd } from "../data/feeds";
import { Pencil, Eye, FileText, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import AddFeedModal from "./AddFeedModal";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Props {
  data: AdvertiserGroup[];
  /** callback opcional si quieres usar el modal general afuera */
  onAddGlobal?: (adv: string, feed: FeedAd) => void;
  showRowModal?: boolean; // default false
}

/**
 * Tabla principal con Advertisers y sus feeds.
 * El botón `+ Feed Subscription` se muestra solo si `showRowModal` es true.
 */
export default function CustomFeedsTable({ data, onAddGlobal, showRowModal = false }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [feeds, setFeeds] = useState<AdvertiserGroup[]>(data);

  // Expande / colapsa feeds de un advertiser
  const toggleExpand = (advertiser: string) =>
    setExpanded((prev) => ({ ...prev, [advertiser]: !prev[advertiser] }));

  // Elimina un feed de un advertiser
  const deleteFeed = (advertiser: string, feedId: string) =>
    setFeeds((prev) =>
      prev.map((g) =>
        g.advertiser === advertiser
          ? { ...g, ads: g.ads.filter((ad) => ad.id !== feedId) }
          : g
      )
    );

  // Agrega un feed a un advertiser (recibe un FeedAd completo)
  const addFeed = (advertiser: string, newFeed: FeedAd) => {
    const feed = newFeed.id ? newFeed : { ...newFeed, id: uuidv4() };
    setFeeds((prev) =>
      prev.map((g) =>
        g.advertiser === advertiser ? { ...g, ads: [...g.ads, feed] } : g
      )
    );
    onAddGlobal?.(advertiser, feed);
  };

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-3">Advertiser Name</TableHead>
            <TableHead className="p-3 text-right">Total Feed Records</TableHead>
            <TableHead className="p-3 text-right">No Price</TableHead>
            <TableHead className="p-3 text-right">No Image</TableHead>
            <TableHead className="p-3 text-right">Custom Feeds</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeds.map((group) => (
            <React.Fragment key={group.advertiser}>
              <TableRow className="border-t">
                <TableCell className="p-3 flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full inline-block ${
                      group.ads.some((ad) => ad.status)
                        ? "bg-[#FAAE3A]"
                        : "bg-gray-300"
                    }`}
                  />
                  {group.advertiser}
                </TableCell>
                <TableCell className="p-3 text-right">{group.totalRecords}</TableCell>
                <TableCell className="p-3 text-right">{group.noPrice}</TableCell>
                <TableCell className="p-3 text-right">{group.noImage}</TableCell>
                <TableCell
                  className="p-3 text-right cursor-pointer"
                  onClick={() => toggleExpand(group.advertiser)}
                >
                  {group.ads.length} <ChevronDown className="inline w-4 h-4 ml-1" />
                </TableCell>
              </TableRow>

              {expanded[group.advertiser] &&
                group.ads.map((ad) => (
                  <TableRow key={ad.id} className="border-t bg-gray-50">
                    <TableCell className="p-3 pl-8 font-semibold text-[#404042]">
                      {ad.name}
                      {showRowModal && (
                        <AddFeedModal
                          onAdd={addFeed}
                          advertisers={[group.advertiser]}
                        />
                      )}
                    </TableCell>
                    <TableCell className="p-3 text-right text-[#404042]" colSpan={3}></TableCell>
                    <TableCell className="p-3 text-right text-[#404042]">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="w-4 h-4 text-[#F17625]" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4 text-[#5B67F1]" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="w-4 h-4 text-[#9E85F1]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteFeed(group.advertiser, ad.id)}
                        >
                          <Trash className="w-4 h-4 text-[#F43F5E]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
