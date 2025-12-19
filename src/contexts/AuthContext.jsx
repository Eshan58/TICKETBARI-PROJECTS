// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { 
//   signInWithPopup, 
//   GoogleAuthProvider, 
//   signOut as firebaseSignOut,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   getIdToken
// } from 'firebase/auth';
// import { auth } from '../firebase.config.js';
// import api from '../services/api.js';

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const provider = new GoogleAuthProvider();

//   // FIXED: Enhanced sync function that checks MongoDB directly
//   const syncUserWithBackend = async (firebaseUser, retryCount = 0) => {
//     try {
//       console.log("🔄 Syncing user with backend:", firebaseUser?.email);
      
//       if (!firebaseUser) {
//         console.log("❌ No Firebase user found for sync");
//         return null;
//       }

//       // Get Firebase token
//       const token = await firebaseUser.getIdToken(true);
      
//       console.log("✅ Firebase token obtained:", token ? `Token length: ${token.length}` : "No token");
      
//       if (!token) {
//         console.error("❌ Could not get Firebase token");
//         throw new Error("No Firebase token");
//       }

//       // Store token in localStorage
//       localStorage.setItem("firebaseToken", token);
      
//       console.log("📡 Calling backend profile API...");
      
//       try {
//         // Try to get user profile from backend
//         const response = await api.getUserProfile();
        
//         if (response.data?.success) {
//           const userData = response.data.data.user;
//           console.log("✅ Backend user sync successful:", {
//             email: userData.email,
//             role: userData.role,
//             uid: userData.uid
//           });
          
//           setUser(userData);
//           return userData;
//         } else {
//           console.log("⚠️ Backend response not successful, trying direct DB check...");
//           throw new Error("Backend sync failed");
//         }
//       } catch (apiError) {
//         console.error("❌ API call failed:", apiError.message);
        
//         // FIX: Try to get user directly from MongoDB debug endpoint
//         try {
//           console.log("🔄 Trying direct MongoDB user lookup...");
//           const debugResponse = await api.getDebugUsers();
          
//           if (debugResponse.data?.success) {
//             const users = debugResponse.data.data.users;
//             const dbUser = users.find(u => u.email === firebaseUser.email);
            
//             if (dbUser) {
//               console.log("✅ Found user in MongoDB:", dbUser.email, dbUser.role);
//               setUser(dbUser);
//               return dbUser;
//             }
//           }
//         } catch (debugError) {
//           console.error("❌ MongoDB lookup failed:", debugError.message);
//         }
        
//         // If everything fails, create fallback user
//         console.log("📝 Creating fallback user from Firebase data");
//         const fallbackUser = {
//           uid: firebaseUser.uid,
//           email: firebaseUser.email,
//           displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
//           name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
//           photoURL: firebaseUser.photoURL,
//           role: firebaseUser.email === "mahdiashan9@gmail.com" ? "admin" : "user",
//           emailVerified: firebaseUser.emailVerified,
//           isLocalUser: true
//         };
        
//         setUser(fallbackUser);
//         return fallbackUser;
//       }
      
//     } catch (error) {
//       console.error("❌ Failed to sync user with backend:", error.message);
      
//       // Ultimate fallback
//       if (firebaseUser) {
//         const fallbackUser = {
//           uid: firebaseUser.uid,
//           email: firebaseUser.email,
//           displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
//           name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
//           photoURL: firebaseUser.photoURL,
//           role: firebaseUser.email === "mahdiashan9@gmail.com" ? "admin" : "user",
//           emailVerified: firebaseUser.emailVerified,
//           isLocalUser: true,
//           syncError: error.message
//         };
        
//         setUser(fallbackUser);
//         return fallbackUser;
//       }
      
//       return null;
//     }
//   };

//   // NEW: Direct admin override function
//   const forceAdminMode = async () => {
//     try {
//       console.log("👑 Forcing admin mode...");
      
//       // Get all users from debug endpoint
//       const response = await api.getDebugUsers();
      
//       if (response.data?.success) {
//         const users = response.data.data.users;
//         const adminUser = users.find(u => u.email === "mahdiashan9@gmail.com");
        
//         if (adminUser) {
//           console.log("✅ Found admin in MongoDB:", adminUser);
          
//           // Update the user in context
//           setUser(adminUser);
          
