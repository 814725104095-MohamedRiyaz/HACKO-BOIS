import React from 'react';
import {
  AlertOctagon,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Cpu,
  FileCheck,
  FileText,
  Lock,
  Plus,
  Shield,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { DonutChart, DonutSegment } from './DonutChart';
import { DocumentScanResult } from '../types';
import { Logo } from './Logo';
import { BRANDING } from '../config/branding';

interface DashboardViewProps {
  currentScan: DocumentScanResult;
  onNavigateTab: (tab: any) => void;
  onSelectDocument: (docName: string) => void;
  userName?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentScan,
  onNavigateTab,
  onSelectDocument,
  userName = 'Riyaz',
}) => {
  // Stat values matching Screen 3 mockup
  const stats = [
    {
      id: 'stat-docs',
      label: 'Documents Analyzed',
      value: '12',
      trend: '+ 20% from last week',
      trendPositive: true,
      icon: FileCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'stat-pii',
      label: 'PII Detected',
      value: '48',
      trend: '+ 30% from last week',
      trendPositive: true,
      icon: ShieldAlert,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      id: 'stat-risk',
      label: 'High-Risk Documents',
      value: '3',
      trend: '+ 50% from last week',
      trendPositive: false,
      icon: AlertOctagon,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      id: 'stat-protect',
      label: 'Protected Data',
      value: '100%',
      sublabel: 'No exposure to AI',
      trend: 'Zero Leakage',
      trendPositive: true,
      icon: Lock,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  // Donut chart segments for Risk Level Distribution matching Screen 3
  const riskDistributionSegments: DonutSegment[] = [
    { label: 'Low', value: 5, color: '#10b981' },
    { label: 'Medium', value: 4, color: '#f59e0b' },
    { label: 'High', value: 2, color: '#f97316' },
    { label: 'Critical', value: 1, color: '#ef4444' },
  ];

  // Recent activity items matching Screen 3 mockup
  const recentActivities = [
    {
      fileName: 'Report.pdf',
      action: 'analyzed',
      time: '2 hours ago',
      riskLevel: 'Critical',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      iconColor: 'text-red-500',
    },
    {
      fileName: 'Financial_data.csv',
      action: 'analyzed',
      time: '4 hours ago',
      riskLevel: 'High',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      iconColor: 'text-orange-500',
    },
    {
      fileName: 'Personal_info.docx',
      action: 'analyzed',
      time: '6 hours ago',
      riskLevel: 'Medium',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      iconColor: 'text-amber-500',
    },
    {
      fileName: 'Project_details.pdf',
      action: 'analyzed',
      time: '8 hours ago',
      riskLevel: 'Low',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-500',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner with Privexa AI Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <Logo size="lg" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Welcome back, {userName}
              </h2>
              <span className="text-2xl select-none">👋</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {BRANDING.name} is active. Zero PII will be exposed during AI analysis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="quick-scan-btn"
            onClick={() => onNavigateTab('upload')}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Scan Document</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              id={item.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 tracking-wide">
                  {item.label}
                </span>
                <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {item.value}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs">
                {item.trendPositive ? (
                  <span className="text-emerald-600 font-semibold flex items-center">
                    ↑ {item.trend}
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold flex items-center">
                    ↑ {item.trend}
                  </span>
                )}
                {item.sublabel && (
                  <span className="text-slate-400 font-medium ml-auto">({item.sublabel})</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Section matching Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Risk Level Distribution Donut */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Risk Level Distribution
              </h3>
              <p className="text-xs text-slate-500">Breakdown across 12 analyzed documents</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
              Live
            </span>
          </div>

          {/* Donut Chart Component */}
          <div className="my-auto py-4">
            <DonutChart
              segments={riskDistributionSegments}
              totalLabel="Documents"
              totalValue={12}
              size={210}
              strokeWidth={30}
              showLegend={true}
            />
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Critical quarantine threshold: ≥ 80 score</span>
            <button
              onClick={() => onNavigateTab('policies')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Configure thresholds →
            </button>
          </div>
        </div>

        {/* Right Column: Recent Activity List */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Activity</h3>
              <p className="text-xs text-slate-500">Recent documents scanned and tokenized</p>
            </div>
            <button
              onClick={() => onNavigateTab('audit-logs')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View all audit logs
            </button>
          </div>

          <div className="space-y-3 my-auto">
            {recentActivities.map((act, index) => (
              <div
                key={index}
                onClick={() => {
                  onSelectDocument(act.fileName);
                  onNavigateTab('pii-detection');
                }}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {act.fileName}{' '}
                      <span className="font-normal text-slate-500">{act.action}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {act.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md border ${act.badgeColor}`}
                  >
                    {act.riskLevel}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Currently inspecting: {currentScan.fileName}</span>
            <button
              onClick={() => onNavigateTab('pii-detection')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Open PII View →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
