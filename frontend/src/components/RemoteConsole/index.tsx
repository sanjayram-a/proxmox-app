import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  PhotoCamera as ScreenshotIcon,
  KeyboardAlt as KeyboardIcon,
} from '@mui/icons-material';
import { useConfig } from '../../hooks/useConfig';

declare global {
  interface Window {
    Guacamole: any;
  }
}

interface RemoteConsoleProps {
  vmId: number;
  protocol: 'vnc' | 'rdp' | 'ssh';
  connectionString: string;
}

const RemoteConsole: React.FC<RemoteConsoleProps> = ({
  vmId,
  protocol,
  connectionString,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [client, setClient] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { guacamoleUrl } = useConfig();

  useEffect(() => {
    let guacClient: any = null;

    const initializeGuacamole = async () => {
      try {
        // Create Guacamole client
        const tunnel = new window.Guacamole.HTTPTunnel(
          `${guacamoleUrl}/websocket-tunnel`
        );
        guacClient = new window.Guacamole.Client(tunnel);

        // Add client to display div
        const display = guacClient.getDisplay().getElement();
        if (containerRef.current) {
          containerRef.current.appendChild(display);
        }

        // Error handler
        guacClient.onerror = (error: any) => {
          setError(`Connection error: ${error.message}`);
          setIsConnected(false);
        };

        // Connect handler
        guacClient.onstatechange = (state: number) => {
          setIsConnected(state === 3); // 3 = Connected
        };

        // Mouse handling
        const mouse = new window.Guacamole.Mouse(display);
        mouse.onmousedown =
          mouse.onmouseup =
          mouse.onmousemove =
            (mouseState: any) => {
              guacClient.sendMouseState(mouseState);
            };

        // Keyboard handling
        const keyboard = new window.Guacamole.Keyboard(document);
        keyboard.onkeydown = (keysym: number) => {
          guacClient.sendKeyEvent(1, keysym);
        };
        keyboard.onkeyup = (keysym: number) => {
          guacClient.sendKeyEvent(0, keysym);
        };

        // Connect
        guacClient.connect(connectionString);
        setClient(guacClient);
      } catch (err) {
        setError('Failed to initialize remote console');
        console.error('Guacamole initialization error:', err);
      }
    };

    initializeGuacamole();

    return () => {
      if (guacClient) {
        try {
          guacClient.disconnect();
        } catch (err) {
          console.error('Error disconnecting:', err);
        }
      }
    };
  }, [guacamoleUrl, connectionString]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleScreenshot = () => {
    if (client) {
      const display = client.getDisplay();
      const canvas = display.getCanvas();
      const screenshot = canvas.toDataURL('image/png');

      // Create download link
      const link = document.createElement('a');
      link.download = `vm-${vmId}-screenshot.png`;
      link.href = screenshot;
      link.click();
    }
  };

  const handleSendCtrlAltDel = () => {
    if (client && protocol === 'rdp') {
      client.sendKeyEvent(1, 0xffe3); // Ctrl
      client.sendKeyEvent(1, 0xffe9); // Alt
      client.sendKeyEvent(1, 0xffff); // Delete
      client.sendKeyEvent(0, 0xffff); // Delete
      client.sendKeyEvent(0, 0xffe9); // Alt
      client.sendKeyEvent(0, 0xffe3); // Ctrl
    }
  };

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Paper
        ref={containerRef}
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'black',
        }}
      />

      {!isConnected && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2, color: 'white' }}>
            Connecting to remote console...
          </Typography>
        </Box>
      )}

      {isConnected && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 1,
            p: 0.5,
          }}
        >
          <Tooltip title="Screenshot">
            <IconButton
              size="small"
              onClick={handleScreenshot}
              sx={{ color: 'white' }}
            >
              <ScreenshotIcon />
            </IconButton>
          </Tooltip>

          {protocol === 'rdp' && (
            <Tooltip title="Send Ctrl+Alt+Delete">
              <IconButton
                size="small"
                onClick={handleSendCtrlAltDel}
                sx={{ color: 'white' }}
              >
                <KeyboardIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            <IconButton
              size="small"
              onClick={handleFullscreen}
              sx={{ color: 'white' }}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default RemoteConsole;
