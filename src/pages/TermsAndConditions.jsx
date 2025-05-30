import { AlertTriangle, BookOpen, Calendar, FileText, Gavel, Scale, Shield, Users } from 'lucide-react';

export default function TermsAndConditions() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      id: "acceptance-terms",
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        {
          subtitle: "Agreement to Terms",
          text: "By accessing and using Bright Farms Academy, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our platform."
        },
        {
          subtitle: "Age Requirements",
          text: "You must be at least 13 years old to create an account. Users between 13-17 should have parental consent to use our educational services."
        },
        {
          subtitle: "Modifications",
          text: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms."
        }
      ]
    },
    {
      id: "free-services",
      title: "Free Educational Services",
      icon: BookOpen,
      content: [
        {
          subtitle: "No Cost Commitment",
          text: "All courses, materials, and educational content on Bright Farms Academy are provided completely free of charge. There are no hidden fees, subscription costs, or premium tiers."
        },
        {
          subtitle: "Equal Access",
          text: "Every registered user has equal access to all educational content, including video lessons, downloadable resources, quizzes, and certificates of completion."
        },
        {
          subtitle: "Future Changes",
          text: "While our courses are currently free, we reserve the right to introduce paid features or premium content in the future with proper advance notice to users."
        },
        {
          subtitle: "Value and Quality",
          text: "Despite being free, we maintain high educational standards and continuously update our content to provide valuable agricultural knowledge and skills."
        }
      ]
    },
    {
      id: "user-accounts",
      title: "User Accounts and Responsibilities",
      icon: Users,
      content: [
        {
          subtitle: "Account Creation",
          text: "You must provide accurate, complete information when creating your account and keep your login credentials secure. You are responsible for all activities under your account."
        },
        {
          subtitle: "Account Security",
          text: "You must maintain the confidentiality of your password and notify us immediately of any unauthorized access to your account."
        },
        {
          subtitle: "Multiple Accounts",
          text: "Each user may maintain only one active account. Creating multiple accounts to circumvent platform policies is prohibited."
        },
        {
          subtitle: "Account Termination",
          text: "We may suspend or terminate accounts that violate these terms, engage in fraudulent activity, or disrupt the learning environment for other users."
        }
      ]
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      icon: Shield,
      content: [
        {
          subtitle: "Educational Purpose",
          text: "Our platform is designed for agricultural education and professional development. All interactions should support a positive learning environment."
        },
        {
          subtitle: "Prohibited Activities",
          text: "Users may not engage in harassment, spam, hate speech, illegal activities, or share inappropriate content. Respect for all community members is required."
        },
        {
          subtitle: "Content Sharing",
          text: "When participating in forums or discussions, ensure your contributions are relevant, respectful, and add value to the learning community."
        },
        {
          subtitle: "Platform Integrity",
          text: "Do not attempt to hack, reverse engineer, or interfere with the platform's functionality. Report security vulnerabilities responsibly."
        }
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      icon: Scale,
      content: [
        {
          subtitle: "Our Content",
          text: "All course materials, videos, text, images, and educational content are owned by Bright Farms Academy or our content partners and are protected by copyright laws."
        },
        {
          subtitle: "Limited License",
          text: "We grant you a personal, non-transferable license to access and use our educational content for learning purposes only. Commercial use is prohibited without permission."
        },
        {
          subtitle: "User-Generated Content",
          text: "Content you create (forum posts, project submissions, reviews) remains yours, but you grant us permission to display and use it to improve our platform."
        },
        {
          subtitle: "Respect for Others",
          text: "Do not upload or share content that infringes on others' intellectual property rights. We will respond to valid copyright claims promptly."
        }
      ]
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitations",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Educational Nature",
          text: "Our content is for educational purposes only. While we strive for accuracy, agricultural practices vary by region, climate, and local regulations."
        },
        {
          subtitle: "No Professional Advice",
          text: "Content should not be considered as professional agricultural, legal, or financial advice. Consult qualified professionals for specific situations."
        },
        {
          subtitle: "Platform Availability",
          text: "We aim for 99% uptime but cannot guarantee uninterrupted service. Maintenance, updates, or technical issues may temporarily affect access."
        },
        {
          subtitle: "External Links",
          text: "We may link to third-party resources for additional learning. We are not responsible for the content or practices of external websites."
        }
      ]
    },
    {
      id: "privacy-data",
      title: "Privacy and Data Protection",
      icon: Shield,
      content: [
        {
          subtitle: "Data Collection",
          text: "We collect only necessary information to provide educational services and improve user experience. See our Privacy Policy for detailed information."
        },
        {
          subtitle: "Learning Analytics",
          text: "We track course progress, quiz scores, and engagement to personalize your learning experience and improve our content quality."
        },
        {
          subtitle: "Communication",
          text: "We may send educational updates, new course notifications, and important platform announcements. You can opt out of non-essential communications."
        },
        {
          subtitle: "Data Security",
          text: "We implement industry-standard security measures to protect your personal information and learning data from unauthorized access."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-600 p-4 rounded-full">
              <Gavel className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-xl text-gray-600 mb-2">
            Clear guidelines for using Bright Farms Academy's free agricultural education platform
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Last updated: {lastUpdated}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to Bright Farms Academy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms and Conditions govern your use of Bright Farms Academy, a free agricultural education platform dedicated to empowering farmers, students, and agricultural enthusiasts worldwide with knowledge and skills.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our mission is to make quality agricultural education accessible to everyone, regardless of economic background. All our courses, resources, and certificates are provided completely free of charge.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start">
              <BookOpen className="h-5 w-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-emerald-800 text-sm">
                <strong>100% Free Education:</strong> All courses, materials, and certificates on our platform are completely free with no hidden costs or premium tiers.
              </p>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-emerald-50 border-b border-emerald-100 p-6">
                  <div className="flex items-center">
                    <div className="bg-emerald-600 p-3 rounded-lg mr-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                      <div className="text-emerald-600 font-medium">Section {index + 1}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-l-4 border-emerald-200 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.subtitle}</h3>
                        <p className="text-gray-700 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Guidelines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Community Guidelines</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Bright Farms Academy thrives on community collaboration and knowledge sharing. We expect all users to contribute positively to our learning environment by:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Sharing accurate agricultural knowledge and experiences</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Asking thoughtful questions and providing helpful answers</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Respecting diverse farming practices and cultural approaches</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Supporting fellow learners in their agricultural journey</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Reporting inappropriate content or behavior</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Maintaining professionalism in all interactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liability and Warranties */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Bright Farms Academy provides educational content "as is" without warranties of any kind. While we strive for accuracy and quality, agricultural practices vary significantly based on location, climate, soil conditions, and local regulations.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Users should always consult with local agricultural experts, extension services, and relevant authorities before implementing farming practices. We are not liable for any losses, damages, or consequences resulting from the use of our educational content.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> Always verify agricultural information with local experts and comply with regional regulations before implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination of Service</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You may discontinue using Bright Farms Academy at any time by simply stopping access to the platform. If you wish to delete your account and associated data, please contact our support team.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these terms, engage in disruptive behavior, or misuse our platform. In such cases, we will provide notice and opportunity for explanation when possible.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law and Disputes</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These terms are governed by applicable international laws and local jurisdiction where Bright Farms Academy operates. We encourage resolving disputes through direct communication and mediation when possible.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For any legal disputes that cannot be resolved amicably, the appropriate courts in our operating jurisdiction will have authority, subject to applicable international agreements.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-emerald-600 rounded-lg text-white p-8 mt-8">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-semibold mb-4">Questions About These Terms?</h2>
            <p className="text-emerald-100 leading-relaxed mb-6">
              We're committed to transparency and clarity. If you have questions about these terms or need clarification on any policies, our team is here to help.
            </p>
            <div className="space-y-2 text-emerald-100">
              <p><strong>Email:</strong> legal@brightfarmsacademy.com</p>
              <p><strong>Support:</strong> support@brightfarmsacademy.com</p>
              <p><strong>Response Time:</strong> Within 48 hours</p>
            </div>
          </div>
        </div>

        {/* Agreement Confirmation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Agreement</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            By using Bright Farms Academy, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. You also agree to our Privacy Policy and Community Guidelines.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Thank you for joining our mission to make agricultural education accessible to everyone. Together, we're cultivating knowledge and growing a better future for farming communities worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}