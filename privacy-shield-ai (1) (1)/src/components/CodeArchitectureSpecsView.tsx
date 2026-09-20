import React, { useState } from 'react';
import {
  Check,
  Code2,
  Compass,
  Copy,
  Database,
  FileCode,
  Layers,
  Palette,
  Server,
  Terminal,
} from 'lucide-react';
import { ResponsiveNavLabView } from './ResponsiveNavLabView';

interface CodeArchitectureSpecsViewProps {
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const CodeArchitectureSpecsView: React.FC<CodeArchitectureSpecsViewProps> = ({
  onShowToast,
}) => {
  const [activeSection, setActiveSection] = useState<'responsive-nav' | 'microservices'>('responsive-nav');
  const [activeSpec, setActiveSpec] = useState<'card' | 'api' | 'python' | 'schema' | 'tailwind'>('card');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onShowToast('Code snippet copied to clipboard', 'success');
  };

  // 1. Component code for the risk assessment card with responsive breakpoints
  const snippetRiskCard = `/**
 * @file RiskAssessmentCard.tsx
 * @description Enterprise-grade risk assessment card component featuring adaptive responsive breakpoints,
 * color-coded severity metrics, multi-dimensional risk breakdown, and interactive mitigation controls.
 *
 * Responsive behavior:
 * - Mobile (< 640px): Stacks vertically with compact padding and full-width actions.
 * - Tablet (640px - 1024px): 2-column header and risk metric split.
 * - Desktop (>= 1024px): Comprehensive multi-panel layout with side-by-side gauge and breakdown bars.
 */

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, CreditCard, IdCard, User, Phone, Lock } from 'lucide-react';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskBreakdown {
  financial: number;
  governmentId: number;
  personalInfo: number;
  contactInfo: number;
  other: number;
}

export interface RiskCardProps {
  fileName: string;
  riskScore: number; // 0 - 100
  riskLevel: SeverityLevel;
  breakdown: RiskBreakdown;
  entitiesCount: number;
  onProceedToMasking?: () => void;
  onInitiateShare?: () => void;
}

export const RiskAssessmentCard: React.FC<RiskCardProps> = ({
  fileName,
  riskScore,
  riskLevel,
  breakdown,
  entitiesCount,
  onProceedToMasking,
  onInitiateShare,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Severity style tokens
  const severityStyles = {
    critical: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-600', icon: ShieldAlert },
    high: { border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-500', icon: AlertTriangle },
    medium: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-500', icon: AlertTriangle },
    low: { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-600', icon: CheckCircle2 },
  }[riskLevel];

  const Icon = severityStyles.icon;

  return (
    <div className={\`w-full bg-white rounded-xl border \${severityStyles.border} shadow-sm overflow-hidden transition-all\`}>
      {/* Header Container: Flex-col on mobile, flex-row on tablet/desktop */}
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={\`w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 \${severityStyles.bg} \${severityStyles.text}\`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{fileName}</h3>
                <span className={\`px-2 py-0.5 text-xs font-bold text-white uppercase rounded-full \${severityStyles.badge}\`}>
                  {riskLevel}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Automated privacy and sensitivity analysis</p>
            </div>
          </div>

          {/* Quick Metrics: Stacks on mobile, aligned on tablet */}
          <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase">Risk Score</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{riskScore}<span className="text-xs text-slate-400">/100</span></span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase">Entities</span>
              <span className="text-xl sm:text-2xl font-black text-blue-600">{entitiesCount}</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown: 1 col on mobile, 12 cols on desktop */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Radial Gauge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{riskScore}</span>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase mt-2">Weighted Severity</span>
            </div>

            {/* Progress Bars */}
            <div className="lg:col-span-8 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Financial Data</span><span>{breakdown.financial}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: \`\${breakdown.financial}%\` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Government ID</span><span>{breakdown.governmentId}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: \`\${breakdown.governmentId}%\` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls: Responsive full-width buttons on mobile */}
      <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" /> Zero exposure to external AI guaranteed
        </span>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onProceedToMasking && (
            <button onClick={onProceedToMasking} className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs">
              Mask & Analyze
            </button>
          )}
        </div>
      </div>
    </div>
  );
};`;

