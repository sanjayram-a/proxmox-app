// VM Status Enum
export enum VMStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  SUSPENDED = 'SUSPENDED',
  FAILED = 'FAILED',
}

// VM Type Enum
export enum VMType {
  KVM = 'KVM',
  LXC = 'LXC',
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/me',
  },
  VM: {
    BASE: '/vm',
    ACTION: (id: number) => `/vm/${id}/action`,
  },
};

// Status Colors
export const STATUS_COLORS = {
  [VMStatus.RUNNING]: 'success',
  [VMStatus.STOPPED]: 'error',
  [VMStatus.SUSPENDED]: 'warning',
  [VMStatus.FAILED]: 'error',
} as const;

// Status Labels
export const STATUS_LABELS = {
  [VMStatus.RUNNING]: 'Running',
  [VMStatus.STOPPED]: 'Stopped',
  [VMStatus.SUSPENDED]: 'Suspended',
  [VMStatus.FAILED]: 'Failed',
} as const;

// VM Type Labels
export const VM_TYPE_LABELS = {
  [VMType.KVM]: 'KVM Virtual Machine',
  [VMType.LXC]: 'LXC Container',
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  REQUIRED: { required: true, message: 'This field is required' },
  USERNAME: {
    pattern: /^[a-zA-Z0-9_-]{3,20}$/,
    message:
      'Username must be 3-20 characters and can contain letters, numbers, underscores, and hyphens',
  },
  PASSWORD: {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    message:
      'Password must be at least 8 characters and contain at least one letter and one number',
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
};

// Resource Limits
export const RESOURCE_LIMITS = {
  CPU: {
    MIN: 1,
    MAX: 16,
    DEFAULT: 1,
  },
  MEMORY: {
    MIN: 512, // MB
    MAX: 65536, // MB (64GB)
    DEFAULT: 1024, // MB
  },
  DISK: {
    MIN: 5, // GB
    MAX: 2048, // GB (2TB)
    DEFAULT: 20, // GB
  },
};

// Polling Intervals (in milliseconds)
export const POLLING_INTERVALS = {
  VM_STATUS: 10000, // 10 seconds
  RESOURCE_USAGE: 30000, // 30 seconds
};

// Chart Colors
export const CHART_COLORS = {
  CPU: '#2196f3',
  MEMORY: '#4caf50',
  DISK: '#ff9800',
  NETWORK: '#9c27b0',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY HH:mm:ss',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  VM_CREATED: 'Virtual machine created successfully',
  VM_UPDATED: 'Virtual machine updated successfully',
  VM_DELETED: 'Virtual machine deleted successfully',
  VM_STARTED: 'Virtual machine started successfully',
  VM_STOPPED: 'Virtual machine stopped successfully',
  VM_RESTARTED: 'Virtual machine restarted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  VMS: '/vms',
  VM_DETAIL: (id: number) => `/vms/${id}`,
  PROFILE: '/profile',
} as const;
