#!/usr/bin/env node

/**
 * Privexa AI - Continuous Integration Brand Integrity & Naming Regression Checker
 * 
 * Purpose: Scans project source files to prevent accidental regressions of legacy brand names
 * (e.g. "Privacy Shield", "PrivacyShield", "privacyshield").
 * 
 * Run with:
 *   npm run check:branding
 * Or in CI:
 *   node scripts/check-branding.js
 */

import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
  /privacy\s*shield/i,
  /privacyshield/i,
];

// Directories and files to check
const SCAN_DIRECTORIES = ['src', 'public'];
const SCAN_FILES = ['index.html', 'metadata.json', 'server.ts'];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.html', '.json', '.css', '.md'];

// Exceptions if any (e.g., this script itself)
const EXCLUDED_FILES = [
  'scripts/check-branding.js',
];

let totalViolations = 0;
const scannedFiles = [];

function scanFile(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (EXCLUDED_FILES.some(ex => normalizedPath.endsWith(ex))) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(line)) {
        // Exclude benign mentions such as lucide icon names like Shield, ShieldAlert, ShieldCheck
        // Check if line actually matches the full legacy compound brand name
        if (
          line.includes('Privacy Shield') ||
          line.includes('PrivacyShield') ||
          line.includes('privacyshield')
        ) {
          console.error(
            `❌ BRAND REGRESSION DETECTED in ${filePath}:${index + 1}\n` +
            `   Found forbidden legacy name: "${line.trim()}"\n` +
            `   --> Replace with "Privexa AI"\n`
          );
          totalViolations++;
        }
      }
    }
  });

  scannedFiles.push(filePath);
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        walkDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTENSIONS.includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

console.log('🔍 Running Privexa AI Brand Integrity Check...');

for (const file of SCAN_FILES) {
  if (fs.existsSync(file)) {
    scanFile(file);
  }
}

for (const dir of SCAN_DIRECTORIES) {
  walkDir(dir);
}

console.log(`✅ Scanned ${scannedFiles.length} project files.`);

if (totalViolations > 0) {
  console.error(`\n🚨 Failed: Found ${totalViolations} brand naming regressions! Please fix them.`);
  process.exit(1);
} else {
  console.log('✨ Brand Integrity Check PASSED! Zero legacy brand regressions detected.');
  process.exit(0);
}
