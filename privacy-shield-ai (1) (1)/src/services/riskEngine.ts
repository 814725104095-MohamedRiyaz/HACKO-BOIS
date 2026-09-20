/**
 * Privexa AI - Real Risk Engine
 * Dynamically computes mathematical risk scores, severity levels, and category breakdowns.
 * No static values: documents with 0 PII evaluate to 0 risk.
 */

import { DetectedEntity, RiskBreakdown, SeverityLevel } from '../types';

export interface RiskAnalysisResult {
  riskScore: number;
  privacyScore: number;
  riskLevel: SeverityLevel;
  riskBreakdown: RiskBreakdown;
  keyFindings: string[];
  recommendations: string[];
}

export class RiskEngine {
  public static calculateRisk(entities: DetectedEntity[]): RiskAnalysisResult {
    if (!entities || entities.length === 0) {
      return {
        riskScore: 0,
        privacyScore: 100,
        riskLevel: 'low',
        riskBreakdown: {
          financial: 0,
          governmentId: 0,
          personalInfo: 0,
          contactInfo: 0,
          credentials: 0,
          other: 0,
        },
        keyFindings: [
          'No sensitive data or PII entities detected in this document.',
          'Safe for unmasked internal and team distribution.',
          'Zero exposure risk under GDPR, HIPAA, and DPDP frameworks.',
        ],
        recommendations: [
          'Document is verified clean. Direct AI processing is safe.',
          'Standard access controls apply.',
        ],
      };
    }

    // Category counts
    let credentialsCount = 0;
    let financialCount = 0;
    let identifierCount = 0;
    let healthCount = 0;
    let contactCount = 0;
    let personalCount = 0;
    let confidentialCount = 0;

    let weightedSum = 0;

    entities.forEach((entity) => {
      switch (entity.category) {
        case 'credential':
          credentialsCount++;
          weightedSum += 35; // Immediate critical impact
          break;
        case 'financial':
          financialCount++;
          weightedSum += 22;
          break;
        case 'identifier':
          identifierCount++;
          weightedSum += 20;
          break;
        case 'health':
          healthCount++;
          weightedSum += 18;
          break;
        case 'confidential':
          confidentialCount++;
          weightedSum += 15;
          break;
        case 'email':
        case 'phone':
          contactCount++;
          weightedSum += 6;
          break;
        case 'person':
        case 'address':
          personalCount++;
          weightedSum += 5;
          break;
        default:
          weightedSum += 4;
      }
    });

    // Compute final dynamic risk score (capped at 100)
    let finalRiskScore = Math.min(100, Math.round(weightedSum));

    // Determine risk level based on entities and score
    let riskLevel: SeverityLevel = 'low';
    if (credentialsCount > 0 || finalRiskScore >= 80) {
      riskLevel = 'critical';
      if (finalRiskScore < 85) finalRiskScore = 88;
    } else if (financialCount > 0 || identifierCount > 0 || finalRiskScore >= 55) {
      riskLevel = 'high';
    } else if (contactCount > 0 || personalCount > 1 || finalRiskScore >= 25) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }

    const privacyScore = Math.max(0, 100 - finalRiskScore);

    // Compute percentages for breakdown
    const totalEntities = entities.length;
    const riskBreakdown: RiskBreakdown = {
      credentials: Math.round((credentialsCount / totalEntities) * 100),
      financial: Math.round((financialCount / totalEntities) * 100),
      governmentId: Math.round((identifierCount / totalEntities) * 100),
      contactInfo: Math.round((contactCount / totalEntities) * 100),
      personalInfo: Math.round((personalCount / totalEntities) * 100),
      other: Math.round(((healthCount + confidentialCount) / totalEntities) * 100),
    };

    // Generate dynamic key findings based on detected entities
    const keyFindings: string[] = [];
    if (credentialsCount > 0) {
      keyFindings.push(
        `CRITICAL: Found ${credentialsCount} active API secrets or cryptographic credentials. High exposure liability.`
      );
    }
    if (financialCount > 0) {
      keyFindings.push(
        `FINANCIAL: Detected ${financialCount} payment cards or bank account numbers subject to PCI-DSS compliance.`
      );
    }
    if (identifierCount > 0) {
      keyFindings.push(
        `NATIONAL ID: Identified ${identifierCount} government identification numbers (SSN/PAN/Aadhaar) requiring statutory redaction.`
      );
    }
    if (contactCount > 0 || personalCount > 0) {
      keyFindings.push(
        `IDENTITY: Detected ${contactCount + personalCount} personal identities, phone numbers, or corporate email addresses.`
      );
    }
    if (healthCount > 0) {
      keyFindings.push(
        `HEALTH DATA: Found ${healthCount} protected medical / diagnosis records under HIPAA privacy restrictions.`
      );
    }

    // Generate dynamic recommendations
    const recommendations: string[] = [
      'Enforce synthetic token masking before sharing with third-party or external LLMs.',
      'Maintain immutable audit logs of document masking actions.',
    ];
    if (credentialsCount > 0) {
      recommendations.unshift('Immediately rotate exposed cloud/API keys and revoke active tokens.');
    }
    if (financialCount > 0 || identifierCount > 0) {
      recommendations.push(
        'Verify document destruction or secure air-gapped storage for unredacted original files.'
      );
    }

    return {
      riskScore: finalRiskScore,
      privacyScore,
      riskLevel,
      riskBreakdown,
      keyFindings,
      recommendations,
    };
  }
}
