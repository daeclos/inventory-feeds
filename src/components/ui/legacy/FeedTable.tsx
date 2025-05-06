"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Feed {
  id: string;
  name: string;
  sourceUrl: string;
  lastSynced: string;
  active: boolean;
}

interface FeedTableProps {
  feeds: Feed[];
}

const FeedTable = ({ feeds }: FeedTableProps) => {
  return (
    <div className="rounded-md border border-gray-200 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#404042] hover:bg-[#404042] text-white">
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Source URL</TableHead>
            <TableHead className="text-white">Last Synced</TableHead>
            <TableHead className="text-white">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeds.map((feed) => (
            <TableRow key={feed.id}>
              <TableCell>{feed.name}</TableCell>
              <TableCell className="truncate max-w-[250px]">
                <a
                  href={feed.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {feed.sourceUrl}
                </a>
              </TableCell>
              <TableCell>{feed.lastSynced}</TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    feed.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {feed.active ? "Active" : "Inactive"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeedTable;
