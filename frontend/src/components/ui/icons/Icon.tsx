import React from "react";
import { IconProps } from "@/types/icon";

export const Icon: React.FC<IconProps> = ({
  size = 32,
  className = "",
  children,
  ...props
}) => {
  return (
    
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
};
