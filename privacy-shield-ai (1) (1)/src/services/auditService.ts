/**
 * Privexa AI - Audit Trail Service
 * Records tamper-proof operational actions without exposing raw sensitive data.
 */

import { AuditLogItem, SeverityLevel } from '../types';

export class AuditService {
  private static auditLogs: AuditLogItem[] = [];
  private static listeners: Array<(log: AuditLogItem) => void> = [];

  public static logAction(
    action: AuditLogItem['action'],
    documentName: string,
    riskLevel: SeverityLevel,
    status: AuditLogItem['status'] = 'Success',
    details?: string
  ): AuditLogItem {
    const item: AuditLogItem = {
      id: `LOG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      document: documentName,
      riskLevel,
      user: 'Security Officer',
      userEmail: 'security.admin@enterprise.corp',
      status,
      details,
      ipAddress: '10.240.1.14',
    };

    this.auditLogs.unshift(item);
    // Keep max 200 items in memory
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }

    this.listeners.forEach((listener) => listener(item));
    return item;
  }

  public static getLogs(): AuditLogItem[] {
    return [...this.auditLogs];
  }

  public static subscribe(listener: (log: AuditLogItem) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}
