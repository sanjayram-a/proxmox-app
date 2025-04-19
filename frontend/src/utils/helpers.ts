import { VMStatus, VMType } from '../constants';

// Format bytes to human readable format
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${
    sizes[i]
  }`;
};

// Format memory in MB to human readable format
export const formatMemory = (memoryMB: number): string => {
  return formatBytes(memoryMB * 1024 * 1024);
};

// Format percentage
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Get color for resource usage
export const getResourceColor = (percentage: number): string => {
  if (percentage >= 90) return 'error';
  if (percentage >= 75) return 'warning';
  if (percentage >= 50) return 'info';
  return 'success';
};

// Format date
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleString();
};

// Format duration in seconds to readable format
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

// Generate random MAC address
export const generateMacAddress = (): string => {
  const hexDigits = '0123456789ABCDEF';
  const macBytes = Array.from({ length: 6 }, () =>
    Array.from(
      { length: 2 },
      () => hexDigits[Math.floor(Math.random() * 16)]
    ).join('')
  );
  return macBytes.join(':');
};

// Check if string is valid IP address
export const isValidIpAddress = (ip: string): boolean => {
  const regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
};

// Check if VM is in modifiable state
export const isVMModifiable = (status: VMStatus): boolean => {
  return status === VMStatus.STOPPED;
};

// Check if VM is in running state
export const isVMRunning = (status: VMStatus): boolean => {
  return status === VMStatus.RUNNING;
};

// Get available VM actions based on current status
export const getAvailableActions = (status: VMStatus): string[] => {
  switch (status) {
    case VMStatus.RUNNING:
      return ['stop', 'restart', 'suspend'];
    case VMStatus.STOPPED:
      return ['start'];
    case VMStatus.SUSPENDED:
      return ['start', 'stop'];
    case VMStatus.FAILED:
      return ['start'];
    default:
      return [];
  }
};

// Get VM type display name
export const getVMTypeName = (type: VMType): string => {
  switch (type) {
    case VMType.KVM:
      return 'KVM Virtual Machine';
    case VMType.LXC:
      return 'LXC Container';
    default:
      return 'Unknown';
  }
};

// Parse error message from API response
export const parseErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error.response?.data?.detail) return error.response.data.detail;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

// Generate random string
export const generateRandomString = (length: number): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Debounce function
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Throttle function
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  let lastCalled = 0;

  return (...args: Parameters<F>): void => {
    const now = Date.now();
    if (lastCalled + waitFor <= now) {
      func(...args);
      lastCalled = now;
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func(...args);
        lastCalled = Date.now();
        timeout = null;
      }, waitFor - (now - lastCalled));
    }
  };
};
