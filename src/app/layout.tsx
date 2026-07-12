import type { Metadata } from "next";
import "./globals.css";
import AutoLock from '@/components/layout/AutoLock';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hardware Store Management",
  description: "Professional inventory and sales management for hardware stores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AutoLock>{children}</AutoLock>
      </body>
    </html>
  );
}
