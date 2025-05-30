import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import useUserStore from '../store/userStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, username, user } = useUserStore();
  const {
    courses,
    enrolledCourses,
    userProgress,
    loading,
    error,
    fetchUserEnrollments,
    fetchUserProgress,
    fetchCourses,
    getCourseById,
    getCourseCompletionPercentage,
    getCompletedLessons,
    initialize
  } = useCourseStore();

  const [stats, setStats] = useState({
    totalHours: 0,
    completedLessons: 0,
    streak: 12
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/login');
    }
  }, [isLoggedIn, navigate]);

  // Initialize store and fetch user data
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      const initializeData = async () => {
        await initialize(user.id);
        await fetchUserEnrollments(user.id);
        await fetchUserProgress(user.id);
      };
      initializeData();
    }
  }, [isLoggedIn, user?.id, initialize, fetchUserEnrollments, fetchUserProgress]);

  // Calculate stats from enrolled courses
  useEffect(() => {
    if (enrolledCourses.length > 0 && courses.length > 0) {
      let totalHours = 0;
      let completedLessons = 0;

      enrolledCourses.forEach(courseId => {
        const course = getCourseById(courseId);
        if (course) {
          totalHours += parseFloat(course.duration) || 0;
          // Get all completed items for this course (lessons, quizzes, assignments)
          const courseProgress = userProgress[courseId] || {};
          const completedItems = Object.values(courseProgress).filter(
            item => item.completed
          ).length;
          completedLessons += completedItems;
        }
      });

      setStats({
        totalHours: Math.round(totalHours * 10) / 10,
        completedLessons,
        streak: 12 // You can implement streak calculation based on your needs
      });
    }
  }, [enrolledCourses, courses, getCourseById, userProgress]);

  const handleContinueLearning = (courseId, slug) => {
    navigate(`/courses/${slug}?cid=${courseId}`);
  };

  // Fixed function to get lesson title from course data
  const getLessonTitle = (courseId, lessonId) => {
    const course = getCourseById(courseId);
    if (!course || !course.modules) return 'Unknown Lesson';

    // Handle synthetic lesson IDs for quizzes and assignments
    if (lessonId.toString().startsWith('quiz-')) {
      const quizId = lessonId.toString().replace('quiz-', '');
      for (const module of course.modules) {
        const lesson = module.lessons?.find(l => 
          l.type === 'quiz' && l.quizData?.id.toString() === quizId
        );
        if (lesson) return lesson.title;
      }
      return 'Module Quiz';
    }

    if (lessonId.toString().startsWith('assignment-')) {
      const assignmentId = lessonId.toString().replace('assignment-', '');
      for (const module of course.modules) {
        const lesson = module.lessons?.find(l => 
          l.type === 'assignment' && l.assignmentData?.id.toString() === assignmentId
        );
        if (lesson) return lesson.title;
      }
      return 'Module Assignment';
    }

    // Handle regular lesson IDs
    for (const module of course.modules) {
      const lesson = module.lessons?.find(l => l.id.toString() === lessonId.toString());
      if (lesson) return lesson.title;
    }

    return 'Unknown Lesson';
  };

  const getEnrolledCoursesData = () => {
    return enrolledCourses.map(courseId => {
      const course = getCourseById(courseId);
      if (!course) return null;

      // Calculate progress correctly using the course's total lessons
      const courseProgress = userProgress[courseId] || {};
      const completedCount = Object.values(courseProgress).filter(
        item => item.completed
      ).length;
      
      // Get total lessons from the course data (including quizzes and assignments)
      const totalLessons = course.totalLessons || 0;
      const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        ...course,
        progress,
        completedLessons: completedCount,
        totalLessons
      };
    }).filter(Boolean);
  };

  const getRecentActivity = () => {
    // Get recent completed lessons across all courses
    const recentActivities = [];
        
    Object.entries(userProgress).forEach(([courseId, courseProgress]) => {
      const course = getCourseById((courseId));
      if (course) {
        Object.entries(courseProgress).forEach(([lessonId, lessonProgress]) => {
          if (lessonProgress.completed && lessonProgress.completedAt) {
            const lessonTitle = getLessonTitle((courseId), lessonId);
            
            recentActivities.push({
              id: `${courseId}-${lessonId}`,
              courseTitle: course.title,
              courseId: (courseId),
              lessonId,
              lessonTitle,
              completedAt: new Date(lessonProgress.completedAt),
              type: lessonId.toString().startsWith('quiz-') ? 'quiz' :
                     lessonId.toString().startsWith('assignment-') ? 'assignment' : 'lesson',
              score: lessonProgress.score || null
            });
          }
        });
      }
    });

    // Sort by completion date (most recent first) and take top 5
    return recentActivities
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 5);
  };

  const getRecommendations = () => {
    // Get courses not enrolled in, sorted by rating
    return courses
      .filter(course => !enrolledCourses.includes(course.id))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  };

  if (!isLoggedIn) {
    return null;
  }

  const enrolledCoursesData = getEnrolledCoursesData();
  const recentActivity = getRecentActivity();
  const recommendations = getRecommendations();
   
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            Welcome back, {username || user?.full_name || 'Student'}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full mb-2 sm:mb-0 self-center sm:self-auto">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="sm:ml-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.totalHours}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-full mb-2 sm:mb-0 self-center sm:self-auto">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="sm:ml-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Completed Items</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-full mb-2 sm:mb-0 self-center sm:self-auto">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <div className="sm:ml-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Day Streak</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.streak}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Continue Learning</h2>
              </div>
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="flex justify-center py-6 sm:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : enrolledCoursesData.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {enrolledCoursesData.map(course => (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <img 
                            src={course.image || '/placeholder-course.jpg'} 
                            alt={course.title}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{course.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">
                              {course.completedLessons} of {course.totalLessons} items completed
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-2 sm:mb-3">
                              <div 
                                className="bg-emerald-600 h-1.5 sm:h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs sm:text-sm font-medium text-emerald-600">{course.progress}% Complete</span>
                              <button 
                                onClick={() => handleContinueLearning(course.id, course.slug)}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 text-white text-xs sm:text-sm rounded-lg hover:bg-emerald-700 transition-colors flex-shrink-0"
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-500 mb-4 text-sm sm:text-base">You haven't enrolled in any courses yet</p>
                    <button 
                      onClick={() => navigate('/courses')}
                      className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-4 sm:p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-start space-x-2 sm:space-x-3">
                        <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                          activity.type === 'quiz' ? 'bg-purple-100' :
                          activity.type === 'assignment' ? 'bg-orange-100' : 'bg-green-100'
                        }`}>
                          {activity.type === 'quiz' ? (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : activity.type === 'assignment' ? (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.lessonTitle}</p>
                          <p className="text-xs text-gray-500 truncate">{activity.courseTitle}</p>
                          <p className="text-xs text-gray-400">
                            {activity.completedAt.toLocaleDateString()}
                          </p>
                          {activity.score && (
                            <p className="text-xs text-blue-600 font-medium">Score: {activity.score}%</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs sm:text-sm">No recent activity</p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recommended for You</h3>
              </div>
              <div className="p-4 sm:p-6">
                {recommendations.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {recommendations.map(course => (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-2.5 sm:p-3 hover:shadow-md transition-shadow cursor-pointer"
                           onClick={() => navigate(`/courses/${course.slug}?cid=${course.id}`)}>
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2">{course.title}</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <div className="flex items-center">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-xs text-gray-600 ml-0.5 sm:ml-1">{course.rating}</span>
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm text-blue-600 font-medium">
                            ${course.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs sm:text-sm">No recommendations available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;