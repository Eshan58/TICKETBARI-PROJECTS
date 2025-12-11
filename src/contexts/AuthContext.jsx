import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase.config.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const register = async ({ name, email, password, photoURL }) => {
    // password validation: uppercase, lowercase, min 6
    if (!/[A-Z]/.test(password))
      throw new Error("Password must contain uppercase");
    if (!/[a-z]/.test(password))
      throw new Error("Password must contain lowercase");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters");
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name, photoURL });
    return res.user;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
