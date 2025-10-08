/**
 * Appwrite Authentication
 */

import { ID, Models, OAuthProvider } from 'appwrite';
import { account } from './config';

export interface AppwriteUser extends Models.User<Models.Preferences> {
  $id: string;
  email: string;
  name: string;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<AppwriteUser> {
  try {
    // Create account
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Create session
    await account.createEmailSession(email, password);

    return user as AppwriteUser;
  } catch (error: any) {
    console.error('Appwrite signup error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AppwriteUser> {
  try {
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    return user as AppwriteUser;
  } catch (error: any) {
    console.error('Appwrite signin error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<void> {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/auth/login`
    );
  } catch (error: any) {
    console.error('Appwrite Google signin error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
}

/**
 * Sign in with GitHub OAuth
 */
export async function signInWithGithub(): Promise<void> {
  try {
    account.createOAuth2Session(
      OAuthProvider.Github,
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/auth/login`
    );
  } catch (error: any) {
    console.error('Appwrite GitHub signin error:', error);
    throw new Error(error.message || 'Failed to sign in with GitHub');
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AppwriteUser | null> {
  try {
    const user = await account.get();
    return user as AppwriteUser;
  } catch (error) {
    return null;
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  try {
    await account.deleteSession('current');
  } catch (error: any) {
    console.error('Appwrite signout error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
}

/**
 * Update user profile
 */
export async function updateProfile(name: string): Promise<AppwriteUser> {
  try {
    const user = await account.updateName(name);
    return user as AppwriteUser;
  } catch (error: any) {
    console.error('Appwrite update profile error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
}

/**
 * Update email
 */
export async function updateEmail(email: string, password: string): Promise<AppwriteUser> {
  try {
    const user = await account.updateEmail(email, password);
    return user as AppwriteUser;
  } catch (error: any) {
    console.error('Appwrite update email error:', error);
    throw new Error(error.message || 'Failed to update email');
  }
}

/**
 * Update password
 */
export async function updatePassword(oldPassword: string, newPassword: string): Promise<void> {
  try {
    await account.updatePassword(newPassword, oldPassword);
  } catch (error: any) {
    console.error('Appwrite update password error:', error);
    throw new Error(error.message || 'Failed to update password');
  }
}

/**
 * Send password recovery email
 */
export async function sendPasswordRecovery(email: string): Promise<void> {
  try {
    await account.createRecovery(
      email,
      `${window.location.origin}/auth/reset-password`
    );
  } catch (error: any) {
    console.error('Appwrite password recovery error:', error);
    throw new Error(error.message || 'Failed to send recovery email');
  }
}

/**
 * Complete password recovery
 */
export async function completePasswordRecovery(
  userId: string,
  secret: string,
  password: string
): Promise<void> {
  try {
    await account.updateRecovery(userId, secret, password, password);
  } catch (error: any) {
    console.error('Appwrite complete recovery error:', error);
    throw new Error(error.message || 'Failed to reset password');
  }
}

/**
 * Get user sessions
 */
export async function getSessions(): Promise<Models.Session[]> {
  try {
    const sessions = await account.listSessions();
    return sessions.sessions;
  } catch (error: any) {
    console.error('Appwrite get sessions error:', error);
    return [];
  }
}

/**
 * Delete a specific session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await account.deleteSession(sessionId);
  } catch (error: any) {
    console.error('Appwrite delete session error:', error);
    throw new Error(error.message || 'Failed to delete session');
  }
}
