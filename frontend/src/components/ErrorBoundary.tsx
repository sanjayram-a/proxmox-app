import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleNavigateHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              textAlign: 'center',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                We're sorry for the inconvenience. Please try again or return to
                the home page.
              </Typography>

              <Alert severity="error" sx={{ mt: 2, mb: 3, width: '100%' }}>
                {this.state.error?.message || 'An unexpected error occurred'}
              </Alert>

              {process.env.NODE_ENV === 'development' &&
                this.state.errorInfo && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      width: '100%',
                      overflow: 'auto',
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="pre"
                      sx={{ whiteSpace: 'pre-wrap' }}
                    >
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  </Box>
                )}

              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={this.handleReload}>
                  Reload Page
                </Button>
                <Button variant="outlined" onClick={this.handleNavigateHome}>
                  Go to Home
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
