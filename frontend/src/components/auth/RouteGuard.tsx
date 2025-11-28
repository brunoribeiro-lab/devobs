"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface RouteGuardProps {
    children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
    const isAuthenticated = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated === false) 
            router.push('/login');
        
    }, [isAuthenticated, router]);

    if (isAuthenticated === null) 
        return <LoadingSpinner />;
    
    if (!isAuthenticated) 
        return <LoadingSpinner />;
    
    return <>{children}</>;
}