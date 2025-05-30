import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

// Utility function to fetch all data from Supabase
const fetchAllData = async () => {
  try {
    console.log('Fetching data from Supabase...');

    // Fetch all data in parallel
    const [coursesRes, instructorsRes, modulesRes, quizzesRes, assignmentsRes] = await Promise.all([
      supabase.from('courses').select('*').order('created_at', { ascending: false }),
      supabase.from('instructors').select('*'),
      supabase.from('modules').select('*, lessons (*)').order('id', { ascending: true }),
      supabase.from('quizzes').select('*, questions (*)'),
      supabase.from('assignments').select('*')
    ]);

    // Check for errors
    if (coursesRes.error) throw coursesRes.error;
    if (instructorsRes.error) throw instructorsRes.error;
    if (modulesRes.error) throw modulesRes.error;
    if (quizzesRes.error) throw quizzesRes.error;
    if (assignmentsRes.error) throw assignmentsRes.error;

    const { data: coursesData } = coursesRes;
    const { data: instructorsData } = instructorsRes;
    const { data: modulesData } = modulesRes;
    const { data: quizzesData } = quizzesRes;
    const { data: assignmentsData } = assignmentsRes;

    // Format courses with related data
    const formattedCourses = coursesData.map(course => {
      const instructor = instructorsData.find(inst => inst.course_id === course.id);
      const courseModules = modulesData.filter(module => module.course_id === course.id);
      const courseQuizzes = quizzesData.filter(quiz => quiz.course_id === course.id);
      const courseAssignments = assignmentsData.filter(assignment => assignment.course_id === course.id);

      // Calculate totals
      const totalLessons = courseModules.reduce((total, module) => 
        total + (module.lessons?.length || 0), 0);
      const totalDuration = courseModules.reduce((total, module) => 
        total + (parseFloat(module.duration) || 0), 0);

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.short_description,
        image: course.image,
        instructor: instructor ? {
          id: instructor.id,
          name: instructor.name,
          title: instructor.title,
          avatar: instructor.avatar
        } : null,
        categoryId: course.category_id,
        subcategory: course.subcategory,
        level: course.level,
        language: course.language,
        price: course.price || 0,
        originalPrice: course.original_price,
        rating: course.rating || 0,
        reviewsCount: course.reviews_count || 0,
        studentsCount: course.students_count || 0,
        duration: `${Math.round((totalDuration / 60) * 10) / 10} hours`,
        totalLessons,
        status: course.status || 'draft',
        bestseller: course.bestseller || false,
        featured: course.featured || false,
        isActive: course.is_active !== false,
        createdAt: course.created_at,
        updatedAt: course.updated_at,
        publishedAt: course.created_at,
        modules: courseModules,
        quizzes: courseQuizzes,
        assignments: courseAssignments
      };
    });

    // Format instructors
    const formattedInstructors = instructorsData.map(instructor => {
      const instructorCourses = formattedCourses.filter(course => 
        course.instructor?.id === instructor.id);
      const totalStudents = instructorCourses.reduce((total, course) => 
        total + course.studentsCount, 0);

      return {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        title: instructor.title,
        avatar: instructor.avatar,
        bio: instructor.bio,
        specialties: instructor.specialties || [],
        isActive: instructor.is_active !== false,
        joinedAt: instructor.created_at,
        courses: instructorCourses.length,
        students: totalStudents,
        rating: instructorCourses.length > 0 ? 
          instructorCourses.reduce((sum, course) => sum + course.rating, 0) / instructorCourses.length : 0
      };
    });

    return {
      courses: formattedCourses,
      instructors: formattedInstructors,
      success: true
    };

  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      courses: [],
      instructors: [],
      success: false,
      error: error.message
    };
  }
};

const useAdminCourseStore = create(
  persist(
    (set, get) => ({
      // Data
      courses: [],
      instructors: [],
      categories: [
        { id: 1, name: 'Crop Production', slug: 'crop-production', icon: '🌾', courses: 0 },
        { id: 2, name: 'Soil Health', slug: 'soil-health', icon: '🌱', courses: 0 },
        { id: 3, name: 'Livestock', slug: 'livestock', icon: '🐄', courses: 0 },
        { id: 4, name: 'Organic Farming', slug: 'organic-farming', icon: '🥬', courses: 0 },
        { id: 5, name: 'Agribusiness', slug: 'agribusiness', icon: '📊', courses: 0 },
        { id: 6, name: 'Smart Farming', slug: 'smart-farming', icon: '🤖', courses: 0 }
      ],

      // UI State
      searchQuery: '',
      filters: {
        status: '',
        category: '',
        instructor: '',
        level: '',
        price: ''
      },
      sortBy: 'createdAt',
      sortOrder: 'desc',
      currentPage: 1,
      itemsPerPage: 10,

      // Loading/Error State
      loading: false,
      error: null,
      lastFetch: null,

      // Initialize store
      initialize: async () => {
        const { courses, lastFetch } = get();
        
        // Only fetch if no data or data is older than 5 minutes
        const shouldFetch = courses.length === 0 || 
          !lastFetch || 
          (Date.now() - new Date(lastFetch).getTime()) > 5 * 60 * 1000;

        if (shouldFetch) {
          return await get().loadData();
        }
        
        return { success: true, message: 'Using cached data' };
      },

      // Load data from Supabase
      loadData: async () => {
        set({ loading: true, error: null });
        
        const result = await fetchAllData();
        
        if (result.success) {
          set({
            courses: result.courses,
            instructors: result.instructors,
            loading: false,
            lastFetch: new Date().toISOString()
          });
        } else {
          set({
            error: result.error,
            loading: false
          });
        }
        
        return result;
      },

      // Refresh data
      refreshData: async () => {
        return await get().loadData();
      },

      // Search and Filters
      setSearchQuery: (query) => set({ 
        searchQuery: query, 
        currentPage: 1 
      }),

      setFilters: (newFilters) => set(state => ({
        filters: { ...state.filters, ...newFilters },
        currentPage: 1
      })),

      clearFilters: () => set({
        searchQuery: '',
        filters: {
          status: '',
          category: '',
          instructor: '',
          level: '',
          price: ''
        },
        currentPage: 1
      }),

      // Sorting
      setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
      setSortOrder: (sortOrder) => set({ sortOrder, currentPage: 1 }),

      // Pagination
      setCurrentPage: (page) => set({ currentPage: page }),
      setItemsPerPage: (count) => set({ 
        itemsPerPage: count, 
        currentPage: 1 
      }),

      // Get filtered courses
      getFilteredCourses: () => {
        const { courses, searchQuery, filters, sortBy, sortOrder } = get();
        let filtered = [...courses];

        // Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(course =>
            course.title?.toLowerCase().includes(query) ||
            course.description?.toLowerCase().includes(query) ||
            course.instructor?.name?.toLowerCase().includes(query)
          );
        }

        // Filters
        if (filters.status) {
          filtered = filtered.filter(course => course.status === filters.status);
        }
        if (filters.category) {
          filtered = filtered.filter(course => course.categoryId === parseInt(filters.category));
        }
        if (filters.instructor) {
          filtered = filtered.filter(course => course.instructor?.id === parseInt(filters.instructor));
        }
        if (filters.level) {
          filtered = filtered.filter(course => course.level === filters.level);
        }
        if (filters.price === 'free') {
          filtered = filtered.filter(course => course.price === 0);
        } else if (filters.price === 'paid') {
          filtered = filtered.filter(course => course.price > 0);
        }

        // Sort
        filtered.sort((a, b) => {
          let aVal = a[sortBy];
          let bVal = b[sortBy];

          if (sortBy.includes('At') || sortBy === 'createdAt') {
            aVal = new Date(aVal || 0);
            bVal = new Date(bVal || 0);
          } else if (typeof aVal === 'string') {
            aVal = aVal?.toLowerCase() || '';
            bVal = bVal?.toLowerCase() || '';
          }

          if (sortOrder === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
          }
        });

        return filtered;
      },

      // Get paginated courses
      getPaginatedCourses: () => {
        const { currentPage, itemsPerPage } = get();
        const filtered = get().getFilteredCourses();
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        return {
          courses: filtered.slice(start, end),
          totalCourses: filtered.length,
          totalPages: Math.ceil(filtered.length / itemsPerPage),
          currentPage,
          hasNext: end < filtered.length,
          hasPrev: currentPage > 1
        };
      },

      // Get dashboard stats
      getDashboardStats: () => {
        const { courses, instructors } = get();
        
        return {
          courses: {
            total: courses.length,
            published: courses.filter(c => c.status === 'published').length,
            draft: courses.filter(c => c.status === 'draft').length,
            featured: courses.filter(c => c.featured).length
          },
          instructors: {
            total: instructors.length,
            active: instructors.filter(i => i.isActive).length
          },
          students: {
            total: courses.reduce((sum, c) => sum + c.studentsCount, 0)
          },
          revenue: {
            total: courses.reduce((sum, c) => sum + (c.price * c.studentsCount), 0)
          }
        };
      },

      // Utility getters
      getCourseById: (id) => {
        const { courses } = get();
        return courses.find(course => course.id === id);
      },

      getCategoryById: (id) => {
        const { categories } = get();
        return categories.find(cat => cat.id === id);
      },

      getInstructorById: (id) => {
        const { instructors } = get();
        return instructors.find(inst => inst.id === id);
      },

      // Course actions
      toggleCourseStatus: async (id) => {
        const course = get().getCourseById(id);
        if (!course) return { success: false, error: 'Course not found' };

        try {
          const { error } = await supabase
            .from('courses')
            .update({ is_active: !course.isActive })
            .eq('id', id);

          if (error) throw error;

          // Update local state
          set(state => ({
            courses: state.courses.map(c =>
              c.id === id ? { ...c, isActive: !c.isActive } : c
            )
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      publishCourse: async (id) => {
        try {
          const { error } = await supabase
            .from('courses')
            .update({ 
              status: 'published',
              published_at: new Date().toISOString()
            })
            .eq('id', id);

          if (error) throw error;

          // Update local state
          set(state => ({
            courses: state.courses.map(c =>
              c.id === id ? { 
                ...c, 
                status: 'published', 
                publishedAt: new Date().toISOString() 
              } : c
            )
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      unpublishCourse: async (id) => {
        try {
          const { error } = await supabase
            .from('courses')
            .update({ status: 'draft' })
            .eq('id', id);

          if (error) throw error;

          // Update local state
          set(state => ({
            courses: state.courses.map(c =>
              c.id === id ? { ...c, status: 'draft' } : c
            )
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Add course
      addCourse: async (courseData) => {
        set({ loading: true });
        
        try {
          const { data, error } = await supabase
            .from('courses')
            .insert([{
              title: courseData.title,
              slug: courseData.title?.toLowerCase().replace(/\s+/g, '-'),
              description: courseData.description,
              short_description: courseData.shortDescription,
              image: courseData.image,
              category_id: courseData.categoryId,
              level: courseData.level,
              language: courseData.language,
              price: courseData.price || 0,
              status: 'draft'
            }])
            .select()
            .single();

          if (error) throw error;

          // Refresh data to get complete course with relationships
          await get().refreshData();
          
          set({ loading: false });
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Update course
      updateCourse: async (id, updates) => {
        set({ loading: true });
        
        try {
          const { data, error } = await supabase
            .from('courses')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          // Update local state
          set(state => ({
            courses: state.courses.map(c =>
              c.id === id ? { ...c, ...updates } : c
            ),
            loading: false
          }));

          return { success: true, data };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Delete course
      deleteCourse: async (id) => {
        set({ loading: true });
        
        try {
          const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id);

          if (error) throw error;

          // Update local state
          set(state => ({
            courses: state.courses.filter(c => c.id !== id),
            loading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'admin-course-store',
      partialize: (state) => ({
        // Only persist UI state, not data
        filters: state.filters,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        itemsPerPage: state.itemsPerPage,
        lastFetch: state.lastFetch
      })
    }
  )
);

export default useAdminCourseStore;