interface InputProps {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  min?: string;
  max?: string;
  maxLength?: number;
}

export function Input({
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
  required = false,
  min,
  max,
  maxLength
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      maxLength={maxLength}
      className={`px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-accent transition-colors ${className}`}
    />
  );
}
