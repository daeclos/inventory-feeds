// Tipos de alertas
export type AlertType = "error" | "warning" | "deactivation" | "own_action";
export type AlertSeverity = "info" | "warning" | "critical";
export type AlertStatus = "open" | "reviewed" | "resolved";

// Interfaz base para las alertas
export interface Alert {
  id: string;
  advertiser: string;
  advertiserId: string;
  reported: string;
  updated: string;
  subject: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  source: string;
  description: string;
  possible_causes?: string[];
  recommended_action?: string;
  user_id?: string;
  video_id?: string;
  deactivation_date?: string;
  alert_type?: string;
  timestamp_created?: string;
  timestamp_updated?: string;
}

// Interfaz para los filtros de alertas
export interface AlertFilters {
  type?: AlertType;
  severity?: AlertSeverity;
  status?: AlertStatus;
  search?: string;
  advertiserId?: string;
  userId?: string;
  videoId?: string;
  startDate?: string;
  endDate?: string;
}

// Interfaz para la respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 