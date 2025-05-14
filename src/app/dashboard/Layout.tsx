"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";
import { Alert } from "@/types/alerts";
import { AlertDetailModal } from "./alerts/AlertDetailModal";
import { updateAlertStatus } from "@/services/alerts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsAlertModalOpen(true);
  };

  const handleStatusChange = async (alertId: string, newStatus: "open" | "reviewed" | "resolved") => {
    try {
      const updatedAlert = await updateAlertStatus(alertId, newStatus);
      setSelectedAlert(updatedAlert);
    } catch (error) {
      console.error("Error updating alert status:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onAlertClick={handleAlertClick} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>

      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
