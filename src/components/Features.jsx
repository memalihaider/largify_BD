import { Brain, Zap, Target, TrendingUp, BarChart3, Users, Rocket, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Complete CRM System",
      description: "Manage customer relationships with detailed contact profiles, interaction tracking, lead conversion, and communication history. Full customer lifecycle management.",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Advanced Lead Management",
      description: "Capture, score, and nurture leads with automated workflows. Lead qualification, assignment routing, and conversion tracking with detailed analytics.",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: BarChart3,
      title: "Marketing Dashboard & Analytics",
      description: "Comprehensive marketing tools including campaign management, competitor analysis, SEO optimization, social media analytics, and ROI tracking.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: TrendingUp,
      title: "Sales Pipeline Management",
      description: "Visual drag-and-drop pipeline with deal tracking, forecasting, probability scoring, and revenue projections. Custom stage definitions and analytics.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Brain,
      title: "AI-Powered Chatbot Assistant",
      description: "24/7 intelligent assistant with comprehensive platform knowledge, context-aware responses, and role-based guidance for enhanced user experience.",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: Shield,
      title: "Role-Based Access Control",
      description: "Secure multi-tier user management with Super Admin, Admin, Team Member, and Customer roles. Comprehensive permission system and security controls.",
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium backdrop-blur-sm mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Comprehensive Business Solutions
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Everything You Need for
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Business Success
            </span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            From CRM and lead management to marketing automation and analytics - all the tools your business needs in one integrated platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-violet-500/50 transition-all duration-500 hover:bg-slate-800/50 animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-violet-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-sm font-medium mr-2">Learn More</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <button className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-violet-500/50">
              Explore All Features
            </button>
            <button className="text-slate-300 hover:text-violet-400 font-medium transition-colors duration-300 flex items-center space-x-2">
              <span>Schedule a Demo</span>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;