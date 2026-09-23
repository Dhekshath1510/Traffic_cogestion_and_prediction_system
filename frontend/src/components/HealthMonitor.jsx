import React from 'react';
import { Database, HardDrive, Cpu, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function HealthMonitor({ backendStatus, onRefresh }) {
  if (!backendStatus) return null;

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-traffic-cyan border border-slate-700">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            Infrastructure & Model Runtime Health
            <span className="font-mono text-[10px] text-slate-400 font-normal">v{backendStatus.version || '1.0.0'}</span>
          </h4>
          <p className="text-[11px] text-slate-400">FastAPI backend service status check</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs">
        {/* Postgres */}
        <div className="flex items-center gap-1.5 bg-dark-800/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <Database className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-400">PostgreSQL:</span>
          {backendStatus.postgres === 'healthy' ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Connected
            </span>
          ) : (
            <span className="text-amber-400 font-semibold">Standby</span>
          )}
        </div>

        {/* Redis */}
        <div className="flex items-center gap-1.5 bg-dark-800/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <HardDrive className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-400">Redis:</span>
          {backendStatus.redis === 'healthy' ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Connected
            </span>
          ) : (
            <span className="text-amber-400 font-semibold">Standby</span>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Refresh Backend Health Status"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
