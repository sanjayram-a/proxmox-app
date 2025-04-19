import { useEffect } from 'react';
// Remove plain useDispatch/useSelector
// import { useDispatch, useSelector } from 'react-redux';
// Import the typed hooks
import { useAppDispatch, useAppSelector } from '../store/hooks'; // Adjust path if needed
// Import necessary types (ensure ApiError and VMActionData are included if used implicitly via thunks)
import {
  RootState,
  VMCreateData,
  VMUpdateData,
  VM,
  ApiError,
  VMActionData,
} from '../types';
import {
  fetchVMs,
  createVM,
  performVMAction,
  selectVM,
} from '../store/slices/vmSlice';
import api from '../services/api';

export const useVirtualMachines = () => {
  // Use the typed hooks
  const dispatch = useAppDispatch();
  const { vms, selectedVM, isLoading, error } = useAppSelector(
    // Explicit state type often not needed with useAppSelector, but safe to keep
    (state: RootState) => state.vm
  );

  useEffect(() => {
    // Dispatch call should now be type-safe
    dispatch(fetchVMs());
    // Removed dispatch dependency if fetchVMs doesn't change, keep if lint requires
  }, [dispatch]);

  const getVMStats = () => {
    const totalVMs = vms.length;
    // Status check uses uppercase 'RUNNING', consistent with previous findings
    const runningVMs = vms.filter((vm) => vm.status === 'RUNNING').length;
    const totalCPUs = vms.reduce((sum, vm) => sum + vm.cpu_cores, 0);
    const totalMemory = vms.reduce((sum, vm) => sum + vm.memory_mb, 0);
    const totalStorage = vms.reduce((sum, vm) => sum + vm.disk_size, 0);

    // Avoid division by zero
    const safeTotalVMs = totalVMs > 0 ? totalVMs : 1;
    const avgCPUUsage =
      vms.reduce((sum, vm) => sum + vm.cpu_usage, 0) / safeTotalVMs;
    const avgMemoryUsage =
      vms.reduce((sum, vm) => sum + vm.memory_usage, 0) / safeTotalVMs;
    const avgDiskUsage =
      vms.reduce((sum, vm) => sum + vm.disk_usage, 0) / safeTotalVMs;

    return {
      totalVMs,
      runningVMs,
      totalCPUs,
      totalMemory,
      totalStorage,
      avgCPUUsage,
      avgMemoryUsage,
      avgDiskUsage,
    };
  };

  const createNewVM = async (data: VMCreateData) => {
    try {
      // Dispatch calls should now be type-safe
      await dispatch(createVM(data)).unwrap();
      dispatch(fetchVMs());
    } catch (error) {
      console.error('Failed to create VM Hook:', error);
      throw error; // Re-throw for UI layer
    }
  };

  const updateVM = async (vmId: number, data: VMUpdateData) => {
    try {
      await api.updateVM(vmId, data); // Assumes direct API call is fine here
      // Dispatch call should now be type-safe
      dispatch(fetchVMs()); // Refresh list
    } catch (error) {
      console.error('Failed to update VM Hook:', error);
      throw error; // Re-throw for UI layer
    }
  };

  // Helper for VM actions
  const runVMAction = async (vmId: number, action: VMActionData['action']) => {
    try {
      // Dispatch call should now be type-safe
      await dispatch(performVMAction({ vmId, action })).unwrap();
    } catch (error) {
      console.error(`Failed to ${action} VM (ID: ${vmId}) Hook:`, error);
      throw error; // Re-throw for UI layer
    }
  };

  // Specific action functions calling the helper
  const startVM = (vmId: number) => runVMAction(vmId, 'start');
  const stopVM = (vmId: number) => runVMAction(vmId, 'stop');
  const restartVM = (vmId: number) => runVMAction(vmId, 'restart');
  // Add suspend if needed: const suspendVM = (vmId: number) => runVMAction(vmId, 'suspend');

  const deleteVM = async (vmId: number) => {
    try {
      await api.deleteVM(vmId); // Direct API call
      // Dispatch call should now be type-safe
      dispatch(fetchVMs()); // Refresh list
    } catch (error) {
      console.error('Failed to delete VM Hook:', error);
      throw error; // Re-throw for UI layer
    }
  };

  // This dispatches a synchronous action, should already work but benefits from typed dispatch
  const setSelectedVM = (vm: VM | null) => {
    dispatch(selectVM(vm));
  };

  return {
    vms,
    selectedVM,
    isLoading,
    error,
    stats: getVMStats(),
    createVM: createNewVM, // Renamed for clarity in export
    updateVM,
    startVM,
    stopVM,
    restartVM,
    // suspendVM, // Export if implemented
    deleteVM,
    setSelectedVM,
  };
};

// Optional: Remove default export if named export is preferred convention
// export default useVirtualMachines;
