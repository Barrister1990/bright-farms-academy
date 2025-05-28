import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, username } = useUserStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/login');
    }
  }, [isLoggedIn, navigate]);

  // Dummy enrolled courses data
const enrolledCourses = [
  {
    id: 'crop-production-masterclass',
    title: 'Complete Crop Production Management',
    description: 'Master modern farming techniques, soil management, and crop rotation. Build sustainable agricultural systems from the ground up.',
    thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=225&fit=crop',
    progress: 65,
    totalLessons: 45,
    completedLessons: 29
  },
  {
    id: 'advanced-soil-science',
    title: 'Advanced Soil Science & Fertility',
    description: 'Deep dive into soil composition, nutrient cycling, pH management, and organic matter enhancement.',
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=225&fit=crop',
    progress: 42,
    totalLessons: 38,
    completedLessons: 16
  },
  {
    id: 'livestock-management',
    title: 'Livestock Management & Breeding',
    description: 'Build profitable livestock operations with cattle, poultry, and swine management systems.',
    thumbnail: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=225&fit=crop',
    progress: 78,
    totalLessons: 52,
    completedLessons: 41
  },
  {
    id: 'precision-agriculture',
    title: 'Precision Agriculture & Data Analytics',
    description: 'Learn GPS technology, drone applications, IoT sensors and data-driven farming fundamentals.',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=225&fit=crop',
    progress: 23,
    totalLessons: 67,
    completedLessons: 15
  },
  {
    id: 'sustainable-farming',
    title: 'Sustainable Farming Practices',
    description: 'Master organic methods, permaculture design, water conservation, and eco-friendly pest management.',
    thumbnail: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=225&fit=crop',
    progress: 89,
    totalLessons: 34,
    completedLessons: 30
  },
  {
    id: 'greenhouse-hydroponics',
    title: 'Greenhouse & Hydroponic Systems',
    description: 'Design and manage controlled environment agriculture with hydroponic and aeroponic production systems.',
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=225&fit=crop',
    progress: 56,
    totalLessons: 41,
    completedLessons: 23
  }
];

  const handleContinueLearning = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (!isLoggedIn) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, <span className="text-emerald-600">{username}</span>! 👋
              </h1>
              <p className="mt-2 text-slate-600 text-lg">
                Continue your learning journey and achieve your goals
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
                <span className="text-emerald-700 font-medium">
                  {enrolledCourses.length} Courses Enrolled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-900">Learning Hours</h3>
                <p className="text-2xl font-bold text-emerald-600">47.5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-900">Completed</h3>
                <p className="text-2xl font-bold text-blue-600">154</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-900">Streak</h3>
                <p className="text-2xl font-bold text-purple-600">12 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">My Learning</h2>
            <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1">
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-slate-700">
                      {course.progress}% Complete
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleContinueLearning(course.id)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 18h6" />
                    </svg>
                    <span>Continue Learning</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to learn something new?</h3>
              <p className="text-emerald-100 text-lg">
                Explore thousands of courses and expand your skills
              </p>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="bg-white text-emerald-600 hover:bg-emerald-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Browse Courses</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;