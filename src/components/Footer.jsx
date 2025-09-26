import { Brain, Mail, Phone, MapPin, Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'AI Lead Scoring', href: '#features' },
      { name: 'Automation Suite', href: '#features' },
      { name: 'Analytics Dashboard', href: '#features' },
      { name: 'API Integration', href: '#features' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press Kit', href: '#press' },
      { name: 'Contact', href: '#contact' }
    ],
    resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'Help Center', href: '#help' },
      { name: 'AI Guides', href: '#guides' },
      { name: 'Case Studies', href: '#cases' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR Compliance', href: '#gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-500' },
    { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-300' }
  ];

  const contactInfo = [
    { icon: Mail, text: 'hello@largify.ai', href: 'mailto:hello@largify.ai' },
    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, text: 'San Francisco, CA', href: '#' }
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  BD SaaS
                </span>
              </div>
              
              <p className="text-slate-400 mb-6 leading-relaxed">
                Empowering businesses with AI-driven solutions for intelligent lead generation, automated workflows, and accelerated growth.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {contactInfo.map((contact, index) => {
                  const IconComponent = contact.icon;
                  return (
                    <a
                      key={index}
                      href={contact.href}
                      className="flex items-center text-slate-400 hover:text-violet-300 transition-colors duration-300 group"
                    >
                      <IconComponent className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm">{contact.text}</span>
                    </a>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-400 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-slate-700/50 border border-slate-700/50 hover:border-violet-500/30`}
                      aria-label={social.name}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Product Links */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                    Product
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.product.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-400 hover:text-violet-300 transition-colors duration-300 text-sm flex items-center group"
                        >
                          <span>{link.name}</span>
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Links */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                    Company
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-400 hover:text-violet-300 transition-colors duration-300 text-sm flex items-center group"
                        >
                          <span>{link.name}</span>
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources Links */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                    Resources
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-400 hover:text-violet-300 transition-colors duration-300 text-sm flex items-center group"
                        >
                          <span>{link.name}</span>
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Links */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                    Legal
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-400 hover:text-violet-300 transition-colors duration-300 text-sm flex items-center group"
                        >
                          <span>{link.name}</span>
                          <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-slate-800/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-white font-semibold mb-2">
                Stay Updated with AI Insights
              </h3>
              <p className="text-slate-400 text-sm">
                Get the latest AI business development tips and product updates
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 min-w-[280px]"
              />
              <button className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-violet-500/50 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span>© {currentYear} BD SaaS. All rights reserved.</span>
              <div className="hidden md:flex items-center space-x-1">
                <span>Powered by</span>
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-medium">
                  Advanced AI
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <a
                href="#"
                className="text-slate-400 hover:text-violet-300 transition-colors duration-300"
              >
                Status Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;