"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";

interface AdvertiserFeed {
  advertiser: string;
  totalRecords: number;
  noPrice: number;
  noImage: number;
  customFeeds: number;
}

export default function SubscribedFeedsTable({
  rows,
}: {
  rows: AdvertiserFeed[];
}) {
  return (
    <div className="rounded-md border border-gray-200 overflow-auto bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#404042] text-white">
            <TableHead className="text-white">Advertiser Name</TableHead>
            <TableHead className="text-white text-right">Total Feed Records</TableHead>
            <TableHead className="text-white text-right">No Price</TableHead>
            <TableHead className="text-white text-right">No Image</TableHead>
            <TableHead className="text-white text-right">Custom Feeds</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} className="hover:bg-gray-100">
              <TableCell className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                {row.advertiser}
              </TableCell>
              <TableCell className="text-right">{row.totalRecords}</TableCell>
              <TableCell className="text-right">{row.noPrice}</TableCell>
              <TableCell className="text-right">{row.noImage}</TableCell>
              <TableCell className="text-right">
                {row.customFeeds} <ChevronDown className="inline w-4 h-4 ml-1" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
