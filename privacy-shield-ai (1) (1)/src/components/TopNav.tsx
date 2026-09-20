import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Menu,
  Search,
  ShieldAlert,
  Upload,
  X,
} from 'lucide-react';
import { Logo } from './Logo';
import { BRANDING } from '../config/branding';

interface TopNavProps {
  onOpenSidebar: () => void;
  onQuickUpload: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  unreadCount?: number;
  userName?: string;
  onNavigateTab: (tab: any) => void;
  onOpenLanding?: () => void;
  onLogout?: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenSidebar,
  onQuickUpload,
  searchQuery,
  setSearchQuery,
  unreadCount = 2,
  userName = 'Riyaz',
  onNavigateTab,
  onOpenLanding,
  onLogout,
  onShowToast,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeUnreadCount, setActiveUnreadCount] = useState(unreadCount);

  const handleMarkAllRead = () => {
    setActiveUnreadCount(0);
    onShowToast?.('All security notifications marked as read', 'success');
  };

  const handleNotificationClick = (targetTab: string, alertTitle: string) => {
    onNavigateTab(targetTab);
    setShowNotifications(false);
    onShowToast?.(`Viewing details for: ${alertTitle}`, 'info');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 px-3 sm:px-6 h-14 flex items-center justify-between gap-3 shadow-2xs relative shrink-0">
      {/* Left: Brand Logo & Navigation Controls */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 md:flex-initial min-w-0">
        <button
          id="topnav-mobile-menu-btn"
          onClick={onOpenSidebar}
          className="hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand logo shown on mobile/tablet when desktop sidebar is not visible */}
        <div className="lg:hidden flex items-center shrink-0">
          <Logo
            size="sm"
            showText={false}
            onClick={() => onNavigateTab('dashboard')}
          />
        </div>

        {/* Global Search Bar - Aligned Center */}
        <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto flex items-center justify-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search documents, PII entities, reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-1.5 text-xs sm:text-sm text-center placeholder:text-center focus:text-left focus:placeholder:text-left bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl outline-none transition-all placeholder:text-slate-400 font-normal shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full z-10"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Upload Button */}
        <button
          id="topnav-quick-scan-btn"
          onClick={onQuickUpload}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title="Start a new document privacy scan"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Scan</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            id="topnav-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              showNotifications ? 'bg-slate-100 text-slate-900' : ''
            }`}
            aria-label="Security notifications"
            aria-expanded={showNotifications}
          >
            <Bell className="w-4 h-4" />
            {activeUnreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <>
              {/* Dismiss backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
                aria-hidden="true"
              />
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95"
              >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Security Alerts
                  </span>
                  {activeUnreadCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                      {activeUnreadCount} new
                    </span>
                  )}
                </div>
                {activeUnreadCount > 0 && (
                  <button
                    id="mark-all-read-btn"
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleNotificationClick('audit-logs', 'Critical PII Quarantined')}
                  className="w-full text-left p-2.5 bg-red-50/70 hover:bg-red-50 rounded-xl border border-red-100 transition-colors block"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-red-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Critical PII Quarantined</span>
                    </p>
                    <span className="text-[10px] text-red-500">12m ago</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-normal">
                    Medical-Billing-2026.pdf quarantined due to high-risk payment PANs & SSN records.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleNotificationClick('reports', 'Secure Share Approved')}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200/80 transition-colors block"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Secure Share Approved</span>
                    </p>
                    <span className="text-[10px] text-slate-400">1h ago</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-normal">
                    Security Officer sign-off completed for external auditor encrypted token share.
                  </p>
                </button>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    onNavigateTab('audit-logs');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View Full Audit Trail →
                </button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
