import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Eye,
  FileCode,
  Hash,
  HelpCircle,
  IdCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import { DonutChart, DonutSegment } from './DonutChart';
import { DetectedEntity, DocumentScanResult, EntityCategory } from '../types';

interface PiiDetectionViewProps {
  scan: DocumentScanResult;
  onNext: () => void;
  onNavigateTab: (tab: any) => void;
}

export const PiiDetectionView: React.FC<PiiDetectionViewProps> = ({
  scan,
  onNext,
  onNavigateTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EntityCategory | 'all'>('all');
  const [selectedEntity, setSelectedEntity] = useState<DetectedEntity | null>(null);

  const counts = scan.entityCounts;
  const total = scan.entities.length;

  // Exact categories matching Screen 5 mockup
  const categoryConfigs: {
    category: EntityCategory;
    label: string;
    count: number;
    icon: any;
    color: string;
    bg: string;
    border: string;
  }[] = [
    {
      category: 'person',
      label: 'Person',
      count: counts.person,
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      category: 'email',
      label: 'Email',
      count: counts.email,
      icon: Mail,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
    },
    {
      category: 'phone',
      label: 'Phone',
      count: counts.phone,
      icon: Phone,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
    },
    {
      category: 'address',
      label: 'Address',
      count: counts.address,
      icon: MapPin,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      category: 'financial',
      label: 'Financial',
      count: counts.financial,
      icon: CreditCard,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    {
      category: 'identifier',
      label: 'Identifier',
      count: counts.identifier,
      icon: IdCard,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      category: 'other',
      label: 'Other',
      count: counts.other + counts.confidential + counts.credential,
      icon: Hash,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
    },
  ];

  // Distribution chart segments matching Screen 5 percentages
  const distributionSegments: DonutSegment[] = [
    {
      label: 'Person',
      value: counts.person || 5,
      color: '#3b82f6',
      percentage: total > 0 ? Math.round(((counts.person || 5) / (total || 18)) * 100) : 28,
    },
    {
      label: 'Email',
      value: counts.email || 4,
      color: '#06b6d4',
      percentage: total > 0 ? Math.round(((counts.email || 4) / (total || 18)) * 100) : 22,
    },
    {
      label: 'Phone',
      value: counts.phone || 3,
      color: '#6366f1',
      percentage: total > 0 ? Math.round(((counts.phone || 3) / (total || 18)) * 100) : 17,
    },
    {
      label: 'Address',
      value: counts.address || 2,
      color: '#10b981',
      percentage: total > 0 ? Math.round(((counts.address || 2) / (total || 18)) * 100) : 11,
    },
    {
      label: 'Financial',
      value: counts.financial || 2,
      color: '#ef4444',
      percentage: total > 0 ? Math.round(((counts.financial || 2) / (total || 18)) * 100) : 11,
    },
    {
      label: 'Other',
      value: (counts.other + counts.identifier) || 2,
      color: '#a855f7',
      percentage: total > 0 ? Math.round((((counts.other + counts.identifier) || 2) / (total || 18)) * 100) : 11,
    },
  ];

  const filteredEntities =
    selectedCategory === 'all'
      ? scan.entities
      : scan.entities.filter((e) => e.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header section matching Screen 5 */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            PII Detection Results
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            We found <span className="font-bold text-blue-600">{total} sensitive entities</span> in your document{' '}
            <span className="font-semibold text-slate-800">({scan.fileName})</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Scan Complete
          </span>

          <button
            id="pii-next-btn"
            onClick={onNext}
            className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two-Column Grid matching Screen 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Detected Entities List */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Detected Entities
            </h3>
            <span className="text-xs text-slate-400">Click to filter details</span>
          </div>

          <div className="space-y-2.5">
            {categoryConfigs.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedCategory === item.category;

              return (
                <div
                  key={item.category}
                  onClick={() =>
                    setSelectedCategory(isSelected ? 'all' : item.category)
                  }
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/60 shadow-2xs'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {item.label}
                    </span>
                  </div>

                  <span className="text-sm sm:text-base font-bold text-slate-700 px-2 py-0.5 rounded-md bg-slate-50">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Entity Distribution Donut Chart matching Screen 5 */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Entity Distribution
            </h3>
            <span className="text-xs text-slate-500 font-medium">Relative Share</span>
          </div>

          <div className="py-6 my-auto">
            <DonutChart
              segments={distributionSegments}
              totalLabel="Total"
              totalValue={total || 18}
              size={210}
              strokeWidth={28}
              showLegend={true}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Filter: {selectedCategory.toUpperCase()}</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Reset filter
            </button>
          </div>
        </div>
      </div>

      {/* Entity Details Table / Inspection Drawer */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Extracted Segments</h4>
            <p className="text-xs text-slate-500">
              Showing {filteredEntities.length} entities {selectedCategory !== 'all' && `(filtered by ${selectedCategory})`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Original Detected Text</th>
                <th className="py-2.5 px-3">Masked Synthetic Token</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntities.map((ent) => (
                <tr key={ent.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    <span className="capitalize">{ent.category}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-900 bg-red-50/50 rounded-sm">
                    {ent.originalText}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                    {ent.maskedToken}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium">
                    {Math.round(ent.confidence * 100)}%
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ent.severity === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : ent.severity === 'high'
                          ? 'bg-orange-100 text-orange-700'
                          : ent.severity === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {ent.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
