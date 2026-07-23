export type NavigationSection =
  | 'executive'
  | 'analytics'
  | 'monitoring'
  | 'intelligence'
  | 'reports'
  | 'administration'
  | 'settings';

export type ExecutiveSubTab = 'kpi' | 'insights' | 'trends' | 'activity';
export type AnalyticsSubTab = 'performance' | 'department' | 'sla' | 'forecast' | 'ai';
export type MonitoringSubTab = 'live' | 'tracking' | 'alerts' | 'risk';
export type IntelligenceSubTab = 'search' | 'pekeliling' | 'assistant' | 'knowledge';
export type ReportsSubTab = 'dashboard' | 'pdf' | 'excel' | 'scheduled' | 'historical';
export type AdminSubTab = 'users' | 'roles' | 'permissions' | 'audit';
export type SettingsSubTab = 'general' | 'notifications' | 'integrations' | 'security' | 'theme';

export interface SSRTrendItem {
  year: number;
  rice: number;
  poultry: number;
  beef: number;
  mutton: number;
  fish: number;
  vegetables: number;
  fruits: number;
}

export interface CommodityShare {
  name: string;
  localProduction: number; // Peratusan
  importShare: number; // Peratusan
  totalTonnage: number; // Tan Metrik
  importValueMYR: number; // RM Juta
  category: 'Tanaman' | 'Ternakan' | 'Perikanan';
}

export interface RegionalPriceData {
  state: string;
  code: string;
  cpiIndex: number; // Asas 100
  paddyYieldHa: number; // Tan/hektar
  deliveryDays: number; // Hari Ladang ke Pasaran
  poultryPriceMYR: number; // per kg
  beefPriceMYR: number; // per kg
  ricePriceMYR: number; // per 10kg
  lat: number;
  lng: number;
  riskStatus: 'Rendah' | 'Sederhana' | 'Tinggi';
}

export interface LandUseData {
  category: string;
  paddyHa: number;
  oilPalmHa: number;
  rubberHa: number;
  fruitVegHa: number;
  waterUsageM3: number;
  carbonImpactIndex: number;
}

export interface IgfmasEntry {
  id: string;
  referenceCode: string;
  department: 'KPKM.gov.my' | 'open.dosm.gov.my' | 'data.gov.my' | 'Open Data MATRADE' | 'MARDI';
  commodity: string;
  financialYear: number;
  allocatedBudgetMYR: number; // RM Juta
  actualSpentMYR: number; // RM Juta
  yieldPerHectare: number;
  productionTonnage: number;
  ssrImpact: number; // Perubahan %
  status: 'Disahkan' | 'Dalam Semakan' | 'Draf';
  lastUpdated: string;
}

export interface PekelilingItem {
  id: string;
  title: string;
  referenceCode: string;
  datePublished: string;
  category: 'Dasar Negara' | 'Subsidi & Bantuan' | 'Prosedur Operasi Standard' | 'Pekeliling Dagangan';
  summary: string;
  downloadUrl: string;
  status: 'Aktif' | 'Dalam Semakan' | 'Diarkibkan';
  tags: string[];
}

export interface AlertItem {
  id: string;
  title: string;
  severity: 'Kritikal' | 'Amaran' | 'Info';
  location: string;
  timestamp: string;
  category: 'Rantai Bekalan' | 'Cuaca & Monsoi' | 'Kenaikan Harga' | 'Kawalan Penyakit';
  description: string;
  actionRequired: string;
}

export interface AgromakananGdpData {
  subsector: string;
  value2019: number; // RM Juta
  share2019: number; // %
  value2021: number; // RM Juta
  share2021: number; // %
  value2022: number; // RM Juta
  share2022: number; // %
  growth2022: number; // % YoY
}

export interface AgriExportCountryData {
  rank: number;
  country: string;
  value2021MYR: number; // RM'000
  share2021: number; // %
  value2022MYR: number; // RM'000
  share2022: number; // %
  growthPercent: number; // %
}

export interface ActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  timestamp: string;
  systemModule: string;
  status: 'Berjaya' | 'Gagal' | 'Amaran';
}

export interface AIInsightResponse {
  insight: string;
  riskLevel: 'Rendah' | 'Sederhana' | 'Tinggi' | 'Kritikal';
  recommendations: string[];
  keyMetricAlerts?: string[];
  confidenceScore: number;
}
