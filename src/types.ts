export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type MLModelType = 'RANDOM_FOREST' | 'XGBOOST' | 'LSTM' | 'LOGISTIC_REGRESSION';

export interface HydrologicalMetrics {
  // 1. Rainfall intensity & accumulated
  rainfallIntensity: number; // mm/hour
  accumulatedRainfall24h: number; // mm in last 24h
  accumulatedRainfall48h: number; // mm in last 48h
  
  // 2. River/water-level data
  riverStage: number; // current level in meters
  riverNormalStage: number; // normal level in meters
  riverFloodStage: number; // flood danger threshold in meters
  riverDischarge: number; // flow rate in m³/s
  
  // 3. Weather & Temperature
  temperature: number; // °C
  humidity: number; // %
  pressure: number; // hPa
  stormVelocity: number; // km/h
  
  // 4. Terrain & Elevation
  elevation: number; // meters above sea level
  slopeGradient: number; // degrees
  catchmentAreaSqKm: number; // sq km
  
  // 5. Soil moisture
  soilSaturation: number; // %
  infiltrationCapacity: number; // mm/h
  
  // 6. Urban drainage
  drainageBlockage: number; // % capacity choked/burdened
  imperviousSurfaceRatio: number; // % (concrete vs green)
  
  // 7. Historical records
  historicalReturnPeriod: number; // years (e.g. 5, 10, 50, 100)
  pastCrestRecord: number; // meters
}

export interface ModelPrediction {
  modelType: MLModelType;
  modelName: string;
  floodProbability: number; // 0 - 100%
  predictedRiskLevel: RiskLevel;
  predictedPeakStage: number; // meters
  timeToPeakHours: number; // hours
  confidenceScore: number; // %
  accuracy: number; // %
  f1Score: number;
  rocAuc: number;
  inferenceTimeMs: number;
  featureImportance: {
    feature: string;
    weight: number; // percentage
  }[];
  forecastCurve: {
    hour: number;
    predictedStage: number;
    lowerBound: number;
    upperBound: number;
    rainfallForecast: number;
  }[];
}

export interface RiverStation {
  id: string;
  name: string;
  location: string;
  coordinates: { x: number; y: number }; // normalized 0-100 for SVG/Map
  elevation: number;
  currentStage: number;
  warningStage: number;
  dangerStage: number;
  status: 'NORMAL' | 'ADVISORY' | 'WARNING' | 'CRITICAL';
  trend: 'RISING_FAST' | 'RISING' | 'STEADY' | 'RECEDING';
  dischargeM3s: number;
}

export interface EvacuationShelter {
  id: string;
  name: string;
  type: 'SCHOOL' | 'STADIUM' | 'CIVIC_CENTER' | 'HOSPITAL_SAFE_ZONE';
  elevationMeters: number;
  capacityTotal: number;
  capacityOccupied: number;
  coordinates: { x: number; y: number };
  status: 'OPEN' | 'FILLING_FAST' | 'FULL' | 'STANDBY';
  distanceKm: number;
  estimatedTransitMin: number;
  suppliesStatus: 'PLENTIFUL' | 'ADEQUATE' | 'CRITICAL';
  hasMedicalPost: boolean;
  hasHelipad: boolean;
  contactNumber: string;
}

export interface EvacuationRoute {
  id: string;
  routeName: string;
  targetShelterId: string;
  distanceKm: number;
  estimatedTimeMin: number;
  status: 'CLEAR' | 'CONGESTED' | 'FLOOD_WARNING' | 'IMPASSABLE';
  waterDepthOnRoadCm: number;
  highestGroundElevM: number;
  isRecommended: boolean;
}

export interface FloodScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  metrics: HydrologicalMetrics;
}

export interface DisasterResponseProtocol {
  riskLevel: RiskLevel;
  actionTitle: string;
  targetAudience: string;
  soundAlarm: boolean;
  recommendedActions: string[];
  automatedTriggers: string[];
  civilProtectionState: string;
}

export interface AIEmergencyAnalysis {
  riskLevel: RiskLevel;
  riskScore: number;
  timeToCrestHours: number;
  hydrologicalSummary: string;
  keyVulnerabilities: string[];
  recommendedEarlyActions: string[];
  affectedZonePriority: {
    zoneName: string;
    hazardType: string;
    urgencyLevel: string;
  }[];
  publicSafetyInstruction: string;
}

export interface AIEmergencyBulletin {
  smsAlert: string;
  easBroadcast: string;
  sirenAnnouncement: string;
  socialMediaNotice: string;
  multilingualNotice: {
    Spanish: string;
    French: string;
    Hindi: string;
  };
  tacticalDispatcherNotes: string[];
  evacuationChecklist: string[];
}
