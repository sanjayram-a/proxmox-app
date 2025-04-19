// Metrics data types
export interface VMMetricsResponse {
  current: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_usage: number;
    timestamp: string;
  };
  historical?: {
    timestamps: string[];
    cpu_usage: number[];
    memory_usage: number[];
    disk_usage: number[];
    network_usage: number[];
  };
}

export interface VMHistoricalData {
  timestamps: string[];
  cpu: number[];
  memory: number[];
  disk: number[];
}

export interface VMMetricsState {
  currentUsage: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  historical: VMHistoricalData;
}

export interface ResourceMetrics {
  usage: number;
  total: number;
  available: number;
  percentage: number;
}

export interface DetailedVMMetrics {
  cpu: ResourceMetrics;
  memory: ResourceMetrics;
  disk: ResourceMetrics;
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
  uptime: number;
  lastUpdated: string;
}

// Polling configuration
export interface MetricsPollingConfig {
  enabled: boolean;
  interval: number;
  historyLength: number;
}

// Chart configuration
export interface MetricsChartConfig {
  showLegend: boolean;
  showGrid: boolean;
  animations: boolean;
  timeFormat: string;
  tooltips: boolean;
}

// Resource thresholds
export interface ResourceThresholds {
  warning: number;
  critical: number;
}

export interface MetricsThresholds {
  cpu: ResourceThresholds;
  memory: ResourceThresholds;
  disk: ResourceThresholds;
}

// Default values
export const DEFAULT_THRESHOLDS: MetricsThresholds = {
  cpu: {
    warning: 75,
    critical: 90,
  },
  memory: {
    warning: 80,
    critical: 95,
  },
  disk: {
    warning: 85,
    critical: 95,
  },
};

export const DEFAULT_CHART_CONFIG: MetricsChartConfig = {
  showLegend: true,
  showGrid: true,
  animations: true,
  timeFormat: 'HH:mm:ss',
  tooltips: true,
};
