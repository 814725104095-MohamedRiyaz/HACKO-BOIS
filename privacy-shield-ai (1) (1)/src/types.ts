/**
 * Privexa AI - Enterprise Sensitive Data Detection & Secure Sharing System
 * Core Data Models and Type Definitions
 */

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type EntityCategory =
  | 'person'
  | 'email'
  | 'phone'
  | 'address'
  | 'financial'
  | 'identifier'
  | 'credential'
  | 'health'
  | 'confidential'
  | 'other';

export interface DetectedEntity {
  id: string;
  category: EntityCategory;
  name: string;
  originalText: string;
  maskedToken: string;
  startIndex: number;
  endIndex: number;
  confidence: number; // 0.0 to 1.0
  severity: SeverityLevel;
  explanation: string;
}

export interface RiskBreakdown {
  financial: number; // percentage 0 - 100
  governmentId: number;
  personalInfo: number;
  contactInfo: number;
  credentials?: number;
  other: number;
}

export type PolicyAction = 'ALLOW' | 'WARN' | 'SANITIZE' | 'BLOCK';

export interface DocumentScanResult {
  id: string;
  fileName: string;
  fileSize: number; // bytes
  fileType: string;
  scannedAt: string; // ISO string
  rawText: string;
  sanitizedText: string;
  privacyScore: number; // 0 - 100
  riskScore: number; // 0 - 100
  riskLevel: SeverityLevel;
  exposureToAi: number; // 0%
  entities: DetectedEntity[];
  entityCounts: Record<EntityCategory, number>;
  riskBreakdown: RiskBreakdown;
  keyFindings: string[];
  recommendations: string[];
  status: 'scanning' | 'complete' | 'failed' | 'quarantined';
  tokenMap: Record<string, string>; // original -> token
  reverseTokenMap: Record<string, string>; // token -> original
  aiAnalysisOutput?: string;
  shareStatus?: 'private' | 'share_pending_approval' | 'shared_securely' | 'revoked';

  // Enhanced Document Processing Pipeline Fields
  originalFileName?: string;
  maskedFileName?: string;
  originalMimeType?: string;
  maskedMimeType?: string;
  maskedFileId?: string;
  maskedFileUrl?: string;
  maskedBase64Data?: string;
  originalBase64Data?: string;
  sanitizationVerified?: boolean;
  remainingSensitiveEntities?: number;
  protectedEntityCount?: number;
  sanitizationStatus?: 'verified' | 'failed' | 'quarantined' | 'clean' | 'unsupported';
  policyAction?: PolicyAction;
  verificationScanId?: string;
  isUnsupportedFormat?: boolean;
  formatSupportMessage?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action:
    | 'Document Uploaded'
    | 'Document Parsed'
    | 'PII Detected'
    | 'Risk Assessment Completed'
    | 'Sanitization Started'
    | 'Sanitization Completed'
    | 'Verification Passed'
    | 'Verification Failed'
    | 'Masked Document Generated'
    | 'Masked Document Downloaded'
    | 'Sanitized Document Sent to AI'
    | 'AI Request Blocked'
    | 'Document Quarantined'
    | 'AI Analysis'
    | 'Masking Applied'
    | 'Report Generated'
    | 'Secure Share Requested'
    | 'Share Approved'
    | 'Share Rejected'
    | 'Policy Updated';
  document: string;
  riskLevel: SeverityLevel;
  user: string;
  userEmail: string;
  status: 'Success' | 'Warning' | 'Blocked';
  details?: string;
  ipAddress?: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  category: EntityCategory;
  description: string;
  enabled: boolean;
  severity: SeverityLevel;
  minConfidence: number;
  regexPattern?: string;
  action: 'mask' | 'block' | 'quarantine' | 'notify';
}

export interface SystemSettings {
  accountName: string;
  email: string;
  role: string;
  twoFactorAuth: boolean;
  sessionTimeout: string;
  dataEncryption: boolean;
  auditLogging: boolean;
  aiProvider: 'gemini-3.8-flash' | 'presidio-local' | 'azure-cognitive';
  maskingMethod: 'synthetic_tokens' | 'pseudonymization' | 'redaction';
  autoQuarantineCritical: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Security Officer' | 'Compliance Auditor' | 'Analyst';
  status: 'Active' | 'Invited' | 'Suspended';
  department: string;
  lastActive: string;
}

export interface SecureShareRequest {
  id: string;
  documentId: string;
  documentName: string;
  requesterEmail: string;
  recipientEmail: string;
  expiresInHours: number;
  watermarkEnabled: boolean;
  allowDownload: boolean;
  requireTwoPartyApproval: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  approverEmail?: string;
  createdAt: string;
  riskLevel: SeverityLevel;
}

export type ActiveTab =
  | 'dashboard'
  | 'upload'
  | 'pii-detection'
  | 'risk-analysis'
  | 'masking-preview'
  | 'protected-document'
  | 'ai-analysis'
  | 'reports'
  | 'audit-logs'
  | 'policies'
  | 'settings'
  | 'specs';