//           // Also update localStorage
//           localStorage.setItem('adminOverride', 'true');
//           localStorage.setItem('user', JSON.stringify(adminUser));
          
//           return adminUser;
//         }
//       }
      
//       return null;
//     } catch (error) {
//       console.error("❌ Force admin mode failed:", error);
//       return null;
//     }
//   };

//   // Email/password login
//   const login = async (email, password) => {
//     try {
//       setError(null);
//       setLoading(true);
      
//       console.log(`🔐 Attempting login for: ${email}`);
      
//       const result = await signInWithEmailAndPassword(auth, email, password);
//       console.log("✅ Firebase login successful");
      
//       const user = await syncUserWithBackend(result.user);
//       console.log("✅ Login completed");
//       return user;
//     } catch (error) {
//       setError(error.message);
//       console.error("❌ Email login error:", error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google login
//   const signInWithGoogle = async () => {
//     try {
//       setError(null);
//       setLoading(true);
//       console.log('🔵 Starting Google sign-in...');
      
//       const result = await signInWithPopup(auth, provider);
//       console.log('✅ Google sign-in successful:', result.user.email);
      
//       const user = await syncUserWithBackend(result.user);
      
//       // SPECIAL FIX: If user is mahdiashan9@gmail.com, force admin mode
//       if (result.user.email === "mahdiashan9@gmail.com") {
//         console.log("⭐ Detected admin email, forcing admin mode...");
//         await forceAdminMode();
//       }
      
//       return user;
//     } catch (error) {
//       setError(error.message);
//       console.error("❌ Google sign-in error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Register new user
//   const register = async (email, password, name = '') => {
//     try {
//       setError(null);
//       setLoading(true);
      
//       const result = await createUserWithEmailAndPassword(auth, email, password);
      
//       const user = await syncUserWithBackend(result.user);
//       return user;
//     } catch (error) {
//       setError(error.message);
//       console.error("❌ Registration error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       console.log("👋 Logging out...");
//       await firebaseSignOut(auth);
//       localStorage.removeItem("firebaseToken");
//       localStorage.removeItem("adminOverride");
//       localStorage.removeItem("user");
//       setUser(null);
//       console.log("✅ Logout successful");
//       window.location.href = "/";
//     } catch (error) {
//       setError(error.message);
//       console.error("❌ Logout error:", error);
//       throw error;
//     }
//   };

//   // Check authentication status on mount
//   useEffect(() => {
//     const initializeAuth = async () => {
//       console.log("🔧 Initializing auth...");
      
//       // Check if we have an admin override
//       const adminOverride = localStorage.getItem('adminOverride');
//       if (adminOverride === 'true') {
//         console.log("🔄 Admin override detected, loading from localStorage...");
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//           try {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//             setLoading(false);
//             return;
//           } catch (e) {
//             console.error("❌ Error parsing stored user:", e);
//           }
//         }
//       }
      
//       // Normal Firebase auth flow
//       const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//         console.log('👤 Firebase auth state changed:', firebaseUser ? firebaseUser.email : 'No user');
        
//         if (firebaseUser) {
//           await syncUserWithBackend(firebaseUser);
          
//           // SPECIAL CHECK: If logged in with mahdiashan9@gmail.com, ensure admin role
//           if (firebaseUser.email === "mahdiashan9@gmail.com") {
//             console.log("⭐ Admin email detected, verifying admin status...");
            
//             // Check current user role
//             const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
//             if (currentUser.role !== 'admin') {
//               console.log("⚠️ Admin email but not admin role, forcing admin mode...");
//               await forceAdminMode();
//             }
//           }
//         } else {
//           console.log("👤 No user signed in");
//           setUser(null);
//           localStorage.removeItem("firebaseToken");
//         }
//         setLoading(false);
//       });

//       return unsubscribe;
//     };

//     initializeAuth();
//   }, []);

//   // Check if user is admin
//   const isAdmin = () => {
//     return user?.role === 'admin';
//   };

//   // Check if user is vendor
//   const isVendor = () => {
//     return user?.role === 'vendor';
//   };

