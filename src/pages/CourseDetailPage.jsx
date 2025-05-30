import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import useUserStore from '../store/userStore';
const CourseDetailPage = () => {
    const { courseSlug } = useParams();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('cid');
  const demoSlug = courseId;


  const [activeTab, setActiveTab] = useState('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoProgress, setVideoProgress] = useState({});
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [lessonNotes, setLessonNotes] = useState({});
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    isSubmitting: false
  });
  const { isLoggedIn, user, login, logout } = useUserStore();
  const  userId = user?.id
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [quizState, setQuizState] = useState({
    isActive: false,
    currentQuestion: 0,
    answers: {},
    timeRemaining: null,
    isSubmitted: false,
    score: null,
    showResults: false
  });

  const [assignmentState, setAssignmentState] = useState({
    isActive: false,
    submissions: {},
    isSubmitted: false,
    files: []
  });

  // Get store state and actions
  const {
    selectedCourse,
    userProgress,
    enrolledCourses,
    loading,
    error,
    fetchCourseById,
    enrollInCourse,
    updateLessonProgress,
    submitQuizResult,
    submitAssignment,
    submitReview,
    getCourseProgress,
    getCourseCompletionPercentage,
    isEnrolledInCourse,
    getCoursesByCategory,  initialize, getCompletedLessons, updateModuleProgress
  } = useCourseStore();
  useEffect(() => {
  if (user && isLoggedIn) {
    initialize(user.id); // Initialize with user data
  } else {
    initialize(); // Initialize without user data (just categories and courses)
  }
}, [user]);
  const completedLessons = getCompletedLessons(courseId);
  // Load course data on mount
  useEffect(() => {
 
    if (demoSlug) {
      // First try to find by slug, then by ID
      fetchCourseById(demoSlug).then(courseData => {
        if (!courseData) {
          // Try parsing as ID if slug lookup failed
          const numericId = parseInt(demoSlug);
          if (!isNaN(numericId)) {
            fetchCourseById(numericId);
          }
        }
      });
    }
  }, [demoSlug, fetchCourseById]);

  const course = selectedCourse;
 const relatedCourses = course ? 
  (getCoursesByCategory(course.categoryId)?.courses || []).filter(c => c.id !== course.id).slice(0, 4) : 
  [];

  const progress = course ? getCourseProgress(course.id) : {};

  const isEnrolled = course && user && isLoggedIn ? isEnrolledInCourse(course.id) : false;



  useEffect(() => {
    if (course && course.modules?.length > 0) {
      setSelectedModule(course.modules[0]?.id || null);
    }
  }, [course]);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (currentLesson && showControls) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (!videoRef.current?.paused) {
          setShowControls(false);
        }
      }, 3000);
    }
    return () => clearTimeout(controlsTimeoutRef.current);
  }, [currentLesson, showControls]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!currentLesson || !videoRef.current) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          }
          break;
      }
    };

    if (currentLesson) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [currentLesson, isFullscreen]);

  // Quiz timer effect
  useEffect(() => {
    let timer;
    if (quizState.isActive && quizState.timeRemaining > 0 && !quizState.isSubmitted) {
      timer = setInterval(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (quizState.timeRemaining === 0 && !quizState.isSubmitted) {
      handleQuizSubmit();
    }
    return () => clearInterval(timer);
  }, [quizState.isActive, quizState.timeRemaining, quizState.isSubmitted]);

if (loading || !course) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Main loading content */}
      <div className="text-center relative z-10 animate-fade-in">
        {/* Spinner container with enhanced design */}
        <div className="relative mb-8">
          {/* Outer ring */}
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-400 animate-spin"></div>
            
            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce opacity-60"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
            <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce opacity-40 animation-delay-1000"></div>
          </div>
          <div className="absolute top-1/2 right-0 transform translate-x-4 -translate-y-1/2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping opacity-50"></div>
          </div>
        </div>
        
        {/* Loading text with typewriter effect */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-800 animate-slide-up">
            Loading Course
          </h2>
          <div className="flex items-center justify-center space-x-1">
            <p className="text-gray-600 animate-slide-up animation-delay-500">
              Preparing your learning experience
            </p>
            <div className="flex space-x-1 animate-slide-up animation-delay-1000">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto animate-slide-up animation-delay-1500">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
      
      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        @keyframes error-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes error-fade-in {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        
        .animate-error-shake {
          animation: error-shake 0.5s ease-in-out;
        }
        
        .animate-error-fade-in {
          animation: error-fade-in 0.6s ease-out;
        }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements - error theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Error content */}
      <div className="text-center max-w-sm mx-auto relative z-10 animate-error-fade-in">
        {/* Error icon */}
        <div className="relative mb-6 animate-error-shake">
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          {/* Floating error particles */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce opacity-60"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce opacity-40 animation-delay-1000"></div>
          </div>
        </div>
        
        {/* Error text */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 animate-slide-up">
            Error Loading Course
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed animate-slide-up animation-delay-500">
            {error}
          </p>
        </div>
        
        {/* Action button */}
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transform hover:scale-105 animate-slide-up animation-delay-1000"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Try Again</span>
          </span>
        </button>
      </div>
    </div>
  );
}

if (!course) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements - not found theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Not found content */}
      <div className="text-center max-w-sm mx-auto relative z-10 animate-error-fade-in">
        {/* Not found icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.824-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce opacity-60"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-40 animation-delay-1000"></div>
          </div>
        </div>
        
        {/* Not found text */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 animate-slide-up">
            Course Not Found
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed animate-slide-up animation-delay-500">
            The course you're looking for doesn't exist.
          </p>
        </div>
        
        {/* Action button */}
        <button 
          onClick={() => window.history.back()}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transform hover:scale-105 animate-slide-up animation-delay-1000"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Go Back</span>
          </span>
        </button>
      </div>
    </div>
  );
}

  // Course interaction handlers
  const handleEnroll = async () => {
    if (!userId) {
      alert('Please log in to enroll in courses');
      return;
    }

    const success = await enrollInCourse(userId, course.id);
    if (success) {
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 3000);
    } else {
      alert('Failed to enroll in course. Please try again.');
    }
  };

