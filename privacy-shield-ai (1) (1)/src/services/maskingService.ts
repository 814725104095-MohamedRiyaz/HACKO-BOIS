/**
 * Privexa AI - Centralized Deterministic Masking Service
 * Replaces sensitive values with structured synthetic tokens.
 * Consistent across identical occurrences (e.g. John Smith -> <PERSON_001> everywhere).
 */

import { DetectedEntity, EntityCategory } from '../types';

export interface MaskingResult {
  sanitizedText: string;
  tokenMap: Record<string, string>; // original -> token
  reverseTokenMap: Record<string, string>; // token -> original
  updatedEntities: DetectedEntity[];
}

export class MaskingService {
  private static categoryPrefixes: Record<EntityCategory, string> = {
    person: 'PERSON',
    email: 'EMAIL',
    phone: 'PHONE',
    address: 'LOCATION',
    financial: 'FINANCIAL',
    identifier: 'IDENTIFIER',
    credential: 'CREDENTIAL',
    health: 'HEALTH_RECORD',
    confidential: 'PROPRIETARY',
    other: 'TOKEN',
  };

  /**
   * Applies deterministic masking to detected entities
   */
  public static maskDocument(
    rawText: string,
    entities: DetectedEntity[]
  ): MaskingResult {
    const tokenMap: Record<string, string> = {};
    const reverseTokenMap: Record<string, string> = {};
    const categoryCounters: Record<string, number> = {};

    // 1. Assign tokens deterministically (case-insensitive deduplication)
    const updatedEntities: DetectedEntity[] = entities.map((entity) => {
      const normalizedOriginal = entity.originalText.trim();
      const lookupKey = normalizedOriginal.toLowerCase();

      let assignedToken = tokenMap[lookupKey];

      if (!assignedToken) {
        const prefix =
          this.categoryPrefixes[entity.category] ||
          this.categoryPrefixes.other;
        categoryCounters[prefix] = (categoryCounters[prefix] || 0) + 1;
        const formattedNum = String(categoryCounters[prefix]).padStart(3, '0');
        assignedToken = `<${prefix}_${formattedNum}>`;

        tokenMap[lookupKey] = assignedToken;
        reverseTokenMap[assignedToken] = normalizedOriginal;
      }

      return {
        ...entity,
        maskedToken: assignedToken,
      };
    });

    // 2. Perform text replacement safely from back to front to preserve string indices
    const sortedByEndDesc = [...updatedEntities].sort(
      (a, b) => b.startIndex - a.startIndex
    );

    let sanitized = rawText;
    for (const entity of sortedByEndDesc) {
      if (
        entity.startIndex >= 0 &&
        entity.endIndex <= sanitized.length &&
        entity.startIndex < entity.endIndex
      ) {
        sanitized =
          sanitized.substring(0, entity.startIndex) +
          entity.maskedToken +
          sanitized.substring(entity.endIndex);
      }
    }

    // 3. Fallback scan to ensure repeated identical text instances are replaced even if not caught by individual index
    Object.entries(tokenMap).forEach(([orig, token]) => {
      // Escape regex special characters in original text
      const escaped = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const globalRegex = new RegExp(escaped, 'gi');
      sanitized = sanitized.replace(globalRegex, token);
    });

    return {
      sanitizedText: sanitized,
      tokenMap,
      reverseTokenMap,
      updatedEntities,
    };
  }
}
