"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";

const FEED_FORMATS = [
  "GMB Cars For Sale",
  "Google VLA",
  "MSN Auto",
  "Fluency VLA",
  "Internal"
];

export default function NewAgencyFeedPage() {
  const [name, setName] = useState("");
  const [format, setFormat] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el feed
    alert(`Created: ${name} (${format})`);
    router.push("/dashboard/feeds/agency-feeds");
  };

  return (
    <div className="flex min-h-screen bg-[#f7f7f9] font-geist">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onAlertClick={() => {}} />
        <main className="max-w-3xl mx-auto bg-white rounded shadow p-8 mt-8 w-full">
          <h2 className="text-2xl font-bold text-[#FAAE3A] mb-6">New Agency Feed</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label className="md:w-1/3 font-semibold text-[#404042] mb-2 md:mb-0">Agency Feed Name</label>
              <input
                className="flex-1 border border-[#FAAE3A] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FAAE3A] text-[#404042]"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label className="md:w-1/3 font-semibold text-[#404042] mb-2 md:mb-0">Agency Feed Format</label>
              <select
                className="flex-1 border border-[#FAAE3A] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FAAE3A] text-[#404042]"
                value={format}
                onChange={e => setFormat(e.target.value)}
                required
              >
                <option value="" disabled>Select format</option>
                {FEED_FORMATS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-center">
              <Button type="submit" className="bg-[#FAAE3A] hover:bg-[#F17625] text-[#404042] font-semibold">Submit</Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
} 