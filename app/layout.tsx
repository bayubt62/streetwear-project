import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";

// Mendaftarkan Bukhari Script
const bukhari = localFont({
  src: "../public/fonts/BukhariScript.ttf",
  variable: "--font-bukhari",
});

export const metadata: Metadata = {
  title: "STREETWEAR INSP.",
  description: "Modern Streetwear Lookbook & Catalogue",
};

// PENGATURAN FULLSCREEN MOBILE
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Ini yang memaksa konten masuk ke area notch/hitam
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bukhari.variable} antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}