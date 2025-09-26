import { ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden pt-24 pb-16">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-cyber-grid"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Particle Effects */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-violet-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium backdrop-blur-sm hover:bg-violet-500/20 transition-all duration-300 animate-fade-in-up">
            <Zap className="w-4 h-4 mr-2" />
            Complete Business Development & CRM Platform
          </div>

          {/* Main Heading */}
          <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                Transform Your Business
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent animate-gradient-x">
                With BD SaaS
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Comprehensive CRM, lead management, marketing automation, and analytics platform. 
              <span className="text-violet-300"> Streamline operations</span>, 
              <span className="text-cyan-300"> boost conversions</span>, and 
              <span className="text-violet-300"> scale your business</span> with intelligent tools and AI-powered insights.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <button className="group bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-violet-500/50 flex items-center space-x-2 min-w-[200px]">
              <span>Start Growing Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="group bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 border border-slate-600/50 hover:border-violet-500/50 backdrop-blur-sm flex items-center space-x-2 min-w-[200px]">
              <span>Watch Demo</span>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="group p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-violet-500/50 transition-all duration-300 hover:bg-slate-800/50">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">10+</div>
              <div className="text-slate-400">Core Modules</div>
            </div>
            
            <div className="group p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-violet-500/50 transition-all duration-300 hover:bg-slate-800/50">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">4</div>
              <div className="text-slate-400">User Role Types</div>
            </div>
            
            <div className="group p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-violet-500/50 transition-all duration-300 hover:bg-slate-800/50">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-400">AI Assistant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </section>
  );
};

export default Hero;