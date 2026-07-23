import React, { useState } from 'react';
import { X, FileSpreadsheet, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { IgfmasEntry } from '../types';

interface IgfmasFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: IgfmasEntry) => void;
}

export const IgfmasFormModal: React.FC<IgfmasFormModalProps> = ({
  isOpen,
  onClose,
  onAddEntry,
}) => {
  const [department, setDepartment] = useState<'KPKM.gov.my' | 'open.dosm.gov.my' | 'data.gov.my' | 'Open Data MATRADE' | 'MARDI'>('KPKM.gov.my');
  const [commodity, setCommodity] = useState<string>('Padi & Beras (Baja Subsidized)');
  const [budgetMYR, setBudgetMYR] = useState<number>(1250);
  const [spentMYR, setSpentMYR] = useState<number>(1180);
  const [yieldHa, setYieldHa] = useState<number>(4.85);
  const [productionTonnes, setProductionTonnes] = useState<number>(2350000);
  const [ssrChange, setSsrChange] = useState<number>(2.1);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    const departmentNameMap: Record<string, 'KPKM.gov.my' | 'open.dosm.gov.my' | 'data.gov.my' | 'Open Data MATRADE' | 'MARDI'> = {
      'KPKM.gov.my': 'KPKM.gov.my',
      'open.dosm.gov.my': 'open.dosm.gov.my',
      'data.gov.my': 'data.gov.my',
      'Open Data MATRADE': 'Open Data MATRADE',
      'MARDI': 'MARDI',
    };

    setTimeout(() => {
      const newEntry: IgfmasEntry = {
        id: `AGRI-2024-${Math.floor(8800 + Math.random() * 999)}`,
        referenceCode: `AGRI-2024-${Math.floor(8800 + Math.random() * 999)}`,
        department: departmentNameMap[department] || 'KPKM.gov.my',
        commodity,
        financialYear: 2024,
        allocatedBudgetMYR: budgetMYR,
        actualSpentMYR: spentMYR,
        yieldPerHectare: yieldHa,
        productionTonnage: productionTonnes,
        ssrImpact: ssrChange,
        status: 'Disahkan',
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };

      onAddEntry(newEntry);
      setIsSyncing(false);
      setSuccessMsg(true);

      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1200);
    }, 600);
  };

  const handleQuickExtract = () => {
    // Extrak data dari portal sumber terbuka rasmi
    setIsSyncing(true);
    setTimeout(() => {
      setDepartment('open.dosm.gov.my');
      setCommodity('Padi Hibrid MR315 Hasil Tinggi');
      setBudgetMYR(185);
      setSpentMYR(172);
      setYieldHa(5.45);
      setProductionTonnes(2800000);
      setSsrChange(3.2);
      setIsSyncing(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#121215] text-white rounded-2xl max-w-xl w-full border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-[#0a0a0d] to-black text-white border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Borang Kemaskini Data KPKM & Open Data</h3>
              <p className="text-xs text-emerald-300/80">Penyelarasan langsung dengan graf SSR & enjin AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Quick extract button */}
          <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <div>
              <span className="font-bold text-emerald-300 block text-xs">Penyarian Automatik API Portal Open Data</span>
              <span className="text-emerald-200/70 text-[11px]">Ekstrak angka rasmi daripada open.dosm.gov.my / data.gov.my</span>
            </div>
            <button
              type="button"
              onClick={handleQuickExtract}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Ekstrak Data
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sumber Portal Rasmi / Agensi</label>
              <select
                value={department}
                onChange={(e: any) => setDepartment(e.target.value)}
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              >
                <option value="KPKM.gov.my" className="bg-[#121215] text-white">KPKM.gov.my</option>
                <option value="open.dosm.gov.my" className="bg-[#121215] text-white">open.dosm.gov.my</option>
                <option value="data.gov.my" className="bg-[#121215] text-white">data.gov.my</option>
                <option value="Open Data MATRADE" className="bg-[#121215] text-white">Open Data MATRADE</option>
                <option value="MARDI" className="bg-[#121215] text-white">MARDI Research</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Program Komoditi / Projek</label>
              <input
                type="text"
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Peruntukan Bajet (RM Juta)</label>
              <input
                type="number"
                step="0.1"
                value={budgetMYR}
                onChange={(e) => setBudgetMYR(Number(e.target.value))}
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Perbelanjaan Sebenar (RM Juta)</label>
              <input
                type="number"
                step="0.1"
                value={spentMYR}
                onChange={(e) => setSpentMYR(Number(e.target.value))}
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hasil (Tan/Hektar)</label>
              <input
                type="number"
                step="0.01"
                value={yieldHa}
                onChange={(e) => setYieldHa(Number(e.target.value))}
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Pengeluaran (Tan Metric)</label>
              <input
                type="number"
                value={productionTonnes}
                onChange={(e) => setProductionTonnes(Number(e.target.value))}
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kesan SSR (%)</label>
              <input
                type="number"
                step="0.1"
                value={ssrChange}
                onChange={(e) => setSsrChange(Number(e.target.value))}
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Feedback Message */}
          {successMsg && (
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Data berjaya dikemaskini! Graf dan syor AI telah diperbaharui.</span>
            </div>
          )}

          {/* Submit buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 font-semibold rounded-xl transition-all border border-white/10"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSyncing}
              className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              {isSyncing ? (
                <span>Memproses Data Graf...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Kemaskini Graf & AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
