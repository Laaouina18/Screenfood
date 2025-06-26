// contexts/authContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, UserType } from '@/types';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, firestore } from '@/config/firebase';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { useRouter } from 'expo-router';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        });
        updateUserData(firebaseUser.uid);
        router.replace('/(tabs)');
      } else {
        setUser(null);
        router.replace('/auth/welcome');
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg === 'Firebase: Error (auth/invalid-credential).') msg = 'Identifiants incorrects';
      else if (msg === 'Firebase: Error (auth/user-not-found).') msg = 'Utilisateur non trouvé';
      else if (msg === 'Firebase: Error (auth/wrong-password).') msg = 'Mot de passe incorrect';
      else if (msg === 'Firebase: Error (auth/too-many-requests).') msg = 'Trop de tentatives';
      else if (msg === 'Firebase: Error (auth/invalid-email).') msg = 'Email invalide';
      return { success: false, msg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(firestore, 'users', response.user.uid), {
        name,
        email,
        uid: response.user.uid,
        createdAt: new Date(),
        scanCount: 0
      });
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg === 'Firebase: Error (auth/email-already-in-use).') msg = 'Email déjà utilisé';
      else if (msg === 'Firebase: Error (auth/invalid-email).') msg = 'Email invalide';
      return { success: false, msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser({
          uid: data?.uid,
          email: data?.email || null,
          name: data?.name || null,
          image: data?.image || null,
          scanCount: data?.scanCount || 0
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  const incrementScanCount = async () => {
    if (!user?.uid) return;
    try {
      const userRef = doc(firestore, 'users', user.uid);
      const newCount = (user.scanCount || 0) + 1;
      await setDoc(userRef, { scanCount: newCount }, { merge: true });
      setUser(prev => prev ? { ...prev, scanCount: newCount } : null);
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur:", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    logout,
    updateUserData,
    incrementScanCount,
    isLoading
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};
