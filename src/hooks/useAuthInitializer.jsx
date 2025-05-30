import { motion } from 'framer-motion';
import { Monitor, Sprout, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import useUserStore from '../store/userStore';

// Hook to initialize and manage auth state
const useAuthInitializer = () => {
  const { initializeAuth, login, logout, isInitialized } = useUserStore();

  useEffect(() => {
    // Initialize auth state when app loads
    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          // Update store with session data
          login({
            id: session.user.id,
            email: session.user.email,
            username: profileData?.username || session.user.email.split('@')[0],
            fullName: profileData?.full_name || '',
            role: profileData?.role || 'student'
          });
        } else if (event === 'SIGNED_OUT') {
          logout();
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [initializeAuth, login, logout]);

  return { isInitialized };
};

// Beautiful Loading Component
const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <motion.div 
              className="bg-gradient-to-r from-green-400 to-green-500 p-3 rounded-xl shadow-lg"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sprout className="h-8 w-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors duration-200">
            Bright Farm Academy
          </h1>
          <p className="text-gray-600 mt-2">Welcome back to your learning journey</p>
        </motion.div>

        {/* Enhanced Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          {/* Animated Loading Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{
                  y: [0, -12, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Loading Bar */}
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ width: '50%' }}
            />
          </div>

          {/* Loading Text */}
          <motion.p
            className="text-gray-500 text-sm mt-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Preparing your dashboard...
          </motion.p>
        </motion.div>

        {/* Floating Elements for Visual Appeal */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-300 rounded-full opacity-20"
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Mobile Admin Warning Component
const MobileAdminWarning = ({ onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Monitor className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Admin Panel on Mobile
              </p>
              <p className="text-xs opacity-90">
                For the best experience, we recommend using a larger screen
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Dismiss warning"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Check screen width
      const screenWidth = window.innerWidth <= 768;
      
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      
      // Consider it mobile if either condition is true
      setIsMobile(screenWidth || isMobileDevice);
    };

    // Check on mount
    checkIsMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

// Protected Route Component with enhanced admin access control and mobile warning
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isLoggedIn, isInitialized, user } = useUserStore();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  // Check if user is accessing admin routes on mobile
  useEffect(() => {
    if (location.pathname.startsWith('/admin') && isMobile && user?.role === 'admin') {
      setShowMobileWarning(true);
    } else {
      setShowMobileWarning(false);
    }
  }, [location.pathname, isMobile, user?.role]);

  // Show beautiful loading while initializing
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check for admin-only routes (any route starting with /admin)
  if (location.pathname.startsWith('/admin')) {
    // Only admins can access /admin/* routes
    if (user?.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Enhanced role checking for other routes
  if (requiredRole) {
    // If specific role is required and user doesn't have it
    if (user?.role !== requiredRole) {
      // Special cases where both admin and student can access
      const allowedRoutes = ['/dashboard', '/admin']; // Both roles can access these
      
      if (allowedRoutes.includes(location.pathname) && ['admin', 'student'].includes(user?.role)) {
        return (
          <>
            {showMobileWarning && (
              <MobileAdminWarning onDismiss={() => setShowMobileWarning(false)} />
            )}
            <div className={showMobileWarning ? 'pt-16' : ''}>
              {children}
            </div>
          </>
        );
      }
      
      // For /admin route specifically, allow both admin and student
      if (location.pathname === '/admin' && ['admin', 'student'].includes(user?.role)) {
        return (
          <>
            {showMobileWarning && (
              <MobileAdminWarning onDismiss={() => setShowMobileWarning(false)} />
            )}
            <div className={showMobileWarning ? 'pt-16' : ''}>
              {children}
            </div>
          </>
        );
      }
      
      // Otherwise redirect to dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <>
      {showMobileWarning && (
        <MobileAdminWarning onDismiss={() => setShowMobileWarning(false)} />
      )}
      <div className={showMobileWarning ? 'pt-16' : ''}>
        {children}
      </div>
    </>
  );
};

// Export everything at the bottom for better Fast Refresh compatibility
export { ProtectedRoute, useAuthInitializer };
