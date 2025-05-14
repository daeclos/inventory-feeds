"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertCircle, AlertTriangle, Clock, User, X } from "lucide-react";
import { Alert } from "@/types/alerts";

interface AlertDetailModalProps {
  alert: Alert;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (alertId: string, status: "open" | "reviewed" | "resolved") => void;
}

export function AlertDetailModal({ alert, isOpen, onClose, onStatusChange }: AlertDetailModalProps) {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            {getTypeIcon(alert.type)}
            <h2 className="text-xl font-semibold">{alert.subject}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Advertiser</p>
            <p className="font-medium">{alert.advertiser}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <select
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                alert.status === "open"
                  ? "bg-yellow-100 text-yellow-800"
                  : alert.status === "reviewed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
              value={alert.status}
              onChange={(e) => onStatusChange(alert.id, e.target.value as any)}
            >
              <option value="open">Open</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <p className="text-sm text-gray-500">Severity</p>
            <p className={`font-medium ${getSeverityColor(alert.severity)}`}>
              {alert.severity}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Source</p>
            <p className="font-medium">{alert.source}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Reported</p>
            <p className="font-medium">{new Date(alert.reported).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">{new Date(alert.updated).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Description</p>
          <p className="text-gray-700">{alert.description}</p>
        </div>

        {alert.possible_causes && alert.possible_causes.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Possible Causes</p>
            <ul className="list-disc list-inside text-gray-700">
              {alert.possible_causes.map((cause, index) => (
                <li key={index}>{cause}</li>
              ))}
            </ul>
          </div>
        )}

        {alert.recommended_action && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Recommended Action</p>
            <p className="text-gray-700">{alert.recommended_action}</p>
          </div>
        )}

        {alert.deactivation_date && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Deactivation Date</p>
            <p className="text-gray-700">{new Date(alert.deactivation_date).toLocaleString()}</p>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => onStatusChange(alert.id, "reviewed")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Mark as Reviewed
          </button>
        </div>
      </div>
    </div>
  );
} 