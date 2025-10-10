/**
 * Supabase Authentication Operations
 */

import { supabase } from './config';
import { User } from '@/lib/types';

export interface SupabaseUser {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<SupabaseUser> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || name,
      photo: data.user.user_metadata.avatar_url,
    };
  } catch (error: any) {
    console.error('Supabase signup error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<SupabaseUser> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || 'User',
      photo: data.user.user_metadata.avatar_url,
    };
  } catch (error: any) {
    console.error('Supabase signin error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('Supabase Google signin error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
}

/**
 * Sign in with GitHub OAuth
 */
export async function signInWithGithub(): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('Supabase GitHub signin error:', error);
    throw new Error(error.message || 'Failed to sign in with GitHub');
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<SupabaseUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata.name || 'User',
      photo: user.user_metadata.avatar_url,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error('Supabase signout error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
}

/**
 * Update user profile
 */
export async function updateProfile(name: string): Promise<SupabaseUser> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: { name },
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || name,
      photo: data.user.user_metadata.avatar_url,
    };
  } catch (error: any) {
    console.error('Supabase update profile error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
}

/**
 * Update email
 */
export async function updateEmail(email: string): Promise<SupabaseUser> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      email,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name || 'User',
      photo: data.user.user_metadata.avatar_url,
    };
  } catch (error: any) {
    console.error('Supabase update email error:', error);
    throw new Error(error.message || 'Failed to update email');
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('Supabase update password error:', error);
    throw new Error(error.message || 'Failed to update password');
  }
}

/**
 * Send password recovery email
 */
export async function sendPasswordRecovery(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('Supabase password recovery error:', error);
    throw new Error(error.message || 'Failed to send recovery email');
  }
}

/**
 * Auth state change listener
 */
export function onAuthStateChange(callback: (user: SupabaseUser | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || 'User',
          photo: session.user.user_metadata.avatar_url,
        });
      } else {
        callback(null);
      }
    }
  );

  return () => subscription.unsubscribe();
}
