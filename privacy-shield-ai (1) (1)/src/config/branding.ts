/**
 * Privexa AI - Enterprise Branding & Asset Configuration
 * 
 * LOGO PATH STRUCTURING GUIDE FOR LOCAL DEVELOPMENT VS PRODUCTION:
 * 
 * 1. Bundled Import Method (Recommended for Vite/Webpack/Rollup):
 *    - In code: `import logoAsset from '@/assets/logo.png';`
 *    - Local dev: Bundler serves via Vite HMR asset pipeline (e.g. `/@fs/.../src/assets/logo.png`).
 *    - Production: Vite hashes and copies to `dist/assets/logo-[hash].png`, optimizing cache headers.
 * 
 * 2. Public Directory Static Method (Universal root resolution):
 *    - In code: `${import.meta.env.BASE_URL}logo.png` or simply `/logo.png`
 *    - Local dev: Served directly by Vite dev server from `/public/logo.png` at root `/logo.png`.
 *    - Production: Copied verbatim to `dist/logo.png` and served by Express static middleware.
 *    - CDN/Subpath deployments: Handled cleanly by referencing `import.meta.env.BASE_URL + 'logo.png'`.
 */

import logoSrc from '../assets/logo.png';

export const BRANDING = {
  name: 'Privexa AI',
  legalName: 'Privexa AI Technologies Inc.',
  tagline: 'Zero-Exposure Sensitive Data Detection & Automated Privacy Protection',
  description: 'Enterprise sensitive data detection, risk scoring, token masking, and zero-exposure AI analysis.',
  copyright: `© ${new Date().getFullYear()} Privexa AI. All rights reserved.`,
  supportEmail: 'security@privexa.ai',
  complianceStandard: 'SOC 2 Type II · HIPAA · GDPR · ISO 27001 Certified',
  
  // Dual path resolution: bundled import (logoSrc) with fallback to static public path
  logo: {
    src: logoSrc,
    publicPath: '/logo.png',
    faviconPath: '/favicon.png',
    alt: 'Privexa AI - Intelligent Zero-Exposure Sensitive Data Shield Logo',
  },
} as const;
