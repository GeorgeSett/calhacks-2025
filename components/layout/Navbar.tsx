"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ConnectButton,
  useCurrentAccount,
  useDisconnectWallet
} from "@mysten/dapp-kit";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-md bg-bg/80 ">
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

            {/* Wallet Connection */}
            {currentAccount ? (
              <button onClick={() => disconnect()} className="btn btn-ghost">
                {formatAddress(currentAccount.address)}
              </button>
            ) : (
              <ConnectButton className="btn btn-primary" />
            )}

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
