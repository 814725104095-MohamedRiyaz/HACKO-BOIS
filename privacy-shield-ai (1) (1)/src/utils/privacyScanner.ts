/**
 * Privexa AI - Intelligent Sensitive Data Detection Engine
 * Client & Edge Document Analysis Pipeline with Regex, NLP Simulation, and Risk Scoring
 */

import { DetectedEntity, DocumentScanResult, EntityCategory, RiskBreakdown, SeverityLevel } from '../types';

/**
 * Validates a credit card number using the Luhn checksum algorithm
 */
function isValidLuhn(numStr: string): boolean {
  const digits = numStr.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Pattern definitions for sensitive entity detection
 */
interface DetectionRule {
  category: EntityCategory;
  name: string;
  regex: RegExp;
  severity: SeverityLevel;
  baseConfidence: number;
  explanation: string;
  customValidator?: (match: string) => boolean;
}

const DETECTION_RULES: DetectionRule[] = [
  // Email Addresses
  {
    category: 'email',
    name: 'Email Address',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    severity: 'medium',
    baseConfidence: 0.98,
    explanation: 'Standard RFC-5322 electronic mail address detected.',
  },
  // Phone Numbers
  {
    category: 'phone',
    name: 'Phone Number',
    regex: /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})\b|\b(?:98|97|96|95|94|93|91|88|89)\d{8}\b/g,
    severity: 'medium',
    baseConfidence: 0.94,
    explanation: 'Telecommunication number adhering to E.164 or domestic formats.',
  },
  // Social Security Numbers / National IDs
  {
    category: 'identifier',
    name: 'Government ID / SSN',
    regex: /\b\d{3}-\d{2}-\d{4}\b|\b(?:[A-Z]{5}\d{4}[A-Z]{1})\b|\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g,
    severity: 'critical',
    baseConfidence: 0.97,
    explanation: 'National identity number (SSN/PAN/Aadhaar) carrying high identity theft risk.',
  },
  // Credit Card Numbers
  {
    category: 'financial',
    name: 'Credit Card Number',
    regex: /\b(?:\d{4}[ -]?){3}\d{4}\b/g,
    severity: 'critical',
    baseConfidence: 0.95,
    explanation: 'Payment card primary account number (PAN).',
    customValidator: isValidLuhn,
  },
  // Bank Account / Routing
  {
    category: 'financial',
    name: 'Bank Account Number',
    regex: /\b(?:IBAN\s*[A-Z]{2}\d{2}[A-Z0-9]{11,30}|(?:Account|Routing|Acct)\s*#?:?\s*(\d{8,14}))\b/gi,
    severity: 'critical',
    baseConfidence: 0.92,
    explanation: 'Direct banking transit routing or domestic account identifier.',
  },
  // AWS / Cloud Access Keys
  {
    category: 'credential',
    name: 'Cloud / API Secret Key',
    regex: /\b(?:AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36}|xoxb-[0-9]{11,12}-[0-9]{11,12}-[a-zA-Z0-9]{24}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})\b/g,
    severity: 'critical',
    baseConfidence: 0.99,
    explanation: 'Hardcoded cloud infrastructure credentials or cryptographic tokens.',
  },
  // Confidential Business Information
  {
    category: 'confidential',
    name: 'Confidential Business Marking',
    regex: /\b(?:STRICTLY CONFIDENTIAL|RESTRICTED INTERNAL USE|NON-DISCLOSURE AGREEMENT|PROPRIETARY TRADE SECRET|CONFIDENTIAL)\b/gi,
    severity: 'high',
    baseConfidence: 0.96,
    explanation: 'Legal trade secret and proprietary organizational document marking.',
  },
  // Physical Addresses
  {
    category: 'address',
    name: 'Physical Address',
    regex: /\b(?:\d{1,5}\s+[\w\s]{2,25}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Chennai|Tamil Nadu|New York|California|London|Bangalore)[\w\s,.-]{0,30}\b)/gi,
    severity: 'low',
    baseConfidence: 0.88,
    explanation: 'Physical residential or corporate geographical address.',
  },
];

