import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Eye,
  KeyRound,
  Link as LinkIcon,
  Lock,
  Share2,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentScanResult, SecureShareRequest } from '../types';

interface SecureShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  scan: DocumentScanResult;
  onShareCreated: (req: SecureShareRequest) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const SecureShareModal: React.FC<SecureShareModalProps> = ({
  isOpen,
  onClose,
  scan,
  onShareCreated,
  onShowToast,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('external-partner@cloudaudit.com');
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [allowDownload, setAllowDownload] = useState(false);
  const [requireTwoPartyApproval, setRequireTwoPartyApproval] = useState(scan.riskLevel === 'critical');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'none' | 'pending' | 'approved'>('none');

  if (!isOpen) return null;

  const handleGenerateShare = (e: React.FormEvent) => {
    e.preventDefault();
    const shareId = `share-${Date.now().toString(36)}`;
    const link = `https://privexa-ai.enterprise.internal/share/${shareId}?doc=${encodeURIComponent(
      scan.fileName
    )}`;
    setGeneratedLink(link);

    const shareReq: SecureShareRequest = {
      id: shareId,
      documentId: scan.id,
      documentName: scan.fileName,
      requesterEmail: 'riyaz@gmail.com',
      recipientEmail,
      expiresInHours,
      watermarkEnabled,
      allowDownload,
      requireTwoPartyApproval,
      status: requireTwoPartyApproval ? 'Pending' : 'Approved',
      createdAt: new Date().toISOString(),
      riskLevel: scan.riskLevel,
    };

    onShareCreated(shareReq);
    setApprovalStatus(requireTwoPartyApproval ? 'pending' : 'approved');

    if (!requireTwoPartyApproval) {
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      onShowToast('Secure encrypted share link generated!', 'success');
    } else {
      onShowToast('Share request submitted for Compliance Officer approval', 'info');
    }
  };

  const handleSimulateApproval = () => {
    setApprovalStatus('approved');
    try {
      confetti({ particleCount: 65, spread: 70, origin: { y: 0.65 } });
    } catch (e) {}
    onShowToast('Security Officer approved the external share access request!', 'success');
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    onShowToast('Encrypted link copied to clipboard', 'success');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Secure Sharing Workflow</h3>
              <p className="text-[11px] text-slate-500">
                Target: <span className="font-semibold text-slate-800">{scan.fileName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning if High or Critical Risk */}
        {scan.riskLevel === 'critical' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-900">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Critical Risk Document:</span> Two-party security officer
              approval is required prior to external link activation.
            </div>
          </div>
        )}

        {!generatedLink ? (
          <form onSubmit={handleGenerateShare} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Authorized Recipient Email
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="partner@external-org.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Link Expiration</label>
                <select
                  value={expiresInHours}
                  onChange={(e) => setExpiresInHours(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium"
                >
                  <option value={1}>1 Hour</option>
                  <option value={24}>24 Hours</option>
                  <option value={72}>3 Days</option>
                  <option value={168}>7 Days</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Access Mode</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-medium">
                  Masked Tokens Only
                </div>
              </div>
            </div>

            {/* Security Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Dynamic Watermarking</span>
                  <span className="text-[11px] text-slate-500">
                    Embeds recipient email & timestamp onto view
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={watermarkEnabled}
                  onChange={(e) => setWatermarkEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">Allow Raw Download</span>
                  <span className="text-[11px] text-slate-500">
                    If disabled, document remains view-only in secure browser
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Two-Party Security Officer Approval
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Enforces dual-key compliance sign-off
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={requireTwoPartyApproval}
                  onChange={(e) => setRequireTwoPartyApproval(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Create Secure Link</span>
              </button>
            </div>
          </form>
        ) : (
          /* Share Link Result and Approval Box */
          <div className="space-y-4 text-xs">
            {approvalStatus === 'pending' ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <Clock className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Awaiting Compliance Officer Sign-off</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  A request notification has been sent to the Security Officer queue. The link remains locked until approval.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleSimulateApproval}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shadow-xs"
                  >
                    Simulate Officer Approval →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Share Approved & Link Active</span>
                </div>
                <p className="text-emerald-900 text-[11px]">
                  All sensitive PII is masked with synthetic tokens. Watermarking is enabled for {recipientEmail}.
                </p>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Encrypted Sharing Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px] outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
