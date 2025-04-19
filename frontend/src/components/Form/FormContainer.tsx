import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

interface FormContainerProps {
  title?: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
  submitLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: number;
  disableSubmit?: boolean;
  hideButtons?: boolean;
}

const FormContainer: React.FC<FormContainerProps> = ({
  title,
  subtitle,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  success,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  children,
  maxWidth = 'sm',
  spacing = 2,
  disableSubmit = false,
  hideButtons = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: (theme) => theme.breakpoints.values[maxWidth],
        mx: 'auto',
      }}
    >
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        {(title || subtitle) && (
          <Box sx={{ mb: 3 }}>
            {title && (
              <Typography variant="h5" gutterBottom>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="subtitle1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            <Divider sx={{ mt: 2 }} />
          </Box>
        )}

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Form Fields */}
        <Grid container spacing={spacing}>
          {children}
        </Grid>

        {/* Action Buttons */}
        {!hideButtons && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 3,
            }}
          >
            {onCancel && (
              <Button onClick={onCancel} disabled={isLoading} color="inherit">
                {cancelLabel}
              </Button>
            )}
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
              disabled={disableSubmit}
            >
              {submitLabel}
            </LoadingButton>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

interface FormSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  spacing?: number;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  children,
  spacing = 2,
}) => {
  return (
    <Grid item xs={12}>
      {(title || subtitle) && (
        <Box sx={{ mb: 2 }}>
          {title && (
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          <Divider sx={{ mt: 1 }} />
        </Box>
      )}
      <Grid container spacing={spacing}>
        {children}
      </Grid>
    </Grid>
  );
};

interface FormFieldContainerProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  children: React.ReactNode;
}

export const FormFieldContainer: React.FC<FormFieldContainerProps> = ({
  children,
  ...gridProps
}) => {
  return (
    <Grid item {...gridProps}>
      {children}
    </Grid>
  );
};

export default FormContainer;
