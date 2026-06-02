'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';

export default function SalesPage() {
  return (
    <div>
      <Header
        title="Sales"
        subtitle="Record and manage sales transactions"
      />

      <Card>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sales Module Coming Soon
          </h2>
          <p className="text-gray-600">
            Sales recording features will be available soon.
          </p>
        </div>
      </Card>
    </div>
  );
}
