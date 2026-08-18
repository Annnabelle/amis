import React, { type ReactNode } from "react";
import "./styles.sass";

export type ButtonVariant = "primary" | "outline" | "danger" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
  onClick,
  size = "md",
  type = "button",
  variant = "primary",
}) => {
  const buttonClassName = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClick} className={buttonClassName} disabled={disabled} type={type}>
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </button>
  );
};

export default CustomButton;


