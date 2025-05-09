import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "inactive" | "default";
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  let variantClass = "";
  switch (variant) {
    case "success":
      variantClass = "bg-green-100 text-green-700";
      break;
    case "inactive":
      variantClass = "bg-gray-200 text-gray-500";
      break;
    default:
      variantClass = "bg-gray-100 text-gray-800";
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded text-xs font-semibold transition-colors", 
        variantClass, 
        className
      )}
      {...props}
    />
  );
} 