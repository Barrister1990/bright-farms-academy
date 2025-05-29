import { useEffect, useRef, useState } from 'react';
import useCourseStore from '../store/courseStore';

const CourseDetailPage = ({ courseSlug }) => {
  const demoSlug = courseSlug || 'modern-crop-management-techniques';
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoProgress, setVideoProgress] = useState({});
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [lessonNotes, setLessonNotes] = useState({});
const [completedLessons, setCompletedLessons] = useState([]);
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
const getLessonProgress = (lessonId) => {
  if (completedLessons.includes(lessonId)) {
    return 100;
  }
  
  // Check video progress
  if (videoProgress[lessonId]) {
    return Math.round(videoProgress[lessonId].progress || 0);
  }
  
  // Check quiz progress
  if (quizState.isActive && currentLesson?.id === lessonId) {
    return Math.round((quizState.currentQuestion / (currentLesson.quizData?.questions?.length || 1)) * 100);
  }

  // Check assignment progress
  if (assignmentState.isActive && currentLesson?.id === lessonId) {
    const totalDeliverables = currentLesson.assignmentData?.deliverables?.length || 1;
    const completedDeliverables = Object.values(assignmentState.submissions).filter(sub => sub?.trim()).length;
    return Math.round((completedDeliverables / totalDeliverables) * 100);
  }
  
  return 0;
};

const markLessonComplete = (lessonId) => {
  setCompletedLessons(prev => {
    if (!prev.includes(lessonId)) {
      return [...prev, lessonId];
    }
    return prev;
  });
};

const isAssignmentComplete = () => {
  if (!currentLesson?.assignmentData?.deliverables) {
    return assignmentState.submissions['Assignment Response']?.trim();
  }
  
  return currentLesson.assignmentData.deliverables.every(deliverable => 
    assignmentState.submissions[deliverable]?.trim()
  );
};
const handleAssignmentSubmit = () => {
  if (!isAssignmentComplete()) {
    alert('Please complete all deliverables before submitting');
    return;
  }
  
  setAssignmentState(prev => ({
    ...prev,
    isSubmitted: true
  }));
  
  // Here you would typically send the assignment data to your backend
  console.log('Assignment submitted:', {
    lessonId: currentLesson.id,
    submissions: assignmentState.submissions,
    files: assignmentState.files
  });
};

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

