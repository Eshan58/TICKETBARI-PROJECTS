// import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth, googleProvider } from "../firebase.config.js";
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
//   signInWithPopup,
//   updateProfile,
// } from "firebase/auth";

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (u) => {
//       setUser(u);
//       setLoading(false);
//     });
//     return () => unsub();
//   }, []);

//   const register = async ({ name, email, password, photoURL }) => {
//     // password validation: uppercase, lowercase, min 6
//     if (!/[A-Z]/.test(password))
//       throw new Error("Password must contain uppercase");
//     if (!/[a-z]/.test(password))
//       throw new Error("Password must contain lowercase");
//     if (password.length < 6)
//       throw new Error("Password must be at least 6 characters");
//     const res = await createUserWithEmailAndPassword(auth, email, password);
//     await updateProfile(res.user, { displayName: name, photoURL });
//     return res.user;
//   };

//   const login = (email, password) =>
//     signInWithEmailAndPassword(auth, email, password);
//   const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
//   const logout = () => signOut(auth);

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, register, login, loginWithGoogle, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase.config.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  getIdToken,
} from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to store token in localStorage
  const storeFirebaseToken = async (firebaseUser) => {
    try {
      const token = await getIdToken(firebaseUser);
      localStorage.setItem("firebaseToken", token);
      console.log("✅ Firebase token stored in localStorage");
      return token;
    } catch (error) {
      console.error("Failed to get Firebase token:", error);
      localStorage.removeItem("firebaseToken");
      return null;
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Store token when user logs in or refreshes
        await storeFirebaseToken(firebaseUser);
        setUser(firebaseUser);
      } else {
        // Clear token when user logs out
        localStorage.removeItem("firebaseToken");
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Wrap login functions to store tokens
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await storeFirebaseToken(result.user);
    return result;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await storeFirebaseToken(result.user);
    return result;
  };

  const register = async ({ name, email, password, photoURL }) => {
    // password validation
    if (!/[A-Z]/.test(password))
      throw new Error("Password must contain uppercase");
    if (!/[a-z]/.test(password))
      throw new Error("Password must contain lowercase");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters");
    
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name, photoURL });
    await storeFirebaseToken(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("firebaseToken");
    localStorage.removeItem("token");
    return signOut(auth);
  };

  // Function to refresh token (call this before API requests if needed)
  const refreshToken = async () => {
    if (auth.currentUser) {
      return await storeFirebaseToken(auth.currentUser);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        loading, 
        register, 
        login, 
        loginWithGoogle, 
        logout,
        refreshToken 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}