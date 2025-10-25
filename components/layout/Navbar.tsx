"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isConnected, setIsConnected] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-md bg-bg/80">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">⬡</span>
            <span className="text-2xl font-bold text-accent">name</span>
          </Link>

          {/* Desktop Nav */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8">
              <Link
                href="/explore"
                className="text-text-dim hover:text-text transition-colors"
                style={{ fontSize: "15px" }}
              >
                explore
              </Link>
              <Link
                href="/create"
                className="text-text-dim hover:text-text transition-colors"
                style={{ fontSize: "15px" }}
              >
                create
              </Link>
            </div>

            <button
              onClick={() => setIsConnected(!isConnected)}
              className={isConnected ? "btn btn-ghost" : "btn btn-primary"}
            >
              {isConnected ? "0x1234...5678" : "connect wallet"}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-2xl p-2"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface p-4">
            <Link
              href="/explore"
              className="block py-3 text-text-dim"
              style={{ fontSize: "15px" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              explore
            </Link>
            <Link
              href="/create"
              className="block py-3 text-text-dim"
              style={{ fontSize: "15px" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              create
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
