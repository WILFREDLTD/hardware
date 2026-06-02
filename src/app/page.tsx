'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-green-600">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Hardware Store</h1>
        <p className="text-green-100">Loading...</p>
      </div>
    </div>
  );
}
