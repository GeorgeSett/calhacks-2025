interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="search campaigns..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-80 px-4 py-2 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-accent transition-colors"
    />
  );
}
