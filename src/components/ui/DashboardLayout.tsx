"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import Topbar from "./Topbar";
import { ToastProvider } from "@/components/ui/use-toast";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="fixed h-screen">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 ml-64">
        <div className="fixed w-[calc(100%-16rem)] z-30">
          <Topbar />
        </div>
        <ToastProvider>
          <main className="flex-1 overflow-y-auto mt-20">
            {children}
          </main>
        </ToastProvider>
      </div>
    </div>
  );
}
