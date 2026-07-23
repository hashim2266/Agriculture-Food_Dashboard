import React from 'react';
import { AdminSubTab, ActivityLog } from '../../types';
import { Users, UserCheck, ShieldCheck, Lock, Activity, CheckCircle2 } from 'lucide-react';

interface AdministrationViewProps {
  subTab: AdminSubTab;
  setSubTab: (tab: AdminSubTab) => void;
  auditLogs: ActivityLog[];
}

export const AdministrationView: React.FC<AdministrationViewProps> = ({
  subTab,
  setSubTab,
  auditLogs,
}) => {
  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#08080a] rounded-2xl border border-white/10 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSubTab('users')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'users' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          Users
        </button>

        <button
          onClick={() => setSubTab('roles')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'roles' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          Roles
        </button>

        <button
          onClick={() => setSubTab('permissions')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'permissions' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Lock className="w-4 h-4 text-emerald-400" />
          Permissions
        </button>

        <button
          onClick={() => setSubTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'audit' ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          Audit Trail
        </button>
      </div>

      {/* Audit Trail Table */}
      <div className="bg-[#121215]/80 rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
        <h3 className="font-bold text-white text-base">Government Audit Trail & Compliance Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 font-bold uppercase text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">User & Officer Title</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Executed Action</th>
                <th className="py-2.5 px-3">System Module</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">{log.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{log.user}</td>
                  <td className="py-2.5 px-3 font-medium text-emerald-400">{log.role}</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.action}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{log.systemModule}</td>
                  <td className="py-2.5 px-3 text-slate-500">{log.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-[10px]">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
