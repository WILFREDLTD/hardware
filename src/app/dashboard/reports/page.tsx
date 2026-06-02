'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';

export default function ReportsPage() {
  return (
    <div>
      <Header
        title="Reports & Analytics"
        subtitle="View business statistics and trends"
      />

      <Card>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Reports Coming Soon
          </h2>
          <p className="text-gray-600">
            Detailed analytics and reporting features will be available soon.
          </p>
        </div>
      </Card>
    </div>
  );
}
