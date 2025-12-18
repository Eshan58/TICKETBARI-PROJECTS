
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID ,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export { auth };
// export default app;
// src/firebase.config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Use actual Firebase config values (replace with your actual config)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCUHnHHQYoIU7slhPJYf2j8p1c50Rwb9Sg", // Replace with your key
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com", // Replace with your domain
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id", // Replace with your project ID
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com", // Replace
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890", // Replace
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abc123def456" // Replace
};

// Log config (without sensitive data)
console.log('Firebase Config:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// For debugging
console.log('Firebase Auth initialized:', {
  app: app.name,
  auth: !!auth
});

export { auth, app };