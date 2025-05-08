import * as React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-[#404042] text-white hover:bg-[#FAAE3A] active:bg-[#F17625]",
        destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
        outline: "border border-[#404042] text-[#404042] hover:bg-[#FAAE3A] hover:text-white active:bg-[#F17625]",
        secondary: "bg-transparent text-[#404042] border border-[#404042] hover:bg-[#FAAE3A] hover:text-white active:bg-[#F17625]",
        ghost: "text-[#404042] hover:bg-[#FAAE3A] hover:text-white active:bg-[#F17625]",
        link: "text-[#404042] underline-offset-4 hover:text-[#FAAE3A] active:text-[#F17625]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
}

export function Button({ 
  variant = "default", 
  children, 
  className = "", 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    >
      {children}
    </button>
  )
}

export { buttonVariants }
