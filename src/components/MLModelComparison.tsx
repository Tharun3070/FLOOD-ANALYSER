import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BrainCircuit,
  Binary,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
} from 'recharts';
import { ModelPrediction, MLModelType, HydrologicalMetrics } from '../types';
import { getRiskLevelColor } from '../utils/mlEngine';

interface MLModelComparisonProps {
  predictions: Record<MLModelType, ModelPrediction>;
  selectedModel: MLModelType;
  onSelectModel: (model: MLModelType) => void;
  metrics: HydrologicalMetrics;
}

export const MLModelComparison: React.FC<MLModelComparisonProps> = ({
  predictions,
  selectedModel,
  onSelectModel,
  metrics,
}) => {
  const [activeChartMode, setActiveChartMode] = useState<'HYDROGRAPH' | 'IMPORTANCE' | 'METRICS'>('HYDROGRAPH');
  const activePred = predictions[selectedModel] || predictions.XGBOOST;
  const riskColors = getRiskLevelColor(activePred.predictedRiskLevel);

  const modelList: MLModelType[] = ['XGBOOST', 'LSTM', 'RANDOM_FOREST', 'LOGISTIC_REGRESSION'];

  // Prepare comparison metrics for Recharts
  const benchmarkComparisonData = [
    {
      metric: 'Accuracy (%)',
      XGBoost: predictions.XGBOOST.accuracy,
      LSTM: predictions.LSTM.accuracy,
      RandomForest: predictions.RANDOM_FOREST.accuracy,
      LogisticRegression: predictions.LOGISTIC_REGRESSION.accuracy,
    },
    {
      metric: 'ROC-AUC (x100)',
      XGBoost: Math.round(predictions.XGBOOST.rocAuc * 100),
      LSTM: Math.round(predictions.LSTM.rocAuc * 100),
      RandomForest: Math.round(predictions.RANDOM_FOREST.rocAuc * 100),
      LogisticRegression: Math.round(predictions.LOGISTIC_REGRESSION.rocAuc * 100),
    },
    {
      metric: 'F1 Score (x100)',
      XGBoost: Math.round(predictions.XGBOOST.f1Score * 100),
      LSTM: Math.round(predictions.LSTM.f1Score * 100),
      RandomForest: Math.round(predictions.RANDOM_FOREST.f1Score * 100),
      LogisticRegression: Math.round(predictions.LOGISTIC_REGRESSION.f1Score * 100),
    },
    {
      metric: 'Confidence (%)',
      XGBoost: predictions.XGBOOST.confidenceScore,
      LSTM: predictions.LSTM.confidenceScore,
      RandomForest: predictions.RANDOM_FOREST.confidenceScore,
      LogisticRegression: predictions.LOGISTIC_REGRESSION.confidenceScore,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <BrainCircuit className="w-5 h-5 text-blue-400" />
            Machine Learning Multi-Model Comparison & Benchmarking
          </h2>
          <p className="text-xs text-slate-400">
            Side-by-side comparison of tree-based, recurrent sequence, and linear classification architectures for flood risk forecasting.
          </p>
        </div>

        {/* Chart View Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveChartMode('HYDROGRAPH')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              activeChartMode === 'HYDROGRAPH'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            12h Hydrograph Curve
          </button>
          <button
            onClick={() => setActiveChartMode('IMPORTANCE')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              activeChartMode === 'IMPORTANCE'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Feature Importances
          </button>
          <button
            onClick={() => setActiveChartMode('METRICS')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              activeChartMode === 'METRICS'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ROC-AUC & Accuracy
          </button>
        </div>
      </div>

      {/* Model Selector Cards (4 Models) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelList.map((mType) => {
          const model = predictions[mType];
          const isSelected = selectedModel === mType;
          const mColors = getRiskLevelColor(model.predictedRiskLevel);

          const getModelIcon = () => {
            switch (mType) {
              case 'XGBOOST':
                return <Zap className="w-4 h-4 text-amber-400" />;
              case 'LSTM':
                return <BrainCircuit className="w-4 h-4 text-purple-400" />;
              case 'RANDOM_FOREST':
                return <Layers className="w-4 h-4 text-emerald-400" />;
              case 'LOGISTIC_REGRESSION':
                return <Binary className="w-4 h-4 text-blue-400" />;
            }
          };

          return (
            <button
              key={mType}
              onClick={() => onSelectModel(mType)}
              className={`text-left p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-2 border-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.35)] ring-2 ring-blue-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 shadow-[0_0_10px_#3b82f6]" />
              )}

              <div>
                <div className="flex items-center justify-between gap-1 mb-3">
                  <div className="flex items-center gap-2 font-black text-xs text-white">
                    {getModelIcon()}
                    <span>{model.modelType.replace('_', ' ')}</span>
                  </div>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${mColors.badge}`}
                  >
                    {model.predictedRiskLevel}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <div className="text-3xl font-black text-white font-mono">
                      {model.floodProbability}%
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Flood Probability
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-blue-400 font-mono">
                      {model.predictedPeakStage}m
                    </div>
                    <div className="text-[10px] text-slate-400">Peak (~{model.timeToPeakHours}h)</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-500">Accuracy:</span>{' '}
                  <strong className="text-white">{model.accuracy}%</strong>
                </div>
                <div>
                  <span className="text-slate-500">ROC-AUC:</span>{' '}
                  <strong className="text-white">{model.rocAuc}</strong>
                </div>
                <div>
                  <span className="text-slate-500">F1-Score:</span>{' '}
                  <strong className="text-white">{model.f1Score}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Inference:</span>{' '}
                  <strong className="text-emerald-400">{model.inferenceTimeMs}ms</strong>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chart Card */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-xl">
        {activeChartMode === 'HYDROGRAPH' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  12-Hour Predicted Stage Hydrograph vs Danger Threshold ({activePred.modelName})
                </h3>
                <p className="text-xs text-slate-400">
                  Projected river water level elevation (m) with 95% confidence intervals and rainfall intensity.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <span className="w-3 h-0.5 bg-blue-500 inline-block shadow-[0_0_8px_#3b82f6]" />
                  Predicted Water Level
                </span>
                <span className="flex items-center gap-1.5 text-red-400 font-bold">
                  <span className="w-3 h-0.5 bg-red-500 border-dashed border-t inline-block" />
                  Danger Stage ({metrics.riverFloodStage}m)
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activePred.forecastCurve}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="stageFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(val) => `+${val}h`}
                    stroke="#64748b"
                    fontSize={11}
                  />
                  <YAxis
                    domain={[Math.floor(metrics.riverNormalStage * 0.8), Math.ceil(Math.max(metrics.riverFloodStage + 1.5, activePred.predictedPeakStage + 0.5))]}
                    stroke="#64748b"
                    fontSize={11}
                    unit="m"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl text-xs text-white shadow-2xl">
                            <div className="font-bold text-blue-400 mb-1">Forecast Hour +{label}</div>
                            <div className="space-y-1 font-mono">
                              <div>Predicted Stage: <strong className="text-white">{data.predictedStage} m</strong></div>
                              <div className="text-slate-400">95% Range: {data.lowerBound}m - {data.upperBound}m</div>
                              <div className="text-blue-300">Rainfall: {data.rainfallForecast} mm/h</div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={metrics.riverFloodStage}
                    label={{
                      value: `CRITICAL FLOOD STAGE (${metrics.riverFloodStage}m)`,
                      fill: '#ef4444',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="upperBound"
                    stroke="transparent"
                    fill="url(#confidenceBand)"
                  />
                  <Area
                    type="monotone"
                    dataKey="predictedStage"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#stageFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChartMode === 'IMPORTANCE' && (
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Feature Importance & Decision Weights ({activePred.modelName})
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Relative contribution of each hydrological factor to model output probability.
            </p>

            <div className="space-y-4">
              {activePred.featureImportance.map((feat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">
                      {feat.feature}
                    </span>
                    <span className="font-mono font-black text-blue-400">
                      {feat.weight}% weight
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400 h-3 rounded-full transition-all duration-700 shadow-[0_0_10px_#3b82f6]"
                      style={{ width: `${feat.weight * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeChartMode === 'METRICS' && (
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Comprehensive Model Benchmark Matrix
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Cross-validation scores tested against historical flood archive datasets (2010 - 2026).
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkComparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                  <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="XGBoost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="LSTM" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="RandomForest" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="LogisticRegression" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Model Comparison Table */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-xl overflow-x-auto">
        <h3 className="text-base font-bold text-white mb-3">
          Architecture Characteristics & Hydrological Suitability
        </h3>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase">
              <th className="py-3 px-3">Model</th>
              <th className="py-3 px-3">Algorithm Type</th>
              <th className="py-3 px-3">Core Strength</th>
              <th className="py-3 px-3">Inference Speed</th>
              <th className="py-3 px-3">Accuracy</th>
              <th className="py-3 px-3">Best Used For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
            <tr className={selectedModel === 'XGBOOST' ? 'bg-blue-500/10 text-white' : ''}>
              <td className="py-3 px-3 font-bold text-amber-400">XGBoost</td>
              <td className="py-3 px-3">Gradient Boosted Decision Trees</td>
              <td className="py-3 px-3">Captures non-linear rain/soil/drain interactions</td>
              <td className="py-3 px-3 font-mono text-emerald-400 font-bold">2.1 ms (Ultra Fast)</td>
              <td className="py-3 px-3 font-mono font-bold text-white">96.8%</td>
              <td className="py-3 px-3 text-slate-400">Real-time edge alerting & rapid risk classification</td>
            </tr>
            <tr className={selectedModel === 'LSTM' ? 'bg-blue-500/10 text-white' : ''}>
              <td className="py-3 px-3 font-bold text-purple-400">LSTM Recurrent Net</td>
              <td className="py-3 px-3">Deep Sequential Memory Network</td>
              <td className="py-3 px-3">Models multi-hour upstream runoff lag dynamics</td>
              <td className="py-3 px-3 font-mono text-amber-400 font-bold">11.2 ms</td>
              <td className="py-3 px-3 font-mono font-bold text-white">97.4%</td>
              <td className="py-3 px-3 text-slate-400">12h - 48h temporal hydrograph stage projection</td>
            </tr>
            <tr className={selectedModel === 'RANDOM_FOREST' ? 'bg-blue-500/10 text-white' : ''}>
              <td className="py-3 px-3 font-bold text-emerald-400">Random Forest</td>
              <td className="py-3 px-3">100 Ensemble Decision Trees</td>
              <td className="py-3 px-3">Robust against noisy or missing telemetry sensors</td>
              <td className="py-3 px-3 font-mono text-emerald-400 font-bold">4.8 ms</td>
              <td className="py-3 px-3 font-mono font-bold text-white">94.6%</td>
              <td className="py-3 px-3 text-slate-400">Feature importance auditing & baseline stability</td>
            </tr>
            <tr className={selectedModel === 'LOGISTIC_REGRESSION' ? 'bg-blue-500/10 text-white' : ''}>
              <td className="py-3 px-3 font-bold text-blue-400">Logistic Regression</td>
              <td className="py-3 px-3">Linear Sigmoid Classifier</td>
              <td className="py-3 px-3">Complete mathematical explainability and simplicity</td>
              <td className="py-3 px-3 font-mono text-emerald-400 font-bold">1.4 ms</td>
              <td className="py-3 px-3 font-mono font-bold text-white">87.2%</td>
              <td className="py-3 px-3 text-slate-400">Lightweight low-power microcontrollers</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
