import { Calendar, Clock, Edit, Eye, Filter, Search, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import useAdminCourseStore from '../store/adminCourseStore';

const AdminCoursesPage = () => {
  // Get store data and actions
  const {
    courses,
    categories,
    instructors,
    searchQuery,
    filters,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    loading,
    error,
    setSearchQuery,
    setFilters,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    clearFilters,
    getFilteredCourses,
    getPaginatedCourses,
    getDashboardStats,
    getCategoryById,
    getInstructorById,
    toggleCourseStatus,
    publishCourse,
    initialize,
    refreshData,
    clearError,
    unpublishCourse,
  } = useAdminCourseStore();

  // Local state for UI
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery);
  const [localFilterStatus, setLocalFilterStatus] = useState(filters.status);
  const [localFilterLevel, setLocalFilterLevel] = useState(filters.level);
  const [localSortBy, setLocalSortBy] = useState(`${sortBy}-${sortOrder}`);
  const [showFilters, setShowFilters] = useState(false);

  // Get paginated courses
  const paginatedData = getPaginatedCourses();
  const dashboardStats = getDashboardStats();
  useEffect(() => {
    initialize();
  }, []);
  // Update store when local filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(localSearchTerm);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, setSearchQuery]);

  useEffect(() => {
    setFilters({ status: localFilterStatus });
  }, [localFilterStatus, setFilters]);

  useEffect(() => {
    setFilters({ level: localFilterLevel });
  }, [localFilterLevel, setFilters]);

  useEffect(() => {
    const [field, order] = localSortBy.split('-');
    setSortBy(field);
    setSortOrder(order);
  }, [localSortBy, setSortBy, setSortOrder]);

  const handleEditCourse = (slug) => {
    // In a real app, this would use your router (e.g., React Router)
    console.log(`Navigate to: /admin/course/${slug}`);
    alert(`Navigating to edit course: ${slug}`);
  };

  const handleViewCourse = (slug) => {
    console.log(`View course: ${slug}`);
    alert(`Viewing course: ${slug}`);
  };

  const handleToggleStatus = (courseId) => {
    toggleCourseStatus(courseId);
  };

  const handlePublishCourse = (courseId) => {
    publishCourse(courseId);
  };

  const handleUnpublishCourse = (courseId) => {
    unpublishCourse(courseId);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      published: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusStyles[status] || statusStyles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getLevelBadge = (level) => {
    const levelStyles = {
      'Beginner': 'bg-blue-100 text-blue-800',
      'Intermediate': 'bg-purple-100 text-purple-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelStyles[level] || 'bg-gray-100 text-gray-800'}`}>
        {level}
      </span>
    );
  };

  const getCourseInstructor = (courseInstructorId) => {
    return getInstructorById(courseInstructorId);
  };

  const handleClearFilters = () => {
    clearFilters();
    setLocalSearchTerm('');
    setLocalFilterStatus('');
    setLocalFilterLevel('');
    setLocalSortBy('updatedAt-desc');
    setShowFilters(false);
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="Courses">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading courses...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout currentPage="Courses">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="Courses">
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Course Management</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage and edit your courses</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              {/* Mobile Search */}
              <div className="md:hidden mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="mt-3 w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Filter size={18} />
                  <span>Filters & Sort</span>
                </button>
              </div>

              {/* Mobile Filters (Collapsible) */}
              <div className={`md:hidden ${showFilters ? 'block' : 'hidden'} space-y-3 mb-4`}>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={localFilterStatus}
                  onChange={(e) => setLocalFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={localFilterLevel}
                  onChange={(e) => setLocalFilterLevel(e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={localSortBy}
                  onChange={(e) => setLocalSortBy(e.target.value)}
                >
                  <option value="updatedAt-desc">Recently Updated</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="studentsCount-desc">Most Students</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="price-desc">Price High-Low</option>
                  <option value="price-asc">Price Low-High</option>
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                </select>
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={localFilterStatus}
                  onChange={(e) => setLocalFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Level Filter */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={localFilterLevel}
                  onChange={(e) => setLocalFilterLevel(e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                {/* Sort */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={localSortBy}
                  onChange={(e) => setLocalSortBy(e.target.value)}
                >
                  <option value="updatedAt-desc">Recently Updated</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="studentsCount-desc">Most Students</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="price-desc">Price High-Low</option>
                  <option value="price-asc">Price Low-High</option>
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{dashboardStats.totalCourses}</p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Filter className="text-blue-600" size={16} />
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Published</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">{dashboardStats.publishedCourses}</p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="text-green-600" size={16} />
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">
                    {dashboardStats.totalStudents?.toLocaleString()}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="text-purple-600" size={16} />
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                    {dashboardStats.averageRating?.toFixed(1)}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="text-yellow-600" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Course List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Courses ({paginatedData.totalCourses})
                </h2>
                {(localSearchTerm || localFilterStatus || localFilterLevel) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm self-start sm:self-auto"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y">
              {paginatedData.courses.map((course) => {
                const instructor = getCourseInstructor(course.instructorId);
                return (
                  <div key={course.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Course Image */}
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full sm:w-20 h-48 sm:h-20 rounded-lg object-cover flex-shrink-0"
                      />

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            by {instructor?.name || 'Unknown Instructor'}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-2 sm:line-clamp-3">
                            {course.description}
                          </p>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {getStatusBadge(course.status)}
                          {getLevelBadge(course.level)}
                          {course.bestseller && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                              Bestseller
                            </span>
                          )}
                          {course.featured && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Course Stats */}
                        <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-6 gap-2 sm:gap-0 text-xs sm:text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span>{course.rating}</span>
                            <span className="hidden sm:inline">({course.reviewsCount})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users size={14} />
                            <span>{course.studentsCount.toLocaleString()}</span>
                            <span className="hidden sm:inline">students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1 col-span-2 sm:col-span-1">
                            <Calendar size={14} />
                            <span className="text-xs sm:text-sm">Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900">
                              ${course.price}
                            </span>
                            {course.originalPrice > course.price && (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  ${course.originalPrice}
                                </span>
                                <span className="text-sm text-green-600 font-medium">
                                  {course.discount}% off
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleViewCourse(course.slug)}
                              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                            
                            {course.status === 'draft' && (
                              <button
                                onClick={() => handlePublishCourse(course.id)}
                                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Publish
                              </button>
                            )}
                            
                            {course.status === 'published' && (
                              <button
                                onClick={() => handleUnpublishCourse(course.id)}
                                className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                              >
                                Unpublish
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleEditCourse(course.slug)}
                              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {paginatedData.totalPages > 1 && (
              <div className="px-4 sm:px-6 py-4 border-t">
                {/* Mobile Pagination */}
                <div className="sm:hidden flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    {currentPage} of {paginatedData.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === paginatedData.totalPages}
                    className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                {/* Desktop Pagination */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paginatedData.totalCourses)} of {paginatedData.totalCourses} courses
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, paginatedData.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border rounded-lg ${
                            currentPage === page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === paginatedData.totalPages}
                      className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {paginatedData.courses.length === 0 && (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCoursesPage;