import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useCourseStore = create((set, get) => ({
  // State
  categories: [
    { id: 1, name: 'Crop Production', slug: 'crop-production', icon: '🌾', courses: 0 },
    { id: 2, name: 'Soil Health', slug: 'soil-health', icon: '🌱', courses: 0 },
    { id: 3, name: 'Livestock', slug: 'livestock', icon: '🐄', courses: 0 },
    { id: 4, name: 'Organic Farming', slug: 'organic-farming', icon: '🥬', courses: 0 },
    { id: 5, name: 'Agribusiness', slug: 'agribusiness', icon: '📊', courses: 0 },
    { id: 6, name: 'Smart Farming', slug: 'smart-farming', icon: '🤖', courses: 0 }
  ],
  courses: [],
  enrolledCourses: [],
  selectedCategory: null,
  selectedCourse: null,
  searchQuery: '',
  filters: {
    level: '',
    price: '',
    rating: '',
    duration: ''
  },
  userProgress: {},
  loading: false,
  error: null,

  // Actions
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setSelectedCourse: (courseId) => set({ selectedCourse: courseId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch Functions
  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      
      const { categories: hardcodedCategories } = get();
      
      // Count courses for each category
      const categoriesWithCounts = await Promise.all(
        hardcodedCategories.map(async (category) => {
          const { count } = await supabase
            .from('courses')
            .select('*', { count: 'exact', head: true })
            .eq('categoryId', category.id);

          return {
            ...category,
            courses: count || 0
          };
        })
      );

      set({ categories: categoriesWithCounts, loading: false });
      return categoriesWithCounts;
    } catch (error) {
      console.error('Error fetching category counts:', error);
      set({ error: error.message, loading: false });
      // Return hardcoded categories with 0 counts if error occurs
      return get().categories;
    }
  },

  fetchCourses: async (options = {}) => {
    try {
      set({ loading: true, error: null });
      
      let query = supabase
        .from('courses')
        .select(`
          *,
          instructors (
            id,
            name,
            title,
            bio,
            avatar
          )
        `);

      // Apply filters
      if (options.categoryId) {
        query = query.eq('categoryId', options.categoryId);
      }
      if (options.featured) {
        query = query.eq('featured', true);
      }
      if (options.bestseller) {
        query = query.eq('bestseller', true);
      }
      if (options.level) {
        query = query.eq('level', options.level);
      }

      const { data: courses, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich courses with additional data
      const enrichedCourses = await Promise.all(
        courses.map(async (course) => {
          // Get hardcoded category data
          const { categories } = get();
          const category = categories.find(cat => cat.id === course.categoryId);

          // Get course statistics
          const [
            { count: studentsCount },
            { count: reviewsCount },
            { data: avgRating }
          ] = await Promise.all([
            supabase
              .from('enrollments')
              .select('*', { count: 'exact', head: true })
              .eq('course_id', course.id),
            supabase
              .from('reviews')
              .select('*', { count: 'exact', head: true })
              .eq('course_id', course.id),
            supabase
              .from('reviews')
              .select('rating')
              .eq('course_id', course.id)
          ]);

          // Calculate average rating
          const rating = avgRating?.length > 0 
            ? avgRating.reduce((sum, r) => sum + r.rating, 0) / avgRating.length 
            : 0;

          // Get total lessons count
          const { count: totalLessons } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .in('module_id', 
              (await supabase
                .from('modules')
                .select('id')
                .eq('course_id', course.id)
              ).data?.map(m => m.id) || []
            );

          return {
            ...course,
            instructor: course.instructors?.[0] || null,
            category: category || null,
            rating: Math.round(rating * 10) / 10,
            reviewsCount: reviewsCount || 0,
            studentsCount: studentsCount || 0,
            totalLessons: totalLessons || 0,
            // Convert price strings to numbers if needed
            price: course.price ? parseFloat(course.price) : 0,
            originalPrice: course.originalPrice ? parseFloat(course.originalPrice) : null,
            // Calculate discount percentage
            discount: course.originalPrice && course.price 
              ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
              : 0
          };
        })
      );

      set({ courses: enrichedCourses, loading: false });
      return enrichedCourses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      set({ error: error.message, loading: false });
      return [];
    }
  },

  fetchCourseById: async (courseId) => {
    try {
      set({ loading: true, error: null });
      
      // Fetch course with all related data
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          instructors (
            id,
            name,
            title,
            bio,
            avatar
          ),
          modules (
            id,
            title,
            duration,
            lessons (
              id,
              title,
              duration,
              type,
              preview,
              videoUrl,
              resources
            )
          )
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      // Get hardcoded category data
      const { categories } = get();
      const category = categories.find(cat => cat.id === course.categoryId);

      // Get all module IDs for this course
      const moduleIds = course.modules?.map(module => module.id) || [];

      // Fetch quizzes for all modules in this course
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select(`
          *,
          questions (
            id,
            question,
            type,
            options,
            correctAnswer,
            correctAnswers,
            explanation
          )
        `)
        .in('moduleId', moduleIds);

      if (quizzesError) {
        console.error('Error fetching quizzes:', quizzesError);
        // Continue without quizzes rather than failing completely
      }

      // Fetch assignments for all modules in this course
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .in('moduleId', moduleIds);

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
        // Continue without assignments rather than failing completely
      }

      // Fetch reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            full_name,
            avatar_url
          )
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Calculate course statistics
      const [
        { count: studentsCount },
        { data: avgRatingData }
      ] = await Promise.all([
        supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', courseId),
        supabase
          .from('reviews')
          .select('rating')
          .eq('course_id', courseId)
      ]);

      const rating = avgRatingData?.length > 0 
        ? avgRatingData.reduce((sum, r) => sum + r.rating, 0) / avgRatingData.length 
        : 0;

      // Calculate total duration
      const totalDuration = course.modules?.reduce((total, module) => {
        const moduleDuration = parseFloat(module.duration) || 0;
        return total + moduleDuration;
      }, 0) || 0;

      // Count total lessons (including quizzes and assignments as lessons)
      let totalLessons = 0;

      // Format the complete course data with quizzes and assignments embedded as lessons
      const enrichedCourse = {
        ...course,
        id: course.id,
        description: course.description,
        requirements: course.requirements,
        whatYouWillLearn: course.whatYouWillLearn,
        instructor: course.instructors?.[0] || null,
        category: category || null,
        rating: Math.round(rating * 10) / 10,
        reviewsCount: reviews?.length || 0,
        studentsCount: studentsCount || 0,
        duration: `${totalDuration} hours`,
        price: course.price ? parseFloat(course.price) : 0,
        originalPrice: course.originalPrice ? parseFloat(course.originalPrice) : null,
        discount: course.originalPrice && course.price 
          ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
          : 0,
        modules: course.modules?.map(module => {
          // Find quiz for this module
          const moduleQuiz = quizzes?.find(quiz => quiz.moduleId === module.id);
          
          // Find assignment for this module
          const moduleAssignment = assignments?.find(assignment => assignment.moduleId === module.id);

          // Create enhanced lessons array with existing lessons plus quiz and assignment as lessons
          const enhancedLessons = [
            // Add existing lessons
            ...(module.lessons?.map(lesson => ({
              ...lesson,
              quizData: lesson.type === 'quiz' ? moduleQuiz : null,
              assignmentData: lesson.type === 'assignment' ? moduleAssignment : null
            })) || []),
            
            // Add quiz as a lesson if it exists
            ...(moduleQuiz ? [{
              id: `quiz-${moduleQuiz.id}`,
              title: moduleQuiz.title || 'Module Quiz',
              duration: (moduleQuiz.timeLimit || 10),
              type: 'quiz',
              preview: false,
              videoUrl: null,
              resources: null,
              quizData: {
                id: moduleQuiz.id,
                title: moduleQuiz.title,
                description: moduleQuiz.description,
                timeLimit: moduleQuiz.timeLimit,
                passingScore: moduleQuiz.passingScore,
                questions: moduleQuiz.questions || [],
                totalQuestions: moduleQuiz.questions?.length || 0
              },
              assignmentData: null
            }] : []),
            
            // Add assignment as a lesson if it exists
            ...(moduleAssignment ? [{
              id: `assignment-${moduleAssignment.id}`,
              title: moduleAssignment.title || 'Module Assignment',
              duration: (moduleAssignment.estimatedTime || "30 min"),
              type: 'assignment',
              preview: false,
              videoUrl: null,
              resources: moduleAssignment.resources,
              quizData: null,
              assignmentData: {
                id: moduleAssignment.id,
                title: moduleAssignment.title,
                description: moduleAssignment.description,
                instructions: Array.isArray(moduleAssignment.instructions) 
                  ? moduleAssignment.instructions 
                  : (moduleAssignment.instructions ? [moduleAssignment.instructions] : []),
                deliverables: Array.isArray(moduleAssignment.deliverables) 
                  ? moduleAssignment.deliverables 
                  : (moduleAssignment.deliverables ? [moduleAssignment.deliverables] : []),
                resources: Array.isArray(moduleAssignment.resources) 
                  ? moduleAssignment.resources 
                  : (moduleAssignment.resources ? [moduleAssignment.resources] : []),
                estimatedTime: moduleAssignment.estimatedTime,
                submissionFormat: moduleAssignment.submissionFormat,
                rubric: moduleAssignment.rubric,
                tips: Array.isArray(moduleAssignment.tips) 
                  ? moduleAssignment.tips 
                  : (moduleAssignment.tips ? [moduleAssignment.tips] : [])
              }
            }] : [])
          ];

          // Update total lessons count
          totalLessons += enhancedLessons.length;

          return {
            ...module,
            lessons: enhancedLessons
          };
        }) || [],
        totalLessons,
        reviews: reviews?.map(review => ({
          ...review,
          student: review.users?.full_name || 'Anonymous',
          avatar: review.users?.avatar_url,
          date: new Date(review.created_at).toISOString().split('T')[0],
          helpful: review.helpful_count || 0
        })) || [],
        certificate: {
          available: true,
          hours: Math.ceil(totalDuration),
          title: `${course.title} Specialist`
        }
      };

      set({ selectedCourse: enrichedCourse, loading: false });
      return enrichedCourse;
    } catch (error) {
      console.error('Error fetching course details:', error);
      set({ error: error.message, loading: false });
      return null;
    }
  },

  fetchUserEnrollments: async (userId) => {
    try {
      set({ loading: true, error: null });
      
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          enrolled_at,
          courses (
            id,
            title,
            image,
            slug
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const enrolledCourseIds = enrollments?.map(e => e.course_id) || [];
      console.log(enrolledCourseIds);
      
      set({ enrolledCourses: enrolledCourseIds, loading: false });
      return enrollments;
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      set({ error: error.message, loading: false });
      return [];
    }
  },

  fetchUserProgress: async (userId, courseId = null) => {
    try {
      set({ loading: true, error: null });
      
      // Get lesson progress
      let lessonQuery = supabase
        .from('lesson_progress')
        .select(`
          lesson_id,
          completed,
          updated_at,
          lessons (
            id,
            module_id,
            modules (
              course_id
            )
          )
        `)
        .eq('user_id', userId);

      if (courseId) {
        // Filter by course if specified
        const { data: lessons } = await supabase
          .from('lessons')
          .select(`
            id,
            modules!inner (
              course_id
            )
          `)
          .eq('modules.course_id', courseId);

        const lessonIds = lessons?.map(l => l.id) || [];
        lessonQuery = lessonQuery.in('lesson_id', lessonIds);
      }

      const { data: lessonProgress, error: lessonError } = await lessonQuery;
      if (lessonError) throw lessonError;

      // Get quiz results
      let quizQuery = supabase
        .from('quiz_results')
        .select(`
          quiz_id,
          score,
          submitted_at,
          quizzes (
            id,
            moduleId,
            modules (
              course_id
            )
          )
        `)
        .eq('user_id', userId);

      const { data: quizResults, error: quizError } = await quizQuery;
      if (quizError) throw quizError;

      // Get assignment submissions
      let assignmentQuery = supabase
        .from('assignment_submissions')
        .select(`
          assignment_id,
          submitted_at,
          assignments (
            id,
            moduleId,
            modules (
              course_id
            )
          )
        `)
        .eq('user_id', userId);

      const { data: assignmentSubmissions, error: assignmentError } = await assignmentQuery;
      if (assignmentError) throw assignmentError;

      // Organize all progress by course
      const organizedProgress = {};

      // Add lesson progress
      lessonProgress?.forEach(p => {
        const courseId = p.lessons?.modules?.course_id;
        if (courseId) {
          if (!organizedProgress[courseId]) {
            organizedProgress[courseId] = {};
          }
          organizedProgress[courseId][p.lesson_id] = {
            completed: p.completed,
            completedAt: p.updated_at
          };
        }
      });

      // Add quiz progress
      quizResults?.forEach(q => {
        const courseId = q.quizzes?.modules?.course_id;
        if (courseId) {
          if (!organizedProgress[courseId]) {
            organizedProgress[courseId] = {};
          }
          const syntheticLessonId = `quiz-${q.quiz_id}`;
          organizedProgress[courseId][syntheticLessonId] = {
            completed: true,
            completedAt: q.submitted_at,
            score: q.score
          };
        }
      });

      // Add assignment progress
      assignmentSubmissions?.forEach(a => {
        const courseId = a.assignments?.modules?.course_id;
        if (courseId) {
          if (!organizedProgress[courseId]) {
            organizedProgress[courseId] = {};
          }
          const syntheticLessonId = `assignment-${a.assignment_id}`;
          organizedProgress[courseId][syntheticLessonId] = {
            completed: true,
            completedAt: a.submitted_at,
            submitted: true
          };
        }
      });

      set({ userProgress: organizedProgress, loading: false });
      return organizedProgress;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      set({ error: error.message, loading: false });
      return {};
    }
  },

  // Enrollment functions
  enrollInCourse: async (userId, courseId) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          enrolled_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      const { enrolledCourses } = get();
      if (!enrolledCourses.includes(courseId)) {
        set({ enrolledCourses: [...enrolledCourses, courseId], loading: false });
      } else {
        set({ loading: false });
      }

      return true;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      set({ error: error.message, loading: false });
      return false;
    }
  },

  // Fixed updateLessonProgress function
  updateLessonProgress: async (userId, lessonId, completed = true) => {
    try {
      set({ loading: true, error: null });
      
      // Skip progress tracking for synthetic lesson IDs (quiz/assignment)
      if (typeof lessonId === 'string' && (lessonId.startsWith('quiz-') || lessonId.startsWith('assignment-'))) {
        console.log('Skipping progress update for synthetic lesson ID:', lessonId);
        set({ loading: false });
        return true;
      }

      // Option 1: Use upsert with proper conflict resolution
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          completed,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id',
          ignoreDuplicates: false
        });

      if (error) throw error;

      // Update local progress
      const { userProgress, selectedCourse } = get();
      
      // Find which course this lesson belongs to
      let targetCourseId = null;
      if (selectedCourse) {
        // Check if lesson belongs to currently selected course
        const lessonExists = selectedCourse.modules?.some(module => 
          module.lessons?.some(lesson => lesson.id === lessonId && !lesson.id.toString().startsWith('quiz-') && !lesson.id.toString().startsWith('assignment-'))
        );
        if (lessonExists) {
          targetCourseId = selectedCourse.id;
        }
      }
      
      // If we found the course, update local state
      if (targetCourseId) {
        const updatedProgress = {
          ...userProgress,
          [targetCourseId]: {
            ...userProgress[targetCourseId],
            [lessonId]: {
              completed,
              completedAt: new Date().toISOString()
            }
          }
        };
        set({ userProgress: updatedProgress, loading: false });
      } else {
        set({ loading: false });
      }

      return true;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      
      // Skip fallback for synthetic IDs
      if (typeof lessonId === 'string' && (lessonId.startsWith('quiz-') || lessonId.startsWith('assignment-'))) {
        set({ loading: false });
        return true;
      }
      
      // If upsert fails, try manual check and update
      try {
        // Check if record exists
        const { data: existing } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('lesson_id', lessonId)
          .single();

        if (existing) {
          // Record exists, update it
          const { error: updateError } = await supabase
            .from('lesson_progress')
            .update({
              completed,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('lesson_id', lessonId);

          if (updateError) throw updateError;
        } else {
          // Record doesn't exist, insert it
          const { error: insertError } = await supabase
            .from('lesson_progress')
            .insert({
              user_id: userId,
              lesson_id: lessonId,
              completed,
              updated_at: new Date().toISOString()
            });

          if (insertError) throw insertError;
        }

        set({ loading: false });
        return true;
      } catch (fallbackError) {
        console.error('Fallback update also failed:', fallbackError);
        set({ error: fallbackError.message, loading: false });
        return false;
      }
    }
  },

  // Fixed updateModuleProgress function - use this for quiz/assignment completion
  updateModuleProgress: async (userId, moduleId, type, data) => {
    try {
      set({ loading: true, error: null });
      
      if (type === 'quiz') {
        const { error } = await supabase
          .from('quiz_results')
          .upsert({
            user_id: userId,
            quiz_id: data.quizId,
            module_id: moduleId,
            score: data.score,
            answers: data.answers,
            submitted_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,quiz_id',
            ignoreDuplicates: false
          });

        if (error) throw error;

        // Update local state to track quiz completion
        const { userProgress, selectedCourse } = get();
        if (selectedCourse) {
          const syntheticLessonId = `quiz-${data.quizId}`;
          const updatedProgress = {
            ...userProgress,
            [selectedCourse.id]: {
              ...userProgress[selectedCourse.id],
              [syntheticLessonId]: {
                completed: true,
                completedAt: new Date().toISOString(),
                score: data.score
              }
            }
          };
          set({ userProgress: updatedProgress, loading: false });
        } else {
          set({ loading: false });
        }

      } else if (type === 'assignment') {
        const { error } = await supabase
          .from('assignment_submissions')
          .upsert({
            user_id: userId,
            assignment_id: data.assignmentId,
            module_id: moduleId,
            content: data.content,
            files: data.files || [],
            submitted_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,assignment_id',
            ignoreDuplicates: false
          });

        if (error) throw error;

        // Update local state to track assignment completion
        const { userProgress, selectedCourse } = get();
        if (selectedCourse) {
          const syntheticLessonId = `assignment-${data.assignmentId}`;
          const updatedProgress = {
            ...userProgress,
            [selectedCourse.id]: {
              ...userProgress[selectedCourse.id],
              [syntheticLessonId]: {
                completed: true,
                completedAt: new Date().toISOString(),
                submitted: true
              }
            }
          };
          set({ userProgress: updatedProgress, loading: false });
        } else {
          set({ loading: false });
        }
      } else {
        set({ loading: false });
      }

      return true;
    } catch (error) {
      console.error(`Error updating ${type} progress:`, error);
      set({ error: error.message, loading: false });
      return false;
    }
  },

  submitQuizResult: async (userId, quizId, score, answers = {}) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: userId,
          quiz_id: quizId,
          score,
          answers,
          submitted_at: new Date().toISOString()
        });

      if (error) throw error;
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      set({ error: error.message, loading: false });
      return false;
    }
  },

  submitAssignment: async (userId, assignmentId, content, files = []) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('assignment_submissions')
        .insert({
          user_id: userId,
          assignment_id: assignmentId,
          content,
          files,
          submitted_at: new Date().toISOString()
        });

      if (error) throw error;
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      set({ error: error.message, loading: false });
      return false;
    }
  },

  submitReview: async (userId, courseId, rating, comment) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          course_id: courseId,
          rating,
          comment,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Refresh course data to show new review
      await get().fetchCourseById(courseId);
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Error submitting review:', error);
      set({ error: error.message, loading: false });
      return false;
    }
  },

  // Helper functions (keeping your original logic)
  getCourseById: (id) => {
    const { courses } = get();
    return courses.find(course => course.id === id);
  },

  getCoursesByCategory: (categoryId) => {
    const { courses } = get();
    return courses.filter(course => course.categoryId === categoryId);
  },

  getCategoryById: (id) => {
    const { categories } = get();
    return categories.find(category => category.id === id);
  },

  getFeaturedCourses: () => {
    const { courses } = get();
    return courses.filter(course => course.featured);
  },

  getBestsellerCourses: () => {
    const { courses } = get();
    return courses.filter(course => course.bestseller);
  },

  getFilteredCourses: () => {
    const { courses, searchQuery, filters } = get();
    let filteredCourses = courses;

    // Search filter
    if (searchQuery) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (filters.price) {
      switch (filters.price) {
        case 'free':
          filteredCourses = filteredCourses.filter(course => course.price === 0);
          break;
        case 'under50':
          filteredCourses = filteredCourses.filter(course => course.price < 50);
          break;
        case '50to100':
          filteredCourses = filteredCourses.filter(course => course.price >= 50 && course.price <= 100);
          break;
        case 'over100':
          filteredCourses = filteredCourses.filter(course => course.price > 100);
          break;
      }
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filteredCourses = filteredCourses.filter(course => course.rating >= minRating);
    }

    // Duration filter
    if (filters.duration) {
      switch (filters.duration) {
        case 'short':
          filteredCourses = filteredCourses.filter(course => {
            const hours = parseFloat(course.duration);
            return hours <= 3;
          });
          break;
        case 'medium':
          filteredCourses = filteredCourses.filter(course => {
            const hours = parseFloat(course.duration);
            return hours > 3 && hours <= 8;
          });
          break;
        case 'long':
          filteredCourses = filteredCourses.filter(course => {
            const hours = parseFloat(course.duration);
            return hours > 8;
          });
          break;
      }
    }

    return filteredCourses;
  },

  isEnrolledInCourse: (courseId) => {
    const { enrolledCourses } = get();
    return enrolledCourses.includes(courseId);
  },

  getCourseProgress: (courseId) => {
    const { userProgress } = get();
    return userProgress[courseId] || {};
  },

  getCompletedLessons: (courseId = null) => {
    const { userProgress } = get();
    let completedLessons = [];
    
    if (courseId) {
      // Get completed lessons for a specific course
      const courseProgress = userProgress[courseId] || {};
      completedLessons = Object.entries(courseProgress)
        .filter(([lessonId, progress]) => progress.completed)
        .map(([lessonId]) => parseInt(lessonId));
    } else {
      // Get all completed lessons across all courses
      Object.values(userProgress).forEach(courseProgress => {
        const courseLessons = Object.entries(courseProgress)
          .filter(([lessonId, progress]) => progress.completed)
          .map(([lessonId]) => parseInt(lessonId));
        completedLessons.push(...courseLessons);
      });
    }
    
    return completedLessons;
  },

  getCourseCompletionPercentage: (courseId) => {
    const { courses, userProgress } = get();
    const course = courses.find(c => c.id === courseId);
    const progress = userProgress[courseId] || {};
    
    if (!course) return 0;
    
    const totalLessons = course.modules?.reduce((total, module) => 
      total + (module.lessons?.length || 0), 0
    ) || 0;
    
    const completedLessons = Object.values(progress).filter(
      lesson => lesson.completed
    ).length;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  },

  // Initialize store
  initialize: async (userId = null) => {
    try {
      set({ loading: true });
      
      // Fetch basic data (categories will use hardcoded data with course counts)
      await Promise.all([
        get().fetchCategories(),
        get().fetchCourses()
      ]);

      // Fetch user-specific data if userId provided
      if (userId) {
        await Promise.all([
          get().fetchUserEnrollments(userId),
          get().fetchUserProgress(userId)
        ]);
      }

      set({ loading: false });
    } catch (error) {
      console.error('Error initializing store:', error);
      set({ error: error.message, loading: false });
    }
  }
}));

export default useCourseStore;