import React from 'react';
import {
  IconButton,
  Tooltip,
  ButtonGroup,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RestartIcon,
  Pause as SuspendIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
// Assuming VMStatus is a TYPE ALIAS like: type VMStatus = 'RUNNING' | 'STOPPED' | ...
import { VM, VMStatus } from '../../types';

interface VMActionsProps {
  vm: VM;
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  onSuspend?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  showLabels?: boolean;
  variant?: 'icons' | 'menu';
}

export const VMActions: React.FC<VMActionsProps> = ({
  vm,
  onStart,
  onStop,
  onRestart,
  onSuspend,
  onDelete,
  isLoading = false,
  showLabels = false, // showLabels is currently unused in 'icons' variant logic
  variant = 'icons',
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // FIX: Define the string constant for comparison
  const STATUS_RUNNING_STRING = 'RUNNING';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Define actions with corrected status checks
  const actions = [
    {
      label: 'Start',
      icon: <StartIcon fontSize="small" />, // Added fontSize for consistency
      onClick: onStart,
      // FIX: Compare with string literal
      show: vm.status !== STATUS_RUNNING_STRING && !!onStart, // Only show if handler exists
      color: 'success' as const,
    },
    {
      label: 'Stop',
      icon: <StopIcon fontSize="small" />,
      onClick: onStop,
      // FIX: Compare with string literal
      show: vm.status === STATUS_RUNNING_STRING && !!onStop,
      color: 'error' as const,
    },
    {
      label: 'Restart',
      icon: <RestartIcon fontSize="small" />,
      onClick: onRestart,
      // FIX: Compare with string literal
      show: vm.status === STATUS_RUNNING_STRING && !!onRestart,
      color: 'primary' as const,
    },
    {
      label: 'Suspend',
      icon: <SuspendIcon fontSize="small" />,
      onClick: onSuspend,
      // FIX: Compare with string literal
      show: vm.status === STATUS_RUNNING_STRING && !!onSuspend,
      color: 'warning' as const,
    },
    {
      label: 'Delete',
      icon: <DeleteIcon fontSize="small" />,
      onClick: onDelete,
      show: !!onDelete, // Only show if handler exists
      color: 'error' as const,
    },
  ];

  // Filter actions based on their 'show' property AND if an onClick handler is provided
  const visibleActions = actions.filter(
    (action) => action.show && action.onClick
  );

  if (variant === 'menu') {
    return (
      <>
        <Tooltip title="More actions">
          <IconButton
            aria-controls="vm-actions-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            disabled={isLoading || visibleActions.length === 0} // Disable if no actions
            size="small"
          >
            <MoreIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="vm-actions-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          keepMounted // Better for accessibility
        >
          {visibleActions.map((action) => (
            <MenuItem
              key={action.label}
              onClick={() => {
                handleMenuClose();
                action.onClick?.(); // Already checked onClick exists
              }}
              // Individual items don't need explicit disable if parent button is disabled
              // disabled={isLoading}
            >
              <ListItemIcon
                sx={{
                  color: `${action.color}.main`,
                  minWidth: 'auto',
                  marginRight: 1.5,
                }}
              >
                {action.icon}
              </ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          ))}
          {visibleActions.length === 0 && (
            <MenuItem disabled>No actions available</MenuItem>
          )}
        </Menu>
      </>
    );
  }

  // Icons variant (ButtonGroup)
  if (visibleActions.length === 0) {
    return null; // Don't render empty ButtonGroup
  }

  return (
    // Added key for ButtonGroup itself if needed in a list
    <ButtonGroup size="small" variant="outlined" /* Example variant */>
      {visibleActions.map((action) => (
        // Wrap disabled IconButton in span for Tooltip to work correctly
        <Tooltip key={action.label} title={action.label}>
          <span>
            <IconButton
              onClick={action.onClick}
              disabled={isLoading}
              color={action.color}
              size="small"
              aria-label={action.label} // Add aria-label for accessibility
            >
              {action.icon}
            </IconButton>
          </span>
        </Tooltip>
      ))}
    </ButtonGroup>
  );
};

export default VMActions;
