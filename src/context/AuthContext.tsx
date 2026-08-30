import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthContextType, UserProfile } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to determine if the user has a verified email or signed in via Google OAuth
  const checkEmailVerification = (currentUser: User | null): boolean => {
    if (!currentUser) return false;
    
    // Check if signed in with Google OAuth (automatically verified)
    const isGoogleAuth = 
      currentUser.app_metadata?.provider === 'google' || 
      currentUser.identities?.some((id) => id.provider === 'google') ||
      currentUser.user_metadata?.iss?.includes('google');

    if (isGoogleAuth) {
      return true;
    }

    // Check if email_confirmed_at or confirmed_at is populated
    if (currentUser.email_confirmed_at || (currentUser as unknown as { confirmed_at?: string }).confirmed_at) {
      return true;
    }

    // Check custom metadata flag if any
    if (currentUser.user_metadata?.email_verified === true) {
      return true;
    }

    return false;
  };

  const syncUserProfile = (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }
    const meta = currentUser.user_metadata || {};
    setProfile({
      id: currentUser.id,
      email: currentUser.email,
      username: meta.username || currentUser.email?.split('@')[0] || 'user',
      full_name: meta.full_name || meta.name || 'Stride Member',
      avatar_url: meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`,
      bio: meta.bio || '',
      created_at: currentUser.created_at,
    });
  };

  const refreshSession = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      syncUserProfile(currentSession?.user ?? null);
    } catch (err) {
      console.error('Error getting initial Supabase session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`[Supabase Auth Event]: ${event}`);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        syncUserProfile(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSession]);

  const signInWithPassword = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in .env. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        } as AuthError,
      };
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setLoading(false);
        return { error };
      }
      setSession(data.session);
      setUser(data.user);
      syncUserProfile(data.user);
      setLoading(false);
      return { error: null };
    } catch (err: unknown) {
      setLoading(false);
      return { error: err as AuthError };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string,
    username?: string
  ) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in .env. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        } as AuthError,
        user: null,
      };
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || '',
            username: username?.trim() || email.split('@')[0],
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        setLoading(false);
        return { error, user: null };
      }
      setSession(data.session);
      setUser(data.user);
      syncUserProfile(data.user);
      setLoading(false);
      return { error: null, user: data.user };
    } catch (err: unknown) {
      setLoading(false);
      return { error: err as AuthError, user: null };
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in .env. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        } as AuthError,
      };
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  };

  const updateProfile = async (data: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
    bio?: string;
  }) => {
    if (!user) {
      return {
        error: {
          name: 'AuthError',
          message: 'No active user session found.',
        } as AuthError,
      };
    }

    if (isSupabaseConfigured) {
      try {
        const { data: updatedData, error } = await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            ...data,
          },
        });

        if (error) return { error };

        if (updatedData?.user) {
          setUser(updatedData.user);
          syncUserProfile(updatedData.user);
        }
        return { error: null };
      } catch (err: unknown) {
        return { error: err as AuthError };
      }
    }

    // Local fallback
    const updatedUser = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        ...data,
      },
    } as User;

    setUser(updatedUser);
    syncUserProfile(updatedUser);
    return { error: null };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null };
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      return { error };
    } catch (err: unknown) {
      setLoading(false);
      return { error: err as AuthError };
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in .env.',
        } as AuthError,
      };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  };

  const updateUserPassword = async (password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in .env.',
        } as AuthError,
      };
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in .env.',
        } as AuthError,
      };
    }
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      return { error };
    } catch (err: unknown) {
      return { error: err as AuthError };
    }
  };

  const isEmailVerified = checkEmailVerification(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isEmailVerified,
        isConfigured: isSupabaseConfigured,
        signInWithPassword,
        signUp,
        signInWithGoogle,
        signOut,
        resetPasswordForEmail,
        updateUserPassword,
        updateProfile,
        resendVerificationEmail,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
