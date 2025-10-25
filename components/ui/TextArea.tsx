interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  rows?: number;
}

export function TextArea({
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
  rows = 5
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={`px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-accent transition-colors resize-none ${className}`}
    />
  );
}
