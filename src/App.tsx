import React, { useState, useEffect } from 'react';
import {
  NavigationSection,
  ExecutiveSubTab,
  AnalyticsSubTab,
  MonitoringSubTab,
  IntelligenceSubTab,
  ReportsSubTab,
  AdminSubTab,
  SettingsSubTab,
  SSRTrendItem,
  CommodityShare,
  RegionalPriceData,
  IgfmasEntry,
  PekelilingItem,
  AlertItem,
  ActivityLog,
  AIInsightResponse,
} from './types';
import {
  initialSSRTrends,
  initialCommodityShares,
  initialRegionalPrices,
  initialIgfmasEntries,
  initialPekelilingList,
  initialAlerts,
  initialAuditLogs,
} from './data/agriData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { IgfmasFormModal } from './components/IgfmasFormModal';
import { CsvImporterModal } from './components/CsvImporterModal';

// Views
import { ExecutiveDashboardView } from './components/views/ExecutiveDashboardView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { MonitoringView } from './components/views/MonitoringView';
import { IntelligenceHubView } from './components/views/IntelligenceHubView';
import { ReportsView } from './components/views/ReportsView';
import { AdministrationView } from './components/views/AdministrationView';
import { SettingsView } from './components/views/SettingsView';

import { CheckCircle2, Download, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeSection, setActiveSection] = useState<NavigationSection>('executive');
  const [activeExecutiveSub, setActiveExecutiveSub] = useState<ExecutiveSubTab>('kpi');
  const [activeAnalyticsSub, setActiveAnalyticsSub] = useState<AnalyticsSubTab>('performance');
  const [activeMonitoringSub, setActiveMonitoringSub] = useState<MonitoringSubTab>('live');
  const [activeIntelligenceSub, setActiveIntelligenceSub] = useState<IntelligenceSubTab>('assistant');
  const [activeReportsSub, setActiveReportsSub] = useState<ReportsSubTab>('pdf');
  const [activeAdminSub, setActiveAdminSub] = useState<AdminSubTab>('audit');
  const [activeSettingsSub, setActiveSettingsSub] = useState<SettingsSubTab>('general');

  // Datasets
  const [ssrTrends, setSsrTrends] = useState<SSRTrendItem[]>(initialSSRTrends);
  const [commodityShares, setCommodityShares] = useState<CommodityShare[]>(initialCommodityShares);
  const [regionalPrices, setRegionalPrices] = useState<RegionalPriceData[]>(initialRegionalPrices);
  const [igfmasEntries, setIgfmasEntries] = useState<IgfmasEntry[]>(initialIgfmasEntries);
  const [pekelilingList, setPekelilingList] = useState<PekelilingItem[]>(initialPekelilingList);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [auditLogs, setAuditLogs] = useState<ActivityLog[]>(initialAuditLogs);

  // Imported CSV Chart State
  const [importedCsvChart, setImportedCsvChart] = useState<{
    datasetName: string;
    rows: Record<string, any>[];
    xAxis: string;
    yAxis: string;
    chartType: 'line' | 'bar' | 'area';
  } | null>(null);

  // UI Modals & Toasts
  const [isIgfmasModalOpen, setIsIgfmasModalOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // AI Insight State
  const [aiInsight, setAiInsight] = useState<AIInsightResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Trigger Toast
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Fetch AI Insights from server endpoint /api/ai/insights
  const fetchAiInsights = async () => {
    setIsLoadingAi(true);
    try {
      const datasetSummary = {
        latestRiceSSR: ssrTrends[ssrTrends.length - 1].rice,
        latestPoultrySSR: ssrTrends[ssrTrends.length - 1].poultry,
        beefImportShare: 76.2,
        totalIgfmasBudgetMYR: igfmasEntries.reduce((acc, curr) => acc + curr.allocatedBudgetMYR, 0),
        activeAlertCount: alerts.length,
      };

      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetSummary,
          focusArea: 'National Food Security & Rice SSR 2030 Strategy',
        }),
      });

      const data = await res.json();
      setAiInsight(data);
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
      setAiInsight({
        insight:
          'Rice SSR stands at 66.4% in 2024 with a projected 2.4% yield increase following MARDI high-yield seeds adoption. High import dependency observed in Beef (76.2%) and Mutton (87.9%). Strategic fertilizer subsidy allocation via IGFMAS (MYR 1.25B) is on track.',
        riskLevel: 'Moderate',
        recommendations: [
          'Accelerate Kedah & Perak Paddy Granary Irrigation Infrastructure (IGFMAS RM45M)',
          'Implement Grain Corn Import Subsidy Hedging Scheme for Poultry Feed Stability',
          'Expand Mariculture Aquaculture Zones in Sabah & Sarawak',
        ],
        confidenceScore: 95,
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiInsights();
  }, []);

  // Handle adding new entry from IGFMAS Key-in Form
  const handleAddIgfmasEntry = (newEntry: IgfmasEntry) => {
    setIgfmasEntries((prev) => [newEntry, ...prev]);

    // Dynamically recalculate & boost Rice SSR by impact percentage!
    setSsrTrends((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = {
        ...updated[lastIndex],
        rice: Number((updated[lastIndex].rice + newEntry.ssrImpact).toFixed(1)),
      };
      return updated;
    });

    // Add Audit Log Entry
    const newLog: ActivityLog = {
      id: `LOG-${Math.floor(1090 + Math.random() * 900)}`,
      user: 'Pegawai Eksekutif (Sesi Semasa)',
      role: `Pegawai ${newEntry.department}`,
      action: `Kemaskini Data Rasmi ${newEntry.referenceCode} (${newEntry.commodity})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      systemModule: 'Integrasi Portal Data Rasmi',
      status: 'Berjaya',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Data Rasmi ${newEntry.referenceCode} ditambah! Graf telah dikemaskini.`);
    fetchAiInsights(); // Re-trigger AI analysis
  };

  const handleCsvDataImported = (
    datasetName: string,
    rows: Record<string, any>[],
    xAxis: string,
    yAxis: string,
    chartType: 'line' | 'bar' | 'area'
  ) => {
    setImportedCsvChart({
      datasetName,
      rows,
      xAxis,
      yAxis,
      chartType,
    });
    // Jump straight to Executive Dashboard view to show the new chart!
    setActiveSection('executive');

    // Add Audit Log Entry
    const newLog: ActivityLog = {
      id: `LOG-CSV-${Math.floor(1000 + Math.random() * 9000)}`,
      user: 'Pegawai Analitis Data',
      role: 'Analisis Open Data (open.dosm.gov.my)',
      action: `Muat Masuk CSV ${datasetName} (${rows.length} rekod)`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      systemModule: 'Integrasi Data CSV OpenDOSM',
      status: 'Berjaya',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Carta CSV "${datasetName}" (${rows.length} rekod) kini dipaparkan di Papan Pemuka!`);
  };

  // Section title mapping for header
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'executive': return `Executive Dashboard > ${activeExecutiveSub.toUpperCase()}`;
      case 'analytics': return `Analytics > ${activeAnalyticsSub.toUpperCase()}`;
      case 'monitoring': return `Monitoring > ${activeMonitoringSub.toUpperCase()}`;
      case 'intelligence': return `Intelligence Hub > ${activeIntelligenceSub.toUpperCase()}`;
      case 'reports': return `Reports > ${activeReportsSub.toUpperCase()}`;
      case 'administration': return `Administration > ${activeAdminSub.toUpperCase()}`;
      case 'settings': return `Settings > ${activeSettingsSub.toUpperCase()}`;
      default: return 'Executive Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans antialiased flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Header */}
      <Header
        onOpenIgfmasModal={() => setIsIgfmasModalOpen(true)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onSearch={(term) => {
          if (term.length > 1) {
            setActiveSection('intelligence');
            setActiveIntelligenceSub('search');
          }
        }}
        onExportPDF={() => {
          showToast('Generating National Executive Briefing PDF document...');
          setTimeout(() => {
            setActiveSection('reports');
            setActiveReportsSub('pdf');
          }, 600);
        }}
        toggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        activeSectionTitle={getSectionTitle()}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          activeExecutiveSub={activeExecutiveSub}
          setActiveExecutiveSub={setActiveExecutiveSub}
          activeAnalyticsSub={activeAnalyticsSub}
          setActiveAnalyticsSub={setActiveAnalyticsSub}
          activeMonitoringSub={activeMonitoringSub}
          setActiveMonitoringSub={setActiveMonitoringSub}
          activeIntelligenceSub={activeIntelligenceSub}
          setActiveIntelligenceSub={setActiveIntelligenceSub}
          activeReportsSub={activeReportsSub}
          setActiveReportsSub={setActiveReportsSub}
          activeAdminSub={activeAdminSub}
          setActiveAdminSub={setActiveAdminSub}
          activeSettingsSub={activeSettingsSub}
          setActiveSettingsSub={setActiveSettingsSub}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden space-y-6">
          {/* Toast Notification */}
          {toastMsg && (
            <div className="fixed top-16 right-6 z-50 p-3 bg-emerald-900 text-white rounded-2xl border border-emerald-500/50 shadow-2xl font-bold text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Render Views Based on Navigation Section */}
          {activeSection === 'executive' && (
            <ExecutiveDashboardView
              ssrTrends={ssrTrends}
              commodityShares={commodityShares}
              regionalPrices={regionalPrices}
              igfmasEntries={igfmasEntries}
              aiInsight={aiInsight}
              isLoadingAi={isLoadingAi}
              onRefreshAi={fetchAiInsights}
              onOpenIgfmasModal={() => setIsIgfmasModalOpen(true)}
              importedCsvChart={importedCsvChart}
              onRemoveImportedChart={() => setImportedCsvChart(null)}
            />
          )}

          {activeSection === 'analytics' && (
            <AnalyticsView
              subTab={activeAnalyticsSub}
              setSubTab={setActiveAnalyticsSub}
              commodityShares={commodityShares}
              landUseData={[
                { category: 'Northern Granary (Kedah)', paddyHa: 124000, oilPalmHa: 85000, rubberHa: 42000, fruitVegHa: 28000, waterUsageM3: 1450000, carbonImpactIndex: 42 },
                { category: 'Central Region (Perak)', paddyHa: 82000, oilPalmHa: 310000, rubberHa: 68000, fruitVegHa: 45000, waterUsageM3: 1120000, carbonImpactIndex: 58 },
                { category: 'Southern Zone (Johor)', paddyHa: 12000, oilPalmHa: 680000, rubberHa: 120000, fruitVegHa: 78000, waterUsageM3: 890000, carbonImpactIndex: 72 },
                { category: 'East Coast Corridor', paddyHa: 64000, oilPalmHa: 520000, rubberHa: 190000, fruitVegHa: 52000, waterUsageM3: 980000, carbonImpactIndex: 61 },
                { category: 'Borneo Zone (Sabah/SWK)', paddyHa: 45000, oilPalmHa: 1250000, rubberHa: 140000, fruitVegHa: 62000, waterUsageM3: 780000, carbonImpactIndex: 84 },
              ]}
              aiInsight={aiInsight}
              isLoadingAi={isLoadingAi}
              onRefreshAi={fetchAiInsights}
            />
          )}

          {activeSection === 'monitoring' && (
            <MonitoringView
              subTab={activeMonitoringSub}
              setSubTab={setActiveMonitoringSub}
              alerts={alerts}
              regionalPrices={regionalPrices}
            />
          )}

          {activeSection === 'intelligence' && (
            <IntelligenceHubView
              subTab={activeIntelligenceSub}
              setSubTab={setActiveIntelligenceSub}
              pekelilingList={pekelilingList}
            />
          )}

          {activeSection === 'reports' && (
            <ReportsView
              subTab={activeReportsSub}
              setSubTab={setActiveReportsSub}
              ssrTrends={ssrTrends}
              commodityShares={commodityShares}
              igfmasEntries={igfmasEntries}
              onTriggerPDFExport={() => showToast('Generating National Briefing Report PDF...')}
            />
          )}

          {activeSection === 'administration' && (
            <AdministrationView
              subTab={activeAdminSub}
              setSubTab={setActiveAdminSub}
              auditLogs={auditLogs}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsView
              subTab={activeSettingsSub}
              setSubTab={setActiveSettingsSub}
            />
          )}
        </main>
      </div>

      {/* Global Application Footer with Signature */}
      <footer className="border-t border-white/10 bg-[#0a0a0d] py-3.5 px-6 text-xs text-slate-500">
        <div className="max-w-[1700px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 Portal Rasmi Data Pertanian & Keterjaminan Makanan. Sumber Data: OpenDOSM, data.gov.my, MATRADE & KPKM.
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-blue-500/20 border border-amber-500/30 text-amber-300 font-extrabold tracking-wide text-xs shadow-xs">
              ✨ Design by MrMH
            </span>
          </div>
        </div>
      </footer>

      {/* IGFMAS Key-In Form Modal */}
      <IgfmasFormModal
        isOpen={isIgfmasModalOpen}
        onClose={() => setIsIgfmasModalOpen(false)}
        onAddEntry={handleAddIgfmasEntry}
      />

      {/* CSV Data Importer Modal */}
      <CsvImporterModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onDataImported={handleCsvDataImported}
      />
    </div>
  );
}
