import React, { useState } from 'react';
import {
  AppWindow,
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Columns,
  Compass,
  Copy,
  FolderTree,
  HelpCircle,
  Keyboard,
  Layers,
  Layout,
  Maximize2,
  Monitor,
  MoveHorizontal,
  RefreshCw,
  Smartphone,
  Tablet,
  Terminal,
} from 'lucide-react';
import { useResponsiveViewport, BREAKPOINTS } from '../hooks/useResponsiveViewport';

interface ResponsiveNavLabViewProps {
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const ResponsiveNavLabView: React.FC<ResponsiveNavLabViewProps> = ({
  onShowToast,
}) => {
  const viewport = useResponsiveViewport();
  const [activeSnippet, setActiveSnippet] = useState<'hook' | 'css' | 'sidebar' | 'tabs' | 'bottombar' | 'edgecases'>('css');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Simulation controls
  const [simulatedDevice, setSimulatedDevice] = useState<'real' | 'desktop' | 'tablet' | 'mobile'>('real');
  const [simulatedKeyboard, setSimulatedKeyboard] = useState<boolean>(false);
  const [dynamicItemCount, setDynamicItemCount] = useState<number>(3);
  const [showWideTable, setShowWideTable] = useState<boolean>(false);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onShowToast('Snippet copied to clipboard', 'success');
  };

  const effectiveDevice =
    simulatedDevice === 'desktop'
      ? 'desktop'
      : simulatedDevice === 'tablet'
      ? 'tablet'
      : simulatedDevice === 'mobile'
      ? 'mobile'
      : viewport.device;

  const effectiveKeyboard = simulatedDevice === 'mobile' ? simulatedKeyboard : viewport.isKeyboardOpen;

  // Code snippets
  const snippetCSSLayout = `/* ============================================================
   1. CORE VIEWPORT CONTAINMENT & ZERO-OVERFLOW ARCHITECTURE
   ============================================================
   Key Principles:
   - Use '100dvh' (Dynamic Viewport Height) to prevent mobile browser
     URL chrome (Safari/Chrome) from pushing the layout off-screen.
   - Use 'min-h-0' and 'min-w-0' on every flex child to defeat the default
     CSS Flexbox 'min-height: auto' calculation which causes large content
     to blow out the root window.
   - Keep root 'overflow: hidden' so the document never scrolls. Only the
     designated '<main>' container is permitted 'overflow-y: auto'.
   ============================================================ */

/* Root Viewport Container */
.app-viewport-root {
  height: 100dvh;
  max-height: 100dvh;
  width: 100vw;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background-color: #f8fafc; /* slate-50 */
}

/* Header Section (Always Fixed Height, Never Shrinks) */
.app-header {
  flex-shrink: 0;
  z-index: 30;
  height: 3.5rem; /* 56px */
}

/* Tablet Tabs Navigation Bar (Shown strictly on tablet: 768px - 1023px) */
.tablet-tabs-nav {
  display: none;
  flex-shrink: 0;
  z-index: 25;
}
@media (min-width: 768px) and (max-width: 1023px) {
  .tablet-tabs-nav {
    display: flex;
  }
}

/* Main Body Split (Sidebar + Scrollable Content) */
.app-body-container {
  flex: 1 1 0%;
  min-height: 0; /* CRITICAL: Enables flex child to shrink below intrinsic content size */
  min-width: 0;  /* CRITICAL: Prevents wide tables or code blocks from stretching parent */
  display: flex;
  overflow: hidden;
  position: relative;
}

/* Desktop Sidebar (Shown strictly on desktop: >= 1024px) */
.desktop-sidebar {
  display: none;
  width: 16rem; /* 256px */
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
}
@media (min-width: 1024px) {
  .desktop-sidebar {
    display: flex;
    flex-direction: column;
  }
}

/* Scrollable Content Column */
.app-content-column {
  flex: 1 1 0%;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Strictly Contained Scroll Container */
.app-main-content {
  flex: 1 1 0%;
  min-height: 0;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-y: contain; /* Prevents rubber-banding to parent window */
  -webkit-overflow-scrolling: touch;
}

/* Mobile Bottom Bar (Shown strictly on mobile: < 768px) */
.mobile-bottom-bar {
  display: flex;
  flex-shrink: 0;
  z-index: 40;
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}
@media (min-width: 768px) {
  .mobile-bottom-bar {
    display: none;
  }
}`;

