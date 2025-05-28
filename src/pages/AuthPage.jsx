import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, Mail, Sprout, User, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import useUserStore from '../store/userStore';

const AuthPage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useUserStore();
  
  const [currentMode, setCurrentMode] = useState(mode || 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  
  const siteUrl = import.meta.env.VITE_SITE_URL;
  
  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: ''
  });

  // Update mode when route parameter changes
  useEffect(() => {
    if (mode && (mode === 'login' || mode === 'register')) {
      setCurrentMode(mode);
    } else {
      setCurrentMode('login');
      navigate('/auth/login', { replace: true });
    }
  }, [mode, navigate]);

  // Handle tab switching with URL update
  const handleModeSwitch = (newMode) => {
    setCurrentMode(newMode);
    setError(''); // Clear any errors when switching modes
    setShowConfirmation(false); // Hide confirmation screen
    navigate(`/auth/${newMode}`, { replace: true });
  };

  // Handle back to login from confirmation screen
  const handleBackToLogin = () => {
    setShowConfirmation(false);
    setCurrentMode('login');
    navigate('/auth/login', { replace: true });
  };

  // Function to resend confirmation email
  const resendConfirmationEmail = async (email) => {
    try {
      const redirectTo = `${siteUrl}/email-confirmation`;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectTo,
        }
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      return false;
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (authError) {
        // Check if the error is due to email not confirmed
        if (authError.message === 'Email not confirmed' || 
            authError.message.includes('not confirmed') ||
            authError.message.includes('verification')) {
          
          // Attempt to resend confirmation email
          // Resend confirmation email if email is not confirmed
          const redirectTo = `${siteUrl}/email-confirmation`;
          const {data:emailSent, error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: loginData.email,
            options: {
              emailRedirectTo: redirectTo, // Update with the correct redirect URL
            },
          });
          if (resendError) throw resendError;
          
          if (emailSent) {
            setUserEmail(loginData.email);
            setConfirmationMessage('Your email address is not verified yet. We\'ve sent you a new confirmation email.');
            setShowConfirmation(true);
          } else {
            setError('Your email is not confirmed. Please check your email for the confirmation link or try again later.');
          }
          return;
        }
        
        throw authError;
      }

      // Get user profile data including role
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Still proceed with login even if profile fetch fails
      }

      // Update Zustand store
      login({
        id: authData.user.id,
        email: authData.user.email,
        username: profileData?.username || authData.user.email.split('@')[0],
        fullName: profileData?.full_name || '',
        role: profileData?.role || 'student'
      });

      // Navigate to intended destination or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign up with Supabase
      const redirectTo = `${siteUrl}/email-confirmation`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            username: registerData.username,
            full_name: registerData.fullName,
           
          },
           emailRedirectTo: redirectTo,
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              username: registerData.username,
              full_name: registerData.fullName,
              email: registerData.email,
              role: 'student' // Default role
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't throw here as the auth account was created successfully
        }

        // If user is immediately confirmed (no email verification required)
        if (authData.session) {
          // Update Zustand store
          login({
            id: authData.user.id,
            email: authData.user.email,
            username: registerData.username,
            fullName: registerData.fullName,
            role: 'student'
          });

          navigate('/dashboard', { replace: true });
        } else {
          // User needs to verify email - show confirmation screen
          setUserEmail(registerData.email);
          setConfirmationMessage('Account created successfully! Please check your email to verify your account.');
          setShowConfirmation(true);
        }
      }

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const tabVariants = {
    inactive: {
      backgroundColor: 'transparent',
      color: '#6B7280'
    },
    active: {
      backgroundColor: '#10B981',
      color: '#FFFFFF'
    }
  };

  const formVariants = {
    hidden: { 
      opacity: 0, 
      x: currentMode === 'login' ? -50 : 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: currentMode === 'login' ? 50 : -50,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  const confirmationVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-green-400 to-green-500 p-3 rounded-xl shadow-lg">
              <Sprout className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors duration-200">
            Bright Farm Academy
          </h1>
          <p className="text-gray-600 mt-2">
            {showConfirmation ? 'Email Verification Required' : 'Welcome back to your learning journey'}
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {showConfirmation ? (
              // Email Confirmation Screen
              <motion.div
                key="confirmation"
                variants={confirmationVariants}
                initial="hidden"
                animate="visible"
                className="p-8 text-center"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-800 mb-4"
                >
                  Check Your Email!
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <Mail className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      {confirmationMessage}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Confirmation email sent to:
                    </p>
                    <p className="font-semibold text-green-700 text-sm mt-1">
                      {userEmail}
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    Please click on the link in your email to verify your account and start enjoying your learning journey with Bright Farm Academy.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <p className="text-yellow-800 text-xs">
                      💡 <strong>Tip:</strong> Check your spam folder if you don't see the email in your inbox.
                    </p>
                  </div>
                </motion.div>

                {/* Back to Login Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={handleBackToLogin}
                  className="mt-6 inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Login</span>
                </motion.button>
              </motion.div>
            ) : (
              <>
                {/* Tab Headers */}
                <div className="flex bg-gray-50 p-1 m-6 rounded-xl">
                  <motion.button
                    variants={tabVariants}
                    animate={currentMode === 'login' ? 'active' : 'inactive'}
                    onClick={() => handleModeSwitch('login')}
                    className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    <Lock className="h-4 w-4" />
                    <span>Login</span>
                  </motion.button>
                  <motion.button
                    variants={tabVariants}
                    animate={currentMode === 'register' ? 'active' : 'inactive'}
                    onClick={() => handleModeSwitch('register')}
                    className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Register</span>
                  </motion.button>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Form Content */}
                <div className="p-6 pt-0">
                  <AnimatePresence mode="wait">
                    {currentMode === 'login' ? (
                      <motion.form
                        key="login"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onSubmit={handleLoginSubmit}
                        className="space-y-5"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <motion.div 
                            variants={inputVariants}
                            whileFocus="focus"
                            className="relative"
                          >
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="email"
                              value={loginData.email}
                              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your email"
                              required
                              disabled={loading}
                            />
                          </motion.div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <motion.div 
                            variants={inputVariants}
                            whileFocus="focus"
                            className="relative"
                          >
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              value={loginData.password}
                              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your password"
                              required
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              disabled={loading}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </motion.div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                              disabled={loading}
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                          </label>
                          <a href="#" className="text-sm text-green-600 hover:text-green-500">
                            Forgot password?
                          </a>
                        </div>

                        <motion.button
                          type="submit"
                          whileHover={{ scale: loading ? 1 : 1.02 }}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                        >
                          {loading ? 'Signing In...' : 'Sign In'}
                        </motion.button>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="register"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onSubmit={handleRegisterSubmit}
                        className="space-y-5"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                          </label>
                          <motion.div 
                            variants={inputVariants}
                            whileFocus="focus"
                            className="relative"
                          >
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={registerData.username}
                              onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="Choose a username"
                              required
                              disabled={loading}
                            />
                          </motion.div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <motion.div 
                            variants={inputVariants}
                            whileFocus="focus"
                            className="relative"
                          >
                            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={registerData.fullName}
                              onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your full name"
                              required
                              disabled={loading}
                            />
                          </motion.div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <motion.div 
                            variants={inputVariants}
                            whileFocus="focus"
                            className="relative"
                          >
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="email"
                              value={registerData.email}
                              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your email"
                              required
                              disabled={loading}
                            />
                          </motion.div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <motion.div 
                            variants={inputVariants}
                            whileFocus="focus"
                            className="relative"
                          >
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              value={registerData.password}
                              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="Create a password"
                              required
                              disabled={loading}
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              disabled={loading}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </motion.div>
                        </div>

                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50" 
                            required 
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            I agree to the <a href="#" className="text-green-600 hover:text-green-500">Terms & Conditions</a>
                          </span>
                        </div>

                        <motion.button
                          type="submit"
                          whileHover={{ scale: loading ? 1 : 1.02 }}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                        >
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </motion.button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        {!showConfirmation && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-gray-600 mt-6"
          >
            {currentMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => handleModeSwitch(currentMode === 'login' ? 'register' : 'login')}
              className="text-green-600 hover:text-green-500 font-semibold"
              disabled={loading}
            >
              {currentMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;