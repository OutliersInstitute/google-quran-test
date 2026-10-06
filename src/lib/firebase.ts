import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  getDocFromServer,
  increment
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase with environment variables or applet configuration
const resolvedConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || '',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || '',
};

const app = getApps().length > 0 ? getApp() : initializeApp(resolvedConfig);
export const auth = getAuth(app);
export const db = resolvedConfig.firestoreDatabaseId 
  ? getFirestore(app, resolvedConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot (fail-safe)
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch {
    return false;
  }
}

// Stable local guest identity if anonymous auth is restricted by project settings
export function getLocalGuestUser(): { uid: string; displayName: string; isAnonymous: boolean } {
  let guestId = '';
  try {
    guestId = localStorage.getItem('mushaf_guest_user_id') || '';
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('mushaf_guest_user_id', guestId);
    }
  } catch {
    guestId = 'guest_user';
  }
  return {
    uid: guestId,
    displayName: 'Guest Student',
    isAnonymous: true
  };
}

// Safe sign-in that gracefully handles admin-restricted anonymous provider
export async function ensureSignedIn(): Promise<FirebaseUser | null> {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err: any) {
    // If anonymous auth is disabled on this Google Cloud project, fallback to local guest session quietly
    if (err?.code === 'auth/admin-restricted-operation' || err?.message?.includes('admin-restricted-operation')) {
      return null;
    }
    return null;
  }
}

// Google Sign-in for persistent identity across devices
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err: any) {
    // Handle user closing popup or popup blocked
    if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
      console.warn("Google sign-in status:", err?.message || err);
    }
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn("Sign out error", err);
  }
}

// Subscribe to auth state changes
export function onAuthUser(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Cloud League Operations
export async function createCloudLeague(
  data: {
    name: string;
    description: string;
    challengeStructure: string;
    targetDescription: string;
    startPage?: number;
    endPage?: number;
    targetAmount?: number;
    targetUnit?: string;
  },
  user: { uid: string; displayName?: string | null }
): Promise<string | null> {
  try {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const leagueRef = doc(collection(db, 'leagues'));
    const leagueId = leagueRef.id;

    const leagueData = {
      id: leagueId,
      name: data.name,
      description: data.description || '',
      inviteCode,
      creatorId: user.uid,
      creatorName: user.displayName || 'Quran Student',
      challengeStructure: data.challengeStructure,
      targetDescription: data.targetDescription,
      startPage: data.startPage || 1,
      endPage: data.endPage || 604,
      memberCount: 1,
      createdAt: new Date().toISOString()
    };

    await setDoc(leagueRef, leagueData);

    // Add creator as first member
    const memberRef = doc(db, 'leagues', leagueId, 'members', user.uid);
    await setDoc(memberRef, {
      userId: user.uid,
      name: user.displayName || 'You',
      avatarColor: '#519CAB',
      points: 0,
      todayPoints: 0,
      rank: 1,
      streakDays: 1,
      completedToday: false,
      joinedDate: new Date().toISOString()
    });

    // Add creator initial activity
    const activityRef = doc(collection(db, 'leagues', leagueId, 'activity'));
    await setDoc(activityRef, {
      userId: user.uid,
      memberName: user.displayName || 'You',
      actionText: 'Created this Study Circle',
      pointsEarned: 0,
      timestamp: Date.now(),
      type: 'joined'
    });

    return leagueId;
  } catch (err) {
    console.warn("Could not create cloud league (using local storage):", err);
    return null;
  }
}

export async function joinCloudLeagueByCode(
  code: string,
  user: { uid: string; displayName?: string | null }
): Promise<{ success: boolean; leagueId?: string; message?: string }> {
  try {
    const cleanCode = code.trim().toUpperCase();
    const q = query(collection(db, 'leagues'), where('inviteCode', '==', cleanCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: 'Invalid invite code. Please check and try again.' };
    }

    const leagueDoc = querySnapshot.docs[0];
    const leagueId = leagueDoc.id;

    // Add user as member
    const memberRef = doc(db, 'leagues', leagueId, 'members', user.uid);
    const existing = await getDoc(memberRef);
    if (!existing.exists()) {
      await setDoc(memberRef, {
        userId: user.uid,
        name: user.displayName || 'Study Partner',
        avatarColor: '#519CAB',
        points: 0,
        todayPoints: 0,
        rank: 99,
        streakDays: 1,
        completedToday: false,
        joinedDate: new Date().toISOString()
      });

      // Update league member count
      await updateDoc(doc(db, 'leagues', leagueId), {
        memberCount: increment(1)
      });

      // Add join activity
      const activityRef = doc(collection(db, 'leagues', leagueId, 'activity'));
      await setDoc(activityRef, {
        userId: user.uid,
        memberName: user.displayName || 'Study Partner',
        actionText: 'Joined the Study Circle',
        pointsEarned: 0,
        timestamp: Date.now(),
        type: 'joined'
      });
    }

    return { success: true, leagueId };
  } catch (err) {
    console.warn("Could not join cloud league (fallback to local):", err);
    return { success: false, message: 'Failed to join league. Please try again.' };
  }
}

// Award XP to user in a league
export async function awardCloudXp(
  leagueId: string,
  userId: string,
  points: number,
  userName: string,
  actionText: string,
  type: 'ayah' | 'page' | 'streak' | 'target_met' = 'ayah'
): Promise<void> {
  try {
    const memberRef = doc(db, 'leagues', leagueId, 'members', userId);
    await updateDoc(memberRef, {
      points: increment(points),
      todayPoints: increment(points),
      completedToday: true
    });

    const activityRef = doc(collection(db, 'leagues', leagueId, 'activity'));
    await setDoc(activityRef, {
      userId,
      memberName: userName,
      actionText,
      pointsEarned: points,
      timestamp: Date.now(),
      type
    });
  } catch (err) {
    // Silent fallback to local XP
  }
}
