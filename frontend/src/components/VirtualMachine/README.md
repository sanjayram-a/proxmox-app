# Virtual Machine Components

This directory contains React components for managing and displaying virtual machines in the Lab Management System.

## Components

### VMCard

A card component that displays a virtual machine's basic information and provides quick access to common actions.

```tsx
import { VMCard } from '@/components/VirtualMachine';

<VMCard
  vm={virtualMachine}
  onStart={handleStart}
  onStop={handleStop}
  onRestart={handleRestart}
  onSuspend={handleSuspend}
  onDelete={handleDelete}
  onOpenConsole={handleOpenConsole}
  isLoading={isLoading}
/>;
```

### VMActions

A component that provides a consistent way to display and handle virtual machine actions.

```tsx
import { VMActions } from '@/components/VirtualMachine';

<VMActions
  vm={virtualMachine}
  onStart={handleStart}
  onStop={handleStop}
  onRestart={handleRestart}
  onSuspend={handleSuspend}
  onDelete={handleDelete}
  isLoading={isLoading}
  variant="menu" // or "icons"
/>;
```

### VMStats

A component that displays virtual machine resource usage statistics with optional historical charts.

```tsx
import { VMStats } from '@/components/VirtualMachine';

<VMStats
  vm={virtualMachine}
  historicalData={{
    timestamps: ['12:00', '12:05', '12:10'],
    cpu: [25, 30, 35],
    memory: [45, 48, 50],
    disk: [60, 60, 61],
  }}
  showCharts={true}
/>;
```

### CreateVMDialog

A dialog component for creating new virtual machines.

```tsx
import { CreateVMDialog } from '@/components/VirtualMachine';

<CreateVMDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />;
```

## Props

### Common Props Types

```typescript
interface VM {
  id: number;
  name: string;
  status: VMStatus;
  vm_type: VMType;
  cpu_cores: number;
  memory_mb: number;
  disk_size: number;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  ip_address?: string;
  mac_address?: string;
}

interface VMActionsProps {
  vm: VM;
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  onSuspend?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  variant?: 'icons' | 'menu';
}

interface VMStatsProps {
  vm: VM;
  historicalData?: {
    timestamps: string[];
    cpu: number[];
    memory: number[];
    disk: number[];
  };
  showCharts?: boolean;
}
```

## Usage Guidelines

1. Always handle loading states appropriately using the `isLoading` prop.
2. Use error boundaries to handle component errors gracefully.
3. Consider using the `variant` prop in VMActions to switch between icon and menu views based on available space.
4. When using VMStats, historical data is optional but recommended for better monitoring.

## Example Integration

```tsx
import {
  VMCard,
  VMActions,
  VMStats,
  CreateVMDialog,
} from '@/components/VirtualMachine';
import { useVirtualMachines } from '@/hooks/useVirtualMachines';

const VirtualMachineView: React.FC = () => {
  const { vm, isLoading, startVM, stopVM, restartVM, suspendVM, deleteVM } =
    useVirtualMachines();

  return (
    <div>
      <VMCard
        vm={vm}
        onStart={startVM}
        onStop={stopVM}
        onRestart={restartVM}
        onSuspend={suspendVM}
        onDelete={deleteVM}
        isLoading={isLoading}
      />

      <VMStats vm={vm} showCharts={true} />
    </div>
  );
};
```
