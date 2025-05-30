import { BookOpen, Clock, Mail, MapPin, MessageCircle, Phone, Send, Users } from 'lucide-react';
import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@brightfarmsacademy.com', 'partnerships@brightfarmsacademy.com'],
      description: 'Get in touch for support or partnerships'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Agriculture Way', 'Green Valley, CA 94538'],
      description: 'Our headquarters and demo farm'
    },
    {
      icon: Clock,
      title: 'Response Time',
      details: ['24-48 hours', 'for general inquiries'],
      description: 'We strive for quick responses'
    }
  ];

  const categories = [
    'General Inquiry',
    'Course Support',
    'Technical Issues',
    'Partnership Opportunities',
    'Instructor Applications',
    'Billing & Payments',
    'Content Suggestions',
    'Other'
  ];

  const faqs = [
    {
      question: 'How do I access my purchased courses?',
      answer: 'Once you purchase a course, it will appear in your dashboard under "My Courses". You can access it anytime with your login credentials.'
    },
    {
      question: 'Do you offer certificates for completed courses?',
      answer: 'Yes! All our courses come with a certificate of completion that you can download and share on professional networks.'
    },
    {
      question: 'Can I become an instructor on Bright Farms Academy?',
      answer: 'Absolutely! We welcome experienced agricultural professionals. Please use the contact form with "Instructor Applications" category to get started.'
    },
    {
      question: 'What if I\'m not satisfied with a course?',
      answer: 'We offer a 30-day money-back guarantee for all courses. Contact our support team if you\'re not completely satisfied.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Have questions about our agricultural courses? Need support? We're here to help you grow your farming knowledge.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-emerald-600 font-medium">{detail}</p>
                ))}
                <p className="text-gray-600 text-sm mt-2">{info.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
            <div className="flex items-center mb-6">
              <MessageCircle className="w-8 h-8 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for contacting us. We'll get back to you within 24-48 hours.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Brief subject of your message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
              <div className="flex items-center mb-6">
                <BookOpen className="w-8 h-8 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-white">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold">Join Our Community</h3>
              </div>
              <p className="text-emerald-100 mb-6">
                Connect with fellow agricultural enthusiasts and stay updated with the latest farming techniques.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors duration-200">
                  Join Discord
                </button>
                <button className="border border-emerald-200 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200">
                  Follow Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}