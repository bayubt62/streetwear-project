import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import PageTransition from "@/components/PageTransition";

// Mendaftarkan Bukhari Script
const bukhari = localFont({
  src: "../public/fonts/BukhariScript.ttf",
  variable: "--font-bukhari",
});

export const metadata: Metadata = {
  title: "STREETWEAR INSP.",
  description: "Modern Streetwear Lookbook & Catalogue",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bukhari.variable} antialiased bg-[#f0f0f0]`}>
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}