const handleLessonComplete = async (lessonId) => {
  if (!userId) return;
  
  // Check if this is a synthetic lesson ID (quiz or assignment)
  const isQuizLesson = typeof lessonId === 'string' && lessonId.startsWith('quiz-');
  const isAssignmentLesson = typeof lessonId === 'string' && lessonId.startsWith('assignment-');
  
  let success = false;
  
  if (isQuizLesson || isAssignmentLesson) {
    // For quiz/assignment lessons, we don't update lesson_progress
    // Progress is handled by updateModuleProgress in the specific handlers
    success = true;
  } else {
    // For regular lessons, update lesson progress normally
    success = await updateLessonProgress(userId, lessonId, true);
  }
  
  if (success) {
    // Show completion animation
    const lessonElement = document.getElementById(`lesson-${lessonId}`);
    if (lessonElement) {
      lessonElement.classList.add('animate-pulse');
      setTimeout(() => {
        lessonElement.classList.remove('animate-pulse');
      }, 1000);
    }
  }
};

const handleStartLesson = (lesson) => {
  setCurrentLesson(lesson);
  setVideoError(false);
  
  // Check if this is a quiz or assignment lesson
  const isQuizLesson = lesson.type == 'quiz' || (typeof lesson.id === 'string' && lesson.id.startsWith('quiz-'));
  const isAssignmentLesson = lesson.type == 'assignment' || (typeof lesson.id === 'string' && lesson.id.startsWith('assignment-'));
  
  // Set video states based on lesson type
  if (isQuizLesson || isAssignmentLesson) {
    setIsVideoLoading(false);
    setShowVideo(false);
  } else {
    setIsVideoLoading(true);
    setShowVideo(true);
  }
  
  // Initialize progress tracking for new lessons
  if (userId && !progress[lesson.id]) {
    // Only track progress for regular lessons, not synthetic quiz/assignment lessons
    if (!isQuizLesson && !isAssignmentLesson) {
      updateLessonProgress(userId, lesson.id, false);
    }
    // For quiz/assignment lessons, progress is handled when they're completed
  }
};

  const handleContinueLearning = () => {
    // Find the next incomplete lesson
    const allLessons = course.modules.flatMap(module => module.lessons);
    const nextLesson = allLessons.find(lesson => !progress[lesson.id]?.completed);
    
    if (nextLesson) {
      setCurrentLesson(nextLesson);
      setActiveTab('curriculum');
      const moduleWithLesson = course.modules.find(module => 
        module.lessons.some(lesson => lesson.id === nextLesson.id)
      );
      if (moduleWithLesson) {
        setSelectedModule(moduleWithLesson.id);
      }
    }
  };

  // Quiz Functions
  const startQuiz = (lesson) => {
    const quizData = lesson.quizData;
    if (!quizData) return;
    
    setQuizState({
      isActive: true,
      currentQuestion: 0,
      answers: {},
      timeRemaining: quizData.timeLimit * 60, // convert minutes to seconds
      isSubmitted: false,
      score: null,
      showResults: false
    });
    setCurrentLesson(lesson);
  };

  const handleQuizAnswer = (questionId, answer) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  };

