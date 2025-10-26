interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

export function TextArea({
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
  rows = 5,
  maxLength
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      rows={rows}
      maxLength={maxLength}
      className={`px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-accent transition-colors resize-none ${className}`}
    />
  );
}
