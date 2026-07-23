import React, { useState } from 'react';
import { SettingsSubTab } from '../../types';
import { Sliders, Bell, Globe, Shield, Palette, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  subTab: SettingsSubTab;
  setSubTab: (tab: SettingsSubTab) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ subTab, setSubTab }) => {
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#08080a] rounded-2xl border border-white/10 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSubTab('general')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'general' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          General
        </button>

        <button
          onClick={() => setSubTab('notifications')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'notifications' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bell className="w-4 h-4 text-emerald-400" />
          Notifications
        </button>

        <button
          onClick={() => setSubTab('integrations')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'integrations' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          Integrations (IGFMAS & OpenDOSM)
        </button>

        <button
          onClick={() => setSubTab('security')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'security' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          Security
        </button>

        <button
          onClick={() => setSubTab('theme')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'theme' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Palette className="w-4 h-4 text-emerald-400" />
          Theme
        </button>
      </div>

      <div className="bg-[#121215]/80 rounded-2xl p-6 border border-white/10 shadow-lg space-y-4 text-xs">
        <h3 className="font-bold text-white text-base">System Configuration & API Connections</h3>

        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-white block text-sm">IGFMAS Ministry Ledger API</span>
            <span className="text-emerald-400 font-semibold block">Status: Connected & Synchronized (0.0.0.0:3000)</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-white block text-sm">OpenDOSM Agriculture API Pipeline</span>
            <span className="text-emerald-400 font-semibold block">Status: Automated Daily Crawl Active</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-white block text-sm">Gemini 3.6 Flash Server AI Engine</span>
            <span className="text-emerald-400 font-semibold block">Status: Active (User Agent: aistudio-build)</span>
          </div>
        </div>

        {savedMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-sm shadow-emerald-500/20"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};
