import {
  HydrologicalMetrics,
  RiverStation,
  EvacuationShelter,
  EvacuationRoute,
  FloodScenario,
  DisasterResponseProtocol,
} from '../types';

export const RIVER_BASINS = [
  { id: 'basin-1', name: 'Pine Valley Catchment Area', region: 'North Sector', riverName: 'Pine River', areaSqKm: 420 },
  { id: 'basin-2', name: 'Blue Ridge Hydrological Basin', region: 'Highland Reach', riverName: 'Clear Creek', areaSqKm: 310 },
  { id: 'basin-3', name: 'Metropolitan Estuary & Delta', region: 'Urban Lowlands', riverName: 'Grand Canal', areaSqKm: 650 },
  { id: 'basin-4', name: 'Cascade Mountain Watershed', region: 'Alpine Zone', riverName: 'Cascade River', areaSqKm: 580 },
];

export const INITIAL_METRICS: HydrologicalMetrics = {
  // 1. Rainfall
  rainfallIntensity: 38.5, // mm/h
  accumulatedRainfall24h: 112.0, // mm
  accumulatedRainfall48h: 165.0, // mm

  // 2. River/Water Level
  riverStage: 6.8, // m
  riverNormalStage: 3.2, // m
  riverFloodStage: 7.0, // m
  riverDischarge: 1420, // m³/s

  // 3. Weather
  temperature: 21.5, // °C
  humidity: 94, // %
  pressure: 996, // hPa
  stormVelocity: 34, // km/h

  // 4. Terrain / Elevation
  elevation: 18, // m above sea level
  slopeGradient: 3.8, // degrees
  catchmentAreaSqKm: 420,

  // 5. Soil
  soilSaturation: 82, // %
  infiltrationCapacity: 12, // mm/h

  // 6. Urban Drainage
  drainageBlockage: 65, // %
  imperviousSurfaceRatio: 58, // %

  // 7. Historical
  historicalReturnPeriod: 25, // 1-in-25 year storm
  pastCrestRecord: 8.1, // m
};

