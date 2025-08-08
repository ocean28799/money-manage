import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Migo Assistant - Personal Finance & Task Management",
  description: "Modern personal finance and task management application",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script
          src="/ios-safari-fix.js"
          strategy="afterInteractive"
        />
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
