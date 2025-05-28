import { create } from 'zustand';

const useCourseStore = create((set, get) => ({
  // Categories data
  categories: [
    {
      id: 1,
      name: 'Crop Production',
      slug: 'crop-production',
      icon: '🌾',
      description: 'Learn modern farming techniques for various crops',
      courses: 45,
      image: '/api/placeholder/400/250',
      subcategories: [
        'Rice Farming',
        'Wheat Production',
        'Corn Cultivation',
        'Vegetable Farming',
        'Fruit Orchards'
      ]
    },
    {
      id: 2,
      name: 'Soil Health',
      slug: 'soil-health',
      icon: '🌱',
      description: 'Master soil management and fertility techniques',
      courses: 30,
      image: '/api/placeholder/400/250',
      subcategories: [
        'Soil Testing',
        'Nutrient Management',
        'Composting',
        'Soil Conservation',
        'pH Management'
      ]
    },
    {
      id: 3,
      name: 'Livestock',
      slug: 'livestock',
      icon: '🐄',
      description: 'Complete animal husbandry and livestock care',
      courses: 25,
      image: '/api/placeholder/400/250',
      subcategories: [
        'Cattle Management',
        'Poultry Farming',
        'Goat Farming',
        'Animal Nutrition',
        'Veterinary Care'
      ]
    },
    {
      id: 4,
      name: 'Organic Farming',
      slug: 'organic-farming',
      icon: '🥬',
      description: 'Sustainable and organic agriculture methods',
      courses: 35,
      image: '/api/placeholder/400/250',
      subcategories: [
        'Organic Certification',
        'Natural Pest Control',
        'Biodiversity',
        'Permaculture',
        'Biodynamic Farming'
      ]
    },
    {
      id: 5,
      name: 'Agribusiness',
      slug: 'agribusiness',
      icon: '📊',
      description: 'Farm management, economics and business strategies',
      courses: 20,
      image: '/api/placeholder/400/250',
      subcategories: [
        'Farm Financial Management',
        'Marketing',
        'Supply Chain',
        'Agricultural Insurance',
        'Cooperative Management'
      ]
    },
    {
      id: 6,
      name: 'Smart Farming',
      slug: 'smart-farming',
      icon: '🤖',
      description: 'Technology integration and precision agriculture',
      courses: 18,
      image: '/api/placeholder/400/250',
      subcategories: [
        'IoT in Agriculture',
        'Drone Technology',
        'GPS Farming',
        'Sensors & Monitoring',
        'Data Analytics'
      ]
    }
  ],

  // Detailed courses data
  courses: [
{
  id: 1,
  title: 'Modern Crop Management Techniques',
  slug: 'modern-crop-management-techniques',
  description: 'Master the latest techniques in crop production and yield optimization with hands-on practical training.',
  shortDescription: 'Learn advanced crop management for maximum yield',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROdX91yrLjifDB3TOcJN6EeZv7F0tIFH8rwg&s',
  instructor: {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Agricultural Scientist & Extension Expert',
    avatar: '/api/placeholder/100/100',
    bio: 'Dr. Johnson has 15+ years of experience in crop science and has helped over 10,000 farmers increase their yields.',
    rating: 4.9,
    students: 12547,
    courses: 8
  },
  categoryId: 1,
  subcategory: 'Vegetable Farming',
  level: 'Intermediate',
  language: 'English',
  price: 89,
  originalPrice: 149,
  discount: 40,
  rating: 4.8,
  reviewsCount: 1247,
  studentsCount: 2547,
  duration: '8 hours',
  totalLessons: 42,
  lastUpdated: '2024-12-15',
  bestseller: true,
  featured: true,
  requirements: [
    'Basic understanding of farming principles',
    'Access to a small plot of land (optional but recommended)',
    'Willingness to learn modern techniques'
  ],
  whatYouWillLearn: [
    'Advanced crop rotation strategies',
    'Integrated pest management techniques',
    'Soil fertility optimization methods',
    'Water management and irrigation systems',
    'Harvest timing and post-harvest handling',
    'Yield monitoring and record keeping'
  ],
  targetAudience: [
    'Small to medium-scale farmers',
    'Agricultural students and graduates',
    'Farm managers and supervisors',
    'Anyone interested in modern agriculture'
  ],
  modules: [
    {
      id: 1,
      title: 'Introduction to Modern Crop Management',
      duration: '45 min',
      lessons: [
        {
          id: 1,
          title: 'Course Overview and Learning Objectives',
          duration: '8 min',
          type: 'video',
          preview: true,
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          resources: ['Course outline PDF', 'Resource checklist']
        },
        {
          id: 2,
          title: 'Evolution of Crop Management Practices',
          duration: '12 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/crop-evolution.mp4',
          resources: ['Historical timeline', 'Case studies']
        },
        {
          id: 3,
          title: 'Current Challenges in Agriculture',
          duration: '15 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/agriculture-challenges.mp4',
          resources: ['Research papers', 'Statistics report']
        },
        {
          id: 4,
          title: 'Knowledge Check: Basics',
          duration: '10 min',
          type: 'quiz',
          preview: false,
          questions: 10,
          quizData: {
            title: 'Knowledge Check: Agriculture Basics',
            description: 'Test your understanding of fundamental agricultural concepts and modern farming challenges.',
            timeLimit: 10,
            passingScore: 70,
            questions: [
              {
                id: 1,
                type: 'multiple-choice',
                question: 'What is the primary goal of modern crop management?',
                options: [
                  'Maximize yield at any cost',
                  'Optimize yield while maintaining sustainability',
                  'Reduce labor requirements only',
                  'Eliminate all pests completely'
                ],
                correctAnswer: 1,
                explanation: 'Modern crop management focuses on optimizing yield while ensuring long-term sustainability of farming practices.'
              },
              {
                id: 2,
                type: 'multiple-choice',
                question: 'Which factor has the most significant impact on crop productivity?',
                options: [
                  'Seed variety only',
                  'Weather conditions only',
                  'Integrated management of all factors',
                  'Fertilizer application only'
                ],
                correctAnswer: 2,
                explanation: 'Successful crop management requires integrating multiple factors including soil, water, nutrients, pest control, and environmental conditions.'
              },
              {
                id: 3,
                type: 'true-false',
                question: 'Traditional farming methods are always less effective than modern techniques.',
                options: ['True', 'False'],
                correctAnswer: 1,
                explanation: 'Many traditional methods are highly effective and form the foundation of modern sustainable practices. The key is combining the best of both approaches.'
              },
              {
                id: 4,
                type: 'multiple-choice',
                question: 'What is the biggest challenge facing modern agriculture?',
                options: [
                  'Climate change and resource scarcity',
                  'Lack of technology',
                  'Insufficient land',
                  'Poor seed quality'
                ],
                correctAnswer: 0,
                explanation: 'Climate change, water scarcity, and soil degradation are among the most pressing challenges in modern agriculture.'
              },
              {
                id: 5,
                type: 'multiple-select',
                question: 'Which of the following are key components of sustainable crop management? (Select all that apply)',
                options: [
                  'Soil health maintenance',
                  'Water conservation',
                  'Integrated pest management',
                  'Excessive chemical inputs',
                  'Biodiversity preservation'
                ],
                correctAnswers: [0, 1, 2, 4],
                explanation: 'Sustainable crop management focuses on maintaining soil health, conserving water, managing pests naturally, and preserving biodiversity while avoiding excessive chemical inputs.'
              }
            ]
          }
        }
      ]
    },
    {
      id: 2,
      title: 'Soil Preparation and Analysis',
      duration: '1.5 hours',
      lessons: [
        {
          id: 5,
          title: 'Soil Testing Fundamentals',
          duration: '18 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/soil-testing-fundamentals.mp4',
          resources: ['Soil testing kit guide', 'pH chart']
        },
        {
          id: 6,
          title: 'Interpreting Soil Test Results',
          duration: '22 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/soil-test-interpretation.mp4',
          resources: ['Sample reports', 'Interpretation guide']
        },
        {
          id: 7,
          title: 'Soil Amendment Strategies',
          duration: '25 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/soil-amendments.mp4',
          resources: ['Amendment calculator', 'Product comparison']
        },
        {
          id: 8,
          title: 'Hands-on: Soil Preparation Checklist',
          duration: '15 min',
          type: 'assignment',
          preview: false,
          resources: ['Preparation template', 'Timeline planner'],
          assignmentData: {
            title: 'Create Your Soil Preparation Plan',
            description: 'Develop a comprehensive soil preparation plan for a specific crop of your choice.',
            estimatedTime: '15-20 minutes',
            instructions: [
              'Choose a crop you want to grow (vegetables, grains, or fruits)',
              'Research the specific soil requirements for your chosen crop',
              'Create a step-by-step soil preparation timeline',
              'Identify necessary soil amendments based on typical soil deficiencies',
              'Calculate quantities needed for a 100 square meter plot'
            ],
            deliverables: [
              'Completed soil preparation checklist',
              'Amendment calculation worksheet',
              'Timeline with specific dates and activities'
            ],
            resources: [
              'Soil preparation template (downloadable PDF)',
              'Amendment calculator spreadsheet',
              'Crop-specific soil requirement database',
              'Sample preparation plans for reference'
            ],
            rubric: {
              'Crop Selection & Research': 20,
              'Soil Amendment Planning': 30,
              'Timeline Development': 25,
              'Calculations Accuracy': 25
            },
            submissionFormat: 'Upload completed worksheets as PDF or submit online form',
            tips: [
              'Consider your local climate and growing season',
              'Factor in soil preparation lead time before planting',
              'Include both organic and mineral amendments as needed',
              'Don\'t forget to plan for soil pH adjustment if necessary'
            ]
          }
        }
      ]
    },
    {
      id: 3,
      title: 'Seed Selection and Planting',
      duration: '2 hours',
      lessons: [
        {
          id: 9,
          title: 'Choosing the Right Varieties',
          duration: '20 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/seed-variety-selection.mp4',
          resources: ['Variety comparison chart', 'Climate zone map']
        },
        {
          id: 10,
          title: 'Seed Quality Assessment',
          duration: '15 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/seed-quality-assessment.mp4',
          resources: ['Quality checklist', 'Testing procedures']
        },
        {
          id: 11,
          title: 'Optimal Planting Techniques',
          duration: '30 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/planting-techniques.mp4',
          resources: ['Planting calendar', 'Spacing calculator']
        },
        {
          id: 12,
          title: 'Germination Optimization',
          duration: '25 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/germination-optimization.mp4',
          resources: ['Germination tracking sheet', 'Troubleshooting guide']
        },
        {
          id: 13,
          title: 'Practice Exercise: Planting Plan',
          duration: '30 min',
          type: 'assignment',
          preview: false,
          resources: ['Planning template', 'Example plans'],
          assignmentData: {
            title: 'Design Your Complete Planting Strategy',
            description: 'Create a detailed planting plan that includes variety selection, timing, spacing, and succession planting for a full growing season.',
            estimatedTime: '25-35 minutes',
            instructions: [
              'Select 3-5 compatible crops for your climate zone',
              'Choose appropriate varieties for each crop',
              'Plan optimal planting dates and succession schedules',
              'Calculate spacing requirements and plot layout',
              'Design a companion planting strategy',
              'Include contingency plans for weather delays'
            ],
            deliverables: [
              'Complete seasonal planting calendar',
              'Plot layout diagram with measurements',
              'Variety selection justification report',
              'Succession planting schedule'
            ],
            resources: [
              'Interactive planting calendar tool',
              'Companion planting compatibility chart',
              'Regional climate data and frost dates',
              'Seed catalog with variety specifications',
              'Plot design templates and examples'
            ],
            rubric: {
              'Variety Selection Rationale': 25,
              'Timing and Succession Planning': 30,
              'Spatial Layout Design': 20,
              'Companion Planting Integration': 15,
              'Contingency Planning': 10
            },
            submissionFormat: 'Submit as comprehensive PDF report with diagrams',
            tips: [
              'Consider your local last frost date and growing season length',
              'Plan for continuous harvest with succession plantings',
              'Think about crop rotation principles for long-term soil health',
              'Include both fast and slow-maturing crops for variety'
            ]
          }
        }
      ]
    },
    {
      id: 4,
      title: 'Water Management and Irrigation',
      duration: '1.5 hours',
      lessons: [
        {
          id: 14,
          title: 'Understanding Plant Water Needs',
          duration: '18 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/plant-water-needs.mp4',
          resources: ['Water requirement charts', 'Growth stage guide']
        },
        {
          id: 15,
          title: 'Irrigation System Selection',
          duration: '25 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/irrigation-systems.mp4',
          resources: ['System comparison', 'Cost calculator']
        },
        {
          id: 16,
          title: 'Scheduling and Monitoring',
          duration: '20 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/irrigation-scheduling.mp4',
          resources: ['Monitoring tools', 'Schedule templates']
        },
        {
          id: 17,
          title: 'Water Conservation Techniques',
          duration: '17 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/water-conservation.mp4',
          resources: ['Conservation methods', 'Efficiency tips']
        }
      ]
    },
    {
      id: 5,
      title: 'Pest and Disease Management',
      duration: '2 hours',
      lessons: [
        {
          id: 18,
          title: 'Integrated Pest Management (IPM)',
          duration: '25 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/integrated-pest-management.mp4',
          resources: ['IPM strategy guide', 'Decision trees']
        },
        {
          id: 19,
          title: 'Common Pests Identification',
          duration: '30 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/pest-identification.mp4',
          resources: ['Pest identification guide', 'Photo gallery']
        },
        {
          id: 20,
          title: 'Disease Prevention and Treatment',
          duration: '35 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/disease-management.mp4',
          resources: ['Disease atlas', 'Treatment protocols']
        },
        {
          id: 21,
          title: 'Biological Control Methods',
          duration: '20 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/biological-control.mp4',
          resources: ['Beneficial insects guide', 'Supplier directory']
        },
        {
          id: 22,
          title: 'Case Study Analysis',
          duration: '10 min',
          type: 'assignment',
          preview: false,
          resources: ['Case study materials', 'Analysis template'],
          assignmentData: {
            title: 'IPM Strategy Case Study Analysis',
            description: 'Analyze a real-world pest management scenario and develop an integrated pest management strategy.',
            estimatedTime: '45-60 minutes',
            scenario: {
              title: 'Tomato Farm Pest Challenge',
              background: 'Green Valley Farm is a 5-acre organic tomato operation experiencing multiple pest pressures including aphids, hornworms, and early signs of late blight disease. The farm has been using beneficial insects but is still seeing crop damage. Weather has been unusually humid this season.',
              currentConditions: [
                'Moderate aphid infestation on 30% of plants',
                'Hornworm damage visible on upper leaves',
                'Early blight spots detected on lower leaves',
                'High humidity levels (80%+) for past two weeks',
                'Beneficial insect population present but low'
              ],
              constraints: [
                'Organic certification must be maintained',
                'Budget limit of $2,000 for interventions',
                'Harvest season begins in 6 weeks',
                'Labor availability limited to weekends'
              ]
            },
            instructions: [
              'Identify all pest and disease issues present',
              'Prioritize problems based on economic impact and urgency',
              'Develop a comprehensive IPM strategy using multiple approaches',
              'Create a timeline for implementation',
              'Estimate costs and justify your recommendations',
              'Include monitoring and evaluation methods'
            ],
            deliverables: [
              'Problem analysis and prioritization matrix',
              'Detailed IPM strategy document',
              'Implementation timeline with milestones',
              'Cost-benefit analysis',
              'Monitoring and evaluation plan'
            ],
            resources: [
              'IPM decision-making flowcharts',
              'Organic pest control product database',
              'Cost estimation worksheets',
              'Monitoring schedule templates',
              'Success metrics guidelines'
            ],
            rubric: {
              'Problem Identification & Analysis': 20,
              'IPM Strategy Development': 30,
              'Implementation Planning': 20,
              'Cost-Benefit Analysis': 15,
              'Monitoring Plan': 15
            },
            submissionFormat: 'Comprehensive report with supporting charts and timelines',
            tips: [
              'Consider the interactions between different pest management approaches',
              'Think about prevention as well as treatment',
              'Balance immediate needs with long-term sustainability',
              'Remember that organic solutions may take longer to show results'
            ]
          }
        }
      ]
    },
    {
      id: 6,
      title: 'Harvest and Post-Harvest Management',
      duration: '1 hour',
      lessons: [
        {
          id: 23,
          title: 'Determining Harvest Readiness',
          duration: '15 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/harvest-readiness.mp4',
          resources: ['Maturity indicators', 'Testing methods']
        },
        {
          id: 24,
          title: 'Harvesting Techniques',
          duration: '20 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/harvesting-techniques.mp4',
          resources: ['Best practices guide', 'Equipment recommendations']
        },
        {
          id: 25,
          title: 'Storage and Preservation',
          duration: '18 min',
          type: 'video',
          preview: false,
          videoUrl: 'https://example.com/videos/storage-preservation.mp4',
          resources: ['Storage guidelines', 'Preservation methods']
        },
        {
          id: 26,
          title: 'Final Assessment',
          duration: '7 min',
          type: 'quiz',
          preview: false,
          questions: 15,
          quizData: {
            title: 'Comprehensive Course Assessment',
            description: 'Final evaluation covering all aspects of modern crop management techniques learned throughout the course.',
            timeLimit: 20,
            passingScore: 80,
            questions: [
              {
                id: 1,
                type: 'multiple-choice',
                question: 'What is the optimal soil pH range for most vegetable crops?',
                options: ['5.0-5.5', '6.0-7.0', '7.5-8.0', '8.5-9.0'],
                correctAnswer: 1,
                explanation: 'Most vegetables grow best in slightly acidic to neutral soil with pH between 6.0-7.0, which allows optimal nutrient availability.'
              },
              {
                id: 2,
                type: 'multiple-choice',
                question: 'Which irrigation method is most water-efficient for row crops?',
                options: ['Flood irrigation', 'Sprinkler irrigation', 'Drip irrigation', 'Furrow irrigation'],
                correctAnswer: 2,
                explanation: 'Drip irrigation is the most water-efficient method, delivering water directly to plant roots with minimal evaporation loss.'
              },
              {
                id: 3,
                type: 'true-false',
                question: 'Crop rotation helps break pest and disease cycles.',
                options: ['True', 'False'],
                correctAnswer: 0,
                explanation: 'Crop rotation disrupts the life cycles of pests and diseases that are specific to certain crops, reducing their populations naturally.'
              },
              {
                id: 4,
                type: 'multiple-select',
                question: 'Which factors should be considered when determining harvest timing? (Select all that apply)',
                options: [
                  'Fruit color and size',
                  'Market prices',
                  'Weather forecast',
                  'Storage capacity',
                  'Plant maturity indicators'
                ],
                correctAnswers: [0, 2, 4],
                explanation: 'Harvest timing should primarily be based on plant maturity indicators, fruit characteristics, and weather conditions to ensure quality and minimize losses.'
              },
              {
                id: 5,
                type: 'multiple-choice',
                question: 'What is the primary benefit of integrated pest management (IPM)?',
                options: [
                  'Complete elimination of all pests',
                  'Reduced reliance on chemical pesticides',
                  'Faster pest control results',
                  'Lower labor requirements'
                ],
                correctAnswer: 1,
                explanation: 'IPM focuses on sustainable pest control using multiple strategies, significantly reducing the need for chemical pesticides while maintaining effective control.'
              },
              {
                id: 6,
                type: 'multiple-choice',
                question: 'Which soil amendment is best for improving water retention in sandy soils?',
                options: ['Lime', 'Gypsum', 'Compost', 'Sand'],
                correctAnswer: 2,
                explanation: 'Compost and other organic matter significantly improve the water-holding capacity of sandy soils while also adding nutrients.'
              },
              {
                id: 7,
                type: 'true-false',
                question: 'Seeds should always be planted at a depth equal to three times their diameter.',
                options: ['True', 'False'],
                correctAnswer: 0,
                explanation: 'The general rule for planting depth is 2-3 times the seed diameter, which ensures proper germination conditions and emergence.'
              },
              {
                id: 8,
                type: 'multiple-choice',
                question: 'What is the most critical factor in post-harvest quality maintenance?',
                options: ['Packaging material', 'Temperature control', 'Transportation speed', 'Market timing'],
                correctAnswer: 1,
                explanation: 'Temperature control is crucial for maintaining quality and extending shelf life of harvested crops by slowing respiration and deterioration.'
              }
            ]
          }
        }
      ]
    }
  ],
  certificate: {
    available: true,
    hours: 8,
    title: 'Modern Crop Management Specialist'
  },
  reviews: [
    {
      id: 1,
      student: 'Michael Thompson',
      rating: 5,
      date: '2024-12-10',
      comment: 'Excellent course! The practical tips helped me increase my tomato yield by 30%. Dr. Johnson explains everything clearly.',
      helpful: 45
    },
    {
      id: 2,
      student: 'Maria Rodriguez',
      rating: 5,
      date: '2024-12-08',
      comment: 'Very comprehensive and well-structured. The soil management section was particularly valuable for my organic farm.',
      helpful: 32
    },
    {
      id: 3,
      student: 'James Wilson',
      rating: 4,
      date: '2024-12-05',
      comment: 'Good content overall. Would have liked more information on specific pest control for different regions.',
      helpful: 18
    }
  ]
},
    {
      id: 2,
      title: 'Sustainable Soil Health Practices',
      slug: 'sustainable-soil-health-practices',
      description: 'Learn comprehensive soil management techniques to maintain and improve soil quality for long-term farming success.',
      shortDescription: 'Master soil health for sustainable farming',
      image: 'data:image/jpeg;base64,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',
      instructor: {
        id: 2,
        name: 'Prof. Michael Chen',
        title: 'Soil Science Professor & Research Director',
        avatar: '/api/placeholder/100/100',
        bio: 'Prof. Chen is a leading soil scientist with 20 years of research experience in soil health and sustainable agriculture.',
        rating: 4.9,
        students: 8934,
        courses: 12
      },
      categoryId: 2,
      subcategory: 'Soil Conservation',
      level: 'Beginner',
      language: 'English',
      price: 79,
      originalPrice: 129,
      discount: 39,
      rating: 4.9,
      reviewsCount: 892,
      studentsCount: 1823,
      duration: '6.5 hours',
      totalLessons: 35,
      lastUpdated: '2024-12-12',
      bestseller: false,
      featured: true,
      requirements: [
        'No prior experience required',
        'Interest in sustainable farming',
        'Basic understanding of agriculture helpful but not required'
      ],
      whatYouWillLearn: [
        'Soil composition and structure analysis',
        'Organic matter management techniques',
        'Cover cropping strategies',
        'Composting and vermicomposting',
        'Soil pH and nutrient management',
        'Erosion prevention methods'
      ],
      targetAudience: [
        'Beginning farmers and gardeners',
        'Sustainable agriculture enthusiasts',
        'Students of agricultural sciences',
        'Organic farming practitioners'
      ],
      modules: [
        {
          id: 1,
          title: 'Soil Fundamentals',
          duration: '1.5 hours',
          lessons: [
            {
              id: 1,
              title: 'Introduction to Soil Science',
              duration: '12 min',
              type: 'video',
              preview: true,
              resources: ['Soil basics PDF', 'Glossary of terms']
            },
            {
              id: 2,
              title: 'Soil Formation and Types',
              duration: '18 min',
              type: 'video',
              preview: false,
              resources: ['Soil classification chart', 'Formation timeline']
            },
            {
              id: 3,
              title: 'Physical Properties of Soil',
              duration: '15 min',
              type: 'video',
              preview: false,
              resources: ['Property testing kit', 'Reference tables']
            },
            {
              id: 4,
              title: 'Chemical Properties and pH',
              duration: '20 min',
              type: 'video',
              preview: false,
              resources: ['pH testing guide', 'Chemical analysis sheet']
            },
            {
              id: 5,
              title: 'Biological Activity in Soil',
              duration: '15 min',
              type: 'video',
              preview: false,
              resources: ['Microorganism guide', 'Activity indicators']
            },
            {
              id: 6,
              title: 'Quiz: Soil Basics',
              duration: '10 min',
              type: 'quiz',
              preview: false,
              questions: 12
            }
          ]
        }
        // Additional modules would follow similar structure...
      ],
      certificate: {
        available: true,
        hours: 6.5,
        title: 'Sustainable Soil Health Specialist'
      },
      reviews: [
        {
          id: 1,
          student: 'Sarah Davis',
          rating: 5,
          date: '2024-12-09',
          comment: 'Transformed my understanding of soil health. My garden has never been more productive!',
          helpful: 67
        }
      ]
    },
    {
      id: 3,
      title: 'Organic Farming Fundamentals',
      slug: 'organic-farming-fundamentals',
      description: 'Complete guide to organic farming methods, certification processes, and sustainable practices for modern agriculture.',
      shortDescription: 'Complete organic farming certification guide',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIcntjI3H4b5h_agW4ObQqfdqu-NiQqLs3GQ&s',
      instructor: {
        id: 3,
        name: 'Emma Rodriguez',
        title: 'Certified Organic Farm Consultant',
        avatar: '/api/placeholder/100/100',
        bio: 'Emma has been practicing organic farming for 12 years and has helped over 500 farms achieve organic certification.',
        rating: 4.8,
        students: 15632,
        courses: 6
      },
      categoryId: 4,
      subcategory: 'Organic Certification',
      level: 'Beginner',
      language: 'English',
      price: 99,
      originalPrice: 159,
      discount: 38,
      rating: 4.7,
      reviewsCount: 1456,
      studentsCount: 3156,
      duration: '10 hours',
      totalLessons: 58,
      lastUpdated: '2024-12-14',
      bestseller: true,
      featured: true,
      requirements: [
        'Basic farming knowledge helpful',
        'Commitment to sustainable practices',
        'Access to farming land (for practical application)'
      ],
      whatYouWillLearn: [
        'Organic certification requirements',
        'Natural pest and disease control',
        'Organic soil fertility management',
        'Crop rotation for organic systems',
        'Record keeping and documentation',
        'Marketing organic products'
      ],
      targetAudience: [
        'Farmers transitioning to organic',
        'New organic farmers',
        'Agricultural consultants',
        'Sustainable agriculture advocates'
      ],
      modules: [
        {
          id: 1,
          title: 'Introduction to Organic Farming',
          duration: '2 hours',
          lessons: [
            {
              id: 1,
              title: 'What is Organic Agriculture?',
              duration: '15 min',
              type: 'video',
              preview: true,
              resources: ['Organic principles guide', 'Standards overview']
            }
            // More lessons...
          ]
        }
        // More modules...
      ],
      certificate: {
        available: true,
        hours: 10,
        title: 'Organic Farming Specialist'
      },
      reviews: []
    },
    {
      id: 4,
      title: 'Smart Farm Technology Integration',
      slug: 'smart-farm-technology-integration',
      description: 'Discover how to integrate IoT, sensors, and smart technologies into your farming operations for precision agriculture.',
      shortDescription: 'Master precision agriculture technology',
      image: 'data:image/png;base64,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',
      instructor: {
        id: 4,
        name: 'David Kim',
        title: 'Agricultural Technology Specialist',
        avatar: '/api/placeholder/100/100',
        bio: 'David combines 10 years of software engineering with agricultural expertise to help farmers adopt smart technologies.',
        rating: 4.7,
        students: 5421,
        courses: 4
      },
      categoryId: 6,
      subcategory: 'IoT in Agriculture',
      level: 'Advanced',
      language: 'English',
      price: 129,
      originalPrice: 199,
      discount: 35,
      rating: 4.6,
      reviewsCount: 423,
      studentsCount: 967,
      duration: '12 hours',
      totalLessons: 48,
      lastUpdated: '2024-12-11',
      bestseller: false,
      featured: true,
      requirements: [
        'Basic understanding of farming operations',
        'Comfort with technology and gadgets',
        'Intermediate computer skills'
      ],
      whatYouWillLearn: [
        'IoT sensor deployment and management',
        'Data collection and analysis',
        'Automated irrigation systems',
        'Drone technology for farming',
        'GPS-guided equipment operation',
        'Farm management software'
      ],
      targetAudience: [
        'Tech-savvy farmers',
        'Large-scale farm operators',
        'Agricultural technology enthusiasts',
        'Farm managers seeking efficiency'
      ],
      modules: [
        {
          id: 1,
          title: 'Introduction to Smart Farming',
          duration: '2.5 hours',
          lessons: [
            {
              id: 1,
              title: 'The Future of Agriculture',
              duration: '20 min',
              type: 'video',
              preview: true,
              resources: ['Technology trends report', 'Case studies']
            }
            // More lessons...
          ]
        }
        // More modules...
      ],
      certificate: {
        available: true,
        hours: 12,
        title: 'Smart Farming Technology Specialist'
      },
      reviews: []
    }
  ],
 enrolledCourses: [1, 3],
  // Store state
  selectedCategory: null,
  selectedCourse: null,
  searchQuery: '',
  filters: {
    level: '',
    price: '',
    rating: '',
    duration: ''
  },

  // Actions
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setSelectedCourse: (courseId) => set({ selectedCourse: courseId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  // Getters
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
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Level filter
    if (filters.level) {
      filteredCourses = filteredCourses.filter(course => course.level === filters.level);
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

  // Course progress tracking
  userProgress: {},
  
  updateCourseProgress: (courseId, lessonId, completed = true) => set((state) => ({
    userProgress: {
      ...state.userProgress,
      [courseId]: {
        ...state.userProgress[courseId],
        [lessonId]: {
          completed,
          completedAt: new Date().toISOString()
        }
      }
    }
  })),

  getCourseProgress: (courseId) => {
    const { userProgress } = get();
    return userProgress[courseId] || {};
  },
   // Function to enroll in a course
  enrollInCourse: (courseId) => {
    set((state) => ({
      enrolledCourses: state.enrolledCourses.includes(courseId) 
        ? state.enrolledCourses 
        : [...state.enrolledCourses, courseId]
    }));
  },
  
  // Function to check if user is enrolled in a course
  isEnrolledInCourse: (courseId) => {
    const { enrolledCourses } = get();
    return enrolledCourses.includes(courseId);
  },
  
  // Optional: Function to unenroll from a course
  unenrollFromCourse: (courseId) => {
    set((state) => ({
      enrolledCourses: state.enrolledCourses.filter(id => id !== courseId)
    }));
  },

  getCourseCompletionPercentage: (courseId) => {
    const { courses, userProgress } = get();
    const course = courses.find(c => c.id === courseId);
    const progress = userProgress[courseId] || {};
    
    if (!course) return 0;
    
    const totalLessons = course.modules.reduce((total, module) => 
      total + module.lessons.length, 0
    );
    
    const completedLessons = Object.values(progress).filter(
      lesson => lesson.completed
    ).length;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  }
  
}));

export default useCourseStore;