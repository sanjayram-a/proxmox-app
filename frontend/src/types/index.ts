import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export type RootState = {
  auth: {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: ApiError | null;
  };
  vm: {
    vms: VM[];
    selectedVM: VM | null;
    isLoading: boolean;
    error: ApiError | null;
  };
};

export type AppThunk<ReturnType = void> = ThunkAction<
  Promise<ReturnType>,
  RootState,
  unknown,
  Action<string>
>;

export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>;

export interface ThunkConfig {
  /** return value when rejected */
  rejectValue: ApiError;
  /** state type */
  state: RootState;
}

export enum VMType {
  KVM = 'KVM',
  LXC = 'LXC',
}

export type VMStatus = 'RUNNING' | 'STOPPED' | 'SUSPENDED' | 'FAILED';

export interface VM {
  id: number;
  name: string;
  vm_type: VMType;
  status: VMStatus;
  proxmox_id: number;
  proxmox_node: string;
  cpu_cores: number;
  memory_mb: number;
  disk_size: number;
  ip_address?: string;
  mac_address?: string;
  rdp_enabled: boolean;
  ssh_enabled: boolean;
  ssh_port?: number;
  rdp_port?: number;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  owner_id: number;
  owner_name?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface VMUpdateData {
  name?: string;
  cpu_cores?: number;
  memory_mb?: number;
  disk_size?: number;
  rdp_enabled?: boolean;
  ssh_enabled?: boolean;
}

export interface VMActionData {
  action: 'start' | 'stop' | 'restart' | 'suspend' | 'delete';
}

export interface ProfileUpdateData {
  email?: string;
  fullName?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface VMCreateData {
  name: string;
  vm_type: VMType;
  cpu_cores: number;
  memory_mb: number;
  disk_size: number;
  rdp_enabled?: boolean;
  ssh_enabled?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  fullName?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: ApiError | null;
}

export interface VMState {
  vms: VM[];
  selectedVM: VM | null;
  isLoading: boolean;
  error: ApiError | null;
}

export interface VMMetricsResponse {
  current: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_usage: number;
  };
  history: Array<{
    timestamp: string;
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_usage: number;
  }>;
}

export interface VMHistoricalData {
  timestamps: string[];
  cpu: number[];
  memory: number[];
  disk: number[];
  network: number[];
}

export interface AsyncThunkConfig {
  rejectValue: ApiError;
  state: { auth: AuthState; vm: VMState };
}
