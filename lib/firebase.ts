import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyAveJmQET8dwR37VcZlzfSqyb8itWOoMGw",
    authDomain: "tasker-s4m.firebaseapp.com",
    projectId: "tasker-s4m",
    storageBucket: "tasker-s4m.firebasestorage.app",
    messagingSenderId: "361222798924",
    appId: "1:361222798924:web:b9ada0607ddf8d87de3ee9",
    measurementId: "G-FPL6E6E9KW"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, auth, db, analytics };