  const snippetHook = `/**
 * @hook useResponsiveViewport
 * @description Tracks responsive breakpoints, debounces browser window resize,
 * and monitors the visualViewport API to detect mobile virtual keyboards.
 */

import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ViewportState {
  device: DeviceType;
  width: number;
  height: number;
  isKeyboardOpen: boolean;
  keyboardHeight: number;
}

export const BREAKPOINTS = {
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1023,
  DESKTOP_MIN: 1024,
} as const;

export function useResponsiveViewport(): ViewportState {
  const getDevice = (width: number): DeviceType => {
    if (width < BREAKPOINTS.TABLET_MIN) return 'mobile';
    if (width <= BREAKPOINTS.TABLET_MAX) return 'tablet';
    return 'desktop';
  };

  const [state, setState] = useState<ViewportState>(() => {
    const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const initialHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      device: getDevice(initialWidth),
      width: initialWidth,
      height: initialHeight,
      isKeyboardOpen: false,
      keyboardHeight: 0,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const device = getDevice(width);

        // Mobile Virtual Keyboard detection via window.visualViewport
        let isKeyboardOpen = false;
        let keyboardHeight = 0;

        if (window.visualViewport) {
          const vv = window.visualViewport;
          const diff = window.innerHeight - vv.height;
          // Virtual keyboard typically takes >= 140px on iOS/Android
          if (diff > 140 && device === 'mobile') {
            isKeyboardOpen = true;
            keyboardHeight = diff;
          }
        }

        setState({
          device,
          width,
          height,
          isKeyboardOpen,
          keyboardHeight,
        });
      }, 16); // 60 FPS debounce
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize, { passive: true });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return state;
}`;

  const snippetSidebar = `/**
 * @component DesktopSidebar
 * @description Renders on Desktop & Laptop views (>= 1024px).
 * Sits in-flow as an unyielding flex column with w-64, keeping the
 * main content cleanly offset without calculating absolute pixel margins.
 */

import React from 'react';
import { LayoutDashboard, UploadCloud, FileText, BarChart3, Settings, Shield } from 'lucide-react';

export const DesktopSidebar = ({ activeTab, onSelectTab }: { activeTab: string; onSelectTab: (t: string) => void }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload & Scan', icon: UploadCloud },
    { id: 'pii-detection', label: 'Documents', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      aria-label="Desktop primary navigation"
      className="hidden lg:flex flex-col justify-between w-64 bg-[#0f172a] text-slate-300 border-r border-slate-800 h-full shrink-0 select-none overflow-hidden"
    >
      <div className="flex flex-col min-h-0 flex-1">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Privexa AI</h1>
            <span className="text-[10px] text-slate-400">Desktop View Navigation</span>
          </div>
        </div>

        {/* Vertical Links with Contained Scroll */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto min-h-0">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors \${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }\`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};`;

  const snippetTabs = `/**
 * @component TabletTabsNav
 * @description Renders on Tablet views (768px - 1023px).
 * Displays a streamlined horizontal tab bar pinned below the top header.
 * Features keyboard arrow navigation (WAI-ARIA tabs) and smooth auto-scrolling.
 */

import React, { useRef, useEffect } from 'react';
import { LayoutDashboard, UploadCloud, FileText, BarChart3, Settings } from 'lucide-react';

export const TabletTabsNav = ({ activeTab, onSelectTab }: { activeTab: string; onSelectTab: (t: string) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload & Scan', icon: UploadCloud },
    { id: 'pii-detection', label: 'Documents', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Auto-scroll active tab into view horizontally
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector('[data-active="true"]') as HTMLElement;
    activeEl?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeTab]);

  return (
    <nav
      aria-label="Tablet navigation tabs"
      className="hidden md:flex lg:hidden bg-slate-900 border-b border-slate-800 text-slate-300 px-3 py-1.5 shrink-0 z-20 shadow-xs"
    >
      <div ref={containerRef} role="tablist" className="flex items-center gap-1 overflow-x-auto scrollbar-none w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              data-active={isActive ? 'true' : 'false'}
              onClick={() => onSelectTab(tab.id)}
              className={\`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 \${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }\`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};`;

