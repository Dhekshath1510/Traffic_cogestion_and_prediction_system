import React from 'react';
import { Play, RotateCcw, Clock, Sparkles, Layers, Cpu } from 'lucide-react';

export default function PredictorControls({
  selectedScenario,
  setSelectedScenario,
  currentTimestep,
  setCurrentTimestep,
  onRunPrediction,
  isLoading,
  timestamp,
  setTimestamp,
}) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-traffic-cyan" />
            AI Model Inference & Scenario Controls
          </h3>
          <p className="text-xs text-slate-400">
            Feed 12 historical 5-minute timesteps (1-hour window) into GRU + XGBoost Pipeline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTimestamp(new Date().toISOString().slice(0, 16));
              onRunPrediction();
            }}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Sequence
          </button>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Scenario Selection */}
        <div className="glass-card rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Traffic Pattern Preset
          </label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="glass-input rounded-lg px-2.5 py-1.5 text-xs font-semibold w-full"
          >
            <option value="rush_hour">Morning Rush Hour Peak (Corridor Bottlenecks)</option>
            <option value="bottleneck">Freeway Incident Gridlock (Major Delays)</option>
            <option value="free_flow">Late Night Off-Peak (Smooth Free-Flow)</option>
          </select>
        </div>

        {/* Timestep Scrubber */}
        <div className="glass-card rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Historical Window Step
            </label>
            <span className="text-xs font-bold text-traffic-cyan">
              Step {currentTimestep + 1} / 12 (T - {(11 - currentTimestep) * 5}m)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="11"
            value={currentTimestep}
            onChange={(e) => setCurrentTimestep(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-traffic-cyan"
          />
        </div>

        {/* Forecast Target Timestamp */}
        <div className="glass-card rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Target Forecast Timestamp
          </label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <input
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="glass-input rounded-lg px-2 py-1 text-xs font-mono w-full"
            />
          </div>
        </div>
      </div>

      {/* Model Tech Specs Note */}
      <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <Cpu className="h-4 w-4 text-indigo-400 flex-shrink-0" />
          <span>
            <strong className="text-white">Architecture:</strong> GRU Speed Predictor (12x207) → Relative CI Calculation → XGBoost Classifier (25 engineered features + SHAP)
          </span>
        </div>
        <span className="text-[11px] font-mono text-traffic-cyan bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900 flex-shrink-0">
          Horizon: +5 min
        </span>
      </div>
    </div>
  );
}
