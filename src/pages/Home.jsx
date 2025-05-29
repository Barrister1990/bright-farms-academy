import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import useUserStore from '../store/userStore';

const Home = () => {
  const [email, setEmail] = useState('');
  
  const { 
    categories, 
    courses,
    loading,
    error,
    getFeaturedCourses,
    getBestsellerCourses,
    fetchCategories,
    fetchCourses,
    initialize
  } = useCourseStore();
  
  const { isLoggedIn, user, login, logout } = useUserStore();
 
  useEffect(() => {
    const initializeData = async () => {
      try {
        const userId = isLoggedIn && user?.id ? user.id : null;
        await initialize(userId);
      } catch (error) {
        console.error('Error initializing home data:', error);
      }
    };

    initializeData();
  }, [isLoggedIn, user?.id, initialize]);

  const featuredCourses = getFeaturedCourses();
  const bestsellerCourses = getBestsellerCourses();
  const displayCourses = featuredCourses.length > 0 ? featuredCourses : bestsellerCourses;

  const benefits = [
    {
      icon: '👨‍🏫',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of farming experience'
    },
    {
      icon: '♾️',
      title: 'Lifetime Access',
      description: 'Access your courses anytime, anywhere, for as long as you need'
    },
    {
      icon: '🏆',
      title: 'Certificates',
      description: 'Get recognized certificates upon successful course completion'
    },
    {
      icon: '📱',
      title: 'Mobile Learning',
      description: 'Learn on-the-go with our mobile-optimized platform'
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Mobile Course Card Component
  const MobileCourseCard = ({ course }) => (
    <div className="flex-shrink-0 w-32 sm:w-36 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative">
        <img 
          src={course.image || '/api/placeholder/400/200'} 
          alt={course.title}
          className="w-full h-20 sm:h-24 object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/400/200';
          }}
        />
        <div className="absolute top-1 right-1 bg-emerald-500 text-white px-1 py-0.5 rounded text-xs font-medium">
          ${course.price || 0}
        </div>
        {course.bestseller && (
          <div className="absolute top-1 left-1 bg-orange-500 text-white px-1 py-0.5 rounded text-xs font-medium">
            Best
          </div>
        )}
        {course.featured && (
          <div className="absolute top-1 left-1 bg-blue-500 text-white px-1 py-0.5 rounded text-xs font-medium">
            Featured
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="text-xs font-medium text-gray-800 mb-1 line-clamp-2 leading-tight">
          {course.title}
        </h3>
        <div className="text-xs text-gray-500 mb-1">
          {course.instructor?.name || 'Unknown'}
        </div>
        <div className="flex items-center mb-1">
          <span className="text-yellow-400 text-xs mr-1">⭐</span>
          <span className="text-xs font-medium">{course.rating || 0}</span>
          <span className="text-gray-400 text-xs ml-1">
            ({course.reviewsCount || 0})
          </span>
        </div>
       
          <Link to={`/courses/${course.slug}?cid=${course.id}`}
          className="block bg-emerald-600 text-white py-1 px-2 rounded text-xs font-medium hover:bg-emerald-700 transition-colors duration-300 text-center"
        >
          {isLoggedIn ? 'Enroll' : 'View'}
        </Link>
      </div>
    </div>
  );

  // Desktop Course Card Component
  const DesktopCourseCard = ({ course }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="relative">
        <img 
          src={course.image || '/api/placeholder/400/200'} 
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/api/placeholder/400/200';
          }}
        />
        <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded text-sm font-semibold">
          ${course.price || 0}
        </div>
        {course.bestseller && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Bestseller
          </div>
        )}
        {course.featured && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
        {course.discount > 0 && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {course.discount}% OFF
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.shortDescription || course.description}
        </p>
        <div className="text-sm text-gray-500 mb-3">
          By {course.instructor?.name || 'Unknown Instructor'}
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">⭐</span>
            <span className="text-sm font-medium">{course.rating || 0}</span>
            <span className="text-gray-400 text-sm ml-1">
              ({course.reviewsCount || 0})
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {(course.studentsCount || 0).toLocaleString()} students
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-3">📚 {course.totalLessons || 0} lessons</span>
            <span>⏱️ {course.duration || '0 hours'}</span>
          </div>
        </div>
        {course.originalPrice && course.originalPrice > course.price && (
          <div className="flex items-center mb-2">
            <span className="text-gray-400 line-through text-sm mr-2">
              ${course.originalPrice}
            </span>
            <span className="text-emerald-600 font-semibold">
              ${course.price}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <Link to={`/courses/${course.slug}?cid=${course.id}`}
            className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300 text-center"
          >
            {isLoggedIn ? 'Enroll Now' : 'View Course'}
          </Link>
          {isLoggedIn && (
            <button className="bg-gray-200 text-gray-600 p-2 rounded-lg hover:bg-gray-300 transition-colors duration-300">
              ❤️
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile Course Loading Skeleton
  const MobileCourseLoadingSkeleton = () => (
    <div className="flex-shrink-0 w-32 sm:w-36 bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-20 sm:h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      <div className="p-2">
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-1"></div>
        <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-1 w-3/4"></div>
        <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-2 w-1/2"></div>
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
      </div>
    </div>
  );

  // Desktop Course Loading Skeleton
  const CourseLoadingSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        <div className="absolute top-3 right-3 w-12 h-6 bg-gray-300 rounded"></div>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/4"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-full"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-2/3"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-1/2"></div>
        </div>
        <div className="flex items-center justify-between mt-4 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-8"></div>
            <div className="h-3 bg-gray-300 rounded w-12"></div>
          </div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="flex items-center mb-4 space-x-4">
          <div className="h-3 bg-gray-300 rounded w-20"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg"></div>
      </div>
    </div>
  );

  const CourseErrorState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-8 md:py-16 px-4 md:px-6">
      <div className="relative mb-4 md:mb-8">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <div className="text-2xl md:text-4xl">⚠️</div>
        </div>
        <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-3 text-center">
        Oops! Something went wrong
      </h3>
      <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 text-center max-w-md px-4">
        We couldn't load the courses right now. Please check your connection and try again.
      </p>
      <button 
        onClick={() => initialize(isLoggedIn && user?.id ? user.id : null)}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-200 text-sm md:text-base"
      >
        Try Again
      </button>
    </div>
  );

  const CourseEmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-8 md:py-16 px-4 md:px-6">
      <div className="relative mb-4 md:mb-8">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
          <div className="text-2xl md:text-4xl">📚</div>
        </div>
        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center animate-bounce">
          <div className="text-white text-xs md:text-sm">✨</div>
        </div>
      </div>
      <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-3 text-center">
        No courses available yet
      </h3>
      <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 text-center max-w-md px-4">
        We're working on adding amazing courses for you. Check back soon for new learning opportunities!
      </p>
      <div className="flex space-x-3">
        <Link 
          to="/courses"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
        >
          Browse All Courses
        </Link>
      </div>
    </div>
  );

  const renderCoursesSection = () => {
    if (loading && courses.length === 0) {
      return (
        <>
          {/* Mobile Loading State */}
          <div className="block md:hidden">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {[...Array(6)].map((_, index) => (
                <MobileCourseLoadingSkeleton key={index} />
              ))}
            </div>
          </div>
          {/* Desktop Loading State */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <CourseLoadingSkeleton key={index} />
            ))}
          </div>
        </>
      );
    }

    if (error && courses.length === 0) {
      return <CourseErrorState />;
    }

    if (displayCourses.length === 0) {
      return <CourseEmptyState />;
    }

    return (
      <>
        {/* Mobile Course Grid */}
        <div className="block md:hidden">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {displayCourses.map((course) => (
              <MobileCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
        {/* Desktop Course Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCourses.slice(0, 4).map((course) => (
            <DesktopCourseCard key={course.id} course={course} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-500 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("src/assets/hero.jpg")' }}
        ></div>
        <div className="relative container mx-auto px-4 py-12 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {isLoggedIn ? (
              <>
                <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                  {getGreeting()}, <span className="text-emerald-200">{user?.username || user?.full_name || 'Farmer'}!</span>
                </h1>
                <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-8 text-emerald-50 max-w-2xl mx-auto">
                  Ready to continue your agricultural learning journey? Explore new courses and master advanced farming techniques.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Link 
                    to="/dashboard"
                    className="bg-white text-emerald-700 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue Learning
                  </Link>
                  <Link 
                    to="/courses"
                    className="bg-emerald-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-emerald-400 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-emerald-400"
                  >
                    Explore Courses
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                  Grow Your Knowledge with <span className="text-emerald-200">Bright Farm Academy</span>
                </h1>
                <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-8 text-emerald-50 max-w-2xl mx-auto">
                  Join thousands of learners in mastering modern agriculture techniques and sustainable farming practices
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Link 
                    to="/courses"
                    className="bg-white text-emerald-700 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Browse Courses
                  </Link>
                  <Link 
                    to="/auth/register"
                    className="bg-emerald-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-emerald-400 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-emerald-400"
                  >
                    Sign Up Free
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Personalized Section for Logged-in Users */}
      {isLoggedIn && (
        <section className="py-8 md:py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-2 md:mr-3">
                    <span className="text-lg md:text-2xl">📚</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">Continue Learning</h3>
                </div>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                  Pick up where you left off in your enrolled courses
                </p>
                <Link 
                  to="/dashboard"
                  className="inline-block bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 text-sm md:text-base"
                >
                  View My Courses
                </Link>
              </div>

              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mr-2 md:mr-3">
                    <span className="text-lg md:text-2xl">📊</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">Your Progress</h3>
                </div>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                  Track your learning achievements and milestones
                </p>
                <Link 
                  to="/progress"
                  className="inline-block bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 text-sm md:text-base"
                >
                  View Progress
                </Link>
              </div>

              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center mr-2 md:mr-3">
                    <span className="text-lg md:text-2xl">❤️</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">Your Wishlist</h3>
                </div>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                  Courses you've saved for later
                </p>
                <Link 
                  to="/wishlist"
                  className="inline-block bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-300 text-sm md:text-base"
                >
                  View Wishlist
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Categories Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
              {isLoggedIn ? 'Explore More Categories' : 'Popular Categories'}
            </h2>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
              {isLoggedIn 
                ? 'Discover new areas of expertise to expand your farming knowledge'
                : 'Explore our comprehensive range of agricultural courses designed for modern farmers'
              }
            </p>
          </div>
          
          {/* Mobile Categories - Horizontal Scroll */}
          <div className="block md:hidden">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  to={`/courses?category=${category.slug}`}
                  className="flex-shrink-0 w-24 bg-white rounded-lg p-3 shadow-sm text-center"
                >
                  <div className="text-2xl mb-2">
                    {category.icon}
                  </div>
                  <h3 className="text-xs font-medium text-gray-800 mb-1 leading-tight">
                    {category.name}
                  </h3>
                  <span className="text-emerald-600 font-medium text-xs">
                    {category.courses}+
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop Categories - Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/courses?category=${category.slug}`}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center group cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <span className="text-emerald-600 font-medium text-sm">
                  {category.courses}+ courses
                </span>
              </Link>
            ))}
          </div>
       </div>
      </section>

      {/* Featured/Popular Courses Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                {featuredCourses.length > 0 ? 'Featured Courses' : 'Popular Courses'}
              </h2>
              <p className="text-xs md:text-base text-gray-600">
                {isLoggedIn 
                  ? 'Continue your learning journey with these recommended courses'
                  : 'Start your agricultural learning journey with these top-rated courses'
                }
              </p>
            </div>
            <Link 
              to="/courses"
              className="mt-3 sm:mt-0 text-xs md:text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {renderCoursesSection()}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-8 md:py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
              Why Choose Bright Farm Academy?
            </h2>
            <p className="text-xs md:text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful farmers who have transformed their practices with our expert-led courses
            </p>
          </div>
          
          {/* Mobile Benefits - 2x2 Grid */}
          <div className="grid grid-cols-2 md:hidden gap-3">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-3 shadow-sm text-center"
              >
                <div className="text-lg mb-2">
                  {benefit.icon}
                </div>
                <h3 className="text-xs font-semibold text-gray-800 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-gray-600 leading-tight">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Desktop Benefits - Row Layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="text-4xl md:text-5xl mb-4 md:mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-16 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
            {isLoggedIn ? 'Ready to Learn More?' : 'Ready to Start Your Journey?'}
          </h2>
          <p className="text-sm md:text-xl mb-6 md:mb-8 text-emerald-100 max-w-2xl mx-auto">
            {isLoggedIn 
              ? 'Discover new courses and continue growing your agricultural expertise'
              : 'Join thousands of farmers who have transformed their practices with our courses'
            }
          </p>
          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link 
                to="/auth/register"
                className="bg-white text-emerald-700 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-sm md:text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link 
                to="/courses"
                className="bg-emerald-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-sm md:text-lg hover:bg-emerald-400 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-emerald-400"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <Link 
              to="/courses"
              className="inline-block bg-white text-emerald-700 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-sm md:text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore New Courses
            </Link>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      {!isLoggedIn && (
        <section className="py-8 md:py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-4">
                Stay Updated
              </h2>
              <p className="text-sm md:text-lg text-gray-600 mb-6 md:mb-8">
                Get the latest farming tips, course updates, and exclusive offers delivered to your inbox
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 md:px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-300 text-sm md:text-base whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-8 md:py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-xl md:text-3xl lg:text-4xl font-bold text-emerald-600 mb-1 md:mb-2">
                50K+
              </div>
              <div className="text-xs md:text-base text-gray-600">
                Students Enrolled
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-3xl lg:text-4xl font-bold text-emerald-600 mb-1 md:mb-2">
                200+
              </div>
              <div className="text-xs md:text-base text-gray-600">
                Expert Courses
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-3xl lg:text-4xl font-bold text-emerald-600 mb-1 md:mb-2">
                95%
              </div>
              <div className="text-xs md:text-base text-gray-600">
                Success Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-3xl lg:text-4xl font-bold text-emerald-600 mb-1 md:mb-2">
                24/7
              </div>
              <div className="text-xs md:text-base text-gray-600">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
        