import { useState } from 'react';
import { Link } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import useUserStore from '../store/userStore'; // Import user store

const Home = () => {
  const [email, setEmail] = useState('');
  
  // Get data from the course store
  const { 
    categories, 
    getFeaturedCourses,
    getBestsellerCourses 
  } = useCourseStore();
  
  // Zustand store for user authentication
  const { isLoggedIn, user, login, logout } = useUserStore();
  
  // Get featured and bestseller courses
  const featuredCourses = getFeaturedCourses();
  const bestsellerCourses = getBestsellerCourses();
  
  // Use featured courses, fallback to bestsellers if no featured courses
  const displayCourses = featuredCourses.length > 0 ? featuredCourses : bestsellerCourses;

  // Static data for benefits (keeping as is since it's UI-specific)
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
    // Handle newsletter subscription logic here
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  // Function to get personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-500 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("src/assets/hero.jpg")' }}
        ></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {isLoggedIn ? (
              // Logged in user hero
              <>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  {getGreeting()}, <span className="text-emerald-200">{user?.username || 'Farmer'}!</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-emerald-50 max-w-2xl mx-auto">
                  Ready to continue your agricultural learning journey? Explore new courses and master advanced farming techniques.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/dashboard"
                    className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue Learning
                  </Link>
                  <Link 
                    to="/courses"
                    className="bg-emerald-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-400 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-emerald-400"
                  >
                    Explore Courses
                  </Link>
                </div>
              </>
            ) : (
              // Guest user hero
              <>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Grow Your Knowledge with <span className="text-emerald-200">Bright Farm Academy</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-emerald-50 max-w-2xl mx-auto">
                  Join thousands of learners in mastering modern agriculture techniques and sustainable farming practices
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/courses"
                    className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Browse Courses
                  </Link>
                  <Link 
                    to="/auth/register"
                    className="bg-emerald-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-400 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-emerald-400"
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
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Continue Learning */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Continue Learning</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Pick up where you left off in your enrolled courses
                </p>
                <Link 
                  to="/dashboard"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  View My Courses
                </Link>
              </div>

              {/* Learning Progress */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Your Progress</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Track your learning achievements and milestones
                </p>
                <Link 
                  to="/progress"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300"
                >
                  View Progress
                </Link>
              </div>

              {/* Wishlist */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Your Wishlist</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Courses you've saved for later
                </p>
                <Link 
                  to="/wishlist"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-300"
                >
                  View Wishlist
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {isLoggedIn ? 'Explore More Categories' : 'Popular Categories'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isLoggedIn 
                ? 'Discover new areas of expertise to expand your farming knowledge'
                : 'Explore our comprehensive range of agricultural courses designed for modern farmers'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
                <p className="text-gray-600 text-sm mb-3">
                  {category.description.length > 50 
                    ? `${category.description.substring(0, 50)}...` 
                    : category.description
                  }
                </p>
                <span className="text-emerald-600 font-medium text-sm">
                  {category.courses}+ courses
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Show only for non-logged in users */}
      {!isLoggedIn && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Why Choose Bright Farm Academy?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We provide the best learning experience for aspiring and experienced farmers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="text-4xl mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses Section */}
      <section className={`py-16 ${isLoggedIn ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {isLoggedIn ? 'Recommended for You' : 'Featured Courses'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isLoggedIn 
                ? 'Based on your interests and learning history, here are some courses you might enjoy'
                : 'Start your learning journey with our most popular and highly-rated courses'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCourses.slice(0, 4).map((course) => (
              <div 
                key={course.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    ${course.price}
                  </div>
                  {course.bestseller && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Bestseller
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
                    By {course.instructor.name}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-gray-400 text-sm ml-1">
                        ({course.reviewsCount})
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {course.studentsCount.toLocaleString()} students
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-3">📚 {course.totalLessons} lessons</span>
                      <span>⏱️ {course.duration}</span>
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
                    <Link 
                      to={`/courses/${course.slug || course.id}`}
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
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              to="/courses"
              className="inline-block bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-colors duration-300"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section - Modified for logged-in users */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isLoggedIn ? 'Stay Ahead with Premium Tips' : 'Stay Updated with Farming Tips'}
            </h2>
            <p className="text-lg mb-8 text-emerald-100">
              {isLoggedIn 
                ? 'Get exclusive farming insights, advanced techniques, and early access to new courses'
                : 'Get weekly farming tips, course updates, and exclusive content delivered to your inbox'
              }
            </p>
            {!isLoggedIn ? (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/premium"
                  className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
                >
                  Upgrade to Premium
                </Link>
                <Link 
                  to="/newsletter"
                  className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors duration-300"
                >
                  Manage Subscription
                </Link>
              </div>
            )}
            <p className="text-sm text-emerald-200 mt-4">
              Join 10,000+ farmers already subscribed to our newsletter
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {isLoggedIn 
              ? 'Ready to Take Your Farming to the Next Level?' 
              : 'Ready to Transform Your Farming Knowledge?'
            }
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            {isLoggedIn 
              ? 'Explore advanced courses and connect with fellow farmers in our community'
              : 'Join thousands of successful farmers who have improved their skills and increased their yields with our courses'
            }
          </p>
          {isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/courses?level=advanced"
                className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Browse Advanced Courses
              </Link>
              <Link 
                to="/community"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Join Community
              </Link>
            </div>
          ) : (
            <Link 
              to="/auth/register"
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Start Learning Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;