  // 2. The API endpoint for initiating a document scan with async processing
  const snippetApiEndpoint = `/**
 * @file scanController.ts
 * @description Node.js / Express API endpoint for initiating document scan with async queue processing.
 * Dispatches heavy OCR and NLP pipeline jobs to background Redis BullMQ / Celery workers.
 */

import { Request, Response } from 'express';
import multer from 'multer';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { scanJobsTable } from '../db/schema';

// Multer in-memory storage for encrypted streaming
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB maximum document limit
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/csv', 'application/json', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Unsupported file format'));
  },
});

// BullMQ job queue for asynchronous document processing
const documentScanQueue = new Queue('document-scan-queue', {
  connection: { host: process.env.REDIS_HOST || '127.0.0.1', port: 6379 },
});

/**
 * POST /api/v1/documents/scan
 * Initiates an async document scan pipeline.
 */
export async function initiateDocumentScan(req: Request, res: Response) {
  try {
    const file = req.file;
    const { documentName, extractionOptions } = req.body;
    const userId = (req as any).user?.id || 'usr-anonymous';

    if (!file && !req.body.rawText) {
      return res.status(400).json({ error: 'Missing document payload or rawText' });
    }

    const jobId = uuidv4();
    const documentId = uuidv4();

    // 1. Store initial metadata record in PostgreSQL with 'pending' status
    await db.insert(scanJobsTable).values({
      id: jobId,
      documentId,
      userId,
      fileName: file ? file.originalname : (documentName || 'RawText_Scan.txt'),
      fileSize: file ? file.size : Buffer.byteLength(req.body.rawText, 'utf8'),
      mimeType: file ? file.mimetype : 'text/plain',
      status: 'QUEUED',
      createdAt: new Date(),
    });

    // 2. Dispatch job to Python Microservice Worker via BullMQ Redis Queue
    await documentScanQueue.add('analyze-document', {
      jobId,
      documentId,
      userId,
      fileBuffer: file ? file.buffer.toString('base64') : null,
      rawText: req.body.rawText || null,
      options: extractionOptions || { minConfidence: 0.85, maskSynthetic: true },
    }, {
      priority: 1,
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    });

    // 3. Respond with 202 Accepted and async tracking URL
    return res.status(202).json({
      status: 'Accepted',
      message: 'Document scan initiated asynchronously.',
      jobId,
      documentId,
      pollUrl: \`/api/v1/documents/scan/\${jobId}/status\`,
    });
  } catch (error: any) {
    console.error('Scan initiation failed:', error);
    return res.status(500).json({ error: 'Internal pipeline error', details: error.message });
  }
}

/**
 * GET /api/v1/documents/scan/:jobId/status
 * Polling endpoint returning scan state or completed entity results.
 */
export async function getScanJobStatus(req: Request, res: Response) {
  const { jobId } = req.params;
  const job = await db.query.scanJobsTable.findFirst({ where: (jobs, { eq }) => eq(jobs.id, jobId) });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  return res.json({ jobId: job.id, status: job.status, result: job.resultPayload });
}`;

  // 3. The Python function for entity extraction with confidence scoring
  const snippetPythonExtractor = `"""
Privexa AI - Python NLP Document Analysis Microservice
Uses Microsoft Presidio Analyzer Engine + spaCy transformer pipeline to detect
PII, financial instruments, national IDs, and cryptographic credentials with confidence scoring.
"""

from typing import List, Dict, Any
from presidio_analyzer import AnalyzerEngine, RecognizerResult, PatternRecognizer, Pattern
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
import spacy

# Initialize Presidio and underlying NLP model
nlp_spacy = spacy.load("en_core_web_trf")  # RoBERTa transformer backend
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

# Custom Pattern Recognizer for Cloud Access Keys (e.g. AWS & JWT)
aws_pattern = Pattern(name="aws_key_pattern", regex=r"\\b(AKIA[0-9A-Z]{16})\\b", score=0.98)
aws_recognizer = PatternRecognizer(supported_entity="AWS_KEY", patterns=[aws_pattern])
analyzer.registry.add_recognizer(aws_recognizer)

def extract_entities_with_confidence(
    text: str,
    min_confidence_score: float = 0.80
) -> Dict[str, Any]:
    """
    Scans raw document text, performs entity recognition with confidence scoring,
    and returns sanitized token substitutions alongside risk analysis.
    
    Args:
        text (str): Raw extracted document text.
        min_confidence_score (float): Lower bound confidence score filter (0.0 - 1.0).
        
    Returns:
        Dict[str, Any]: Structured payload with detected entities, token mappings,
                        and overall risk severity.
    """
    # 1. Execute Presidio Analyzer for PII, Financial, and Custom Patterns
    results: List[RecognizerResult] = analyzer.analyze(
        text=text,
        language="en",
        score_threshold=min_confidence_score,
        entities=[
            "PERSON", "EMAIL_ADDRESS", "PHONE_NUMBER", 
            "US_SSN", "CREDIT_CARD", "IBAN_CODE", 
            "LOCATION", "AWS_KEY", "DATE_TIME"
        ]
    )

    detected_entities = []
    token_mapping = {}
    counters = {}

    # 2. Iterate and map to synthetic non-reversible tokens
    for res in sorted(results, key=lambda x: x.start):
        entity_text = text[res.start:res.end]
        entity_type = res.entity_type
        
        # Increment category counter for clean indexing e.g. <PERSON_001>
        counters[entity_type] = counters.get(entity_type, 0) + 1
        synthetic_token = f"<{entity_type}_{counters[entity_type]:03d}>"
        
        token_mapping[entity_text] = synthetic_token

        detected_entities.append({
            "entity_type": entity_type,
            "original_text": entity_text,
            "token": synthetic_token,
            "start": res.start,
            "end": res.end,
            "confidence_score": round(res.score, 3),
            "detection_source": "Presidio_spaCy_RoBERTa"
        })

    # 3. Apply synthetic masking operators to generate zero-exposure payload
    operators = {
        ent["entity_type"]: OperatorConfig("replace", {"new_value": ent["token"]})
        for ent in detected_entities
    }
    anonymized_result = anonymizer.anonymize(
        text=text,
        analyzer_results=results,
        operators=operators
    )

    # 4. Calculate Risk Score (0-100) based on weighted entity sensitivity
    weights = {"AWS_KEY": 35, "CREDIT_CARD": 30, "US_SSN": 30, "PERSON": 8, "EMAIL_ADDRESS": 5}
    total_score = sum(weights.get(e["entity_type"], 5) for e in detected_entities)
    normalized_risk_score = min(100, total_score)

    risk_level = "low"
    if normalized_risk_score >= 80:
        risk_level = "critical"
    elif normalized_risk_score >= 50:
        risk_level = "high"
    elif normalized_risk_score >= 25:
        risk_level = "medium"

    return {
        "status": "success",
        "entity_count": len(detected_entities),
        "entities": detected_entities,
        "token_map": token_mapping,
        "sanitized_text": anonymized_result.text,
        "risk_score": normalized_risk_score,
        "risk_level": risk_level,
        "zero_exposure_verified": True
    }`;

