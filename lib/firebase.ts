import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp | undefined
let auth: Auth | undefined

// Firebase конфигурациясын тексеру
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId

export function getFirebaseApp(): FirebaseApp | null {
  // Егер Firebase конфигурациясы жоқ болса, null қайтару
  if (!isFirebaseConfigured) {
    return null
  }

  if (!app) {
    if (getApps().length) {
      app = getApp()
    } else {
      try {
        app = initializeApp(firebaseConfig)
      } catch (error) {
        console.error("Firebase инициализациялау қатесі:", error)
        return null
      }
    }
  }
  return app
}

export function getFirebaseAuth(): Auth | null {
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) {
    return null
  }

  if (!auth) {
    try {
      auth = getAuth(firebaseApp)
    } catch (error) {
      console.error("Firebase Auth инициализациялау қатесі:", error)
      return null
    }
  }
  return auth
}

// Ескі API үшін fallback
export const firebaseAuth = getFirebaseAuth()

