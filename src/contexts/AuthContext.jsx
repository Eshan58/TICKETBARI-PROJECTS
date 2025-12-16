
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { 
//   signInWithPopup, 
//   GoogleAuthProvider, 
//   signOut as firebaseSignOut,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword
// } from 'firebase/auth';
// import { auth } from '../firebase.config.js';

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const provider = new GoogleAuthProvider();

//   // Sync user with backend - Handle missing endpoints gracefully
//   const syncUserWithBackend = async (firebaseUser) => {
//     try {
//       const token = await firebaseUser.getIdToken();
//       localStorage.setItem("firebaseToken", token);
      
//       // Try to get user profile from backend
//       try {
//         const response = await fetch("http://localhost:5000/api/user/profile", {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           if (data.success && data.data?.user) {
//             const userData = data.data.user;
//             setUser(userData);
//             return userData;
//           }
//         } else if (response.status === 401) {
//           // User not found in database, create local user
//           console.log("User not found in database, creating local user");
//         } else if (response.status === 404) {
//           // Endpoint doesn't exist
//           console.log("User profile endpoint not found");
//         }
//       } catch (apiError) {
//         console.log("Could not fetch user profile:", apiError.message);
//       }
      
//       // Create local user if backend endpoints don't exist
//       const localUser = {
//         uid: firebaseUser.uid,
//         email: firebaseUser.email,
//         name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
//         photoURL: firebaseUser.photoURL,
//         role: 'user', // Default role
//         _firebaseUser: firebaseUser
//       };
      
//       setUser(localUser);
//       return localUser;
      
//     } catch (error) {
//       console.error('Failed to sync user:', error);
      
//       // Fallback to local user
//       const localUser = {
//         uid: firebaseUser.uid,
//         email: firebaseUser.email,
//         name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
//         photoURL: firebaseUser.photoURL,
//         role: 'user',
//         _firebaseUser: firebaseUser
//       };
      
//       setUser(localUser);
//       return localUser;
//     }
//   };

//   // Email/password login
//   const login = async (email, password) => {
//     try {
//       setError(null);
//       setLoading(true);
      
//       // Sign in with Firebase
//       const result = await signInWithEmailAndPassword(auth, email, password);
      
//       // Sync with backend (will create local user if endpoints don't exist)
//       const user = await syncUserWithBackend(result.user);
//       return user;
//     } catch (error) {
//       setError(error.message);
//       console.error("Email login error:", error);
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
//       const result = await signInWithPopup(auth, provider);
//       const user = await syncUserWithBackend(result.user);
//       return user;
//     } catch (error) {
//       setError(error.message);
//       console.error("Google sign-in error:", error);
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
      
//       // Create user with Firebase
//       const result = await createUserWithEmailAndPassword(auth, email, password);
      
//       // Sync with backend
//       const user = await syncUserWithBackend(result.user);
//       return user;
//     } catch (error) {
//       setError(error.message);
//       console.error("Registration error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await firebaseSignOut(auth);
//       localStorage.removeItem("firebaseToken");
//       setUser(null);
//       // Redirect to login page
//       window.location.href = "/login";
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     }
//   };

