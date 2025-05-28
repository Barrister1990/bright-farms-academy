import { LogOut, Menu, Sprout, User, X } from 'lucide-react';
import { useState } from 'react';
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

  return (
    <nav className="bg-white shadow-lg border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-green-400 to-green-500 p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <Link 
              to="/" 
              className="text-xl font-bold text-gray-800 hover:text-green-600 transition-colors duration-200"
            >
              Bright Farm Academy
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-green-100">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'text-green-600 bg-green-50 border-l-4 border-green-500'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Auth Section */}
          <div className="pt-4 border-t border-green-100">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg mx-3">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Welcome, {user?.username}!
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 mx-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-3">
                <Link
                  to="/auth/login"
                  onClick={handleAuthNavigation}
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={handleAuthNavigation}
                  className="block w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium text-center rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;