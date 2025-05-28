import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';

const CoursesPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const {
    categories,
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    getFilteredCourses,
    setSelectedCategory,
    selectedCategory
  } = useCourseStore();

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
        return [...courses].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      default:
        return courses;
    }
  };

  const sortedCourses = sortCourses(filteredCourses);
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  const navigateToCourse = (course) => {
    navigate(`/courses/${course.slug || course.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header with Search */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-3 sm:px-4 py-4">
          <div className="space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {currentCategory ? currentCategory.name : 'All Courses'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {filteredCourses.length} courses
              </p>
            </div>
            
            {/* Mobile-optimized Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search courses..."
                className="flex-1 px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 py-4">
        {/* Mobile Filter Toggle & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <span>🔍</span>
            <span>Filters</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {Object.values(filters).filter(Boolean).length + (selectedCategory ? 1 : 0)}
            </span>
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="relevance">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="students">Most Students</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Mobile Filter Panel - Full Screen Overlay */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="flex flex-col h-full">
              {/* Filter Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white">
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

              {/* Filter Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="font-semibold mb-3 text-base">Categories</h4>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="mr-3 text-emerald-600 scale-110"
                        />
                        <span className="text-sm flex-1">{category.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {category.courses}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div>
                  <h4 className="font-semibold mb-3 text-base">Level</h4>
                  <div className="space-y-3">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <label key={level} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="radio"
                          name="level"
                          value={level}
                          checked={filters.level === level}
                          onChange={(e) => handleFilterChange('level', e.target.value)}
                          className="mr-3 text-emerald-600 scale-110"
                        />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="font-semibold mb-3 text-base">Price</h4>
                  <div className="space-y-3">
                    {[
                      { value: 'free', label: 'Free' },
                      { value: 'under50', label: 'Under $50' },
                      { value: '50to100', label: '$50 - $100' },
                      { value: 'over100', label: 'Over $100' }
                    ].map((price) => (
                      <label key={price.value} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="radio"
                          name="price"
                          value={price.value}
                          checked={filters.price === price.value}
                          onChange={(e) => handleFilterChange('price', e.target.value)}
                          className="mr-3 text-emerald-600 scale-110"
                        />
                        <span className="text-sm">{price.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-semibold mb-3 text-base">Rating</h4>
                  <div className="space-y-3">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filters.rating === rating.toString()}
                          onChange={(e) => handleFilterChange('rating', e.target.value)}
                          className="mr-3 text-emerald-600 scale-110"
                        />
                        <div className="flex items-center">
                          <div className="flex text-yellow-400 text-sm mr-2">
                            {'★'.repeat(Math.floor(rating))}
                            {rating % 1 !== 0 && '☆'}
                          </div>
                          <span className="text-sm">{rating} & up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h4 className="font-semibold mb-3 text-base">Duration</h4>
                  <div className="space-y-3">
                    {[
                      { value: 'short', label: '0-3 hours' },
                      { value: 'medium', label: '3-8 hours' },
                      { value: 'long', label: '8+ hours' }
                    ].map((duration) => (
                      <label key={duration.value} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="radio"
                          name="duration"
                          value={duration.value}
                          checked={filters.duration === duration.value}
                          onChange={(e) => handleFilterChange('duration', e.target.value)}
                          className="mr-3 text-emerald-600 scale-110"
                        />
                        <span className="text-sm">{duration.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Footer */}
              <div className="p-4 border-t bg-white">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Show {sortedCourses.length} Courses
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {sortedCourses.length} courses
        </div>

        {/* Mobile-First Course Grid */}
        {sortedCourses.length > 0 ? (
          <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:grid-cols-3 xl:grid-cols-4">
            {sortedCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigateToCourse(course)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  
                  {/* Mobile-optimized badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
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

                  <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    ${course.price}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    By {course.instructor.name}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1 text-sm">★</span>
                      <span className="text-sm font-medium mr-1">{course.rating}</span>
                      <span className="text-gray-400 text-xs">
                        ({course.reviewsCount})
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">
                      {course.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center">
                      <span className="mr-1">📚</span>
                      {course.totalLessons} lessons
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">⏱️</span>
                      {course.duration}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1">👥</span>
                      {course.studentsCount > 1000 ? `${Math.floor(course.studentsCount / 1000)}k` : course.studentsCount}
                    </span>
                  </div>
                  
                  {course.originalPrice && course.originalPrice > course.price && (
                    <div className="flex items-center mb-3">
                      <span className="text-gray-400 line-through text-sm mr-2">
                        ${course.originalPrice}
                      </span>
                      <span className="text-emerald-600 font-bold">
                        ${course.price}
                      </span>
                    </div>
                  )}
                  
                  <button className="w-full bg-emerald-600 text-white py-2.5 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Mobile-optimized no courses state
          <div className="text-center py-12 px-4">
            <div className="text-gray-400 text-5xl mb-4">📚</div>
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
        )}

        {/* Mobile-friendly pagination */}
        {sortedCourses.length > 12 && (
          <div className="flex justify-center mt-8 px-2">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                ← Prev
              </button>
              <div className="flex items-center gap-1">
                <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                  1
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  2
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  3
                </button>
                <span className="px-2 text-gray-400">...</span>
              </div>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Mobile-optimized newsletter section */}
        <div className="bg-emerald-50 rounded-xl p-6 mt-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            Get notified about new courses and offers
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
            />
            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;