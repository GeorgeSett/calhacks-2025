export interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <section className="py-16 border-b border-border">
      <div className="container mx-auto px-6">
        <h1 className="text-hero mb-4">{title}</h1>
        <p className="text-subtitle text-text-dim max-w-2xl">{subtitle}</p>
      </div>
    </section>
  );
}
