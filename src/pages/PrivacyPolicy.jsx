import { Calendar, Database, Eye, Globe, Lock, Mail, Shield, UserCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly, including your name, email address, phone number, billing information, and profile details when you create an account or enroll in courses."
        },
        {
          subtitle: "Learning Data",
          text: "We track your course progress, quiz scores, completion rates, time spent on lessons, and learning preferences to personalize your educational experience."
        },
        {
          subtitle: "Technical Information",
          text: "We automatically collect device information, IP addresses, browser type, operating system, and usage patterns to improve our platform performance."
        },
        {
          subtitle: "Communication Data",
          text: "Messages sent through our platform, forum posts, course reviews, and support interactions are collected to facilitate learning and provide assistance."
        }
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: UserCheck,
      content: [
        {
          subtitle: "Educational Services",
          text: "Your data helps us deliver personalized courses, track progress, issue certificates, and recommend relevant agricultural content based on your interests."
        },
        {
          subtitle: "Platform Improvement",
          text: "We analyze usage patterns to enhance course quality, develop new features, and optimize the learning experience for all users."
        },
        {
          subtitle: "Communication",
          text: "We send course updates, new content notifications, promotional offers, and important account information via email or in-platform messages."
        },
        {
          subtitle: "Legal Compliance",
          text: "Your information may be used to comply with legal obligations, resolve disputes, and enforce our terms of service."
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      icon: Globe,
      content: [
        {
          subtitle: "Course Instructors",
          text: "Instructors can view enrolled students' progress, quiz results, and participation in their courses to provide better educational support."
        },
        {
          subtitle: "Service Providers",
          text: "We share data with trusted third-party services for payment processing, email delivery, analytics, and hosting infrastructure."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information when required by law, to protect our rights, prevent fraud, or ensure user safety on our platform."
        },
        {
          subtitle: "Business Transfers",
          text: "In case of merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction with proper notification."
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security and Protection",
      icon: Lock,
      content: [
        {
          subtitle: "Encryption",
          text: "All sensitive data is encrypted both in transit and at rest using industry-standard protocols to protect against unauthorized access."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls, regular security audits, and employee training to ensure only authorized personnel can access your data."
        },
        {
          subtitle: "Incident Response",
          text: "We have comprehensive incident response procedures and will notify affected users within 72 hours of any data breach that poses a risk."
        },
        {
          subtitle: "Data Backups",
          text: "Regular encrypted backups ensure data recovery capabilities while maintaining the same security standards as our primary systems."
        }
      ]
    },
    {
      id: "user-rights",
      title: "Your Privacy Rights",
      icon: Eye,
      content: [
        {
          subtitle: "Access and Portability",
          text: "You can request a copy of all personal data we hold about you, including course progress and learning history, in a machine-readable format."
        },
        {
          subtitle: "Correction and Updates",
          text: "Update your profile information, learning preferences, and communication settings anytime through your account dashboard."
        },
        {
          subtitle: "Data Deletion",
          text: "Request complete account deletion, though some information may be retained for legal compliance or legitimate business purposes as outlined in our retention policy."
        },
        {
          subtitle: "Marketing Opt-out",
          text: "Unsubscribe from promotional emails, course recommendations, and marketing communications while still receiving essential account notifications."
        }
      ]
    },
    {
      id: "cookies-tracking",
      title: "Cookies and Tracking Technologies",
      icon: Shield,
      content: [
        {
          subtitle: "Essential Cookies",
          text: "Required cookies enable core functionality like user authentication, course progress saving, and security features necessary for platform operation."
        },
        {
          subtitle: "Analytics Cookies",
          text: "We use analytics tools to understand user behavior, popular courses, and platform performance to improve our educational services."
        },
        {
          subtitle: "Preference Cookies",
          text: "These cookies remember your settings, language preferences, and customization choices to enhance your learning experience."
        },
        {
          subtitle: "Cookie Management",
          text: "You can control cookie preferences through your browser settings, though disabling certain cookies may limit platform functionality."
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
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 mb-2">
            Your privacy and data security are fundamental to our mission at Bright Farms Academy
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Last updated: {lastUpdated}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At Bright Farms Academy, we're committed to protecting your privacy while delivering exceptional agricultural education. This policy explains how we collect, use, and safeguard your personal information as you learn and grow with our platform.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We believe transparency is essential for building trust. This comprehensive policy outlines our data practices in clear, understandable terms so you can make informed decisions about your personal information.
          </p>
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

        {/* Data Retention Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We retain your personal information only as long as necessary to provide our educational services and comply with legal obligations. Account data is kept active during your enrollment and for up to 7 years after account closure for legal and business purposes.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Course progress and certificates are maintained indefinitely to support your ongoing career development, but can be deleted upon request where legally permissible.
          </p>
        </div>

        {/* International Transfers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Bright Farms Academy operates globally to serve agricultural learners worldwide. Your data may be transferred to and processed in countries other than your residence, including the United States and European Union.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses and adequacy decisions where applicable.
          </p>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy Protection</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our platform is designed for users 13 years and older. We do not knowingly collect personal information from children under 13. If we discover we have collected information from a child under 13, we will delete it immediately.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For users between 13-17, we encourage parental involvement in the learning process and require parental consent for certain features.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-emerald-600 rounded-lg text-white p-8 mt-8">
          <div className="text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-semibold mb-4">Questions About Your Privacy?</h2>
            <p className="text-emerald-100 leading-relaxed mb-6">
              We're here to help with any privacy concerns or questions about how we protect your data. Our dedicated privacy team is committed to transparency and your peace of mind.
            </p>
            <div className="space-y-2 text-emerald-100">
              <p><strong>Email:</strong> privacy@brightfarmsacademy.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@brightfarmsacademy.com</p>
              <p><strong>Response Time:</strong> Within 72 hours</p>
            </div>
          </div>
        </div>

        {/* Policy Updates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Policy Updates</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update this privacy policy periodically to reflect changes in our practices, technology, or legal requirements. Significant changes will be communicated through email notifications and prominent notices on our platform.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Continued use of Bright Farms Academy after policy updates constitutes acceptance of the revised terms. We encourage regular review of this policy to stay informed about how we protect your information.
          </p>
        </div>
      </div>
    </div>
  );
}