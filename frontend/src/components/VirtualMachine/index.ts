import VMCard from './VMCard';
import VMActions from './VMActions';
import VMStats from './VMStats';
import CreateVMDialog from './CreateVMDialog';
import ConsoleViewer from './ConsoleViewer';

export { VMCard, VMActions, VMStats, CreateVMDialog, ConsoleViewer };

// Export common types
export interface VMActionsHandlers {
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  onSuspend?: () => void;
  onDelete?: () => void;
  onOpenConsole?: () => void;
  onOpenSettings?: () => void;
}

export interface VMHistoricalData {
  timestamps: string[];
  cpu: number[];
  memory: number[];
  disk: number[];
}

// Example usage:
/*
import {
  VMCard,
  VMActions,
  VMStats,
  ConsoleViewer,
  CreateVMDialog,
  type VMActionsHandlers,
} from '@/components/VirtualMachine';

const MyComponent: React.FC = () => {
  const {
    vm,
    historicalData,
    isLoading,
    startVM,
    stopVM,
    restartVM,
    suspendVM,
    deleteVM,
  } = useVirtualMachines();

  const [consoleOpen, setConsoleOpen] = useState(false);

  const handlers: VMActionsHandlers = {
    onStart: startVM,
    onStop: stopVM,
    onRestart: restartVM,
    onSuspend: suspendVM,
    onDelete: deleteVM,
    onOpenConsole: () => setConsoleOpen(true),
  };

  return (
    <div>
      <VMCard
        vm={vm}
        {...handlers}
        isLoading={isLoading}
      />

      <VMActions
        vm={vm}
        {...handlers}
        isLoading={isLoading}
        variant="menu"
      />

      <VMStats
        vm={vm}
        historicalData={historicalData}
        showCharts={true}
      />

      <ConsoleViewer
        open={consoleOpen}
        onClose={() => setConsoleOpen(false)}
        vm={vm}
      />

      <CreateVMDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </div>
  );
};
*/
