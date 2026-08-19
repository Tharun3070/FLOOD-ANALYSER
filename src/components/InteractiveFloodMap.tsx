import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Shield,
  Navigation,
  Activity,
  Maximize2,
  Minimize2,
  Info,
  Waves,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  Hospital,
} from 'lucide-react';
import { RiverStation, EvacuationShelter, EvacuationRoute, RiskLevel } from '../types';

interface InteractiveFloodMapProps {
  riverStations: RiverStation[];
  shelters: EvacuationShelter[];
  routes: EvacuationRoute[];
  currentRisk: RiskLevel;
  riverStage: number;
  floodStage: number;
  rainfallIntensity: number;
}

export const InteractiveFloodMap: React.FC<InteractiveFloodMapProps> = ({
  riverStations,
  shelters,
  routes,
  currentRisk,
  riverStage,
  floodStage,
  rainfallIntensity,
}) => {
  // Layer toggles
  const [showInundation, setShowInundation] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [showContours, setShowContours] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [selectedStation, setSelectedStation] = useState<RiverStation | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<EvacuationShelter | null>(null);
  const [simulationWaterDelta, setSimulationWaterDelta] = useState<number>(0);

  const effectiveStage = Number((riverStage + simulationWaterDelta).toFixed(1));
  const isInundated = effectiveStage >= floodStage;
  const inundationSeverity = Math.min(1, Math.max(0, (effectiveStage - (floodStage - 1.5)) / 3));

  return (
    <div className="space-y-6">
      {/* Top Map Toolbar Card */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <Layers className="w-5 h-5 text-blue-400" />
            Interactive GIS Topographic & Flood Inundation Map
          </h2>
          <p className="text-xs text-slate-400">
            Real-time watershed spatial modeling with elevation contours, sensor stations, safe shelters, and evacuation corridors.
          </p>
        </div>

        {/* Inundation Simulation Slider */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-blue-500/30 text-xs shadow-inner">
          <span className="font-bold text-slate-200 whitespace-nowrap flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-blue-400" />
            Water Surge Test:
          </span>
          <input
            type="range"
            min="-1.5"
            max="3.0"
            step="0.1"
            value={simulationWaterDelta}
            onChange={(e) => setSimulationWaterDelta(parseFloat(e.target.value))}
            className="w-28 accent-blue-500 cursor-pointer"
          />
          <span className="font-mono font-black text-blue-400 min-w-14">
            {simulationWaterDelta >= 0 ? `+${simulationWaterDelta}m` : `${simulationWaterDelta}m`}
          </span>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border-2 border-slate-800 bg-[#020617] shadow-2xl">
        {/* SVG Topographic & Hydrology Map Canvas */}
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover select-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)' }}
        >
          <defs>
            {/* Elevation Contours Gradient */}
            <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* River Water Texture */}
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>

            {/* Flood Inundation Threat Glow */}
            <radialGradient id="floodGlow" cx="55%" cy="58%" r="45%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.55 * inundationSeverity} />
              <stop offset="60%" stopColor="#f97316" stopOpacity={0.35 * inundationSeverity} />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>

            {/* Doppler Radar Sweep Pattern */}
            <radialGradient id="radarSweep" cx="45%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="40%" stopColor="#06b6d4" stopOpacity={0.2} />
              <stop offset="80%" stopColor="#6366f1" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Elevation Contours & Mountain Ridges */}
          {showContours && (
            <g opacity="0.8">
              {/* Alpine Ridge Contour (High Elevation > 100m) */}
              <path
                d="M 50,50 Q 200,20 400,80 T 800,40 L 950,20 L 950,150 Q 700,200 450,140 T 50,150 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="1"
                opacity="0.6"
              />
              <text x="70" y="70" fill="#64748b" fontSize="10" fontFamily="monospace">
                ELEVATION: 145m (Highland Ridge)
              </text>

              {/* Mid-Slope Contour (40m - 80m) */}
              <path
                d="M 30,160 Q 300,180 550,260 T 980,220 L 980,450 Q 650,420 350,480 T 30,420 Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              <text x="820" y="240" fill="#64748b" fontSize="10" fontFamily="monospace">
                ELEVATION: 55m
              </text>

              {/* Floodplain Lowlands (< 20m) */}
              <path
                d="M 200,320 Q 500,360 750,480 T 950,580 L 100,580 Q 250,450 200,320 Z"
                fill="#0b1329"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              <text x="350" y="540" fill="#475569" fontSize="11" fontFamily="monospace">
                LOW-ELEVATION FLOODPLAIN BASIN (&lt; 15m)
              </text>
            </g>
          )}

          {/* 2. Doppler Weather Precipitation Radar Layer */}
          {showRadar && rainfallIntensity > 5 && (
            <g opacity="0.75" className="animate-pulse">
              <ellipse cx="480" cy="380" rx="360" ry="240" fill="url(#radarSweep)" />
              {/* Heavy rain cell core */}
              {rainfallIntensity > 25 && (
                <circle cx="520" cy="420" r="140" fill="#2563eb" opacity="0.3" />
              )}
              {rainfallIntensity > 50 && (
                <circle cx="540" cy="440" r="80" fill="#ef4444" opacity="0.35" />
              )}
            </g>
          )}

          {/* 3. Main River Network */}
          <g>
            {/* Upstream Tributary */}
            <path
              d="M 120,40 Q 240,160 380,240 T 520,380"
              fill="none"
              stroke="#2563eb"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Mountain Branch */}
            <path
              d="M 750,30 Q 640,180 520,380"
              fill="none"
              stroke="#2563eb"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Main River Channel */}
            <path
              d="M 520,380 Q 600,450 720,520 T 920,580"
              fill="none"
              stroke="url(#riverGrad)"
              strokeWidth={Math.max(12, 10 + effectiveStage * 2.2)}
              strokeLinecap="round"
            />
          </g>

          {/* 4. Flood Inundation Depth Simulation Layer */}
          {showInundation && (
            <g>
              <ellipse
                cx="620"
                cy="460"
                rx={180 + inundationSeverity * 140}
                ry={110 + inundationSeverity * 90}
                fill="url(#floodGlow)"
              />
              {isInundated && (
                <g>
                  {/* Danger Zone Polygon */}
                  <path
                    d="M 460,340 Q 620,420 780,480 T 920,560 L 820,590 Q 560,530 400,440 Z"
                    fill="#ef4444"
                    opacity={0.4 + inundationSeverity * 0.3}
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  <text
                    x="560"
                    y="470"
                    fill="#fecaca"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    ⚠️ INUNDATION ZONE: +{(effectiveStage - floodStage).toFixed(1)}m WATER OVERTOPPING
                  </text>
                </g>
              )}
            </g>
          )}

          {/* 5. Evacuation Route Paths */}
          {showRoutes && (
            <g>
              {/* Route 1: Clear Viaduct (Green) */}
              <path
                d="M 540,400 Q 420,320 280,220"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="6 4"
              />
              {/* Route 2: East Ridge Parkway (Green) */}
              <path
                d="M 580,410 Q 680,340 740,260"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="6 4"
              />
              {/* Route 3: Impassable Lower Causeway (Red / Crossed) */}
              <path
                d="M 640,470 Q 760,480 850,480"
                fill="none"
                stroke={effectiveStage >= floodStage ? '#ef4444' : '#f59e0b'}
                strokeWidth="3.5"
                strokeDasharray="3 3"
              />
            </g>
          )}

          {/* 6. River Gauging Station Pins */}
          {showStations &&
            riverStations.map((st) => {
              const cx = st.coordinates.x * 10;
              const cy = st.coordinates.y * 6;
              const isCrit = st.currentStage >= st.dangerStage;
              const isWarn = st.currentStage >= st.warningStage;

              return (
                <g
                  key={st.id}
                  className="cursor-pointer transition transform hover:scale-125"
                  onClick={() => {
                    setSelectedStation(st);
                    setSelectedShelter(null);
                  }}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r="9"
                    fill={isCrit ? '#ef4444' : isWarn ? '#f59e0b' : '#3b82f6'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {isCrit && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      className="animate-ping"
                    />
                  )}
                  <text
                    x={cx + 12}
                    y={cy + 4}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {st.name.split(' ')[0]} ({st.currentStage}m)
                  </text>
                </g>
              );
            })}

          {/* 7. Safe Evacuation Shelter Pins */}
          {showShelters &&
            shelters.map((sh) => {
              const cx = sh.coordinates.x * 10;
              const cy = sh.coordinates.y * 6;
              const isFull = sh.status === 'FULL';

              return (
                <g
                  key={sh.id}
                  className="cursor-pointer transition transform hover:scale-125"
                  onClick={() => {
                    setSelectedShelter(sh);
                    setSelectedStation(null);
                  }}
                >
                  <polygon
                    points={`${cx},${cy - 12} ${cx + 10},${cy - 6} ${cx + 10},${cy + 6} ${cx},${cy + 12} ${cx - 10},${cy + 6} ${cx - 10},${cy - 6}`}
                    fill={isFull ? '#64748b' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={cx}
                    y={cy + 3}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    H
                  </text>
                  <text
                    x={cx}
                    y={cy + 22}
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {sh.name.split(' ')[0]} ({sh.elevationMeters}m)
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Map Layer Toggle Controls Overlay */}
        <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 text-xs text-white shadow-2xl space-y-2">
          <div className="font-black text-slate-300 mb-1 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            GIS Layer Controls
          </div>
          <div className="space-y-1.5 text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition">
              <input
                type="checkbox"
                checked={showInundation}
                onChange={(e) => setShowInundation(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span>Flood Inundation Zone</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition">
              <input
                type="checkbox"
                checked={showRadar}
                onChange={(e) => setShowRadar(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span>Doppler Rain Radar</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition">
              <input
                type="checkbox"
                checked={showShelters}
                onChange={(e) => setShowShelters(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span>Safe Shelters (High Ground)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition">
              <input
                type="checkbox"
                checked={showRoutes}
                onChange={(e) => setShowRoutes(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span>Evacuation Corridors</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition">
              <input
                type="checkbox"
                checked={showStations}
                onChange={(e) => setShowStations(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span>Gauging Stations</span>
            </label>
          </div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-300 font-mono space-y-1 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span>Danger Gauge (&gt; 7.0m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <span>Normal Gauge</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span>Safe Shelter (&gt; 50m Elev)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-emerald-400 inline-block" />
            <span>Clear Viaduct Route</span>
          </div>
        </div>

        {/* Selected Pin Details Card Modal */}
        {selectedStation && (
          <div className="absolute top-4 right-4 bg-slate-950/95 backdrop-blur-xl p-5 rounded-2xl border border-blue-500/50 text-white w-72 shadow-2xl space-y-2 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div className="font-black text-xs text-blue-400">{selectedStation.name}</div>
              <button
                onClick={() => setSelectedStation(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">{selectedStation.location}</div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
              <div>Stage: <strong className="text-white">{selectedStation.currentStage}m</strong></div>
              <div>Danger: <strong className="text-red-400">{selectedStation.dangerStage}m</strong></div>
              <div>Elev: <strong>{selectedStation.elevation}m</strong></div>
              <div>Flow: <strong>{selectedStation.dischargeM3s} m³/s</strong></div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Status: <span className="text-amber-400 font-bold">{selectedStation.status} ({selectedStation.trend})</span>
            </div>
          </div>
        )}

        {selectedShelter && (
          <div className="absolute top-4 right-4 bg-slate-950/95 backdrop-blur-xl p-5 rounded-2xl border border-emerald-500/50 text-white w-72 shadow-2xl space-y-2 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div className="font-black text-xs text-emerald-400">{selectedShelter.name}</div>
              <button
                onClick={() => setSelectedShelter(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <div className="text-[11px] text-slate-300 font-mono">
              Elevation: <strong className="text-emerald-400">{selectedShelter.elevationMeters}m Above Flood Zone</strong>
            </div>
            <div className="text-xs font-mono pt-2 border-t border-slate-800 space-y-1">
              <div>
                Occupancy:{' '}
                <strong>
                  {selectedShelter.capacityOccupied} / {selectedShelter.capacityTotal} (
                  {Math.round((selectedShelter.capacityOccupied / selectedShelter.capacityTotal) * 100)}%)
                </strong>
              </div>
              <div>Distance: <strong>{selectedShelter.distanceKm} km (~{selectedShelter.estimatedTransitMin} min)</strong></div>
              <div>Medical Post: <strong>{selectedShelter.hasMedicalPost ? '✅ Ready' : 'None'}</strong></div>
              <div>Helipad: <strong>{selectedShelter.hasHelipad ? '✅ Active' : 'None'}</strong></div>
            </div>
            <div className="text-[10px] text-blue-400 font-mono pt-1">
              Emergency: {selectedShelter.contactNumber}
            </div>
          </div>
        )}
      </div>

      {/* Evacuation Routes Quick Table */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
          <Navigation className="w-4 h-4 text-emerald-400" />
          Evacuation Arterials & Road Passability Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {routes.map((r) => {
            const isBlocked = r.status === 'IMPASSABLE';
            return (
              <div
                key={r.id}
                className={`p-4 rounded-2xl border text-xs font-mono flex flex-col justify-between ${
                  isBlocked
                    ? 'bg-red-500/10 border-red-500/40 text-red-300'
                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                }`}
              >
                <div>
                  <div className="font-bold text-white mb-1">{r.routeName}</div>
                  <div className="text-[11px] opacity-80 mb-2">
                    Status: <strong className="uppercase">{r.status}</strong> ({r.waterDepthOnRoadCm}cm water)
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-current/20 text-[10px]">
                  <span>{r.distanceKm} km ({r.estimatedTimeMin} min)</span>
                  <span className="font-bold">{r.isRecommended ? '⭐ RECOMMENDED' : 'AVOID'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