export const PRESET_SCENARIOS: FloodScenario[] = [
  {
    id: 'flash-monsoon',
    title: 'Monsoon Cloudburst (Flash Flood)',
    subtitle: 'Sudden high-intensity deluge on saturated urban soil',
    badge: 'Flash Flood Event',
    description: 'Extreme sudden downpour (68 mm/h) with already 88% saturated soil and choked urban drainage channels, leading to rapid water rise in under 2 hours.',
    metrics: {
      rainfallIntensity: 68.0,
      accumulatedRainfall24h: 185.0,
      accumulatedRainfall48h: 240.0,
      riverStage: 7.4,
      riverNormalStage: 3.2,
      riverFloodStage: 7.0,
      riverDischarge: 2100,
      temperature: 24.0,
      humidity: 98,
      pressure: 988,
      stormVelocity: 52,
      elevation: 12,
      slopeGradient: 2.1,
      catchmentAreaSqKm: 420,
      soilSaturation: 92,
      infiltrationCapacity: 6,
      drainageBlockage: 85,
      imperviousSurfaceRatio: 72,
      historicalReturnPeriod: 50,
      pastCrestRecord: 8.1,
    },
  },
  {
    id: 'typhoon-surge',
    title: 'Tropical Typhoon & Coastal Surge',
    subtitle: 'Prolonged torrential precipitation with tidal backwater',
    badge: 'Typhoon Category 3',
    description: 'Multi-day sustained rainfall with low atmospheric pressure, high river discharge, and coastal delta backflow.',
    metrics: {
      rainfallIntensity: 52.0,
      accumulatedRainfall24h: 210.0,
      accumulatedRainfall48h: 340.0,
      riverStage: 7.9,
      riverNormalStage: 3.2,
      riverFloodStage: 7.0,
      riverDischarge: 2450,
      temperature: 22.0,
      humidity: 99,
      pressure: 978,
      stormVelocity: 68,
      elevation: 9,
      slopeGradient: 1.5,
      catchmentAreaSqKm: 650,
      soilSaturation: 96,
      infiltrationCapacity: 4,
      drainageBlockage: 78,
      imperviousSurfaceRatio: 64,
      historicalReturnPeriod: 100,
      pastCrestRecord: 8.1,
    },
  },
  {
    id: 'moderate-spring',
    title: 'Spring Snowmelt + Moderate Rain',
    subtitle: 'Gradual water level rise requiring active municipal monitoring',
    badge: 'Moderate Advisory',
    description: 'Steady 18 mm/h rainfall coupled with moderate mountain runoff. River levels are elevated but currently below critical danger limits.',
    metrics: {
      rainfallIntensity: 18.0,
      accumulatedRainfall24h: 48.0,
      accumulatedRainfall48h: 75.0,
      riverStage: 5.1,
      riverNormalStage: 3.2,
      riverFloodStage: 7.0,
      riverDischarge: 890,
      temperature: 14.5,
      humidity: 82,
      pressure: 1010,
      stormVelocity: 22,
      elevation: 24,
      slopeGradient: 5.2,
      catchmentAreaSqKm: 420,
      soilSaturation: 64,
      infiltrationCapacity: 18,
      drainageBlockage: 35,
      imperviousSurfaceRatio: 45,
      historicalReturnPeriod: 5,
      pastCrestRecord: 8.1,
    },
  },
  {
    id: 'dry-baseline',
    title: 'Dry Season Baseline',
    subtitle: 'Optimal hydrological conditions with high absorption capacity',
    badge: 'Low Risk Normal',
    description: 'Minimal rainfall, low river stage, deep soil absorption capacity, and fully clear municipal drainage networks.',
    metrics: {
      rainfallIntensity: 2.0,
      accumulatedRainfall24h: 6.0,
      accumulatedRainfall48h: 12.0,
      riverStage: 2.8,
      riverNormalStage: 3.2,
      riverFloodStage: 7.0,
      riverDischarge: 320,
      temperature: 23.0,
      humidity: 52,
      pressure: 1018,
      stormVelocity: 14,
      elevation: 32,
      slopeGradient: 4.5,
      catchmentAreaSqKm: 420,
      soilSaturation: 28,
      infiltrationCapacity: 45,
      drainageBlockage: 10,
      imperviousSurfaceRatio: 35,
      historicalReturnPeriod: 1,
      pastCrestRecord: 8.1,
    },
  },
];

export const RIVER_STATIONS: RiverStation[] = [
  {
    id: 'st-1',
    name: 'Upper Mountain Hydrometric Gauge (Station 101)',
    location: 'Alpine Ridge Catchment',
    coordinates: { x: 22, y: 18 },
    elevation: 145,
    currentStage: 4.1,
    warningStage: 5.5,
    dangerStage: 6.8,
    status: 'NORMAL',
    trend: 'RISING',
    dischargeM3s: 480,
  },
  {
    id: 'st-2',
    name: 'Midstream Valley Reservoir Gauge (Station 204)',
    location: 'Verdant Valley Sector 3',
    coordinates: { x: 48, y: 44 },
    elevation: 48,
    currentStage: 6.8,
    warningStage: 6.2,
    dangerStage: 7.0,
    status: 'WARNING',
    trend: 'RISING_FAST',
    dischargeM3s: 1420,
  },
  {
    id: 'st-3',
    name: 'Downtown Canal Confluence (Station 309)',
    location: 'Central Metro Culvert',
    coordinates: { x: 62, y: 64 },
    elevation: 16,
    currentStage: 7.2,
    warningStage: 6.5,
    dangerStage: 7.0,
    status: 'CRITICAL',
    trend: 'RISING_FAST',
    dischargeM3s: 1890,
  },
  {
    id: 'st-4',
    name: 'Lower Estuary Tidal Gate (Station 412)',
    location: 'Coastal Outlet Spillway',
    coordinates: { x: 82, y: 84 },
    elevation: 6,
    currentStage: 5.9,
    warningStage: 5.8,
    dangerStage: 6.5,
    status: 'ADVISORY',
    trend: 'RISING',
    dischargeM3s: 2150,
  },
];

