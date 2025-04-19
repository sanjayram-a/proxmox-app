import React, { useEffect, useState } from 'react';
// FIX: Add Tooltip import
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  MenuItem,
  Chip,
  Tooltip, // <-- Import Tooltip
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RestartIcon,
  Pause as SuspendIcon,
  Delete as DeleteIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
// FIX: Adjust path if your hooks file is elsewhere
import { useAppDispatch, useAppSelector } from '../store/hooks';
// Import types
import { RootState } from '../store'; // Adjust path if needed
// FIX: Remove VMAction import if not exported, import VMActionData
import { VM, VMType, VMCreateData, ApiError, VMActionData } from '../types';
import { fetchVMs, createVM, performVMAction } from '../store/slices/vmSlice';

const VirtualMachines: React.FC = () => {
  const dispatch = useAppDispatch();
  // FIX: Explicitly type state parameter
  const { vms, isLoading, error } = useAppSelector(
    (state: RootState) => state.vm
  );
  const [openCreate, setOpenCreate] = useState(false);

  // State for the creation dialog, typed correctly
  const [newVM, setNewVM] = useState<VMCreateData>({
    name: '',
    // FIX: Use enum member for default value
    vm_type: VMType.KVM,
    cpu_cores: 1,
    memory_mb: 1024,
    disk_size: 10,
  });

  useEffect(() => {
    dispatch(fetchVMs());
  }, [dispatch]);

  const handleCreateVMCancel = () => {
    setOpenCreate(false);
    // Reset form on cancel
    setNewVM({
      name: '',
      // FIX: Use enum member for default value
      vm_type: VMType.KVM,
      cpu_cores: 1,
      memory_mb: 1024,
      disk_size: 10,
    });
  };

  const handleCreateVMSubmit = () => {
    dispatch(createVM(newVM));
    handleCreateVMCancel(); // Close and reset form
  };

  // FIX: Use VMActionData['action'] for the type
  const handleVMAction = (vmId: number, action: VMActionData['action']) => {
    dispatch(performVMAction({ vmId, action }));
  };

  // Get status color (ensure status strings match your actual data/VMStatus type)
  const getStatusColor = (
    status: string
  ): 'success' | 'error' | 'warning' | 'default' => {
    const colors: Record<string, 'success' | 'error' | 'warning' | 'default'> =
      {
        RUNNING: 'success', // Assuming uppercase status strings
        STOPPED: 'error',
        SUSPENDED: 'warning',
        FAILED: 'error',
      };
    return colors[status] || 'default';
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Virtual Machines
        </Typography>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create VM
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error" variant="body2" role="alert">
            Error: {error.message}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {vms.map((vm: VM) => (
          <Grid item xs={12} sm={6} md={4} key={vm.id}>
            <Card
              sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ComputerIcon sx={{ mr: 1, color: 'action.active' }} />
                  <Typography
                    variant="h6"
                    component="div"
                    noWrap
                    title={vm.name}
                  >
                    {vm.name}
                  </Typography>
                </Box>
                <Chip
                  label={vm.status}
                  color={getStatusColor(vm.status)}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type: {vm.vm_type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CPU: {vm.cpu_cores} cores ({Math.round(vm.cpu_usage)}% used)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Memory: {vm.memory_mb} MB ({Math.round(vm.memory_usage)}%
                  used)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Disk: {vm.disk_size} GB ({Math.round(vm.disk_usage)}% used)
                </Typography>
                {vm.ip_address && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    IP: {vm.ip_address}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                {vm.status !== 'RUNNING' && (
                  <Tooltip title="Start">
                    <IconButton
                      onClick={() => handleVMAction(vm.id, 'start')}
                      color="success"
                      disabled={isLoading}
                      size="small"
                    >
                      <StartIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {vm.status === 'RUNNING' && (
                  <>
                    <Tooltip title="Stop">
                      <IconButton
                        onClick={() => handleVMAction(vm.id, 'stop')}
                        color="error"
                        disabled={isLoading}
                        size="small"
                      >
                        <StopIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Restart">
                      <IconButton
                        onClick={() => handleVMAction(vm.id, 'restart')}
                        color="primary"
                        disabled={isLoading}
                        size="small"
                      >
                        <RestartIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Suspend">
                      <IconButton
                        onClick={() => handleVMAction(vm.id, 'suspend')}
                        color="warning"
                        disabled={isLoading}
                        size="small"
                      >
                        <SuspendIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => handleVMAction(vm.id, 'delete')}
                    color="error"
                    disabled={isLoading}
                    size="small"
                    sx={{ ml: 'auto' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {!isLoading && vms.length === 0 && (
          <Grid item xs={12}>
            <Typography
              sx={{ textAlign: 'center', mt: 4 }}
              color="text.secondary"
            >
              No virtual machines found. Click "Create VM" to add one.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Create VM Dialog */}
      <Dialog open={openCreate} onClose={handleCreateVMCancel}>
        <DialogTitle>Create New Virtual Machine</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={newVM.name}
            onChange={(e) => setNewVM({ ...newVM, name: e.target.value })}
            required
          />
          <TextField
            select
            margin="dense"
            label="Type"
            fullWidth
            variant="outlined"
            value={newVM.vm_type}
            // Keep the cast here. While the value should be an enum member,
            // e.target.value from the DOM event is always a string.
            // Casting tells TS we expect it to be a string corresponding to a VMType member.
            onChange={(e) =>
              setNewVM({ ...newVM, vm_type: e.target.value as VMType })
            }
            required
          >
            {/* FIX: Use enum members for values */}
            <MenuItem value={VMType.KVM}>KVM</MenuItem>
            <MenuItem value={VMType.LXC}>LXC</MenuItem>
          </TextField>
          <TextField
            type="number"
            margin="dense"
            label="CPU Cores"
            fullWidth
            variant="outlined"
            value={newVM.cpu_cores}
            onChange={(e) =>
              setNewVM({
                ...newVM,
                cpu_cores: parseInt(e.target.value, 10) || 1,
              })
            }
            required
            inputProps={{ min: 1 }}
          />
          <TextField
            type="number"
            margin="dense"
            label="Memory (MB)"
            fullWidth
            variant="outlined"
            value={newVM.memory_mb}
            onChange={(e) =>
              setNewVM({
                ...newVM,
                memory_mb: parseInt(e.target.value, 10) || 512,
              })
            }
            required
            inputProps={{ min: 512, step: 512 }}
          />
          <TextField
            type="number"
            margin="dense"
            label="Disk Size (GB)"
            fullWidth
            variant="outlined"
            value={newVM.disk_size}
            onChange={(e) =>
              setNewVM({
                ...newVM,
                disk_size: parseInt(e.target.value, 10) || 10,
              })
            }
            required
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateVMCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleCreateVMSubmit}
            variant="contained"
            disabled={!newVM.name}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VirtualMachines;