//   const value = {
//     user,
//     loading,
//     error,
//     // Login functions
//     login,
//     loginWithGoogle: signInWithGoogle,
//     signInWithGoogle,
//     register,
//     logout,
//     // Role checks
//     isAdmin,
//     isVendor,
//     // Utility functions
//     isAuthenticated: () => !!user,
//     getToken: () => localStorage.getItem("firebaseToken"),
//     getUserId: () => user?.uid,
//     getUserEmail: () => user?.email,
//     // Debug functions
//     debugAuth: async () => {
//       const currentUser = auth.currentUser;
//       if (currentUser) {
//         const token = await currentUser.getIdToken();
//         return {
//           firebaseUser: {
//             email: currentUser.email,
//             uid: currentUser.uid,
//             emailVerified: currentUser.emailVerified
//           },
//           storedToken: localStorage.getItem("firebaseToken"),
//           tokenLength: token?.length,
//           userInContext: user,
//           localStorageUser: localStorage.getItem('user')
//         };
//       }
//       return { error: "No Firebase user" };
//     },
//     // NEW: Force admin function
//     forceAdminMode,
//     // Refresh function
//     refreshUser: async () => {
//       if (auth.currentUser) {
//         return await syncUserWithBackend(auth.currentUser);
//       }
//       return null;
//     }
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
// export default AuthContext;