//   // Check authentication status on mount
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         await syncUserWithBackend(firebaseUser);
//       } else {
//         setUser(null);
//         localStorage.removeItem("firebaseToken");
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
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
// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdToken // Import this specifically
} from 'firebase/auth';
import { auth } from '../firebase.config.js';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const provider = new GoogleAuthProvider();

  // Sync user with backend - FIXED token handling
  const syncUserWithBackend = async (firebaseUser) => {
    try {
      // FIX: Get fresh token with forceRefresh to avoid cached/corrupted tokens
      const token = await getIdToken(firebaseUser, true); // forceRefresh: true
      
      console.log('🔑 Firebase token obtained:', {
        length: token.length,
        first50: token.substring(0, 50),
        isJWT: token.includes('.') && token.split('.').length === 3
      });
      
      // Validate token format
      if (!token || token.length < 100) {
        throw new Error('Invalid token length');
      }
      
      if (!token.includes('.') || token.split('.').length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      localStorage.setItem("firebaseToken", token);
      
      // Try to get user profile from backend with retry logic
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`🔄 Attempt ${retryCount + 1} to sync user...`);
          
          const response = await fetch("http://localhost:5000/api/user/profile", {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          console.log('📡 Backend response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ User profile response:', data);
            
            if (data.success && data.data?.user) {
              const userData = data.data.user;
              setUser(userData);
              return userData;
            }
          } else if (response.status === 401) {
            console.log("🔴 401 Unauthorized - Token might be invalid");
            
            // If 401, refresh token and retry
            if (retryCount < maxRetries - 1) {
              console.log('🔄 Refreshing token and retrying...');
              // Force refresh token
              await getIdToken(firebaseUser, true);
              retryCount++;
              continue;
            }
          } else if (response.status === 404) {
            // Endpoint doesn't exist
            console.log("🔍 User profile endpoint not found");
            break;
          }
          
          // If we get here without returning, break
          break;
          
        } catch (apiError) {
          console.log(`❌ API call attempt ${retryCount + 1} failed:`, apiError.message);
          if (retryCount < maxRetries - 1) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            continue;
          }
          throw apiError;
        }
      }
      
      // Create local user if backend endpoints don't exist or fail
      console.log("📝 Creating local user as fallback");
      const localUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        photoURL: firebaseUser.photoURL,
        role: 'user', // Default role
        _firebaseUser: firebaseUser,
        isLocalUser: true // Flag to identify local users
      };
      
      setUser(localUser);
      return localUser;
      
    } catch (error) {
      console.error('❌ Failed to sync user:', error);
      
      // Fallback to local user
      const localUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        photoURL: firebaseUser.photoURL,
        role: 'user',
        _firebaseUser: firebaseUser,
        isLocalUser: true,
        syncError: error.message
      };
      
      setUser(localUser);
      return localUser;
    }
  };

  // Email/password login
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Sign in with Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Sync with backend
      const user = await syncUserWithBackend(result.user);
      return user;
    } catch (error) {
      setError(error.message);
      console.error("Email login error:", error);
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
      return user;
    } catch (error) {
      setError(error.message);
      console.error("Google sign-in error:", error);
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
      
      // Create user with Firebase
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Sync with backend
      const user = await syncUserWithBackend(result.user);
      return user;
    } catch (error) {
      setError(error.message);
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem("firebaseToken");
      setUser(null);
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('👤 Firebase auth state changed:', firebaseUser ? firebaseUser.email : 'No user');
      
      if (firebaseUser) {
        await syncUserWithBackend(firebaseUser);
      } else {
        setUser(null);
        localStorage.removeItem("firebaseToken");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is vendor
  const isVendor = () => {
    return user?.role === 'vendor';
  };

  const value = {
    user,
    loading,
    error,
    // Login functions
    login,
    loginWithGoogle: signInWithGoogle,
    signInWithGoogle,
    register,
    logout,
    // Role checks
    isAdmin,
    isVendor,
    // Utility functions
    isAuthenticated: () => !!user,
    getToken: () => localStorage.getItem("firebaseToken"),
    getUserId: () => user?.uid,
    getUserEmail: () => user?.email,
    // Debug functions
    debugToken: async () => {
      if (auth.currentUser) {
        const token = await getIdToken(auth.currentUser);
        console.log('🔍 Debug token:', {
          token: token.substring(0, 100) + '...',
          length: token.length,
          parts: token.split('.').length
        });
        return token;
      }
      return null;
    },
    // Refresh function
    refreshUser: async () => {
      if (auth.currentUser) {
        return await syncUserWithBackend(auth.currentUser);
      }
      return null;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};