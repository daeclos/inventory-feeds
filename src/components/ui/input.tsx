import * as React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="block font-semibold">{label}</label>}
      <input
        className={`border border-gray-300 rounded px-3 py-2 w-full ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
