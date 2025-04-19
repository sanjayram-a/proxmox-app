import React, { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  PhotoCamera as ScreenshotIcon,
  KeyboardAlt as KeyboardIcon,
} from '@mui/icons-material';
import { VM } from '../../types';
import RemoteConsole from '../RemoteConsole';

interface ConsoleViewerProps {
  open: boolean;
  onClose: () => void;
  vm: VM;
}

const ConsoleViewer: React.FC<ConsoleViewerProps> = ({ open, onClose, vm }) => {
  const theme = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const getConnectionString = () => {
    if (vm.vm_type === 'KVM') {
      return `token=${vm.id}&hostname=${vm.ip_address}&port=${vm.rdp_port}&protocol=rdp`;
    }
    return `token=${vm.id}&hostname=${vm.ip_address}&port=${vm.ssh_port}&protocol=ssh`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen={isFullscreen}
      PaperProps={{
        sx: {
          width: '95vw',
          height: '90vh',
          maxWidth: 'unset',
          backgroundColor: 'black',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 1,
          backgroundColor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">{vm.name} - Remote Console</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Take Screenshot">
            <IconButton size="small" onClick={() => {}}>
              <ScreenshotIcon />
            </IconButton>
          </Tooltip>

          {vm.vm_type === 'KVM' && (
            <Tooltip title="Send Ctrl+Alt+Del">
              <IconButton size="small" onClick={() => {}}>
                <KeyboardIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            <IconButton size="small" onClick={handleFullscreen}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Close">
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'black',
        }}
      >
        <RemoteConsole
          vmId={vm.id}
          protocol={vm.vm_type === 'KVM' ? 'rdp' : 'ssh'}
          connectionString={getConnectionString()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ConsoleViewer;
