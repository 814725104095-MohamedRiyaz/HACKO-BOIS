import React, { useState } from 'react';
import { ShieldCheck, Lock, ExternalLink, FileText, CheckCircle2, X } from 'lucide-react';
import { BRANDING } from '../config/branding';
import { ActiveTab } from '../types';

interface FooterProps {
  onNavigateTab?: (tab: ActiveTab) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onShowToast }) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    onShowToast?.(`Navigating to ${label} documentation...`, 'info');
  };

  return (
    <>
      <footer
        id="app-footer"
        className="w-full bg-white border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-4 shrink-0 transition-colors"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          {/* Left: Logo thumbnail, App name and Copyright */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-start">
            <img
              src={BRANDING.logo.src}
              alt={BRANDING.logo.alt}
              className="w-5 h-5 rounded-md object-contain shadow-2xs"
            />
            <span className="font-bold text-slate-800">{BRANDING.name}</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-500">{BRANDING.copyright}</span>
            <span className="hidden lg:inline text-slate-400">Enterprise Confidential Platform</span>
          </div>

          {/* Right: Operational Status & Actionable Buttons */}
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
            <button
              id="footer-privacy-policy-btn"
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-blue-600 transition-colors font-medium hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>

            <button
              id="footer-security-cert-btn"
              type="button"
              onClick={() => setShowCertModal(true)}
              className="hover:text-blue-600 transition-colors font-medium hover:underline cursor-pointer"
            >
              Certifications & SOC 2
            </button>

            {onNavigateTab && (
              <button
                id="footer-specs-btn"
                type="button"
                onClick={() => onNavigateTab('specs')}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
              >
                Architecture Specs
              </button>
            )}

            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zero-Exposure Protected</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <img
                  src={BRANDING.logo.src}
                  alt={BRANDING.logo.alt}
                  className="w-6 h-6 rounded-md object-contain"
                />
                <h3 className="text-base font-bold text-slate-900">
                  {BRANDING.name} Privacy Guarantee
                </h3>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-72 overflow-y-auto pr-1">
              <p>
                <strong>Zero-Exposure Guarantee:</strong> {BRANDING.name} processes all user documents
                through an on-premises or private sandbox tokenization pipeline. No Personally
                Identifiable Information (PII), payment credentials, or national identifiers ever leave
                the local perimeter unmasked.
              </p>
              <p>
                <strong>Cryptographic Key Management:</strong> Token reversible maps are sealed within
                FIPS 140-2 Level 3 hardware security modules (HSM) with AES-256-GCM envelope encryption.
              </p>
              <p>
                <strong>Audit Compliance:</strong> Every document inspection, tokenization cycle, and
                de-identification event is logged into an immutable append-only audit trail.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Certifications Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Compliance & Certifications</h3>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">SOC 2 Type II Certified</p>
                  <p className="text-[11px] text-slate-500">Security, Availability, & Confidentiality Trust Criteria</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">HIPAA & HITECH Compliant</p>
                  <p className="text-[11px] text-slate-500">PHI de-identification under Safe Harbor & Expert Determination</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">GDPR & CCPA/CPRA Privacy Ready</p>
                  <p className="text-[11px] text-slate-500">Right to be forgotten and data minimization enforcement</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
