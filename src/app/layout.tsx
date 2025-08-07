import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Migo Assistant - Personal Finance & Task Management",
  description: "Modern personal finance and task management application",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover, interactive-widget=resizes-content",
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
          strategy="beforeInteractive"
        />
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
