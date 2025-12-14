
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth, googleProvider } from "../firebase.config.js";
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
//   signInWithPopup,
//   updateProfile,
//   getIdToken,
// } from "firebase/auth";

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Function to store token in localStorage
//   const storeFirebaseToken = async (firebaseUser) => {
//     try {
//       const token = await getIdToken(firebaseUser);
//       localStorage.setItem("firebaseToken", token);
//       console.log("✅ Firebase token stored in localStorage");
//       return token;
//     } catch (error) {
//       console.error("Failed to get Firebase token:", error);
//       localStorage.removeItem("firebaseToken");
//       return null;
//     }
//   };

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         // Store token when user logs in or refreshes
//         await storeFirebaseToken(firebaseUser);
//         setUser(firebaseUser);
//       } else {
//         // Clear token when user logs out
//         localStorage.removeItem("firebaseToken");
//         localStorage.removeItem("token");
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsub();
//   }, []);

//   // Wrap login functions to store tokens
//   const login = async (email, password) => {
//     const result = await signInWithEmailAndPassword(auth, email, password);
//     await storeFirebaseToken(result.user);
//     return result;
//   };

//   const loginWithGoogle = async () => {
//     const result = await signInWithPopup(auth, googleProvider);
//     await storeFirebaseToken(result.user);
//     return result;
//   };

//   const register = async ({ name, email, password, photoURL }) => {
//     // password validation
//     if (!/[A-Z]/.test(password))
//       throw new Error("Password must contain uppercase");
//     if (!/[a-z]/.test(password))
//       throw new Error("Password must contain lowercase");
//     if (password.length < 6)
//       throw new Error("Password must be at least 6 characters");
    
//     const res = await createUserWithEmailAndPassword(auth, email, password);
//     await updateProfile(res.user, { displayName: name, photoURL });
//     await storeFirebaseToken(res.user);
//     return res.user;
//   };

//   const logout = () => {
//     localStorage.removeItem("firebaseToken");
//     localStorage.removeItem("token");
//     return signOut(auth);
//   };

//   // Function to refresh token (call this before API requests if needed)
//   const refreshToken = async () => {
//     if (auth.currentUser) {
//       return await storeFirebaseToken(auth.currentUser);
//     }
//     return null;
//   };

//   return (
//     <AuthContext.Provider
//       value={{ 
//         user, 
//         loading, 
//         register, 
//         login, 
//         loginWithGoogle, 
//         logout,
//         refreshToken 
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase.config";
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
  const [token, setToken] = useState(null);

  // Function to store token
  const storeFirebaseToken = async (firebaseUser) => {
    try {
      if (!firebaseUser) {
        localStorage.removeItem("firebaseToken");
        setToken(null);
        return null;
      }
      
      const newToken = await getIdToken(firebaseUser);
      localStorage.setItem("firebaseToken", newToken);
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error("Failed to get Firebase token:", error);
      localStorage.removeItem("firebaseToken");
      setToken(null);
      return null;
    }
  };

  // Function to clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem("firebaseToken");
    setUser(null);
    setToken(null);
  };

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get and store token
          const newToken = await storeFirebaseToken(firebaseUser);
          
          // Set user state
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            _firebaseUser: firebaseUser
          });
          
          setToken(newToken);
        } else {
          // User is logged out
          clearAuthData();
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Login with email/password
  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const newToken = await storeFirebaseToken(result.user);
      
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified,
        _firebaseUser: result.user
      });
      
      setToken(newToken);
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const newToken = await storeFirebaseToken(result.user);
      
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified,
        _firebaseUser: result.user
      });
      
      setToken(newToken);
      return result;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async ({ name, email, password, photoURL }) => {
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(res.user, { 
        displayName: name, 
        photoURL: photoURL || null 
      });
      
      const newToken = await storeFirebaseToken(res.user);
      
      setUser({
        uid: res.user.uid,
        email: res.user.email,
        displayName: name,
        photoURL: photoURL || null,
        emailVerified: res.user.emailVerified,
        _firebaseUser: res.user
      });
      
      setToken(newToken);
      return res.user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      clearAuthData();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh token manually
  const refreshToken = async () => {
    try {
      if (auth.currentUser) {
        const newToken = await storeFirebaseToken(auth.currentUser);
        return newToken;
      }
      return null;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  };

  // Get current token
  const getToken = () => {
    return token || localStorage.getItem("firebaseToken");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!getToken();
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin' || user?.email?.includes('admin');
  };

  const value = {
    user,
    token,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshToken,
    getToken,
    isAuthenticated,
    isAdmin,
    getUserId: () => user?.uid,
    getUserEmail: () => user?.email,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}