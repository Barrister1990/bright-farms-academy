import { Heart, Sprout } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-400 to-green-500 p-2 rounded-lg shadow-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-white">
                  Bright Farm Academy
                </h3>
                <p className="text-green-200 text-sm">
                  Growing Knowledge, Cultivating Success
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-8">
              <a 
                href="/privacy" 
                className="text-green-200 hover:text-white transition-colors duration-200 text-sm font-medium hover:underline underline-offset-4"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-green-200 hover:text-white transition-colors duration-200 text-sm font-medium hover:underline underline-offset-4"
              >
                Terms of Service
              </a>
              <a 
                href="/contact" 
                className="text-green-200 hover:text-white transition-colors duration-200 text-sm font-medium hover:underline underline-offset-4"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-green-700 my-6"></div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-green-200 text-sm">
              <span>© 2025 Bright Farm Academy. All rights reserved.</span>
            </div>

            {/* Made with Love */}
            <div className="flex items-center space-x-2 text-green-200 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current animate-pulse" />
              <span>for farmers worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
    </footer>
  );
};

export default Footer;