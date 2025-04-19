interface Config {
  api: {
    baseUrl: string;
    guacamoleUrl: string;
  };
  features: {
    enableConsoleAccess: boolean;
    enableFileTransfer: boolean;
  };
  auth: {
    tokenExpireDays: number;
  };
  monitoring: {
    statsRefreshInterval: number;
    vmStatusRefreshInterval: number;
  };
  debug: boolean;
}

const config: Config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    guacamoleUrl:
      process.env.REACT_APP_GUACAMOLE_URL || 'http://localhost:8080/guacamole',
  },
  features: {
    enableConsoleAccess: process.env.REACT_APP_ENABLE_CONSOLE_ACCESS === 'true',
    enableFileTransfer: process.env.REACT_APP_ENABLE_FILE_TRANSFER === 'true',
  },
  auth: {
    tokenExpireDays: parseInt(
      process.env.REACT_APP_TOKEN_EXPIRE_DAYS || '7',
      10
    ),
  },
  monitoring: {
    statsRefreshInterval: parseInt(
      process.env.REACT_APP_STATS_REFRESH_INTERVAL || '30000',
      10
    ),
    vmStatusRefreshInterval: parseInt(
      process.env.REACT_APP_VM_STATUS_REFRESH_INTERVAL || '10000',
      10
    ),
  },
  debug: process.env.REACT_APP_DEBUG === 'true',
};

export const getConfig = (): Config => config;

// Utility functions for common config operations
export const isDebugMode = (): boolean => config.debug;

export const getApiUrl = (): string => config.api.baseUrl;

export const getGuacamoleUrl = (): string => config.api.guacamoleUrl;

export const getRefreshIntervals = (): {
  stats: number;
  vmStatus: number;
} => ({
  stats: config.monitoring.statsRefreshInterval,
  vmStatus: config.monitoring.vmStatusRefreshInterval,
});

export const getFeatureFlags = (): {
  consoleAccess: boolean;
  fileTransfer: boolean;
} => ({
  consoleAccess: config.features.enableConsoleAccess,
  fileTransfer: config.features.enableFileTransfer,
});

export default config;