const handleQuizSubmit = async () => {
  if (!userId || !currentLesson?.quizData) return;
  
  const quizData = currentLesson.quizData;
  let correctCount = 0;
  
  quizData.questions.forEach(question => {
    const userAnswer = quizState.answers[question.id];
    
    if (question.type === 'multiple-select') {
      const correctAnswers = question.correctAnswers || [];
      const userAnswers = userAnswer || [];
      
      if (correctAnswers.length === userAnswers.length &&
          correctAnswers.every(ans => userAnswers.includes(ans))) {
        correctCount++;
      }
    } else {
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      }
    }
  });
  
  const score = Math.round((correctCount / quizData.questions.length) * 100);
  const passed = score >= (quizData.passingScore || 70);
  
  setQuizState(prev => ({
    ...prev,
    isSubmitted: true,
    score: score,
    showResults: true
  }));
  
  // Submit quiz result to backend
  await submitQuizResult(userId, quizData.id, score);
  
  // Update progress if passed - use updateModuleProgress for quiz completion
  if (passed) {
    // Find the module ID for this quiz
    const moduleId = currentModule?.id; // Assuming you have currentModule available
    
    await updateModuleProgress(userId, moduleId, 'quiz', {
      quizId: quizData.id,
      score: score,
      answers: quizState.answers
    });
    
    // Show completion animation for the quiz lesson
    await handleLessonComplete(currentLesson.id);
  }
};

  const nextQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestion: Math.min(prev.currentQuestion + 1, currentLesson.quizData.questions.length - 1)
    }));
  };

  const previousQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestion: Math.max(prev.currentQuestion - 1, 0)
    }));
  };

  // Assignment Functions
  const startAssignment = (lesson) => {
    setAssignmentState({
      isActive: true,
      submissions: {},
      isSubmitted: false,
      files: []
    });
    setCurrentLesson(lesson);
  };

  const handleAssignmentSubmission = (field, value) => {
    setAssignmentState(prev => ({
      ...prev,
      submissions: {
        ...prev.submissions,
        [field]: value
      }
    }));
  };

  const handleFileUpload = (files) => {
    setAssignmentState(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

const handleAssignmentSubmit = async () => {
  if (!userId || !currentLesson?.assignmentData) return;
  
  if (!isAssignmentComplete()) {
    alert('Please complete all deliverables before submitting');
    return;
  }
  
  // Prepare submission content
  const submissionContent = {
    submissions: assignmentState.submissions,
    files: assignmentState.files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))
  };
  
  // Submit assignment to backend
  const success = await submitAssignment(
    userId, 
    currentLesson.assignmentData.id, 
    JSON.stringify(submissionContent),
    assignmentState.files // Pass actual files array
  );
  
  if (success) {
    // Find the module ID for this assignment
    const moduleId = currentModule?.id; // Assuming you have currentModule available
    
    // Update progress using updateModuleProgress for assignment completion
    await updateModuleProgress(userId, moduleId, 'assignment', {
      assignmentId: currentLesson.assignmentData.id,
      content: JSON.stringify(submissionContent),
      files: assignmentState.files || []
    });
    
    setAssignmentState(prev => ({
      ...prev,
      isSubmitted: true
    }));
    
    // Mark lesson as completed (this will handle the animation)
    await handleLessonComplete(currentLesson.id);
    alert('Assignment submitted successfully!');
  } else {
    alert('Failed to submit assignment. Please try again.');
  }
};

  const isAssignmentComplete = () => {
    if (!currentLesson?.assignmentData?.deliverables) {
      return assignmentState.submissions['Assignment Response']?.trim();
    }
    
    return currentLesson.assignmentData.deliverables.every(deliverable => 
      assignmentState.submissions[deliverable]?.trim()
    );
  };

  // Review Functions
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('Please log in to submit a review');
      return;
    }

    setReviewForm(prev => ({ ...prev, isSubmitting: true }));
    
    const success = await submitReview(
      userId,
      course.id,
      reviewForm.rating,
      reviewForm.comment
    );
    
    if (success) {
      setReviewForm({
        rating: 5,
        comment: '',
        isSubmitting: false
      });
      alert('Review submitted successfully!');
    } else {
      alert('Failed to submit review. Please try again.');
      setReviewForm(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Helper Functions
  const getLessonProgress = (lessonId) => {
    const lessonProgress = progress[lessonId];
    if (lessonProgress?.completed) {
      return 100;
    }
    
    // Check video progress
    if (videoProgress[lessonId]) {
      return Math.round(videoProgress[lessonId].progress || 0);
    }
    
    // Check quiz progress
    if (quizState.isActive && currentLesson?.id === lessonId) {
      const totalQuestions = currentLesson.quizData?.questions?.length || 1;
      return Math.round((quizState.currentQuestion / totalQuestions) * 100);
    }

    // Check assignment progress
    if (assignmentState.isActive && currentLesson?.id === lessonId) {
      const totalDeliverables = currentLesson.assignmentData?.deliverables?.length || 1;
      const completedDeliverables = Object.values(assignmentState.submissions).filter(sub => sub?.trim()).length;
      return Math.round((completedDeliverables / totalDeliverables) * 100);
    }
    
    return 0;
  };

  const getNextLesson = (currentLessonId) => {
    const allLessons = course.modules.flatMap(module => module.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  };

  const getPreviousLesson = (currentLessonId) => {
    const allLessons = course.modules.flatMap(module => module.lessons);
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    const progressPercent = (currentTime / duration) * 100;
    
    setVideoProgress(prev => ({
      ...prev,
      [currentLesson.id]: {
        currentTime,
        duration,
        progress: progressPercent
      }
    }));

    // Auto-mark as completed when 90% watched
    if (progressPercent >= 90 && !progress[currentLesson.id]?.completed) {
      handleLessonComplete(currentLesson.id);
    }
  };

  const handleVideoLoadedMetadata = () => {
    setIsVideoLoading(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsVideoLoading(false);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessonsCount = Object.values(progress).filter(lesson => lesson.completed).length;
  const enrollmentDate = isEnrolled ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : null;


  const completionPercentage = totalLessons > 0 
  ? Math.round((completedLessonsCount / totalLessons) * 100) 
  : 0;

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')} hrs`;
  } else {
    return `${minutes} mins`;
  }
}


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Congratulations Toast */}
      {showCongrats && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🎉</span>
            <div>
              <div className="font-semibold">Welcome to the course!</div>
              <div className="text-sm opacity-90">Start learning now</div>
            </div>
          </div>
        </div>
      )}

{/* Course Preview Video Modal */}
{isVideoModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Course Preview</h3>
        <button 
         onClick={() => setIsVideoModalOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
      <div className="p-4">
        <video 
          className="w-full aspect-video rounded bg-black"
          controls
          autoPlay
          preload="metadata"
          onError={(e) => console.error('Video error:', e)}
        >
          <source src="https://giwjevxanyizjwywxhzu.supabase.co/storage/v1/object/public/course-content/videos/Agriculture%20and%20it's%20Importance.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="mt-4 text-sm text-gray-600">
          Course introduction and overview
        </div>
      </div>
    </div>
  </div>
)}

{/* Enhanced Lesson Player Modal - Udemy Style */}
{currentLesson && (
  <div className={`fixed inset-0 bg-black z-50 ${isFullscreen ? '' : 'p-0 sm:p-2 md:p-4'}`}>
    <div className={`bg-black h-screen w-full ${isFullscreen ? '' : 'sm:bg-white sm:rounded-lg sm:overflow-hidden sm:max-w-7xl sm:mx-auto'}`}>
      {/* Header - Hidden in fullscreen, responsive padding */}
      {!isFullscreen && (
        <div className="hidden sm:flex justify-between items-center p-2 sm:p-3 md:p-4 border-b bg-white">
          <div className="min-w-0 flex-1 mr-4">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold truncate">{currentLesson.title}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{currentLesson.type} • {currentLesson.duration}</p>
          </div>
          <button 
            onClick={() => setCurrentLesson(null)}
            className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl md:text-2xl p-1 sm:p-2 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      <div className={`${isFullscreen ? 'h-full' : 'h-full sm:h-auto'} flex flex-col lg:flex-row`}>
        {/* Content Section - Responsive sizing */}
        <div className={`${isFullscreen ? 'h-full' : 'h-full sm:h-64 md:h-80 lg:h-96 xl:h-[500px] lg:flex-1'} relative bg-black`}>
          {currentLesson.type === 'video' ? (
            <div className="relative h-full">
              {/* Loading Spinner */}
              {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-white"></div>
                </div>
              )}

              {/* Video Error State */}
              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white p-4">
                  <div className="text-center max-w-sm">
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4">⚠️</div>
                    <div className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2">Video unavailable</div>
                    <div className="text-xs sm:text-sm opacity-75 mb-3 sm:mb-4">Please try again later</div>
                    <button 
                      onClick={() => {
                        setVideoError(false);
                        setIsVideoLoading(true);
                        if (videoRef.current) {
                          videoRef.current.load();
                        }
                      }}
                      className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-emerald-600 text-white rounded text-sm sm:text-base hover:bg-emerald-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Video Element */}
              <video 
                ref={videoRef}
                className="w-full h-full object-contain"
                preload="metadata"
                onLoadedMetadata={handleVideoLoadedMetadata}
                onTimeUpdate={handleVideoTimeUpdate}
                onError={handleVideoError}
                onPlay={() => setShowControls(true)}
                onPause={() => setShowControls(true)}
                onClick={() => setShowControls(!showControls)}
                onMouseMove={() => setShowControls(true)}
              >
                {currentLesson.videoUrl && (
                  <source src={currentLesson.videoUrl} type="video/mp4" />
                )}
                <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>

              {/* Custom Video Controls */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Close button for mobile */}
                <button 
                  onClick={() => setCurrentLesson(null)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-20 text-white bg-black bg-opacity-50 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center lg:hidden text-sm sm:text-base"
                >
                  ✕
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={() => {
                    if (videoRef.current.paused) {
                      videoRef.current.play();
                    } else {
                      videoRef.current.pause();
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl hover:bg-black hover:bg-opacity-20 transition-colors"
                >
                  {videoRef.current?.paused !== false ? '▶️' : '⏸️'}
                </button>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-3 md:p-4">
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-1 sm:h-1.5 md:h-2 bg-white bg-opacity-30 rounded-full mb-2 sm:mb-3 md:mb-4 cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-full bg-red-600 rounded-full transition-all"
                      style={{ 
                        width: `${videoProgress[currentLesson.id]?.progress || 0}%` 
                      }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                      {/* Play/Pause */}
                      <button
                        onClick={() => {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                          } else {
                            videoRef.current.pause();
                          }
                        }}
                        className="text-lg sm:text-xl md:text-2xl hover:scale-110 transition-transform"
                      >
                        {videoRef.current?.paused !== false ? '▶️' : '⏸️'}
                      </button>

                      {/* Skip back */}
                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                          }
                        }}
                        className="text-base sm:text-lg md:text-xl hover:scale-110 transition-transform"
                      >
                        ⏪
                      </button>

                      {/* Skip forward */}
                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
                          }
                        }}
                        className="text-base sm:text-lg md:text-xl hover:scale-110 transition-transform"
                      >
                        ⏩
                      </button>

                      {/* Time Display */}
                      <span className="text-xs sm:text-sm md:text-base">
                        {formatTime(videoProgress[currentLesson.id]?.currentTime || 0)} / {formatTime(videoProgress[currentLesson.id]?.duration || 0)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                      {/* Playback Speed */}
                      <select 
                        value={playbackRate}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value);
                          setPlaybackRate(rate);
                          if (videoRef.current) {
                            videoRef.current.playbackRate = rate;
                          }
                        }}
                        className="bg-black bg-opacity-50 text-white text-xs sm:text-sm border border-white border-opacity-30 rounded px-1 py-0.5 sm:px-2 sm:py-1"
                      >
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1">1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                      </select>

                      {/* Fullscreen Toggle */}
                      <button
                        onClick={toggleFullscreen}
                        className="text-base sm:text-lg md:text-xl hover:scale-110 transition-transform"
                      >
                        {isFullscreen ? '🗗' : '⛶'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : currentLesson.type === 'quiz' ? (
            <div className="h-screen bg-white flex flex-col overflow-hidden sm:h-screen">
              {!quizState.isActive ? (
                // Quiz Start Screen
                <div className="flex-1 overflow-y-auto">
                  <div className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="text-center max-w-2xl w-full">
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 lg:mb-6">📝</div>
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 px-2">
                        {currentLesson.quizData?.title || currentLesson.title}
                      </h2>
                      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed px-2">
                        {currentLesson.quizData?.description || 'Test your knowledge with this quiz'}
                      </p>
                      
                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 lg:mb-8 mx-2 sm:mx-0">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-center">
                          <div className="py-2">
                            <div className="font-semibold text-blue-900 text-xs sm:text-sm md:text-base">Questions</div>
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                              {currentLesson.quizData?.questions?.length || currentLesson.questions || 5}
                            </div>
                          </div>
                          <div className="py-2">
                            <div className="font-semibold text-blue-900 text-xs sm:text-sm md:text-base">Time Limit</div>
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                              {currentLesson.quizData?.timeLimit || 15} min
                            </div>
                          </div>
                          <div className="py-2">
                            <div className="font-semibold text-blue-900 text-xs sm:text-sm md:text-base">Passing Score</div>
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                              {currentLesson.quizData?.passingScore || 70}%
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => startQuiz(currentLesson)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg transition-colors w-full sm:w-auto"
                      >
                        Start Quiz
                      </button>
                    </div>
                  </div>
                </div>
              ) : !quizState.showResults ? (
                // Quiz Active Screen
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Quiz Header */}
                  <div className="bg-blue-600 text-white p-2 sm:p-3 md:p-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-3 sm:pr-4">
                        <h3 className="font-semibold text-xs sm:text-sm md:text-base truncate">
                          {currentLesson.quizData?.title || currentLesson.title}
                        </h3>
                        <div className="text-xs sm:text-sm opacity-90">
                          Question {quizState.currentQuestion + 1} of {currentLesson.quizData?.questions?.length || 1}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-base sm:text-lg md:text-2xl font-bold">
                          {formatTime(quizState.timeRemaining)}
                        </div>
                        <div className="text-xs opacity-90">Time Left</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-blue-500 rounded-full h-1.5 sm:h-2 mt-2 sm:mt-3 md:mt-4">
                      <div 
                        className="bg-white h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${((quizState.currentQuestion + 1) / (currentLesson.quizData?.questions?.length || 1)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Question Content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                      {(() => {
                        const question = currentLesson.quizData?.questions?.[quizState.currentQuestion];
                        if (!question) {
                          return (
                            <div className="text-center text-gray-600 py-8">
                              Quiz content not available
                            </div>
                          );
                        }
                        
                        return (
                          <div className="max-w-3xl mx-auto overflow-y-auto">
                            <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                              {question.question}
                            </h4>
                            
                            <div className="space-y-2 sm:space-y-3">
                              {question.type === 'multiple-choice' || question.type === 'true-false' ? (
                                question.options?.map((option, index) => (
                                  <label 
                                    key={index}
                                    className="flex items-start p-2.5 sm:p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${question.id}`}
                                      value={index}
                                      checked={quizState.answers[question.id] === index}
                                      onChange={() => handleQuizAnswer(question.id, index)}
                                      className="mr-2 sm:mr-3 mt-0.5 sm:mt-1 text-blue-600 flex-shrink-0"
                                    />
                                    <span className="text-sm sm:text-base leading-relaxed">{option}</span>
                                  </label>
                                ))
                              ) : question.type === 'multiple-select' ? (
                                question.options?.map((option, index) => (
                                  <label 
                                    key={index}
                                    className="flex items-start p-2.5 sm:p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      value={index}
                                      checked={(quizState.answers[question.id] || []).includes(index)}
                                      onChange={(e) => {
                                        const currentAnswers = quizState.answers[question.id] || [];
                                        const newAnswers = e.target.checked 
                                          ? [...currentAnswers, index]
                                          : currentAnswers.filter(ans => ans !== index);
                                        handleQuizAnswer(question.id, newAnswers);
                                      }}
                                      className="mr-2 sm:mr-3 mt-0.5 sm:mt-1 text-blue-600 flex-shrink-0"
                                    />
                                    <span className="text-sm sm:text-base leading-relaxed">{option}</span>
                                  </label>
                                ))
                              ) : null}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                      <div className="border bg-gray-50 p-2 sm:p-3 md:p-4 flex-shrink-0">
                    <div className="flex justify-between items-center max-w-3xl mx-auto w-full">
                      <button
                        onClick={previousQuestion}
                        disabled={quizState.currentQuestion === 0}
                        className="px-3 sm:px-4 md:px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-xs sm:text-sm md:text-base"
                      >
                        Previous
                      </button>
                      
                      <div className="flex space-x-2 sm:space-x-3">
                        {quizState.currentQuestion === (currentLesson.quizData?.questions?.length || 1) - 1 ? (
                          <button
                            onClick={handleQuizSubmit}
                            className="px-3 sm:px-4 md:px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-xs sm:text-sm md:text-base"
                          >
                            Submit Quiz
                          </button>
                        ) : (
                          <button
                            onClick={nextQuestion}
                            className="px-3 sm:px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm md:text-base"
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                  
                  {/* Navigation */}
                
                </div>
              ) : (
                // Quiz Results Screen
                <div className="flex-1 overflow-y-auto">
                  <div className=" flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="text-center max-w-2xl w-full">
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 lg:mb-6">
                        {quizState.score >= (currentLesson.quizData?.passingScore || 70) ? '🎉' : '😞'}
                      </div>
                      
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 px-2">
                        Quiz {quizState.score >= (currentLesson.quizData?.passingScore || 70) ? 'Completed!' : 'Not Passed'}
                      </h2>
                      
                      <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 ${
                        quizState.score >= (currentLesson.quizData?.passingScore || 70) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {quizState.score}%
                      </div>
                      
                      <p className="text-gray-600 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base leading-relaxed px-2">
                        {quizState.score >= (currentLesson.quizData?.passingScore || 70)
                          ? `Congratulations! You passed with ${quizState.score}% (required: ${currentLesson.quizData?.passingScore || 70}%)`
                          : `You scored ${quizState.score}%. You need ${currentLesson.quizData?.passingScore || 70}% to pass.`
                        }
                      </p>
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 md:gap-4 px-2">
                        {quizState.score < (currentLesson.quizData?.passingScore || 70) && (
                          <button 
                            onClick={() => {
                              setQuizState({
                                isActive: false,
                                currentQuestion: 0,
                                answers: {},
                                timeRemaining: null,
                                isSubmitted: false,
                                score: null,
                                showResults: false
                              });
                            }}
                            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base w-full sm:w-auto"
                          >
                            Retake Quiz
                          </button>
                        )}
                        
                        <button 
                          onClick={() => setCurrentLesson(null)}
                          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base w-full sm:w-auto"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : currentLesson.type === 'assignment' ? (
            <div className="flex-1 overflow-y-auto">
              <div className="h-screen bg-white flex flex-col px-1">
                {!assignmentState.isActive ? (
                  // Assignment Start Screen
                  <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📋</div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                          {currentLesson.assignmentData?.title || currentLesson.title}
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                          {currentLesson.assignmentData?.description || 'Complete this assignment to demonstrate your learning'}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
                        {/* Instructions */}
                        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
                          <h3 className="font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                            <span className="mr-2">📝</span>
                            Instructions
                          </h3>
                          <ol className="space-y-1.5 sm:space-y-2 text-blue-800 text-sm sm:text-base">
                            {(currentLesson.assignmentData?.instructions || [
                              'Read the assignment requirements carefully',
                              'Complete all deliverables',
                              'Submit your work when finished'
                            ]).map((instruction, index) => (
                              <li key={index} className="flex items-start">
                                <span className="font-semibold mr-2 mt-1 text-blue-600 text-xs sm:text-sm">{index + 1}.</span>
                                <span className="text-xs sm:text-sm">{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        
                        {/* Deliverables */}
                        <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
                          <h3 className="font-semibold text-green-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                            <span className="mr-2">📦</span>
                            Deliverables
                          </h3>
                          <ul className="space-y-1.5 sm:space-y-2 text-green-800 text-sm sm:text-base">
                            {(currentLesson.assignmentData?.deliverables || [
                              'Written response to assignment questions',
                              'Supporting documentation or examples'
                            ]).map((deliverable, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span className="text-xs sm:text-sm">{deliverable}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Assignment Info */}
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-center">
                          <div>
                            <div className="font-semibold text-gray-900 text-xs sm:text-sm">Estimated Time</div>
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">
                              {currentLesson.assignmentData?.estimatedTime || currentLesson.duration}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-xs sm:text-sm">Format</div>
                            <div className="text-sm sm:text-base md:text-lg text-gray-700">
                              {currentLesson.assignmentData?.submissionFormat || 'Text/File Upload'}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-xs sm:text-sm">Grading</div>
                            <div className="text-sm sm:text-base md:text-lg text-gray-700">Rubric-based</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <button 
                          onClick={() => startAssignment(currentLesson)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg transition-colors w-full sm:w-auto"
                        >
                          Start Assignment
                        </button>
                      </div>
                    </div>
                  </div>
                ) : !assignmentState.isSubmitted ? (
                  // Assignment Submission Screen - Responsive
                  <div className="flex-1 flex flex-col">
                    {/* Assignment Header */}
                    <div className="bg-emerald-600 text-white p-3 sm:p-4 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-3">
                          <h3 className="font-semibold text-sm sm:text-base md:text-lg truncate">
                            {currentLesson.assignmentData?.title || currentLesson.title}
                          </h3>
                          <div className="text-xs sm:text-sm opacity-90">
                            Assignment Submission
                          </div>
                        </div>
                        <button 
                          onClick={() => setCurrentLesson(null)}
                          className="text-white bg-emerald-700 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm sm:text-base hover:bg-emerald-800 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    {/* Assignment Content */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
                        {/* Assignment Prompt */}
                        <div className="mb-4 sm:mb-6">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                            Assignment Prompt
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                            {currentLesson.assignmentData?.prompt || 
                             'Please complete the following assignment based on the lesson materials. Provide detailed responses and examples where appropriate.'}
                          </div>
                        </div>
                        
                        {/* Questions or Tasks */}
                        {currentLesson.assignmentData?.questions ? (
                          <div className="space-y-4 sm:space-y-6">
                            {currentLesson.assignmentData.questions.map((question, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                                <label className="block mb-2 sm:mb-3">
                                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                                    {index + 1}. {question.question}
                                  </span>
                                  {question.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </label>
                                
                                {question.type === 'text' || !question.type ? (
                                  <textarea
                                    value={assignmentState.responses[question.id] || ''}
                                    onChange={(e) => handleAssignmentResponse(question.id, e.target.value)}
                                    placeholder="Enter your response here..."
                                    className="w-full h-24 sm:h-32 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    rows={question.minLines || 4}
                                  />
                                ) : question.type === 'file' ? (
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                                    <input
                                      type="file"
                                      id={`file-${question.id}`}
                                      multiple={question.allowMultiple}
                                      accept={question.fileTypes}
                                      onChange={(e) => handleFileUpload(question.id, e.target.files)}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={`file-${question.id}`}
                                      className="cursor-pointer text-emerald-600 hover:text-emerald-700"
                                    >
                                      <div className="text-2xl sm:text-3xl mb-2">📎</div>
                                      <div className="text-sm sm:text-base font-medium">
                                        Click to upload files
                                      </div>
                                      <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                        {question.fileTypes || 'All file types accepted'}
                                      </div>
                                    </label>
                                    
                                    {/* Show uploaded files */}
                                    {assignmentState.files[question.id] && assignmentState.files[question.id].length > 0 && (
                                      <div className="mt-3 space-y-1">
                                        {Array.from(assignmentState.files[question.id]).map((file, fileIndex) => (
                                          <div key={fileIndex} className="flex items-center justify-between bg-white p-2 rounded border text-xs sm:text-sm">
                                            <span className="truncate">{file.name}</span>
                                            <button
                                              onClick={() => removeFile(question.id, fileIndex)}
                                              className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ) : null}
                                
                                {/* Word count for text responses */}
                                {(question.type === 'text' || !question.type) && assignmentState.responses[question.id] && (
                                  <div className="text-xs sm:text-sm text-gray-500 mt-1 text-right">
                                    {assignmentState.responses[question.id].split(' ').filter(word => word.length > 0).length} words
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Single text area for general assignment
                          <div className="mb-4 sm:mb-6">
                            <label className="block mb-2 sm:mb-3 font-medium text-gray-900 text-sm sm:text-base">
                              Your Response *
                            </label>
                            <textarea
                              value={assignmentState.generalResponse || ''}
                              onChange={(e) => setAssignmentState(prev => ({
                                ...prev,
                                generalResponse: e.target.value
                              }))}
                              placeholder="Provide your detailed response to the assignment..."
                              className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-base resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <div className="text-xs sm:text-sm text-gray-500 mt-1 text-right">
                              {(assignmentState.generalResponse || '').split(' ').filter(word => word.length > 0).length} words
                            </div>
                          </div>
                        )}
                        
                        {/* Additional Notes */}
                        <div className="mb-6 sm:mb-8">
                          <label className="block mb-2 sm:mb-3 font-medium text-gray-900 text-sm sm:text-base">
                            Additional Notes (Optional)
                          </label>
                          <textarea
                            value={assignmentState.notes || ''}
                            onChange={(e) => setAssignmentState(prev => ({
                              ...prev,
                              notes: e.target.value
                            }))}
                            placeholder="Any additional comments or questions..."
                            className="w-full h-20 sm:h-24 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Submit Footer */}
                    <div className="border-t bg-gray-50 p-3 sm:p-4 flex-shrink-0">
                      <div className="max-w-4xl mx-auto w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                          <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                            Make sure to review your work before submitting
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
                            <button
                              onClick={() => {
                                setAssignmentState({
                                  isActive: false,
                                  responses: {},
                                  files: {},
                                  generalResponse: '',
                                  notes: '',
                                  isSubmitted: false,
                                  submissionTime: null
                                });
                              }}
                              className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
                            >
                              Save Draft
                            </button>
                            
                            <button
                              onClick={handleAssignmentSubmit}
                              disabled={!isAssignmentComplete()}
                              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-sm sm:text-base w-full sm:w-auto"
                            >
                              Submit Assignment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Assignment Submitted Screen
                  <div className="flex-1 overflow-y-auto">
                    <div className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
                      <div className="text-center max-w-2xl w-full">
                        <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">✅</div>
                        
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                          Assignment Submitted!
                        </h2>
                        
                        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed px-2">
                          Your assignment has been successfully submitted for review. 
                          You'll receive feedback once it has been graded.
                        </p>
                        
                        <div className="bg-green-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 mx-2 sm:mx-0">
                          <div className="text-sm sm:text-base text-green-800">
                            <div className="font-semibold mb-2">Submission Details:</div>
                            <div className="space-y-1 text-left">
                              <div>Submitted: {assignmentState.submissionTime?.toLocaleString()}</div>
                              <div>Status: Under Review</div>
                              <div>Expected Feedback: Within 2-3 business days</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 px-2">
                          <button 
                            onClick={() => setCurrentLesson(null)}
                            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm sm:text-base w-full sm:w-auto"
                          >
                            Continue Learning
                          </button>
                          
                          <button 
                            onClick={() => {
                              // View submission logic
                              console.log('View submission details');
                            }}
                            className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
                          >
                            View Submission
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Default content type fallback
            <div className="h-screen bg-white flex items-center justify-center">
              <div className="text-center text-gray-600 p-4">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📄</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Content Not Available</h3>
                <p className="text-sm sm:text-base">This lesson type is not supported yet.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Hidden on mobile, shown on larger screens when not fullscreen */}
        {!isFullscreen && (
          <div className="hidden lg:block lg:w-80 xl:w-96 bg-white border-l">
            <div className="h-full flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b">
                <h4 className="font-semibold text-gray-900">Lesson Resources</h4>
              </div>
              
              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Lesson Info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h5 className="font-medium text-gray-900 mb-2">{currentLesson.title}</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Type: {currentLesson.type}</div>
                    <div>Duration: {currentLesson.duration}</div>
                    {currentLesson.difficulty && <div>Level: {currentLesson.difficulty}</div>}
                  </div>
                </div>
                
                {/* Related Resources */}
                {currentLesson.resources && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Additional Resources</h5>
                    <div className="space-y-2">
                      {currentLesson.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 bg-blue-50 rounded border text-sm text-blue-800 hover:bg-blue-100 transition-colors"
                        >
                          📎 {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Progress Tracking */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Progress</h5>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${currentLesson.type === 'video' ? (videoProgress[currentLesson.id]?.progress || 0) : 0}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {currentLesson.type === 'video' ? `${Math.round(videoProgress[currentLesson.id]?.progress || 0)}% complete` : 'Not started'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

      {/* Main Course Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Hero Section */}
        <div className="bg-gray-900 text-white rounded-lg lg:rounded-xl overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">
            {/* Course Info */}
            <div className="flex-1 p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-emerald-600 text-xs px-2 py-1 rounded-full">{course.category?.name}</span>
                <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">{course.level}</span>
                <div className="flex items-center text-yellow-400 text-sm">
                  <span className="mr-1">⭐</span>
                  <span>{course.rating}</span>
                  <span className="text-gray-300 ml-1">({course.studentsCount.toLocaleString()} students)</span>
                </div>
              </div>
              
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4">{course.title}</h1>
              
              <p className="text-gray-300 mb-6 text-sm sm:text-base leading-relaxed">
                {showFullDescription ? course.description : `${course.description.slice(0, 200)}...`}
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-emerald-400 hover:text-emerald-300 ml-2 underline"
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                </button>
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatDuration(course.duration)}</div>
                  <div className="text-sm text-gray-300">Total duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalLessons}</div>
                  <div className="text-sm text-gray-300">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{course.modules.length}</div>
                  <div className="text-sm text-gray-300">Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{course.level}</div>
                  <div className="text-sm text-gray-300">Level</div>
                </div>
              </div>

              {/* Enrollment Status */}
             {isEnrolled && (
  <div className="bg-emerald-600 bg-opacity-20 border border-emerald-500 rounded-lg p-4 mb-6">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-emerald-400">Enrolled since {enrollmentDate}</div>
        <div className="text-sm text-gray-300">
          {completedLessonsCount}/{totalLessons} lessons completed ({Math.round(completionPercentage || 0)}%)
        </div>
      </div>
      <div className="text-right">
        <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-lg font-bold">
          {Math.round(completionPercentage || 0)}%
        </div>
      </div>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
      <div
        className="bg-white h-2 rounded-full transition-all duration-500"
        style={{ width: `${completionPercentage || 0}%` }}
      />
    </div>
  </div>
)}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isEnrolled ? (
                  <button 
                    onClick={handleContinueLearning}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleEnroll}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Enroll Now - Free
                    </button>
                   
                  </>
                )}
                
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">▶️</span>
                  Preview
                </button>

              </div>
            </div>

            {/* Course Thumbnail */}
         <div className="w-full sm:w-80 lg:w-80 xl:w-96 mx-auto sm:mx-0">
  <div className="relative h-48 sm:h-56 md:h-64 lg:h-full rounded-lg overflow-hidden shadow-lg group">
    {/* Course Image */}
    <img
      src={course.image}
      alt={course.title}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      onError={(e) => {
        // Fallback image if course image fails to load
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvdXJzZSBJbWFnZTwvdGV4dD48L3N2Zz4=';
      }}
    />
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
    
    {/* Play Button */}
    <button
      onClick={() => setIsVideoModalOpen(true)}
      className="absolute inset-0 flex items-center justify-center transition-all duration-300 group"
      aria-label="Play course preview video"
    >
      {/* Play Button Background */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:bg-white/95 transition-all duration-300">
        {/* Play Icon */}
        <div className="w-0 h-0 border-l-[8px] sm:border-l-[10px] md:border-l-[12px] border-r-0 border-t-[6px] sm:border-t-[7px] md:border-t-[8px] border-b-[6px] sm:border-b-[7px] md:border-b-[8px] border-l-gray-700 border-t-transparent border-b-transparent ml-1" />
      </div>
      
      {/* Hover Text */}
      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm sm:text-base font-medium">Watch Preview</p>
      </div>
    </button>
    
    {/* Course Badge/Tag (if applicable) */}
    {course.level && (
      <div className="absolute top-3 left-3">
        <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-600/80 backdrop-blur-sm rounded-full">
          {course.level}
        </span>
      </div>
    )}
    
    {/* Duration Badge (if applicable) */}
    {course.duration && (
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 text-xs font-medium text-white bg-black/60 backdrop-blur-sm rounded-full">
          {formatDuration(course.duration)}
        </span>
      </div>
    )}
    
    {/* Loading State */}
    <div className="absolute inset-0 bg-gray-200 animate-pulse hidden [&.loading]:block">
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
    </div>
  </div>
  
  {/* Image Caption (Optional) */}
  {course.imageCaption && (
    <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center px-2">
      {course.imageCaption}
    </p>
  )}
</div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'curriculum', label: 'Curriculum', icon: '📚' },
              { id: 'instructor', label: 'Instructor', icon: '👨‍🏫' },
              { id: 'reviews', label: 'Reviews', icon: '⭐' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-1 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
{activeTab === 'overview' && (
  <div className="space-y-6 md:space-y-8">
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">About this course</h2>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {course.description}
        </p>
      </div>
    </div>

    <div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">What you'll learn</h3>
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {(course.whatYouWillLearn || []).map((outcome, index) => (
          <div key={index} className="flex items-start space-x-3 p-2 md:p-0 rounded-lg hover:bg-gray-50 md:hover:bg-transparent transition-colors">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-700 text-sm md:text-base leading-relaxed flex-1">
              {outcome}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Requirements</h3>
      <div className="space-y-3 md:space-y-2">
        {(course.requirements || []).map((requirement, index) => (
          <div key={index} className="flex items-start space-x-3 p-2 md:p-0 rounded-lg">
            <div className="flex-shrink-0 mt-1">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span className="text-gray-600 text-sm md:text-base leading-relaxed flex-1">
              {requirement}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

{activeTab === 'curriculum' && (
  <div className="space-y-4 md:space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Course Content</h2>
      <div className="text-xs sm:text-sm text-gray-600">
        {course.modules.length} modules • {totalLessons} lessons • {course.duration} total
      </div>
    </div>

    <div className="space-y-3 md:space-y-4">
      {course.modules.map((module) => (
        <div key={module.id} className="border border-gray-200 rounded-lg shadow-sm">
          <button
            onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
            className="w-full px-4 md:px-6 py-3 md:py-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-3">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                  {module.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  {module.lessons.length} lessons • {module.duration}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span 
                  className={`inline-block transform transition-transform duration-200 text-gray-400 ${
                    selectedModule === module.id ? 'rotate-180' : ''
                  }`}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </button>

          {selectedModule === module.id && (
            <div className="border-t border-gray-200 bg-gray-50 md:bg-white">
              {module.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  id={`lesson-${lesson.id}`}
                  className={`px-4 md:px-6 py-3 md:py-3 flex items-center justify-between hover:bg-gray-100 md:hover:bg-gray-50 active:bg-gray-200 md:active:bg-gray-100 transition-colors touch-manipulation ${
                    index !== module.lessons.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      progress[lesson.id]?.completed 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {progress[lesson.id]?.completed ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-xs">
                          {lesson.type === 'video' ? '▶' : 
                           lesson.type === 'quiz' ? '?' : '📝'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm md:text-base leading-tight truncate md:whitespace-normal">
                        {lesson.title}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 capitalize mt-0.5">
                        {lesson.type} • {lesson.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    {isEnrolled && (
                      <button
                        onClick={() => handleStartLesson(lesson)}
                        className="text-blue-600 hover:text-blue-800 active:text-blue-900 font-medium text-xs md:text-sm px-2 py-1 rounded hover:bg-blue-50 active:bg-blue-100 transition-colors touch-manipulation"
                      >
                        {progress[lesson.id]?.completed ? 'Review' : 'Start'}
                      </button>
                    )}
                    {lesson.type === 'video' && !isEnrolled && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        Preview
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{activeTab === 'instructor' && (
  <div className="space-y-4 md:space-y-6">
    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Instructor</h2>
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <img
            src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
            alt={course.instructor?.name || 'Dr. Sarah Johnson'}
            className="w-20 h-20 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
          />
          <div className="text-center sm:text-left sm:hidden">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {course.instructor?.name || 'Dr. Sarah Johnson'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {course.instructor?.title || 'Agricultural Science Professor & Consultant'}
            </p>
          </div>
        </div>
        
        <div className="flex-1 w-full">
          <div className="hidden sm:block mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
              {course.instructor?.name || 'Dr. Sarah Johnson'}
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              {course.instructor?.title || 'Agricultural Science Professor & Consultant'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="text-center p-2 rounded-lg bg-gray-50 md:bg-transparent">
              <div className="font-semibold text-gray-900 text-base md:text-lg">4.8</div>
              <div className="text-gray-600 text-xs md:text-sm leading-tight">
                Instructor Rating
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50 md:bg-transparent">
              <div className="font-semibold text-gray-900 text-base md:text-lg">2,847</div>
              <div className="text-gray-600 text-xs md:text-sm leading-tight">
                Reviews
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50 md:bg-transparent">
              <div className="font-semibold text-gray-900 text-base md:text-lg">15,629</div>
              <div className="text-gray-600 text-xs md:text-sm leading-tight">
                Students
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50 md:bg-transparent">
              <div className="font-semibold text-gray-900 text-base md:text-lg">12</div>
              <div className="text-gray-600 text-xs md:text-sm leading-tight">
                Courses
              </div>
            </div>
          </div>
          
          <div className="border-t md:border-t-0 pt-4 md:pt-0">
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {course.instructor?.bio || 'Dr. Johnson has over 15 years of experience in agricultural research and education. She specializes in sustainable farming practices and has published numerous papers on crop management techniques.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{activeTab === 'reviews' && (
  <div className="space-y-4 md:space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Student Reviews</h2>
      <div className="flex items-center space-x-2">
        <span className="text-xl md:text-2xl font-bold text-gray-900">{course.rating}</span>
        <div className="flex text-yellow-400 text-sm md:text-base">
          {[1,2,3,4,5].map(star => (
            <span key={star}>⭐</span>
          ))}
        </div>
        <span className="text-gray-600 text-sm md:text-base">
          ({course.reviewsCount.toLocaleString()} reviews)
        </span>
      </div>
    </div>

    {/* Rating Breakdown */}
    <div className="bg-gray-50 rounded-lg p-4 md:p-6">
      <div className="space-y-2 md:space-y-3">
        {[5,4,3,2,1].map(rating => (
          <div key={rating} className="flex items-center space-x-3 md:space-x-4">
            <span className="text-xs md:text-sm font-medium w-6 md:w-8 flex-shrink-0">
              {rating}★
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="bg-yellow-400 h-1.5 md:h-2 rounded-full transition-all duration-300"
                style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : 2}%` }}
              />
            </div>
            <span className="text-xs md:text-sm text-gray-600 w-8 md:w-12 flex-shrink-0">
              {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '8%' : '2%'}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Add Review Form - Only show if user is enrolled */}
    {isEnrolled && userId && (
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Leave a Review</h3>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                  className="text-2xl md:text-3xl focus:outline-none hover:scale-110 transition-transform touch-manipulation"
                >
                  <span className={star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ⭐
                  </span>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
          
          <div>
            <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              id="review-comment"
              rows={4}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm md:text-base"
              placeholder="Share your experience with this course..."
              required
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              type="submit"
              disabled={reviewForm.isSubmitting || !reviewForm.comment.trim()}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm md:text-base touch-manipulation"
            >
              {reviewForm.isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setReviewForm({ rating: 5, comment: '', isSubmitting: false })}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}

    {/* Reviews List */}
    <div className="space-y-4 md:space-y-6">
      {course.reviews?.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-4 md:pb-6 last:border-b-0">
          <div className="flex items-start space-x-3 md:space-x-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs md:text-sm font-medium text-white flex-shrink-0">
              {review.student.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                <span className="font-medium text-gray-900 text-sm md:text-base">
                  {review.student}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400 text-xs md:text-sm">
                    {[1,2,3,4,5].map(star => (
                      <span key={star}>{star <= review.rating ? '⭐' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-xs md:text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-3 text-sm md:text-base">
                {review.comment}
              </p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-xs md:text-sm text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors touch-manipulation">
                  <span>👍</span>
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {(!course.reviews || course.reviews.length === 0) && (
        <div className="text-center py-8 md:py-12">
          <div className="text-gray-400 text-4xl md:text-5xl mb-4">📝</div>
          <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 text-sm md:text-base">
            {isEnrolled ? 'Be the first to leave a review!' : 'Enroll in this course to leave a review.'}
          </p>
        </div>
      )}
    </div>
  </div>
)}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Course Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{formatDuration(course.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate</span>
                  <span className="font-medium">Yes</span>
                </div>
              </div>
            </div>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Related Courses</h3>
                <div className="space-y-4">
                  {relatedCourses.map((relatedCourse) => (
                    <div key={relatedCourse.id} className="flex space-x-3">
                      <img 
                        src={relatedCourse.thumbnail} 
                        alt={relatedCourse.title}
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{relatedCourse.title}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{relatedCourse.instructor?.name || 'Various'}</span>
                          <span className="font-semibold text-sm text-emerald-600">${relatedCourse.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
                      

