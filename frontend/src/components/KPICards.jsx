import React from 'react';
import { Gauge, AlertTriangle, ShieldCheck, AlertOctagon, TrendingDown, Clock } from 'lucide-react';

export default function KPICards({ predictionData, forecastHorizon = '5 min' }) {
  if (!predictionData || !predictionData.sensors) return null;

  const sensors = predictionData.sensors;
  const totalCount = sensors.length;

  const lowCount = sensors.filter(s => s.congestion_class === 'LOW').length;
  const modCount = sensors.filter(s => s.congestion_class === 'MODERATE').length;
  const severeCount = sensors.filter(s => s.congestion_class === 'SEVERE').length;

  const avgSpeed = (sensors.reduce((acc, s) => acc + s.predicted_speed, 0) / totalCount).toFixed(1);
  const avgCongestionIndex = (sensors.reduce((acc, s) => acc + s.congestion_index, 0) / totalCount).toFixed(2);

  const lowPercent = Math.round((lowCount / totalCount) * 100);
  const modPercent = Math.round((modCount / totalCount) * 100);
  const severePercent = Math.round((severeCount / totalCount) * 100);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Sensors & Avg Speed */}
      <div className="glass-card rounded-2xl p-4 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Network Speed</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{avgSpeed}</span>
              <span className="text-sm font-medium text-slate-400">mph</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5 text-traffic-cyan" />
              <span>Across {totalCount} METR-LA Sensors</span>
            </p>
          </div>
          <div className="rounded-2xl bg-cyan-500/10 p-3 text-traffic-cyan border border-cyan-500/20 group-hover:scale-110 transition-transform">
            <Gauge className="h-6 w-6" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-traffic-cyan to-indigo-500 opacity-80" />
      </div>

      {/* Network Congestion Index */}
      <div className="glass-card rounded-2xl p-4 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Network Congestion Index</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{avgCongestionIndex}</span>
              <span className="text-xs font-medium text-slate-400">/ 1.00</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Forecast Horizon: {predictionData.forecast_horizon || forecastHorizon}</span>
            </p>
          </div>
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <TrendingDown className="h-6 w-6" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80" />
      </div>

      {/* Congestion Status Ratio */}
      <div className="glass-card rounded-2xl p-4 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Traffic Status Split</p>
            <div className="mt-2 flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-400">{lowPercent}% Low</span>
              <span className="text-amber-400">{modPercent}% Mod</span>
              <span className="text-rose-400">{severePercent}% Severe</span>
            </div>
            {/* Multi-segmented Progress Bar */}
            <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div style={{ width: `${lowPercent}%` }} className="bg-traffic-low transition-all duration-500" />
              <div style={{ width: `${modPercent}%` }} className="bg-traffic-moderate transition-all duration-500" />
              <div style={{ width: `${severePercent}%` }} className="bg-traffic-severe transition-all duration-500" />
            </div>
            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{lowCount} Clear Corridor Sensors</span>
            </p>
          </div>
        </div>
      </div>

      {/* Critical Bottlenecks */}
      <div className={`glass-card rounded-2xl p-4 relative overflow-hidden group border-l-4 ${
        severeCount > 15 ? 'border-l-traffic-severe glow-severe' : 'border-l-amber-500'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical Bottlenecks</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold tracking-tight ${severeCount > 0 ? 'text-traffic-severe' : 'text-emerald-400'}`}>
                {severeCount}
              </span>
              <span className="text-xs font-medium text-slate-400">sensors severe</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>{modCount} Sensors experiencing moderate delay</span>
            </p>
          </div>
          <div className={`rounded-2xl p-3 border group-hover:scale-110 transition-transform ${
            severeCount > 0 
              ? 'bg-rose-500/10 text-traffic-severe border-rose-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <AlertOctagon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
