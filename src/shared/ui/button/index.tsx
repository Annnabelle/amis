import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import "./styles.sass";

export type ButtonVariant = "primary" | "outline" | "danger" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "size" | "type">;

interface ButtonProps extends NativeButtonProps {
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
}

const CustomButton: React.FC<ButtonProps> = ({
  className = "",
  children,
  disabled = false,
  fullWidth = true,
  icon,
  iconOnly = false,
  loading = false,
  onClick,
  size = "md",
  type = "button",
  variant = "primary",
  ...restProps
}) => {
  const isDisabled = disabled || loading;
  const buttonClassName = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && !iconOnly ? "btn--full-width" : "",
    iconOnly ? "btn--icon-only" : "",
    loading ? "btn--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      onClick={onClick}
      className={buttonClassName}
      disabled={isDisabled}
      type={type}
      {...restProps}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </button>
  );
};

export default CustomButton;


