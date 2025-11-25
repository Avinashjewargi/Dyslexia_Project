/* eslint-disable no-undef */
//frontend/utils/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore'; // Removed unused updateDoc

// --- Environment Variables ---
const firebaseConfigRaw = typeof __firebase_config !== 'undefined' ? __firebase_config : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let db = null;
let auth = null;
let isFirebaseActive = false;

if (firebaseConfigRaw) {
    try {
        const config = JSON.parse(firebaseConfigRaw);
        const app = initializeApp(config);
        db = getFirestore(app);
        auth = getAuth(app);
        isFirebaseActive = true;
    } catch (e) {
        console.warn("Firebase initialization failed, falling back to LocalStorage:", e);
    }
} else {
    console.log("Running locally. Using LocalStorage for persistence.");
}

const getPrivateUserCollectionPath = (userId, collectionName) => 
    `/artifacts/${appId}/users/${userId}/${collectionName}`;

// --- Auth ---
export const initializeAuth = async () => {
    if (isFirebaseActive && auth) {
        try {
            if (initialAuthToken) {
                const userCredential = await signInWithCustomToken(auth, initialAuthToken);
                return userCredential.user.uid;
            } else {
                const userCredential = await signInAnonymously(auth);
                return userCredential.user.uid;
            }
        } catch (error) {
            console.error("Auth failed, using fallback ID:", error);
        }
    }
    return "local-dev-user";
};

// --- Reading Sessions ---
export const saveReadingSession = async (userId, sessionData) => {
    const docId = Date.now().toString();
    const timestamp = new Date().toISOString();
    const finalData = { ...sessionData, timestamp, id: docId };

    if (isFirebaseActive && db) {
        try {
            const path = getPrivateUserCollectionPath(userId, 'sessions');
            await setDoc(doc(db, path, docId), {
                ...finalData,
                analysis: JSON.stringify(sessionData.analysis || {})
            });
            console.log("Session saved to Firestore.");
        } catch (e) { 
            console.error("Firestore save failed:", e); 
        }
    } else {
        try {
            const existing = JSON.parse(localStorage.getItem('reading_sessions') || '[]');
            existing.push(finalData);
            localStorage.setItem('reading_sessions', JSON.stringify(existing));
            console.log("Session saved to LocalStorage.");
        } catch (e) { 
            console.error("LocalStorage save failed:", e); 
        }
    }
};

export const fetchReadingSessions = async (userId) => {
    if (isFirebaseActive && db) {
        try {
            const path = getPrivateUserCollectionPath(userId, 'sessions');
            const querySnapshot = await getDocs(collection(db, path));
            const sessions = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.analysis && typeof data.analysis === 'string') {
                    try { data.analysis = JSON.parse(data.analysis); } catch (e) { console.error("JSON parse error:", e); }
                }
                sessions.push({ id: doc.id, ...data });
            });
            return sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (e) { 
            console.error("Firestore fetch failed:", e); 
            return []; 
        }
    } else {
        try {
            const sessions = JSON.parse(localStorage.getItem('reading_sessions') || '[]');
            return sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (e) { 
            console.error("LocalStorage fetch failed:", e); 
            return []; 
        }
    }
};

// --- User Profile (Gamification) ---
export const fetchUserProfile = async (userId) => {
    const defaultProfile = {
        name: "Student",
        score: 0,
        badges: [],
        streak: 1,
        readingLevel: "Grade 3",
        weeklyGoal: 5,
        currentHours: 0
    };

    if (isFirebaseActive && db) {
        try {
            const path = getPrivateUserCollectionPath(userId, 'profile');
            const docRef = doc(db, path, 'main');
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return { ...defaultProfile, ...docSnap.data() };
            } else {
                await setDoc(docRef, defaultProfile);
                return defaultProfile;
            }
        } catch (e) {
            console.error("Profile fetch failed:", e);
            return defaultProfile;
        }
    } else {
        try {
            const saved = localStorage.getItem('user_profile');
            return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
        } catch (e) { 
            console.error("LocalStorage profile fetch failed:", e);
            return defaultProfile; 
        }
    }
};

export const updateUserProfile = async (userId, newData) => {
    if (isFirebaseActive && db) {
        try {
            const path = getPrivateUserCollectionPath(userId, 'profile');
            const docRef = doc(db, path, 'main');
            await setDoc(docRef, newData, { merge: true });
        } catch (e) { console.error("Profile update failed:", e); }
    } else {
        try {
            const current = JSON.parse(localStorage.getItem('user_profile') || '{}');
            const updated = { ...current, ...newData };
            localStorage.setItem('user_profile', JSON.stringify(updated));
        } catch (e) { console.error("LocalStorage update failed:", e); }
    }
};