import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

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
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
