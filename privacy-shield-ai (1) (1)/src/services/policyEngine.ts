/**
 * Privexa AI - Security Policy Decision Engine
 * Determines enforcement action: ALLOW | WARN | SANITIZE | BLOCK
 */

import { DetectedEntity, PolicyAction, SeverityLevel } from '../types';

export interface PolicyDecision {
  action: PolicyAction;
  reason: string;
  enforcedRules: string[];
  requiresMasking: boolean;
  canProceedToAi: boolean;
}

export class PolicyEngine {
  public static evaluatePolicy(
    entities: DetectedEntity[],
    riskLevel: SeverityLevel,
    policyName = 'Default Enterprise DLP Policy'
  ): PolicyDecision {
    const rulesTriggered: string[] = [];

    // 1. Zero PII
    if (entities.length === 0) {
      return {
        action: 'ALLOW',
        reason: 'No sensitive or confidential entities identified. Permitted for distribution and processing.',
        enforcedRules: ['Rule 001: Clean Document Auto-Allow'],
        requiresMasking: false,
        canProceedToAi: true,
      };
    }

    const hasCredentials = entities.some((e) => e.category === 'credential');
    const hasFinancial = entities.some((e) => e.category === 'financial');
    const hasGovId = entities.some((e) => e.category === 'identifier');
    const hasHealth = entities.some((e) => e.category === 'health');

    // 2. Critical credentials policy check
    if (hasCredentials) {
      rulesTriggered.push('Rule 101: Zero Credential Leakage');
      // If enterprise policy specifies blocking raw secret transmission:
      return {
        action: 'SANITIZE',
        reason: 'Document contains active cryptographic secrets or API credentials. Synthetic masking mandatory before AI ingress.',
        enforcedRules: rulesTriggered,
        requiresMasking: true,
        canProceedToAi: false, // Must be sanitized first!
      };
    }

    // 3. High-risk financial / national ID / health
    if (hasFinancial || hasGovId || hasHealth || riskLevel === 'critical' || riskLevel === 'high') {
      if (hasFinancial) rulesTriggered.push('Rule 201: PCI-DSS Payment Card Redaction');
      if (hasGovId) rulesTriggered.push('Rule 202: Statutory National ID Masking');
      if (hasHealth) rulesTriggered.push('Rule 203: HIPAA Health Record Protection');

      return {
        action: 'SANITIZE',
        reason: 'Sensitive statutory records detected. Synthetic token substitution required prior to AI or external sharing.',
        enforcedRules: rulesTriggered,
        requiresMasking: true,
        canProceedToAi: false,
      };
    }

    // 4. Moderate risk contact information (email, phone, names)
    if (riskLevel === 'medium') {
      rulesTriggered.push('Rule 301: Personal Contact Obfuscation');
      return {
        action: 'WARN',
        reason: 'Identifiable contact information found. Sanitization recommended before sharing with untrusted systems.',
        enforcedRules: rulesTriggered,
        requiresMasking: true,
        canProceedToAi: false,
      };
    }

    // 5. Low risk
    return {
      action: 'ALLOW',
      reason: 'Low sensitivity content within tolerable risk thresholds.',
      enforcedRules: ['Rule 401: Low Risk Permissive Flow'],
      requiresMasking: false,
      canProceedToAi: true,
    };
  }
}
