import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Alert } from "@/types/alerts";
import { getAlerts } from "@/services/alerts";

interface NotificationsProps {
  onAlertClick: (alert: Alert) => void;
}

export function Notifications({ onAlertClick }: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Actualizar notificaciones cada minuto
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getAlerts(
        {
          status: "open",
          severity: "critical"
        },
        1,
        5
      );
      setNotifications(response.data);
      setUnreadCount(response.data.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = (alert: Alert) => {
    onAlertClick(alert);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full p-4 border-b hover:bg-gray-50 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {notification.severity === "critical" ? (
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                      ) : (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {notification.subject}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.reported).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t">
              <button
                onClick={() => {
                  setNotifications([]);
                  setUnreadCount(0);
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 