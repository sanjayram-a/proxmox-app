import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
// FIX: Correctly import default and named exports
import FormContainer, { FormFieldContainer } from '../Form/FormContainer';
import {
  TextInput,
  SelectInput,
  NumberInput,
  SwitchField,
} from '../Form/FormField';
// Assuming ApiError is defined in types, along with VMType and VMCreateData
import { VMType, VMCreateData, ApiError } from '../../types';
import { RESOURCE_LIMITS } from '../../constants';
import { useVirtualMachines } from '../../hooks/useVirtualMachines';
import { useForm, FormConfig } from '../../hooks/useForm';

interface CreateVMDialogProps {
  open: boolean;
  onClose: () => void;
}

// Define the shape of the form values explicitly for better type safety
interface CreateVMFormValues {
  name: string;
  vm_type: VMType;
  cpu_cores: number;
  memory_mb: number;
  disk_size: number;
  rdp_enabled: boolean;
  ssh_enabled: boolean;
}

// Use the explicit type with FormConfig
const initialFormConfig: FormConfig<CreateVMFormValues> = {
  name: {
    initialValue: '',
    validation: [
      { required: true, message: 'VM name is required' },
      {
        pattern: /^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/,
        message:
          'VM name must be lowercase, alphanumeric, and may include hyphens',
      },
    ],
  },
  vm_type: {
    initialValue: VMType.KVM,
    validation: [{ required: true, message: 'VM type is required' }],
  },
  cpu_cores: {
    initialValue: RESOURCE_LIMITS.CPU.DEFAULT,
    validation: [
      { required: true, message: 'CPU cores is required' },
      {
        custom: (value: number) =>
          value >= RESOURCE_LIMITS.CPU.MIN && value <= RESOURCE_LIMITS.CPU.MAX,
        message: `CPU cores must be between ${RESOURCE_LIMITS.CPU.MIN} and ${RESOURCE_LIMITS.CPU.MAX}`,
      },
    ],
  },
  memory_mb: {
    initialValue: RESOURCE_LIMITS.MEMORY.DEFAULT,
    validation: [
      { required: true, message: 'Memory is required' },
      {
        custom: (value: number) =>
          value >= RESOURCE_LIMITS.MEMORY.MIN &&
          value <= RESOURCE_LIMITS.MEMORY.MAX,
        message: `Memory must be between ${RESOURCE_LIMITS.MEMORY.MIN}MB and ${RESOURCE_LIMITS.MEMORY.MAX}MB`,
      },
    ],
  },
  disk_size: {
    initialValue: RESOURCE_LIMITS.DISK.DEFAULT,
    validation: [
      { required: true, message: 'Disk size is required' },
      {
        custom: (value: number) =>
          value >= RESOURCE_LIMITS.DISK.MIN &&
          value <= RESOURCE_LIMITS.DISK.MAX,
        message: `Disk size must be between ${RESOURCE_LIMITS.DISK.MIN}GB and ${RESOURCE_LIMITS.DISK.MAX}GB`,
      },
    ],
  },
  rdp_enabled: {
    initialValue: true,
  },
  ssh_enabled: {
    initialValue: true,
  },
};

