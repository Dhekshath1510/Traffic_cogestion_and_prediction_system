import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import SensorGridMap from './components/SensorGridMap';
import SensorDetailModal from './components/SensorDetailModal';
import PredictorControls from './components/PredictorControls';
import AnalyticsPanel from './components/AnalyticsPanel';
import HealthMonitor from './components/HealthMonitor';
import { checkBackendHealth, fetchPredictions } from './services/api';
import { generateMockSequence } from './data/mockData';

export default function App() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('rush_hour');
  const [currentTimestep, setCurrentTimestep] = useState(11);
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 16));
  
  const [predictionData, setPredictionData] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState('demo');

  // Check Backend Health
  const updateHealth = useCallback(async () => {
    const status = await checkBackendHealth();
    setBackendStatus(status);
    // If backend is unreachable on start, auto-enable sandbox demo mode
    if (!status.isLive && !isDemoMode) {
      setIsDemoMode(true);
    }
  }, [isDemoMode]);

  useEffect(() => {
    updateHealth();
  }, [updateHealth]);

  // Run Traffic AI Inference
  const handleRunPrediction = useCallback(async () => {
    setIsLoading(true);
    try {
      const sequence = generateMockSequence(selectedScenario);
      const res = await fetchPredictions(sequence, timestamp, isDemoMode, selectedScenario);
      setPredictionData(res.data);
      setDataSource(res.source);
    } catch (err) {
      console.error('Failed to run traffic prediction:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedScenario, timestamp, isDemoMode]);

  // Trigger initial prediction on mount or scenario change
  useEffect(() => {
    handleRunPrediction();
  }, [handleRunPrediction]);

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-slate-100 font-sans">
      {/* Top Navigation */}
      <Navbar
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        backendStatus={backendStatus}
        onRunPrediction={handleRunPrediction}
        isLoading={isLoading}
        selectedScenario={selectedScenario}
        setSelectedScenario={setSelectedScenario}
      />

      {/* Notice Banner if running offline demo mode */}
      {isDemoMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 text-center text-xs font-semibold text-amber-400">
          ⚡ Operating in Standalone Sandbox Mode using METR-LA Traffic Datasets (FastAPI server offline or unreached). Toggle "Live API Mode" in top bar when running backend.
        </div>
      )}

      {/* Main Body Layout */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 flex flex-col gap-6">
        {/* KPI Dashboard Cards */}
        <KPICards predictionData={predictionData} />

        {/* Predictor Scenario & Scrubber Controls */}
        <PredictorControls
          selectedScenario={selectedScenario}
          setSelectedScenario={setSelectedScenario}
          currentTimestep={currentTimestep}
          setCurrentTimestep={setCurrentTimestep}
          onRunPrediction={handleRunPrediction}
          isLoading={isLoading}
          timestamp={timestamp}
          setTimestamp={setTimestamp}
        />

        {/* 207 Sensor Network Spatial Grid & Matrix */}
        <SensorGridMap
          predictionData={predictionData}
          onSelectSensor={(sensor) => setSelectedSensor(sensor)}
          selectedSensorId={selectedSensor?.sensor_index}
        />

        {/* Network Analytics Breakdown */}
        <AnalyticsPanel
          predictionData={predictionData}
          onSelectSensor={(sensor) => setSelectedSensor(sensor)}
        />

        {/* System & API Infrastructure Monitor */}
        <HealthMonitor backendStatus={backendStatus} onRefresh={updateHealth} />
      </main>

      {/* Detailed Sensor Modal / Explainable AI Side Drawer */}
      <SensorDetailModal
        sensor={selectedSensor}
        onClose={() => setSelectedSensor(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        Traffic Congestion Prediction System • Powered by GRU Neural Networks, XGBoost, and SHAP Explainable AI
      </footer>
    </div>
  );
}
