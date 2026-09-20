import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  FileCode,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { DocumentScanResult } from '../types';

interface MaskingPreviewViewProps {
  scan: DocumentScanResult;
  onNext: () => void;
  onNavigateTab: (tab: any) => void;
}

export const MaskingPreviewView: React.FC<MaskingPreviewViewProps> = ({
  scan,
  onNext,
  onNavigateTab,
}) => {
  const [viewMode, setViewMode] = useState<'tokens' | 'document'>('tokens');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [maskReversible, setMaskReversible] = useState(true);

  // Derive unique mapped entity pairs
  const tokenPairs = Object.entries(scan.tokenMap).slice(0, 8);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const getTokenColor = (token: string) => {
    if (token.includes('PERSON')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (token.includes('EMAIL')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    if (token.includes('PHONE')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (token.includes('LOCATION')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (token.includes('IDENTIFIER')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (token.includes('FINANCIAL')) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header matching Screen 7 */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Masking Preview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sensitive information will be replaced with tokens before AI processing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle between token table and full document comparison */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('tokens')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'tokens' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Token Pairs
            </button>
            <button
              onClick={() => setViewMode('document')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'document' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Full Document
            </button>
          </div>

          <button
            id="masking-next-btn"
            onClick={onNext}
            className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Token Mapping View matching Screen 7 */}
      {viewMode === 'tokens' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 py-3.5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">
            <div>Original Data</div>
            <div>Protected Data (Tokens)</div>
          </div>

          <div className="divide-y divide-slate-100 p-2 sm:p-4 space-y-2">
            {tokenPairs.length > 0 ? (
              tokenPairs.map(([original, token], idx) => {
                const badgeStyle = getTokenColor(token);
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 rounded-xl hover:bg-slate-50/80 transition-colors items-center"
                  >
                    {/* Original value */}
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-slate-800 break-all">
                      <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                      <span>{original}</span>
                    </div>

                    {/* Masked Token Badge matching Screen 7 */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold rounded-lg border shadow-2xs ${badgeStyle}`}
                      >
                        <Lock className="w-3 h-3 shrink-0" />
                        {token}
                      </span>

                      <button
                        onClick={() => handleCopy(token, `token-${idx}`)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                        title="Copy token"
                      >
                        {copiedKey === `token-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                No sensitive token substitutions required for this document.
              </div>
            )}
          </div>

          {/* Footer Bar matching Screen 7 */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Token Mapping (Stored Securely in Hardware KMS)</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>Reversible by Authorized Security Officers only</span>
            </div>
          </div>
        </div>
      ) : (
        /* Full Sanitized Document Side-by-Side */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Original Document Content
            </h3>
            <pre className="p-3.5 bg-slate-50 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed border border-slate-200">
              {scan.rawText}
            </pre>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Sanitized Payload for AI (0% PII)
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                Safe to Process
              </span>
            </div>
            <pre className="p-3.5 bg-blue-50/40 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed border border-blue-200">
              {scan.sanitizedText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
