import { Spotlight } from "../ui/spotlight";

export default function Footer() {
  return (
    <section className="relative py-8 border-t border-border overflow-hidden">
      <Spotlight />
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-subtitle">calhacks 2025</h1>
      </div>
    </section>
  );
}