export const EVACUATION_SHELTERS: EvacuationShelter[] = [
  {
    id: 'sh-1',
    name: 'North Ridge High School Complex',
    type: 'SCHOOL',
    elevationMeters: 62,
    capacityTotal: 1200,
    capacityOccupied: 450,
    coordinates: { x: 28, y: 22 },
    status: 'OPEN',
    distanceKm: 2.4,
    estimatedTransitMin: 8,
    suppliesStatus: 'PLENTIFUL',
    hasMedicalPost: true,
    hasHelipad: true,
    contactNumber: '+1 (555) 892-0191',
  },
  {
    id: 'sh-2',
    name: 'Summit Community Civic Arena',
    type: 'STADIUM',
    elevationMeters: 78,
    capacityTotal: 3500,
    capacityOccupied: 1100,
    coordinates: { x: 74, y: 26 },
    status: 'OPEN',
    distanceKm: 4.1,
    estimatedTransitMin: 14,
    suppliesStatus: 'PLENTIFUL',
    hasMedicalPost: true,
    hasHelipad: true,
    contactNumber: '+1 (555) 892-0244',
  },
  {
    id: 'sh-3',
    name: 'East Plateau Medical Pavilion',
    type: 'HOSPITAL_SAFE_ZONE',
    elevationMeters: 85,
    capacityTotal: 800,
    capacityOccupied: 680,
    coordinates: { x: 85, y: 48 },
    status: 'FILLING_FAST',
    distanceKm: 5.6,
    estimatedTransitMin: 19,
    suppliesStatus: 'ADEQUATE',
    hasMedicalPost: true,
    hasHelipad: true,
    contactNumber: '+1 (555) 892-0773',
  },
  {
    id: 'sh-4',
    name: 'West Hilltop Recreation Pavilion',
    type: 'CIVIC_CENTER',
    elevationMeters: 55,
    capacityTotal: 950,
    capacityOccupied: 220,
    coordinates: { x: 18, y: 70 },
    status: 'OPEN',
    distanceKm: 3.2,
    estimatedTransitMin: 11,
    suppliesStatus: 'PLENTIFUL',
    hasMedicalPost: false,
    hasHelipad: false,
    contactNumber: '+1 (555) 892-0518',
  },
];

export const EVACUATION_ROUTES: EvacuationRoute[] = [
  {
    id: 'rt-1',
    routeName: 'Route 12 North Expressway (Elevated Viaduct)',
    targetShelterId: 'sh-1',
    distanceKm: 2.4,
    estimatedTimeMin: 8,
    status: 'CLEAR',
    waterDepthOnRoadCm: 0,
    highestGroundElevM: 62,
    isRecommended: true,
  },
  {
    id: 'rt-2',
    routeName: 'East Ridge Parkway to Arena',
    targetShelterId: 'sh-2',
    distanceKm: 4.1,
    estimatedTimeMin: 14,
    status: 'CLEAR',
    waterDepthOnRoadCm: 3,
    highestGroundElevM: 78,
    isRecommended: true,
  },
  {
    id: 'rt-3',
    routeName: 'Riverbank Boulevard Lower Causeway',
    targetShelterId: 'sh-3',
    distanceKm: 3.8,
    estimatedTimeMin: 35,
    status: 'IMPASSABLE',
    waterDepthOnRoadCm: 72,
    highestGroundElevM: 14,
    isRecommended: false,
  },
  {
    id: 'rt-4',
    routeName: 'West Highland Avenue Arterial',
    targetShelterId: 'sh-4',
    distanceKm: 3.2,
    estimatedTimeMin: 11,
    status: 'CONGESTED',
    waterDepthOnRoadCm: 8,
    highestGroundElevM: 55,
    isRecommended: true,
  },
];

