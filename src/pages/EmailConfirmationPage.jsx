import { ArrowRight, CheckCircle, Mail, Sprout } from 'lucide-react';
import { useEffect, useState } from 'react';

const EmailConfirmationPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className={`w-full max-w-lg transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          
          {/* Branding */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-green-400 to-green-500 p-3 rounded-xl shadow-lg animate-bounce">
                <Sprout className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors duration-200">
              Bright Farm Academy
            </h1>
          </div>

          {/* Success animation */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-green-500 rounded-full p-4 shadow-lg">
                <CheckCircle className="h-16 w-16 text-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Main message */}
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                Email Confirmed! 🎉
              </h2>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Mail className="h-5 w-5" />
                <span className="text-lg font-medium">Your account is now verified</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
              <p className="text-gray-700 text-lg leading-relaxed">
                Welcome to <span className="font-semibold text-green-600">Bright Farm Academy</span>! 
                Your email has been successfully confirmed and your account is now active.
              </p>
            </div>

            {/* Features highlight */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-green-100 transform hover:scale-105 transition-transform duration-200">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Sprout className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">Interactive Learning</h3>
                  <p className="text-sm text-gray-600">Hands-on agricultural education</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl border border-blue-100 transform hover:scale-105 transition-transform duration-200 delay-100">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">Expert Guidance</h3>
                  <p className="text-sm text-gray-600">Learn from industry professionals</p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="pt-6">
              <button 
                onClick={() => window.location.href = '/auth/login'}
                className="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span className="text-lg">Start Your Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Footer message */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                You can now access all features of Bright Farm Academy.
                <br />
                <span className="text-green-600 font-medium">Let's grow together! 🌱</span>
              </p>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-6 -right-6 w-4 h-4 bg-green-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 -left-8 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-1000"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmailConfirmationPage;