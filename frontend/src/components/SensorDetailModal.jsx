import React from 'react';
import { X, Gauge, AlertCircle, Cpu, Info, BarChart2, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SensorDetailModal({ sensor, onClose }) {
  if (!sensor) return null;

  const refSpeed = sensor.referenceSpeed || 65.0;
  const speedDiff = (sensor.predicted_speed - refSpeed).toFixed(1);

  // Format SHAP data for chart
  const shapData = (sensor.explanation?.top_features || []).map((f) => ({
    feature: f.feature,
    contribution: parseFloat(f.contribution.toFixed(4)),
    isPositive: f.contribution >= 0,
  }));

  const getStatusBadge = (cls) => {
    switch (cls) {
      case 'LOW':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'SEVERE':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md animate-fade-in">
      <div
        className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700/80 p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-traffic-cyan bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-lg">
                Sensor #{sensor.sensor_index}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(sensor.congestion_class)}`}>
                {sensor.congestion_class} CONGESTION
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{sensor.location || `Segment #${sensor.sensor_index}`}</h3>
            <p className="text-xs text-slate-400 mt-0.5">METR-LA Freeway Network Node Insights</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Speed & CI Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          {/* Predicted Speed */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Predicted Speed</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{sensor.predicted_speed.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-medium">mph</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
              {parseFloat(speedDiff) >= 0 ? (
                <span className="text-emerald-400 flex items-center">
                  <ArrowUpRight className="h-3 w-3" /> +{speedDiff} mph
                </span>
              ) : (
                <span className="text-rose-400 flex items-center">
                  <ArrowDownRight className="h-3 w-3" /> {speedDiff} mph
                </span>
              )}
              vs Ref ({refSpeed} mph)
            </div>
          </div>

          {/* Congestion Index */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Congestion Index (CI)</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{sensor.congestion_index.toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-medium">/ 1.00</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.max(0, sensor.congestion_index * 100))}%` }}
                className={`h-full ${
                  sensor.congestion_class === 'LOW'
                    ? 'bg-traffic-low'
                    : sensor.congestion_class === 'MODERATE'
                    ? 'bg-traffic-moderate'
                    : 'bg-traffic-severe'
                }`}
              />
            </div>
          </div>

          {/* Top Class Probability */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classifier Confidence</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">
                {Math.round((sensor.probabilities?.[sensor.congestion_class] || 0.85) * 100)}%
              </span>
              <span className="text-xs text-slate-400">probability</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px]">
              <span className="text-emerald-400">L: {Math.round((sensor.probabilities?.LOW || 0) * 100)}%</span>
              <span className="text-amber-400">M: {Math.round((sensor.probabilities?.MODERATE || 0) * 100)}%</span>
              <span className="text-rose-400">S: {Math.round((sensor.probabilities?.SEVERE || 0) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Explainable AI (SHAP Feature Contribution) */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-traffic-cyan" />
              <h4 className="text-sm font-bold text-white">SHAP Feature Explanations (XGBoost)</h4>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              Top 5 Impact Drivers
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            SHAP (SHapley Additive exPlanations) shows how each engineered feature pushed the model towards predicting{' '}
            <strong className="text-slate-200">{sensor.congestion_class}</strong> congestion for this sensor node.
          </p>

          {shapData.length > 0 ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapData} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis type="category" dataKey="feature" stroke="#94a3b8" fontSize={11} tickLine={false} width={120} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val) => [val, 'SHAP Value']}
                  />
                  <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                    {shapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isPositive ? '#10B981' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500">No SHAP breakdown available for this sensor</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2 text-xs font-semibold text-white transition-colors"
          >
            Close Insight Panel
          </button>
        </div>
      </div>
    </div>
  );
}
