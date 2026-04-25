'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  role?: Role;
}

export default function ProtectedRoute({ children, allowedRoles, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        const roles = allowedRoles || (role ? [role] : []);
        if (roles.length > 0 && !roles.includes(user.role)) {
          router.push('/'); // Redirect unauthorized roles to home
        }
      }
    }
  }, [user, loading, router, allowedRoles, role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const roles = allowedRoles || (role ? [role] : []);
  if (!user || (roles.length > 0 && !roles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
