export interface AuditLogItem {
  id: string;
  userId?: string | null;
  username: string;
  userRole?: string | null;
  action: string;
  entityName?: string | null;
  entityId?: string | null;
  oldValues?: string | null;
  newValues?: string | null;
  httpMethod: string;
  path: string;
  statusCode: number;
  isSuccess: boolean;
  executionDurationMs: number;
  ipAddress?: string | null;
  userAgent?: string | null;
  payload?: string | null;
  errorMessage?: string | null;
  category?: string;
  timestamp: string;
  createdAt?: string;
}

export interface AuditLogPageResponse {
  items: AuditLogItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface AuditLogFilterState {
  search: string;
  action: string;
  httpMethod: string;
  statusCode: string;
  isSuccess: string;
  username: string;
  fromDate: string;
  toDate: string;
}
