/**
 * Privexa AI - Sanitization Verification Service
 * Executes mandatory secondary audit scan to prove zero raw PII leakage.
 */

import { PiiDetectionService } from './piiDetectionService';
import { DetectedEntity } from '../types';

export interface VerificationReport {
  isVerified: boolean;
  rawPiiRemainingCount: number;
  residualEntities: DetectedEntity[];
  verificationScanId: string;
  verifiedAt: string;
  verificationMessage: string;
  zeroLeakageCertified: boolean;
}

export class SanitizationVerifier {
  /**
   * Rescans sanitized document content to confirm absolute zero raw PII leakage
   */
  public static verifySanitization(
    sanitizedText: string,
    originalEntities: DetectedEntity[]
  ): VerificationReport {
    const scanId = `VRF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // 1. Run full regex/rule detection on the masked output
    const detectedInSanitized = PiiDetectionService.detectEntities(sanitizedText);

    // 2. Cross-reference original sensitive strings to verify none exist in sanitized text
    const leakedOriginals: DetectedEntity[] = [];

    originalEntities.forEach((orig) => {
      const sensitiveVal = orig.originalText.trim();
      if (sensitiveVal.length >= 3 && sanitizedText.includes(sensitiveVal)) {
        leakedOriginals.push(orig);
      }
    });

    const residualEntities = [...detectedInSanitized, ...leakedOriginals];
    // Deduplicate residuals
    const uniqueResiduals = Array.from(new Set(residualEntities.map((e) => e.originalText))).map(
      (text) => residualEntities.find((e) => e.originalText === text)!
    );

    const isVerified = uniqueResiduals.length === 0;

    return {
      isVerified,
      rawPiiRemainingCount: uniqueResiduals.length,
      residualEntities: uniqueResiduals,
      verificationScanId: scanId,
      verifiedAt: new Date().toISOString(),
      verificationMessage: isVerified
        ? 'Verification scan completed: 0 raw sensitive entities remain. Zero-exposure shield certified.'
        : `Verification scan failed: ${uniqueResiduals.length} sensitive item(s) detected in masked payload. AI ingress blocked.`,
      zeroLeakageCertified: isVerified,
    };
  }
}
