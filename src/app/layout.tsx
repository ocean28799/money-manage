import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import ErrorBoundary from "@/components/error-boundary";
import ErrorLogger from "@/components/error-logger";
import DebugPanel from "@/components/debug-panel";
import { ToastContainer } from "@/components/ui/notifications";
import { DataHealthCheck } from "@/components/data-health-check";

export const metadata: Metadata = {
  title: "Migo Assistant - Personal Finance & Task Management",
  description: "Modern personal finance and task management application with analytics and insights",
  keywords: ["finance", "money management", "budgeting", "tasks", "analytics", "personal finance"],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
        <ErrorLogger />
        <ErrorBoundary>
          <Sidebar>{children}</Sidebar>
          <ToastContainer />
          <DataHealthCheck />
        </ErrorBoundary>
        <DebugPanel />
      </body>
    </html>
  );
}
