import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  transparent?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  message = 'Loading...',
  transparent = false,
}) => {
  const theme = useTheme();

  const content = (
    <>
      <CircularProgress size={40} />
      {message && (
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: transparent ? 'white' : 'text.primary',
          }}
        >
          {message}
        </Typography>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: transparent
            ? alpha(theme.palette.background.paper, 0.7)
            : theme.palette.background.paper,
          zIndex: theme.zIndex.modal + 1,
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      {content}
    </Box>
  );
};

export const LoadingButton: React.FC<{
  loading: boolean;
  children: React.ReactNode;
}> = ({ loading, children }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  );
};

export const LoadingOverlay: React.FC<{
  loading: boolean;
  children: React.ReactNode;
}> = ({ loading, children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Loading;
