import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RestartIcon,
  Pause as SuspendIcon,
  Delete as DeleteIcon,
  DesktopWindows as ConsoleIcon, // Corrected Icon
  Terminal as TerminalIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// Confirmed assumption: VMStatus is a TYPE ALIAS like: type VMStatus = 'RUNNING' | 'STOPPED' | ...
import { VM, VMStatus, VMType } from '../../types';
import { STATUS_COLORS, VM_TYPE_LABELS } from '../../constants';
import { formatMemory, formatPercentage } from '../../utils/helpers';

interface VMCardProps {
  vm: VM;
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  onSuspend?: () => void;
  onDelete?: () => void;
  onOpenConsole?: () => void;
  onOpenSettings?: () => void;
  isLoading?: boolean;
}

const VMCard: React.FC<VMCardProps> = ({
  vm,
  onStart,
  onStop,
  onRestart,
  onSuspend,
  onDelete,
  onOpenConsole,
  onOpenSettings,
  isLoading = false,
}) => {
  const getStatusColor = (status: VMStatus) =>
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'default';

  // FIX: Define the string constant with the correct UPPERCASE value
  // This matches the usage seen in useVMMetrics and useVirtualMachines hooks
  const STATUS_RUNNING_STRING = 'RUNNING';

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              {vm.name}
            </Typography>
            <Chip
              label={vm.status} // Display the status string directly
              color={getStatusColor(vm.status)}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={VM_TYPE_LABELS[vm.vm_type as keyof typeof VM_TYPE_LABELS]}
              variant="outlined"
              size="small"
            />
          </Box>
          {onOpenSettings && (
            <Tooltip title="Settings">
              <IconButton
                size="small"
                onClick={onOpenSettings}
                disabled={isLoading}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Resource Usage */}
        <Grid container spacing={1.5}>
          {/* CPU Usage */}
          <Grid item xs={12}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">
                  CPU Usage
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatPercentage(vm.cpu_usage)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={vm.cpu_usage}
                color={vm.cpu_usage > 80 ? 'error' : 'primary'}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          </Grid>

          {/* Memory Usage */}
          <Grid item xs={12}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">
                  Memory Usage
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatPercentage(vm.memory_usage)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={vm.memory_usage}
                color={vm.memory_usage > 80 ? 'error' : 'primary'}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography
                variant="caption"
                display="block"
                color="textSecondary"
                sx={{ textAlign: 'right' }}
              >
                {formatMemory(vm.memory_mb)} Total
              </Typography>
            </Box>
          </Grid>

          {/* Disk Usage */}
          <Grid item xs={12}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">
                  Disk Usage
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatPercentage(vm.disk_usage)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={vm.disk_usage}
                color={vm.disk_usage > 80 ? 'error' : 'primary'}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography
                variant="caption"
                display="block"
                color="textSecondary"
                sx={{ textAlign: 'right' }}
              >
                {`${vm.disk_size} GB Total`}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Network Info */}
        {vm.ip_address && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            IP: {vm.ip_address}
          </Typography>
        )}
      </CardContent>

      <CardActions
        sx={{ justifyContent: 'space-between', px: 2, pb: 2, pt: 0 }}
      >
        <Box>
          {/* Power Actions */}
          {/* FIX: Compare with the UPPERCASE string literal */}
          {vm.status !== STATUS_RUNNING_STRING && onStart && (
            <Tooltip title="Start">
              <span>
                <IconButton
                  onClick={onStart}
                  disabled={isLoading}
                  color="success"
                  size="small"
                >
                  <StartIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}

          {/* FIX: Compare with the UPPERCASE string literal */}
          {vm.status === STATUS_RUNNING_STRING && (
            <>
              {onStop && (
                <Tooltip title="Stop">
                  <span>
                    <IconButton
                      onClick={onStop}
                      disabled={isLoading}
                      color="error"
                      size="small"
                    >
                      <StopIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {onRestart && (
                <Tooltip title="Restart">
                  <span>
                    <IconButton
                      onClick={onRestart}
                      disabled={isLoading}
                      color="primary"
                      size="small"
                    >
                      <RestartIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {onSuspend && (
                <Tooltip title="Suspend">
                  <span>
                    <IconButton
                      onClick={onSuspend}
                      disabled={isLoading}
                      color="warning"
                      size="small"
                    >
                      <SuspendIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </>
          )}
        </Box>

        <Box>
          {/* Access Actions */}
          {/* FIX: Compare with the UPPERCASE string literal */}
          {vm.status === STATUS_RUNNING_STRING && (
            <>
              {vm.rdp_enabled && onOpenConsole && (
                <Tooltip title="Open Console">
                  <span>
                    <IconButton
                      onClick={onOpenConsole}
                      disabled={isLoading}
                      size="small"
                    >
                      <ConsoleIcon /> {/* Using DesktopWindows */}
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {vm.ssh_enabled && (
                <Tooltip title="SSH Terminal (Not Implemented)">
                  <span>
                    <IconButton disabled={isLoading} size="small">
                      <TerminalIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </>
          )}

          {onDelete && (
            <Tooltip title="Delete">
              <span>
                <IconButton
                  onClick={onDelete}
                  disabled={isLoading}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      </CardActions>

      {/* Loading Indicator */}
      {isLoading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
          }}
        />
      )}
    </Card>
  );
};

export default VMCard;
