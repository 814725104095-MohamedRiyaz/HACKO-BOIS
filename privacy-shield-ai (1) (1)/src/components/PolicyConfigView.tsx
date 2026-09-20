import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  Plus,
  Save,
  Shield,
  ShieldAlert,
  Sliders,
  Trash2,
} from 'lucide-react';
import { EntityCategory, PolicyRule, SeverityLevel } from '../types';

interface PolicyConfigViewProps {
  policies: PolicyRule[];
  onUpdatePolicies: (updated: PolicyRule[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const PolicyConfigView: React.FC<PolicyConfigViewProps> = ({
  policies,
  onUpdatePolicies,
  onShowToast,
}) => {
  const [ruleList, setRuleList] = useState<PolicyRule[]>(policies);
  const [editingRule, setEditingRule] = useState<PolicyRule | null>(null);

  const toggleRule = (id: string) => {
    const next = ruleList.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    setRuleList(next);
    onUpdatePolicies(next);
    onShowToast('Policy state updated', 'info');
  };

  const handleSaveRule = (updated: PolicyRule) => {
    const next = ruleList.map((r) => (r.id === updated.id ? updated : r));
    setRuleList(next);
    onUpdatePolicies(next);
    setEditingRule(null);
    onShowToast('Policy configuration saved', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Policy Configuration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Customize organizational detection rules, confidence thresholds, and automated enforcement actions.
          </p>
        </div>

        <button
          onClick={() => {
            const newRule: PolicyRule = {
              id: `pol-${Date.now()}`,
              name: 'Custom Regulatory Matcher',
              category: 'confidential',
              description: 'Custom regex pattern matching proprietary organizational identifiers.',
              enabled: true,
              severity: 'high',
              minConfidence: 0.9,
              action: 'mask',
              regexPattern: '[A-Z]{3}-\\d{6}',
            };
            setRuleList([newRule, ...ruleList]);
            setEditingRule(newRule);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Policy Rule</span>
        </button>
      </div>

      {/* Policy Rules List */}
      <div className="space-y-4">
        {ruleList.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white p-5 rounded-2xl border transition-all ${
              rule.enabled
                ? 'border-slate-200 shadow-2xs'
                : 'border-slate-150 bg-slate-50/50 opacity-70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    rule.severity === 'critical'
                      ? 'bg-red-50 text-red-600'
                      : rule.severity === 'high'
                      ? 'bg-orange-50 text-orange-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {rule.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rule.severity === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : rule.severity === 'high'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {rule.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 capitalize">
                      Action: {rule.action}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{rule.description}</p>
                  {rule.regexPattern && (
                    <p className="text-[11px] font-mono text-blue-600 mt-1 bg-blue-50/60 inline-block px-2 py-0.5 rounded-sm">
                      Regex: /{rule.regexPattern}/
                    </p>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right text-xs mr-2 hidden md:block">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Confidence Cutoff
                  </span>
                  <span className="font-bold text-slate-700">
                    {Math.round(rule.minConfidence * 100)}%
                  </span>
                </div>

                <button
                  onClick={() => setEditingRule(rule)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Edit
                </button>

                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    rule.enabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      rule.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">
              Configure Detection Policy
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={editingRule.description}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={editingRule.severity}
                    onChange={(e) => setEditingRule({ ...editingRule, severity: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Action</label>
                  <select
                    value={editingRule.action}
                    onChange={(e) => setEditingRule({ ...editingRule, action: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="mask">Mask (Synthetic Token)</option>
                    <option value="block">Block Document</option>
                    <option value="quarantine">Quarantine & Notify</option>
                    <option value="alert">Alert Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Regex Pattern (Optional)</label>
                <input
                  type="text"
                  value={editingRule.regexPattern || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, regexPattern: e.target.value })}
                  placeholder="[A-Z]{3}-\\d{6}"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono text-xs focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const next = ruleList.filter((r) => r.id !== editingRule.id);
                  setRuleList(next);
                  onUpdatePolicies(next);
                  setEditingRule(null);
                  onShowToast('Policy rule deleted', 'info');
                }}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveRule(editingRule)}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Policy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
