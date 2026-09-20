import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Cpu,
  KeyRound,
  Lock,
  LogOut,
  Save,
  Shield,
  Sliders,
} from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onShowToast,
  onLogout,
}) => {
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'general' | 'detection' | 'masking' | 'ai' | 'privacy'>('general');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    onShowToast('Settings successfully saved to database', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header section matching Screen 11 */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure your privacy and security preferences.
        </p>
      </div>

      {/* Tabs matching Screen 11: General, Detection, Masking Rules, AI Provider, Privacy */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'general', label: 'General' },
          { id: 'detection', label: 'Detection' },
          { id: 'masking', label: 'Masking Rules' },
          { id: 'ai', label: 'AI Provider' },
          { id: 'privacy', label: 'Privacy' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Settings Card matching Screen 11 */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Account Settings</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>

                {/* Responsive Tablet & Mobile Sign Out Control */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-slate-800 block text-xs">Active Session</span>
                    <span className="text-[11px] text-slate-400">Signed in as {formData.email}</span>
                  </div>
                  <button
                    type="button"
                    id="settings-signout-btn"
                    onClick={onLogout}
                    className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 active:bg-red-200/80 border border-red-200/80 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label="Sign out of current account"
                  >
                    <LogOut className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Security Settings Card matching Screen 11 */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Security Settings</h3>

              <div className="space-y-4 text-xs">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      Two-Factor Authentication
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Require TOTP authenticator token at login
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, twoFactorAuth: !formData.twoFactorAuth })
                    }
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      formData.twoFactorAuth ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        formData.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Session Timeout */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Session Timeout</span>
                    <span className="text-[11px] text-slate-500">Auto-lock on inactivity</span>
                  </div>
                  <select
                    value={formData.sessionTimeout}
                    onChange={(e) => setFormData({ ...formData, sessionTimeout: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="4 hours">4 hours</option>
                    <option value="8 hours">8 hours</option>
                  </select>
                </div>

                {/* Data Encryption */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Data Encryption</span>
                    <span className="text-[11px] text-slate-500">
                      AES-256-GCM envelope encryption at rest
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, dataEncryption: !formData.dataEncryption })
                    }
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      formData.dataEncryption ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        formData.dataEncryption ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Audit Logging */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Audit Logging</span>
                    <span className="text-[11px] text-slate-500">
                      Immutable append-only trail for compliance
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, auditLogging: !formData.auditLogging })
                    }
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      formData.auditLogging ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        formData.auditLogging ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detection Tab */}
        {activeTab === 'detection' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Entity Detection Sensitivity</h3>
            <p className="text-xs text-slate-500">
              Configure scanner sensitivity thresholds and supported PII identifier classes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2">
              {[
                { name: 'Financial & Payment Cards', desc: 'Credit cards, IBANs, Routing', defaultOn: true },
                { name: 'Government Identifiers', desc: 'SSN, National IDs, Passports', defaultOn: true },
                { name: 'Contact Information', desc: 'Emails, Mobile & Direct Lines', defaultOn: true },
                { name: 'Medical & PHI Records', desc: 'ICD-10, Medical history, RX', defaultOn: true },
                { name: 'Cryptographic Secrets', desc: 'API Keys, JWTs, Private keys', defaultOn: true },
                { name: 'Biometric & Health', desc: 'Facial descriptors, Fingerprints', defaultOn: false },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[11px] text-slate-500">{item.desc}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-blue-100 text-blue-700">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Masking Rules Tab */}
        {activeTab === 'masking' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Token Masking Strategy</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Reversible Tokenization (Hardware KMS)</span>
                  <span className="text-[11px] text-slate-500">Requires dual-key security officer authorization to unmask</span>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800">Enabled</span>
              </div>
              <div className="p-3.5 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Token Format Pattern</span>
                  <span className="text-[11px] text-slate-500">Standard synthetic token format: &lt;ENTITY_CATEGORY_XXX&gt;</span>
                </div>
                <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md">&lt;TYPE_001&gt;</span>
              </div>
            </div>
          </div>
        )}

        {/* AI Provider & Engine Settings Tab Content */}
        {activeTab === 'ai' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">AI Engine Orchestration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 border-2 border-blue-500 bg-blue-50/40 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Gemini 3.8 Flash (Server-Side)
                </span>
                <p className="text-[11px] text-slate-600">
                  Google DeepMind ultra-fast inference with strict server proxy and zero PII exposure.
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-sm">
                  Active
                </span>
              </div>
              <div className="p-3.5 border border-slate-200 rounded-xl space-y-1 opacity-80">
                <span className="font-bold text-slate-800">Microsoft Presidio On-Prem</span>
                <p className="text-[11px] text-slate-500">
                  Local Python FastAPI microservice utilizing spaCy Transformer models.
                </p>
              </div>
              <div className="p-3.5 border border-slate-200 rounded-xl space-y-1 opacity-80">
                <span className="font-bold text-slate-800">AWS Comprehend Medical</span>
                <p className="text-[11px] text-slate-500">
                  Specialized HIPAA-compliant Protected Health Information (PHI) parser.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Data Retention & Governance</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Zero-Storage Policy</span>
                  <span className="text-[11px] text-slate-500">Raw documents are cleared from memory immediately after masking</span>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800">Active</span>
              </div>
              <div className="p-3.5 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Audit Log Retention</span>
                  <span className="text-[11px] text-slate-500">SOC 2 compliant append-only storage</span>
                </div>
                <span className="font-bold text-slate-700">365 Days</span>
              </div>
            </div>
          </div>
        )}

        {/* Save Changes Button matching Screen 11 */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            id="save-settings-btn"
            className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
