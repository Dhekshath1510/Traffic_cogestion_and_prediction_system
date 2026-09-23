import React, { useState, useMemo } from 'react';
import { Search, Filter, LayoutGrid, List, AlertCircle, MapPin, Gauge } from 'lucide-react';
import { SENSOR_METADATA } from '../data/mockData';

export default function SensorGridMap({ predictionData, onSelectSensor, selectedSensorId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, LOW, MODERATE, SEVERE
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const sensors = useMemo(() => {
    if (!predictionData || !predictionData.sensors) return [];
    return predictionData.sensors.map((s) => {
      const meta = SENSOR_METADATA[s.sensor_index] || {
        name: `Sensor #${s.sensor_index}`,
        location: `Freeway Segment #${s.sensor_index}`,
        referenceSpeed: 65.0,
      };
      return {
        ...s,
        ...meta,
      };
    });
  }, [predictionData]);

  const filteredSensors = useMemo(() => {
    return sensors.filter((s) => {
      const matchesStatus = statusFilter === 'ALL' || s.congestion_class === statusFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query) ||
        s.sensor_index.toString().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [sensors, statusFilter, searchQuery]);

  const getStatusBadge = (cls) => {
    switch (cls) {
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MODERATE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'SEVERE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getTileBg = (cls, isSelected) => {
    if (isSelected) {
      return 'ring-2 ring-traffic-cyan bg-cyan-950/40 border-traffic-cyan';
    }
    switch (cls) {
      case 'LOW':
        return 'hover:border-emerald-500/50 bg-slate-900/60 border-slate-800/80';
      case 'MODERATE':
        return 'hover:border-amber-500/50 bg-amber-950/20 border-amber-900/40';
      case 'SEVERE':
        return 'hover:border-rose-500/50 bg-rose-950/25 border-rose-900/50';
      default:
        return 'bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col gap-4">
      {/* Header Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-traffic-cyan" />
            Sensor Network Monitor ({filteredSensors.length} / {sensors.length})
          </h2>
          <p className="text-xs text-slate-400">
            Real-time highway sensor matrix across METR-LA freeway corridors
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search sensor ID or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full rounded-xl py-1.5 pl-9 pr-3 text-xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-dark-800/80 p-1 rounded-xl border border-slate-800">
            {['ALL', 'LOW', 'MODERATE', 'SEVERE'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  statusFilter === filter
                    ? 'bg-traffic-cyan text-dark-900 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-dark-800/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Container */}
      {filteredSensors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm font-medium">No sensors match your filter query</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
          {filteredSensors.map((sensor) => {
            const isSelected = selectedSensorId === sensor.sensor_index;
            return (
              <button
                key={sensor.sensor_index}
                onClick={() => onSelectSensor(sensor)}
                className={`flex flex-col justify-between p-2.5 rounded-xl border text-left transition-all ${getTileBg(
                  sensor.congestion_class,
                  isSelected
                )} hover:scale-[1.03] active:scale-95`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    #{sensor.sensor_index}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      sensor.congestion_class === 'LOW'
                        ? 'bg-traffic-low'
                        : sensor.congestion_class === 'MODERATE'
                        ? 'bg-traffic-moderate'
                        : 'bg-traffic-severe animate-pulse'
                    }`}
                  />
                </div>

                <div className="my-1.5">
                  <div className="text-base font-extrabold text-white tracking-tight leading-none">
                    {sensor.predicted_speed.toFixed(1)}
                    <span className="text-[10px] font-normal text-slate-400 ml-0.5">mph</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5" title={sensor.location}>
                    {sensor.location}
                  </div>
                </div>

                {/* CI Bar */}
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.round(sensor.congestion_index * 100)}%` }}
                    className={`h-full ${
                      sensor.congestion_class === 'LOW'
                        ? 'bg-traffic-low'
                        : sensor.congestion_class === 'MODERATE'
                        ? 'bg-traffic-moderate'
                        : 'bg-traffic-severe'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Detailed List View */
        <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-800/60 border border-slate-800 rounded-xl bg-slate-950/40">
          {filteredSensors.map((sensor) => {
            const isSelected = selectedSensorId === sensor.sensor_index;
            return (
              <div
                key={sensor.sensor_index}
                onClick={() => onSelectSensor(sensor)}
                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-cyan-950/30' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs text-traffic-cyan font-bold bg-dark-800 px-2 py-1 rounded-lg border border-slate-800">
                    #{sensor.sensor_index}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{sensor.location}</h4>
                    <span className="text-[10px] text-slate-400">
                      Ref Speed: {sensor.referenceSpeed} mph
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      {sensor.predicted_speed.toFixed(1)} <span className="text-xs font-normal text-slate-400">mph</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      CI: {(sensor.congestion_index).toFixed(2)}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(sensor.congestion_class)}`}>
                    {sensor.congestion_class}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
