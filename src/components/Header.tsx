import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Bell,
  Download,
  Menu,
  Calculator,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';
import { GraphStatisticalQuestions } from './GraphStatisticalQuestions';

interface HeaderProps {
  onOpenIgfmasModal: () => void;
  onOpenCsvModal: () => void;
  onSearch: (term: string) => void;
  onExportPDF: () => void;
  toggleSidebarMobile: () => void;
  activeSectionTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenIgfmasModal,
  onOpenCsvModal,
  onSearch,
  onExportPDF,
  toggleSidebarMobile,
  activeSectionTitle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGlobalStatsModal, setShowGlobalStatsModal] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0d]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-6 py-3 shadow-lg transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebarMobile}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10 transition-colors"
            title="Menu Utama"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-black flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/20">
              Ag
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base lg:text-lg font-bold text-white tracking-tight">
                  Agriculture & Food Dashboard
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                  Portal Rasmi Data
                </span>
                <span className="inline-flex px-2 py-0.5 text-[10px] font-extrabold tracking-wide bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 rounded-full border border-amber-500/30 shadow-xs">
                  ✨ Design by MrMH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {activeSectionTitle} • Sumber Data: OpenDOSM, data.gov.my, MATRADE & KPKM.gov.my
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Carian Data (open.dosm.gov.my, data.gov.my, MATRADE, KPKM)..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-white/5 hover:bg-white/10 focus:bg-[#121215] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all placeholder:text-slate-500"
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Statistical Questions Inspector Quick Button */}
          <button
            onClick={() => setShowGlobalStatsModal(true)}
            className="px-3 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="Enjin Soalan & Analisis Statistik"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Soalan Statistik</span>
          </button>

          {/* Tarik Data Excel / CSV Open Data Button */}
          <button
            onClick={onOpenCsvModal}
            className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="Import & Visual Data Excel (.xlsx, .xls) & CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Import Excel / CSV</span>
          </button>

          {/* Key-In Open Data / KPKM Button */}
          <button
            onClick={onOpenIgfmasModal}
            className="px-3 py-2 bg-emerald-400 hover:bg-emerald-300 text-black rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span className="hidden sm:inline">Kemaskini Data KPKM</span>
          </button>

          {/* Quick PDF Report Export */}
          <button
            onClick={onExportPDF}
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5"
            title="Muat Turun Laporan PDF Eksekutif"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden xl:inline">Eksport PDF</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl border border-white/10 transition-all relative"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0a0a0d] animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#121215] rounded-2xl border border-white/10 shadow-2xl p-3 z-50 text-xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-white">Amaran Isyarat Eksekutif</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">3 Baharu</span>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <span className="font-bold text-amber-300 block">Amaran Monsoi (Pantai Timur)</span>
                    <span className="text-amber-200/80 text-[11px]">Risiko limpahan air di Lembangan Padi Kemubu.</span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <span className="font-bold text-slate-200 block">Data OpenDOSM Suku II Dikemaskini</span>
                    <span className="text-slate-400 text-[11px]">Set data IHPR negeri dan hasil pertanian sedia disemak.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-extrabold flex items-center justify-center text-xs">
              AZ
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-white">Dato' Dr. Azman</span>
              <span className="block text-[10px] text-slate-400 font-medium">Setiausaha Bahagian KPKM</span>
            </div>
          </div>
        </div>
      </div>

      <GraphStatisticalQuestions
        isOpen={showGlobalStatsModal}
        onClose={() => setShowGlobalStatsModal(false)}
        graphTitle="Papan Pemuka Pertanian & Keterjaminan Makanan - Graf Master"
        datasetContext="ssrTrend"
      />
    </header>
  );
};
