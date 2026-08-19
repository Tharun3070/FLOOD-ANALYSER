import React, { useState } from 'react';
import {
  Sparkles,
  Radio,
  FileText,
  Copy,
  Check,
  Volume2,
  VolumeX,
  AlertTriangle,
  Send,
  Globe2,
  ShieldCheck,
  PhoneCall,
  Flame,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { HydrologicalMetrics, ModelPrediction, RiskLevel, AIEmergencyAnalysis, AIEmergencyBulletin } from '../types';
import { speakAlertBroadcast } from '../utils/audioAlert';

interface AIEmergencyCopilotProps {
  metrics: HydrologicalMetrics;
  predictions: Record<string, ModelPrediction>;
  currentRisk: RiskLevel;
  basinName: string;
}

export const AIEmergencyCopilot: React.FC<AIEmergencyCopilotProps> = ({
  metrics,
  predictions,
  currentRisk,
  basinName,
}) => {
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingBulletin, setLoadingBulletin] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIEmergencyAnalysis | null>(null);
  const [aiBulletin, setAiBulletin] = useState<AIEmergencyBulletin | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fetchAIAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      const res = await fetch('/api/ai-risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basinName,
          rainfallIntensity: metrics.rainfallIntensity,
          accumulatedRainfall24h: metrics.accumulatedRainfall24h,
          riverStage: metrics.riverStage,
          riverFloodStage: metrics.riverFloodStage,
          soilSaturation: metrics.soilSaturation,
          elevation: metrics.elevation,
          drainageBlockage: metrics.drainageBlockage,
          temperature: metrics.temperature,
          historicalReturnPeriod: metrics.historicalReturnPeriod,
          activeModelPredictions: predictions,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiAnalysis(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const fetchAIBulletin = async () => {
    setLoadingBulletin(true);
    try {
      const res = await fetch('/api/generate-alert-bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riskLevel: currentRisk,
          basinName,
          metrics,
          urgency: currentRisk === 'CRITICAL' ? 'IMMEDIATE_ACTION' : 'HIGH_PRIORITY',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiBulletin(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBulletin(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakAlertBroadcast(text);
      setTimeout(() => setIsSpeaking(false), 8000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <Sparkles className="w-5 h-5 text-blue-400" />
            AI Disaster Copilot & Emergency Broadcast Studio
          </h2>
          <p className="text-xs text-slate-400">
            Powered by Gemini AI server-side reasoning for automated hydrological briefings, multi-lingual emergency bulletins, and tactical responder dispatches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchAIAnalysis}
            disabled={loadingAnalysis}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalysis ? 'animate-spin' : ''}`} />
            {loadingAnalysis ? 'Analyzing Telemetry...' : 'Generate AI Risk Assessment'}
          </button>

          <button
            onClick={fetchAIBulletin}
            disabled={loadingBulletin}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition disabled:opacity-50 cursor-pointer"
          >
            <Radio className={`w-3.5 h-3.5 ${loadingBulletin ? 'animate-pulse' : ''}`} />
            {loadingBulletin ? 'Drafting Broadcast...' : 'Draft Multi-Channel Bulletin'}
          </button>
        </div>
      </div>

      {/* AI Hydrological Analysis Card */}
      {aiAnalysis ? (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-blue-500/30 p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                AI Chief Hydrological Briefing
              </span>
              <h3 className="text-lg font-black text-white">
                Disaster Evaluation & Peak Crest Projection for {basinName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-blue-600/20 text-blue-400 px-3 py-1 rounded-xl border border-blue-500/30 font-bold">
                Peak Crest ETA: ~{aiAnalysis.timeToCrestHours} Hours
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-red-600 text-white uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                {aiAnalysis.riskLevel}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {aiAnalysis.hydrologicalSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Key Physical Vulnerabilities */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Key Inundation Vulnerabilities
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {aiAnalysis.keyVulnerabilities?.map((vuln, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{vuln}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Early Actions */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Recommended Early Civil Actions
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {aiAnalysis.recommendedEarlyActions?.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Public Instruction Pill */}
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-xs text-red-300 font-bold flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-red-400 shrink-0" />
            <span>Public Safety Directive: {aiAnalysis.publicSafetyInstruction}</span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-dashed border-slate-800 p-8 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-blue-400 mx-auto" />
          <h3 className="text-base font-bold text-white">
            Generate Real-Time AI Hydrological Risk Evaluation
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Click &ldquo;Generate AI Risk Assessment&rdquo; to send real-time sensor metrics and ML ensemble outputs to Gemini for an instant chief meteorological brief.
          </p>
          <button
            onClick={fetchAIAnalysis}
            disabled={loadingAnalysis}
            className="px-5 py-2.5 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer"
          >
            {loadingAnalysis ? 'Evaluating...' : 'Run Assessment Now'}
          </button>
        </div>
      )}

      {/* Multi-Channel Emergency Broadcast Generator */}
      {aiBulletin ? (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-indigo-500/30 p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                Official Multi-Channel Broadcast Center
              </span>
              <h3 className="text-lg font-black text-white">
                Emergency Alert System & Public Warning Copy
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
              ● Ready for Broadcast Transmission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. SMS Alert */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  SMS Cell Broadcast (&lt; 160 chars)
                </span>
                <button
                  onClick={() => copyToClipboard(aiBulletin.smsAlert, 'sms')}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono font-bold cursor-pointer"
                >
                  {copiedKey === 'sms' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'sms' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl text-xs font-mono text-slate-200 border border-slate-800">
                {aiBulletin.smsAlert}
              </div>
            </div>

            {/* 2. Siren Loudspeaker Audio Script */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-red-400" />
                  PA Loudspeaker Announcement
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSpeak(aiBulletin.sirenAnnouncement)}
                    className="text-xs text-red-400 hover:underline flex items-center gap-1 font-mono font-bold cursor-pointer"
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    {isSpeaking ? 'Stop Voice' : 'Read Aloud'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(aiBulletin.sirenAnnouncement, 'siren')}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono font-bold cursor-pointer"
                  >
                    {copiedKey === 'siren' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'siren' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl text-xs font-mono text-slate-200 border border-slate-800">
                &ldquo;{aiBulletin.sirenAnnouncement}&rdquo;
              </div>
            </div>

            {/* 3. EAS TV/Radio Broadcast Script */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  EAS Television & Radio Crawler Script
                </span>
                <button
                  onClick={() => copyToClipboard(aiBulletin.easBroadcast, 'eas')}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono font-bold cursor-pointer"
                >
                  {copiedKey === 'eas' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'eas' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl text-xs font-mono text-slate-200 border border-slate-800">
                {aiBulletin.easBroadcast}
              </div>
            </div>

            {/* 4. Multilingual Notices */}
            {aiBulletin.multilingualNotice && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                    Multilingual Emergency Life-Safety Translations
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="font-black text-slate-400 mb-1 text-[11px]">Spanish (Español)</div>
                    <div className="text-slate-200">{aiBulletin.multilingualNotice.Spanish}</div>
                  </div>
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="font-black text-slate-400 mb-1 text-[11px]">French (Français)</div>
                    <div className="text-slate-200">{aiBulletin.multilingualNotice.French}</div>
                  </div>
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="font-black text-slate-400 mb-1 text-[11px]">Hindi (हिंदी)</div>
                    <div className="text-slate-200">{aiBulletin.multilingualNotice.Hindi}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Dispatcher Notes & Evac Checklist */}
            {aiBulletin.tacticalDispatcherNotes && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  First Responder Dispatch Orders
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {aiBulletin.tacticalDispatcherNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">▶</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiBulletin.evacuationChecklist && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Resident Evacuation Go-Bag Kit
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {aiBulletin.evacuationChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