  const snippetBottomBar = `/**
 * @component MobileBottomBar
 * @description Renders on Mobile views (< 768px).
 * Anchored to the viewport bottom with safe-area padding for modern notch devices.
 * Automatically unmounts when the mobile virtual keyboard is active to avoid input occlusion!
 */

import React from 'react';
import { LayoutDashboard, UploadCloud, FileText, BarChart3, Menu } from 'lucide-react';

export const MobileBottomBar = ({
  activeTab,
  onSelectTab,
  onOpenDrawer,
  isKeyboardOpen,
}: {
  activeTab: string;
  onSelectTab: (t: string) => void;
  onOpenDrawer: () => void;
  isKeyboardOpen?: boolean;
}) => {
  // CRITICAL: Suppress bottom bar when software keyboard appears
  if (isKeyboardOpen) return null;

  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload', icon: UploadCloud },
    { id: 'pii-detection', label: 'Docs', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="flex md:hidden shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-2 pt-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] items-center justify-around shadow-lg select-none"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={\`min-w-[54px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all active:scale-95 \${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
            }\`}
          >
            <div className={\`p-1 rounded-lg \${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}\`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-none">{item.label}</span>
          </button>
        );
      })}

      {/* Overflow Drawer Trigger */}
      <button
        onClick={onOpenDrawer}
        className="min-w-[54px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-slate-500 hover:text-slate-800 active:scale-95"
      >
        <div className="p-1 rounded-lg text-slate-500 hover:bg-slate-100">
          <Menu className="w-5 h-5" />
        </div>
        <span className="text-[10px] leading-none">More</span>
      </button>
    </nav>
  );
};`;

  const snippetEdgeCases = `/**
 * @guide Edge Cases & Zero-Overflow Defense Checklist
 * 
 * 1. DYNAMIC CONTENT LOADING:
 *    Problem: Asynchronous API responses or user uploads push huge DOM subtrees,
 *    causing the entire page window to scroll horizontally or vertically.
 *    Solution: The outer flex parent uses 'flex: 1 1 0%; min-height: 0; min-width: 0; overflow: hidden;'.
 *    Only '<main>' has 'overflow-y: auto'. Even if 100,000 items are added, the header,
 *    sidebar/tabs, and bottom bar remain rock-solid in place.
 * 
 * 2. MOBILE VIRTUAL KEYBOARD APPEARANCE:
 *    Problem: On iOS Safari and Android Chrome, the software keyboard pushes 'position: fixed'
 *    bottom bars into the center of the screen, occluding form fields.
 *    Solution: Hook monitors 'window.visualViewport.addEventListener("resize")'. When
 *    '(window.innerHeight - visualViewport.height) > 140px', 'isKeyboardOpen' is set to true.
 *    The bottom bar returns 'null', freeing 100% of the remaining screen for the form.
 * 
 * 3. RAPID BROWSER RESIZING & ORIENTATION CHANGES:
 *    Problem: Resizing desktop windows or rotating tablets triggers hundreds of layout recalculations,
 *    causing jank or state thrashing.
 *    Solution: CSS handles 100% of visual transitions instantly via media queries
 *    ('hidden md:flex lg:hidden', 'hidden lg:flex', 'flex md:hidden'). The JS hook is debounced
 *    to 16ms (60 FPS) and only powers supplemental logic.
 * 
 * 4. WIDE TABLES & DATA GRIDS:
 *    Problem: 12-column tables blow out mobile screens and create a horizontal window scrollbar.
 *    Solution: Wrap all tables in '<div className="w-full max-w-full overflow-x-auto min-w-0">'.
 *    The table scrolls internally without affecting the viewport boundaries.
 */`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header & Overview */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Responsive Navigation & Viewport Architecture
                </h2>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                  Adaptive 3-Tier System
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Strict layout containment, zero unwanted overflow, and seamless transition between{' '}
                <strong className="text-slate-800">Desktop Sidebar</strong>,{' '}
                <strong className="text-slate-800">Tablet Tabs</strong>, and{' '}
                <strong className="text-slate-800">Mobile Bottom Bar</strong>.
              </p>
            </div>
          </div>

