import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Rocket, Star, MessageCircle } from 'lucide-react';
import { isAuthenticated } from '../utils/auth';

const Plans = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: "Monthly Plan",
      price: 3000,
      currency: "PKR",
      period: "month",
      description: "Perfect for getting started with core business features",
      features: [
        "Complete CRM System",
        "Lead Management & Scoring",
        "Contact Database Management",
        "Task & Project Management",
        "Basic Marketing Dashboard",
        "Email Support",
        "User Profile Management",
        "Mobile-Responsive Interface"
      ],
      popular: false,
      icon: Zap,
      gradient: "from-slate-600 to-slate-700",
      glowColor: "slate"
    },
    {
      name: "Annual Plan",
      price: 25000,
      currency: "PKR",
      period: "year",
      description: "Best value for comprehensive business growth",
      features: [
        "All Monthly Plan features",
        "Advanced Analytics & Reports",
        "Sales Pipeline Management",
        "Proposal Creation & Management",
        "Meeting Scheduler & Calendar",
        "Marketing Campaign Tools",
        "Social Media Analytics",
        "Order & Invoice Management",
        "AI-Powered Chatbot Assistant",
        "Priority Support"
      ],
      popular: true,
      icon: Rocket,
      gradient: "from-violet-600 to-cyan-500",
      glowColor: "violet",
      savings: "Save ₨11,000 annually"
    },
    {
      name: "Custom Plan",
      price: null,
      currency: "PKR",
      period: "custom",
      description: "Tailored solutions for enterprise requirements",
      features: [
        "All Annual Plan features",
        "Team Management & RBAC",
        "Advanced User Permissions",
        "Custom Integrations",
        "Subscription Analytics",
        "Feedback & Ideas Management",
        "Support Ticket System",
        "Custom Branding Options",
        "Dedicated Account Manager",
        "24/7 Premium Support"
      ],
      popular: false,
      icon: Crown,
      gradient: "from-amber-500 to-orange-600",
      glowColor: "amber",
      isCustom: true,
      whatsappNumber: "+966 59 736 9443"
    }
  ];

  const handleSelectPlan = (plan) => {
    if (plan.isCustom) {
      // Open WhatsApp for custom plan
      const whatsappUrl = `https://wa.me/${plan.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in the Custom Plan for BD SaaS. Please provide more details about additional features and pricing.`;
      window.open(whatsappUrl, '_blank');
    } else {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        // Show login prompt and redirect to login
        const shouldLogin = window.confirm('You need to login or signup before proceeding to checkout. Would you like to login now?');
        if (shouldLogin) {
          // Create serializable plan object without React components
          const serializablePlan = {
            name: plan.name,
            price: plan.price,
            currency: plan.currency,
            period: plan.period,
            description: plan.description,
            features: plan.features,
            popular: plan.popular,
            savings: plan.savings
          };
          navigate('/login', { state: { selectedPlan: serializablePlan, redirectTo: '/checkout' } });
        }
        return;
      }
      
      // User is authenticated, proceed to checkout
      // Create serializable plan object without React components
      const serializablePlan = {
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        period: plan.period,
        description: plan.description,
        features: plan.features,
        popular: plan.popular,
        savings: plan.savings
      };
      
      setSelectedPlan(serializablePlan);
      navigate('/checkout', { state: { selectedPlan: serializablePlan } });
    }
  };

  return (
    <section id="plans" className="py-24 bg-gradient-to-b from-slate-900 to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium backdrop-blur-sm mb-6">
            <Star className="w-4 h-4 mr-2" />
            Premium Subscription Plans
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            Unlock the full potential of BD SaaS with our comprehensive business development solutions
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            
            return (
              <div
                key={index}
                className={`group relative bg-slate-800/30 backdrop-blur-sm rounded-2xl border transition-all duration-500 hover:bg-slate-800/50 animate-fade-in-up ${
                  plan.popular 
                    ? 'border-violet-500/50 scale-105 shadow-2xl shadow-violet-500/20' 
                    : 'border-slate-700/50 hover:border-violet-500/30'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Best Value
                    </div>
                  </div>
                )}
                
                <div className={`relative p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                      {plan.description}
                    </p>
                    
                    <div className="mb-2">
                      <div className="flex items-baseline justify-center">
                        {plan.isCustom ? (
                          <span className="text-3xl font-bold text-white">
                            Contact Us
                          </span>
                        ) : (
                          <>
                            <span className="text-4xl font-bold text-white">
                              ₨{plan.price.toLocaleString()}
                            </span>
                            <span className="text-slate-400 text-lg ml-2">
                              /{plan.period}
                            </span>
                          </>
                        )}
                      </div>
                      {plan.savings && (
                        <p className="text-sm text-green-400 mt-1">
                          {plan.savings}
                        </p>
                      )}
                      {plan.isCustom && (
                        <p className="text-sm text-violet-400 mt-1">
                          Custom pricing available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-300 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center ${
                      plan.popular
                        ? 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white shadow-violet-500/50'
                        : plan.isCustom
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-500/50'
                        : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/50 hover:border-violet-500/50'
                    }`}
                  >
                    {plan.isCustom ? (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact on WhatsApp
                      </>
                    ) : plan.popular ? (
                      '🚀 Get Started'
                    ) : (
                      `Choose ${plan.name}`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Secure Web-Based Platform
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Instant Dashboard Access
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Role-Based User Management
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Mobile-Responsive Design
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;