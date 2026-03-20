import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ImpactLoop | Play. Win. Give Back.",
  description: "A premium reward system and charity platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#020617] text-slate-50 antialiased selection:bg-blue-500/30 overflow-x-hidden`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