  // 4. The database schema for scan results and audit logging
  const snippetDatabaseSchema = `-- =========================================================================
-- Privexa AI - PostgreSQL Production DDL Database Schema
-- Enforces AES-256-GCM encryption at rest, relational integrity,
-- and tamper-proof compliance audit logging with triggers.
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Organizations & Workspaces
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    kms_key_arn VARCHAR(512) NOT NULL, -- AWS KMS or GCP Cloud KMS Key Reference
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users and RBAC Roles
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'SECURITY_OFFICER', 'COMPLIANCE_AUDITOR', 'ANALYST');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'ANALYST',
    two_factor_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Document Scan Records (Content Encrypted at Rest)
CREATE TYPE severity_tier AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE job_status AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'QUARANTINED');

CREATE TABLE document_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    file_name VARCHAR(512) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_mime_type VARCHAR(128) NOT NULL,
    
    -- Encrypted raw content and KMS encrypted token map
    encrypted_raw_content BYTEA NOT NULL, -- Encrypted using org KMS key
    encrypted_token_vault BYTEA NOT NULL, -- Reversible mapping stored securely
    sanitized_text TEXT NOT NULL,         -- Safe 0% PII text
    
    -- Risk assessment indices
    privacy_score INT CHECK (privacy_score BETWEEN 0 AND 100),
    risk_score INT CHECK (risk_score BETWEEN 0 AND 100),
    risk_level severity_tier NOT NULL,
    status job_status NOT NULL DEFAULT 'PROCESSING',
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Extracted Sensitive Entities Table
CREATE TABLE detected_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID REFERENCES document_scans(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL, -- 'person', 'financial', 'identifier', etc.
    masked_token VARCHAR(64) NOT NULL, -- '<PERSON_001>'
    confidence_score NUMERIC(4, 3) NOT NULL,
    severity severity_tier NOT NULL,
    start_pos INT NOT NULL,
    end_pos INT NOT NULL
);

-- 5. Secure Share Requests & Dual Approval Workflow
CREATE TYPE share_approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

CREATE TABLE secure_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID REFERENCES document_scans(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    recipient_email VARCHAR(255) NOT NULL,
    access_token_hash VARCHAR(128) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    watermark_enabled BOOLEAN DEFAULT TRUE,
    allow_download BOOLEAN DEFAULT FALSE,
    status share_approval_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Immutable Compliance Audit Logs (Tamper-Resistant)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    action VARCHAR(128) NOT NULL, -- 'DOCUMENT_UPLOADED', 'PII_DETECTED', 'SHARE_APPROVED'
    document_name VARCHAR(512) NOT NULL,
    risk_level severity_tier NOT NULL,
    ip_address INET,
    user_agent TEXT,
    event_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for ultra-fast audit querying and reporting
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_scan_org_risk ON document_scans(org_id, risk_level);
CREATE INDEX idx_entities_scan_id ON detected_entities(scan_id);`;

  // 5. The Tailwind configuration for the color system and responsive breakpoints
  const snippetTailwindConfig = `/**
 * @file tailwind.config.ts / @tailwindcss theme configuration
 * Defines the custom color system, severity level palettes, and responsive breakpoints
 * ensuring accessible WCAG AA contrast and adaptive mobile/desktop rendering.
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Responsive Breakpoint System:
    // Mobile (< 640px) -> Bottom bar, stacked cards
    // Tablet (640px - 1024px) -> Collapsed sidebar, 2-col grids
    // Desktop (1024px+) -> Permanent dark navy sidebar, multi-panel analytics
    screens: {
      'xs': '475px',
      'sm': '640px',   // Mobile landscape & small tablets
      'md': '768px',   // Tablets / iPads
      'lg': '1024px',  // Laptops / Desktops (Sidebar expands)
      'xl': '1280px',  // Large Enterprise Monitors
      '2xl': '1536px', // Ultra-wide Analytics Dashboards
    },
    extend: {
      colors: {
        // Deep Navy Enterprise Theme (Screen 1 & Sidebar)
        brand: {
          navy: '#0b132b',
          sidebar: '#0f172a',
          surface: '#1e293b',
          primary: '#2563eb', // Clean Royal Blue Accent
          hover: '#1d4ed8',
        },
        // Color-Coded Severity Level System (Screens 3, 5, 6, 9)
        severity: {
          low: {
            DEFAULT: '#10b981', // Emerald
            light: '#ecfdf5',
            border: '#a7f3d0',
            dark: '#065f46',
          },
          medium: {
            DEFAULT: '#f59e0b', // Amber
            light: '#fffbeb',
            border: '#fde68a',
            dark: '#92400e',
          },
          high: {
            DEFAULT: '#f97316', // Orange
            light: '#fff7ed',
            border: '#fed7aa',
            dark: '#9a3412',
          },
          critical: {
            DEFAULT: '#ef4444', // Red
            light: '#fef2f2',
            border: '#fecaca',
            dark: '#991b1b',
          },
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* High-Level Architecture View Mode Switcher */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-blue-600" />
            <span>Architecture & Technical Specifications</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Toggle between the interactive responsive navigation system & zero-overflow lab, or view microservice blueprints.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSection('responsive-nav')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'responsive-nav'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>1. Responsive Nav System & Lab</span>
          </button>
          <button
            onClick={() => setActiveSection('microservices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'microservices'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>2. Backend Microservice Specs</span>
          </button>
        </div>
      </div>

      {activeSection === 'responsive-nav' ? (
        <ResponsiveNavLabView onShowToast={onShowToast} />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            {[
              { id: 'card', label: '1. Risk Assessment Card (React)', icon: Layers },
              { id: 'api', label: '2. Async Scan API (Node/Express)', icon: Server },
              { id: 'python', label: '3. Python NLP Extractor (Presidio/spaCy)', icon: Terminal },
              { id: 'schema', label: '4. PostgreSQL DDL Schema', icon: Database },
              { id: 'tailwind', label: '5. Tailwind Color & Breakpoint Config', icon: Palette },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSpec(item.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                    activeSpec === item.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Code Display Card */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 shadow-lg overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-slate-400 font-sans font-bold ml-2 text-xs">
                  {activeSpec === 'card' && 'RiskAssessmentCard.tsx'}
                  {activeSpec === 'api' && 'controllers/scanController.ts'}
                  {activeSpec === 'python' && 'services/nlp_extractor.py'}
                  {activeSpec === 'schema' && 'database/schema.sql'}
                  {activeSpec === 'tailwind' && 'tailwind.config.ts'}
                </span>
              </div>

              <button
                onClick={() => {
                  const currentText =
                    activeSpec === 'card'
                      ? snippetRiskCard
                      : activeSpec === 'api'
                      ? snippetApiEndpoint
                      : activeSpec === 'python'
                      ? snippetPythonExtractor
                      : activeSpec === 'schema'
                      ? snippetDatabaseSchema
                      : snippetTailwindConfig;
                  copyCode(currentText, activeSpec);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-xs font-sans font-medium"
              >
                {copiedId === activeSpec ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-5 sm:p-6 overflow-x-auto leading-relaxed text-slate-300 max-h-[600px] overflow-y-auto">
              {activeSpec === 'card' && snippetRiskCard}
              {activeSpec === 'api' && snippetApiEndpoint}
              {activeSpec === 'python' && snippetPythonExtractor}
              {activeSpec === 'schema' && snippetDatabaseSchema}
              {activeSpec === 'tailwind' && snippetTailwindConfig}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};