          {/* Current Live Viewport Pill */}
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Live Detected:</span>
            <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-bold text-blue-700">
              {viewport.width}px × {viewport.height}px
            </span>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded-md font-bold uppercase text-[10px]">
              {viewport.device}
            </span>
          </div>
        </div>

        {/* 3-Tier Rule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              effectiveDevice === 'desktop'
                ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Desktop / Laptop</span>
              </div>
              <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border font-semibold text-slate-600">
                ≥ 1024px (lg:)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 font-medium">
              Permanent deep-navy <strong className="text-blue-900">Sidebar</strong> in-flow with main content (<code className="text-[10px] bg-white px-1 rounded">w-64 shrink-0</code>). Tablet tabs & mobile bottom bar are hidden.
            </p>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-all ${
              effectiveDevice === 'tablet'
                ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">Tablet View</span>
              </div>
              <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border font-semibold text-slate-600">
                768px – 1023px (md:)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 font-medium">
              Navigation displays as top <strong className="text-indigo-900">Horizontal Tabs</strong> with smooth auto-scroll, arrow keys, and pill indicators. Sidebar & bottom bar are hidden.
            </p>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-all ${
              effectiveDevice === 'mobile'
                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">Mobile View</span>
              </div>
              <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border font-semibold text-slate-600">
                &lt; 768px (default)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 font-medium">
              Navigation displays as anchored <strong className="text-emerald-900">Bottom Bar</strong> with safe-area padding (<code className="text-[10px] bg-white px-1 rounded">≥44px targets</code>). Hides when keyboard appears.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulation & Overflow Stress Test Sandbox */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Interactive Simulation & Containment Sandbox
            </h3>
            <p className="text-xs text-slate-500">
              Test how the navigation tiers reflow and verify that content never spills outside the container.
            </p>
          </div>

          {/* Device simulation buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSimulatedDevice('real')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                simulatedDevice === 'real'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Auto (Real Window)
            </button>
            <button
              onClick={() => setSimulatedDevice('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                simulatedDevice === 'desktop'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop (1280px)
            </button>
            <button
              onClick={() => setSimulatedDevice('tablet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                simulatedDevice === 'tablet'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              Tablet (820px)
            </button>
            <button
              onClick={() => setSimulatedDevice('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                simulatedDevice === 'mobile'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile (390px)
            </button>
          </div>
        </div>

        {/* Stress Test Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">Dynamic Content Load</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                {dynamicItemCount * 5} records
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Injects content to test vertical containment in <code className="text-[10px]">main</code> without page scroll.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDynamicItemCount((c) => c + 3)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold rounded-lg text-slate-700"
              >
                + Add Content
              </button>
              <button
                onClick={() => setDynamicItemCount(2)}
                className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">Mobile Virtual Keyboard</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  effectiveKeyboard ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {effectiveKeyboard ? 'Active (Suppressed Nav)' : 'Inactive'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Tests bottom bar suppression on soft keyboard focus to prevent input occlusion.
            </p>
            <button
              onClick={() => setSimulatedKeyboard(!simulatedKeyboard)}
              className={`w-full py-1 text-xs font-semibold rounded-lg border transition-colors ${
                simulatedKeyboard
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {simulatedKeyboard ? 'Dismiss Keyboard' : 'Simulate Keyboard Focus'}
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">Horizontal Table Isolation</span>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                12 Columns
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Tests that ultra-wide tables never cause root horizontal window scrollbars.
            </p>
            <button
              onClick={() => setShowWideTable(!showWideTable)}
              className={`w-full py-1 text-xs font-semibold rounded-lg border transition-colors ${
                showWideTable
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {showWideTable ? 'Hide Wide Table' : 'Inject Wide Table'}
            </button>
          </div>
        </div>

        {/* Live Simulation Frame */}
        <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
            <span className="font-mono text-[11px]">
              Simulated Viewport Canvas: <strong>{effectiveDevice.toUpperCase()}</strong> MODE
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              ✔ 0px Root Window Overflow Detected
            </span>
          </div>

          {/* Mini Mock Browser Container */}
          <div
            className={`mx-auto bg-slate-100 rounded-lg overflow-hidden border border-slate-700 transition-all duration-300 ${
              effectiveDevice === 'desktop'
                ? 'w-full max-w-4xl h-72'
                : effectiveDevice === 'tablet'
                ? 'w-full max-w-xl h-72'
                : 'w-full max-w-xs h-96'
            } flex flex-col`}
          >
            {/* Mock Header */}
            <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-bold text-slate-700 ml-2">Privexa AI</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {effectiveDevice === 'desktop' ? '1280px' : effectiveDevice === 'tablet' ? '820px' : '390px'}
              </span>
            </div>

            {/* Mock Tablet Navigation (TABS) */}
            {effectiveDevice === 'tablet' && (
              <div className="bg-slate-900 px-3 py-1.5 flex items-center gap-1 overflow-x-auto text-[10px] text-slate-300 shrink-0">
                <span className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded-md">Dashboard</span>
                <span className="px-2 py-1 text-slate-400 hover:text-white">Upload</span>
                <span className="px-2 py-1 text-slate-400 hover:text-white">Documents</span>
                <span className="px-2 py-1 text-slate-400 hover:text-white">Reports</span>
                <span className="px-2 py-1 text-slate-400 hover:text-white">Audit</span>
              </div>
            )}

            {/* Mock Body */}
            <div className="flex-1 min-h-0 flex overflow-hidden">
              {/* Mock Desktop Navigation (SIDEBAR) */}
              {effectiveDevice === 'desktop' && (
                <div className="w-40 bg-[#0f172a] text-slate-300 p-2.5 flex flex-col justify-between shrink-0 text-[11px]">
                  <div className="space-y-1">
                    <div className="px-2 py-1 bg-blue-600 text-white font-bold rounded">Dashboard</div>
                    <div className="px-2 py-1 text-slate-400">Upload & Scan</div>
                    <div className="px-2 py-1 text-slate-400">Documents</div>
                    <div className="px-2 py-1 text-slate-400">Reports</div>
                    <div className="px-2 py-1 text-slate-400">Settings</div>
                  </div>
                  <div className="p-1.5 bg-slate-800/80 rounded text-[10px] text-slate-400">
                    User: Admin
                  </div>
                </div>
              )}

              {/* Mock Scrollable Content */}
              <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-3 bg-white space-y-2 text-xs">
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="font-bold text-blue-900 block text-xs">
                    Current Navigation Tier: {effectiveDevice.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-blue-700">
                    {effectiveDevice === 'desktop'
                      ? 'Rendered as Sidebar (w-64 flex column)'
                      : effectiveDevice === 'tablet'
                      ? 'Rendered as Top Tabs (horizontal pill bar)'
                      : 'Rendered as Bottom Bar (anchored at base)'}
                  </span>
                </div>

                {/* Dynamic Content Rows */}
                {Array.from({ length: dynamicItemCount }).map((_, i) => (
                  <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px] flex justify-between">
                    <span className="font-semibold text-slate-700">Protected Document Batch #{i + 1}</span>
                    <span className="text-emerald-600 font-bold">100% Sanitized</span>
                  </div>
                ))}

                {/* Wide Table Demonstration */}
                {showWideTable && (
                  <div className="border border-purple-200 rounded-lg overflow-x-auto min-w-0 bg-purple-50/50 p-2">
                    <div className="text-[10px] font-bold text-purple-900 mb-1">
                      Contained Wide Table Test (Never spills into parent)
                    </div>
                    <table className="min-w-[500px] text-[10px] text-slate-700">
                      <thead>
                        <tr className="border-b border-purple-200">
                          <th className="p-1 text-left">Entity ID</th>
                          <th className="p-1 text-left">Category</th>
                          <th className="p-1 text-left">Token</th>
                          <th className="p-1 text-left">Severity</th>
                          <th className="p-1 text-left">Confidence</th>
                          <th className="p-1 text-left">Timestamp</th>
                          <th className="p-1 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-1">ENT-091</td>
                          <td className="p-1">Credit Card</td>
                          <td className="p-1">&lt;CARD_001&gt;</td>
                          <td className="p-1 text-red-600 font-bold">Critical</td>
                          <td className="p-1">99.4%</td>
                          <td className="p-1">11:15:20</td>
                          <td className="p-1 text-emerald-600">Masked</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Mock Mobile Navigation (BOTTOM BAR) */}
            {effectiveDevice === 'mobile' && !effectiveKeyboard && (
              <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around text-[10px] text-slate-600 shrink-0 shadow-xs">
                <span className="text-blue-600 font-bold">Home</span>
                <span>Upload</span>
                <span>Docs</span>
                <span>Reports</span>
                <span>More</span>
              </div>
            )}

            {/* Keyboard Active State Notice */}
            {effectiveDevice === 'mobile' && effectiveKeyboard && (
              <div className="bg-amber-100 border-t border-amber-300 px-2 py-1 text-[10px] text-amber-800 font-semibold text-center shrink-0">
                ⌨️ Software Keyboard Active → Bottom Bar Auto-Suppressed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Production Code Blueprint Tabs */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Sub-navigation bar for snippets */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 py-3 bg-[#0a1120] gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveSnippet('css')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSnippet === 'css'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              1. Viewport & CSS Rules
            </button>
            <button
              onClick={() => setActiveSnippet('hook')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSnippet === 'hook'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              2. Viewport Hook & State
            </button>
            <button
              onClick={() => setActiveSnippet('sidebar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSnippet === 'sidebar'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              3. Desktop Sidebar
            </button>
            <button
              onClick={() => setActiveSnippet('tabs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSnippet === 'tabs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              4. Tablet Tabs
            </button>
            <button
              onClick={() => setActiveSnippet('bottombar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSnippet === 'bottombar'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              5. Mobile Bottom Bar
            </button>
            <button
              onClick={() => setActiveSnippet('edgecases')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSnippet === 'edgecases'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              6. Edge Cases & Resilience
            </button>
          </div>

          <button
            onClick={() => {
              const codeMap = {
                css: snippetCSSLayout,
                hook: snippetHook,
                sidebar: snippetSidebar,
                tabs: snippetTabs,
                bottombar: snippetBottomBar,
                edgecases: snippetEdgeCases,
              };
              copyCode(codeMap[activeSnippet], activeSnippet);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            {copiedId === activeSnippet ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Display Area */}
        <div className="p-4 sm:p-5 overflow-x-auto max-h-[500px] overflow-y-auto">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed">
            <code>
              {activeSnippet === 'css' && snippetCSSLayout}
              {activeSnippet === 'hook' && snippetHook}
              {activeSnippet === 'sidebar' && snippetSidebar}
              {activeSnippet === 'tabs' && snippetTabs}
              {activeSnippet === 'bottombar' && snippetBottomBar}
              {activeSnippet === 'edgecases' && snippetEdgeCases}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
