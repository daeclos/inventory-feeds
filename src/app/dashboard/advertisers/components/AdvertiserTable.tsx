"use client";

import { useState } from "react";
import { Advertiser } from "@/types/advertiser";
import { AdvertiserRow } from "./AdvertiserRow";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  data: Advertiser[];
}

type SortKey = keyof Advertiser;

function AdvertiserTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }

    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortAsc ? (
      <ChevronUp className="inline w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="inline w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="rounded-xl border bg-white shadow p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">Status</TableHead>
            <TableHead
              onClick={() => handleSort("name")}
              className="cursor-pointer"
            >
              Advertiser {renderSortIcon("name")}
            </TableHead>
            <TableHead className="text-left">Actions</TableHead>
            <TableHead
              onClick={() => handleSort("totalRecords")}
              className="cursor-pointer text-center"
            >
              Total Records {renderSortIcon("totalRecords")}
            </TableHead>
            <TableHead className="text-center">Last Update</TableHead>
            <TableHead className="text-center">History</TableHead>
            <TableHead className="text-center">Custom Feeds</TableHead>
            <TableHead className="text-center">Video Templates</TableHead>
            <TableHead className="text-center">Video Ad Versions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((advertiser, index) => (
              <AdvertiserRow key={index} advertiser={advertiser} />
            ))
          ) : (
            <TableRow>
              <td colSpan={9} className="text-center py-6 text-gray-500">
                No advertisers found.
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdvertiserTable;
