import React, { useEffect, useState, createContext, useContext } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import app from "../firebaseConfig";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [gamemasterMode, setGamemasterMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setGamemasterMode(!!firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signInGamemaster = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setGamemasterMode(true);
    } catch (error) {
      setGamemasterMode(false);
    }
  };

  const signOutGamemaster = async () => {
    await signOut(auth);
    setUser(null);
    setGamemasterMode(false);
  };

  return (
    <AuthContext.Provider value={{ user, gamemasterMode, signInGamemaster, signOutGamemaster, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
