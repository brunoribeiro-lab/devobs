"use client";

import RouteGuard from '@/components/auth/RouteGuard';

export default function Dashboard() {
  return (
    <RouteGuard>
      <div>
        <h1>Dashboard</h1>
      </div>
    </RouteGuard>
  );
}