import React, { useState } from 'react';
import { ReportsSubTab, SSRTrendItem, CommodityShare, IgfmasEntry } from '../../types';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Printer,
  Share2,
} from 'lucide-react';

interface ReportsViewProps {
  subTab: ReportsSubTab;
  setSubTab: (tab: ReportsSubTab) => void;
  ssrTrends: SSRTrendItem[];
  commodityShares: CommodityShare[];
  igfmasEntries: IgfmasEntry[];
  onTriggerPDFExport: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  subTab,
  setSubTab,
  ssrTrends,
  commodityShares,
  igfmasEntries,
  onTriggerPDFExport,
}) => {
  const [reportType, setReportType] = useState('National Executive Briefing');

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#08080a] rounded-2xl border border-white/10 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSubTab('dashboard')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'dashboard' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          Dashboard Reports
        </button>

        <button
          onClick={() => setSubTab('pdf')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'pdf' ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Download className="w-4 h-4 text-emerald-400" />
          PDF Export Briefing
        </button>

        <button
          onClick={() => setSubTab('excel')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'excel' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Excel Export (.xlsx)
        </button>

        <button
          onClick={() => setSubTab('scheduled')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'scheduled' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-400" />
          Scheduled Reports
        </button>

        <button
          onClick={() => setSubTab('historical')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'historical' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" />
          Historical Reports Archive
        </button>
      </div>

      {/* PDF Export Briefing Preview */}
      <div className="bg-[#121215]/80 rounded-2xl p-6 border border-white/10 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Official Government Document</span>
            <h3 className="font-bold text-white text-lg">National Agriculture Executive Briefing Report</h3>
            <p className="text-xs text-slate-400">Formatted for Cabinet Ministers & Senior Policy Secretaries</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerPDFExport}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Generate PDF File
            </button>
          </div>
        </div>

        {/* Executive Report Preview Card */}
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-xs space-y-4 font-sans">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <div>
              <h4 className="font-bold text-white text-sm">KEMENTERIAN PERTANIAN DAN KETERJAMINAN MAKANAN (KPKM)</h4>
              <p className="text-slate-400">Executive Food Security Assessment Report - Q2 2024</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded text-[11px] border border-emerald-500/30">
              RESTRICTED
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 font-semibold text-slate-300">
            <div className="bg-[#18181b] p-3 rounded-xl border border-white/10">
              <span className="block text-[10px] text-slate-400 uppercase">National Rice SSR</span>
              <span className="text-lg font-bold text-emerald-400">66.4%</span>
            </div>
            <div className="bg-[#18181b] p-3 rounded-xl border border-white/10">
              <span className="block text-[10px] text-slate-400 uppercase">Poultry SSR</span>
              <span className="text-lg font-bold text-emerald-400">102.8%</span>
            </div>
            <div className="bg-[#18181b] p-3 rounded-xl border border-white/10">
              <span className="block text-[10px] text-slate-400 uppercase">Beef Import Share</span>
              <span className="text-lg font-bold text-amber-400">76.2%</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-slate-300 text-xs mb-1">Key Findings Summary:</h5>
            <p className="text-slate-300 leading-relaxed bg-[#18181b] p-3 rounded-xl border border-white/10">
              Rice production across Northern Granaries (Kedah/Perak) recorded a +2.1% yield increase following MARDI MR315 high-yield seeds adoption. Beef and mutton import dependency remain elevated at 76.2% and 87.9% respectively. Total IGFMAS budget execution stands at 94.4% of allocated MYR 1.57 Billion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
