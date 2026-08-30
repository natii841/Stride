import { User, Session, AuthError } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isEmailVerified: boolean;
  isConfigured: boolean;
}

export interface AuthContextType extends AuthState {
  signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName?: string, username?: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserPassword: (password: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: { full_name?: string; username?: string; avatar_url?: string; bio?: string }) => Promise<{ error: AuthError | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<void>;
}
