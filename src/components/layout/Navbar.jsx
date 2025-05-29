import { LogOut, Menu, Sprout, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import useUserStore from '../../store/userStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  
  // Zustand store for user authentication
  const { isLoggedIn, user, login, logout } = useUserStore();
  console.log(user)
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Dashboard', href: '/dashboard' }
  ];

  const isActive = (path) => pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleAuthNavigation = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Mobile menu button - Left side */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="menu-button p-1.5 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center space-x-1.5 md:space-x-2">
              <div className="bg-gradient-to-r from-green-400 to-green-500 p-1.5 md:p-2 rounded-lg">
                <Sprout className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <Link 
                to="/" 
                className="text-sm md:text-xl font-bold text-gray-800 hover:text-green-600 transition-colors duration-200"
              >
                <span className="hidden sm:inline">Bright Farm Academy</span>
                <span className="sm:hidden">BFA</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-green-600 bg-green-50 border-b-2 border-green-500'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {user?.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/auth/login"
                    className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile User Avatar/Login */}
            <div className="md:hidden flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-md">
                  <User className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700 max-w-16 truncate">
                    {user?.username}
                  </span>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  className="px-2 py-1 text-xs font-medium text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Mobile Navigation Sidebar */}
        <div className={`mobile-menu fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-green-400 to-green-500 p-1.5 rounded-lg">
                <Sprout className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-800">BFA</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* User Section */}
          {isLoggedIn && (
            <div className="p-4 border-b border-gray-200 bg-green-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'Welcome back!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleNavClick}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-green-600 bg-green-50 border-l-4 border-green-500'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Auth Section */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-3 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/auth/login"
                  onClick={handleAuthNavigation}
                  className="block w-full px-3 py-2.5 text-center text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={handleAuthNavigation}
                  className="block w-full px-3 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium text-center rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;