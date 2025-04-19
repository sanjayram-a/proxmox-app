import FormContainer, {
  FormSection,
  FormFieldContainer,
} from './FormContainer';
import {
  TextInput,
  SelectInput,
  CheckboxField,
  SwitchField,
  NumberInput,
  PasswordInput,
} from './FormField';

export {
  FormContainer as Form,
  FormSection,
  FormFieldContainer as Field,
  TextInput,
  SelectInput,
  CheckboxField,
  SwitchField,
  NumberInput,
  PasswordInput,
};

// Example usage:
/*
import { Form, Field, TextInput, NumberInput } from '@/components/Form';

<Form
  title="Create Virtual Machine"
  onSubmit={handleSubmit}
  isLoading={isLoading}
  error={error}
>
  <Field xs={12} sm={6}>
    <TextInput
      name="name"
      label="VM Name"
      error={errors.name}
      touched={touched.name}
      onChange={handleChange}
    />
  </Field>
  <Field xs={12} sm={6}>
    <NumberInput
      name="cpuCores"
      label="CPU Cores"
      min={1}
      max={16}
      error={errors.cpuCores}
      touched={touched.cpuCores}
      onChange={handleChange}
    />
  </Field>
</Form>
*/
