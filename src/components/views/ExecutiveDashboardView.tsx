import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  DollarSign,
  Activity,
  Layers,
  Sprout,
  BarChart,
  RefreshCw,
  Calculator,
  Globe2,
  PieChart as PieChartIcon,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { SSRTrendItem, CommodityShare, RegionalPriceData, AIInsightResponse, IgfmasEntry } from '../../types';
import { gdpAgromakananData, exportCountryData } from '../../data/agriData';
import { Three3DBarChart } from '../charts/Three3DBarChart';
import { Three3DTerrainMap } from '../charts/Three3DTerrainMap';
import { ResponsiveContainer, LineChart, Line, BarChart as ReBarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { GraphStatisticalQuestions } from '../GraphStatisticalQuestions';

export interface ImportedCsvChartData {
  datasetName: string;
  xAxis: string;
  yAxis: string;
  rows: Record<string, any>[];
  chartType: 'line' | 'bar' | 'area';
}

interface ExecutiveDashboardViewProps {
  ssrTrends: SSRTrendItem[];
  commodityShares: CommodityShare[];
  regionalPrices: RegionalPriceData[];
  igfmasEntries: IgfmasEntry[];
  aiInsight: AIInsightResponse | null;
  isLoadingAi: boolean;
  onRefreshAi: () => void;
  onOpenIgfmasModal: () => void;
  importedCsvChart?: ImportedCsvChartData | null;
  onRemoveImportedChart?: () => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  ssrTrends,
  commodityShares,
  regionalPrices,
  igfmasEntries,
  aiInsight,
  isLoadingAi,
  onRefreshAi,
  onOpenIgfmasModal,
  importedCsvChart,
  onRemoveImportedChart,
}) => {
  const [showTrendStatsModal, setShowTrendStatsModal] = useState<boolean>(false);
  const [activeGdpYear, setActiveGdpYear] = useState<'2022' | '2021' | '2019'>('2022');

  const latestSSR = ssrTrends[ssrTrends.length - 1];
  const prevSSR = ssrTrends[ssrTrends.length - 2];

  const riceDiff = (latestSSR.rice - prevSSR.rice).toFixed(1);
  const totalBudgetMYR = igfmasEntries.reduce((sum, e) => sum + e.allocatedBudgetMYR, 0);
  const totalSpentMYR = igfmasEntries.reduce((sum, e) => sum + e.actualSpentMYR, 0);

  // Chart #1: KDNK Agromakanan 3D Bar Chart Data
  const gdp3DData = gdpAgromakananData
    .filter((d) => d.subsector !== 'Agromakanan (Jumlah)')
    .map((item, idx) => {
      const val =
        activeGdpYear === '2022'
          ? item.value2022
          : activeGdpYear === '2021'
          ? item.value2021
          : item.value2019;
      const colors = ['#059669', '#f59e0b', '#3b82f6'];
      return {
        label: `${item.subsector} (${activeGdpYear})`,
        value: val,
        color: colors[idx % colors.length],
      };
    });

  // Export Data for Chart #2 (top 10 countries)
  const top10Exports = exportCountryData.filter((d) => d.country !== 'Negara-Negara Lain');

  return (
    <div className="space-y-6">
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: KDNK Agromakanan 2022 */}
        <div className="rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/10 p-4 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">KDNK Agromakanan (2022)</span>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white">RM 52,549M</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> Data DOSM
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-2">
            <span>Tanaman Makanan: RM 24,518M (46.7%)</span>
            <span className="font-semibold text-emerald-400">Nilai Ditambah</span>
          </div>
        </div>

        {/* Card 2: Ternakan & Perikanan */}
        <div className="rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/10 p-4 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ternakan & Perikanan (2022)</span>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white">RM 28,030M</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +1.3% Growth
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-2">
            <span>Ternakan: 31.5% | Perikanan: 21.9%</span>
            <span className="font-semibold text-slate-300">DOSM Report</span>
          </div>
        </div>

        {/* Card 3: Jumlah Eksport Bahan Makanan */}
        <div className="rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-emerald-500/30 p-4 shadow-lg hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Eksport Bahan Makanan (2022)</span>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Globe2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-emerald-400">RM 44.55B</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +15.35% YoY
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-2">
            <span>Pasaran Utama: Singapura (19.1%)</span>
            <span className="font-semibold text-emerald-300">MATRADE/DOSM</span>
          </div>
        </div>

        {/* Card 4: IGFMAS Budget Allocation */}
        <div className="rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/10 p-4 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peruntukan Bajet Kerajaan</span>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white">
              RM{(totalBudgetMYR / 1000).toFixed(2)}B
            </span>
            <span className="text-xs font-bold text-emerald-400">
              {((totalSpentMYR / totalBudgetMYR) * 100).toFixed(0)}% Dibelanja
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-2">
            <span>Entry IGFMAS: {igfmasEntries.length} Rekod</span>
            <button
              onClick={onOpenIgfmasModal}
              className="text-emerald-400 font-bold hover:underline"
            >
              + Key-in Data
            </button>
          </div>
        </div>
      </div>

      {/* Gemini AI Executive Insights Panel */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-[#121215] to-black text-white p-5 lg:p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Gemini AI Executive Policy Advisor</h3>
              <p className="text-xs text-emerald-300/80">Sintesis Laporan Rasmi KDNK Agromakanan & Eksport DOSM 2022</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-black/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg">
              Status Agromakanan: Mampan (RM52.5B)
            </span>
            <button
              onClick={onRefreshAi}
              disabled={isLoadingAi}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
              {isLoadingAi ? 'Menganalisis...' : 'Analisis Semula'}
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          <div className="lg:col-span-2 space-y-2">
            <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider">Ringkasan Eksekutif KDNK & Eksport</h4>
            <p className="text-slate-200 text-sm leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/10">
              {aiInsight?.insight || 'Sektor Agromakanan menyumbang RM 52,549 Juta kepada KDNK negara pada tahun 2022. Tanaman Makanan kekal sebagai penyumbang terbesar (46.7%), diikuti Ternakan (31.5%) dan Perikanan (21.9%). Eksport bahan makanan melonjak +15.35% YoY mencecah RM 44.55 Bilion, didorong oleh pertumbuhan kukuh ke Singapura (RM8.51B), China (RM5.54B) dan Indonesia (RM2.60B).'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider">Syor Strategik Sektor Agromakanan</h4>
            <ul className="space-y-2 text-slate-200">
              {(aiInsight?.recommendations || [
                'Tingkatkan nilai tambah Tanaman Makanan (-3.7% pada 2022) menerusi teknologi pertanian persis MARDI',
                'Perluas fasiliti laluan eksport makanan ke pasaran Asia Tenggara (Indonesia +30.34%, Filipina +35.81%)',
                'Perkemaskan peruntukan bajet IGFMAS untuk pemodenan akuakultur perikanan (+2.5% growth)'
              ]).map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                  <span className="w-4 h-4 rounded-full bg-emerald-400 text-black font-extrabold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Imported CSV Chart Section (pushed from CSV Importer modal) */}
      {importedCsvChart && (
        <div className="rounded-2xl bg-[#121215]/90 backdrop-blur-md border border-emerald-500/40 p-5 shadow-2xl relative animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span>Carta Data CSV / Excel Terimport:</span>
                  <span className="text-emerald-400 font-mono">{importedCsvChart.datasetName}</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Data CSV dipaparkan secara dinamik di Papan Pemuka • Aksis X: <strong className="text-slate-200">{importedCsvChart.xAxis}</strong> | Aksis Y: <strong className="text-emerald-300">{importedCsvChart.yAxis}</strong> ({importedCsvChart.rows.length} rekod)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg uppercase">
                {importedCsvChart.chartType} Chart
              </span>
              {onRemoveImportedChart && (
                <button
                  onClick={onRemoveImportedChart}
                  className="p-1.5 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 rounded-lg border border-white/10 transition-colors"
                  title="Padam Graf CSV dari Papan Pemuka"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="h-[320px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              {importedCsvChart.chartType === 'line' ? (
                <LineChart data={importedCsvChart.rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey={importedCsvChart.xAxis} stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121215',
                      borderRadius: '12px',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={importedCsvChart.yAxis}
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              ) : importedCsvChart.chartType === 'bar' ? (
                <ReBarChart data={importedCsvChart.rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey={importedCsvChart.xAxis} stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121215',
                      borderRadius: '12px',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey={importedCsvChart.yAxis} fill="#10b981" radius={[4, 4, 0, 0]} />
                </ReBarChart>
              ) : (
                <AreaChart data={importedCsvChart.rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey={importedCsvChart.xAxis} stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121215',
                      borderRadius: '12px',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey={importedCsvChart.yAxis}
                    stroke="#10b981"
                    fill="#10b98125"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart No. 1: Interactive 3D Bar Chart for KDNK Agromakanan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D WebGL Bar Chart - Chart #1 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-[#18181d] p-3 border border-white/10 rounded-2xl text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <BarChart className="w-4 h-4 text-emerald-400" />
              Carta #1: KDNK Agromakanan (Interaktif 3D Canvas)
            </span>
            <div className="flex items-center gap-1.5">
              {(['2022', '2021', '2019'] as const).map((yr) => (
                <button
                  key={yr}
                  onClick={() => setActiveGdpYear(yr)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeGdpYear === yr
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          <Three3DBarChart
            data={gdp3DData}
            title={`Chart #1: KDNK Sektor Agromakanan ${activeGdpYear} (RM Juta)`}
            subtitle="Pusingkan kanvas 3D WebGL. Data rasmi KDNK Tanaman Makanan, Ternakan & Perikanan"
            unit=" RM Juta"
            height={360}
          />
        </div>

        {/* Chart #1 Multi-Year Comparison Table & Recharts Bar Chart */}
        <div className="rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/10 p-5 shadow-lg hover:border-emerald-500/30 transition-all flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="font-semibold text-white text-base">Trending KDNK Subsektor Agromakanan (2019 - 2022)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Perbandingan Nilai Ditambah (RM Juta) Mengikut Laporan DOSM</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTrendStatsModal(true)}
                className="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 font-bold"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>Soalan Statistik</span>
              </button>
            </div>
          </div>

          <div className="h-[260px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={gdpAgromakananData.filter((d) => d.subsector !== 'Agromakanan (Jumlah)')}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="subsector" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121215',
                    borderRadius: '12px',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="value2019" name="2019 (RM Juta)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value2021" name="2021 (RM Juta)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value2022" name="2022 (RM Juta)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Summary Numbers */}
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block font-medium">Tanaman Makanan</span>
              <span className="font-bold text-emerald-400">RM 24,518M (46.7%)</span>
            </div>
            <div className="p-2 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block font-medium">Ternakan</span>
              <span className="font-bold text-amber-400">RM 16,531M (31.5%)</span>
            </div>
            <div className="p-2 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block font-medium">Perikanan</span>
              <span className="font-bold text-blue-400">RM 11,499M (21.9%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart No. 2: Perbandingan Eksport Bahan Makanan Mengikut Negara (2021 vs 2022) */}
      <div className="rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/10 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white text-base">
                Carta #2: Perbandingan Eksport Bahan Makanan Mengikut Negara (2021 vs 2022 - Data DOSM)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Eksport Agromakanan Malaysia Mengikut Destinasi Utama (Nilai RM'000 & Kadar Pertumbuhan %)
            </p>
          </div>

          <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-xl self-start sm:self-auto">
            Jumlah 2022: RM 44,548,673 ('000) [+15.35%]
          </span>
        </div>

        {/* Chart representation of Exports */}
        <div className="h-[280px] w-full mb-5">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={top10Exports} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="country" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `RM${(val / 1000000).toFixed(1)}B`} />
              <Tooltip
                formatter={(value: any) => [`RM ${Number(value).toLocaleString('ms-MY')} ('000)`, 'Nilai Eksport']}
                contentStyle={{
                  backgroundColor: '#121215',
                  borderRadius: '12px',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="value2021MYR" name="2021 (RM'000)" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="value2022MYR" name="2022 (RM'000)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        {/* Full Official Table from User Image #2 */}
        <div className="overflow-x-auto border border-white/10 rounded-xl bg-black/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#18181d] text-slate-300 font-bold border-b border-white/10 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">Bil</th>
                <th className="py-2.5 px-3">Negara</th>
                <th className="py-2.5 px-3 text-right">2021 (RM'000)</th>
                <th className="py-2.5 px-3 text-right">2021 (%)</th>
                <th className="py-2.5 px-3 text-right">2022 (RM'000)</th>
                <th className="py-2.5 px-3 text-right">2022 (%)</th>
                <th className="py-2.5 px-3 text-right">Pertumbuhan (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {exportCountryData.map((row) => (
                <tr
                  key={row.rank}
                  className={`hover:bg-white/5 transition-colors ${
                    row.country === 'Negara-Negara Lain' ? 'bg-white/5 font-bold' : ''
                  }`}
                >
                  <td className="py-2 px-3 text-center text-slate-500">{row.rank}</td>
                  <td className="py-2 px-3 font-semibold text-white font-sans">{row.country}</td>
                  <td className="py-2 px-3 text-right text-slate-300">
                    {row.value2021MYR.toLocaleString('ms-MY')}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-400">{row.share2021.toFixed(2)}%</td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-400">
                    {row.value2022MYR.toLocaleString('ms-MY')}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-300">
                    {row.share2022.toFixed(2)}%
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        row.growthPercent >= 15
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : row.growthPercent >= 0
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      +{row.growthPercent.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-emerald-500/10 border-t-2 border-emerald-500/30 font-bold text-white text-xs">
                <td className="py-2.5 px-3 text-center" colSpan={2}>
                  JUMLAH KESELURUHAN
                </td>
                <td className="py-2.5 px-3 text-right">38,621,772</td>
                <td className="py-2.5 px-3 text-right">100.00%</td>
                <td className="py-2.5 px-3 text-right text-emerald-400">44,548,673</td>
                <td className="py-2.5 px-3 text-right text-emerald-300">100.00%</td>
                <td className="py-2.5 px-3 text-right text-emerald-400">+15.35%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3D Regional CPI & Food Price Map */}
      <Three3DTerrainMap
        data={regionalPrices}
        title="Peta Spatial 3D CPI & Indeks Makanan Mengikut Negeri"
        subtitle="Ketinggian 3D mewakili Indeks Harga Pengguna (CPI). Warna mewakili Tahap Risiko Keterjaminan Makanan"
        height={380}
      />

      {/* IGFMAS Verified Government Budget Ledger */}
      <div className="rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/10 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-white text-base">Ledger Peruntukan Bajet Kerajaan (IGFMAS)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Subsidi Baja Padi, Bantuan Pesawah, & R&D Perikanan KPKM</p>
          </div>

          <button
            onClick={onOpenIgfmasModal}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            + Key-In Rekod IGFMAS
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">Kod Rujukan</th>
                <th className="py-2.5 px-3">Jabatan</th>
                <th className="py-2.5 px-3">Program Komoditi</th>
                <th className="py-2.5 px-3">Bajet (RM Juta)</th>
                <th className="py-2.5 px-3">Belanja (RM Juta)</th>
                <th className="py-2.5 px-3">Hasil (Tan/Ha)</th>
                <th className="py-2.5 px-3">Kesan SSR</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {igfmasEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">{entry.referenceCode}</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-400">
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                      {entry.department}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">{entry.commodity}</td>
                  <td className="py-2.5 px-3 font-bold text-white">RM{entry.allocatedBudgetMYR.toFixed(1)}M</td>
                  <td className="py-2.5 px-3 font-medium text-slate-300">RM{entry.actualSpentMYR.toFixed(1)}M</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">{entry.yieldPerHectare}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">+{entry.ssrImpact}%</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        entry.status === 'Disahkan'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Banner */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sistem Papan Pemuka Pertanian & Keterjaminan Makanan</span>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full">
          <span className="text-amber-300 font-extrabold tracking-wide text-xs">✨ Design by MrMH</span>
        </div>
      </div>

      <GraphStatisticalQuestions
        isOpen={showTrendStatsModal}
        onClose={() => setShowTrendStatsModal(false)}
        graphTitle="KDNK Sektor Agromakanan (2019-2022) & Eksport DOSM"
        datasetContext="gdpAgromakanan"
      />
    </div>
  );
};