const CreateVMDialog: React.FC<CreateVMDialogProps> = ({ open, onClose }) => {
  const { createVM, isLoading, error: apiError } = useVirtualMachines(); // Renamed error to avoid conflict
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm<CreateVMFormValues>(initialFormConfig); // Pass the explicit type to useForm

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateVM = async () => {
    // Validation happens in handleSubmit, this is called on success
    try {
      const vmData: VMCreateData = {
        name: values.name,
        vm_type: values.vm_type,
        cpu_cores: Number(values.cpu_cores),
        memory_mb: Number(values.memory_mb),
        disk_size: Number(values.disk_size),
        rdp_enabled: values.rdp_enabled,
        ssh_enabled: values.ssh_enabled,
      };
      await createVM(vmData);
      handleClose(); // Close only on success
    } catch (err) {
      // This catch block might be redundant if useVirtualMachines handles display
      console.error('Failed to create VM (Submit Handler):', err);
      // Potentially show a generic error message here if useVirtualMachines doesn't
    }
  };

  // Helper function to get the error message string
  // FIX: Removed check for .detail as it doesn't exist on ApiError
  const getApiErrorMessage = (error: ApiError | null): string | null => {
    if (!error) return null;

    // Check for standard 'message' property
    if (typeof error.message === 'string') {
      return error.message;
    }

    // Add other checks here based on YOUR ApiError structure if necessary
    // Example: Check if the error object itself has an 'error' property that's a string
    // if (typeof (error as any).error === 'string') return (error as any).error;
    // Example: Check for an 'errors' array (common in validation responses)
    // if (Array.isArray((error as any).errors) && (error as any).errors.length > 0 && typeof (error as any).errors[0] === 'string') {
    //     return (error as any).errors[0]; // Return the first error message
    // }

    // Fallback message if no specific message property is found
    return 'An unexpected error occurred.';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Virtual Machine</DialogTitle>
      <DialogContent>
        {/* FIX: Use FormContainer (default export) */}
        <FormContainer
          onSubmit={handleSubmit(handleCreateVM)} // Pass the async function directly
          isLoading={isLoading}
          error={getApiErrorMessage(apiError)}
          spacing={3}
          hideButtons={false}
          submitLabel="Create"
          onCancel={handleClose}
        >
          {/* FIX: Use FormFieldContainer (named export) */}
          <FormFieldContainer xs={12} sm={6}>
            <TextInput
              name="name"
              label="VM Name"
              value={values.name}
              formError={errors.name} // Pass error string
              touched={touched.name} // Pass touched state
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
          </FormFieldContainer>

          <FormFieldContainer xs={12} sm={6}>
            <SelectInput
              name="vm_type"
              label="VM Type"
              value={values.vm_type}
              formError={errors.vm_type} // Pass error string
              touched={touched.vm_type} // Pass touched state
              onChange={handleChange as any} // Use type assertion
              onBlur={handleBlur as any} // Use type assertion
              options={[
                { value: VMType.KVM, label: 'KVM Virtual Machine' },
                { value: VMType.LXC, label: 'LXC Container' },
              ]}
              required
            />
          </FormFieldContainer>

          <FormFieldContainer xs={12} sm={4}>
            <NumberInput
              name="cpu_cores"
              label="CPU Cores"
              value={values.cpu_cores}
              formError={errors.cpu_cores} // Pass error string
              touched={touched.cpu_cores} // Pass touched state
              onChange={handleChange}
              onBlur={handleBlur}
              min={RESOURCE_LIMITS.CPU.MIN}
              max={RESOURCE_LIMITS.CPU.MAX}
              required
            />
          </FormFieldContainer>

          <FormFieldContainer xs={12} sm={4}>
            <NumberInput
              name="memory_mb"
              label="Memory (MB)"
              value={values.memory_mb}
              formError={errors.memory_mb} // Pass error string
              touched={touched.memory_mb} // Pass touched state
              onChange={handleChange}
              onBlur={handleBlur}
              min={RESOURCE_LIMITS.MEMORY.MIN}
              max={RESOURCE_LIMITS.MEMORY.MAX}
              step={512}
              required
            />
          </FormFieldContainer>

          <FormFieldContainer xs={12} sm={4}>
            <NumberInput
              name="disk_size"
              label="Disk Size (GB)"
              value={values.disk_size}
              formError={errors.disk_size} // Pass error string
              touched={touched.disk_size} // Pass touched state
              onChange={handleChange}
              onBlur={handleBlur}
              min={RESOURCE_LIMITS.DISK.MIN}
              max={RESOURCE_LIMITS.DISK.MAX}
              required
            />
          </FormFieldContainer>

          <FormFieldContainer xs={12} sm={6}>
            <SwitchField
              name="rdp_enabled"
              label="Enable RDP Access"
              checked={values.rdp_enabled}
              onChange={handleChange}
              // No error/touched props needed unless validation added
            />
          </FormFieldContainer>

          <FormFieldContainer xs={12} sm={6}>
            <SwitchField
              name="ssh_enabled"
              label="Enable SSH Access"
              checked={values.ssh_enabled}
              onChange={handleChange}
              // No error/touched props needed unless validation added
            />
          </FormFieldContainer>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVMDialog;
