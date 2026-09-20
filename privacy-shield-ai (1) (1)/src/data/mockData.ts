/**
 * Privexa AI - Initial Mock Data and Preset Files
 * Matching UI Reference Design with Realistic Datasets
 */

import { AuditLogItem, DocumentScanResult, PolicyRule, SecureShareRequest, SystemSettings, UserAccount } from '../types';
import { scanDocumentText } from '../utils/privacyScanner';

// Default document matching Screen 5, 6, 7, 8, 9 in the design reference
export const SAMPLE_REPORT_PDF_CONTENT = `CONFIDENTIAL QUARTERLY AUDIT REPORT
Document Owner: Rahul Kumar
Primary Email: rahul@gmail.com
Direct Contact: 9876543210
Office Location: 45 Tech Corridor, Chennai, Tamil Nadu
National Identity ID: XXXX-XXXX-1234
Corporate Visa PAN: 4532-8765-1092-3456
Secondary Contact: Emily Davis (emily.davis@acme.com), Tel: +1 (415) 555-0199
Accounting Transit Routing: Acct #9842104523
Backup Identity: 582-41-9821
Status: RESTRICTED INTERNAL USE ONLY
Summary:
This confidential financial balance sheet details quarterly enterprise revenue disbursements for Rahul Kumar and regional directors. All transactions were reconciled against Visa PAN 4532-8765-1092-3456 with routing #9842104523. Contact Rahul Kumar at rahul@gmail.com or 9876543210 for billing disputes in Chennai, Tamil Nadu.`;

export const INITIAL_REPORT_DOCUMENT: DocumentScanResult = {
  ...scanDocumentText(SAMPLE_REPORT_PDF_CONTENT, 'Report.pdf', 24576),
  id: 'doc-report-pdf-01',
  scannedAt: '2025-09-16T14:32:00Z',
  privacyScore: 72,
  riskScore: 86,
  riskLevel: 'critical',
  exposureToAi: 0,
};

// Preset demo documents for quick testing
export const PRESET_DEMO_DOCUMENTS = [
  {
    name: 'Report.pdf',
    type: 'PDF',
    size: '24 KB',
    description: 'Executive financial report with Rahul Kumar, credit card, phone, national ID',
    content: SAMPLE_REPORT_PDF_CONTENT,
  },
  {
    name: 'Financial_data.csv',
    type: 'CSV',
    size: '18 KB',
    description: 'Corporate payroll and transaction records with IBANs and PANs',
    content: `Employee_ID,Full_Name,Work_Email,Account_Number,Routing,Card_Number,Bonus_USD
EMP-8921,John Smith,john.smith@fintech.io,Acct #883921004,Routing: 021000021,4111-2222-3333-4444,$14500
EMP-8922,Priya Sharma,priya.sharma@fintech.io,Acct #771239912,Routing: 021000021,5500-1122-3344-5566,$19200
EMP-8923,David Martinez,david.m@fintech.io,Acct #449102391,Routing: 021000021,3782-822463-10005,$22000
CONFIDENTIAL PAYROLL DOCUMENT - STRICTLY RESTRICTED`,
  },
  {
    name: 'Personal_info.docx',
    type: 'DOCX',
    size: '32 KB',
    description: 'HR Onboarding intake with SSNs, home addresses, personal phone numbers',
    content: `EMPLOYEE ONBOARDING VERIFICATION
Name: Jane Doe
DOB: 1989-04-12
Social Security Number: 452-98-3112
Personal Address: 742 Evergreen Terrace, Springfield, New York
Contact Phone: (555) 839-2049
Personal Email: janedoe1989@gmail.com
Emergency Contact: Michael Brown, Phone: (555) 912-4021
Department: Engineering Infrastructure`,
  },
  {
    name: 'Project_details.pdf',
    type: 'PDF',
    size: '12 KB',
    description: 'System deployment config with cloud keys and API tokens',
    content: `DEPLOYMENT PIPELINE CREDENTIALS
Environment: Production US-East
AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Admin Contact: Riyaz (riyaz@gmail.com)
Database Connection: postgresql://admin:SuperSecretPass123@db.prod.internal:5432/shield_prod
GitHub Token: ghp_9a8B7c6D5e4F3g2H1i0JkLmNoPqRsTuVwXyZ`,
  },
];

