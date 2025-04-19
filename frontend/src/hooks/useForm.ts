import { useState, FormEvent, ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material';

type ValidationRule<T> = {
  required?: boolean;
  pattern?: RegExp;
  custom?: (value: any, values: T) => boolean;
  message: string;
};

type FieldConfig<T, K extends keyof T> = {
  initialValue: T[K];
  validation?: ValidationRule<T>[];
};

export type FormConfig<T extends Record<string, any>> = {
  [K in keyof T]: FieldConfig<T, K>;
};

type InputElement = HTMLInputElement | HTMLTextAreaElement;
type FormChangeEvent = ChangeEvent<InputElement> | SelectChangeEvent;

export const useForm = <T extends Record<string, any>>(
  config: FormConfig<T>
) => {
  const initialValues = Object.keys(config).reduce((acc, key) => {
    acc[key as keyof T] = config[key as keyof T].initialValue;
    return acc;
  }, {} as T);

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string | undefined>>(
    {} as Record<keyof T, string | undefined>
  );
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>
  );

  const validateField = (
    name: keyof T,
    value: T[keyof T]
  ): string | undefined => {
    const fieldConfig = config[name];
    if (!fieldConfig.validation) return undefined;

    for (const rule of fieldConfig.validation) {
      if (rule.required && (!value || value === '')) {
        return rule.message;
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message;
      }
      if (rule.custom && !rule.custom(value, values)) {
        return rule.message;
      }
    }
    return undefined;
  };

  const handleChange = (e: FormChangeEvent) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const fieldName = name as keyof T;

    setValues((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));

    const error = validateField(fieldName, newValue as T[keyof T]);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleBlur = (e: React.FocusEvent<InputElement>) => {
    const { name } = e.target;
    const fieldName = name as keyof T;

    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    const error = validateField(fieldName, values[fieldName]);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors = {} as Record<keyof T, string | undefined>;
    let isValid = true;

    (Object.keys(config) as Array<keyof T>).forEach((name) => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit =
    (onSubmit: () => Promise<void>) => async (e: FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched on submit
      const touchedFields = Object.keys(config).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as Record<keyof T, boolean>);
      setTouched(touchedFields);

      if (validateForm()) {
        await onSubmit();
      }
    };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string | undefined>);
    setTouched({} as Record<keyof T, boolean>);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
    validateForm,
  };
};

export default useForm;
