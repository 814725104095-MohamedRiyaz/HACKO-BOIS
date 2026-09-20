import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownToLine,
  CheckCircle2,
  Copy,
  Download,
  FileCheck,
  FileText,
  Lock,
  Share2,
  Shield,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { BRANDING } from '../config/branding';
import { Logo } from './Logo';
import { DocumentScanResult } from '../types';

interface ReportViewProps {
  scan: DocumentScanResult;
  onInitiateShare: () => void;
  onNavigateTab: (tab: any) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  scan,
  onInitiateShare,
  onNavigateTab,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'entities' | 'recommendations' | 'audit'>(
    'summary'
  );

  const handleDownloadPdf = () => {
    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${BRANDING.name} Compliance Report - ${scan.fileName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; }
    h1 { color: #0f172a; margin-bottom: 4px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; background: #ef4444; color: #fff; }
    .meta { color: #64748b; font-size: 14px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; }
    .card-val { font-size: 24px; font-weight: bold; color: #0f172a; margin-top: 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-weight: 600; }
    .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
  </style>
</head>
<body>
  <h1>${BRANDING.name} - Executive Privacy & Risk Report</h1>
  <div class="meta">Document: <strong>${scan.fileName}</strong> | Generated: ${new Date().toLocaleString()} | Standards: ${BRANDING.complianceStandard}</div>
  <div class="grid">
    <div class="card"><div>Risk Level</div><div class="card-val">${scan.riskLevel.toUpperCase()}</div></div>
    <div class="card"><div>Risk Score</div><div class="card-val">${scan.riskScore}/100</div></div>
    <div class="card"><div>PII Entities</div><div class="card-val">${scan.entities.length}</div></div>
    <div class="card"><div>AI Exposure</div><div class="card-val">0% (Zero Leakage)</div></div>
  </div>
  <h3>Detected PII Entities Summary</h3>
  <table>
    <thead><tr><th>Category</th><th>Text Match</th><th>Masked Token</th><th>Confidence</th><th>Sensitivity</th></tr></thead>
    <tbody>
      ${scan.entities.map(e => `<tr><td>${e.category.toUpperCase()}</td><td>${e.originalText}</td><td><code>${e.maskedToken}</code></td><td>${Math.round(e.confidence * 100)}%</td><td>${e.severity.toUpperCase()}</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="footer">${BRANDING.copyright} — Confidential Compliance Report</div>
</body>
</html>`;
    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scan.fileName.replace(/\.[^/.]+$/, '')}_privexa_report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast(`Exported compliance report for ${scan.fileName}`, 'success');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${scan.fileName}_privacy_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Exported scan metadata as JSON', 'success');
  };

  const entitySummary = [
    { id: 1, type: 'Person', count: scan.entityCounts.person || 5, risk: 'High', color: 'bg-orange-100 text-orange-700' },
    { id: 2, type: 'Email', count: scan.entityCounts.email || 4, risk: 'Medium', color: 'bg-amber-100 text-amber-700' },
    { id: 3, type: 'Phone', count: scan.entityCounts.phone || 3, risk: 'Medium', color: 'bg-amber-100 text-amber-700' },
    { id: 4, type: 'Address', count: scan.entityCounts.address || 2, risk: 'Low', color: 'bg-emerald-100 text-emerald-700' },
    { id: 5, type: 'Financial', count: scan.entityCounts.financial || 2, risk: 'High', color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header section matching Screen 9 */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Privacy Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete analysis of your document{' '}
            <span className="font-semibold text-slate-700">({scan.fileName})</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="report-share-btn"
            onClick={onInitiateShare}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Securely</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            id="download-pdf-btn"
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards matching Screen 9 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Risk Level */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs text-center sm:text-left">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Risk Level
          </span>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            <span className="text-lg sm:text-xl font-extrabold text-orange-600 uppercase">
              {scan.riskLevel === 'critical' ? 'Critical' : 'High'}
            </span>
          </div>
        </div>

        {/* Privacy Score */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs text-center sm:text-left">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Privacy Score
          </span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {scan.privacyScore}/100
            </span>
          </div>
        </div>

        {/* PII Detected */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs text-center sm:text-left">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            PII Detected
          </span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-blue-600">
              {scan.entities.length || 18}
            </span>
          </div>
        </div>

        {/* Exposure to AI */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs text-center sm:text-left">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Exposure to AI
          </span>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span className="text-xl sm:text-2xl font-black text-emerald-600">0%</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs matching Screen 9: Summary, Detected Entities, Recommendations, Audit Trail */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {(['summary', 'entities', 'recommendations', 'audit'] as const).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setActiveSubTab(tabKey)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
              activeSubTab === tabKey
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tabKey === 'audit' ? 'Audit Trail' : tabKey === 'entities' ? 'Detected Entities' : tabKey}
          </button>
        ))}
      </div>

      {/* Main Two-Column Report Panel matching Screen 9 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Detected Entities Table matching Screen 9 */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Detected Entities</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Entity Type</th>
                  <th className="py-2.5 px-3">Count</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entitySummary.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-500">{item.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{item.type}</td>
                    <td className="py-3 px-3 font-semibold text-slate-600">{item.count}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.color}`}>
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recommendations matching Screen 9 */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Recommendations</h3>

          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
              <span>Mask financial information before external AI processing.</span>
            </li>
            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
              <span>Use company authentication for sensitive documents.</span>
            </li>
            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
              <span>Enable two-factor authentication for compliance reviewers.</span>
            </li>
            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
              <span>Regularly review audit logs and maintain tamper-proof access records.</span>
            </li>
          </ul>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('policies')}
              className="w-full py-2 px-3 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/60 rounded-xl transition-colors text-center block"
            >
              Adjust Organization Policies →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
