import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase'; // Path will be correct after types dir is moved

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  rating: number;
  total_reviews: number;
  verification_status: {
    email: boolean;
    phone: boolean;
    address: boolean;
    social: boolean;
  };
  social_links: {
    facebook: string | null;
    twitter: string | null;
    linkedin: string | null;
    instagram: string | null;
  };
  created_at: string;
  updated_at: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signUp: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchProfileAndSetLoading(userId: string | undefined) {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.warn('Profile fetch warning:', profileError.message);
        setProfile(null);
      } else if (data) {
        const profileWithDefaults: Profile = {
          ...(data as any),
          rating: data.rating ?? 0,
          total_reviews: data.total_reviews ?? 0,
          verification_status: data.verification_status ?? {
            email: false, phone: false, address: false, social: false
          },
          social_links: data.social_links ?? {
            facebook: null, twitter: null, linkedin: null, instagram: null
          }
        };
        setProfile(profileWithDefaults);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      await fetchProfileAndSetLoading(currentSession?.user?.id);
    }).catch(err => {
        console.error("Error in getSession:", err);
        setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setLoading(true);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        await fetchProfileAndSetLoading(newSession?.user?.id);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;
      return data;
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, signUp, signIn, signOut, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};