import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdToken
} from 'firebase/auth';
import { auth } from '../firebase.config.js';
import api from '../services/api.js';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const provider = new GoogleAuthProvider();

  // FIXED: Enhanced sync function that checks MongoDB directly
  const syncUserWithBackend = async (firebaseUser, retryCount = 0) => {
    try {
      console.log("🔄 Syncing user with backend:", firebaseUser?.email);
      
      if (!firebaseUser) {
        console.log("❌ No Firebase user found for sync");
        return null;
      }

      // Get Firebase token
      const token = await firebaseUser.getIdToken(true);
      
      console.log("✅ Firebase token obtained:", token ? `Token length: ${token.length}` : "No token");
      
      if (!token) {
        console.error("❌ Could not get Firebase token");
        throw new Error("No Firebase token");
      }

      // Store token in localStorage
      localStorage.setItem("firebaseToken", token);
      
      console.log("📡 Calling backend profile API...");
      
      try {
        // Try to get user profile from backend
        const response = await api.getUserProfile();
        
        if (response.data?.success) {
          const userData = response.data.data.user;
          console.log("✅ Backend user sync successful:", {
            email: userData.email,
            role: userData.role,
            uid: userData.uid
          });
          
          setUser(userData);
          return userData;
        } else {
          console.log("⚠️ Backend response not successful, trying direct DB check...");
          throw new Error("Backend sync failed");
        }
      } catch (apiError) {
        console.error("❌ API call failed:", apiError.message);
        
        // FIX: Try to get user directly from MongoDB debug endpoint
        try {
          console.log("🔄 Trying direct MongoDB user lookup...");
          const debugResponse = await api.getDebugUsers();
          
          if (debugResponse.data?.success) {
            const users = debugResponse.data.data.users;
            const dbUser = users.find(u => u.email === firebaseUser.email);
            
            if (dbUser) {
              console.log("✅ Found user in MongoDB:", dbUser.email, dbUser.role);
              setUser(dbUser);
              return dbUser;
            }
          }
        } catch (debugError) {
          console.error("❌ MongoDB lookup failed:", debugError.message);
        }
        
        // If everything fails, create fallback user
        console.log("📝 Creating fallback user from Firebase data");
        const fallbackUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL,
          role: firebaseUser.email === "mahdiashan9@gmail.com" ? "admin" : "user",
          emailVerified: firebaseUser.emailVerified,
          isLocalUser: true
        };
        
        setUser(fallbackUser);
        return fallbackUser;
      }
      
    } catch (error) {
      console.error("❌ Failed to sync user with backend:", error.message);
      
      // Ultimate fallback
      if (firebaseUser) {
        const fallbackUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL,
          role: firebaseUser.email === "mahdiashan9@gmail.com" ? "admin" : "user",
          emailVerified: firebaseUser.emailVerified,
          isLocalUser: true,
          syncError: error.message
        };
        
        setUser(fallbackUser);
        return fallbackUser;
      }
      
      return null;
    }
  };

  // NEW: Direct admin override function
  const forceAdminMode = async () => {
    try {
      console.log("👑 Forcing admin mode...");
      
      // Get all users from debug endpoint
      const response = await api.getDebugUsers();
      
      if (response.data?.success) {
        const users = response.data.data.users;
        const adminUser = users.find(u => u.email === "mahdiashan9@gmail.com");
        
        if (adminUser) {
          console.log("✅ Found admin in MongoDB:", adminUser);
          
          // Update the user in context
          setUser(adminUser);
          
          // Also update localStorage
          localStorage.setItem('adminOverride', 'true');
          localStorage.setItem('user', JSON.stringify(adminUser));
          
          return adminUser;
        }
      }
      
      return null;
    } catch (error) {
      console.error("❌ Force admin mode failed:", error);
      return null;
    }
  };

  // Email/password login
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log(`🔐 Attempting login for: ${email}`);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Firebase login successful");
      
      const user = await syncUserWithBackend(result.user);
      console.log("✅ Login completed");
      return user;
    } catch (error) {
      setError(error.message);
      console.error("❌ Email login error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('🔵 Starting Google sign-in...');
      
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google sign-in successful:', result.user.email);
      
      const user = await syncUserWithBackend(result.user);
      
      // SPECIAL FIX: If user is mahdiashan9@gmail.com, force admin mode
      if (result.user.email === "mahdiashan9@gmail.com") {
        console.log("⭐ Detected admin email, forcing admin mode...");
        await forceAdminMode();
      }
      
      return user;
    } catch (error) {
      setError(error.message);
      console.error("❌ Google sign-in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (email, password, name = '') => {
    try {
      setError(null);
      setLoading(true);
      
      console.log(`📝 Registering new user: ${email}`);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Firebase registration successful");
      
      const user = await syncUserWithBackend(result.user);
      return user;
    } catch (error) {
      setError(error.message);
      console.error("❌ Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("👋 Logging out...");
      await firebaseSignOut(auth);
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("adminOverride");
      localStorage.removeItem("user");
      setUser(null);
      console.log("✅ Logout successful");
      window.location.href = "/";
    } catch (error) {
      setError(error.message);
      console.error("❌ Logout error:", error);
      throw error;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔧 Initializing auth...");
      
      // Check if we have an admin override
      const adminOverride = localStorage.getItem('adminOverride');
      if (adminOverride === 'true') {
        console.log("🔄 Admin override detected, loading from localStorage...");
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setLoading(false);
            return;
          } catch (e) {
            console.error("❌ Error parsing stored user:", e);
          }
        }
      }
      
      // Normal Firebase auth flow
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        console.log('👤 Firebase auth state changed:', firebaseUser ? firebaseUser.email : 'No user');
        
        if (firebaseUser) {
          await syncUserWithBackend(firebaseUser);
          
          // SPECIAL CHECK: If logged in with mahdiashan9@gmail.com, ensure admin role
          if (firebaseUser.email === "mahdiashan9@gmail.com") {
            console.log("⭐ Admin email detected, verifying admin status...");
            
            // Check current user role
            const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.role !== 'admin') {
              console.log("⚠️ Admin email but not admin role, forcing admin mode...");
              await forceAdminMode();
            }
          }
        } else {
          console.log("👤 No user signed in");
          setUser(null);
          localStorage.removeItem("firebaseToken");
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    initializeAuth();
  }, []);

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is vendor
  const isVendor = () => {
    return user?.role === 'vendor';
  };

  // Define context value object
  const contextValue = {
    user,
    loading,
    error,
    // Login functions
    login,
    loginWithGoogle: signInWithGoogle,
    signInWithGoogle,
    register,
    logout, // Make sure logout is included here
    // Role checks
    isAdmin,
    isVendor,
    // Utility functions
    isAuthenticated: () => !!user,
    getToken: () => localStorage.getItem("firebaseToken"),
    getUserId: () => user?.uid,
    getUserEmail: () => user?.email,
    // Debug functions
    debugAuth: async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        return {
          firebaseUser: {
            email: currentUser.email,
            uid: currentUser.uid,
            emailVerified: currentUser.emailVerified
          },
          storedToken: localStorage.getItem("firebaseToken"),
          tokenLength: token?.length,
          userInContext: user,
          localStorageUser: localStorage.getItem('user')
        };
      }
      return { error: "No Firebase user" };
    },
    // NEW: Force admin function
    forceAdminMode,
    // Refresh function
    refreshUser: async () => {
      if (auth.currentUser) {
        return await syncUserWithBackend(auth.currentUser);
      }
      return null;
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;