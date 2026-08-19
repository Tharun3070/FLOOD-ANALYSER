import React from 'react';
import {
  Waves,
  AlertTriangle,
  Volume2,
  VolumeX,
  Radio,
  Clock,
  Sparkles,
  RefreshCw,
  Layers,
  Activity,
  ShieldAlert,
} from 'lucide-react';
import { RiskLevel, FloodScenario } from '../types';
import { getRiskLevelColor } from '../utils/mlEngine';
import { PRESET_SCENARIOS } from '../data/mockHydrologyData';

interface HeaderProps {
  currentRisk: RiskLevel;
  currentProbability: number;
  activeScenario: FloodScenario | null;
  onSelectScenario: (scenario: FloodScenario) => void;
  onResetSimulation: () => void;
  isSirenPlaying: boolean;
  onToggleSiren: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  liveTime: string;
  isLiveTicking: boolean;
  onToggleLiveTicking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRisk,
  currentProbability,
  activeScenario,
  onSelectScenario,
  onResetSimulation,
  isSirenPlaying,
  onToggleSiren,
  activeTab,
  setActiveTab,
  liveTime,
  isLiveTicking,
  onToggleLiveTicking,
}) => {
  const riskColors = getRiskLevelColor(currentRisk);

  return (
    <header className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-b border-slate-800 text-slate-100 shadow-2xl">
      {/* Top Warning Banner for High/Critical Risk */}
      {(currentRisk === 'CRITICAL' || currentRisk === 'HIGH') && (
        <div
          className={`w-full py-2 px-6 text-xs font-bold flex items-center justify-between transition-colors ${
            currentRisk === 'CRITICAL'
              ? 'bg-red-600/90 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
              : 'bg-orange-600/90 text-white shadow-[0_0_20px_rgba(249,115,22,0.35)]'
          }`}
        >
          <div className="flex items-center gap-3 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="tracking-wide">
              {currentRisk === 'CRITICAL'
                ? 'EMERGENCY FLASH FLOOD DIRECTIVE: Severe catchment inundation imminent. Mandatory evacuation protocols active.'
                : 'HYDROLOGICAL THREAT ALERT: Elevated tributary runoff detected. Emergency operations center mobilized.'}
            </span>
            <button
              onClick={() => setActiveTab('early-warning')}
              className="ml-auto underline text-xs font-black uppercase tracking-wider hover:opacity-90 whitespace-nowrap"
            >
              Take Action Now →
            </button>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(37,99,235,0.45)] border border-blue-400/30">
            🌊
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter leading-none text-white">
                AQUAGUARD <span className="text-blue-500">AI</span>
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30">
                v4.8 PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.28em] mt-1 font-semibold">
              Early Warning & Hydrological Prediction Suite
            </p>
          </div>
        </div>

        {/* Right Info: Warning Zone & Live Threat Pill */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Active Warning Zone Indicator */}
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
              Active Basin Zone
            </span>
            <span className="text-orange-400 font-black text-base tracking-tight">
              PERIYAR / B4 LOWLANDS
            </span>
          </div>

          {/* Glowing Risk Level Status Badge */}
          <div
            className={`px-5 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${riskColors.bg} ${riskColors.border} ${riskColors.glow}`}
          >
            <div className={`w-3.5 h-3.5 rounded-full ${riskColors.dot} animate-pulse`} />
            <div className="flex flex-col">
              <span className={`text-xs font-black uppercase tracking-tight ${riskColors.text}`}>
                {currentRisk} RISK LEVEL
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                {currentProbability}% Inundation Probability
              </span>
            </div>
          </div>

          {/* Quick Scenario & Siren Controls */}
          <div className="flex items-center gap-2">
            {/* Scenario Picker */}
            <select
              value={activeScenario?.id || 'custom'}
              onChange={(e) => {
                const found = PRESET_SCENARIOS.find((s) => s.id === e.target.value);
                if (found) onSelectScenario(found);
              }}
              className="bg-slate-900/90 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2 border border-slate-700 hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            >
              {PRESET_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
              <option value="custom">Custom Sandbox</option>
            </select>

            {/* Live Telemetry Ticker Toggle */}
            <button
              onClick={onToggleLiveTicking}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono border transition-all ${
                isLiveTicking
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title="Toggle live telemetry polling"
            >
              <Activity className={`w-3.5 h-3.5 ${isLiveTicking ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
              <span className="hidden sm:inline font-bold">{liveTime}</span>
              <span className={`w-2 h-2 rounded-full ${isLiveTicking ? 'bg-emerald-400 animate-ping' : 'bg-slate-700'}`} />
            </button>

            {/* Siren Alarm Audio Trigger */}
            <button
              onClick={onToggleSiren}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isSirenPlaying
                  ? 'bg-red-600 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                  : 'bg-slate-900 hover:bg-slate-800 text-red-400 border border-red-500/30'
              }`}
              title="Test Emergency Disaster Siren"
            >
              {isSirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSirenPlaying ? 'Silence' : 'Siren'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={onResetSimulation}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
              title="Reset to Baseline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-slate-800/80 py-2">
        {[
          { id: 'dashboard', label: 'Live Telemetry & Dashboard', icon: Activity },
          { id: 'ml-models', label: 'ML Models & Benchmarks (4)', icon: Sparkles },
          { id: 'map', label: 'GIS Topographic & Flood Map', icon: Layers },
          { id: 'early-warning', label: 'Early Warning & Response', icon: ShieldAlert },
          { id: 'simulator', label: 'Multi-Factor Sandbox', icon: RefreshCw },
          { id: 'ai-copilot', label: 'AI Disaster Copilot', icon: Radio },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.id === 'early-warning' && (currentRisk === 'CRITICAL' || currentRisk === 'HIGH') && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping ml-1" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
