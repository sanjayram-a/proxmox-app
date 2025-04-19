import { useState, useEffect, useCallback } from 'react';
import { VM, VMHistoricalData, VMMetricsResponse } from '../types';
import { useConfig } from './useConfig';
import api from '../services/api';
import { POLLING_INTERVALS } from '../constants';

interface VMMetrics {
  currentUsage: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  historical: VMHistoricalData;
}

const emptyHistoricalData: VMHistoricalData = {
  timestamps: [],
  cpu: [],
  memory: [],
  disk: [],
  network: [],
};

interface UseVMMetricsOptions {
  pollingInterval?: number;
  historyLength?: number;
}

export const useVMMetrics = (vm: VM, options: UseVMMetricsOptions = {}) => {
  const { pollingInterval = POLLING_INTERVALS.VM_STATUS, historyLength = 20 } =
    options;

  const [metrics, setMetrics] = useState<VMMetrics>({
    currentUsage: {
      cpu: vm.cpu_usage || 0,
      memory: vm.memory_usage || 0,
      disk: vm.disk_usage || 0,
      network: 0,
    },
    historical: emptyHistoricalData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { monitoring } = useConfig();

  const fetchMetrics = useCallback(async () => {
    if (!vm.id || vm.status !== 'RUNNING') return;

    try {
      setIsLoading(true);
      const metricsData = await api.getVMMetrics(vm.id);

      setMetrics((prev) => {
        const currentUsage = {
          cpu: metricsData.current.cpu_usage,
          memory: metricsData.current.memory_usage,
          disk: metricsData.current.disk_usage,
          network: metricsData.current.network_usage,
        };

        const timestamps = metricsData.history.map((h) => h.timestamp);
        const cpuData = metricsData.history.map((h) => h.cpu_usage);
        const memoryData = metricsData.history.map((h) => h.memory_usage);
        const diskData = metricsData.history.map((h) => h.disk_usage);
        const networkData = metricsData.history.map((h) => h.network_usage);

        // Keep only the last N entries
        const newHistorical = {
          timestamps: timestamps.slice(-historyLength),
          cpu: cpuData.slice(-historyLength),
          memory: memoryData.slice(-historyLength),
          disk: diskData.slice(-historyLength),
          network: networkData.slice(-historyLength),
        };

        return {
          currentUsage,
          historical: newHistorical,
        };
      });

      setError(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch VM metrics';
      setError(message);
      console.error('Error fetching VM metrics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [vm.id, vm.status, historyLength]);

  useEffect(() => {
    // Initial fetch
    fetchMetrics();

    // Set up polling if VM is running
    let intervalId: NodeJS.Timeout | null = null;
    if (vm.status === 'RUNNING' && pollingInterval > 0) {
      intervalId = setInterval(fetchMetrics, pollingInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [vm.status, pollingInterval, fetchMetrics]);

  const clearHistory = useCallback(() => {
    setMetrics((prev) => ({
      ...prev,
      historical: emptyHistoricalData,
    }));
  }, []);

  return {
    metrics,
    isLoading,
    error,
    fetchMetrics,
    clearHistory,
    pollingEnabled: vm.status === 'RUNNING' && pollingInterval > 0,
  };
};

export type UseVMMetricsReturn = ReturnType<typeof useVMMetrics>;

export default useVMMetrics;
