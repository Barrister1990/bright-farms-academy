import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Link,
  Plus,
  Save,
  Settings,
  Trash2,
  Upload,
  Users,
  Video
} from 'lucide-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { supabase } from '../lib/supabase';
const AdminAddCourse = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [currentStep, setCurrentStep] = useState(1);
  const [quizzes, setQuizzes] = useState([]);
const [assignments, setAssignments] = useState([]);

const [isPublishing, setIsPublishing] = useState(false);
    // Touch/swipe handling
  const navigate = useNavigate();
  // Course basic information
  const [courseData, setCourseData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    image: '',
    categoryId: '',
    subcategory: '',
    level: 'Beginner',
    language: 'English',
    price: '',
    originalPrice: '',
    requirements: [''],
    whatYouWillLearn: [''],
    targetAudience: [''],
    featured: false,
    bestseller: false
  });

  // Instructor information
  const [instructorData, setInstructorData] = useState({
    name: '',
    title: '',
    bio: '',
    avatar: ''
  });

  // Modules and lessons
  const [modules, setModules] = useState([{
    id: Date.now().toString(),
  title: '',
    duration: '',
    position:'',
    lessons: [{

      title: '',
      duration: '',
      type: 'video',
      preview: false,
      videoUrl: '',
      videoFile: null,
      resources: ['']
    }]
  }]);
  // Quiz Management Functions
const addQuiz = () => {
  const newQuiz = {
    title: '',
    description: '',
    moduleId: '',
    timeLimit: 10,
    passingScore: 70,
    questions: []
  };
  setQuizzes([...quizzes, newQuiz]);
};
const updateQuiz = (quizIndex, field, value) => {
  const updatedQuizzes = [...quizzes];
  updatedQuizzes[quizIndex][field] = value;
  setQuizzes(updatedQuizzes);
};

const addQuestion = (quizIndex) => {
  const updatedQuizzes = [...quizzes];
  const newQuestion = {
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    correctAnswers: [], // for multiple-select
    explanation: ''
  };
  updatedQuizzes[quizIndex].questions.push(newQuestion);
  setQuizzes(updatedQuizzes);
};

const updateQuestion = (quizIndex, questionIndex, field, value) => {
  const updatedQuizzes = [...quizzes];
  updatedQuizzes[quizIndex].questions[questionIndex][field] = value;
  setQuizzes(updatedQuizzes);
};

const updateQuestionOption = (quizIndex, questionIndex, optionIndex, value) => {
  const updatedQuizzes = [...quizzes];
  updatedQuizzes[quizIndex].questions[questionIndex].options[optionIndex] = value;
  setQuizzes(updatedQuizzes);
};

const addQuestionOption = (quizIndex, questionIndex) => {
  const updatedQuizzes = [...quizzes];
  updatedQuizzes[quizIndex].questions[questionIndex].options.push('');
  setQuizzes(updatedQuizzes);
};

const removeQuestionOption = (quizIndex, questionIndex, optionIndex) => {
  const updatedQuizzes = [...quizzes];
  updatedQuizzes[quizIndex].questions[questionIndex].options.splice(optionIndex, 1);
  setQuizzes(updatedQuizzes);
};

// Assignment Management Functions
const addAssignment = () => {
  const newAssignment = {
    title: '',
    description: '',
    estimatedTime: '',
    moduleId: '',
    instructions: [''],
    deliverables: [''],
    resources: [''],
    rubric: {},
    submissionFormat: '',
    tips: ['']
  };
  setAssignments([...assignments, newAssignment]);
};

const updateAssignment = (assignmentIndex, field, value) => {
  const updatedAssignments = [...assignments];
  updatedAssignments[assignmentIndex][field] = value;
  setAssignments(updatedAssignments);
};

const updateAssignmentArray = (assignmentIndex, field, index, value) => {
  const updatedAssignments = [...assignments];
  updatedAssignments[assignmentIndex][field][index] = value;
  setAssignments(updatedAssignments);
};

const addAssignmentArrayItem = (assignmentIndex, field) => {
  const updatedAssignments = [...assignments];
  updatedAssignments[assignmentIndex][field].push('');
  setAssignments(updatedAssignments);
};

const validateQuizAssignments = () => {
  const unassignedQuizzes = quizzes.filter(quiz => !quiz.moduleId);
  const unassignedAssignments = assignments.filter(assignment => !assignment.moduleId);
  
  if (unassignedQuizzes.length > 0 || unassignedAssignments.length > 0) {
    alert('Please assign all quizzes and assignments to modules before saving.');
    return false;
  }
  return true;
};

