import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { InstagramLoader } from './InstagramLoader';

interface PublicRouteProps {
  children?: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading, isEmailVerified } = useAuth();

  if (loading) {
    return <InstagramLoader />;
  }

  // If user is authenticated and verified, redirect to feed
  if (user && isEmailVerified) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