// Quiz Functions
const startQuiz = (lesson) => {
  const quizData = lesson.quizData;
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

const handleQuizSubmit = () => {
  const lesson = currentLesson;
  const quizData = lesson.quizData;
  let correctCount = 0;
  
  quizData.questions.forEach(question => {
    const userAnswer = quizState.answers[question.id];
    
    if (question.type === 'multiple-select') {
      const correctAnswers = question.correctAnswers;
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
  const passed = score >= quizData.passingScore;
  
  setQuizState(prev => ({
    ...prev,
    isSubmitted: true,
    score: score,
    showResults: true
  }));
  
  // Update progress if passed
  if (passed) {
    updateCourseProgress(course.id, lesson.id, true);
    handleLessonComplete(lesson.id);
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

const submitAssignment = () => {
  setAssignmentState(prev => ({
    ...prev,
    isSubmitted: true
  }));
  
  // Mark lesson as completed
  updateCourseProgress(course.id, currentLesson.id, true);
  handleLessonComplete(currentLesson.id);
  
  alert('Assignment submitted successfully!');
};



  const {
    courses,
    getCoursesByCategory,
    getCourseProgress,
    getCourseCompletionPercentage,
    updateCourseProgress,
    enrollInCourse,
    isEnrolledInCourse
  } = useCourseStore();

  const course = courses.find(c => c.slug === demoSlug || c.id.toString() === demoSlug);
  const relatedCourses = course ? getCoursesByCategory(course.categoryId).filter(c => c.id !== course.id).slice(0, 4) : [];
  const progress = course ? getCourseProgress(course.id) : {};
  const completionPercentage = course ? getCourseCompletionPercentage(course.id) : 0;
  const isEnrolled = course ? isEnrolledInCourse(course.id) : false;

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (course) {
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">The course you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors w-full sm:w-auto"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    enrollInCourse(course.id);
    setShowCongrats(true);
    setTimeout(() => setShowCongrats(false), 3000);
  };

  const handleAddToCart = () => {
    if (!cartItems.includes(course.id)) {
      setCartItems([...cartItems, course.id]);
      alert('Course added to cart!');
    }
  };

  const handleAddToWishlist = () => {
    if (!wishlistItems.includes(course.id)) {
      setWishlistItems([...wishlistItems, course.id]);
      alert('Course added to wishlist!');
    }
  };

  const handleLessonComplete = (lessonId) => {
    updateCourseProgress(course.id, lessonId, true);
    
    // Show completion animation
    const lessonElement = document.getElementById(`lesson-${lessonId}`);
    if (lessonElement) {
      lessonElement.classList.add('animate-pulse');
      setTimeout(() => {
        lessonElement.classList.remove('animate-pulse');
      }, 1000);
    }
  };

  const handleStartLesson = (lesson) => {
    setCurrentLesson(lesson);
    setVideoError(false);
    setIsVideoLoading(true);
    if (!progress[lesson.id]) {
      updateCourseProgress(course.id, lesson.id, false);
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
{showVideo && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Course Preview</h3>
        <button 
          onClick={() => setShowVideo(false)}
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
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
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
  <div className={`fixed inset-0 bg-black z-50 ${isFullscreen ? '' : 'p-0 sm:p-4'}`}>
    <div className={`bg-black h-screen w-full ${isFullscreen ? '' : 'sm:bg-white sm:rounded-lg sm:overflow-hidden sm:max-w-7xl sm:mx-auto'}`}>
      {/* Header - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="hidden sm:flex justify-between items-center p-4 border-b bg-white">
          <div>
            <h3 className="text-lg font-semibold">{currentLesson.title}</h3>
            <p className="text-sm text-gray-600">{currentLesson.type} • {currentLesson.duration}</p>
          </div>
          <button 
            onClick={() => setCurrentLesson(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl p-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className={`${isFullscreen ? 'h-full' : 'h-full sm:h-auto'} flex flex-col sm:flex-row`}>
        {/* Content Section - Changes based on lesson type */}
        <div className={`${isFullscreen ? 'h-full' : 'h-64 sm:h-96 lg:h-[500px] sm:flex-1'} relative bg-black`}>
          {currentLesson.type === 'video' ? (
            <div className="relative h-full">
              {/* Loading Spinner */}
              {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}

              {/* Video Error State */}
              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                  <div className="text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <div className="text-xl mb-2">Video unavailable</div>
                    <div className="text-sm opacity-75">Please try again later</div>
                    <button 
                      onClick={() => {
                        setVideoError(false);
                        setIsVideoLoading(true);
                        if (videoRef.current) {
                          videoRef.current.load();
                        }
                      }}
                      className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
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
                  className="absolute top-4 right-4 z-20 text-white bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center sm:hidden"
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
                  className="absolute inset-0 flex items-center justify-center text-white text-6xl hover:bg-black hover:bg-opacity-20 transition-colors"
                >
                  {videoRef.current?.paused !== false ? '▶️' : '⏸️'}
                </button>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-2 bg-white bg-opacity-30 rounded-full mb-4 cursor-pointer"
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
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause */}
                      <button
                        onClick={() => {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                          } else {
                            videoRef.current.pause();
                          }
                        }}
                        className="text-2xl hover:scale-110 transition-transform"
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
                        className="text-xl hover:scale-110 transition-transform"
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
                        className="text-xl hover:scale-110 transition-transform"
                      >
                        ⏩
                      </button>

                      {/* Time Display */}
                      <span className="text-sm">
                        {formatTime(videoProgress[currentLesson.id]?.currentTime || 0)} / {formatTime(videoProgress[currentLesson.id]?.duration || 0)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
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
                        className="bg-black bg-opacity-50 text-white text-sm border border-white border-opacity-30 rounded px-2 py-1"
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
                        className="text-xl hover:scale-110 transition-transform"
                      >
                        {isFullscreen ? '🗗' : '⛶'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : currentLesson.type === 'quiz' ? (
  <div className="h-screen bg-white flex flex-col overflow-auto">
    {!quizState.isActive ? (
      // Quiz Start Screen
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="text-center max-w-2xl w-full">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 lg:mb-6">📝</div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4 px-2">
              {currentLesson.quizData?.title || currentLesson.title}
            </h2>
            <p className="text-gray-600 mb-6 lg:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed px-2">
              {currentLesson.quizData?.description || 'Test your knowledge with this quiz'}
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 lg:mb-8 mx-2 sm:mx-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="py-2">
                  <div className="font-semibold text-blue-900 text-sm sm:text-base">Questions</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {currentLesson.quizData?.questions?.length || currentLesson.questions || 5}
                  </div>
                </div>
                <div className="py-2">
                  <div className="font-semibold text-blue-900 text-sm sm:text-base">Time Limit</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {currentLesson.quizData?.timeLimit || 15} min
                  </div>
                </div>
                <div className="py-2">
                  <div className="font-semibold text-blue-900 text-sm sm:text-base">Passing Score</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {currentLesson.quizData?.passingScore || 70}%
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => startQuiz(currentLesson)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors w-full sm:w-auto"
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
        <div className="bg-blue-600 text-white p-3 sm:p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-4">
              <h3 className="font-semibold text-sm sm:text-base truncate">
                {currentLesson.quizData?.title || currentLesson.title}
              </h3>
              <div className="text-xs sm:text-sm opacity-90">
                Question {quizState.currentQuestion + 1} of {currentLesson.quizData?.questions?.length || 1}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg sm:text-2xl font-bold">
                {formatTime(quizState.timeRemaining)}
              </div>
              <div className="text-xs sm:text-sm opacity-90">Time Left</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-blue-500 rounded-full h-2 mt-3 sm:mt-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((quizState.currentQuestion + 1) / (currentLesson.quizData?.questions?.length || 1)) * 100}%` 
              }}
            />
          </div>
        </div>
        
        {/* Question Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
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
                <div className="max-w-3xl mx-auto">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-relaxed">
                    {question.question}
                  </h4>
                  
                  <div className="space-y-3">
                    {question.type === 'multiple-choice' || question.type === 'true-false' ? (
                      question.options?.map((option, index) => (
                        <label 
                          key={index}
                          className="flex items-start p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={index}
                            checked={quizState.answers[question.id] === index}
                            onChange={() => handleQuizAnswer(question.id, index)}
                            className="mr-3 mt-1 text-blue-600 flex-shrink-0"
                          />
                          <span className="text-sm sm:text-base leading-relaxed">{option}</span>
                        </label>
                      ))
                    ) : question.type === 'multiple-select' ? (
                      question.options?.map((option, index) => (
                        <label 
                          key={index}
                          className="flex items-start p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
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
                            className="mr-3 mt-1 text-blue-600 flex-shrink-0"
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
        </div>
        
        {/* Navigation */}
        <div className="border-t bg-gray-50 p-3 sm:p-4 flex-shrink-0">
          <div className="flex justify-between items-center max-w-3xl mx-auto w-full">
            <button
              onClick={previousQuestion}
              disabled={quizState.currentQuestion === 0}
              className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Previous
            </button>
            
            <div className="flex space-x-2 sm:space-x-3">
              {quizState.currentQuestion === (currentLesson.quizData?.questions?.length || 1) - 1 ? (
                <button
                  onClick={handleQuizSubmit}
                  className="px-4 sm:px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : (
      // Quiz Results Screen
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="text-center max-w-2xl w-full">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 lg:mb-6">
              {quizState.score >= (currentLesson.quizData?.passingScore || 70) ? '🎉' : '😞'}
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4 px-2">
              Quiz {quizState.score >= (currentLesson.quizData?.passingScore || 70) ? 'Completed!' : 'Not Passed'}
            </h2>
            
            <div className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 ${
              quizState.score >= (currentLesson.quizData?.passingScore || 70) ? 'text-green-600' : 'text-red-600'
            }`}>
              {quizState.score}%
            </div>
            
            <p className="text-gray-600 mb-6 lg:mb-8 text-sm sm:text-base leading-relaxed px-2">
              {quizState.score >= (currentLesson.quizData?.passingScore || 70)
                ? `Congratulations! You passed with ${quizState.score}% (required: ${currentLesson.quizData?.passingScore || 70}%)`
                : `You scored ${quizState.score}%. You need ${currentLesson.quizData?.passingScore || 70}% to pass.`
              }
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base w-full sm:w-auto"
                >
                  Retake Quiz
                </button>
              )}
              
              <button 
                onClick={() => setCurrentLesson(null)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base w-full sm:w-auto"
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
    <div className="flex-1 overflow-y-auto ">
            <div className="h-screen bg-white flex flex-col px-1">
              {!assignmentState.isActive ? (
                // Assignment Start Screen
                <div className="flex-1 overflow-y-auto">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-4">📋</div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {currentLesson.assignmentData?.title || currentLesson.title}
                      </h2>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {currentLesson.assignmentData?.description || 'Complete this assignment to demonstrate your learning'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      {/* Instructions */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                          <span className="mr-2">📝</span>
                          Instructions
                        </h3>
                        <ol className="space-y-2 text-blue-800">
                          {(currentLesson.assignmentData?.instructions || [
                            'Read the assignment requirements carefully',
                            'Complete all deliverables',
                            'Submit your work when finished'
                          ]).map((instruction, index) => (
                            <li key={index} className="flex items-start">
                              <span className="font-semibold mr-2 mt-1 text-blue-600">{index + 1}.</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      {/* Deliverables */}
                      <div className="bg-green-50 rounded-lg p-6">
                        <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                          <span className="mr-2">📦</span>
                          Deliverables
                        </h3>
                        <ul className="space-y-2 text-green-800">
                          {(currentLesson.assignmentData?.deliverables || [
                            'Written response to assignment questions',
                            'Supporting documentation or examples'
                          ]).map((deliverable, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-600 mr-2">•</span>
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Assignment Info */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="font-semibold text-gray-900">Estimated Time</div>
                          <div className="text-2xl font-bold text-emerald-600">
                            {currentLesson.assignmentData?.estimatedTime || currentLesson.duration}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Format</div>
                          <div className="text-lg text-gray-700">
                            {currentLesson.assignmentData?.submissionFormat || 'Text/File Upload'}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Grading</div>
                          <div className="text-lg text-gray-700">Rubric-based</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button 
                        onClick={() => startAssignment(currentLesson)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                      >
                        Start Assignment
                      </button>
                    </div>
                  </div>
                </div>
              ) : !assignmentState.isSubmitted ? (
                // Assignment Submission Screen
                <div className="flex-1 flex flex-col">
                  {/* Header */}
                  <div className="bg-emerald-600 text-white p-4">
                    <h3 className="font-semibold">{currentLesson.assignmentData?.title || currentLesson.title}</h3>
                    <div className="text-sm opacity-90">Complete and submit your assignment</div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 overflow-y-auto  bg-white">
                    <div className="max-w-4xl mx-auto space-y-8">
                      {/* Submission Areas for each deliverable */}
                      {(currentLesson.assignmentData?.deliverables || ['Assignment Response']).map((deliverable, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 mb-4">
                            {index + 1}. {deliverable}
                          </h4>
                          
                          <textarea
                            placeholder={`Provide your work for: ${deliverable}`}
                            value={assignmentState.submissions[deliverable] || ''}
                            onChange={(e) => handleAssignmentSubmission(deliverable, e.target.value)}
                            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                          
                          {/* File Upload */}
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload supporting files (optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                                className="hidden"
                                id={`file-upload-${index}`}
                              />
                              <label htmlFor={`file-upload-${index}`} className="cursor-pointer">
                                <div className="text-gray-600">
                                  <span className="text-2xl block mb-2">📎</span>
                                  Click to upload files or drag and drop
                                </div>
                                <div className="text-sm text-gray-500">
                                  PDF, DOC, DOCX, PNG, JPG up to 10MB each
                                </div>
                              </label>
                            </div>
                            
                            {assignmentState.files.length > 0 && (
                              <div className="mt-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</div>
                                <div className="space-y-2">
                                  {assignmentState.files.map((file, fileIndex) => (
                                    <div key={fileIndex} className="flex items-center justify-between bg-white p-2 rounded border">
                                      <span className="text-sm text-gray-700">{file.name}</span>
                                      <button
                                        onClick={() => {
                                          setAssignmentState(prev => ({
                                            ...prev,
                                            files: prev.files.filter((_, i) => i !== fileIndex)
                                          }));
                                        }}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Submission Summary */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-900 mb-4">Submission Checklist</h4>
                        <div className="space-y-2">
                          {(currentLesson.assignmentData?.deliverables || ['Assignment Response']).map((deliverable, index) => (
                            <div key={index} className="flex items-center">
                              <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs ${
                                assignmentState.submissions[deliverable]?.trim() 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-gray-300 text-gray-600'
                              }`}>
                                {assignmentState.submissions[deliverable]?.trim() ? '✓' : index + 1}
                              </div>
                              <span className={assignmentState.submissions[deliverable]?.trim() ? 'text-green-800' : 'text-gray-600'}>
                                {deliverable}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  {/* Footer */}
                  <div className="border-t bg-gray-50 p-4">
                    <div className="flex justify-between items-center max-w-4xl mx-auto">
                      <button
                        onClick={() => setCurrentLesson(null)}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      
                      <button
                        onClick={handleAssignmentSubmit}
                        disabled={!isAssignmentComplete()}
                        className="px-8 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                      >
                        Submit Assignment
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Assignment Submitted Screen
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-2xl">
                    <div className="text-6xl mb-6">✅</div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Assignment Submitted!
                    </h2>
                    
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                      Your assignment has been submitted successfully. You will receive feedback within 3-5 business days.
                    </p>
                    
                    <div className="bg-green-50 rounded-lg p-6 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="font-semibold text-green-900">Submitted</div>
                          <div className="text-lg text-green-700">
                            {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-green-900">Status</div>
                          <div className="text-lg text-green-700">Under Review</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <button 
                        onClick={() => {
                          // Mark lesson as complete
                          markLessonComplete(currentLesson.id);
                          setCurrentLesson(null);
                        }}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                      >
                        Continue Learning
                      </button>
                      
                      <button 
                        onClick={() => setCurrentLesson(null)}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>
          ) : currentLesson.type === 'reading' ? (
            <div className="h-screen bg-white overflow-y-auto">
              {/* Close button for mobile */}
              <button 
                onClick={() => setCurrentLesson(null)}
                className="fixed top-4 right-4 z-20 text-gray-600 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center sm:hidden"
              >
                ✕
              </button>

              <div className="max-w-4xl mx-auto p-8">
                <div className="prose prose-lg max-w-none">
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    {currentLesson.title}
                  </h1>
                  
                  {currentLesson.readingData?.content ? (
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.readingData.content }} />
                  ) : (
                    <div className="space-y-6 text-gray-700 leading-relaxed">
                      <p>
                        This reading material covers important concepts that will help you understand the topic better. 
                        Take your time to read through the content and make notes of key points.
                      </p>
                      
                      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Key Learning Objectives</h2>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Understand the fundamental concepts</li>
                        <li>Learn practical applications</li>
                        <li>Identify best practices</li>
                        <li>Prepare for upcoming assessments</li>
                      </ul>
                      
                      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Introduction</h2>
                      <p>
                        This comprehensive reading material has been carefully curated to provide you with essential 
                        knowledge and insights. The content is structured to build upon previous lessons and prepare 
                        you for advanced topics.
                      </p>
                      
                      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Main Content</h2>
                      <p>
                        The main content of this reading would typically include detailed explanations, examples, 
                        case studies, and practical applications relevant to the course material. This would be 
                        populated with the actual reading content from your course materials.
                      </p>
                      
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                        <div className="font-semibold text-blue-900 mb-2">💡 Pro Tip</div>
                        <p className="text-blue-800">
                          Take notes while reading and highlight important concepts. This will help you during 
                          quizzes and assignments.
                        </p>
                      </div>
                      
                      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Summary</h2>
                      <p>
                        In this reading, we've covered the essential concepts that form the foundation of this topic. 
                        Make sure you understand these key points before moving on to the next lesson.
                      </p>
                    </div>
                  )}
                  
                  {/* Reading Progress */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-green-600 text-2xl mr-3">📖</div>
                        <div>
                          <div className="font-semibold text-green-900">Reading Complete</div>
                          <div className="text-sm text-green-700">Mark as read when finished</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          markLessonComplete(currentLesson.id);
                          setCurrentLesson(null);
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Mark as Read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Default content for other lesson types
            <div className="h-full bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentLesson.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {currentLesson.type} • {currentLesson.duration}
                </p>
                <p className="text-gray-500">
                  Content for this lesson type is not yet available.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Hidden in fullscreen and mobile */}
        {!isFullscreen && (
          <div className="hidden sm:block sm:w-80 lg:w-96 border-l bg-gray-50 overflow-y-auto">
            {/* Lesson Info */}
            <div className="p-4 border-b bg-white">
              <h4 className="font-semibold text-gray-900 mb-2">{currentLesson.title}</h4>
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <span className="capitalize">{currentLesson.type}</span>
                <span className="mx-2">•</span>
                <span>{currentLesson.duration}</span>
              </div>
              
              {/* Lesson Progress */}
              <div className="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${getLessonProgress(currentLesson.id)}%` 
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {getLessonProgress(currentLesson.id)}% complete
              </div>
            </div>
            
            {/* Course Navigation */}
           <div className="p-4">
  <h5 className="font-semibold text-gray-900 mb-4">Course Content</h5>

  {/* Scrollable wrapper */}
  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
    {course.modules?.map(section => (
      <div key={section.id}>
        <div className="font-medium text-gray-800 mb-2">{section.title}</div>
        {section.lessons?.map(lesson => (
          <button
            key={lesson.id}
            onClick={() => setCurrentLesson(lesson)}
            className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
              currentLesson.id === lesson.id
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs ${
                  completedLessons.includes(lesson.id)
                    ? 'bg-green-600 text-white'
                    : currentLesson.id === lesson.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {completedLessons.includes(lesson.id) ? '✓' : 
                   lesson.type === 'video' ? '▶' :
                   lesson.type === 'quiz' ? '?' :
                   lesson.type === 'reading' ? '📖' :
                   lesson.type === 'assignment' ? '📝' : '•'}
                </div>
                <div>
                  <div className="font-medium">{lesson.title}</div>
                  <div className="text-xs text-gray-500">
                    {lesson.type} • {lesson.duration}
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    ))}
  </div>
</div>

            
            {/* Notes Section */}
            <div className="p-4 border-t">
              <h5 className="font-semibold text-gray-900 mb-4">Lesson Notes</h5>
              <textarea
                placeholder="Add your notes for this lesson..."
                value={lessonNotes[currentLesson.id] || ''}
                onChange={(e) => setLessonNotes(prev => ({
                  ...prev,
                  [currentLesson.id]: e.target.value
                }))}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
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
                <span className="bg-emerald-600 text-xs px-2 py-1 rounded-full">{course.category}</span>
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
                  <div className="text-2xl font-bold">{course.duration}</div>
                  <div className="text-sm text-gray-300">Total hours</div>
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
                      <div className="text-sm text-gray-300">{completedLessons}/{totalLessons} lessons completed ({Math.round(completionPercentage)}%)</div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-lg font-bold">
                        {Math.round(completionPercentage)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
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
                      Enroll Now - ${course.price}
                    </button>
                    <button 
                      onClick={handleAddToCart}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Add to Cart
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => setShowVideo(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">▶️</span>
                  Preview
                </button>
                
                <button 
                  onClick={handleAddToWishlist}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  ❤️
                </button>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="lg:w-80 xl:w-96">
              <div className="relative h-48 lg:h-full">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-colors group"
                >
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl text-gray-800 ml-1">▶️</span>
                  </div>
                </button>
              </div>
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
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">{course.description}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.learningOutcomes?.map((outcome, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span className="text-gray-700">{outcome}</span>
                      </div>
                    )) || [
                      "Master modern crop management techniques",
                      "Understand sustainable farming practices",
                      "Learn about soil health and nutrition",
                      "Implement integrated pest management",
                      "Use technology in agriculture",
                      "Develop farm business strategies"
                    ].map((outcome, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span className="text-gray-700">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Basic understanding of agriculture</li>
                    <li>• Access to farming land (optional for practical exercises)</li>
                    <li>• Willingness to learn and apply new techniques</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                  <div className="text-sm text-gray-600">
                    {course.modules.length} modules • {totalLessons} lessons • {course.duration} total
                  </div>
                </div>

                <div className="space-y-4">
                  {course.modules.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {module.lessons.length} lessons • {module.duration}
                            </p>
                          </div>
                          <span className={`transform transition-transform ${selectedModule === module.id ? 'rotate-180' : ''}`}>
                            ↓
                          </span>
                        </div>
                      </button>

                      {selectedModule === module.id && (
                        <div className="border-t border-gray-200">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              id={`lesson-${lesson.id}`}
                              className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                  progress[lesson.id]?.completed 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {progress[lesson.id]?.completed ? '✓' : 
                                   lesson.type === 'video' ? '▶️' : 
                                   lesson.type === 'quiz' ? '❓' : '📝'}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{lesson.title}</div>
                                  <div className="text-sm text-gray-500 capitalize">
                                    {lesson.type} • {lesson.duration}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {isEnrolled && (
                                  <button
                                    onClick={() => handleStartLesson(lesson)}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                  >
                                    {progress[lesson.id]?.completed ? 'Review' : 'Start'}
                                  </button>
                                )}
                                {lesson.type === 'video' && (
                                  <span className="text-xs text-gray-400">Preview</span>
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Instructor</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'} 
                      alt={course.instructor?.name || 'Dr. Sarah Johnson'}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{course.instructor?.name || 'Dr. Sarah Johnson'}</h3>
                      <p className="text-gray-600 mb-4">{course.instructor?.title || 'Agricultural Science Professor & Consultant'}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">4.8</div>
                          <div className="text-gray-600">Instructor Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">2,847</div>
                          <div className="text-gray-600">Reviews</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">15,629</div>
                          <div className="text-gray-600">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">12</div>
                          <div className="text-gray-600">Courses</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {course.instructor?.bio || 'Dr. Johnson has over 15 years of experience in agricultural research and education. She specializes in sustainable farming practices and has published numerous papers on crop management techniques.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

           {activeTab === 'reviews' && (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-gray-900">{course.rating}</span>
        <div className="flex text-yellow-400">
          {[1,2,3,4,5].map(star => (
            <span key={star}>⭐</span>
          ))}
        </div>
        <span className="text-gray-600">({course.reviewsCount.toLocaleString()} reviews)</span>
      </div>
    </div>

    {/* Rating Breakdown */}
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="space-y-3">
        {[5,4,3,2,1].map(rating => (
          <div key={rating} className="flex items-center space-x-4">
            <span className="text-sm font-medium w-8">{rating}★</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : 2}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-12">{rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '8%' : '2%'}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Reviews from course.reviews */}
    <div className="space-y-6">
      {course.reviews?.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
              {review.student.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">{review.student}</span>
                <div className="flex text-yellow-400 text-sm">
                  {[1,2,3,4,5].map(star => (
                    <span key={star}>{star <= review.rating ? '⭐' : '☆'}</span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-3">{review.comment}</p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                  <span>👍</span>
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
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
                  <span className="font-medium">{course.duration}</span>
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
                      