const removeAssignmentArrayItem = (assignmentIndex, field, index) => {
  const updatedAssignments = [...assignments];
  updatedAssignments[assignmentIndex][field].splice(index, 1);
  setAssignments(updatedAssignments);
};

  // Video upload preference
  const [videoUploadType, setVideoUploadType] = useState('url'); // 'url' or 'upload'

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BookOpen, steps: 3 },
    { id: 'instructor', label: 'Instructor', icon: Users, steps: 2 },
    { id: 'modules', label: 'Modules & Lessons', icon: Video, steps: 4 },
    { id: 'quizzes', label: 'Quizzes & Tests', icon: FileText, steps: 2 },
    { id: 'settings', label: 'Settings', icon: Settings, steps: 2 }
  ];

  const currentTabData = tabs.find(tab => tab.id === activeTab);
  const totalSteps = currentTabData?.steps || 1;

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addModule = () => {
    const newModule = {
     id: Date.now().toString(),
      title: '',
      duration: '',
     postion: modules.length + 1,
      lessons: [{

        title: '',
        duration: '',
        type: 'video',
        preview: false,
        videoUrl: '',
        videoFile: null,
        resources: ['']
      }]
    };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = [...modules];
    const newLesson = {
      title: '',
      duration: '',
      type: 'video',
      preview: false,
      videoUrl: '',
      videoFile: null,
      resources: ['']
    };
    updatedModules[moduleIndex].lessons.push(newLesson);
    setModules(updatedModules);
  };

  const updateModule = (moduleIndex, field, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex][field] = value;
    setModules(updatedModules);
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    setModules(updatedModules);
  };

  const handleVideoUpload = (moduleIndex, lessonIndex, file) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons[lessonIndex].videoFile = file;
    updatedModules[moduleIndex].lessons[lessonIndex].videoUrl = URL.createObjectURL(file);
    setModules(updatedModules);
  };

  const renderBasicInfoStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter course title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Slug *
                </label>
                <input
                  type="text"
                  value={courseData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="course-slug-url"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <input
                type="text"
                value={courseData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief course description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                value={courseData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed course description"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Course Classification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={courseData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="1">Agriculture</option>
                  <option value="2">Technology</option>
                  <option value="3">Business</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory *
                </label>
                <input
                  type="text"
                  value={courseData.subcategory}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Vegetable Farming"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  value={courseData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language *
                </label>
                <select
                  value={courseData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Image URL
                </label>
                <input
                  type="url"
                  value={courseData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Pricing & Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={courseData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="89"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={courseData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="149"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={courseData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Featured Course</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={courseData.bestseller}
                  onChange={(e) => handleInputChange('bestseller', e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Bestseller</span>
              </label>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderInstructorStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Instructor Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  value={instructorData.name}
                  onChange={(e) => setInstructorData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dr. Sarah Johnson"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Title *
                </label>
                <input
                  type="text"
                  value={instructorData.title}
                  onChange={(e) => setInstructorData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Agricultural Scientist & Extension Expert"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={instructorData.avatar}
                onChange={(e) => setInstructorData(prev => ({ ...prev, avatar: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Instructor Bio</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography *
              </label>
              <textarea
                value={instructorData.bio}
                onChange={(e) => setInstructorData(prev => ({ ...prev, bio: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dr. Johnson has 15+ years of experience in crop science and has helped over 10,000 farmers increase their yields."
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderModulesStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Course Modules</h3>
              <button
                onClick={addModule}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </button>
            </div>
            
            {modules.map((module, moduleIndex) => (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Title *
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Introduction to Modern Crop Management"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={module.duration}
                      onChange={(e) => updateModule(moduleIndex, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="45 min"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">Lessons</h4>
                  <button
                    onClick={() => addLesson(moduleIndex)}
                    className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Lesson
                  </button>
                </div>
                
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Lesson Title
                        </label>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Course Overview"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duration', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="8 min"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Type
                        </label>
                        <select
                          value={lesson.type}
                          onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'type', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="video">Video</option>
                          <option value="quiz">Quiz</option>
                          <option value="assignment">Assignment</option>
                          <option value="reading">Reading</option>
                        </select>
                      </div>
                    </div>
                    
                    {lesson.type === 'video' && (
                      <div className="space-y-3">
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`video-type-${moduleIndex}-${lessonIndex}`}
                              value="url"
                              checked={videoUploadType === 'url'}
                              onChange={(e) => setVideoUploadType(e.target.value)}
                              className="mr-2"
                            />
                            <Link className="h-4 w-4 mr-1" />
                            Video URL
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`video-type-${moduleIndex}-${lessonIndex}`}
                              value="upload"
                              checked={videoUploadType === 'upload'}
                              onChange={(e) => setVideoUploadType(e.target.value)}
                              className="mr-2"
                            />
                            <Upload className="h-4 w-4 mr-1" />
                            Upload Video
                          </label>
                        </div>
                        
                        {videoUploadType === 'url' ? (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Video URL
                            </label>
                            <input
                              type="url"
                              value={lesson.videoUrl}
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'videoUrl', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              placeholder="https://example.com/video.mp4"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Upload Video File
                            </label>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleVideoUpload(moduleIndex, lessonIndex, e.target.files[0])}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                            {lesson.videoFile && (
                              <p className="text-xs text-green-600 mt-1">
                                File uploaded: {lesson.videoFile.name}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={lesson.preview}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'preview', e.target.checked)}
                            className="mr-2 h-3 w-3"
                          />
                          <Eye className="h-3 w-3 mr-1" />
                          Free Preview
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Step {currentStep} Content
            </h3>
            <p className="text-gray-600">
              Additional module configuration steps would go here.
            </p>
          </div>
        );
    }
  };

  const renderQuizzesStep = () => {
  switch (currentStep) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Course Quizzes</h3>
            <button
              onClick={addQuiz}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Quiz
            </button>
          </div>
          
          {quizzes.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Quizzes Yet</h4>
              <p className="text-gray-600 mb-4">Add your first quiz to test student knowledge</p>
            </div>
          ) : (
            <div className="space-y-6">
              {quizzes.map((quiz, quizIndex) => (
  <div key={quiz.id} className="border border-gray-200 rounded-lg p-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quiz Title *
        </label>
        <input
          type="text"
          value={quiz.title}
          onChange={(e) => updateQuiz(quizIndex, 'title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Knowledge Check: Agriculture Basics"
        />
      </div>
      
      {/* ADD THIS MODULE SELECTOR */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Associated Module *
        </label>
        <select
          value={quiz.moduleId}
          onChange={(e) => updateQuiz(quizIndex, 'moduleId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
           <option value="">Select Module</option>
    {modules.map((module, index) => (
      <option key={module.id || index} value={module.title}>
        {module.title || `Module ${index + 1}`}
      </option>
    ))}
        </select>
      </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Limit (min)
                        </label>
                        <input
                          type="number"
                          value={quiz.timeLimit}
                          onChange={(e) => updateQuiz(quizIndex, 'timeLimit', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="10"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Passing Score (%)
                        </label>
                        <input
                          type="number"
                          value={quiz.passingScore}
                          onChange={(e) => updateQuiz(quizIndex, 'passingScore', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="70"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={quiz.description}
                      onChange={(e) => updateQuiz(quizIndex, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Test your understanding of fundamental agricultural concepts"
                    />
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">Questions ({quiz.questions.length})</h4>
                    <button
                      onClick={() => addQuestion(quizIndex)}
                      className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Question
                    </button>
                  </div>

                  {quiz.questions.map((question, questionIndex) => (
                    <div key={question.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Question
                          </label>
                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => updateQuestion(quizIndex, questionIndex, 'question', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            placeholder="What is the primary goal of modern crop management?"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(quizIndex, questionIndex, 'type', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true-false">True/False</option>
                            <option value="multiple-select">Multiple Select</option>
                          </select>
                        </div>

                        {question.type === 'multiple-choice' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Correct Answer
                            </label>
                            <select
                              value={question.correctAnswer}
                              onChange={(e) => updateQuestion(quizIndex, questionIndex, 'correctAnswer', parseInt(e.target.value))}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            >
                              {question.options.map((_, optIndex) => (
                                <option key={optIndex} value={optIndex}>Option {optIndex + 1}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {question.type === 'true-false' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Correct Answer
                            </label>
                            <select
                              value={question.correctAnswer}
                              onChange={(e) => updateQuestion(quizIndex, questionIndex, 'correctAnswer', parseInt(e.target.value))}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            >
                              <option value={0}>True</option>
                              <option value={1}>False</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-xs font-medium text-gray-600">
                            Options
                          </label>
                          {question.type !== 'true-false' && (
                            <button
                              onClick={() => addQuestionOption(quizIndex, questionIndex)}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              + Add Option
                            </button>
                          )}
                        </div>
                        
                        {question.type === 'true-false' ? (
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value="True"
                              disabled
                              className="px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100"
                            />
                            <input
                              type="text"
                              value="False"
                              disabled
                              className="px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                {question.type === 'multiple-select' && (
                                  <input
                                    type="checkbox"
                                    checked={question.correctAnswers?.includes(optionIndex) || false}
                                    onChange={(e) => {
                                      const correctAnswers = question.correctAnswers || [];
                                      const newCorrectAnswers = e.target.checked
                                        ? [...correctAnswers, optionIndex]
                                        : correctAnswers.filter(idx => idx !== optionIndex);
                                      updateQuestion(quizIndex, questionIndex, 'correctAnswers', newCorrectAnswers);
                                    }}
                                    className="h-3 w-3"
                                  />
                                )}
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateQuestionOption(quizIndex, questionIndex, optionIndex, e.target.value)}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                {question.options.length > 2 && question.type !== 'true-false' && (
                                  <button
                                    onClick={() => removeQuestionOption(quizIndex, questionIndex, optionIndex)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Explanation
                        </label>
                        <textarea
                          value={question.explanation}
                          onChange={(e) => updateQuestion(quizIndex, questionIndex, 'explanation', e.target.value)}
                          rows={2}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Explain why this is the correct answer..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Course Assignments</h3>
            <button
              onClick={addAssignment}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Assignment
            </button>
          </div>
          
          {assignments.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Assignments Yet</h4>
              <p className="text-gray-600 mb-4">Add practical assignments for hands-on learning</p>
            </div>
          ) : (
            <div className="space-y-6">
              {assignments.map((assignment, assignmentIndex) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignment Title *
                      </label>
                      <input
                        type="text"
                        value={assignment.title}
                        onChange={(e) => updateAssignment(assignmentIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Create Your Soil Preparation Plan"
                      />
                    </div>
                     <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Associated Module *
        </label>
        <select
          value={assignment.moduleId}
          onChange={(e) => updateAssignment(assignmentIndex, 'moduleId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
           <option value="">Select Module</option>
    {modules.map((module, index) => (
      <option key={module.id || index} value={module.title}>
        {module.title || `Module ${index + 1}`}
      </option>
    ))}
        </select>
      </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Time
                      </label>
                      <input
                        type="text"
                        value={assignment.estimatedTime}
                        onChange={(e) => updateAssignment(assignmentIndex, 'estimatedTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="15-20 minutes"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={assignment.description}
                      onChange={(e) => updateAssignment(assignmentIndex, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Develop a comprehensive soil preparation plan for a specific crop of your choice."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Instructions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructions
                      </label>
                      {assignment.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={instruction}
                            onChange={(e) => updateAssignmentArray(assignmentIndex, 'instructions', index, e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            placeholder="Choose a crop you want to grow"
                          />
                          <button
                            onClick={() => removeAssignmentArrayItem(assignmentIndex, 'instructions', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addAssignmentArrayItem(assignmentIndex, 'instructions')}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Instruction
                      </button>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deliverables
                      </label>
                      {assignment.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={deliverable}
                            onChange={(e) => updateAssignmentArray(assignmentIndex, 'deliverables', index, e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            placeholder="Completed soil preparation checklist"
                          />
                          <button
                            onClick={() => removeAssignmentArrayItem(assignmentIndex, 'deliverables', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addAssignmentArrayItem(assignmentIndex, 'deliverables')}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Deliverable
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Resources */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resources
                      </label>
                      {assignment.resources.map((resource, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={resource}
                            onChange={(e) => updateAssignmentArray(assignmentIndex, 'resources', index, e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            placeholder="Soil preparation template (downloadable PDF)"
                          />
                          <button
                            onClick={() => removeAssignmentArrayItem(assignmentIndex, 'resources', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addAssignmentArrayItem(assignmentIndex, 'resources')}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Resource
                      </button>
                    </div>

                    {/* Tips */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tips
                      </label>
                      {assignment.tips.map((tip, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={tip}
                            onChange={(e) => updateAssignmentArray(assignmentIndex, 'tips', index, e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            placeholder="Consider your local climate and growing season"
                          />
                          <button
                            onClick={() => removeAssignmentArrayItem(assignmentIndex, 'tips', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addAssignmentArrayItem(assignmentIndex, 'tips')}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Tip
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submission Format
                    </label>
                    <input
                      type="text"
                      value={assignment.submissionFormat}
                      onChange={(e) => updateAssignment(assignmentIndex, 'submissionFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Upload completed worksheets as PDF or submit online form"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

  const renderCurrentTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfoStep();
      case 'instructor':
        return renderInstructorStep();
      case 'modules':
        return renderModulesStep();
      case 'quizzes':
  return renderQuizzesStep();
      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Course Requirements & Outcomes</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              {courseData.requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayInputChange('requirements', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Basic understanding of farming principles"
                  />
                  <button
                    onClick={() => removeArrayItem('requirements', index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('requirements')}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Requirement
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What You Will Learn
              </label>
              {courseData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayInputChange('whatYouWillLearn', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Advanced crop rotation strategies"
                  />
                  <button
                    onClick={() => removeArrayItem('whatYouWillLearn', index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('whatYouWillLearn')}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Learning Outcome
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

const nextStep = () => {
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const currentTabSteps = getStepsForTab(activeTab); // You need to implement this function
  
  if (currentStep < currentTabSteps) {
    // Move to next step within current tab
    setCurrentStep(currentStep + 1);
  } else if (currentTabIndex < tabs.length - 1) {
    // Move to next tab and reset to step 1
    const nextTab = tabs[currentTabIndex + 1];
    setActiveTab(nextTab.id);
    setCurrentStep(1);
  }
};

const prevStep = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
  } else {
    // If we're at step 1, go to previous tab's last step
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentTabIndex > 0) {
      const prevTab = tabs[currentTabIndex - 1];
      const prevTabSteps = getStepsForTab(prevTab.id);
      setActiveTab(prevTab.id);
      setCurrentStep(prevTabSteps);
    }
  }
};

// Updated progress calculation for total progress across all tabs
const getTotalSteps = () => {
  return tabs.reduce((total, tab) => total + getStepsForTab(tab.id), 0);
};

const getCurrentOverallStep = () => {
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  let overallStep = 0;
  
  // Add steps from previous tabs
  for (let i = 0; i < currentTabIndex; i++) {
    overallStep += getStepsForTab(tabs[i].id);
  }
  
  // Add current step
  overallStep += currentStep;
  
  return overallStep;
};


  const getStepsForTab = (tabId) => {
  const tabSteps = {
    'basic': 3,        // Adjust based on your basic info steps
    'instructor': 2,   // Adjust based on your instructor steps  
    'modules': 1,      // Adjust based on your modules steps
    'quizzes': 2       // Adjust based on your quizzes steps
  };
  return tabSteps[tabId] || 1;
};

const isLastStepOfLastTab = () => {
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const currentTabSteps = getStepsForTab(activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isLastStep = currentStep === currentTabSteps;
  return isLastTab && isLastStep;
};

// Check if next button should be shown
const shouldShowNextButton = () => {
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const currentTabSteps = getStepsForTab(activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isLastStep = currentStep === currentTabSteps;
  return !(isLastTab && isLastStep);
};

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentStep(1);
  };

  const uploadFileToStorage = async (file, path) => {
  const { data, error } = await supabase.storage.from('course-content').upload(path, file, {
    cacheControl: '3600',
    upsert: true
  });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('course-content').getPublicUrl(path);
  return urlData.publicUrl;
};

const saveCourseToSupabase = async () => {

  setIsPublishing(true);
  try {
    // Validate required data before starting
    if (!courseData.title || !courseData.slug) {
      throw new Error('Course title and slug are required');
    }

    if (!instructorData.name) {
      throw new Error('Instructor name is required');
    }

    if (modules.length === 0) {
      throw new Error('At least one module is required');
    }

    console.log('Starting course save process...');
    
    // Show loading toast
    const loadingToast = toast.loading('Saving course to database...');
    
    // 1. Upload Course Image
    let imageUrl = courseData.image;
    if (courseData.image instanceof File) {
      try {
        console.log('Uploading course image...');
        toast.loading('Uploading course image...', { id: loadingToast });
        const imagePath = `images/${Date.now()}_${courseData.image.name}`;
        imageUrl = await uploadFileToStorage(courseData.image, imagePath);
        console.log('Course image uploaded successfully');
      } catch (error) {
        console.error('Error uploading course image:', error);
        throw new Error(`Failed to upload course image: ${error.message}`);
      }
    }

    // 2. Upload Instructor Avatar
    let avatarUrl = instructorData.avatar;
    if (instructorData.avatar instanceof File) {
      try {
        console.log('Uploading instructor avatar...');
        toast.loading('Uploading instructor avatar...', { id: loadingToast });
        const avatarPath = `avatars/${Date.now()}_${instructorData.avatar.name}`;
        avatarUrl = await uploadFileToStorage(instructorData.avatar, avatarPath);
        console.log('Instructor avatar uploaded successfully');
      } catch (error) {
        console.error('Error uploading instructor avatar:', error);
        throw new Error(`Failed to upload instructor avatar: ${error.message}`);
      }
    }

    // 3. Insert Course
    console.log('Inserting course data...');
    toast.loading('Saving course information...', { id: loadingToast });
    const courseInsertData = {
      title: courseData.title,
      slug: courseData.slug,
      description: courseData.description,
      shortDescription: courseData.shortDescription,
      image: imageUrl,
      categoryId: courseData.categoryId,
      subcategory: courseData.subcategory,
      level: courseData.level,
      language: courseData.language,
      price: courseData.price ? parseFloat(courseData.price) : null,
      originalPrice: courseData.originalPrice ? parseFloat(courseData.originalPrice) : null,
      requirements: courseData.requirements.filter(req => req.trim() !== ''),
      whatYouWillLearn: courseData.whatYouWillLearn.filter(learn => learn.trim() !== ''),
      targetAudience: courseData.targetAudience.filter(audience => audience.trim() !== ''),
      featured: courseData.featured,
      bestseller: courseData.bestseller
    };

    const { data: courseInsert, error: courseError } = await supabase
      .from('courses')
      .insert(courseInsertData)
      .select()
      .single();

    if (courseError) {
      console.error('Course insert error:', courseError);
      throw new Error(`Failed to save course: ${courseError.message}`);
    }

    const courseId = courseInsert.id;
    console.log('Course saved successfully with ID:', courseId);

    // 4. Insert Instructor
    console.log('Inserting instructor data...');
    toast.loading('Saving instructor information...', { id: loadingToast });
    const instructorInsertData = {
      name: instructorData.name,
      title: instructorData.title,
      bio: instructorData.bio,
      avatar: avatarUrl,
      course_id: courseId // Note: using snake_case as per your original table
    };

    const { error: instructorError } = await supabase
      .from('instructors')
      .insert(instructorInsertData);

    if (instructorError) {
      console.error('Instructor insert error:', instructorError);
      throw new Error(`Failed to save instructor: ${instructorError.message}`);
    }
    console.log('Instructor saved successfully');

    // 5. Insert Modules and Lessons (and create module ID mapping)
    console.log('Inserting modules and lessons...');
    toast.loading('Saving modules and lessons...', { id: loadingToast });
    const moduleIdMapping = {}; // Map from temporary module IDs to actual database IDs
    
    for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
      const module = modules[moduleIndex];
      
      try {
        console.log(`Processing module ${moduleIndex + 1}: ${module.title}`);
        toast.loading(`Saving module ${moduleIndex + 1} of ${modules.length}...`, { id: loadingToast });
        
        const { data: moduleInsert, error: moduleError } = await supabase
          .from('modules')
          .insert({
            position: parseInt(module.position),
            title: module.title,
            duration: module.duration,
            course_id: courseId // Note: using snake_case as per your original table
          })
          .select()
          .single();

        if (moduleError) {
          console.error(`Module ${moduleIndex + 1} insert error:`, moduleError);
          throw new Error(`Failed to save module "${module.title}": ${moduleError.message}`);
        }

        const moduleId = moduleInsert.id;
        console.log(`Module ${moduleIndex + 1} saved with ID:`, moduleId);

        // Store mapping from temporary ID (or index) to actual database ID
        if (module.id) {
          moduleIdMapping[module.id] = moduleId;
        }
        // Also store by index as fallback
        moduleIdMapping[moduleIndex] = moduleId;
        // Store by title as another fallback (for assignments that might reference by title)
        moduleIdMapping[module.title] = moduleId;

        // Insert lessons for this module
        for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex++) {
          const lesson = module.lessons[lessonIndex];
          
          try {
            console.log(`Processing lesson ${lessonIndex + 1}: ${lesson.title}`);
            
            let lessonVideoUrl = lesson.videoUrl;

            // Upload lesson video if it's a file
            if (lesson.videoFile instanceof File) {
              console.log(`Uploading video for lesson: ${lesson.title}`);
              toast.loading(`Uploading video for lesson: ${lesson.title}...`, { id: loadingToast });
              const videoPath = `videos/${Date.now()}_${lesson.videoFile.name}`;
              lessonVideoUrl = await uploadFileToStorage(lesson.videoFile, videoPath);
              console.log('Lesson video uploaded successfully');
            }

            const lessonInsertData = {
              title: lesson.title,
              duration: lesson.duration,
              type: lesson.type,
              preview: lesson.preview,
              videoUrl: lessonVideoUrl, // Using camelCase as per your ALTER statements
              resources: lesson.resources.filter(resource => resource.trim() !== ''),
              module_id: moduleId // Note: using snake_case as per your original table
            };

            const { error: lessonError } = await supabase
              .from('lessons')
              .insert(lessonInsertData);

            if (lessonError) {
              console.error(`Lesson ${lessonIndex + 1} insert error:`, lessonError);
              throw new Error(`Failed to save lesson "${lesson.title}": ${lessonError.message}`);
            }
            
            console.log(`Lesson ${lessonIndex + 1} saved successfully`);
          } catch (lessonError) {
            throw new Error(`Error processing lesson "${lesson.title}": ${lessonError.message}`);
          }
        }
      } catch (moduleError) {
        throw new Error(`Error processing module "${module.title}": ${moduleError.message}`);
      }
    }

    // 6. Insert Quizzes (with proper module ID mapping)
    if (quizzes.length > 0) {
      console.log('Inserting quizzes...');
      toast.loading('Saving quizzes...', { id: loadingToast });
      
      for (let quizIndex = 0; quizIndex < quizzes.length; quizIndex++) {
        const quiz = quizzes[quizIndex];
        
        try {
          console.log(`Processing quiz ${quizIndex + 1}: ${quiz.title}`);
          toast.loading(`Saving quiz ${quizIndex + 1} of ${quizzes.length}...`, { id: loadingToast });
          
          // Get the actual module ID from our mapping using the selected module title
          let actualModuleId = null;
          if (quiz.moduleId) {
            // Find the module by title
            const selectedModule = modules.find(m => m.title === quiz.moduleId);
            if (selectedModule) {
              // Get the actual database ID from our mapping
              actualModuleId = moduleIdMapping[selectedModule.title];
              if (!actualModuleId) {
                // Try mapping by temporary ID as fallback
                actualModuleId = moduleIdMapping[selectedModule.id];
              }
              if (!actualModuleId) {
                // Try mapping by index as final fallback
                const moduleIndex = modules.findIndex(m => m.title === quiz.moduleId);
                actualModuleId = moduleIdMapping[moduleIndex];
              }
            }
            
            if (!actualModuleId) {
              console.warn(`Could not find module ID mapping for quiz "${quiz.title}" with module: ${quiz.moduleId}`);
            }
          }
          
          const quizInsertData = {
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            moduleId: actualModuleId, // Using the actual database module ID
            course_id: courseId
          };

          const { data: quizInsert, error: quizError } = await supabase
            .from('quizzes')
            .insert(quizInsertData)
            .select()
            .single();

          if (quizError) {
            console.error(`Quiz ${quizIndex + 1} insert error:`, quizError);
            throw new Error(`Failed to save quiz "${quiz.title}": ${quizError.message}`);
          }

          const quizId = quizInsert.id;
          console.log(`Quiz ${quizIndex + 1} saved with ID:`, quizId);

          // Insert questions for this quiz
          if (quiz.questions && quiz.questions.length > 0) {
            for (let questionIndex = 0; questionIndex < quiz.questions.length; questionIndex++) {
              const question = quiz.questions[questionIndex];
              
              try {
                const questionInsertData = {
                  quiz_id: quizId,
                  question: question.question,
                  type: question.type,
                  options: question.options.filter(option => option.trim() !== ''),
                  correctAnswer: question.correctAnswer,
                  correctAnswers: question.correctAnswers || [],
                  explanation: question.explanation
                };

                const { error: questionError } = await supabase
                  .from('questions')
                  .insert(questionInsertData);

                if (questionError) {
                  console.error(`Question ${questionIndex + 1} insert error:`, questionError);
                  throw new Error(`Failed to save question ${questionIndex + 1} in quiz "${quiz.title}": ${questionError.message}`);
                }
              } catch (questionError) {
                throw new Error(`Error processing question ${questionIndex + 1} in quiz "${quiz.title}": ${questionError.message}`);
              }
            }
          }
        } catch (quizError) {
          throw new Error(`Error processing quiz "${quiz.title}": ${quizError.message}`);
        }
      }
    }

    // 7. Insert Assignments (with proper module ID mapping)
    if (assignments.length > 0) {
      console.log('Inserting assignments...');
      toast.loading('Saving assignments...', { id: loadingToast });
      
      for (let assignmentIndex = 0; assignmentIndex < assignments.length; assignmentIndex++) {
        const assignment = assignments[assignmentIndex];
        
        try {
          console.log(`Processing assignment ${assignmentIndex + 1}: ${assignment.title}`);
          toast.loading(`Saving assignment ${assignmentIndex + 1} of ${assignments.length}...`, { id: loadingToast });
          
          // Get the actual module ID from our mapping using the selected module title
          let actualModuleId = null;
          if (assignment.moduleId) {
            // Find the module by title
            const selectedModule = modules.find(m => m.title === assignment.moduleId);
            if (selectedModule) {
              // Get the actual database ID from our mapping
              actualModuleId = moduleIdMapping[selectedModule.title];
              if (!actualModuleId) {
                // Try mapping by temporary ID as fallback
                actualModuleId = moduleIdMapping[selectedModule.id];
              }
              if (!actualModuleId) {
                // Try mapping by index as final fallback
                const moduleIndex = modules.findIndex(m => m.title === assignment.moduleId);
                actualModuleId = moduleIdMapping[moduleIndex];
              }
            }
            
            if (!actualModuleId) {
              console.warn(`Could not find module ID mapping for assignment "${assignment.title}" with module: ${assignment.moduleId}`);
            }
          }
          
          const assignmentInsertData = {
            title: assignment.title,
            description: assignment.description,
            estimatedTime: assignment.estimatedTime,
            submissionFormat: assignment.submissionFormat,
            moduleId: actualModuleId, // Using the actual database module ID
            instructions: assignment.instructions.filter(instruction => instruction.trim() !== ''),
            deliverables: assignment.deliverables.filter(deliverable => deliverable.trim() !== ''),
            resources: assignment.resources.filter(resource => resource.trim() !== ''),
            tips: assignment.tips.filter(tip => tip.trim() !== ''),
            rubric: assignment.rubric || {},
            course_id: courseId
          };

          const { error: assignmentError } = await supabase
            .from('assignments')
            .insert(assignmentInsertData);

          if (assignmentError) {
            console.error(`Assignment ${assignmentIndex + 1} insert error:`, assignmentError);
            throw new Error(`Failed to save assignment "${assignment.title}": ${assignmentError.message}`);
          }
          
          console.log(`Assignment ${assignmentIndex + 1} saved successfully`);
        } catch (assignmentError) {
          throw new Error(`Error processing assignment "${assignment.title}": ${assignmentError.message}`);
        }
      }
    }

    console.log('Course save process completed successfully!');
    
    // Dismiss loading toast and show success
    toast.success('Course successfully saved to database!', { 
      id: loadingToast,
      duration: 4000 
    });
    
    // Optional: Reset form or redirect user
    resetForm();
    navigate('/admin/courses');
    
  } catch (error) {
    console.error('Complete error details:', error);
    
    // Show error toast
    toast.error(`Error saving course: ${error.message}`, {
      duration: 6000,
      style: {
        maxWidth: '500px',
      },
    });
    setIsPublishing(false);
    // Optional: Log error to external service
    // logErrorToService(error, { courseData, instructorData, modules, quizzes, assignments });
  }finally{
    setIsPublishing(false);
  }
};

// Helper function to reset form (optional)
const resetForm = () => {
  setCourseData({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    image: '',
    categoryId: '',
    subcategory: '',
    level: 'Beginner',
    language: 'English',
    price: '',
    originalPrice: '',
    requirements: [''],
    whatYouWillLearn: [''],
    targetAudience: [''],
    featured: false,
    bestseller: false
  });
  
  setInstructorData({
    name: '',
    title: '',
    bio: '',
    avatar: ''
  });
  
  setModules([{
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
  }]);
  
  setQuizzes([]);
  setAssignments([]);
};



  return (
     <DashboardLayout currentPage="Courses">
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Course</h1>
<p className="text-sm sm:text-base text-gray-600 mt-2">
  Create and manage your course content...
</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto no-scrollbar sm:space-x-3 space-x-4 px-4 sm:px-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Progress Bar */}
         <div className="px-6 py-4 bg-gray-50">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-gray-700">
      Step {getCurrentOverallStep()} of {getTotalSteps()}
    </span>
    <span className="text-sm text-gray-500">
      {Math.round((getCurrentOverallStep() / getTotalSteps()) * 100)}% Complete
    </span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${(getCurrentOverallStep() / getTotalSteps()) * 100}%` }}
    ></div>
  </div>
</div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {renderCurrentTabContent()}
          </div>

          {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 gap-3 sm:gap-0">
  <button
    onClick={prevStep}
    disabled={currentStep === 1 && tabs.findIndex(tab => tab.id === activeTab) === 0}
    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
      currentStep === 1 && tabs.findIndex(tab => tab.id === activeTab) === 0
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    <ChevronLeft className="h-4 w-4 mr-2" />
    Previous
  </button>

  <div className="flex space-x-3">
    <button
      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      <Save className="h-4 w-4 mr-2" />
      Save Draft
    </button>

    {shouldShowNextButton() ? (
      <button
        onClick={nextStep}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </button>
    ) : (
      <button
  onClick={saveCourseToSupabase}
  disabled={isPublishing}
  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
    isPublishing 
      ? 'bg-blue-400 cursor-not-allowed' 
      : 'bg-blue-600 hover:bg-blue-700'
  } text-white`}
>
  {isPublishing ? (
    <>
      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Publishing...
    </>
  ) : (
    <>
      <CheckCircle className="h-4 w-4 mr-2" />
      Publish Course
    </>
  )}
</button>
    )}
  </div>
</div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6">

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">Draft Status</h4>
                <p className="text-gray-600">Course in progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">Validation</h4>
                <p className="text-gray-600">Pending review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">Auto-save</h4>
                <p className="text-gray-600">Changes saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </DashboardLayout>
  );
};

export default AdminAddCourse;