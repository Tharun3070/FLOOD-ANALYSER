import React from 'react';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  CloudRain,
  Waves,
  Mountain,
  Sprout,
  Building2,
  History,
  Zap,
  CheckCircle,
  Thermometer,
} from 'lucide-react';
import { HydrologicalMetrics, FloodScenario, ModelPrediction, MLModelType } from '../types';
import { PRESET_SCENARIOS, INITIAL_METRICS } from '../data/mockHydrologyData';
import { getRiskLevelColor } from '../utils/mlEngine';

interface ScenarioSimulatorProps {
  metrics: HydrologicalMetrics;
  onChangeMetrics: (newMetrics: HydrologicalMetrics) => void;
  onSelectScenario: (scenario: FloodScenario) => void;
  predictions: Record<MLModelType, ModelPrediction>;
  onReset: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  metrics,
  onChangeMetrics,
  onSelectScenario,
  predictions,
  onReset,
}) => {
  const updateField = (field: keyof HydrologicalMetrics, value: number) => {
    onChangeMetrics({
      ...metrics,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <Sliders className="w-5 h-5 text-blue-400" />
            Multi-Factor Hydrological Sandbox & Scenario Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Tweak any of the 7 environmental parameters to test real-time machine learning sensitivity and threshold triggers.
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer shadow-lg"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Baseline
        </button>
      </div>

      {/* Preset Disaster Scenarios Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRESET_SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => onSelectScenario(sc)}
            className="p-5 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-md text-left hover:border-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 font-mono">
                  {sc.badge}
                </span>
              </div>
              <div className="font-black text-sm text-white group-hover:text-blue-400 transition line-clamp-1 mb-1">
                {sc.title}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {sc.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Real-time ML Output Response Strip */}
      <div className="bg-slate-900/80 backdrop-blur-md text-white rounded-3xl p-6 border border-slate-800 shadow-2xl">
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2 text-white">
            <Zap className="w-4 h-4 text-amber-400" />
            Live Ensemble ML Model Probability Readouts
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">● Zero-Latency Compute Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['XGBOOST', 'LSTM', 'RANDOM_FOREST', 'LOGISTIC_REGRESSION'] as MLModelType[]).map((type) => {
            const pred = predictions[type];
            const colors = getRiskLevelColor(pred.predictedRiskLevel);

            return (
              <div
                key={type}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-slate-200 font-mono">
                    {type.replace('_', ' ')}
                  </span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${colors.badge}`}>
                    {pred.predictedRiskLevel}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-3xl font-black font-mono text-white">
                    {pred.floodProbability}%
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">prob</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Peak: <strong className="text-blue-400">{pred.predictedPeakStage}m</strong> in ~{pred.timeToPeakHours}h
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7 Parameter Sliders Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Factor 1: Rainfall Intensity & Accumulation */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-wider">
            <CloudRain className="w-4 h-4" />
            1. Rainfall Dynamics
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Rainfall Intensity</span>
              <span className="font-black text-blue-400">{metrics.rainfallIntensity} mm/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={metrics.rainfallIntensity}
              onChange={(e) => updateField('rainfallIntensity', parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">24h Accumulated</span>
              <span className="font-black text-blue-400">{metrics.accumulatedRainfall24h} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="1"
              value={metrics.accumulatedRainfall24h}
              onChange={(e) => updateField('accumulatedRainfall24h', parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Factor 2: River Stage & Discharge */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-wider">
            <Waves className="w-4 h-4" />
            2. River Stage & Flow
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">River Stage / Water Level</span>
              <span className="font-black text-indigo-400">{metrics.riverStage} meters</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.1"
              value={metrics.riverStage}
              onChange={(e) => updateField('riverStage', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-400 flex justify-between font-mono">
              <span>Normal: 3.2m</span>
              <span className="text-red-400 font-bold">Flood Stage: {metrics.riverFloodStage}m</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">River Discharge</span>
              <span className="font-black text-indigo-400">{metrics.riverDischarge} m³/s</span>
            </div>
            <input
              type="range"
              min="100"
              max="3500"
              step="50"
              value={metrics.riverDischarge}
              onChange={(e) => updateField('riverDischarge', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Factor 3: Weather & Atmosphere */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
            <Thermometer className="w-4 h-4" />
            3. Weather & Atmosphere
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Atmospheric Pressure</span>
              <span className="font-black text-amber-400">{metrics.pressure} hPa</span>
            </div>
            <input
              type="range"
              min="960"
              max="1030"
              step="1"
              value={metrics.pressure}
              onChange={(e) => updateField('pressure', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Storm Velocity</span>
              <span className="font-black text-amber-400">{metrics.stormVelocity} km/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={metrics.stormVelocity}
              onChange={(e) => updateField('stormVelocity', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Factor 4: Terrain Elevation & Slope */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-wider">
            <Mountain className="w-4 h-4" />
            4. Terrain & Topography
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Ground Elevation</span>
              <span className="font-black text-indigo-400">{metrics.elevation} meters</span>
            </div>
            <input
              type="range"
              min="2"
              max="150"
              step="1"
              value={metrics.elevation}
              onChange={(e) => updateField('elevation', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Catchment Area</span>
              <span className="font-black text-indigo-400">{metrics.catchmentAreaSqKm} km²</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="10"
              value={metrics.catchmentAreaSqKm}
              onChange={(e) => updateField('catchmentAreaSqKm', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Factor 5: Soil Saturation & Infiltration */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-teal-400 uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            5. Soil Saturation
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Moisture Saturation</span>
              <span className="font-black text-teal-400">{metrics.soilSaturation}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={metrics.soilSaturation}
              onChange={(e) => updateField('soilSaturation', parseFloat(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Infiltration Capacity</span>
              <span className="font-black text-teal-400">{metrics.infiltrationCapacity} mm/h</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={metrics.infiltrationCapacity}
              onChange={(e) => updateField('infiltrationCapacity', parseFloat(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Factor 6: Urban Drainage & 7: Historical Return Period */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-purple-400 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            6. Drainage & 7. Historical
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Urban Drainage Blockage</span>
              <span className="font-black text-purple-400">{metrics.drainageBlockage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={metrics.drainageBlockage}
              onChange={(e) => updateField('drainageBlockage', parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Historical Return Period</span>
              <span className="font-black text-teal-400">1-in-{metrics.historicalReturnPeriod} Yr</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={metrics.historicalReturnPeriod}
              onChange={(e) => updateField('historicalReturnPeriod', parseFloat(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
