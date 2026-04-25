'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface VendorProfile {
  store_name: string;
  description: string;
  logo: string | null;
  favicon: string | null;
  tagline: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  button_style: 'rounded' | 'square' | 'pill';
  homepage_layout: 'grid' | 'list' | 'banner';
  font_family: string;
  font_size_scale: number;
}

interface TenantContextType {
  profile: VendorProfile | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenantData = async () => {
      const hostname = window.location.hostname;
      const isSubdomain = hostname !== 'localhost' && hostname !== '127.0.0.1';

      if (!isSubdomain) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/merchant/profile/public_details/');
        setProfile(response.data);
        
        // Apply theme colors to CSS variables
        if (response.data) {
          const root = document.documentElement;
          root.style.setProperty('--primary-color', response.data.primary_color);
          root.style.setProperty('--secondary-color', response.data.secondary_color);
          root.style.setProperty('--bg-color', response.data.background_color);
          root.style.setProperty('--font-family', response.data.font_family);
        }
      } catch (err) {
        console.error('Failed to fetch tenant settings', err);
        setError('Failed to load store settings');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);

  return (
    <TenantContext.Provider value={{ profile, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
