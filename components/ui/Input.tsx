interface InputProps {
  value: string;
  type: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function Input({ value, type, placeholder, onChange }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-80 px-4 py-2 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-accent transition-colors"
    />
  );
}
