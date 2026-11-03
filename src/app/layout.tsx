import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "AI SMM Assistant — Instagramingizni AI bilan rivojlantiring",
  description:
    "Instagram blogerlar, bizneslar va agentliklar uchun sun'iy intellektga asoslangan tahlil, virusli Reels ssenariylari va kontent strategiyasi platformasi.",
  keywords: "AI SMM, Instagram o'sish, Reels ssenariy, SMM yordamchi, Instagram analytics, AI content generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ground text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

