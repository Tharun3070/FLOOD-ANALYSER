import React from 'react';
import {
  CloudRain,
  Waves,
  Thermometer,
  Mountain,
  Sprout,
  Building2,
  History,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  Gauge,
  Sparkles,
  Layers,
  Activity,
  PhoneCall,
  Radio,
} from 'lucide-react';
import { HydrologicalMetrics, ModelPrediction, RiskLevel, RiverStation } from '../types';
import { getRiskLevelColor } from '../utils/mlEngine';

interface OverviewMetricsProps {
  metrics: HydrologicalMetrics;
  predictions: Record<string, ModelPrediction>;
  selectedModel: string;
  riverStations: RiverStation[];
  onOpenStationModal?: (station: RiverStation) => void;
  onNavigateToTab: (tab: string) => void;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  metrics,
  predictions,
  selectedModel,
  riverStations,
  onNavigateToTab,
}) => {
  const activePred = predictions[selectedModel] || predictions['XGBOOST'] || Object.values(predictions)[0];
  const risk = activePred?.predictedRiskLevel || 'LOW';
  const riskColors = getRiskLevelColor(risk);

  const stageRatio = (metrics.riverStage / metrics.riverFloodStage) * 100;
  const isOverFloodStage = metrics.riverStage >= metrics.riverFloodStage;

  return (
    <div className="space-y-6">
      {/* 3-Column Vibrant Command Center Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (3 Spans): Live Environmental Streams & Diagnostics */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Live Environmental Data Block */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                <span>Live Environmental Data</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h2>

              <div className="space-y-3.5">
                {/* Rain */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-blue-500/30">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-slate-400 font-medium">Rainfall Intensity</span>
                    <span className="text-lg font-mono font-black text-blue-400">
                      {metrics.rainfallIntensity}
                      <span className="text-[10px] font-normal text-slate-500 ml-1">mm/h</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500 shadow-[0_0_10px_#3b82f6]"
                      style={{ width: `${Math.min(100, (metrics.rainfallIntensity / 80) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* River Discharge */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-indigo-500/30">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-slate-400 font-medium">River Discharge</span>
                    <span className="text-lg font-mono font-black text-indigo-400">
                      {metrics.riverDischarge.toLocaleString()}
                      <span className="text-[10px] font-normal text-slate-500 ml-1">m³/s</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_10px_#6366f1]"
                      style={{ width: `${Math.min(100, (metrics.riverDischarge / 3200) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Soil Saturation */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-teal-500/30">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-slate-400 font-medium">Soil Saturation</span>
                    <span className="text-lg font-mono font-black text-teal-400">
                      {metrics.soilSaturation}
                      <span className="text-[10px] font-normal text-slate-500 ml-1">%</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        metrics.soilSaturation > 80 ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-teal-500 shadow-[0_0_10px_#14b8a6]'
                      }`}
                      style={{ width: `${metrics.soilSaturation}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Diagnostic & ML Note Block */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl flex-grow">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              System Diagnostic
            </h2>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Model Confidence</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {Math.round(activePred?.confidenceScore * 100 || 94.8)}%
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Inference Latency</span>
                <span className="text-blue-400 font-mono font-bold">
                  {activePred?.inferenceTimeMs || 2.1}ms
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Telemetry Sources</span>
                <span className="text-slate-200 font-mono font-bold">142 Ground + 3 Sat</span>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-blue-600/10 border border-blue-500/30 rounded-2xl">
              <p className="text-xs text-blue-300 leading-relaxed font-medium">
                &ldquo;{selectedModel} model projects peak crest stage in ~{activePred?.timeToPeakHours}h based on catchment tributary influx.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Center Column (6 Spans): Central Visual Inundation Radar & Peak Stage Display */}
        <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl relative overflow-hidden flex flex-col justify-between p-6 shadow-2xl bg-dot-grid">
          {/* Top GIS Coordinates & View Switchers */}
          <div className="flex flex-wrap justify-between items-start gap-2 relative z-10">
            <div className="bg-slate-950/90 backdrop-blur border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[11px] font-mono text-blue-400 font-bold">
                CATCHMENT: 10.8505° N, 76.2711° E
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToTab('map')}
                className="bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition"
              >
                Open GIS Map ➔
              </button>
            </div>
          </div>

          {/* Central Radar Pulse Simulation */}
          <div className="my-8 relative flex items-center justify-center">
            <div className="w-64 h-64 sm:w-72 sm:h-72 border-2 border-dashed border-slate-800 rounded-full relative flex items-center justify-center">
              {/* Radial Glowing Pulse Rings */}
              <div className="absolute w-44 h-44 rounded-full border border-blue-500/20 animate-ping" />
              <div
                className={`absolute w-36 h-36 rounded-full blur-3xl ${
                  risk === 'CRITICAL'
                    ? 'bg-red-500/30'
                    : risk === 'HIGH'
                    ? 'bg-orange-500/30'
                    : 'bg-blue-500/20'
                }`}
              />

              <div className="text-center z-10 space-y-1">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Estimated Peak Stage
                </div>
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter">
                  {activePred?.predictedPeakStage}
                  <span className="text-xl font-medium text-slate-400 ml-1">m</span>
                </div>
                <div className="text-xs font-mono font-semibold text-slate-400">
                  Flood Stage: <strong className="text-red-400">{metrics.riverFloodStage}m</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Risk Zones & Status */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10 pt-2 border-t border-slate-800/80">
            <div className="flex flex-wrap gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold text-xs ${
                  isOverFloodStage
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOverFloodStage ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                />
                <span className="uppercase">
                  Zone A-1: {isOverFloodStage ? 'Inundation Imminent' : 'Normal Flow'}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 px-3 py-1.5 rounded-xl text-orange-400 font-bold text-xs">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="uppercase">Zone B-4: High Runoff Watch</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs font-mono text-slate-400">
                Current Water Level: <strong className="text-white text-sm">{metrics.riverStage}m</strong>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {metrics.riverStage >= metrics.riverFloodStage
                  ? `+${(metrics.riverStage - metrics.riverFloodStage).toFixed(1)}m ABOVE DANGER`
                  : `${(metrics.riverFloodStage - metrics.riverStage).toFixed(1)}m HEADROOM`}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (3 Spans): Predictive Alert Queue & Safe Zone CTA */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Predictive Alert Queue Card */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 flex flex-col flex-grow shadow-xl">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Predictive Alert Queue
            </h2>

            <div className="space-y-4">
              {/* Alert Item 1 */}
              <div className="flex gap-3.5 items-start pb-3.5 border-b border-slate-800">
                <div className="w-8 h-8 shrink-0 bg-red-600 rounded-xl flex items-center justify-center text-sm shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                  🚨
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white mb-0.5 uppercase tracking-wide">
                    Evacuation Trigger
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Zone A-1 threshold reached. Automated cell broadcast primed for 42,000 residents.
                  </p>
                  <span className="text-[10px] text-red-400 font-mono font-bold mt-1 inline-block">
                    IMMEDIATE
                  </span>
                </div>
              </div>

              {/* Alert Item 2 */}
              <div className="flex gap-3.5 items-start pb-3.5 border-b border-slate-800">
                <div className="w-8 h-8 shrink-0 bg-orange-500 rounded-xl flex items-center justify-center text-sm shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                  📢
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white mb-0.5 uppercase tracking-wide">
                    Authority Advisory
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Mobilize standby rescue teams to Periyar river basin. Tributary surge +0.3m/hr.
                  </p>
                  <span className="text-[10px] text-orange-400 font-mono font-bold mt-1 inline-block">
                    T-15 MIN
                  </span>
                </div>
              </div>

              {/* Alert Item 3 */}
              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 shrink-0 bg-yellow-500 text-slate-950 rounded-xl flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(234,179,8,0.35)]">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white mb-0.5 uppercase tracking-wide">
                    Infrastructure Watch
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Urban drainage system saturation at {metrics.drainageBlockage}%. Underpass watch.
                  </p>
                  <span className="text-[10px] text-yellow-400 font-mono font-bold mt-1 inline-block">
                    T-45 MIN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Safe Zones CTA Tile */}
          <div
            onClick={() => onNavigateToTab('map')}
            className="bg-blue-600 hover:bg-blue-500 rounded-3xl p-5 flex flex-col justify-center items-center text-center gap-2 group cursor-pointer transition shadow-[0_0_25px_rgba(37,99,235,0.4)] border border-blue-400/40"
          >
            <span className="text-xs font-black uppercase tracking-widest text-white">
              Secure Safe Zones & Shelters
            </span>
            <p className="text-[11px] text-blue-100 opacity-90 leading-tight">
              Locate 4 designated high-elevation evacuation shelters & clear corridors
            </p>
            <div className="mt-1 w-9 h-9 border-2 border-white rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition">
              ➔
            </div>
          </div>
        </div>
      </div>

      {/* 7 Key Hydrological Factors Grid */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-400" />
              7 Multi-Factor Environmental Telemetry Pillars
            </h3>
            <p className="text-xs text-slate-400">
              Continuously ingested by Random Forest, XGBoost, LSTM, and Logistic Regression models.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('simulator')}
            className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Adjust in Sandbox Simulator ➔
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Factor 1: Rainfall */}
          <div className="bg-slate-950 rounded-2xl border border-blue-500/30 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <CloudRain className="w-4 h-4 text-blue-400" />
                1. Rainfall Intensity
              </span>
              <span className="font-mono text-blue-400 font-bold text-[11px]">
                {metrics.rainfallIntensity > 50 ? 'Torrential' : metrics.rainfallIntensity > 20 ? 'Heavy' : 'Light'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-black text-white font-mono">
                {metrics.rainfallIntensity}
              </span>
              <span className="text-xs text-slate-400">mm / hour</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full shadow-[0_0_10px_#3b82f6]"
                style={{ width: `${Math.min(100, (metrics.rainfallIntensity / 80) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>24h: {metrics.accumulatedRainfall24h} mm</span>
              <span>48h: {metrics.accumulatedRainfall48h} mm</span>
            </div>
          </div>

          {/* Factor 2: River Stage */}
          <div className="bg-slate-950 rounded-2xl border border-indigo-500/30 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Waves className="w-4 h-4 text-indigo-400" />
                2. River Water Stage
              </span>
              <span
                className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                  isOverFloodStage
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {isOverFloodStage ? 'ABOVE FLOOD' : 'SAFE GAUGE'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-black text-white font-mono">
                {metrics.riverStage}
              </span>
              <span className="text-xs text-slate-400">meters (Flood: {metrics.riverFloodStage}m)</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className={`h-2 rounded-full ${
                  isOverFloodStage ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'
                }`}
                style={{ width: `${Math.min(100, stageRatio)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Discharge: {metrics.riverDischarge} m³/s</span>
              <span>Normal: {metrics.riverNormalStage}m</span>
            </div>
          </div>

          {/* Factor 3: Temperature & Atmosphere */}
          <div className="bg-slate-950 rounded-2xl border border-amber-500/30 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Thermometer className="w-4 h-4 text-amber-400" />
                3. Weather & Storm
              </span>
              <span className="font-mono text-amber-400 text-[11px]">{metrics.pressure} hPa</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-black text-white font-mono">
                {metrics.temperature}°C
              </span>
              <span className="text-xs text-slate-400">Humidity: {metrics.humidity}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-amber-500 h-2 rounded-full shadow-[0_0_10px_#f59e0b]"
                style={{ width: `${metrics.humidity}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Velocity: {metrics.stormVelocity} km/h</span>
              <span>{metrics.pressure < 990 ? 'Storm Depr' : 'Stable'}</span>
            </div>
          </div>

          {/* Factor 4: Elevation & Topography */}
          <div className="bg-slate-950 rounded-2xl border border-indigo-500/30 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Mountain className="w-4 h-4 text-indigo-400" />
                4. Elevation & Terrain
              </span>
              <span className="font-mono text-indigo-400 text-[11px]">
                {metrics.elevation < 15 ? 'Low Basin' : 'Elevated'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-black text-white font-mono">
                {metrics.elevation}
              </span>
              <span className="text-xs text-slate-400">meters a.s.l.</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-indigo-500 h-2 rounded-full shadow-[0_0_10px_#6366f1]"
                style={{ width: `${Math.min(100, (metrics.elevation / 100) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Slope: {metrics.slopeGradient}°</span>
              <span>Catchment: {metrics.catchmentAreaSqKm} km²</span>
            </div>
          </div>

          {/* Factor 5: Soil Moisture */}
          <div className="bg-slate-950 rounded-2xl border border-teal-500/30 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Sprout className="w-4 h-4 text-teal-400" />
                5. Soil Moisture
              </span>
              <span className="font-mono text-teal-400 text-[11px]">
                {metrics.soilSaturation >= 85 ? 'Saturated' : 'Absorptive'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-black text-white font-mono">
                {metrics.soilSaturation}%
              </span>
              <span className="text-xs text-slate-400">Saturation</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className={`h-2 rounded-full ${
                  metrics.soilSaturation > 80 ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-teal-500 shadow-[0_0_10px_#14b8a6]'
                }`}
                style={{ width: `${metrics.soilSaturation}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Infiltration: {metrics.infiltrationCapacity} mm/h</span>
              <span>Runoff: {metrics.soilSaturation > 80 ? '100% Surface' : 'Low'}</span>
            </div>
          </div>

          {/* Factor 6: Urban Drainage */}
          <div className="bg-slate-950 rounded-2xl border border-purple-500/30 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Building2 className="w-4 h-4 text-purple-400" />
                6. Urban Drainage
              </span>
              <span className="font-mono text-purple-400 text-[11px]">
                {metrics.drainageBlockage > 70 ? 'Severely Choked' : 'Clear'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-black text-white font-mono">
                {metrics.drainageBlockage}%
              </span>
              <span className="text-xs text-slate-400">Blockage Choke</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-purple-500 h-2 rounded-full shadow-[0_0_10px_#a855f7]"
                style={{ width: `${metrics.drainageBlockage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Impervious Ratio: {metrics.imperviousSurfaceRatio}%</span>
              <span>Backflow: {metrics.drainageBlockage > 60 ? 'Active' : 'None'}</span>
            </div>
          </div>

          {/* Factor 7: Historical Return Period */}
          <div className="bg-slate-950 rounded-2xl border border-teal-500/30 p-4 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <History className="w-4 h-4 text-teal-400" />
                7. Historical Return Period Frequency
              </span>
              <span className="font-mono text-teal-400 text-[11px] font-bold">
                1-in-{metrics.historicalReturnPeriod} Year Event
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
              <div>
                <span className="text-2xl font-black text-white font-mono">
                  {metrics.historicalReturnPeriod}
                </span>
                <span className="text-xs text-slate-400 ml-2">Year Recurrence Benchmark</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Record High: <strong className="text-white">{metrics.pastCrestRecord} m</strong>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-teal-500 h-2 rounded-full shadow-[0_0_10px_#14b8a6]"
                style={{ width: `${Math.min(100, (metrics.historicalReturnPeriod / 100) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Tier: {metrics.historicalReturnPeriod >= 50 ? 'Century Flood' : 'Decadal Recurrence'}</span>
              <span>Record Margin: {(metrics.pastCrestRecord - metrics.riverStage).toFixed(1)}m headroom</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hydrometric Station Network */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Waves className="w-4 h-4 text-blue-400" />
              River Basin Hydrometric Monitoring Network (4 Stations)
            </h3>
            <p className="text-xs text-slate-400">
              Live automated telemetry from upstream mountain gauges to urban estuaries.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('map')}
            className="text-xs font-bold text-blue-400 hover:underline"
          >
            Open Interactive GIS Map ➔
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {riverStations.map((st) => {
            const isDanger = st.currentStage >= st.dangerStage;
            const isWarn = st.currentStage >= st.warningStage;

            return (
              <div
                key={st.id}
                className={`p-4 rounded-2xl border transition ${
                  isDanger
                    ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                    : isWarn
                    ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.25)]'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="font-bold text-xs text-white line-clamp-1">
                    {st.name}
                  </div>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-md font-mono ${
                      isDanger
                        ? 'bg-red-600 text-white'
                        : isWarn
                        ? 'bg-orange-500 text-white'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {st.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mb-2 font-mono">
                  {st.location} (Elev: {st.elevation}m)
                </div>

                <div className="flex items-baseline justify-between font-mono">
                  <div>
                    <span className="text-xl font-black text-white">
                      {st.currentStage.toFixed(1)}m
                    </span>
                    <span className="text-[11px] text-slate-500 ml-1">/ {st.dangerStage}m</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold flex items-center ${
                      st.trend.includes('RISING')
                        ? 'text-red-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {st.trend.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
