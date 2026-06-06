import type { Metadata } from "next";
import "./globals.css";
import GlobalLock from '@/components/layout/GlobalLock';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hardware Store Management",
  description: "Professional inventory and sales management for hardware stores",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalLock>{children}</GlobalLock>
      </body>
    </html>
  );
}
