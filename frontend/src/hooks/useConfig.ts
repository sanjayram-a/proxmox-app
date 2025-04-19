import { useMemo } from 'react';
import config, { getConfig } from '../config';

interface UseConfigResult {
  apiUrl: string;
  guacamoleUrl: string;
  debug: boolean;
  features: {
    enableConsoleAccess: boolean;
    enableFileTransfer: boolean;
  };
  monitoring: {
    statsRefreshInterval: number;
    vmStatusRefreshInterval: number;
  };
}

export const useConfig = (): UseConfigResult => {
  return useMemo(
    () => ({
      apiUrl: getConfig().api.baseUrl,
      guacamoleUrl: getConfig().api.guacamoleUrl,
      debug: getConfig().debug,
      features: {
        enableConsoleAccess: getConfig().features.enableConsoleAccess,
        enableFileTransfer: getConfig().features.enableFileTransfer,
      },
      monitoring: {
        statsRefreshInterval: getConfig().monitoring.statsRefreshInterval,
        vmStatusRefreshInterval: getConfig().monitoring.vmStatusRefreshInterval,
      },
    }),
    []
  );
};

// Helper functions for common config checks
export const useFeatureFlags = () => {
  const { features } = useConfig();
  return features;
};

export const useMonitoringConfig = () => {
  const { monitoring } = useConfig();
  return monitoring;
};

export const useDebugMode = () => {
  const { debug } = useConfig();
  return debug;
};

export default useConfig;
