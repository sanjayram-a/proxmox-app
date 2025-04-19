import React from 'react';
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disableBackdropClick?: boolean;
  confirmDisabled?: boolean;
  confirmColor?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  maxWidth = 'sm',
  fullWidth = true,
  disableBackdropClick = false,
  confirmDisabled = false,
  confirmColor = 'primary',
  children,
}) => {
  const handleClose = (event: {}, reason: string) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{title}</Typography>
          <IconButton aria-label="close" onClick={handleCancel} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {description && (
          <DialogContentText id="dialog-description" sx={{ mb: 2 }}>
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          {cancelLabel}
        </Button>
        {onConfirm && (
          <Button
            onClick={onConfirm}
            color={confirmColor}
            variant="contained"
            disabled={confirmDisabled}
            autoFocus
          >
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </MuiDialog>
  );
};

// Confirmation Dialog
interface ConfirmDialogProps extends Omit<DialogProps, 'children'> {
  message: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  message,
  ...props
}) => {
  return <Dialog {...props} description={message} />;
};

// Usage example:
// const [open, setOpen] = useState(false);
//
// <Dialog
//   open={open}
//   title="Create VM"
//   onClose={() => setOpen(false)}
//   onConfirm={handleCreate}
//   confirmLabel="Create"
// >
//   <form>...</form>
// </Dialog>
//
// <ConfirmDialog
//   open={open}
//   title="Delete VM"
//   message="Are you sure you want to delete this VM?"
//   onClose={() => setOpen(false)}
//   onConfirm={handleDelete}
//   confirmColor="error"
//   confirmLabel="Delete"
// />

export default Dialog;
