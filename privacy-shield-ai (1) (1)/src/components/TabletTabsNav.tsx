import React, { useRef, useEffect } from 'react';
import {
  BarChart3,
  Code2,
  FileText,
  LayoutDashboard,
  ListChecks,
  Settings,
  ShieldAlert,
  UploadCloud,
  Users,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface TabletTabsNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const TabletTabsNav: React.FC<TabletTabsNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload', icon: UploadCloud },
    { id: 'pii-detection', label: 'Docs', icon: FileText },
    { id: 'risk-analysis', label: 'Risk', icon: ShieldAlert },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'audit-logs', label: 'Logs', icon: ListChecks },
    { id: 'policies', label: 'Policies', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Keyboard navigation for tabs (WAI-ARIA compliance)
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
      e.preventDefault();
    }
    if (nextIndex !== index) {
      setActiveTab(tabs[nextIndex].id);
      const buttons = tabsContainerRef.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
      buttons?.[nextIndex]?.focus();
    }
  };

  return (
    <nav
      aria-label="Tablet navigation tabs"
      className="hidden md:flex lg:hidden bg-slate-900 border-b border-slate-800 text-slate-300 px-2 sm:px-3 py-1.5 shrink-0 z-20 shadow-sm overflow-hidden"
    >
      <div
        ref={tabsContainerRef}
        role="tablist"
        className="flex items-center justify-between gap-1 w-full py-0.5 overflow-hidden"
      >
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              data-active={isActive ? 'true' : 'false'}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
