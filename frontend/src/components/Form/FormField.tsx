import React, { ReactNode } from 'react'; // Added ReactNode import
import {
  TextField,
  TextFieldProps,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  // SelectProps, // Can often be inferred or use specific event types
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  Switch,
  SwitchProps,
  SelectChangeEvent, // <-- Import SelectChangeEvent
} from '@mui/material';

interface FormValidation {
  formError?: string | string[];
  touched?: boolean;
  // Remove boolean 'error' if not directly used by parent
  // error?: boolean;
}

// No changes needed for TextInputProps unless boolean error was used
interface TextInputProps
  extends Omit<TextFieldProps, 'name' | 'error' | 'helperText'>,
    FormValidation {
  name: string;
  helperText?: React.ReactNode;
}

// FIX: Update onChange and onBlur types in SelectInputProps
interface SelectInputProps extends FormValidation {
  name: string;
  label?: string;
  options: Array<{ value: string | number; label: string }>;
  helperText?: React.ReactNode;
  value?: string | number;
  // Use the specific MUI SelectChangeEvent type
  onChange?: (
    event: SelectChangeEvent<string | number>,
    child: ReactNode
  ) => void;
  // Use the FocusEventHandler type expected by the underlying input
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  disabled?: boolean;
  required?: boolean;
}

// No changes needed for CheckboxFieldProps/SwitchFieldProps
interface CheckboxFieldProps
  extends Omit<CheckboxProps, 'name' | 'error'>,
    FormValidation {
  name: string;
  label: string;
}

interface SwitchFieldProps
  extends Omit<SwitchProps, 'name' | 'error'>,
    FormValidation {
  name: string;
  label: string;
}

// TextInput component remains the same
export const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  formError,
  touched,
  helperText,
  ...props
}) => {
  const hasError = !!(
    touched &&
    formError &&
    (Array.isArray(formError) ? formError.length > 0 : !!formError)
  );
  const errorMessage = hasError
    ? Array.isArray(formError)
      ? formError[0]
      : formError
    : helperText;

  return (
    <TextField
      name={name}
      label={label}
      error={hasError}
      helperText={errorMessage}
      fullWidth
      {...props}
    />
  );
};

// SelectInput component uses the updated prop types
export const SelectInput: React.FC<SelectInputProps> = ({
  name,
  label,
  formError,
  touched,
  options,
  helperText,
  // Extract onChange and onBlur from props here for clarity if preferred
  onChange,
  onBlur,
  value,
  disabled,
  required,
  ...otherProps // Collect any other potential props passed
}) => {
  const hasError = !!(
    touched &&
    formError &&
    (Array.isArray(formError) ? formError.length > 0 : !!formError)
  );
  const errorMessage = hasError
    ? Array.isArray(formError)
      ? formError[0]
      : formError
    : helperText;

  return (
    // Pass otherProps down if needed, or remove if not applicable
    <FormControl fullWidth error={hasError} {...otherProps}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        name={name}
        labelId={`${name}-label`}
        label={label}
        value={value ?? ''}
        // Now props.onChange and props.onBlur match the expected types
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        variant="outlined"
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {(hasError || helperText) && (
        <FormHelperText>{errorMessage}</FormHelperText>
      )}
    </FormControl>
  );
};

// CheckboxField remains the same
export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  formError,
  touched,
  ...props
}) => {
  const hasError = !!(
    touched &&
    formError &&
    (Array.isArray(formError) ? formError.length > 0 : !!formError)
  );
  const errorMessage = hasError
    ? Array.isArray(formError)
      ? formError[0]
      : formError
    : '';

  return (
    <FormControl error={hasError}>
      <FormControlLabel
        control={<Checkbox name={name} {...props} />}
        label={label}
      />
      {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

// SwitchField remains the same
export const SwitchField: React.FC<SwitchFieldProps> = ({
  name,
  label,
  formError,
  touched,
  ...props
}) => {
  const hasError = !!(
    touched &&
    formError &&
    (Array.isArray(formError) ? formError.length > 0 : !!formError)
  );
  const errorMessage = hasError
    ? Array.isArray(formError)
      ? formError[0]
      : formError
    : '';

  return (
    <FormControl error={hasError}>
      <FormControlLabel
        control={<Switch name={name} {...props} />}
        label={label}
      />
      {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

// NumberInput remains the same
interface NumberInputProps extends TextInputProps {
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  min,
  max,
  step = 1,
  ...props
}) => {
  return (
    <TextInput
      type="number"
      InputProps={{
        inputProps: { min, max, step },
      }}
      {...props}
    />
  );
};

// PasswordInput remains the same
interface PasswordInputProps extends TextInputProps {
  showPassword?: boolean;
  onTogglePassword?: () => void;
  helperText?: React.ReactNode;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showPassword = false,
  onTogglePassword, // unused?
  ...props
}) => {
  return (
    <TextInput
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        ...props.InputProps,
        // Ensure type is set correctly within InputProps as well if needed by specific styles/features
        // type: showPassword ? 'text' : 'password',
      }}
      {...props}
    />
  );
};

// Default export remains the same
// Consider exporting components individually if preferred
export default {
  TextInput,
  SelectInput,
  CheckboxField,
  SwitchField,
  NumberInput,
  PasswordInput,
};
