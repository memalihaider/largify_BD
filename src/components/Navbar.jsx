import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Close mobile menu after navigation
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-violet-500/20' 
        : 'bg-gray-900/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-violet-500/50">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                BD SaaS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={() => scrollToSection('features')}
              className="px-4 py-2 text-sm text-slate-300 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg font-medium transition-all duration-300 border border-transparent hover:border-violet-500/30"
            >
              AI Solutions
            </button>
            <button
              onClick={() => scrollToSection('plans')}
              className="px-4 py-2 text-sm text-slate-300 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg font-medium transition-all duration-300 border border-transparent hover:border-violet-500/30"
            >
              Service Tiers
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-sm text-slate-300 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg font-medium transition-all duration-300 border border-transparent hover:border-violet-500/30"
            >
              Contact
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-slate-300 hover:text-violet-400 font-medium transition-all duration-300 hover:bg-violet-500/10 rounded-lg border border-transparent hover:border-violet-500/30"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-semibold text-sm px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-violet-500/50"
            >
              Start Growing
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-violet-400 hover:bg-violet-500/10 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 border border-transparent hover:border-violet-500/30"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                }`}></span>
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'max-h-screen opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-gray-900/95 backdrop-blur-md border-t border-violet-500/20 shadow-2xl">
          <div className="px-4 py-6 space-y-2">
            {/* Navigation Links */}
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection('features')}
                className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg font-medium transition-all duration-300 border border-transparent hover:border-violet-500/30"
              >
                AI Solutions
              </button>
              <button
                onClick={() => scrollToSection('plans')}
                className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg font-medium transition-all duration-300 border border-transparent hover:border-violet-500/30"
              >
                Service Tiers
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg font-medium transition-all duration-300 border border-transparent hover:border-violet-500/30"
              >
                Contact
              </button>
            </div>
            
            {/* Divider */}
            <div className="border-t border-violet-500/20 my-4"></div>
            
            {/* Auth Buttons */}
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full px-4 py-3 text-sm text-slate-300 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg font-medium transition-all duration-300 text-center border border-transparent hover:border-violet-500/30"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-300 text-center shadow-lg hover:shadow-violet-500/50"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Growing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;