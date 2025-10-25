import { BackgroundRippleEffect } from "../ui/background-ripple-effect";

export interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <section className="relative py-16 border-b border-border overflow-hidden">
      <BackgroundRippleEffect />
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-hero mb-4">{title}</h1>
        <p className="text-subtitle text-text-dim max-w-2xl">{subtitle}</p>
      </div>
    </section>
  );
}
