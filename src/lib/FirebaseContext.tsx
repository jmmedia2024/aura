import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { supabase } from './supabase';

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
    let profileSubscription: any = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (profileSubscription) {
        profileSubscription.unsubscribe();
        profileSubscription = null;
      }

      if (currentUser) {
        try {
          // Fetch initial profile from Supabase
          const { data: initialProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', currentUser.uid)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error("Error fetching Supabase profile:", error);
          }

          if (!initialProfile && currentUser.email === 'new2020.jeonil@gmail.com') {
            const adminProfile = {
              userId: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || '전일미디어 관리자',
              tier: 'Legend Tier',
              role: 'Admin',
              referredByEmail: '',
              ancestors: [],
              phoneNumber: '',
              createdAt: new Date().toISOString()
            };
            
            const { error: insertError } = await supabase
              .from('users')
              .insert([adminProfile]);
            
            if (insertError) {
              console.error("Failed to auto-create admin profile in Supabase:", insertError);
            } else {
              setProfile(adminProfile);
            }
          } else if (initialProfile) {
            setProfile(initialProfile);
          } else {
            // Fallback for newly authenticated user without a profile record yet
            setProfile({
              userId: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '유저',
              tier: 'Basic',
              role: 'User',
              createdAt: new Date().toISOString()
            });
          }

          // Subscribe to real-time changes
          profileSubscription = supabase
            .channel(`public:users:userId=eq.${currentUser.uid}`)
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'users',
                filter: `userId=eq.${currentUser.uid}`,
              },
              (payload) => {
                setProfile(payload.new);
              }
            )
            .subscribe();

        } catch (err) {
          console.error("Supabase profile setup error:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (profileSubscription) {
        profileSubscription.unsubscribe();
      }
    };
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, profile, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};
