"use client";

import { useState, useEffect } from "react";
import { Alert, AlertFilters } from "@/types/alerts";
import { getAlerts, updateAlertStatus } from "@/services/alerts";
import { AlertDetailModal } from "./AlertDetailModal";
import { Search, Filter, AlertCircle, AlertTriangle, Clock, User } from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<AlertFilters>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, [page, filters, search]);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const response = await getAlerts(
        {
          ...filters,
          search: search || undefined
        },
        page,
        10
      );
      setAlerts(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (alertId: string, newStatus: "open" | "reviewed" | "resolved") => {
    try {
      const updatedAlert = await updateAlertStatus(alertId, newStatus);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? updatedAlert : alert
      ));
      if (selectedAlert?.id === alertId) {
        setSelectedAlert(updatedAlert);
      }
    } catch (error) {
      console.error("Error updating alert status:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "deactivation":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "own_action":
        return <User className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onAlertClick={handleAlertClick} />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#404042' }}>Alerts Report</h2>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.type || ""}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as any || undefined })}
                >
                  <option value="">All Types</option>
                  <option value="error">Error Alerts</option>
                  <option value="warning">Warning Alerts</option>
                  <option value="deactivation">Deactivation Alerts</option>
                  <option value="own_action">Own Action Alerts</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Advertiser
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : alerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      No alerts found
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <tr
                      key={alert.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleAlertClick(alert)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(alert.type)}
                          <span className="ml-2">{alert.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alert.advertiser}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{alert.subject}</div>
                        <div className="text-sm text-gray-500">{alert.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            alert.status === "open"
                              ? "bg-yellow-100 text-yellow-800"
                              : alert.status === "reviewed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                          value={alert.status}
                          onChange={(e) => handleStatusChange(alert.id, e.target.value as any)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="open">Open</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(alert.reported).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          {selectedAlert && (
            <AlertDetailModal
              alert={selectedAlert}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onStatusChange={handleStatusChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}
