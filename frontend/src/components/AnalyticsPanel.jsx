import React from 'react';
import { BarChart2, PieChart, AlertTriangle, Gauge, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';
import { SENSOR_METADATA } from '../data/mockData';

export default function AnalyticsPanel({ predictionData, onSelectSensor }) {
  if (!predictionData || !predictionData.sensors) return null;

  const sensors = predictionData.sensors;

  // Congestion class counts
  const classCounts = [
    { name: 'LOW', count: sensors.filter((s) => s.congestion_class === 'LOW').length, color: '#10B981' },
    { name: 'MODERATE', count: sensors.filter((s) => s.congestion_class === 'MODERATE').length, color: '#F59E0B' },
    { name: 'SEVERE', count: sensors.filter((s) => s.congestion_class === 'SEVERE').length, color: '#EF4444' },
  ];

  // Top Bottleneck Sensors sorted by highest Congestion Index
  const topBottlenecks = [...sensors]
    .sort((a, b) => b.congestion_index - a.congestion_index)
    .slice(0, 5)
    .map((s) => {
      const meta = SENSOR_METADATA[s.sensor_index] || { location: `Sensor #${s.sensor_index}` };
      return { ...s, location: meta.location };
    });

  // Speed histogram buckets (0-20, 20-40, 40-60, 60-80 mph)
  const speedBuckets = [
    { range: '< 25 mph', count: sensors.filter((s) => s.predicted_speed < 25).length, fill: '#EF4444' },
    { range: '25-45 mph', count: sensors.filter((s) => s.predicted_speed >= 25 && s.predicted_speed < 45).length, fill: '#F59E0B' },
    { range: '45-60 mph', count: sensors.filter((s) => s.predicted_speed >= 45 && s.predicted_speed < 60).length, fill: '#06B6D4' },
    { range: '> 60 mph', count: sensors.filter((s) => s.predicted_speed >= 60).length, fill: '#10B981' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart 1: Class Distribution Breakdown */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <PieChart className="h-4 w-4 text-traffic-cyan" />
            Congestion Class Split
          </h3>
          <p className="text-xs text-slate-400">Total count of sensors per status level</p>
        </div>

        <div className="h-44 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {classCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-around text-xs border-t border-slate-800/80 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-traffic-low" />
            <span className="text-slate-300">Clear: {classCounts[0].count}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-traffic-moderate" />
            <span className="text-slate-300">Moderate: {classCounts[1].count}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-traffic-severe" />
            <span className="text-slate-300">Severe: {classCounts[2].count}</span>
          </div>
        </div>
      </div>

      {/* Chart 2: Speed Distribution */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <Gauge className="h-4 w-4 text-indigo-400" />
            Speed Profile Histogram
          </h3>
          <p className="text-xs text-slate-400">Distribution of predicted speeds (mph)</p>
        </div>

        <div className="h-44 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={speedBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {speedBuckets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[11px] text-slate-400 text-center border-t border-slate-800/80 pt-2">
          Highest frequency: <strong className="text-white">45-60 mph corridor flow</strong>
        </p>
      </div>

      {/* List: Top Bottlenecks */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <ShieldAlert className="h-4 w-4 text-traffic-severe" />
            Top Bottleneck Locations
          </h3>
          <p className="text-xs text-slate-400">Highest Congestion Index (CI) rankings</p>
        </div>

        <div className="my-2 space-y-2 max-h-48 overflow-y-auto">
          {topBottlenecks.map((b, idx) => (
            <div
              key={b.sensor_index}
              onClick={() => onSelectSensor(b)}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-traffic-severe bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900">
                  #{b.sensor_index}
                </span>
                <div className="truncate max-w-[140px]">
                  <p className="text-xs font-semibold text-white truncate">{b.location}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-rose-400">{b.predicted_speed.toFixed(1)} mph</div>
                <div className="text-[10px] text-slate-400">CI: {b.congestion_index.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-400 text-center border-t border-slate-800/80 pt-2">
          Click any bottleneck to view SHAP explanation
        </p>
      </div>
    </div>
  );
}
