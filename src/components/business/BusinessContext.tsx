"use client";
import React, { ReactNode, createContext, useState, useContext, useEffect } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Business } from './types';

interface BusinessContextType {
  currentBusiness: Business | null;
  setCurrentBusiness: (business: Business) => void;
  businesses: Business[] | null;
  isLoading: boolean;
}

const BusinessContext = createContext<BusinessContextType | null >(null);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

interface BusinessProviderProps {
  children: ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const { data: businesses, isLoading } = trpc.getAllBusinesses.useQuery();

  useEffect(() => {
    if (businesses && businesses.length > 0 && !currentBusiness) {
      setCurrentBusiness(businesses[0]);
    }
  }, [businesses, currentBusiness]);

  return (
    <BusinessContext.Provider value={{ currentBusiness, setCurrentBusiness, businesses: businesses ?? null, isLoading }}>
      {children}
    </BusinessContext.Provider>
  );
};
