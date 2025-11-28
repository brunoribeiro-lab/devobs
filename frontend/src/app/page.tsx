"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LoginPage from './login/page';

export default function Home() {
  const isAuthenticated = useAuth();
  const router = useRouter();
  const [isLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated === true)
      router.push('/dashboard');

    if (isAuthenticated === false)
      router.push('/login');

  }, [isAuthenticated, router]);

  if (isLoading)
    return <LoadingSpinner />;

  if (!isAuthenticated)
    return <LoginPage />;

  return <LoadingSpinner />;
}