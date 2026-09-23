import React from 'react';
import { Activity, Server, Zap, RefreshCw, Cpu, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function Navbar({
  isDemoMode,
  setIsDemoMode,
  backendStatus,
  onRunPrediction,
  isLoading,
  selectedScenario,
  setSelectedScenario
}) {
  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-7xl">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-traffic-cyan to-indigo-600 shadow-lg shadow-cyan-500/20">
            <Activity className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                TrafficPulse <span className="text-traffic-cyan">AI</span>
              </h1>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400 border border-slate-700">
                METR-LA v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              GRU Speed Forecasting & XGBoost + SHAP Explainable Congestion Dashboard
            </p>
          </div>
        </div>

        {/* Action Controls & Health */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Preset Scenario Selector */}
          <div className="flex items-center gap-2 bg-dark-800/80 rounded-lg p-1 border border-slate-800">
            <span className="text-xs text-slate-400 pl-2 hidden sm:inline">Scenario:</span>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-2 font-medium"
            >
              <option value="rush_hour" className="bg-dark-900 text-slate-200">Morning Rush Hour</option>
              <option value="bottleneck" className="bg-dark-900 text-slate-200">Freeway Incident Bottleneck</option>
              <option value="free_flow" className="bg-dark-900 text-slate-200">Late Night Free Flow</option>
            </select>
          </div>

          {/* Mode Switch (Live API vs Demo Mode) */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              isDemoMode
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
            }`}
            title="Toggle between real FastAPI backend API call and standalone offline interactive sandbox data"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>{isDemoMode ? 'Sandbox Mode' : 'Live API Mode'}</span>
          </button>

          {/* Backend Status Indicator */}
          <div
            className="flex items-center gap-1.5 rounded-lg bg-dark-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 border border-slate-800"
            title={backendStatus?.message || 'Backend connection status'}
          >
            <Server className="h-3.5 w-3.5 text-slate-400" />
            {backendStatus?.isReady ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Live Ready
              </span>
            ) : backendStatus?.isLive ? (
              <span className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="h-3 w-3 text-amber-400" />
                Degraded
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400">
                <XCircle className="h-3 w-3 text-rose-400" />
                Offline
              </span>
            )}
          </div>

          {/* Run AI Prediction Button */}
          <button
            onClick={onRunPrediction}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-traffic-cyan to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:opacity-90 hover:shadow-cyan-500/40 active:scale-95 disabled:opacity-50"
          >
            <Zap className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Running Inference...' : 'Predict Horizon'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
