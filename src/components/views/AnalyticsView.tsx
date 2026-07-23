import React, { useState } from 'react';
import {
  AnalyticsSubTab,
  SSRTrendItem,
  CommodityShare,
  LandUseData,
  AIInsightResponse,
} from '../../types';
import { Three3DDonutChart } from '../charts/Three3DDonutChart';
import { GraphStatisticalQuestions } from '../GraphStatisticalQuestions';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  Building,
  Clock,
  TrendingUp,
  Sparkles,
  PieChart as PieIcon,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Calculator,
} from 'lucide-react';

interface AnalyticsViewProps {
  subTab: AnalyticsSubTab;
  setSubTab: (tab: AnalyticsSubTab) => void;
  commodityShares: CommodityShare[];
  landUseData: LandUseData[];
  aiInsight: AIInsightResponse | null;
  isLoadingAi: boolean;
  onRefreshAi: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  subTab,
  setSubTab,
  commodityShares,
  landUseData,
  aiInsight,
  isLoadingAi,
  onRefreshAi,
}) => {
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [selectedDept, setSelectedDept] = useState<'KPKM' | 'DOSM' | 'MARDI' | 'DOF' | 'LPP'>('KPKM');
  const [focusArea, setFocusArea] = useState('Paddy & Granary Infrastructure');

  // Donut chart slices for Beef import share vs local
  const beefDonutData = [
    { name: 'Import Reliance (Beef)', value: 76.2, color: '#f59e0b', tonnage: 160000 },
    { name: 'Local Production (Beef)', value: 23.8, color: '#059669', tonnage: 50000 },
  ];

  // Donut chart slices for Mutton import share vs local
  const muttonDonutData = [
    { name: 'Import Reliance (Mutton)', value: 87.9, color: '#ef4444', tonnage: 42100 },
    { name: 'Local Production (Mutton)', value: 12.1, color: '#10b981', tonnage: 5900 },
  ];

  // Forecast projections data (2025-2030)
  const forecastData = [
    { year: 2024, riceActual: 66.4, riceTarget: 66.4, poultryActual: 102.8, beefActual: 23.8 },
    { year: 2025, riceActual: 68.2, riceTarget: 68.0, poultryActual: 103.5, beefActual: 25.0 },
    { year: 2026, riceActual: 70.1, riceTarget: 70.0, poultryActual: 104.2, beefActual: 27.2 },
    { year: 2027, riceActual: 71.8, riceTarget: 72.0, poultryActual: 105.0, beefActual: 30.0 },
    { year: 2028, riceActual: 73.2, riceTarget: 73.5, poultryActual: 105.5, beefActual: 33.5 },
    { year: 2029, riceActual: 74.5, riceTarget: 74.5, poultryActual: 106.0, beefActual: 37.0 },
    { year: 2030, riceActual: 76.0, riceTarget: 75.0, poultryActual: 107.0, beefActual: 40.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#08080a] rounded-2xl border border-white/10 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSubTab('performance')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'performance' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          Performance Analytics
        </button>

        <button
          onClick={() => setSubTab('department')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'department' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building className="w-4 h-4 text-emerald-400" />
          Department Analytics
        </button>

        <button
          onClick={() => setSubTab('sla')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'sla' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" />
          SLA Analytics
        </button>

        <button
          onClick={() => setSubTab('forecast')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'forecast' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Forecast Analytics (2025-2030)
        </button>

        <button
          onClick={() => setSubTab('ai')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'ai' ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20 font-bold' : 'text-emerald-400 hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          AI Insights
        </button>
      </div>

      {/* SUB TAB 1: PERFORMANCE ANALYTICS */}
      {subTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Donut Chart 1: Beef Import Share */}
            <Three3DDonutChart
              data={beefDonutData}
              title="Beef Meat Import vs Local Share (3D View)"
              subtitle="76.2% Import Dependency - MYR 2.45B Annual Import Value"
              centerText="Beef Supply"
              height={320}
            />

            {/* 3D Donut Chart 2: Mutton Import Share */}
            <Three3DDonutChart
              data={muttonDonutData}
              title="Mutton / Lamb Import vs Local Share (3D View)"
              subtitle="87.9% Import Dependency - High Policy Intervention Need"
              centerText="Mutton Share"
              height={320}
            />
          </div>

          {/* Stacked Bar Chart for Regional Land Use */}
          <div className="rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/10 p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-semibold text-white text-base">
                  Agricultural Land Use & Resource Allocation (Stacked Bar)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparison across Northern, Central, Southern, East Coast, & Borneo Zones
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStatsModal(true)}
                  className="px-3 py-1.5 text-xs rounded-lg font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 font-bold"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Statistical Questions</span>
                </button>

                <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  DOSM Environmental Stats
                </span>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={landUseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="category" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#121215', borderRadius: '12px', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} />
                  <Bar dataKey="paddyHa" name="Paddy Granary (Ha)" stackId="a" fill="#10b981" />
                  <Bar dataKey="fruitVegHa" name="Fruits & Veg (Ha)" stackId="a" fill="#34d399" />
                  <Bar dataKey="rubberHa" name="Rubber (Ha)" stackId="a" fill="#fbbf24" />
                  <Bar dataKey="oilPalmHa" name="Oil Palm (Ha)" stackId="a" fill="#52525b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: DEPARTMENT ANALYTICS */}
      {subTab === 'department' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {(['KPKM', 'DOSM', 'MARDI', 'DOF', 'LPP'] as const).map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  selectedDept === dept
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {dept} Department
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#121215]/80 rounded-2xl border border-white/10 shadow-lg">
              <span className="text-xs font-bold text-slate-400 uppercase">Program Budget Executed</span>
              <span className="block text-2xl font-extrabold text-white mt-1">RM 1,250.0M</span>
              <span className="text-xs text-emerald-400 font-bold mt-1 block">94.4% Utilization Rate</span>
            </div>
            <div className="p-4 bg-[#121215]/80 rounded-2xl border border-white/10 shadow-lg">
              <span className="text-xs font-bold text-slate-400 uppercase">SLA Target Resolution</span>
              <span className="block text-2xl font-extrabold text-white mt-1">98.2%</span>
              <span className="text-xs text-emerald-400 font-bold mt-1 block">Average Response: 1.4 Days</span>
            </div>
            <div className="p-4 bg-[#121215]/80 rounded-2xl border border-white/10 shadow-lg">
              <span className="text-xs font-bold text-slate-400 uppercase">Beneficiary Farmers Served</span>
              <span className="block text-2xl font-extrabold text-white mt-1">240,500</span>
              <span className="text-xs text-emerald-400 font-bold mt-1 block">Subsidized Fertilizer e-Vouchers</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: SLA ANALYTICS */}
      {subTab === 'sla' && (
        <div className="rounded-2xl bg-[#121215]/80 p-5 border border-white/10 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-base">Service Level Agreement (SLA) Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between font-bold text-white">
                <span>Subsidized Fertilizer Claim Verification</span>
                <span className="text-emerald-400">SLA: 24 Hours (99.1% Met)</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[99%]" />
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between font-bold text-white">
                <span>Monsoon Crop Insurance Disbursement</span>
                <span className="text-emerald-400">SLA: 5 Days (95.4% Met)</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[95%]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 4: FORECAST ANALYTICS */}
      {subTab === 'forecast' && (
        <div className="rounded-2xl bg-[#121215]/80 p-5 border border-white/10 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-base">National Rice SSR Projection (2025 - 2030)</h3>
              <p className="text-xs text-slate-400">Dasar Sekuriti Makanan Negara (DSMN) Roadmap Trajectory</p>
            </div>
            <button
              onClick={() => setShowStatsModal(true)}
              className="px-3 py-1.5 text-xs rounded-lg font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 font-bold self-start sm:self-auto"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Statistical Questions</span>
            </button>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="year" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} domain={[50, 85]} />
                <Tooltip contentStyle={{ backgroundColor: '#121215', borderRadius: '12px', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="riceActual" name="Projected Rice SSR (%)" stroke="#10b981" fill="#065f46" strokeWidth={3} />
                <Area type="monotone" dataKey="riceTarget" name="DSMN Mandate Target (%)" stroke="#fbbf24" fill="transparent" strokeDasharray="5 5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* SUB TAB 5: AI INSIGHTS */}
      {subTab === 'ai' && (
        <div className="rounded-2xl bg-[#121215]/80 p-6 border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Custom Gemini Policy Insight Generator</h3>
            </div>

            <button
              onClick={onRefreshAi}
              disabled={isLoadingAi}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingAi ? 'animate-spin' : ''}`} />
              Run Gemini AI Model
            </button>
          </div>

          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-slate-200">
            <h4 className="font-bold text-emerald-300 mb-2">Executive AI Assessment</h4>
            <p className="text-slate-200 leading-relaxed font-medium">
              {aiInsight?.insight || 'Loading customized policy assessment...'}
            </p>
          </div>
        </div>
      )}

      <GraphStatisticalQuestions
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        graphTitle="Agricultural Performance Analytics & Forecast Graph"
        datasetContext="ssrTrend"
      />
    </div>
  );
};
