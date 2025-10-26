import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";
import "@mysten/dapp-kit/dist/index.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SUI Crowdfund - Blockchain Crowdfunding Platform",
  description: "Decentralized crowdfunding powered by SUI blockchain"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <div className="flex flex-col min-h-screen">
          <Providers>
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
          </Providers>
          <Toaster position="bottom-right" />
        </div>
      </body>
    </html>
  );
}
