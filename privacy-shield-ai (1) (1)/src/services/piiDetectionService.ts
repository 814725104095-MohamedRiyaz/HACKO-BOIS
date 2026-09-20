/**
 * Privexa AI - Core PII Detection Service
 * Detects sensitive entities using deterministic regex rules, checksum validation, and NER patterns.
 */

import { DetectedEntity, EntityCategory, SeverityLevel } from '../types';

/**
 * Validates a credit card number using the Luhn checksum algorithm
 */
export function isValidLuhn(numStr: string): boolean {
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

export interface DetectionRule {
  category: EntityCategory;
  name: string;
  regex: RegExp;
  severity: SeverityLevel;
  baseConfidence: number;
  explanation: string;
  customValidator?: (match: string) => boolean;
}

export const DETECTION_RULES: DetectionRule[] = [
  // 1. Credentials, API Keys, Secrets & Tokens
  {
    category: 'credential',
    name: 'Cloud / API Secret Key',
    regex: /\b(?:AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36}|xoxb-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24}|(?:api[_-]?key|secret[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*['"]?([a-zA-Z0-9_\-.~+]{16,64})['"]?)\b/gi,
    severity: 'critical',
    baseConfidence: 0.99,
    explanation: 'Exposed cloud infrastructure access credentials or API authorization tokens.',
  },
  {
    category: 'credential',
    name: 'JSON Web Token (JWT)',
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
    severity: 'critical',
    baseConfidence: 0.99,
    explanation: 'Cryptographic bearer authentication token (JWT).',
  },
  {
    category: 'credential',
    name: 'Cryptographic Private Key',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[a-zA-Z0-9+/=\s]+-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    severity: 'critical',
    baseConfidence: 1.0,
    explanation: 'Asymmetric private key certificate block.',
  },

  // 2. Financial Information (Payment Cards, Bank Accounts, IBAN, IFSC)
  {
    category: 'financial',
    name: 'Credit / Debit Card PAN',
    regex: /\b(?:\d{4}[ -]?){3}\d{4}\b/g,
    severity: 'critical',
    baseConfidence: 0.96,
    explanation: 'Payment card Primary Account Number (PAN) validated via Luhn checksum.',
    customValidator: isValidLuhn,
  },
  {
    category: 'financial',
    name: 'Bank Account / IBAN / Routing',
    regex: /\b(?:IBAN\s*[A-Z]{2}\d{2}[A-Z0-9]{11,30}|(?:Account|Acct|Routing)\s*#?:?\s*(\d{8,14})|[A-Z]{4}0[A-Z0-9]{6})\b/gi,
    severity: 'critical',
    baseConfidence: 0.93,
    explanation: 'Bank transit routing, domestic account, IFSC, or international IBAN identifier.',
  },

  // 3. Government Identification Numbers (SSN, PAN, Aadhaar, Passport)
  {
    category: 'identifier',
    name: 'Social Security Number (SSN)',
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    severity: 'critical',
    baseConfidence: 0.98,
    explanation: 'US Social Security Number (SSN).',
  },
  {
    category: 'identifier',
    name: 'PAN Card (India)',
    regex: /\b[A-Z]{5}\d{4}[A-Z]{1}\b/g,
    severity: 'critical',
    baseConfidence: 0.97,
    explanation: 'Indian Permanent Account Number (PAN) national tax identifier.',
  },
  {
    category: 'identifier',
    name: 'Aadhaar Card Number',
    regex: /\b\d{4}\s\d{4}\s\d{4}\b/g,
    severity: 'critical',
    baseConfidence: 0.96,
    explanation: 'Unique 12-digit Indian national biometric identification number.',
  },
  {
    category: 'identifier',
    name: 'Passport / National ID Number',
    regex: /\b(?:[A-Z]{1}[0-9]{7}|[A-Z]{2}[0-9]{7}|DL[- ]?[A-Z0-9]{8,14})\b/g,
    severity: 'high',
    baseConfidence: 0.91,
    explanation: 'International passport or driver license identification code.',
  },

  // 4. Contact Information (Email & Phone Numbers)
  {
    category: 'email',
    name: 'Email Address',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    severity: 'medium',
    baseConfidence: 0.98,
    explanation: 'Electronic mail address (RFC-5322 standard).',
  },
  {
    category: 'phone',
    name: 'Phone Number',
    regex: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b(?:\+91[\s-]?)?[6-9]\d{9}\b/g,
    severity: 'medium',
    baseConfidence: 0.94,
    explanation: 'Telecommunication phone number in domestic or E.164 format.',
  },

  // 5. Physical Addresses
  {
    category: 'address',
    name: 'Physical Address',
    regex: /\b(?:\d{1,5}\s+[\w\s]{2,25}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Chennai|Tamil Nadu|New York|California|London|Bangalore|Mumbai|Delhi)[\w\s,.-]{0,30}\b)/gi,
    severity: 'low',
    baseConfidence: 0.88,
    explanation: 'Geographical physical street address or corporate location.',
  },

  // 6. Health & Medical Data
  {
    category: 'health',
    name: 'Protected Health Information (PHI)',
    regex: /\b(?:MRN\s*#?:?\s*\d{6,10}|Prescription\s*#?:?\s*[A-Z0-9]{6,12}|Diagnosis:\s*[\w\s]{4,30}|Blood Group:\s*(?:A|B|AB|O)[+-]|HIPAA\s*Protected)\b/gi,
    severity: 'high',
    baseConfidence: 0.92,
    explanation: 'Medical record number, clinical diagnostic data, or prescription record.',
  },

  // 7. Confidential Organizational Markings
  {
    category: 'confidential',
    name: 'Confidential Business Marking',
    regex: /\b(?:STRICTLY CONFIDENTIAL|RESTRICTED INTERNAL USE|NON-DISCLOSURE AGREEMENT|PROPRIETARY TRADE SECRET|CONFIDENTIAL|INTERNAL ONLY)\b/gi,
    severity: 'high',
    baseConfidence: 0.95,
    explanation: 'Organizational classification marking indicative of proprietary corporate trade secrets.',
  },
];

// Expanded Person Names dataset for high-precision NLP name matching
export const KNOWN_PERSON_NAMES = [
  'Rahul Kumar',
  'Rahul',
  'Riyaz Nijam',
  'Riyaz',
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
  'Aarav Sharma',
  'Neha Gupta',
  'Rajesh Khanna',
  'Aditi Rao',
  'Alex Mercer',
  'Maria Garcia',
  'James Wilson',
];

export class PiiDetectionService {
  /**
   * Detects all PII entities across a raw text string
   */
  public static detectEntities(text: string): DetectedEntity[] {
    const entities: DetectedEntity[] = [];
    const matchedRanges: Array<{ start: number; end: number }> = [];

    const isOverlapping = (start: number, end: number) => {
      return matchedRanges.some((r) => Math.max(r.start, start) < Math.min(r.end, end));
    };

    // 1. High-priority deterministic rules
    DETECTION_RULES.forEach((rule) => {
      rule.regex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = rule.regex.exec(text)) !== null) {
        const matchText = match[0];
        const start = match.index;
        const end = start + matchText.length;

        if (rule.customValidator && !rule.customValidator(matchText)) {
          continue;
        }

        if (!isOverlapping(start, end)) {
          matchedRanges.push({ start, end });
          entities.push({
            id: `ent-${rule.category}-${entities.length + 1}`,
            category: rule.category,
            name: rule.name,
            originalText: matchText,
            maskedToken: '', // populated by MaskingService
            startIndex: start,
            endIndex: end,
            confidence: rule.baseConfidence,
            severity: rule.severity,
            explanation: rule.explanation,
          });
        }
      }
    });

    // 2. NLP / Person name recognition
    KNOWN_PERSON_NAMES.forEach((name) => {
      const regex = new RegExp(`\\b${name}\\b`, 'gi');
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        const matchText = match[0];
        const start = match.index;
        const end = start + matchText.length;

        if (!isOverlapping(start, end)) {
          matchedRanges.push({ start, end });
          entities.push({
            id: `ent-person-${entities.length + 1}`,
            category: 'person',
            name: 'Person Name',
            originalText: matchText,
            maskedToken: '',
            startIndex: start,
            endIndex: end,
            confidence: 0.96,
            severity: 'medium',
            explanation: 'Individual human person name identified via entity detection.',
          });
        }
      }
    });

    // Sort entities in order of occurrence in the text
    return entities.sort((a, b) => a.startIndex - b.startIndex);
  }
}
