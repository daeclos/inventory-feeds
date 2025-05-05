// ✅ Simulated advertiser list with add function via "+Advertiser" button
"use client";

import { useState } from "react";
import {
  Settings,
  Search,
  Users,
  Rss,
  FileText,
  Info,
} from "lucide-react";

export default function AdvertiserTableSim() {
  const [advertisers, setAdvertisers] = useState([
    {
      name: "Alliance Auto Group LTD",
      totalFeeds: 211,
      lastUpdate: "05/04/2025 12:12 AM",
      history: "73 days",
      customFeeds: 5,
      videoTemplates: 0,
      videoAdVersions: 0,
      actions: {
        settings: true,
        search: true,
        users: true,
        rss: true,
        file: false,
        info: false,
      },
    },
  ]);

  const handleAddAdvertiser = () => {
    const newAdvertiser = {
      name: "New Advertiser",
      totalFeeds: 100,
      lastUpdate: new Date().toLocaleString(),
      history: "0 days",
      customFeeds: 0,
      videoTemplates: 0,
      videoAdVersions: 0,
      actions: {
        settings: true,
        search: false,
        users: false,
        rss: true,
        file: false,
        info: false,
      },
    };
    setAdvertisers((prev) => [...prev, newAdvertiser]);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#404042]">Advertisers</h2>
        <button
          onClick={handleAddAdvertiser}
          className="px-4 py-2 bg-[#404042] text-white font-bold rounded hover:bg-[#FAAE3A] active:bg-[#F17625] transition"
        >
          + Advertiser
        </button>
      </div>

      <table className="min-w-full table-auto text-sm">
        <thead className="bg-white border-b border-gray-200">
          <tr className="text-left text-[#404042] font-bold">
            <th className="px-4 py-2">Advertiser Name</th>
            <th className="px-4 py-2">Total Feed Records</th>
            <th className="px-4 py-2">Last Update</th>
            <th className="px-4 py-2">History</th>
            <th className="px-4 py-2">Custom Feeds</th>
            <th className="px-4 py-2">Video Templates</th>
            <th className="px-4 py-2">Video Ad Versions</th>
          </tr>
        </thead>
        <tbody className="text-[#404042]">
          {advertisers.map((adv, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
              <td className="px-4 py-3">
                <div className="font-semibold">{adv.name}</div>
                <div className="flex gap-2 mt-1">
                  <Settings size={16} className={adv.actions.settings ? "text-[#FAAE3A]" : "text-gray-400"} />
                  <Search size={16} className={adv.actions.search ? "text-[#FAAE3A]" : "text-gray-400"} />
                  <Users size={16} className={adv.actions.users ? "text-[#FAAE3A]" : "text-gray-400"} />
                  <Rss size={16} className={adv.actions.rss ? "text-[#FAAE3A]" : "text-gray-400"} />
                  <FileText size={16} className={adv.actions.file ? "text-[#FAAE3A]" : "text-gray-400"} />
                  <Info size={16} className={adv.actions.info ? "text-[#FAAE3A]" : "text-gray-400"} />
                </div>
              </td>
              <td className="px-4 py-3">{adv.totalFeeds}</td>
              <td className="px-4 py-3">{adv.lastUpdate}</td>
              <td className="px-4 py-3">{adv.history}</td>
              <td className="px-4 py-3">{adv.customFeeds}</td>
              <td className="px-4 py-3">{adv.videoTemplates}</td>
              <td className="px-4 py-3">{adv.videoAdVersions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
