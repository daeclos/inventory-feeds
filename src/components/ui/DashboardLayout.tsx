"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import Topbar from "./Topbar";
import { ToastProvider } from "@/components/ui/use-toast";
import { useSidebarStore } from "@/lib/store/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { expanded } = useSidebarStore();
  return (
    <div className="flex min-h-screen">
      <div className="fixed h-screen">
        <Sidebar />
      </div>
      <div className={`flex flex-col flex-1 transition-all duration-300 ${expanded ? 'ml-64' : 'ml-20'}`}>
        <div className={`fixed z-30 transition-all duration-300 ${expanded ? 'w-[calc(100%-16rem)]' : 'w-[calc(100%-5rem)]'}`}>
          <Topbar onAlertClick={() => {}} />
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
