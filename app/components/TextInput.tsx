import React, { ReactNode } from "react";

interface TextInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable TextInput component with consistent styling across the application
 * Can be used with or without an icon
 */
const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#737373] mb-1"
      >
        {label}
        {required && "*"}
      </label>
      <div
        className={`flex items-center w-full px-4 py-3 bg-white border ${
          error ? "border-red-500" : "border-[#D9D9D9]"
        } rounded-lg focus-within:border-[#633CFF] focus-within:ring-2 focus-within:ring-[#EFEBFF] transition-colors`}
      >
        {icon && <div className="mr-3">{icon}</div>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="flex-1 outline-none text-base text-[#333333] placeholder:text-[#737373] placeholder:opacity-50 bg-transparent"
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TextInput;
