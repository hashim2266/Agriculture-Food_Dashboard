import React from 'react';
import {
  MonitoringSubTab,
  AlertItem,
  RegionalPriceData,
} from '../../types';
import { Three3DCropVisualizer } from '../charts/Three3DCropVisualizer';
import {
  Monitor,
  AlertTriangle,
  Radio,
  Truck,
  ShieldCheck,
  CloudRain,
  Activity,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface MonitoringViewProps {
  subTab: MonitoringSubTab;
  setSubTab: (tab: MonitoringSubTab) => void;
  alerts: AlertItem[];
  regionalPrices: RegionalPriceData[];
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  subTab,
  setSubTab,
  alerts,
  regionalPrices,
}) => {
  return (
    <div className="space-y-6">
      {/* Monitoring Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#08080a] rounded-2xl border border-white/10 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSubTab('live')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'live' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          Live Status
        </button>

        <button
          onClick={() => setSubTab('tracking')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'tracking' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-400" />
          Tracking Center
        </button>

        <button
          onClick={() => setSubTab('alerts')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'alerts' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Alert Center ({alerts.length})
        </button>

        <button
          onClick={() => setSubTab('risk')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'risk' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Risk Monitoring
        </button>
      </div>

      {/* SUB TAB 1: LIVE STATUS & 3D SIMULATION */}
      {subTab === 'live' && (
        <div className="space-y-6">
          {/* 3D Crop Visualizer */}
          <Three3DCropVisualizer
            title="3D Paddy Hybrid Field Simulation (Live IoT Soil Metrics)"
            subtitle="Interactive 3D Yield Modeling based on Moisture, Temperature, & NPK Fertilizer"
            height={360}
          />

          {/* Regional Live Telemetry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {regionalPrices.slice(0, 3).map((reg) => (
              <div key={reg.code} className="p-4 bg-[#121215]/80 rounded-2xl border border-white/10 shadow-lg space-y-2">
                <div className="flex justify-between font-bold text-white">
                  <span>{reg.state}</span>
                  <span className="text-emerald-400">{reg.paddyYieldHa} Tonnes/Ha</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Time: {reg.deliveryDays} Days</span>
                  <span className="font-semibold text-slate-300">CPI: {reg.cpiIndex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 2: TRACKING CENTER */}
      {subTab === 'tracking' && (
        <div className="bg-[#121215]/80 rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-base">Farm-to-Market Supply Chain Tracking</h3>
          <p className="text-xs text-slate-400">Transit duration, cold-chain temperature compliance, & delivery SLAs</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 font-bold uppercase text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Route Origin</th>
                  <th className="py-2.5 px-3">Destination Market</th>
                  <th className="py-2.5 px-3">Transit Time</th>
                  <th className="py-2.5 px-3">Cold Chain Temp</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">Kedah Granary (MUKIM 5)</td>
                  <td className="py-2.5 px-3 text-slate-300">Selangor Central Distribution Hub</td>
                  <td className="py-2.5 px-3 font-bold text-white">1.2 Days</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">24°C (Normal)</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-[10px]">On Schedule</span>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">Johor Poultry Complex</td>
                  <td className="py-2.5 px-3 text-slate-300">Kuala Lumpur Wholesale Market</td>
                  <td className="py-2.5 px-3 font-bold text-white">0.8 Days</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">4°C (Optimal)</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-[10px]">On Schedule</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 3: ALERT CENTER */}
      {subTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Active Food Security & Disaster Alerts</h3>
            <span className="text-xs font-bold text-red-400 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
              3 High Priority Incidents
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-4 rounded-2xl border shadow-lg transition-all ${
                  alt.severity === 'Critical'
                    ? 'bg-red-950/30 border-red-500/30'
                    : 'bg-amber-950/30 border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${alt.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'}`} />
                    <h4 className="font-bold text-white text-sm">{alt.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 border border-white/10 text-slate-300">
                    {alt.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mb-3">{alt.description}</p>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-200 font-semibold flex items-center justify-between">
                  <span>Required Policy Action: {alt.actionRequired}</span>
                  <button className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-bold text-[11px] transition-all">
                    Deploy Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: RISK MONITORING */}
      {subTab === 'risk' && (
        <div className="bg-[#121215]/80 rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-base">National Food Supply Risk Assessment Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 space-y-2">
              <span className="font-bold text-emerald-400 block text-sm">Crops Risk Level: LOW</span>
              <p className="text-slate-300">Rice SSR at 66.4% with sufficient strategic buffer stock (250,000 Tonnes) held by BERNAS.</p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 space-y-2">
              <span className="font-bold text-amber-400 block text-sm">Livestock Feed Risk Level: MODERATE</span>
              <p className="text-slate-300">Global grain corn price volatility requires active tariff monitoring and local grain corn cultivation grants.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
