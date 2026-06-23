import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

interface FirebaseContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  profile: null,
  loading: true,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocGet = await getDoc(userDocRef);
          
          if (!userDocGet.exists() && currentUser.email === 'new2020.jeonil@gmail.com') {
            const adminProfile = {
              userId: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || '전일미디어 관리자',
              tier: 'Legend Tier',
              role: 'Admin',
              referredByEmail: '',
              ancestors: [],
              phoneNumber: '',
              createdAt: serverTimestamp()
            };
            try {
              await setDoc(userDocRef, adminProfile);
            } catch (writeErr) {
              console.error("Failed to write auto-created admin profile to Firestore:", writeErr);
            }
          }

          // Real-time listener for the user profile document
          unsubscribeProfile = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              setProfile(snap.data());
            } else {
              // Fallback if document doesn't exist yet but user is authenticated
              setProfile({
                userId: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '유저',
                tier: 'Basic',
                role: 'User',
                createdAt: new Date()
              });
            }
          }, (err) => {
            console.error("onSnapshot error on user profile:", err);
          });
        } catch (error) {
          console.error("Error fetching user profile initial doc:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, profile, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};
