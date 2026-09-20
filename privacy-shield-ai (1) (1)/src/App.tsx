import React, { useState } from 'react';
import {
  ActiveTab,
  AuditLogItem,
  DocumentScanResult,
  PolicyRule,
  SecureShareRequest,
  SystemSettings,
} from './types';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_POLICIES,
  INITIAL_SETTINGS,
  PRESET_DEMO_DOCUMENTS,
} from './data/mockData';
import { scanDocumentText } from './utils/privacyScanner';

// Components
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { TabletTabsNav } from './components/TabletTabsNav';
import { BottomNav } from './components/BottomNav';
import { useResponsiveViewport } from './hooks/useResponsiveViewport';
import { DashboardView } from './components/DashboardView';
import { UploadScanView } from './components/UploadScanView';
import { PiiDetectionView } from './components/PiiDetectionView';
import { RiskAnalysisView } from './components/RiskAnalysisView';
import { MaskingPreviewView } from './components/MaskingPreviewView';
import { AiAnalysisView } from './components/AiAnalysisView';
import { ReportView } from './components/ReportView';
import { AuditLogsView } from './components/AuditLogsView';
import { PolicyConfigView } from './components/PolicyConfigView';
import { SettingsView } from './components/SettingsView';
import { CodeArchitectureSpecsView } from './components/CodeArchitectureSpecsView';
import { SecureShareModal } from './components/SecureShareModal';
import { LandingPageModal } from './components/LandingPageModal';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Info,
  Lock,
  Shield,
  ShieldCheck,
  X,
} from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export default function App() {
  const viewport = useResponsiveViewport();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Current active scanned document
  const [currentScan, setCurrentScan] = useState<DocumentScanResult>(() => {
    return scanDocumentText(
      PRESET_DEMO_DOCUMENTS[0].content,
      PRESET_DEMO_DOCUMENTS[0].name
    );
  });

  // App data states
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [policies, setPolicies] = useState<PolicyRule[]>(INITIAL_POLICIES);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLandingModalOpen, setIsLandingModalOpen] = useState(false);

  // Global Toast Notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Handler for scan completion
  const handleScanComplete = (result: DocumentScanResult) => {
    setCurrentScan(result);

    // Append to audit log
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: 'Document Uploaded',
      document: result.fileName,
      riskLevel: result.riskLevel,
      user: settings.accountName,
      userEmail: settings.email,
      status: 'Success',
      details: `Detected ${result.entities.length} PII entities with risk score ${result.riskScore}/100.`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Scanned ${result.fileName}: ${result.entities.length} sensitive items detected`, 'success');
    setActiveTab('pii-detection');
  };

  // Handler for switching preset document
  const handleSelectDocument = (docName: string) => {
    const preset = PRESET_DEMO_DOCUMENTS.find((d) => d.name === docName);
    if (preset) {
      const scanned = scanDocumentText(preset.content, preset.name);
      setCurrentScan(scanned);
      showToast(`Switched active document to ${docName}`, 'info');
      setActiveTab('pii-detection');
    }
  };

  // Handler for secure share request creation
  const handleShareCreated = (shareReq: SecureShareRequest) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: shareReq.status === 'Approved' ? 'Share Approved' : 'Secure Share Requested',
      document: shareReq.documentName,
      riskLevel: shareReq.riskLevel,
      user: settings.accountName,
      userEmail: settings.email,
      status: 'Success',
      details: `Dispatched encrypted masked token share to ${shareReq.recipientEmail}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-screen max-w-full bg-white text-slate-900 flex font-sans antialiased overflow-hidden select-text">
      {/* 
        Responsive Navigation Mode 1: LAPTOP & DESKTOP SIDEBAR
        - Starts from actual top of viewport (h-full, inset-y-0, left-0) with zero white gap
        - On desktop (lg: >=1024px): In-flow static column, w-64, h-full, shrink-0
        - On mobile/tablet: Fixed slide-out drawer (z-50) when sidebarOpen is true
      */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenLanding={() => setIsLandingModalOpen(true)}
        onLogout={() => setIsLandingModalOpen(true)}
        userEmail={settings.email}
        userName={settings.accountName}
      />

      {/* Main Viewport Body (Content Column beside Sidebar) */}
      <div className="flex-1 min-h-0 min-w-0 flex flex-col h-full overflow-hidden relative bg-white">
        {/* Top Navigation Header (Always Fixed Height, Perfectly Aligned with Sidebar Top) */}
        <TopNav
          onOpenSidebar={() => setSidebarOpen(true)}
          onQuickUpload={() => setActiveTab('upload')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unreadCount={2}
          userName={settings.accountName}
          onNavigateTab={setActiveTab}
          onOpenLanding={() => setIsLandingModalOpen(true)}
          onLogout={() => setIsLandingModalOpen(true)}
          onShowToast={showToast}
        />

        {/* 
          Responsive Navigation Mode 2: TABLET TABS NAVIGATION
          - Rendered strictly on tablet (768px - 1023px: hidden md:flex lg:hidden)
          - Horizontal scroll-resistant tabs with active pill indicators & arrow keys
        */}
        <TabletTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Strictly Contained Content Column */}
        <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden bg-white">
          {/* Sub-header Step Tracker for Sequential Scanning Workflow */}
          {(activeTab === 'upload' ||
            activeTab === 'pii-detection' ||
            activeTab === 'risk-analysis' ||
            activeTab === 'masking-preview' ||
            activeTab === 'ai-analysis' ||
            activeTab === 'reports') && (
            <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 shrink-0 overflow-x-auto shadow-2xs">
              <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[620px] text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                  <span className="text-slate-400">Target Document:</span>
                  <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">
                    {currentScan.fileName}
                  </span>
                </div>

                {/* Stepper matching the 5 steps in the reference screens */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'upload'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    1. Upload
                  </button>
                  <span className="text-slate-300">→</span>

                  <button
                    onClick={() => setActiveTab('pii-detection')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'pii-detection'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    2. PII Detection
                  </button>
                  <span className="text-slate-300">→</span>

                  <button
                    onClick={() => setActiveTab('risk-analysis')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'risk-analysis'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    3. Risk Analysis
                  </button>
                  <span className="text-slate-300">→</span>

                  <button
                    onClick={() => setActiveTab('masking-preview')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'masking-preview'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    4. Masking
                  </button>
                  <span className="text-slate-300">→</span>

                  <button
                    onClick={() => setActiveTab('ai-analysis')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'ai-analysis'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    5. AI Analysis
                  </button>
                  <span className="text-slate-300">→</span>

                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'reports'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    6. Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Main View - Strictly Contained with Momentum Scrolling */}
          <main className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 overscroll-y-contain bg-white">
            {activeTab === 'dashboard' && (
              <DashboardView
                currentScan={currentScan}
                onNavigateTab={setActiveTab}
                onSelectDocument={handleSelectDocument}
                userName={settings.accountName}
              />
            )}

            {activeTab === 'upload' && (
              <UploadScanView
                onScanComplete={handleScanComplete}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'pii-detection' && (
              <PiiDetectionView
                scan={currentScan}
                onNext={() => setActiveTab('risk-analysis')}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'risk-analysis' && (
              <RiskAnalysisView
                scan={currentScan}
                onNext={() => setActiveTab('masking-preview')}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'masking-preview' && (
              <MaskingPreviewView
                scan={currentScan}
                onNext={() => setActiveTab('ai-analysis')}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'ai-analysis' && (
              <AiAnalysisView
                scan={currentScan}
                onNext={() => setActiveTab('reports')}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'reports' && (
              <ReportView
                scan={currentScan}
                onInitiateShare={() => setIsShareModalOpen(true)}
                onNavigateTab={setActiveTab}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'audit-logs' && (
              <AuditLogsView
                logs={auditLogs}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'policies' && (
              <PolicyConfigView
                policies={policies}
                onUpdatePolicies={setPolicies}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={setSettings}
                onShowToast={showToast}
                onLogout={() => setIsLandingModalOpen(true)}
              />
            )}

            {activeTab === 'specs' && (
              <CodeArchitectureSpecsView onShowToast={showToast} />
            )}
          </main>

          {/* 
            Responsive Navigation Mode 3: MOBILE BOTTOM NAVIGATION
            - Rendered strictly on mobile (< 768px: flex md:hidden)
            - Safe-area insets, >=44px touch targets
            - Auto-unmounts when mobile software keyboard appears to avoid form occlusion
          */}
          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSidebar={() => setSidebarOpen(true)}
            isKeyboardOpen={viewport.isKeyboardOpen}
          />
        </div>
      </div>

      {/* Secure Share Workflow Modal with Approval Controls */}
      <SecureShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        scan={currentScan}
        onShareCreated={handleShareCreated}
        onShowToast={showToast}
      />

      {/* Public Landing & Login Preview Portal (Screens 1 & 2) */}
      <LandingPageModal
        isOpen={isLandingModalOpen}
        onClose={() => setIsLandingModalOpen(false)}
        onLoginSuccess={(email) => {
          setSettings((prev) => ({ ...prev, email }));
          showToast(`Logged in successfully as ${email}`, 'success');
        }}
      />

      {/* Stacked Toast Notification Alerts */}
      <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-xl border text-xs font-semibold backdrop-blur-md animate-in slide-in-from-bottom-3 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
                : toast.type === 'error'
                ? 'bg-red-950/90 border-red-500/50 text-red-100'
                : 'bg-slate-900/95 border-slate-700 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