export const RESPONSE_PROTOCOLS: Record<string, DisasterResponseProtocol> = {
  LOW: {
    riskLevel: 'LOW',
    actionTitle: 'Routine Hydrological Surveillance & Data Logging',
    targetAudience: 'Internal Hydrology Operators & Weather Watchers',
    soundAlarm: false,
    civilProtectionState: 'Condition Green: Normal Operations',
    recommendedActions: [
      'Maintain continuous 15-minute sensor telemetry polling.',
      'Check reservoir intake trash racks and automated drainage pump readiness.',
      'Log baseline moisture infiltration coefficients.',
    ],
    automatedTriggers: [
      'Normal status dashboard display',
      'No public notifications required',
      'Automated daily baseline calibration report',
    ],
  },
  MODERATE: {
    riskLevel: 'MODERATE',
    actionTitle: 'Advisory Alert to Municipal Authorities & Reservoir Operators',
    targetAudience: 'City Public Works, Dam Engineers, Emergency Response Teams',
    soundAlarm: false,
    civilProtectionState: 'Condition Yellow: Standby Readiness',
    recommendedActions: [
      'Notify Municipal Civil Defense and Regional Reservoir Management.',
      'Inspect stormwater pumping stations and clear curb drain grates in low zones.',
      'Pre-position high-capacity mobile dewatering pumps in flood-prone districts.',
      'Issue advisory bulletin to construction crews along river channels.',
    ],
    automatedTriggers: [
      'Automated internal alert sent to city engineering dispatch',
      'Telemetry sampling interval increased from 15m to 2m',
      'Emergency shelter managers notified for standby readiness',
    ],
  },
  HIGH: {
    riskLevel: 'HIGH',
    actionTitle: 'Public Warning Alert to Affected Zone Residents',
    targetAudience: 'General Public in Floodplain Zones A & B, First Responders',
    soundAlarm: true,
    civilProtectionState: 'Condition Orange: Active Hazard Warning',
    recommendedActions: [
      'Broadcast targeted SMS / Cell-Broadcast geo-targeted emergency warnings.',
      'Activate warning chimes and localized siren beacons.',
      'Advise residents in single-story homes in low sectors to prepare for potential evacuation.',
      'Close low-lying river walkways, underpasses, and floodway bridges.',
      'Open designated community storm shelters on high ground for voluntary check-in.',
    ],
    automatedTriggers: [
      'Emergency Cell Broadcast push notification dispatched',
      'Local EAS crawler banner sent to regional TV & Radio stations',
      'Road transit signs updated to display "FLOOD DANGER - USE ALTERNATE ROUTE"',
    ],
  },
  CRITICAL: {
    riskLevel: 'CRITICAL',
    actionTitle: 'Mandatory Evacuation Recommendation & Emergency Shelter Activation',
    targetAudience: 'All Residents in Flood Inundation Zones, First Responders, Police, National Guard',
    soundAlarm: true,
    civilProtectionState: 'Condition Red: Maximum Emergency Evacuation',
    recommendedActions: [
      'Trigger continuous Civil Defense high-wail sirens across all affected sectors.',
      'Order mandatory evacuation of ground-floor structures in designated inundation zones.',
      'Deploy rescue boat squads, amphibious vehicles, and search & rescue teams.',
      'Direct civilian traffic along elevated viaduct corridors to designated Safe Shelters.',
      'Engage emergency auxiliary spillway gates to divert upstream surge.',
    ],
    automatedTriggers: [
      'Continuous disaster siren activation',
      'High-priority Emergency Alert System (EAS) broadcast interrupt',
      'Real-time GPS routing systems instructed to flag riverbank roads as closed',
      'Hospital standby order and emergency medical helipad activation',
    ],
  },
};