// Initial Audit Logs matching Screen 10 in design reference
export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-01',
    timestamp: '2025-09-16 14:32',
    action: 'Document Uploaded',
    document: 'Report.pdf',
    riskLevel: 'high',
    user: 'Riyaz',
    userEmail: 'riyaz@gmail.com',
    status: 'Success',
    details: 'Uploaded 24KB file. Initiated multi-layer regex & NLP analyzer.',
    ipAddress: '192.168.1.42',
  },
  {
    id: 'log-02',
    timestamp: '2025-09-16 11:04',
    action: 'PII Detected',
    document: 'Financial_data.csv',
    riskLevel: 'high',
    user: 'Riyaz',
    userEmail: 'riyaz@gmail.com',
    status: 'Success',
    details: 'Discovered 14 financial and personal entities. Triggered quarantine review.',
    ipAddress: '192.168.1.42',
  },
  {
    id: 'log-03',
    timestamp: '2025-09-16 10:53',
    action: 'AI Analysis',
    document: 'Personal_info.docx',
    riskLevel: 'medium',
    user: 'Riyaz',
    userEmail: 'riyaz@gmail.com',
    status: 'Success',
    details: 'Dispatched sanitized prompt with 0% PII exposure to Gemini inference.',
    ipAddress: '192.168.1.42',
  },
  {
    id: 'log-04',
    timestamp: '2025-09-16 09:17',
    action: 'Masking Applied',
    document: 'Project_details.pdf',
    riskLevel: 'low',
    user: 'Riyaz',
    userEmail: 'riyaz@gmail.com',
    status: 'Success',
    details: 'Applied 100% cryptographic token masking. Vault mapping stored in KMS.',
    ipAddress: '192.168.1.42',
  },
  {
    id: 'log-05',
    timestamp: '2025-09-16 08:45',
    action: 'Report Generated',
    document: 'Report.pdf',
    riskLevel: 'medium',
    user: 'Riyaz',
    userEmail: 'riyaz@gmail.com',
    status: 'Success',
    details: 'Compiled compliance report and risk mitigation advisory.',
    ipAddress: '192.168.1.42',
  },
  {
    id: 'log-06',
    timestamp: '2025-09-15 16:20',
    action: 'Secure Share Requested',
    document: 'Q3_Financial_Brief.pdf',
    riskLevel: 'critical',
    user: 'Sarah Wilson',
    userEmail: 'sarah.w@enterprise.org',
    status: 'Success',
    details: 'Requested external share with board members. Requires secondary approval.',
    ipAddress: '10.0.4.19',
  },
];

// Initial Policy Configuration
export const INITIAL_POLICIES: PolicyRule[] = [
  {
    id: 'pol-01',
    name: 'Payment Card Industry (PCI-DSS) Masking',
    category: 'financial',
    description: 'Enforces automatic redaction and synthetic replacement for Visa, Mastercard, AMEX, and IBANs.',
    enabled: true,
    severity: 'critical',
    minConfidence: 0.9,
    regexPattern: '(?:\d{4}[ -]?){3}\d{4}',
    action: 'mask',
  },
  {
    id: 'pol-02',
    name: 'Government & National Identification (GDPR/HIPAA)',
    category: 'identifier',
    description: 'Blocks unencrypted transmission of Social Security Numbers, Aadhaar, PAN, and Passport numbers.',
    enabled: true,
    severity: 'critical',
    minConfidence: 0.95,
    regexPattern: '\d{3}-\d{2}-\d{4}',
    action: 'quarantine',
  },
  {
    id: 'pol-03',
    name: 'Cloud Infrastructure & Cryptographic Secrets',
    category: 'credential',
    description: 'Zero-tolerance filter for AWS Keys, GitHub PATs, JWT tokens, and private RSA keys.',
    enabled: true,
    severity: 'critical',
    minConfidence: 0.98,
    action: 'block',
  },
  {
    id: 'pol-04',
    name: 'Employee Personal Identifiable Information',
    category: 'person',
    description: 'Identifies human names, residential addresses, and personal contact lines.',
    enabled: true,
    severity: 'medium',
    minConfidence: 0.85,
    action: 'mask',
  },
  {
    id: 'pol-05',
    name: 'Corporate Non-Disclosure & Trade Secrets',
    category: 'confidential',
    description: 'Detects proprietary confidential banners, merger details, and patent drafts.',
    enabled: true,
    severity: 'high',
    minConfidence: 0.9,
    action: 'notify',
  },
];

// Initial Users for RBAC
export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-01',
    name: 'Riyaz',
    email: 'riyaz@gmail.com',
    role: 'Super Admin',
    status: 'Active',
    department: 'Data Security & Compliance',
    lastActive: 'Just now',
  },
  {
    id: 'usr-02',
    name: 'Sarah Wilson',
    email: 'sarah.w@enterprise.org',
    role: 'Security Officer',
    status: 'Active',
    department: 'Information Security',
    lastActive: '2 hours ago',
  },
  {
    id: 'usr-03',
    name: 'Alex Chen',
    email: 'alex.chen@enterprise.org',
    role: 'Compliance Auditor',
    status: 'Active',
    department: 'Legal & Privacy',
    lastActive: '1 day ago',
  },
  {
    id: 'usr-04',
    name: 'David Martinez',
    email: 'david.m@fintech.io',
    role: 'Analyst',
    status: 'Active',
    department: 'Risk Operations',
    lastActive: '3 days ago',
  },
];

// Initial System Settings matching Screen 11 in design reference
export const INITIAL_SETTINGS: SystemSettings = {
  accountName: 'Riyaz',
  email: 'riyaz@gmail.com',
  role: 'Super Admin',
  twoFactorAuth: true,
  sessionTimeout: '1 hour',
  dataEncryption: true,
  auditLogging: true,
  aiProvider: 'gemini-3.8-flash',
  maskingMethod: 'synthetic_tokens',
  autoQuarantineCritical: true,
};

// Initial Secure Share Requests
export const INITIAL_SHARE_REQUESTS: SecureShareRequest[] = [
  {
    id: 'share-req-01',
    documentId: 'doc-report-pdf-01',
    documentName: 'Report.pdf',
    requesterEmail: 'riyaz@gmail.com',
    recipientEmail: 'external-partner@cloudpartner.com',
    expiresInHours: 24,
    watermarkEnabled: true,
    allowDownload: false,
    requireTwoPartyApproval: true,
    status: 'Pending',
    createdAt: '2025-09-16T14:40:00Z',
    riskLevel: 'critical',
  },
];
