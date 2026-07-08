"use client";

import { SessionProvider } from "next-auth/react";
import AutoLock from '@/components/layout/AutoLock';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0}>
      <AutoLock>{children}</AutoLock>
    </SessionProvider>
  );
}
