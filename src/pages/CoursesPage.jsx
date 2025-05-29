import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';

const CoursesPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchInput, setSearchInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  
  const {
    categories,
    searchQuery,
    filters,
    loading,
    error,
    setSearchQuery,
    setFilters,
    getFilteredCourses,
    setSelectedCategory,
    selectedCategory,
    fetchCourses,
    fetchCategories
  } = useCourseStore();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchCategories();
        await fetchCourses();
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };
    
    initializeData();
  }, [fetchCategories, fetchCourses]);

  const filteredCourses = getFilteredCourses();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      level: '',
      price: '',
      rating: '',
      duration: ''
    });
    setSelectedCategory(null);
    setSearchQuery('');
    setSearchInput('');
  };

  const sortCourses = (courses) => {
    switch (sortBy) {
      case 'price-low':
        return [...courses].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...courses].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...courses].sort((a, b) => b.rating - a.rating);
      case 'students':
        return [...courses].sort((a, b) => b.studentsCount - a.studentsCount);
      case 'newest':
        return [...courses].sort((a, b) => new Date(b.lastUpdated || b.created_at) - new Date(a.lastUpdated || a.created_at));
      default:
        return courses;
    }
  };

  const sortedCourses = sortCourses(filteredCourses);
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  const navigateToCourse = (course) => {
    navigate(`/courses/${course.slug}?cid=${course.id}`);
  };


  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const formatStudentsCount = (count) => {
    if (count >= 1000000) return `${Math.floor(count / 1000000)}M`;
    if (count >= 1000) return `${Math.floor(count / 1000)}k`;
    return count.toString();
  };

  // Loading state for courses section only
  const renderCoursesSection = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (sortedCourses.length > 0) {
      return (
        <>
          {/* Mobile: Horizontal Scrolling Cards (3 per row) */}
         <div className="md:hidden">
  <div className="grid grid-cols-2 gap-3 px-2">
    {sortedCourses.map((course) => (
      <div
        key={course.id}
        onClick={() => navigateToCourse(course)}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer border border-gray-100"
      >
        <div className="relative">
          <img
            src={course.image || '/api/placeholder/110/80'}
            alt={course.title}
            className="w-full h-36 object-cover"
          />

          {/* Mobile badges */}
          <div className="absolute top-1 right-1 flex flex-col gap-0.5">
            {course.bestseller && (
              <div className="bg-orange-500 text-white px-1 py-0.5 rounded text-xs font-semibold">
                Best
              </div>
            )}
            {course.discount > 0 && (
              <div className="bg-red-500 text-white px-1 py-0.5 rounded text-xs font-semibold">
                -{course.discount}%
              </div>
            )}
          </div>

          <div className="absolute top-1 left-1 bg-emerald-500 text-white px-1 py-0.5 rounded text-xs font-semibold">
            {formatPrice(course.price)}
          </div>
        </div>

        <div className="p-2">
          <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
            {course.title}
          </h3>

          <div className="text-xs text-gray-500 mb-1 truncate">
            {(course.instructor && course.instructor.name) || 'Instructor'}
          </div>

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-0.5 text-xs">★</span>
              <span className="text-xs font-medium">{course.rating || 0}</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded text-xs">
              {course.level || 'Beginner'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{course.totalLessons || 0} lessons</span>
            <span>{formatStudentsCount(course.studentsCount || 0)}</span>
          </div>

          <button className="w-full bg-emerald-600 text-white py-1.5 px-2 rounded text-xs hover:bg-emerald-700 transition-colors font-medium">
            View
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


          {/* Desktop: Regular Grid Layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigateToCourse(course)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={course.image || '/api/placeholder/300/200'}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* Desktop badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {course.bestseller && (
                      <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Bestseller
                      </div>
                    )}
                    {course.discount > 0 && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        {course.discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded text-sm font-semibold">
                    {formatPrice(course.price)}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  
                  <div className="text-sm text-gray-500 mb-3">
                    By {(course.instructor && course.instructor.name) || 'Instructor'}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm font-medium mr-1">{course.rating || 0}</span>
                      <span className="text-gray-400 text-sm">
                        ({course.reviewsCount || 0})
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">
                      {course.level || 'Beginner'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <span className="mr-1">📚</span>
                      {course.totalLessons || 0} lessons
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">⏱️</span>
                      {course.duration || '0 hours'}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">👥</span>
                      {formatStudentsCount(course.studentsCount || 0)}
                    </span>
                  </div>
                  
                  {course.originalPrice && course.originalPrice > course.price && (
                    <div className="flex items-center mb-4">
                      <span className="text-gray-400 line-through text-sm mr-2">
                        ${course.originalPrice}
                      </span>
                      <span className="text-emerald-600 font-bold">
                        ${course.price}
                      </span>
                    </div>
                  )}
                  
                  <button className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    // No courses state
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-4xl sm:text-5xl mb-4">📚</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No courses found
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Try adjusting your search or filters
        </p>
        <button
          onClick={clearFilters}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          Clear all filters
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header with Search */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-3 sm:px-3 py-3 sm:py-4">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {currentCategory ? currentCategory.name : 'All Courses'}
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {loading ? 'Loading...' : `${filteredCourses.length} courses available`}
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search courses..."
                className="flex-1 px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-xs sm:text-sm"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-6 py-3 sm:py-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <span>🔍</span>
            <span>Filters</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 sm:px-2 py-0.5 rounded-full">
              {Object.values(filters).filter(Boolean).length + (selectedCategory ? 1 : 0)}
            </span>
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="relevance">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="students">Most Students</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Mobile Filter Panel */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-white md:relative md:bg-transparent md:border md:rounded-lg md:p-4 md:mb-6">
            <div className="flex flex-col h-full md:h-auto">
              {/* Mobile Filter Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white md:hidden">
                <h3 className="text-lg font-semibold">Filters</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Desktop Filter Header */}
              <div className="hidden md:flex md:items-center md:justify-between md:mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear all
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 md:flex-none md:grid md:grid-cols-2 lg:grid-cols-5 md:gap-6 md:space-y-0">
                {/* Categories */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Categories</h4>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer p-1.5 hover:bg-gray-50 rounded">
                      <input
                        type="radio"
                        name="category"
                        checked={!selectedCategory}
                        onChange={() => setSelectedCategory(null)}
                        className="mr-2 text-emerald-600"
                      />
                      <span className="text-xs flex-1">All Categories</span>
                    </label>
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center cursor-pointer p-1.5 hover:bg-gray-50 rounded">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="mr-2 text-emerald-600"
                        />
                        <span className="text-xs flex-1">{category.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {category.courses}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Level</h4>
                  <div className="space-y-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <label key={level} className="flex items-center cursor-pointer p-1.5 hover:bg-gray-50 rounded">
                        <input
                          type="radio"
                          name="level"
                          value={level}
                          checked={filters.level === level}
                          onChange={(e) => handleFilterChange('level', e.target.value)}
                          className="mr-2 text-emerald-600"
                        />
                        <span className="text-xs">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Price</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'free', label: 'Free' },
                      { value: 'under50', label: 'Under $50' },
                      { value: '50to100', label: '$50 - $100' },
                      { value: 'over100', label: 'Over $100' }
                    ].map((price) => (
                      <label key={price.value} className="flex items-center cursor-pointer p-1.5 hover:bg-gray-50 rounded">
                        <input
                          type="radio"
                          name="price"
                          value={price.value}
                          checked={filters.price === price.value}
                          onChange={(e) => handleFilterChange('price', e.target.value)}
                          className="mr-2 text-emerald-600"
                        />
                        <span className="text-xs">{price.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Rating</h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center cursor-pointer p-1.5 hover:bg-gray-50 rounded">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filters.rating === rating.toString()}
                          onChange={(e) => handleFilterChange('rating', e.target.value)}
                          className="mr-2 text-emerald-600"
                        />
                        <div className="flex items-center">
                          <div className="flex text-yellow-400 text-xs mr-1">
                            {'★'.repeat(Math.floor(rating))}
                            {rating % 1 !== 0 && '☆'}
                          </div>
                          <span className="text-xs">{rating} & up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Duration</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'short', label: '0-3 hours' },
                      { value: 'medium', label: '3-8 hours' },
                      { value: 'long', label: '8+ hours' }
                    ].map((duration) => (
                      <label key={duration.value} className="flex items-center cursor-pointer p-1.5 hover:bg-gray-50 rounded">
                        <input
                          type="radio"
                          name="duration"
                          value={duration.value}
                          checked={filters.duration === duration.value}
                          onChange={(e) => handleFilterChange('duration', e.target.value)}
                          className="mr-2 text-emerald-600"
                        />
                        <span className="text-xs">{duration.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Filter Footer */}
              <div className="p-4 border-t bg-white md:hidden">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Show {loading ? '...' : sortedCourses.length} Courses
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="text-xs sm:text-sm text-gray-600 mb-4">
          {loading ? 'Loading courses...' : `Showing ${sortedCourses.length} courses`}
        </div>

        {/* Course Grid - Mobile First Design */}
        {renderCoursesSection()}

        {/* Load More Button for Mobile */}
        {!loading && sortedCourses.length > 12 && (
          <div className="text-center mt-8">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Load More Courses
            </button>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="bg-emerald-50 rounded-xl p-4 sm:p-6 mt-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            Get notified about new courses and offers
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;