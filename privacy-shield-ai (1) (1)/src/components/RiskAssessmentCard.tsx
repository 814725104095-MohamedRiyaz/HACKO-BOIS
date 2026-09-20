/**
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
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  IdCard,
  Lock,
  Phone,
  Shield,
  ShieldAlert,
  User,
} from 'lucide-react';
import { DocumentScanResult, SeverityLevel } from '../types';

interface RiskAssessmentCardProps {
  scan: DocumentScanResult;
  onProceedToMasking?: () => void;
  onGenerateReport?: () => void;
  onInitiateShare?: () => void;
  compact?: boolean;
}

export const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({
  scan,
  onProceedToMasking,
  onGenerateReport,
  onInitiateShare,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Derive visual configuration based on severity level
  const getSeverityConfig = (level: SeverityLevel) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          badgeBg: 'bg-red-600',
          badgeText: 'text-white',
          ring: 'ring-red-500/20',
          icon: ShieldAlert,
          label: 'CRITICAL',
          description: 'Contains high-exposure credentials, payment records, or national identifiers.',
        };
      case 'high':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          badgeBg: 'bg-orange-500',
          badgeText: 'text-white',
          ring: 'ring-orange-500/20',
          icon: AlertTriangle,
          label: 'HIGH RISK',
          description: 'Contains personal contact data and sensitive operational records.',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          badgeBg: 'bg-amber-500',
          badgeText: 'text-white',
          ring: 'ring-amber-500/20',
          icon: AlertTriangle,
          label: 'MEDIUM RISK',
          description: 'Identified moderate non-critical personal references.',
        };
      case 'low':
      default:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          badgeBg: 'bg-emerald-600',
          badgeText: 'text-white',
          ring: 'ring-emerald-500/20',
          icon: CheckCircle2,
          label: 'LOW RISK',
          description: 'Minimal to zero sensitive entities discovered.',
        };
    }
  };

  const severity = getSeverityConfig(scan.riskLevel);
  const SeverityIcon = severity.icon;

  return (
    <div
      id={`risk-card-${scan.id}`}
      className={`w-full bg-white rounded-xl border ${severity.border} shadow-sm transition-all duration-200 overflow-hidden`}
    >
      {/* Primary Header Card Section */}
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${severity.bg} ${severity.text}`}
            >
              <SeverityIcon className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {scan.fileName}
                </h3>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${severity.badgeBg} ${severity.badgeText}`}
                >
                  {severity.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                {severity.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <div className="text-left sm:text-right">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Risk Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {scan.riskScore}
                </span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div className="text-left sm:text-right">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Entities
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-600">
                {scan.entities.length}
              </span>
            </div>

            <button
              id={`toggle-btn-${scan.id}`}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-1"
              aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Detailed Section */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Radial Score Gauge Column (Screen 6 visual) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke={scan.riskLevel === 'critical' ? '#ef4444' : scan.riskLevel === 'high' ? '#f97316' : '#f59e0b'}
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - scan.riskScore / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900">{scan.riskScore}</span>
                    <span className="text-xs font-semibold text-slate-400">/100</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Total
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <span
                  className={`inline-block px-4 py-1 text-xs font-bold uppercase rounded-md shadow-xs ${severity.badgeBg} ${severity.badgeText}`}
                >
                  {severity.label}
                </span>
              </div>
            </div>

            {/* Risk Breakdown Progress Bars Column */}
            <div className="lg:col-span-8 flex flex-col justify-center space-y-3.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Risk Breakdown</span>
                <span className="text-[11px] font-medium text-slate-400">Weighted Sensitivity</span>
              </h4>

              {/* Financial Data Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-red-500" /> Financial Data
                  </span>
                  <span className="font-semibold text-slate-900">
                    {scan.riskBreakdown.financial}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${scan.riskBreakdown.financial}%` }}
                  />
                </div>
              </div>

              {/* Government ID Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5 text-orange-500" /> Government ID
                  </span>
                  <span className="font-semibold text-slate-900">
                    {scan.riskBreakdown.governmentId}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${scan.riskBreakdown.governmentId}%` }}
                  />
                </div>
              </div>

              {/* Personal Info Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-500" /> Personal Info
                  </span>
                  <span className="font-semibold text-slate-900">
                    {scan.riskBreakdown.personalInfo}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${scan.riskBreakdown.personalInfo}%` }}
                  />
                </div>
              </div>

              {/* Contact Info Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-500" /> Contact Info
                  </span>
                  <span className="font-semibold text-slate-900">
                    {scan.riskBreakdown.contactInfo}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${scan.riskBreakdown.contactInfo}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {isExpanded && (
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Exposure to external AI guaranteed</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onInitiateShare && (
              <button
                id={`share-btn-${scan.id}`}
                onClick={onInitiateShare}
                className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              >
                Share Securely
              </button>
            )}

            {onGenerateReport && (
              <button
                id={`report-btn-${scan.id}`}
                onClick={onGenerateReport}
                className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Full Report
              </button>
            )}

            {onProceedToMasking && (
              <button
                id={`mask-btn-${scan.id}`}
                onClick={onProceedToMasking}
                className="flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" /> Mask & Analyze
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
