import React from 'react';
import {
  BarChart3,
  Code2,
  FileText,
  Globe,
  LayoutDashboard,
  ListChecks,
  Compass,
  LogOut,
  Settings,
  Shield,
  ShieldAlert,
  UploadCloud,
  Users,
  X,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenLanding: () => void;
  onLogout: () => void;
  userEmail?: string;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onOpenLanding,
  onLogout,
  userEmail = 'riyaz@gmail.com',
  userName = 'Riyaz',
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload & Scan', icon: UploadCloud },
    { id: 'pii-detection', label: 'Documents & PII', icon: FileText },
    { id: 'risk-analysis', label: 'Risk Analysis', icon: ShieldAlert },
    { id: 'reports', label: 'Compliance Reports', icon: BarChart3 },
    { id: 'audit-logs', label: 'Audit Logs', icon: ListChecks },
    { id: 'policies', label: 'Policy Rules', icon: ShieldAlert },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId as ActiveTab);
    onClose();
  };

  return (
    <>
      {/* Mobile/Tablet Backdrop Overlay (hidden on mobile view) */}
      {isOpen && (
        <div
          className="hidden md:block lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 
        Responsive Navigation Mode 1: LAPTOP & DESKTOP SIDEBAR 
        - On mobile view (< md): Strictly hidden (no sidebar on mobile)
        - On tablet (md: 768px - 1023px): Slide-out drawer when opened
        - On desktop (lg: >=1024px): In-flow static column, w-64, h-full, translate-x-0, shrink-0
      */}
      <aside
        id="desktop-laptop-sidebar"
        aria-label="Desktop primary navigation"
        className={`hidden md:flex lg:flex fixed lg:static inset-y-0 left-0 w-64 bg-[#0f172a] text-slate-300 z-50 lg:z-auto flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out border-r border-slate-800 h-full overflow-hidden ${
          isOpen ? 'translate-x-0' : 'md:-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding Section */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex items-center justify-between px-4 h-14 border-b border-slate-800 shrink-0">
            <Logo
              size="md"
              textClassName="font-extrabold text-white text-base tracking-tight"
              onClick={() => handleNavClick('dashboard')}
            />

            {/* Close drawer button for mobile/tablet */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links - Scrollable for overflow, scrollbar visually hidden cross-browser */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto min-h-0 no-scrollbar">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Public landing preview & User Profile */}
        <div className="p-3 border-t border-slate-800 space-y-2 shrink-0 bg-[#0c1322]">
          <button
            onClick={onOpenLanding}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">Public Landing Page</span>
            </span>
            <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded-sm shrink-0">
              Live
            </span>
          </button>

          {/* User Profile Card */}
          <button
            id="sidebar-user-card"
            onClick={() => handleNavClick('settings')}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors text-left"
            title="Open Account Settings"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white leading-tight truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 leading-tight truncate">{userEmail}</p>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Zero-Exposure Active" />
          </button>

          {/* Dedicated Sign-Out Button - Visible only in laptop/desktop view */}
          <button
            id="sidebar-signout-btn"
            onClick={onLogout}
            aria-label="Sign out"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-900/30 border border-red-800/30 transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
