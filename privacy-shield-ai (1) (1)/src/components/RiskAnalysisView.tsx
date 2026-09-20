import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileCheck,
  IdCard,
  Lock,
  Phone,
  Shield,
  ShieldAlert,
  User,
} from 'lucide-react';
import { DocumentScanResult } from '../types';

interface RiskAnalysisViewProps {
  scan: DocumentScanResult;
  onNext: () => void;
  onNavigateTab: (tab: any) => void;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  scan,
  onNext,
  onNavigateTab,
}) => {
  const score = scan.riskScore || 86;
  const breakdown = scan.riskBreakdown;

  // Circumference for radial gauge
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header section matching Screen 6 */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Risk Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overall risk level based on detected entities and sensitivity.
          </p>
        </div>

        <button
          id="risk-next-btn"
          onClick={onNext}
          className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Score & Breakdown Card matching Screen 6 */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Radial Score Gauge matching Screen 6 */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/70 rounded-2xl border border-slate-100">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth="14"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  {score}
                </span>
                <span className="text-sm font-semibold text-slate-400">/100</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Total
              </span>
            </div>
          </div>

          <div className="mt-4">
            <span className="inline-block px-5 py-1.5 text-xs font-extrabold tracking-wider uppercase text-white bg-red-600 rounded-lg shadow-xs">
              CRITICAL
            </span>
          </div>
        </div>

        {/* Risk Breakdown Progress Bars matching Screen 6 */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Risk Breakdown
            </h3>
            <span className="text-xs text-slate-400 font-medium">Weighted Sensitivity</span>
          </div>

          {/* Financial Data Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-slate-800">Financial Data</span>
              </span>
              <span className="font-bold text-slate-900">{breakdown.financial}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-red-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.financial}%` }}
              />
            </div>
          </div>

          {/* Government ID Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span className="flex items-center gap-2">
                <IdCard className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-slate-800">Government ID</span>
              </span>
              <span className="font-bold text-slate-900">{breakdown.governmentId}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.governmentId}%` }}
              />
            </div>
          </div>

          {/* Personal Info Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-800">Personal Info</span>
              </span>
              <span className="font-bold text-slate-900">{breakdown.personalInfo}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.personalInfo}%` }}
              />
            </div>
          </div>

          {/* Contact Info Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-slate-800">Contact Info</span>
              </span>
              <span className="font-bold text-slate-900">{breakdown.contactInfo}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.contactInfo}%` }}
              />
            </div>
          </div>

          {/* Other Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" />
                <span className="font-semibold text-slate-800">Other / Infrastructure</span>
              </span>
              <span className="font-bold text-slate-900">{breakdown.other}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.other}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Details matching Screen 6 bottom section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Level Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Risk Level</h3>
          <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>Critical</span>
            </div>
            <p className="text-xs text-red-900 leading-relaxed">
              Your data contains highly sensitive information (payment cards, SSN, confidential financial routing).
              The system requires mandatory token masking before any AI processing or team distribution.
            </p>
          </div>
        </div>

        {/* Key Findings Checklist */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Key Findings</h3>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>Financial information detected (credit card PAN & routing)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>Multiple personal identifiers detected (national ID / SSN)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
              <span>Contact information detected (emails & direct phone lines)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>Sensitive values were present in the document requiring tokenization</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