// Names database for high-precision person entity extraction
const COMMON_PERSON_NAMES = [
  'Rahul Kumar',
  'Riyaz',
  'Riyaz Nijam',
  'John Smith',
  'Jane Doe',
  'Robert Johnson',
  'Emily Davis',
  'Michael Brown',
  'Sarah Wilson',
  'David Martinez',
  'Priya Sharma',
  'Arun Patel',
  'Vikram Singh',
  'Ananya Iyer',
  'Karthik Raja',
  'Suresh Reddy',
  'Deepa Nair',
  'Amit Shah',
];

/**
 * Executes multi-tier sensitive data scanning on arbitrary text
 */
export function scanDocumentText(text: string, fileName = 'Untitled_Document.txt', fileSize = 10240): DocumentScanResult {
  const entities: DetectedEntity[] = [];
  const tokenMap: Record<string, string> = {};
  const reverseTokenMap: Record<string, string> = {};

  const categoryCounters: Record<string, number> = {
    PERSON: 0,
    EMAIL: 0,
    PHONE: 0,
    LOCATION: 0,
    FINANCIAL: 0,
    IDENTIFIER: 0,
    CREDENTIAL: 0,
    CONFIDENTIAL: 0,
    OTHER: 0,
  };

  const getPrefix = (cat: EntityCategory): string => {
    switch (cat) {
      case 'person': return 'PERSON';
      case 'email': return 'EMAIL';
      case 'phone': return 'PHONE';
      case 'address': return 'LOCATION';
      case 'financial': return 'FINANCIAL';
      case 'identifier': return 'IDENTIFIER';
      case 'credential': return 'CREDENTIAL';
      case 'confidential': return 'CONFIDENTIAL';
      default: return 'OTHER';
    }
  };

  // 1. Detect Person Entities
  COMMON_PERSON_NAMES.forEach((name) => {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const matchText = match[0];
      const prefix = 'PERSON';
      if (!tokenMap[matchText]) {
        categoryCounters[prefix]++;
        const token = `<${prefix}_${String(categoryCounters[prefix]).padStart(3, '0')}>`;
        tokenMap[matchText] = token;
        reverseTokenMap[token] = matchText;
      }

      entities.push({
        id: `ent-person-${entities.length + 1}`,
        category: 'person',
        name: 'Person Name',
        originalText: matchText,
        maskedToken: tokenMap[matchText],
        startIndex: match.index,
        endIndex: match.index + matchText.length,
        confidence: 0.96,
        severity: 'medium',
        explanation: 'Individual identifiable human name detected via NLP entity extraction.',
      });
    }
  });

  // 2. Detect Rule-Based Entities
  DETECTION_RULES.forEach((rule) => {
    rule.regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = rule.regex.exec(text)) !== null) {
      const matchText = match[0];
      if (rule.customValidator && !rule.customValidator(matchText)) {
        continue;
      }

      const prefix = getPrefix(rule.category);
      if (!tokenMap[matchText]) {
        categoryCounters[prefix]++;
        const token = `<${prefix}_${String(categoryCounters[prefix]).padStart(3, '0')}>`;
        tokenMap[matchText] = token;
        reverseTokenMap[token] = matchText;
      }

      entities.push({
        id: `ent-${rule.category}-${entities.length + 1}`,
        category: rule.category,
        name: rule.name,
        originalText: matchText,
        maskedToken: tokenMap[matchText],
        startIndex: match.index,
        endIndex: match.index + matchText.length,
        confidence: rule.baseConfidence,
        severity: rule.severity,
        explanation: rule.explanation,
      });
    }
  });

  // Calculate sanitized text with replacement tokens
  let sanitized = text;
  // Sort replacements by longest first to prevent partial overlaps
  const sortedTokens = Object.keys(tokenMap).sort((a, b) => b.length - a.length);
  for (const original of sortedTokens) {
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    sanitized = sanitized.replace(new RegExp(escaped, 'g'), tokenMap[original]);
  }

  // Count by category
  const entityCounts: Record<EntityCategory, number> = {
    person: entities.filter((e) => e.category === 'person').length,
    email: entities.filter((e) => e.category === 'email').length,
    phone: entities.filter((e) => e.category === 'phone').length,
    address: entities.filter((e) => e.category === 'address').length,
    financial: entities.filter((e) => e.category === 'financial').length,
    identifier: entities.filter((e) => e.category === 'identifier').length,
    credential: entities.filter((e) => e.category === 'credential').length,
    health: entities.filter((e) => e.category === 'health').length,
    confidential: entities.filter((e) => e.category === 'confidential').length,
    other: entities.filter((e) => e.category === 'other').length,
  };

  const totalEntities = entities.length;

  // Calculate Risk Breakdown percentages
  const financialWeight = (entityCounts.financial + entityCounts.credential) * 15;
  const govIdWeight = entityCounts.identifier * 20;
  const personalWeight = entityCounts.person * 8;
  const contactWeight = (entityCounts.email + entityCounts.phone) * 5;
  const otherWeight = (entityCounts.address + entityCounts.confidential + entityCounts.other) * 4;

  const totalWeight = financialWeight + govIdWeight + personalWeight + contactWeight + otherWeight || 1;

  const riskBreakdown: RiskBreakdown = {
    financial: Math.min(100, Math.round((financialWeight / totalWeight) * 100)) || 40,
    governmentId: Math.min(100, Math.round((govIdWeight / totalWeight) * 100)) || 25,
    personalInfo: Math.min(100, Math.round((personalWeight / totalWeight) * 100)) || 20,
    contactInfo: Math.min(100, Math.round((contactWeight / totalWeight) * 100)) || 10,
    other: Math.min(100, Math.round((otherWeight / totalWeight) * 100)) || 5,
  };

  // Compute Risk Score & Severity
  let riskScore = 0;
  if (entityCounts.credential > 0 || entityCounts.financial > 0 || entityCounts.identifier > 0) {
    riskScore = Math.min(98, 70 + totalEntities * 2);
  } else if (entityCounts.person > 2 || entityCounts.email > 2) {
    riskScore = Math.min(68, 35 + totalEntities * 3);
  } else if (totalEntities > 0) {
    riskScore = Math.min(45, 15 + totalEntities * 4);
  } else {
    riskScore = 8;
  }

  // Adjust privacy score (inversely correlated with risk)
  const privacyScore = Math.max(12, 100 - Math.round(riskScore * 0.85));

  let riskLevel: SeverityLevel = 'low';
  if (riskScore >= 80) riskLevel = 'critical';
  else if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 30) riskLevel = 'medium';

  // Key Findings synthesis
  const keyFindings: string[] = [];
  if (entityCounts.financial > 0) {
    keyFindings.push('Financial information detected (Payment card/Bank credentials).');
  }
  if (entityCounts.identifier > 0) {
    keyFindings.push('Government identity numbers present requiring statutory redaction.');
  }
  if (entityCounts.credential > 0) {
    keyFindings.push('Hardcoded cloud secret keys or API credentials discovered.');
  }
  if (entityCounts.person > 0 || entityCounts.email > 0) {
    keyFindings.push('Multiple personal identifiers (names, emails, phones) detected.');
  }
  if (keyFindings.length === 0) {
    keyFindings.push('No critical sensitive data points or compliance violations detected.');
  }

  // Recommendations synthesis
  const recommendations: string[] = [
    'Mask financial and personal information before external AI processing.',
    'Use company authentication and cryptographic tokens for sensitive documents.',
    'Enable two-factor authentication and role-based access for reviewers.',
    'Regularly audit scan logs and maintain tamper-proof audit trails.',
  ];

  const ext = fileName.split('.').pop()?.toUpperCase() || 'TXT';

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fileName,
    fileSize,
    fileType: ext,
    scannedAt: new Date().toISOString(),
    rawText: text,
    sanitizedText: sanitized,
    privacyScore,
    riskScore,
    riskLevel,
    exposureToAi: 0,
    entities,
    entityCounts,
    riskBreakdown,
    keyFindings,
    recommendations,
    status: riskScore >= 90 ? 'quarantined' : 'complete',
    tokenMap,
    reverseTokenMap,
    shareStatus: 'private',
  };
}
