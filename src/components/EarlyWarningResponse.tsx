import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Bell,
  Radio,
  Send,
  Users,
  CheckCircle2,
  PhoneCall,
  Volume2,
  VolumeX,
  Building,
  Navigation,
  Compass,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RiskLevel, DisasterResponseProtocol } from '../types';
import { RESPONSE_PROTOCOLS } from '../data/mockHydrologyData';
import { playEmergencySiren, stopEmergencySiren, playWarningChime } from '../utils/audioAlert';

interface EarlyWarningResponseProps {
  currentRisk: RiskLevel;
  currentProbability: number;
  basinName: string;
  onNavigateToCopilot: () => void;
  onNavigateToMap: () => void;
}

export const EarlyWarningResponse: React.FC<EarlyWarningResponseProps> = ({
  currentRisk,
  currentProbability,
  basinName,
  onNavigateToCopilot,
  onNavigateToMap,
}) => {
  const [activeTabTier, setActiveTabTier] = useState<RiskLevel>(currentRisk);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [broadcastDispatched, setBroadcastDispatched] = useState(false);
  const [sheltersActivated, setSheltersActivated] = useState(false);
  const [actionLog, setActionLog] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] System telemetry initialized. Baseline hydrological surveillance active.`,
  ]);

  const protocol = RESPONSE_PROTOCOLS[activeTabTier];

  const handleTriggerSiren = () => {
    if (isSirenActive) {
      stopEmergencySiren();
      setIsSirenActive(false);
      logAction('Disaster siren manually silenced.');
    } else {
      playEmergencySiren(8);
      setIsSirenActive(true);
      logAction('Civil Defense Emergency Siren WAIL triggered (8-second broadcast cycle).');
      setTimeout(() => setIsSirenActive(false), 8000);
    }
  };

  const handleSendBroadcast = () => {
    playWarningChime();
    setBroadcastDispatched(true);
    logAction(`Emergency Cell Broadcast & EAS Alert dispatched to 42,000 residents in ${basinName}.`);
  };

  const handleActivateShelters = () => {
    setSheltersActivated(true);
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
    logAction('4 High-Ground Safe Shelters fully activated with medical teams and emergency supplies.');
  };

  const logAction = (msg: string) => {
    setActionLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            4-Tier Early Warning & Disaster Response Command Center
          </h2>
          <p className="text-xs text-slate-400">
            Automated civil protection protocols tiered to real-time ML risk predictions (0 - 100%).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToCopilot}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Draft AI Emergency Bulletin
          </button>
        </div>
      </div>

      {/* 4-Tier Visual Hierarchy Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tier 1: Low */}
        <button
          onClick={() => setActiveTabTier('LOW')}
          className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
            activeTabTier === 'LOW'
              ? 'bg-slate-900 border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          {currentRisk === 'LOW' && (
            <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          )}
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400 mb-1 uppercase tracking-wider">
              🟢 Level 1: 0 - 25%
            </div>
            <div className="font-black text-sm text-white mb-1">
              Normal Monitoring
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Routine 15-min sensor telemetry polling & baseline reservoir balance.
          </div>
        </button>

        {/* Tier 2: Moderate */}
        <button
          onClick={() => setActiveTabTier('MODERATE')}
          className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
            activeTabTier === 'MODERATE'
              ? 'bg-slate-900 border-2 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-2 ring-amber-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          {currentRisk === 'MODERATE' && (
            <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
          )}
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-amber-400 mb-1 uppercase tracking-wider">
              🟡 Level 2: 26 - 55%
            </div>
            <div className="font-black text-sm text-white mb-1">
              Notify Authorities
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Alert municipal public works, dam engineers, and standby teams.
          </div>
        </button>

        {/* Tier 3: High */}
        <button
          onClick={() => setActiveTabTier('HIGH')}
          className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
            activeTabTier === 'HIGH'
              ? 'bg-slate-900 border-2 border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.35)] ring-2 ring-orange-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          {currentRisk === 'HIGH' && (
            <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
            </span>
          )}
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-orange-400 mb-1 uppercase tracking-wider">
              🟠 Level 3: 56 - 80%
            </div>
            <div className="font-black text-sm text-white mb-1">
              Alert Residents in Zones
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Push mobile alerts, close underpasses, and prepare voluntary shelters.
          </div>
        </button>

        {/* Tier 4: Critical */}
        <button
          onClick={() => setActiveTabTier('CRITICAL')}
          className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
            activeTabTier === 'CRITICAL'
              ? 'bg-slate-900 border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.45)] ring-2 ring-red-500/20 animate-pulse'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          {currentRisk === 'CRITICAL' && (
            <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
          )}
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-red-400 mb-1 uppercase tracking-wider">
              🔴 Level 4: 81 - 100%
            </div>
            <div className="font-black text-sm text-white mb-1">
              Mandatory Evacuation
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Sound continuous sirens, dispatch rescue boats, route to safe zones.
          </div>
        </button>
      </div>

      {/* Main Active Protocol Command View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Protocol Actions & Live Triggers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Card */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Civil Protection State
                </span>
                <h3 className="text-lg font-black text-white">
                  {protocol.civilProtectionState}
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Target Audience: <strong className="text-white">{protocol.targetAudience}</strong>
              </div>
            </div>

            {/* Recommended Action Checklist */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Mandated Operational Actions ({activeTabTier})
              </h4>
              <div className="space-y-2.5">
                {protocol.recommendedActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Disaster Response Action Buttons */}
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Emergency Dispatch Controls
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Siren Control */}
                <button
                  onClick={handleTriggerSiren}
                  className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                    isSirenActive
                      ? 'bg-red-600 text-white animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.5)] border-red-500'
                      : 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border-red-500/40'
                  }`}
                >
                  {isSirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isSirenActive ? 'Silence Siren Alarm' : 'Trigger Siren Alarm'}
                </button>

                {/* Broadcast SMS */}
                <button
                  onClick={handleSendBroadcast}
                  className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                    broadcastDispatched
                      ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border-emerald-500'
                      : 'bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border-blue-500/40'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {broadcastDispatched ? 'Broadcast Sent ✓' : 'Dispatch Cell Alert'}
                </button>

                {/* Safe Shelter Activation */}
                <button
                  onClick={handleActivateShelters}
                  className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                    sheltersActivated
                      ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border-purple-500'
                      : 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border-purple-500/40'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  {sheltersActivated ? 'Shelters Active ✓' : 'Open Safe Shelters'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Phone Alert Simulation & Audit Log */}
        <div className="space-y-6">
          {/* Simulated Mobile Push Notification */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-5 shadow-xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              Resident Phone EAS Notification Preview
            </h4>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-white space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  CIVIL EMERGENCY MESSAGE
                </span>
                <span>NOW</span>
              </div>
              <div className="font-black text-xs text-red-400">
                {currentRisk === 'CRITICAL'
                  ? '🚨 FLASH FLOOD EMERGENCY: EVACUATE IMMEDIATELY'
                  : currentRisk === 'HIGH'
                  ? '⚠️ FLOOD WARNING: Seek High Ground'
                  : 'ℹ️ HYDROLOGICAL ADVISORY: Normal Precautions'}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                National Hydrological Service: Severe surge predicted in {basinName}. Lowlands subject to sudden inundation. Proceed via elevated Route 12 to North Ridge High School shelter immediately.
              </p>
            </div>
          </div>

          {/* Real-time Dispatch Audit Log */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Response Dispatch Audit Log
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">● LIVE</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 font-mono text-[11px] text-slate-400 pr-1">
              {actionLog.map((log, i) => (
                <div key={i} className="py-1 border-b border-slate-800/80 leading-tight">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
