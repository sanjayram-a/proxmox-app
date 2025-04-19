import { useState, useCallback } from 'react';
import { VM } from '../types';
import { useConfig } from './useConfig';
import { useNotification } from '../components/Notifications';

interface ConsoleSessionState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

interface ConsoleConnectionDetails {
  protocol: 'vnc' | 'rdp' | 'ssh';
  connectionString: string;
}

export const useConsoleSession = (vm: VM) => {
  const [state, setState] = useState<ConsoleSessionState>({
    isConnected: false,
    isLoading: false,
    error: null,
  });
  const { guacamoleUrl } = useConfig();
  const { showError } = useNotification();

  const getConnectionDetails = useCallback((): ConsoleConnectionDetails => {
    // Determine protocol based on VM type and enabled protocols
    let protocol: 'vnc' | 'rdp' | 'ssh';
    if (vm.vm_type === 'KVM' && vm.rdp_enabled) {
      protocol = 'rdp';
    } else if (vm.ssh_enabled) {
      protocol = 'ssh';
    } else {
      protocol = 'vnc';
    }

    // Build connection string based on protocol
    const params = new URLSearchParams({
      token: vm.id.toString(),
      hostname: vm.ip_address || '',
    });

    switch (protocol) {
      case 'rdp':
        params.append('port', vm.rdp_port?.toString() || '3389');
        break;
      case 'ssh':
        params.append('port', vm.ssh_port?.toString() || '22');
        break;
      case 'vnc':
        params.append('port', '5900');
        break;
    }

    return {
      protocol,
      connectionString: params.toString(),
    };
  }, [vm]);

  const connect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    // Connection is handled by the RemoteConsole component
    // This hook just manages the state
  }, []);

  const disconnect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isConnected: false,
      isLoading: false,
    }));
  }, []);

  const handleError = useCallback(
    (error: string) => {
      setState((prev) => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error,
      }));
      showError(error);
    },
    [showError]
  );

  const handleConnected = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isConnected: true,
      isLoading: false,
      error: null,
    }));
  }, []);

  const sendCtrlAltDel = useCallback(() => {
    // This will be implemented in the RemoteConsole component
    // Here we just provide the interface
  }, []);

  const takeScreenshot = useCallback(() => {
    // This will be implemented in the RemoteConsole component
    // Here we just provide the interface
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    handleError,
    handleConnected,
    sendCtrlAltDel,
    takeScreenshot,
    connectionDetails: getConnectionDetails(),
    guacamoleUrl,
  };
};

export type UseConsoleSessionReturn = ReturnType<typeof useConsoleSession>;

export default useConsoleSession;
