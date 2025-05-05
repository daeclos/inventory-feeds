"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";
import { Toaster } from "react-hot-toast"; // 👈 Importa aquí

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6">
          {children}
        </main>
        <Toaster position="top-right" /> {/* 👈 Agrega esto aquí */}
      </div>
    </div>
  );
}
