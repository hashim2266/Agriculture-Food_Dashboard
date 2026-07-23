import React, { useState } from 'react';
import {
  Home,
  BarChart3,
  Monitor,
  Brain,
  FileText,
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  X,
  Database,
} from 'lucide-react';
import {
  NavigationSection,
  ExecutiveSubTab,
  AnalyticsSubTab,
  MonitoringSubTab,
  IntelligenceSubTab,
  ReportsSubTab,
  AdminSubTab,
  SettingsSubTab,
} from '../types';

interface SidebarProps {
  activeSection: NavigationSection;
  setActiveSection: (sec: NavigationSection) => void;
  activeExecutiveSub: ExecutiveSubTab;
  setActiveExecutiveSub: (sub: ExecutiveSubTab) => void;
  activeAnalyticsSub: AnalyticsSubTab;
  setActiveAnalyticsSub: (sub: AnalyticsSubTab) => void;
  activeMonitoringSub: MonitoringSubTab;
  setActiveMonitoringSub: (sub: MonitoringSubTab) => void;
  activeIntelligenceSub: IntelligenceSubTab;
  setActiveIntelligenceSub: (sub: IntelligenceSubTab) => void;
  activeReportsSub: ReportsSubTab;
  setActiveReportsSub: (sub: ReportsSubTab) => void;
  activeAdminSub: AdminSubTab;
  setActiveAdminSub: (sub: AdminSubTab) => void;
  activeSettingsSub: SettingsSubTab;
  setActiveSettingsSub: (sub: SettingsSubTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  activeExecutiveSub,
  setActiveExecutiveSub,
  activeAnalyticsSub,
  setActiveAnalyticsSub,
  activeMonitoringSub,
  setActiveMonitoringSub,
  activeIntelligenceSub,
  setActiveIntelligenceSub,
  activeReportsSub,
  setActiveReportsSub,
  activeAdminSub,
  setActiveAdminSub,
  activeSettingsSub,
  setActiveSettingsSub,
  isOpenMobile,
  onCloseMobile,
}) => {
  // Collapsible state for each section
  const [openSections, setOpenSections] = useState<Record<NavigationSection, boolean>>({
    executive: true,
    analytics: true,
    monitoring: true,
    intelligence: true,
    reports: false,
    administration: false,
    settings: false,
  });

  const toggleSection = (sec: NavigationSection) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
    setActiveSection(sec);
  };

  const navClass = (section: NavigationSection) =>
    activeSection === section
      ? 'bg-emerald-500/10 text-emerald-400 font-bold border-l-4 border-emerald-400 shadow-sm shadow-emerald-500/10'
      : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium';

  const subClass = (isActive: boolean) =>
    isActive
      ? 'text-emerald-400 bg-emerald-500/15 font-bold'
      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 font-normal';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#08080a]/95 backdrop-blur-md border-r border-white/10 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Mobile Header Close Button */}
          <div className="lg:hidden p-4 border-b border-white/10 flex items-center justify-between">
            <span className="font-bold text-slate-200 text-sm">Menu Papan Pemuka</span>
            <button onClick={onCloseMobile} className="p-1 rounded-lg text-slate-400 hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ministry Branding Badge */}
          <div className="p-4 mx-3 my-3 bg-gradient-to-br from-emerald-950 via-[#121215] to-black text-white rounded-2xl border border-emerald-500/20 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Data Rasmi Pertanian
              </span>
            </div>
            <h2 className="text-sm font-bold tracking-tight text-white">Agriculture & Food Dashboard</h2>
            <p className="text-[11px] text-emerald-200/80 mt-1">Sistem Sokongan Keputusan Eksekutif</p>
          </div>

          {/* Main Tree Menu (Bahasa Malaysia) */}
          <nav className="px-3 py-2 space-y-1 text-xs">

            {/* 1. Papan Pemuka Eksekutif */}
            <div>
              <button
                onClick={() => toggleSection('executive')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${navClass('executive')}`}
              >
                <div className="flex items-center gap-2.5">
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span>Papan Pemuka Eksekutif</span>
                </div>
                {openSections.executive ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {openSections.executive && (
                <div className="ml-7 my-1 pl-2 border-l border-white/10 space-y-1">
                  <button
                    onClick={() => { setActiveSection('executive'); setActiveExecutiveSub('kpi'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-2 ${subClass(activeSection === 'executive' && activeExecutiveSub === 'kpi')}`}
                  >
                    <Activity className="w-3.5 h-3.5" /> Ringkasan KPI
                  </button>
                  <button
                    onClick={() => { setActiveSection('executive'); setActiveExecutiveSub('insights'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-2 ${subClass(activeSection === 'executive' && activeExecutiveSub === 'insights')}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Analisis Eksekutif AI
                  </button>
                  <button
                    onClick={() => { setActiveSection('executive'); setActiveExecutiveSub('trends'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-2 ${subClass(activeSection === 'executive' && activeExecutiveSub === 'trends')}`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" /> Ringkasan Trend
                  </button>
                  <button
                    onClick={() => { setActiveSection('executive'); setActiveExecutiveSub('activity'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-2 ${subClass(activeSection === 'executive' && activeExecutiveSub === 'activity')}`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Log Aktiviti Data
                  </button>
                </div>
              )}
            </div>

            {/* 2. Analisis & Unjuran Data */}
            <div>
              <button
                onClick={() => toggleSection('analytics')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${navClass('analytics')}`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Analisis & Unjuran Data</span>
                </div>
                {openSections.analytics ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {openSections.analytics && (
                <div className="ml-7 my-1 pl-2 border-l border-white/10 space-y-1">
                  <button
                    onClick={() => { setActiveSection('analytics'); setActiveAnalyticsSub('performance'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'analytics' && activeAnalyticsSub === 'performance')}`}
                  >
                    Analisis Prestasi (SSR)
                  </button>
                  <button
                    onClick={() => { setActiveSection('analytics'); setActiveAnalyticsSub('department'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'analytics' && activeAnalyticsSub === 'department')}`}
                  >
                    Analisis Sumber Terbuka
                  </button>
                  <button
                    onClick={() => { setActiveSection('analytics'); setActiveAnalyticsSub('sla'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'analytics' && activeAnalyticsSub === 'sla')}`}
                  >
                    Statistik Tanah & Sumber
                  </button>
                  <button
                    onClick={() => { setActiveSection('analytics'); setActiveAnalyticsSub('forecast'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'analytics' && activeAnalyticsSub === 'forecast')}`}
                  >
                    Unjuran SSR Padi 2025-2030
                  </button>
                  <button
                    onClick={() => { setActiveSection('analytics'); setActiveAnalyticsSub('ai'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all font-semibold text-emerald-400 ${subClass(activeSection === 'analytics' && activeAnalyticsSub === 'ai')}`}
                  >
                    ✨ Syor Pintar AI
                  </button>
                </div>
              )}
            </div>

            {/* 3. Pemantauan & Amaran Isyarat */}
            <div>
              <button
                onClick={() => toggleSection('monitoring')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${navClass('monitoring')}`}
              >
                <div className="flex items-center gap-2.5">
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  <span>Pemantauan & Amaran</span>
                </div>
                {openSections.monitoring ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {openSections.monitoring && (
                <div className="ml-7 my-1 pl-2 border-l border-white/10 space-y-1">
                  <button
                    onClick={() => { setActiveSection('monitoring'); setActiveMonitoringSub('live'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'monitoring' && activeMonitoringSub === 'live')}`}
                  >
                    Status Harga Langsung
                  </button>
                  <button
                    onClick={() => { setActiveSection('monitoring'); setActiveMonitoringSub('tracking'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'monitoring' && activeMonitoringSub === 'tracking')}`}
                  >
                    Peta Hasil Negeri (CPI)
                  </button>
                  <button
                    onClick={() => { setActiveSection('monitoring'); setActiveMonitoringSub('alerts'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'monitoring' && activeMonitoringSub === 'alerts')}`}
                  >
                    Pusat Amaran Cuaca & Perosak
                  </button>
                  <button
                    onClick={() => { setActiveSection('monitoring'); setActiveMonitoringSub('risk'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'monitoring' && activeMonitoringSub === 'risk')}`}
                  >
                    Pemantauan Risiko Makanan
                  </button>
                </div>
              )}
            </div>

            {/* 4. Pusat Maklumat & Pekeliling */}
            <div>
              <button
                onClick={() => toggleSection('intelligence')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${navClass('intelligence')}`}
              >
                <div className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <span>Pusat Maklumat Policy</span>
                </div>
                {openSections.intelligence ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {openSections.intelligence && (
                <div className="ml-7 my-1 pl-2 border-l border-white/10 space-y-1">
                  <button
                    onClick={() => { setActiveSection('intelligence'); setActiveIntelligenceSub('search'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'intelligence' && activeIntelligenceSub === 'search')}`}
                  >
                    Carian Data Global
                  </button>
                  <button
                    onClick={() => { setActiveSection('intelligence'); setActiveIntelligenceSub('pekeliling'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'intelligence' && activeIntelligenceSub === 'pekeliling')}`}
                  >
                    Pekeliling & Dasar Rasmi
                  </button>
                  <button
                    onClick={() => { setActiveSection('intelligence'); setActiveIntelligenceSub('assistant'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all font-semibold text-emerald-400 ${subClass(activeSection === 'intelligence' && activeIntelligenceSub === 'assistant')}`}
                  >
                    🤖 Pembantu AI Pertanian
                  </button>
                  <button
                    onClick={() => { setActiveSection('intelligence'); setActiveIntelligenceSub('knowledge'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'intelligence' && activeIntelligenceSub === 'knowledge')}`}
                  >
                    Pusat Pengetahuan DSMN
                  </button>
                </div>
              )}
            </div>

            {/* 5. Laporan PDF & Excel */}
            <div>
              <button
                onClick={() => toggleSection('reports')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${navClass('reports')}`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Laporan Eksekutif</span>
                </div>
                {openSections.reports ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {openSections.reports && (
                <div className="ml-7 my-1 pl-2 border-l border-white/10 space-y-1">
                  <button
                    onClick={() => { setActiveSection('reports'); setActiveReportsSub('dashboard'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'reports' && activeReportsSub === 'dashboard')}`}
                  >
                    Ringkasan Laporan Papan Pemuka
                  </button>
                  <button
                    onClick={() => { setActiveSection('reports'); setActiveReportsSub('pdf'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'reports' && activeReportsSub === 'pdf')}`}
                  >
                    Jana Laporan PDF
                  </button>
                  <button
                    onClick={() => { setActiveSection('reports'); setActiveReportsSub('excel'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'reports' && activeReportsSub === 'excel')}`}
                  >
                    Eksport Data Excel
                  </button>
                  <button
                    onClick={() => { setActiveSection('reports'); setActiveReportsSub('scheduled'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'reports' && activeReportsSub === 'scheduled')}`}
                  >
                    Laporan Terjadual
                  </button>
                  <button
                    onClick={() => { setActiveSection('reports'); setActiveReportsSub('historical'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'reports' && activeReportsSub === 'historical')}`}
                  >
                    Arkib Laporan
                  </button>
                </div>
              )}
            </div>

            {/* 6. Pentadbiran & Log Audit */}
            <div>
              <button
                onClick={() => toggleSection('administration')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${navClass('administration')}`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Pentadbiran & Log Audit</span>
                </div>
                {openSections.administration ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {openSections.administration && (
                <div className="ml-7 my-1 pl-2 border-l border-white/10 space-y-1">
                  <button
                    onClick={() => { setActiveSection('administration'); setActiveAdminSub('users'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'administration' && activeAdminSub === 'users')}`}
                  >
                    Pengguna Sistem
                  </button>
                  <button
                    onClick={() => { setActiveSection('administration'); setActiveAdminSub('roles'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'administration' && activeAdminSub === 'roles')}`}
                  >
                    Peranan & Akses
                  </button>
                  <button
                    onClick={() => { setActiveSection('administration'); setActiveAdminSub('permissions'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'administration' && activeAdminSub === 'permissions')}`}
                  >
                    Keizinan Data
                  </button>
                  <button
                    onClick={() => { setActiveSection('administration'); setActiveAdminSub('audit'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'administration' && activeAdminSub === 'audit')}`}
                  >
                    Log Jejaktapak Audit
                  </button>
                </div>
              )}
            </div>

            {/* 7. Tetapan Sistem & API */}
            <div>
              <button
                onClick={() => toggleSection('settings')}
                className={`w-full flex items-center justify-between p-[#0a0a0d] p-2.5 rounded-xl transition-all ${navClass('settings')}`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-emerald-400" />
                  <span>Tetapan & Integrasi</span>
                </div>
                {openSections.settings ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {openSections.settings && (
                <div className="ml-7 my-1 pl-2 border-l border-white/10 space-y-1">
                  <button
                    onClick={() => { setActiveSection('settings'); setActiveSettingsSub('general'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'settings' && activeSettingsSub === 'general')}`}
                  >
                    Umum
                  </button>
                  <button
                    onClick={() => { setActiveSection('settings'); setActiveSettingsSub('notifications'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'settings' && activeSettingsSub === 'notifications')}`}
                  >
                    Pemberitahuan
                  </button>
                  <button
                    onClick={() => { setActiveSection('settings'); setActiveSettingsSub('integrations'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'settings' && activeSettingsSub === 'integrations')}`}
                  >
                    Integrasi Portal Open Data
                  </button>
                  <button
                    onClick={() => { setActiveSection('settings'); setActiveSettingsSub('security'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'settings' && activeSettingsSub === 'security')}`}
                  >
                    Keselamatan
                  </button>
                  <button
                    onClick={() => { setActiveSection('settings'); setActiveSettingsSub('theme'); }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all ${subClass(activeSection === 'settings' && activeSettingsSub === 'theme')}`}
                  >
                    Tema Visual
                  </button>
                </div>
              )}
            </div>

          </nav>
        </div>

        {/* Footer info card showing the official data sources */}
        <div className="p-3 m-3 bg-[#121215] border border-white/10 rounded-xl text-[11px]">
          <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
            <span>Status Sumber Data</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Terhubung
            </span>
          </div>
          <div className="space-y-0.5 text-slate-400 text-[10px]">
            <p className="flex items-center gap-1 text-emerald-300"><Database className="w-3 h-3 text-emerald-400 inline" /> open.dosm.gov.my</p>
            <p className="flex items-center gap-1 text-emerald-300"><Database className="w-3 h-3 text-emerald-400 inline" /> data.gov.my</p>
            <p className="flex items-center gap-1 text-emerald-300"><Database className="w-3 h-3 text-emerald-400 inline" /> Open Data - MATRADE</p>
            <p className="flex items-center gap-1 text-emerald-300"><Database className="w-3 h-3 text-emerald-400 inline" /> KPKM.gov.my</p>
          </div>
        </div>
      </aside>
    </>
  );
};
