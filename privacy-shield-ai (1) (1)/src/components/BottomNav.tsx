import React from 'react';
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Settings,
  UploadCloud,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSidebar?: () => void;
  isKeyboardOpen?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  isKeyboardOpen = false,
}) => {
  // When mobile virtual keyboard is open, hide the bottom bar to prevent blocking the form inputs
  if (isKeyboardOpen) {
    return null;
  }

  const items = [
    { id: 'dashboard' as ActiveTab, label: 'Home', icon: LayoutDashboard },
    { id: 'upload' as ActiveTab, label: 'Upload', icon: UploadCloud },
    { id: 'pii-detection' as ActiveTab, label: 'Docs', icon: FileText },
    { id: 'reports' as ActiveTab, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="md:hidden shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-2 pt-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] flex items-center justify-around shadow-lg select-none overflow-hidden"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`min-w-[56px] min-h-[48px] flex flex-col items-center justify-center gap-0.5 px-2 rounded-xl transition-all active:scale-95 ${
              isActive
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
