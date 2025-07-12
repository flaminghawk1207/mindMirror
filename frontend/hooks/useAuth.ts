import { useEffect, useState, useCallback } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      console.log('Firebase user object:', firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      console.log('Logging out user...');
      console.log('Current auth state before logout:', auth.currentUser);
      await signOut(auth);
      console.log('Firebase signOut completed');
      console.log('Auth state after logout:', auth.currentUser);
      console.log('User logged out successfully');
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err; // Re-throw to allow error handling in the calling component
    }
  }, []);

  return { user, loading, error, signup, login, logout };
} 