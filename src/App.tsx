import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { OverviewMetrics } from './components/OverviewMetrics';
import { MLModelComparison } from './components/MLModelComparison';
import { InteractiveFloodMap } from './components/InteractiveFloodMap';
import { EarlyWarningResponse } from './components/EarlyWarningResponse';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { AIEmergencyCopilot } from './components/AIEmergencyCopilot';
import {
  HydrologicalMetrics,
  MLModelType,
  FloodScenario,
  RiverStation,
  EvacuationShelter,
  EvacuationRoute,
} from './types';
import {
  INITIAL_METRICS,
  PRESET_SCENARIOS,
  RIVER_STATIONS,
  EVACUATION_SHELTERS,
  EVACUATION_ROUTES,
  RIVER_BASINS,
} from './data/mockHydrologyData';
import { runAllMLModels, calculateRiskLevel } from './utils/mlEngine';
import { playEmergencySiren, stopEmergencySiren } from './utils/audioAlert';

export default function App() {
  const [metrics, setMetrics] = useState<HydrologicalMetrics>(INITIAL_METRICS);
  const [activeScenario, setActiveScenario] = useState<FloodScenario | null>(PRESET_SCENARIOS[0]);
  const [selectedModel, setSelectedModel] = useState<MLModelType>('XGBOOST');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);
  const [isLiveTicking, setIsLiveTicking] = useState<boolean>(true);
  const [liveTime, setLiveTime] = useState<string>(new Date().toLocaleTimeString());

  // Run all 4 ML models
  const predictions = useMemo(() => {
    return runAllMLModels(metrics);
  }, [metrics]);

  const activePred = predictions[selectedModel] || predictions.XGBOOST;
  const currentRisk = activePred.predictedRiskLevel;
  const currentProbability = activePred.floodProbability;

  // Live simulation tick (slight variation in rain/stage)
  useEffect(() => {
    if (!isLiveTicking) return;

    const interval = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
      setMetrics((prev) => {
        // Organic sinusoidal sensor drift
        const rainJitter = Number(((Math.random() - 0.48) * 0.4).toFixed(1));
        const newRain = Math.max(0, Number((prev.rainfallIntensity + rainJitter).toFixed(1)));
        const stageDelta = newRain > 30 ? 0.02 : -0.01;
        const newStage = Math.max(1.5, Number((prev.riverStage + stageDelta).toFixed(2)));

        return {
          ...prev,
          rainfallIntensity: newRain,
          riverStage: newStage,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveTicking]);

  // Handle Scenario selection
  const handleSelectScenario = (scenario: FloodScenario) => {
    setActiveScenario(scenario);
    setMetrics({ ...scenario.metrics });
  };

  const handleResetSimulation = () => {
    setActiveScenario(null);
    setMetrics(INITIAL_METRICS);
  };

  const handleToggleSiren = () => {
    if (isSirenPlaying) {
      stopEmergencySiren();
      setIsSirenPlaying(false);
    } else {
      playEmergencySiren(8);
      setIsSirenPlaying(true);
      setTimeout(() => setIsSirenPlaying(false), 8000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Persistent Navigation & Status Bar */}
      <Header
        currentRisk={currentRisk}
        currentProbability={currentProbability}
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        onResetSimulation={handleResetSimulation}
        isSirenPlaying={isSirenPlaying}
        onToggleSiren={handleToggleSiren}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        liveTime={liveTime}
        isLiveTicking={isLiveTicking}
        onToggleLiveTicking={() => setIsLiveTicking((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'dashboard' && (
          <OverviewMetrics
            metrics={metrics}
            predictions={predictions}
            selectedModel={selectedModel}
            riverStations={RIVER_STATIONS}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'ml-models' && (
          <MLModelComparison
            predictions={predictions}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            metrics={metrics}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveFloodMap
            riverStations={RIVER_STATIONS}
            shelters={EVACUATION_SHELTERS}
            routes={EVACUATION_ROUTES}
            currentRisk={currentRisk}
            riverStage={metrics.riverStage}
            floodStage={metrics.riverFloodStage}
            rainfallIntensity={metrics.rainfallIntensity}
          />
        )}

        {activeTab === 'early-warning' && (
          <EarlyWarningResponse
            currentRisk={currentRisk}
            currentProbability={currentProbability}
            basinName={RIVER_BASINS[0].name}
            onNavigateToCopilot={() => setActiveTab('ai-copilot')}
            onNavigateToMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'simulator' && (
          <ScenarioSimulator
            metrics={metrics}
            onChangeMetrics={setMetrics}
            onSelectScenario={handleSelectScenario}
            predictions={predictions}
            onReset={handleResetSimulation}
          />
        )}

        {activeTab === 'ai-copilot' && (
          <AIEmergencyCopilot
            metrics={metrics}
            predictions={predictions}
            currentRisk={currentRisk}
            basinName={RIVER_BASINS[0].name}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            HydroSentinel AI • Hydrological Early Warning & Response System
          </div>
          <div>
            ML Models: Random Forest • XGBoost • LSTM • Logistic Regression • Gemini 3.7 Flash
          </div>
        </div>
      </footer>
    </div>
  );
}
