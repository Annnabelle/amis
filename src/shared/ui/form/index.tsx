import { Form, Input, Select } from 'antd';
import type { ComponentProps, ReactNode } from 'react';
import type { FormItemProps } from 'antd/es/form';
import type { InputProps } from 'antd/es/input';
import type { SelectProps } from 'antd/es/select';
import './styles.sass';

type FormLayoutProps = {
  children: ReactNode;
  className?: string;
};

type CommonFieldProps = Pick<
  FormItemProps,
  'dependencies' | 'initialValue' | 'label' | 'name' | 'rules' | 'tooltip'
> & {
  formItemClassName?: string;
};

type TextFieldProps = CommonFieldProps &
  Omit<InputProps, 'className' | 'name' | 'size'> & {
    inputClassName?: string;
    size?: InputProps['size'];
  };

type TextAreaFieldProps = CommonFieldProps &
  Omit<ComponentProps<typeof Input.TextArea>, 'className' | 'name' | 'size'> & {
    inputClassName?: string;
    size?: ComponentProps<typeof Input.TextArea>['size'];
  };

type SelectFieldProps = CommonFieldProps &
  Omit<SelectProps, 'className' | 'size'> & {
    inputClassName?: string;
    size?: SelectProps['size'];
  };

const getInputClassName = (className = '') =>
  ['input', className].filter(Boolean).join(' ');

export const FormGrid = ({ children, className = '' }: FormLayoutProps) => {
  const classNames = ['form-grid', className].filter(Boolean).join(' ');

  return <div className={classNames}>{children}</div>;
};

export const FormRow = ({ children, className = '' }: FormLayoutProps) => {
  const classNames = ['form-inputs', 'form-inputs-row', className]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
};

export const FormActions = ({ children, className = '' }: FormLayoutProps) => {
  const classNames = ['form-actions', 'btns-group', className]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
};

export const TextField = ({
  dependencies,
  formItemClassName = 'input',
  initialValue,
  inputClassName = '',
  label,
  name,
  rules,
  size = 'large',
  tooltip,
  ...inputProps
}: TextFieldProps) => (
  <Form.Item
    className={formItemClassName}
    dependencies={dependencies}
    initialValue={initialValue}
    label={label}
    name={name}
    rules={rules}
    tooltip={tooltip}
  >
    <Input
      {...inputProps}
      className={getInputClassName(inputClassName)}
      size={size}
    />
  </Form.Item>
);

export const TextAreaField = ({
  dependencies,
  formItemClassName = 'input',
  initialValue,
  inputClassName = '',
  label,
  name,
  rules,
  size = 'large',
  tooltip,
  ...textAreaProps
}: TextAreaFieldProps) => (
  <Form.Item
    className={formItemClassName}
    dependencies={dependencies}
    initialValue={initialValue}
    label={label}
    name={name}
    rules={rules}
    tooltip={tooltip}
  >
    <Input.TextArea
      {...textAreaProps}
      className={getInputClassName(inputClassName)}
      size={size}
    />
  </Form.Item>
);

export const SelectField = ({
  dependencies,
  formItemClassName = 'input',
  initialValue,
  inputClassName = '',
  label,
  name,
  rules,
  size = 'large',
  tooltip,
  ...selectProps
}: SelectFieldProps) => (
  <Form.Item
    className={formItemClassName}
    dependencies={dependencies}
    initialValue={initialValue}
    label={label}
    name={name}
    rules={rules}
    tooltip={tooltip}
  >
    <Select
      {...selectProps}
      className={getInputClassName(inputClassName)}
      size={size}
    />
  </Form.Item>
);
