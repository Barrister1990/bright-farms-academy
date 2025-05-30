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
        total + (module.duration || 0), 0);

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.shortDescription,
        image: course.image,
        instructor: instructor ? {
          id: instructor.id,
          name: instructor.name,
          title: instructor.title,
          avatar: instructor.avatar,
          bio: instructor.bio
        } : null,
        categoryId: course.categoryId,
        subcategory: course.subcategory,
        level: course.level,
        language: course.language,
        price: course.price || 0,
        originalPrice: course.originalPrice,
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
        requirements: course.requirements || [],
        whatYouWillLearn: course.whatYouWillLearn || [],
        targetAudience: course.targetAudience || [],
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
          filtered = filtered.filter(course => course.categoryId === filters.category);
        }
        if (filters.instructor) {
          filtered = filtered.filter(course => course.instructor?.id === filters.instructor);
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

      // NEW: Get complete course data for editing
      getCourseForEdit: async (id) => {
        try {
          set({ loading: true, error: null });
          
          // Fetch complete course data with all relationships
          const [courseRes, modulesRes, quizzesRes, assignmentsRes, instructorRes] = await Promise.all([
            supabase.from('courses').select('*').eq('id', id).single(),
            supabase.from('modules').select('*, lessons (*)').eq('course_id', id).order('id', { ascending: true }),
            supabase.from('quizzes').select('*, questions (*)').eq('course_id', id),
            supabase.from('assignments').select('*').eq('course_id', id),
            supabase.from('instructors').select('*').eq('course_id', id).single()
          ]);

          if (courseRes.error) throw courseRes.error;
          if (modulesRes.error) throw modulesRes.error;
          if (quizzesRes.error) throw quizzesRes.error;
          if (assignmentsRes.error) throw assignmentsRes.error;
          if (instructorRes.error) throw instructorRes.error;

          const course = courseRes.data;
          const modules = modulesRes.data;
          const quizzes = quizzesRes.data;
          const assignments = assignmentsRes.data;
          const instructor = instructorRes.data;

          // Format data for the form
          const courseData = {
            title: course.title || '',
            slug: course.slug || '',
            description: course.description || '',
            shortDescription: course.shortDescription || '',
            image: course.image || '',
            categoryId: course.categoryId || '',
            subcategory: course.subcategory || '',
            level: course.level || 'Beginner',
            language: course.language || 'English',
            price: course.price || '',
            originalPrice: course.originalPrice || '',
            requirements: course.requirements || [''],
            whatYouWillLearn: course.whatYouWillLearn || [''],
            targetAudience: course.targetAudience || [''],
            featured: course.featured || false,
            bestseller: course.bestseller || false
          };

          const instructorData = {
            name: instructor.name || '',
            title: instructor.title || '',
            bio: instructor.bio || '',
            avatar: instructor.avatar || ''
          };

          // Format modules with lessons
          const formattedModules = modules.map(module => ({
            id: module.id.toString(),
            title: module.title || '',
            duration: module.duration?.toString() || '',
            lessons: module.lessons.map(lesson => ({
              id: lesson.id,
              title: lesson.title || '',
              duration: lesson.duration?.toString() || '',
              type: lesson.type || 'video',
              preview: lesson.preview || false,
              videoUrl: lesson.videoUrl || '',
              videoFile: null,
              resources: lesson.resources || ['']
            }))
          }));

          // Add empty module if no modules exist
          const modulesData = formattedModules.length > 0 ? formattedModules : [{
            id: Date.now().toString(),
            title: '',
            duration: '',
            lessons: [{
              title: '',
              duration: '',
              type: 'video',
              preview: false,
              videoUrl: '',
              videoFile: null,
              resources: ['']
            }]
          }];

          // Format quizzes
          const formattedQuizzes = quizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title || '',
            description: quiz.description || '',
            moduleId: quiz.moduleId ? modules.find(m => m.id === quiz.moduleId)?.title || '' : '',
            timeLimit: quiz.timeLimit || 10,
            passingScore: quiz.passingScore || 70,
            questions: quiz.questions.map(question => ({
              id: question.id,
              type: question.type || 'multiple-choice',
              question: question.question || '',
              options: question.options || ['', '', '', ''],
              correctAnswer: question.correctAnswer || 0,
              correctAnswers: question.correctAnswers || [],
              explanation: question.explanation || ''
            }))
          }));

          // Format assignments
          const formattedAssignments = assignments.map(assignment => ({
            id: assignment.id,
            title: assignment.title || '',
            description: assignment.description || '',
            estimatedTime: assignment.estimatedTime || '',
            moduleId: assignment.moduleId ? modules.find(m => m.id === assignment.moduleId)?.title || '' : '',
            instructions: assignment.instructions || [''],
            deliverables: assignment.deliverables || [''],
            resources: assignment.resources || [''],
            rubric: assignment.rubric || {},
            submissionFormat: assignment.submissionFormat || '',
            tips: assignment.tips || ['']
          }));

          set({ loading: false });

          return {
            success: true,
            data: {
              courseData,
              instructorData,
              modules: modulesData,
              quizzes: formattedQuizzes,
              assignments: formattedAssignments
            }
          };

        } catch (error) {
          set({ loading: false, error: error.message });
          return {
            success: false,
            error: error.message
          };
        }
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
              shortDescription: courseData.shortDescription,
              image: courseData.image,
              categoryId: courseData.categoryId,
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

          // Refresh data to get updated course with relationships
          await get().refreshData();

          set({ loading: false });
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // NEW: Update complete course (course + instructor + modules + quizzes + assignments)
      updateCompleteCourse: async (courseId, courseData, instructorData, modules, quizzes, assignments) => {
        try {
          set({ loading: true, error: null });
          console.log(courseId)
          // Helper function to upload file to storage
          const uploadFileToStorage = async (file, path) => {
            const { data, error } = await supabase.storage.from('course-content').upload(path, file, {
              cacheControl: '3600',
              upsert: true
            });
            if (error) throw error;
            const { data: urlData } = supabase.storage.from('course-content').getPublicUrl(path);
            return urlData.publicUrl;
          };

          // 1. Handle course image upload
          let imageUrl = courseData.image;
          if (courseData.image instanceof File) {
            const imagePath = `images/${Date.now()}_${courseData.image.name}`;
            imageUrl = await uploadFileToStorage(courseData.image, imagePath);
          }

          // 2. Update course
          const courseUpdateData = {
            title: courseData.title,
            slug: courseData.slug,
            description: courseData.description,
            shortDescription: courseData.shortDescription,
            image: imageUrl,
            categoryId: courseData.categoryId,
            subcategory: courseData.subcategory,
            level: courseData.level,
            language: courseData.language,
            price: courseData.price ? courseData.price : null,
            originalPrice: courseData.originalPrice ? courseData.originalPrice : null,
            requirements: courseData.requirements.filter(req => req.trim() !== ''),
            whatYouWillLearn: courseData.whatYouWillLearn.filter(learn => learn.trim() !== ''),
            targetAudience: courseData.targetAudience.filter(audience => audience.trim() !== ''),
            featured: courseData.featured,
            bestseller: courseData.bestseller,
            updated_at: new Date().toISOString()
          };

          const { error: courseError } = await supabase
            .from('courses')
            .update(courseUpdateData)
            .eq('id', courseId);

          if (courseError) throw courseError;

          // 3. Handle instructor avatar upload and update
          let avatarUrl = instructorData.avatar;
          if (instructorData.avatar instanceof File) {
            const avatarPath = `avatars/${Date.now()}_${instructorData.avatar.name}`;
            avatarUrl = await uploadFileToStorage(instructorData.avatar, avatarPath);
          }

          const instructorUpdateData = {
            name: instructorData.name,
            title: instructorData.title,
            bio: instructorData.bio,
            avatar: avatarUrl
          };

          const { error: instructorError } = await supabase
            .from('instructors')
            .update(instructorUpdateData)
            .eq('course_id', courseId);

          if (instructorError) throw instructorError;

          // 4. Update modules and lessons
          // First, get existing modules to know which to update/delete
          const { data: existingModules } = await supabase
            .from('modules')
            .select('id, lessons(id)')
            .eq('course_id', courseId);

          // Delete existing modules that are not in the new modules list
          const newModuleIds = modules.filter(m => m.id).map(m => m.id);
          const modulesToDelete = existingModules?.filter(m => !newModuleIds.includes(m.id)) || [];
          
          for (const moduleToDelete of modulesToDelete) {
            // Delete lessons first
            await supabase.from('lessons').delete().eq('module_id', moduleToDelete.id);
            // Delete module
            await supabase.from('modules').delete().eq('id', moduleToDelete.id);
          }

          // Process modules
          const moduleIdMapping = {};
          
          for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
            const module = modules[moduleIndex];
            let moduleId;

            if (module.id) {
              // Update existing module
              moduleId = module.id;
              const { error: moduleError } = await supabase
                .from('modules')
                .update({
                  title: module.title,
                  duration: module.duration
                })
                .eq('id', moduleId);

              if (moduleError) throw moduleError;

              // Delete existing lessons for this module
              await supabase.from('lessons').delete().eq('module_id', moduleId);
            } else {
              // Create new module
              const { data: moduleData, error: moduleError } = await supabase
                .from('modules')
                .insert({
                  title: module.title,
                  duration: module.duration,
                  course_id: courseId
                })
                .select()
                .single();

              if (moduleError) throw moduleError;
              moduleId = moduleData.id;
            }

            moduleIdMapping[module.title] = moduleId;

            // Insert lessons for this module
            for (const lesson of module.lessons) {
              let lessonVideoUrl = lesson.videoUrl;

              // Upload lesson video if it's a file
              if (lesson.videoFile instanceof File) {
                const videoPath = `videos/${Date.now()}_${lesson.videoFile.name}`;
                lessonVideoUrl = await uploadFileToStorage(lesson.videoFile, videoPath);
              }

              const lessonData = {
                title: lesson.title,
                duration: lesson.duration,
                type: lesson.type,
                preview: lesson.preview,
                videoUrl: lessonVideoUrl,
                resources: lesson.resources,
                module_id: moduleId
              };

              const { error: lessonError } = await supabase
                .from('lessons')
                .insert(lessonData);

              if (lessonError) throw lessonError;
            }
          }

          // 5. Update quizzes
          // Delete existing quizzes and questions
          const { data: existingQuizzes } = await supabase
            .from('quizzes')
            .select('id')
            .eq('course_id', courseId);

          for (const quiz of existingQuizzes || []) {
            await supabase.from('questions').delete().eq('quiz_id', quiz.id);
            await supabase.from('quizzes').delete().eq('id', quiz.id);
          }

          // Insert new quizzes
          for (const quiz of quizzes) {
            const actualModuleId = moduleIdMapping[quiz.moduleId];
            
            const { data: quizData, error: quizError } = await supabase
              .from('quizzes')
              .insert({
                title: quiz.title,
                description: quiz.description,
                timeLimit: quiz.timeLimit,
                passingScore: quiz.passingScore,
                moduleId: actualModuleId,
                course_id: courseId
              })
              .select()
              .single();

            if (quizError) throw quizError;

            // Insert questions
            for (const question of quiz.questions) {
              const { error: questionError } = await supabase
                .from('questions')
                .insert({
                  quiz_id: quizData.id,
                  question: question.question,
                  type: question.type,
                  options: question.options.filter(option => option.trim() !== ''),
                  correctAnswer: question.correctAnswer,
                  correctAnswers: question.correctAnswers || [],
                  explanation: question.explanation
                });

              if (questionError) throw questionError;
            }
          }

          // 6. Update assignments  
          // Delete existing assignments
          await supabase.from('assignments').delete().eq('course_id', courseId);

          // Insert new assignments
          for (const assignment of assignments) {
            const actualModuleId = moduleIdMapping[assignment.moduleId];
            
            const { error: assignmentError } = await supabase
              .from('assignments')
              .insert({
                title: assignment.title,
                description: assignment.description,
                estimatedTime: assignment.estimatedTime,
                submissionFormat: assignment.submissionFormat,
                moduleId: actualModuleId,
                instructions: assignment.instructions,
                deliverables: assignment.deliverables,
                resources: assignment.resources,
                tips: assignment.tips,
                rubric: assignment.rubric || {},
                course_id: courseId
              });

            if (assignmentError) throw assignmentError;
          }

          // Complete the updateCompleteCourse function (add this to the end of your existing function)
          // Refresh data to get updated course
          await get().refreshData();

          set({ loading: false });
          
          return { 
            success: true, 
            message: 'Course updated successfully!' 
          };

        } catch (error) {
          console.error('Error updating course:', error);
          set({ 
            loading: false, 
            error: error.message 
          });
          
          return { 
            success: false, 
            error: error.message 
          };
        }
      },

      // Delete course
      deleteCourse: async (id) => {
        try {
          set({ loading: true, error: null });

          // Delete in proper order to maintain referential integrity
          
          // 1. Delete questions first
          const { data: quizzes } = await supabase
            .from('quizzes')
            .select('id')
            .eq('course_id', id);

          for (const quiz of quizzes || []) {
            await supabase.from('questions').delete().eq('quiz_id', quiz.id);
          }

          // 2. Delete quizzes
          await supabase.from('quizzes').delete().eq('course_id', id);

          // 3. Delete assignments
          await supabase.from('assignments').delete().eq('course_id', id);

          // 4. Delete lessons
          const { data: modules } = await supabase
            .from('modules')
            .select('id')
            .eq('course_id', id);

          for (const module of modules || []) {
            await supabase.from('lessons').delete().eq('module_id', module.id);
          }

          // 5. Delete modules
          await supabase.from('modules').delete().eq('course_id', id);

          // 6. Delete instructor
          await supabase.from('instructors').delete().eq('course_id', id);

          // 7. Finally delete course
          const { error } = await supabase.from('courses').delete().eq('id', id);
          if (error) throw error;

          // Update local state
          set(state => ({
            courses: state.courses.filter(c => c.id !== id),
            loading: false
          }));

          return { success: true, message: 'Course deleted successfully' };

        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Duplicate course
      duplicateCourse: async (id) => {
        try {
          set({ loading: true, error: null });

          const originalCourse = get().getCourseById(id);
          if (!originalCourse) {
            throw new Error('Course not found');
          }

          // Get complete course data
          const courseData = await get().getCourseForEdit(id);
          if (!courseData.success) {
            throw courseData.error;
          }

          const { 
            courseData: course, 
            instructorData: instructor, 
            modules, 
            quizzes, 
            assignments 
          } = courseData.data;

          // Create new course with modified title
          const newCourseData = {
            ...course,
            title: `${course.title} (Copy)`,
            slug: `${course.slug}-copy-${Date.now()}`,
            featured: false,
            bestseller: false
          };

          // Use the existing add course flow but with complete data
          const result = await get().addCompleteCourse(
            newCourseData,
            instructor,
            modules,
            quizzes,
            assignments
          );

          set({ loading: false });
          return result;

        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Add complete course (for create and duplicate)
      addCompleteCourse: async (courseData, instructorData, modules, quizzes, assignments) => {
        try {
          set({ loading: true, error: null });

          // Helper function to upload file
          const uploadFileToStorage = async (file, path) => {
            const { data, error } = await supabase.storage.from('course-content').upload(path, file, {
              cacheControl: '3600',
              upsert: true
            });
            if (error) throw error;
            const { data: urlData } = supabase.storage.from('course-content').getPublicUrl(path);
            return urlData.publicUrl;
          };

          // 1. Handle course image upload
          let imageUrl = courseData.image;
          if (courseData.image instanceof File) {
            const imagePath = `images/${Date.now()}_${courseData.image.name}`;
            imageUrl = await uploadFileToStorage(courseData.image, imagePath);
          }

          // 2. Create course
          const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert({
              title: courseData.title,
              slug: courseData.slug,
              description: courseData.description,
              shortDescription: courseData.shortDescription,
              image: imageUrl,
              categoryId: courseData.categoryId,
              subcategory: courseData.subcategory,
              level: courseData.level,
              language: courseData.language,
              price: courseData.price ? courseData.price : null,
              original_price: courseData.originalPrice,
              requirements: courseData.requirements,
              whatYouWillLearn: courseData.whatYouWillLearn,
              targetAudience: courseData.targetAudience,
              featured: courseData.featured,
              bestseller: courseData.bestseller,
              status: 'draft'
            })
            .select()
            .single();

          if (courseError) throw courseError;

          const courseId = course.id;

          // 3. Handle instructor avatar and create instructor
          let avatarUrl = instructorData.avatar;
          if (instructorData.avatar instanceof File) {
            const avatarPath = `avatars/${Date.now()}_${instructorData.avatar.name}`;
            avatarUrl = await uploadFileToStorage(instructorData.avatar, avatarPath);
          }

          const { error: instructorError } = await supabase
            .from('instructors')
            .insert({
              name: instructorData.name,
              title: instructorData.title,
              bio: instructorData.bio,
              avatar: avatarUrl,
              course_id: courseId
            });

          if (instructorError) throw instructorError;

          // 4. Create modules and lessons
          const moduleIdMapping = {};

          for (const module of modules) {
            const { data: moduleData, error: moduleError } = await supabase
              .from('modules')
              .insert({
                title: module.title,
                duration: module.duration,
                course_id: courseId
              })
              .select()
              .single();

            if (moduleError) throw moduleError;

            moduleIdMapping[module.title] = moduleData.id;

            // Create lessons for this module
            for (const lesson of module.lessons) {
              let lessonVideoUrl = lesson.videoUrl;

              if (lesson.videoFile instanceof File) {
                const videoPath = `videos/${Date.now()}_${lesson.videoFile.name}`;
                lessonVideoUrl = await uploadFileToStorage(lesson.videoFile, videoPath);
              }

              const { error: lessonError } = await supabase
                .from('lessons')
                .insert({
                  title: lesson.title,
                  duration: lesson.duration,
                  type: lesson.type,
                  preview: lesson.preview,
                  videoUrl: lessonVideoUrl,
                  resources: lesson.resources,
                  module_id: moduleData.id
                });

              if (lessonError) throw lessonError;
            }
          }

          // 5. Create quizzes and questions
          for (const quiz of quizzes) {
            const actualModuleId = moduleIdMapping[quiz.moduleId];

            const { data: quizData, error: quizError } = await supabase
              .from('quizzes')
              .insert({
                title: quiz.title,
                description: quiz.description,
                timeLimit: quiz.timeLimit,
                passingScore: quiz.passingScore,
                moduleId: actualModuleId,
                course_id: courseId
              })
              .select()
              .single();

            if (quizError) throw quizError;

            // Create questions
            for (const question of quiz.questions) {
              const { error: questionError } = await supabase
                .from('questions')
                .insert({
                  quiz_id: quizData.id,
                  question: question.question,
                  type: question.type,
                  options: question.options,
                  correctAnswer: question.correctAnswer,
                  correctAnswers: question.correctAnswers || [],
                  explanation: question.explanation
                });

              if (questionError) throw questionError;
            }
          }

          // 6. Create assignments
          for (const assignment of assignments) {
            const actualModuleId = moduleIdMapping[assignment.moduleId];

            const { error: assignmentError } = await supabase
              .from('assignments')
              .insert({
                title: assignment.title,
                description: assignment.description,
                estimatedTime: assignment.estimatedTime,
                submissionFormat: assignment.submissionFormat,
                moduleId: actualModuleId,
                instructions: assignment.instructions,
                deliverables: assignment.deliverables,
                resources: assignment.resources,
                tips: assignment.tips,
                rubric: assignment.rubric || {},
                course_id: courseId
              });

            if (assignmentError) throw assignmentError;
          }

          // Refresh data
          await get().refreshData();

          set({ loading: false });

          return {
            success: true,
            message: 'Course created successfully!',
            courseId: courseId
          };

        } catch (error) {
          console.error('Error creating course:', error);
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Helper function to get module options for dropdowns
      getModuleOptions: () => {
        const { courses } = get();
        const allModules = courses.flatMap(course => 
          course.modules?.map(module => ({
            value: module.title,
            label: `${course.title} - ${module.title}`,
            courseId: course.id,
            moduleId: module.id
          })) || []
        );
        return allModules;
      }
    }),
    {
      name: 'admin-course-store',
      partialize: (state) => ({
        courses: state.courses,
        instructors: state.instructors,
        categories: state.categories,
        lastFetch: state.lastFetch
      })
    }
  )
);
export default useAdminCourseStore;