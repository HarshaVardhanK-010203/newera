import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from './types';
import { 
  auth, 
  db, 
  googleProvider, 
  githubProvider,
  isRealFirebase,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged 
} from './firebase';

// Since we may write to Firestore, import its subcomponents
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: any; // Firebase user or mock user
  profile: UserProfile | null;
  loading: boolean;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  loginEmailPassword: (email: string, password: string) => Promise<any>;
  registerEmailPassword: (username: string, email: string, role?: string) => Promise<any>;
  loginGoogle: () => Promise<any>;
  loginGithub: () => Promise<any>;
  loginAnonymous: () => Promise<any>;
  performPasswordReset: (email: string) => Promise<void>;
  performEmailVerification: () => Promise<void>;
  phoneOTPVerify: (phoneNumber: string, otp: string) => Promise<any>;
  logout: () => Promise<void>;
  syncProfileData: (updatedProfile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Initialize: listen for Auth State
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setLoading(true);
        if (currentUser) {
          setUser(currentUser);
          
          // Try to retrieve existing profile from Firestore if Real Firebase or Standard Firebase DB is active
          let fetchedProfile = null;
          try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              fetchedProfile = docSnap.data() as UserProfile;
            }
          } catch (e) {
            console.warn("Could not retrieve profile from Firestore:", e);
          }

          // Also fetch/sync with Express backend to ensure matching server session State
          try {
            const apiRes = await fetch('/api/profile');
            if (apiRes.ok) {
              const apiProfile = await apiRes.json();
              if (!fetchedProfile) {
                fetchedProfile = apiProfile;
              }
            }
          } catch (e) {
            console.warn("Could not retrieve backend state:", e);
          }

          // Or generate backup profile standard local profile
          if (!fetchedProfile) {
            fetchedProfile = {
              username: currentUser.displayName || currentUser.email?.split('@')[0] || 'WebDevCadet',
              email: currentUser.email || 'guest@webdevacademy.edu',
              role: (currentUser.email === 'harshavardhanhv119@gmail.com' || currentUser.email?.includes('admin')) ? 'Admin' : 'Student',
              level: 1,
              xp: 150,
              xpToNextLevel: 850,
              streak: 1,
              weeklyStreak: 1,
              completedTopics: [],
              completedQuizzedTopics: [],
              bookmarks: [],
              completedChallenges: [],
              completedProjects: [],
              timeSpentMinutes: 5,
              consistencyScore: 92,
              projectedCompletionDate: '2026-11-20',
              notes: {}
            };
            // Sync to firestore and backend
            await writeProfileToAllBackends(currentUser.uid, fetchedProfile);
          }

          setProfile(fetchedProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
    } else {
      // Offline mock session loader
      const cachedProfile = localStorage.getItem('mockProfile');
      if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
        setUser({ uid: 'mock-uid-123', email: JSON.parse(cachedProfile).email });
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const writeProfileToAllBackends = async (uid: string, updatedProfile: UserProfile) => {
    // 1. Sync to firestore (if database active and has connection)
    try {
      if (db) {
        await setDoc(doc(db, 'users', uid), updatedProfile, { merge: true });
        console.log("🔄 Firestore synchronized User profile safely.");
      }
    } catch (e) {
      console.warn("Firestore save skipped/failed:", e);
    }

    // 2. Sync to local backend REST session mock
    try {
      await fetch('/api/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: null,
          xpBonus: 0,
        })
      });
    } catch (e) {
      console.warn("Local API session sync warning:", e);
    }
  };

  const syncProfileData = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    if (user && user.uid) {
      await writeProfileToAllBackends(user.uid, updatedProfile);
    } else {
      // Save offline mock
      localStorage.setItem('mockProfile', JSON.stringify(updatedProfile));
    }
  };

  const loginEmailPassword = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (auth && isRealFirebase) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result;
      } else {
        // Mock API Login fallback triggers
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Authentication error.');
        
        const mockUser = { uid: 'mock-uid-' + email.replace(/[^a-zA-Z0-9]/g, ''), email };
        setUser(mockUser);
        setProfile(data.profile);
        localStorage.setItem('mockProfile', JSON.stringify(data.profile));
        return { user: mockUser };
      }
    } finally {
      setLoading(false);
    }
  };

  const registerEmailPassword = async (username: string, email: string, role: 'Student' | 'Admin' | 'Mentor' = 'Student') => {
    setLoading(true);
    try {
      if (auth && isRealFirebase) {
        // Real logic could trigger email/password creation, then email verification
        const result = await createUserWithEmailAndPassword(auth, email, "TempPassword123!");
        const generated: UserProfile = {
          username,
          email,
          role: ((email === 'harshavardhanhv119@gmail.com' || email?.includes('admin')) ? 'Admin' : role) as 'Student' | 'Admin' | 'Mentor',
          level: 1,
          xp: 100,
          xpToNextLevel: 900,
          streak: 1,
          weeklyStreak: 1,
          completedTopics: [],
          completedQuizzedTopics: [],
          bookmarks: [],
          completedChallenges: [],
          completedProjects: [],
          timeSpentMinutes: 0,
          consistencyScore: 90,
          projectedCompletionDate: '2026-12-01',
          notes: {}
        };
        await writeProfileToAllBackends(result.user.uid, generated);
        return result;
      } else {
        // Express register fallback
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password: 'TempPassword123!', role })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registry failed.');

        const mockUser = { uid: 'mock-uid-' + email.replace(/[^a-zA-Z0-9]/g, ''), email };
        setUser(mockUser);
        setProfile(data.profile);
        localStorage.setItem('mockProfile', JSON.stringify(data.profile));
        return { user: mockUser };
      }
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      if (auth && googleProvider && isRealFirebase) {
        const result = await signInWithPopup(auth, googleProvider);
        return result;
      } else {
        // Mock direct login simulation
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'Google_Aura_User', email: 'harsha.google@gmail.com', password: 'TempPassword123!', role: 'Student' })
        }).catch(() => null);

        const loadedProfile: UserProfile = {
          username: 'Google_Aura_User',
          email: 'harsha.google@gmail.com',
          role: 'Student',
          level: 2,
          xp: 1450,
          xpToNextLevel: 550,
          streak: 3,
          weeklyStreak: 2,
          completedTopics: ['react-fundamentals'],
          completedQuizzedTopics: [],
          bookmarks: [],
          completedChallenges: [],
          completedProjects: [],
          timeSpentMinutes: 30,
          consistencyScore: 98,
          projectedCompletionDate: '2026-11-20',
          notes: {}
        };
        const mockUser = { uid: 'mock-google-12345', email: 'harsha.google@gmail.com', displayName: 'Google Aura User' };
        setUser(mockUser);
        setProfile(loadedProfile);
        localStorage.setItem('mockProfile', JSON.stringify(loadedProfile));
        return { user: mockUser };
      }
    } finally {
      setLoading(false);
    }
  };

  const loginGithub = async () => {
    setLoading(true);
    try {
      if (auth && githubProvider && isRealFirebase) {
        const result = await signInWithPopup(auth, githubProvider);
        return result;
      } else {
        // Mock direct login simulation
        const loadedProfile: UserProfile = {
          username: 'Github_Octo_Master',
          email: 'github.developer@octo.net',
          role: 'Student',
          level: 3,
          xp: 2200,
          xpToNextLevel: 800,
          streak: 5,
          weeklyStreak: 3,
          completedTopics: ['es6-basics', 'js-promises'],
          completedQuizzedTopics: [],
          bookmarks: [],
          completedChallenges: [],
          completedProjects: [],
          timeSpentMinutes: 55,
          consistencyScore: 96,
          projectedCompletionDate: '2026-11-15',
          notes: {}
        };
        const mockUser = { uid: 'mock-github-12345', email: 'github.developer@octo.net', displayName: 'Github Octo Master' };
        setUser(mockUser);
        setProfile(loadedProfile);
        localStorage.setItem('mockProfile', JSON.stringify(loadedProfile));
        return { user: mockUser };
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAnonymous = async () => {
    setLoading(true);
    try {
      if (auth && isRealFirebase) {
        const result = await signInAnonymously(auth);
        return result;
      } else {
        const guestProfile: UserProfile = {
          username: 'Interstellar_Guest',
          email: 'guest@webdevacademy.edu',
          role: 'Student',
          level: 1,
          xp: 0,
          xpToNextLevel: 1000,
          streak: 1,
          weeklyStreak: 1,
          completedTopics: [],
          completedQuizzedTopics: [],
          bookmarks: [],
          completedChallenges: [],
          completedProjects: [],
          timeSpentMinutes: 0,
          consistencyScore: 85,
          projectedCompletionDate: '2026-12-15',
          notes: {}
        };
        const mockUser = { uid: 'mock-guest-777', isAnonymous: true, email: 'guest@webdevacademy.edu' };
        setUser(mockUser);
        setProfile(guestProfile);
        localStorage.setItem('mockProfile', JSON.stringify(guestProfile));
        return { user: mockUser };
      }
    } finally {
      setLoading(false);
    }
  };

  const performPasswordReset = async (email: string) => {
    if (auth && isRealFirebase) {
      await sendPasswordResetEmail(auth, email);
    } else {
      await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    }
  };

  const performEmailVerification = async () => {
    if (auth && auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      console.log("Mock verification sent to profile.");
    }
  };

  const phoneOTPVerify = async (phoneNumber: string, otp: string) => {
    // Simulating Phone login
    const loadedProfile: UserProfile = {
      username: `OTP_Cadet_${phoneNumber.slice(-4)}`,
      email: `${phoneNumber}@phone-otp.net`,
      role: 'Student',
      level: 1,
      xp: 250,
      xpToNextLevel: 750,
      streak: 1,
      weeklyStreak: 1,
      completedTopics: [],
      completedQuizzedTopics: [],
      bookmarks: [],
      completedChallenges: [],
      completedProjects: [],
      timeSpentMinutes: 8,
      consistencyScore: 88,
      projectedCompletionDate: '2026-12-10',
      notes: {}
    };
    const mockUser = { uid: 'mock-phone-otp-' + phoneNumber, email: `${phoneNumber}@phone-otp.net` };
    setUser(mockUser);
    setProfile(loadedProfile);
    localStorage.setItem('mockProfile', JSON.stringify(loadedProfile));
    return { user: mockUser };
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (auth && isRealFirebase) {
        await signOut(auth);
      } else {
        await fetch('/api/logout', { method: 'POST' });
        localStorage.removeItem('mockProfile');
      }
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      rememberMe,
      setRememberMe,
      loginEmailPassword,
      registerEmailPassword,
      loginGoogle,
      loginGithub,
      loginAnonymous,
      performPasswordReset,
      performEmailVerification,
      phoneOTPVerify,
      logout,
      syncProfileData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be invoked within an AuthProvider capsule");
  return context;
}
