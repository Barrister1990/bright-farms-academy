import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      isLoggedIn: false,
      user: null,
      isInitialized: false, // Track if auth state has been initialized
      
      // Computed properties as functions instead of getters
      getUsername: () => {
        const state = get();
        return state?.user?.username || null;
      },
      getEmail: () => {
        const state = get();
        return state?.user?.email || null;
      },
      getFullName: () => {
        const state = get();
        return state?.user?.fullName || null;
      },
      getRole: () => {
        const state = get();
        return state?.user?.role || 'student';
      },
      getIsStudent: () => {
        const state = get();
        return state?.user?.role === 'student';
      },
      getIsAdmin: () => {
        const state = get();
        return state?.user?.role === 'admin';
      },
      
      // Actions
      login: (userData) => set(() => ({
        isLoggedIn: true,
        isInitialized: true,
        user: {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          fullName: userData.fullName,
          role: userData.role || 'student'
        }
      })),
      
      logout: async () => {
        try {
          // Sign out from Supabase
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Error signing out:', error);
        }
        
        set(() => ({
          isLoggedIn: false,
          user: null,
          isInitialized: true
        }));
      },
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      
      // Initialize auth state from Supabase session
      initializeAuth: async () => {
        console.log('Starting auth initialization...');
        
        try {
          // First, check if we have a valid session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Error getting session:', sessionError);
            set(() => ({ 
              isLoggedIn: false, 
              user: null, 
              isInitialized: true 
            }));
            return;
          }
          
          if (session?.user) {
            console.log('Found active session for user:', session.user.id);
            
            // Get user profile data
            const { data: profileData, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
              // PGRST116 is "not found" - we can handle this gracefully
              console.error('Error fetching profile:', profileError);
            }
            
            // Update store with session data
            const userData = {
              id: session.user.id,
              email: session.user.email,
              username: profileData?.username || session.user.email?.split('@')[0] || 'user',
              fullName: profileData?.full_name || '',
              role: profileData?.role || 'student'
            };
            
            console.log('Setting user data:', userData);
            
            set(() => ({
              isLoggedIn: true,
              isInitialized: true,
              user: userData
            }));
          } else {
            console.log('No active session found');
            set(() => ({ 
              isLoggedIn: false, 
              user: null, 
              isInitialized: true 
            }));
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set(() => ({ 
            isLoggedIn: false, 
            user: null, 
            isInitialized: true 
          }));
        }
      },
      
      // Force reinitialize - useful for debugging
      forceReinitialize: async () => {
        set(() => ({ isInitialized: false }));
        await get().initializeAuth();
      },
      
      // Clear all data (for debugging)
      clearStore: () => {
        set(() => ({
          isLoggedIn: false,
          user: null,
          isInitialized: false
        }));
      },
      
      // Helper methods
      hasRole: (role) => {
        const state = get();
        const currentRole = state?.user?.role;
        return currentRole === role;
      },
      
      isAuthorized: (requiredRole) => {
        const state = get();
        const currentRole = state?.user?.role;
        if (requiredRole === 'admin') {
          return currentRole === 'admin';
        }
        if (requiredRole === 'student') {
          return currentRole === 'student' || currentRole === 'admin';
        }
        return false;
      }
    }),
    {
      name: 'user-storage', // localStorage key
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        // Don't persist isInitialized - always start fresh
      }),
      // Add some additional options to help with persistence issues
      version: 1, // Increment this if you change the store structure
      migrate: (persistedState, version) => {
        // Handle migration if needed
        if (version === 0) {
          // Reset the store if coming from version 0
          return {
            isLoggedIn: false,
            user: null,
          };
        }
        return persistedState;
      },
      // Ensure rehydration happens properly
      onRehydrateStorage: () => {
        console.log('Rehydrating user store...');
        return (state, error) => {
          if (error) {
            console.error('Error rehydrating store:', error);
          } else {
            console.log('Store rehydrated successfully:', state);
            // Force initialization after rehydration
            if (state && !state.isInitialized) {
              setTimeout(() => {
                state.initializeAuth();
              }, 100);
            }
          }
        };
      }
    }
  )
);

export default useUserStore;