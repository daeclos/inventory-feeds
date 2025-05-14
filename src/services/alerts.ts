import { Alert, AlertFilters, AlertStatus, PaginatedResponse } from "@/types/alerts";

// Tipos de alertas
export type AlertType = "error" | "warning" | "deactivation" | "own_action";
export type AlertSeverity = "info" | "warning" | "critical";

// Función para obtener alertas con filtros y paginación
export async function getAlerts(
  filters: AlertFilters = {},
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Alert>> {
  try {
    // Aquí iría la llamada real a la API
    // Por ahora retornamos datos mock
    const mockAlerts: Alert[] = [
      {
        id: "1",
        advertiser: "Fountain Hub",
        advertiserId: "14222",
        reported: "2024-03-20 10:00:00",
        updated: "2024-03-20 10:00:00",
        subject: "No eligible campaigns in Google Ads",
        type: "error",
        severity: "critical",
        status: "open",
        source: "Google Ads API",
        description: "No eligible campaigns in Google Ads for Fountain Hub!",
        possible_causes: [
          "No campaigns are active in Google Ads.",
          "Budget is missing or exhausted.",
          "Integration error with Google Ads account."
        ],
        recommended_action: "Check your Google Ads account and ensure at least one campaign is active and eligible."
      },
      {
        id: "2",
        advertiser: "Auto Group",
        advertiserId: "14223",
        reported: "2024-03-20 09:00:00",
        updated: "2024-03-20 09:00:00",
        subject: "Video Ad approaching deactivation",
        type: "deactivation",
        severity: "warning",
        status: "open",
        source: "Video Ads System",
        description: "Video Ad will be deactivated in 3 days",
        deactivation_date: "2024-03-23 09:00:00"
      }
    ];

    // Aplicar filtros
    let filteredAlerts = mockAlerts;
    if (filters.type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === filters.type);
    }
    if (filters.severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity);
    }
    if (filters.status) {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredAlerts = filteredAlerts.filter(alert =>
        alert.advertiser.toLowerCase().includes(searchLower) ||
        alert.subject.toLowerCase().includes(searchLower) ||
        alert.description.toLowerCase().includes(searchLower)
      );
    }
    if (filters.advertiserId) {
      filteredAlerts = filteredAlerts.filter(alert => alert.advertiserId === filters.advertiserId);
    }
    if (filters.userId) {
      filteredAlerts = filteredAlerts.filter(alert => alert.user_id === filters.userId);
    }
    if (filters.videoId) {
      filteredAlerts = filteredAlerts.filter(alert => alert.video_id === filters.videoId);
    }

    // Aplicar paginación
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedAlerts = filteredAlerts.slice(start, end);

    return {
      data: paginatedAlerts,
      total: filteredAlerts.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredAlerts.length / pageSize)
    };
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
}

// Función para obtener una alerta específica
export async function getAlert(id: string): Promise<Alert> {
  try {
    // Aquí iría la llamada real a la API
    // Por ahora retornamos un mock
    const mockAlert: Alert = {
      id,
      advertiser: "Fountain Hub",
      advertiserId: "14222",
      reported: "2024-03-20 10:00:00",
      updated: "2024-03-20 10:00:00",
      subject: "No eligible campaigns in Google Ads",
      type: "error",
      severity: "critical",
      status: "open",
      source: "Google Ads API",
      description: "No eligible campaigns in Google Ads for Fountain Hub!",
      possible_causes: [
        "No campaigns are active in Google Ads.",
        "Budget is missing or exhausted.",
        "Integration error with Google Ads account."
      ],
      recommended_action: "Check your Google Ads account and ensure at least one campaign is active and eligible."
    };

    return mockAlert;
  } catch (error) {
    console.error("Error fetching alert:", error);
    throw error;
  }
}

// Función para actualizar el estado de una alerta
export async function updateAlertStatus(id: string, status: AlertStatus): Promise<Alert> {
  try {
    // Aquí iría la llamada real a la API
    // Por ahora retornamos un mock
    const mockAlert: Alert = {
      id,
      advertiser: "Fountain Hub",
      advertiserId: "14222",
      reported: "2024-03-20 10:00:00",
      updated: new Date().toISOString(),
      subject: "No eligible campaigns in Google Ads",
      type: "error",
      severity: "critical",
      status,
      source: "Google Ads API",
      description: "No eligible campaigns in Google Ads for Fountain Hub!",
      possible_causes: [
        "No campaigns are active in Google Ads.",
        "Budget is missing or exhausted.",
        "Integration error with Google Ads account."
      ],
      recommended_action: "Check your Google Ads account and ensure at least one campaign is active and eligible."
    };

    return mockAlert;
  } catch (error) {
    console.error("Error updating alert status:", error);
    throw error;
  }
}

// Función para crear una nueva alerta
export async function createAlert(alert: Omit<Alert, "id" | "reported" | "updated">): Promise<Alert> {
  try {
    // Aquí iría la llamada real a la API
    // Por ahora retornamos un mock
    const now = new Date().toISOString();
    const mockAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      reported: now,
      updated: now
    };

    return mockAlert;
  } catch (error) {
    console.error("Error creating alert:", error);
    throw error;
  }
}

// Función para eliminar una alerta
export async function deleteAlert(id: string): Promise<void> {
  try {
    // Aquí iría la llamada real a la API
    console.log("Alert deleted:", id);
  } catch (error) {
    console.error("Error deleting alert:", error);
    throw error;
  }
} 