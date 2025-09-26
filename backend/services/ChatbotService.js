const OpenAI = require('openai');

class ChatbotService {
  constructor() {
    // Configure for OpenRouter API
    this.openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || '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',
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5173', // Your site URL
        'X-Title': 'BD SaaS Platform', // Your app name
      }
    });
    
    this.applicationKnowledge = this.buildKnowledgeBase();
  }

  buildKnowledgeBase() {
    return {
      application: {
        name: "BD SaaS Platform",
        description: "A comprehensive business development SaaS platform with CRM, marketing, analytics, and team management capabilities",
        version: "1.0.0",
        type: "Business Development & CRM Platform"
      },
      
      features: {
        crm: {
          name: "Customer Relationship Management",
          description: "Complete CRM system for managing customer relationships, contacts, and interactions",
          capabilities: [
            "Contact management with detailed profiles",
            "Customer interaction tracking",
            "Lead conversion tracking",
            "Customer lifecycle management",
            "Communication history",
            "Custom fields and tags"
          ],
          access: "Team members and above"
        },
        
        leads: {
          name: "Lead Management",
          description: "Advanced lead generation, scoring, and nurturing system",
          capabilities: [
            "Lead capture from multiple sources",
            "Automated lead scoring based on behavior",
            "Lead qualification workflows",
            "Lead assignment and routing",
            "Follow-up automation",
            "Conversion tracking and analytics"
          ],
          access: "Team members and above"
        },
        
        marketing: {
          name: "Marketing Dashboard & Analytics",
          description: "Comprehensive marketing tools and analytics platform",
          capabilities: [
            "Marketing campaign management",
            "Competitor analysis and tracking",
            "SEO optimization tools",
            "Keyword research and suggestions",
            "Social media analytics",
            "Marketing ROI tracking",
            "Discount and promotion management",
            "Email marketing campaigns"
          ],
          access: "Team members and above"
        },
        
        analytics: {
          name: "Reports & Analytics",
          description: "Advanced analytics and reporting system",
          capabilities: [
            "Real-time dashboard metrics",
            "Custom report generation",
            "Subscription analytics",
            "Revenue tracking",
            "User behavior analytics",
            "Performance metrics",
            "Data visualization",
            "Export capabilities"
          ],
          access: "Admin and above"
        },
        
        support: {
          name: "Support System",
          description: "Integrated customer support and ticketing system",
          capabilities: [
            "Ticket creation and management",
            "Support chat functionality",
            "Knowledge base integration",
            "Escalation workflows",
            "Response time tracking",
            "Customer satisfaction surveys",
            "Multi-channel support"
          ],
          access: "All authenticated users"
        },
        
        teamManagement: {
          name: "Team Management",
          description: "Role-based team management and collaboration tools",
          capabilities: [
            "User role management (Super Admin, Admin, Team Member, Customer)",
            "Permission-based access control",
            "Team member onboarding",
            "Performance tracking",
            "Task assignment and tracking",
            "Meeting scheduling",
            "Collaboration tools"
          ],
          access: "Admin and above"
        },
        
        tasks: {
          name: "Task Management",
          description: "Project and task management system",
          capabilities: [
            "Task creation and assignment",
            "Priority and deadline management",
            "Progress tracking",
            "Team collaboration",
            "Notification system",
            "Calendar integration",
            "Reporting and analytics"
          ],
          access: "Team members and above"
        },
        
        proposals: {
          name: "Proposal Management",
          description: "Professional proposal creation and management system",
          capabilities: [
            "Template-based proposal creation",
            "Custom branding and styling",
            "Digital signatures",
            "Proposal tracking and analytics",
            "Client collaboration",
            "Version control",
            "Automated follow-ups"
          ],
          access: "Team members and above"
        },
        
        pipeline: {
          name: "Sales Pipeline",
          description: "Visual sales pipeline management",
          capabilities: [
            "Drag-and-drop pipeline stages",
            "Deal tracking and forecasting",
            "Probability scoring",
            "Revenue projections",
            "Activity logging",
            "Pipeline analytics",
            "Custom stage definitions"
          ],
          access: "Team members and above"
        },
        
        orders: {
          name: "Order Management",
          description: "E-commerce and order processing system",
          capabilities: [
            "Order creation and processing",
            "Inventory management",
            "Payment processing",
            "Shipping integration",
            "Order status tracking",
            "Customer order history",
            "Invoicing and billing"
          ],
          access: "Customers (own orders), Team members (all orders)"
        }
      },
      
      userRoles: {
        superadmin: {
          name: "Super Administrator",
          description: "Full system access with all administrative privileges",
          permissions: "Complete system control, user management, system configuration"
        },
        admin: {
          name: "Administrator", 
          description: "Administrative access to manage organization and users",
          permissions: "User management, reports, analytics, team management"
        },
        teammember: {
          name: "Team Member",
          description: "Standard business user with access to core features",
          permissions: "CRM, leads, marketing, tasks, proposals, pipeline, sales"
        },
        customer: {
          name: "Customer",
          description: "External customer with limited access to their own data",
          permissions: "Own orders, support tickets, subscription management"
        }
      },
      
      navigation: {
        dashboard: "Main overview with role-specific KPIs and metrics",
        leads: "Lead management and scoring system",
        contacts: "Contact database and relationship management", 
        crm: "Customer relationship management hub",
        tasks: "Task and project management",
        meetings: "Meeting scheduler and calendar integration",
        marketing: "Marketing dashboard and campaign management",
        proposals: "Proposal creation and management",
        pipeline: "Sales pipeline visualization",
        sales: "Sales and invoicing management",
        orders: "Order processing and management",
        support: "Customer support and ticketing",
        feedback: "Feedback collection and management",
        ideas: "Innovation and idea management",
        notes: "Personal notes and documentation",
        settings: "Account and system settings",
        reports: "Analytics and reporting (Admin only)",
        team: "Team management (Admin only)"
      },
      
      integrations: {
        email: "Email marketing and communication",
        calendar: "Meeting scheduling and calendar sync",
        payments: "Payment processing for orders",
        analytics: "Advanced analytics and tracking",
        notifications: "Real-time notifications system"
      }
    };
  }

  async generateResponse(userMessage, userRole = 'teammember', context = {}) {
    try {
      const systemPrompt = this.buildSystemPrompt(userRole, context);
      
      const completion = await this.openai.chat.completions.create({
        model: "openai/gpt-4o-mini", // OpenRouter model format
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: userMessage
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      return {
        success: true,
        response: completion.choices[0].message.content,
        usage: completion.usage
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      return {
        success: false,
        error: error.message,
        response: "I apologize, but I'm experiencing technical difficulties. Please try again later or contact support for assistance."
      };
    }
  }

  buildSystemPrompt(userRole, context) {
    const knowledge = JSON.stringify(this.applicationKnowledge, null, 2);
    
    return `You are an AI assistant for the BD SaaS Platform, a comprehensive business development and CRM system. You have extensive knowledge about this application and should provide helpful, accurate, and context-specific responses.

IMPORTANT GUIDELINES:
- Always maintain a professional, helpful, and friendly tone
- Provide specific, actionable information about the platform's features
- Reference actual features and capabilities from the knowledge base
- Adapt responses based on the user's role and permissions
- Suggest relevant features or workflows when appropriate
- If asked about features outside your knowledge, acknowledge limitations and suggest contacting support

USER CONTEXT:
- Current User Role: ${userRole}
- Page Context: ${context.currentPage || 'dashboard'}
- Additional Context: ${JSON.stringify(context)}

PLATFORM KNOWLEDGE BASE:
${knowledge}

RESPONSE REQUIREMENTS:
- Keep responses concise but informative (under 500 words typically)
- Use bullet points or numbered lists for clarity when listing features
- Include relevant navigation hints (e.g., "You can find this in the Marketing Dashboard")
- Mention role-based access restrictions when relevant
- Provide step-by-step guidance for common tasks
- Suggest related features that might be helpful

Remember: You are specifically designed to help users navigate and utilize the BD SaaS Platform effectively. Focus on platform-specific guidance and avoid generic business advice unless directly related to using the platform features.`;
  }

  // Get contextual suggestions based on current page
  getContextualSuggestions(currentPage, userRole) {
    const suggestions = {
      dashboard: [
        "How do I interpret the KPI metrics on my dashboard?",
        "What features are available for my role?",
        "How can I customize my dashboard view?"
      ],
      leads: [
        "How does the lead scoring system work?",
        "How do I convert a lead to a customer?",
        "What's the best way to organize my leads?"
      ],
      crm: [
        "How do I add a new customer to the CRM?",
        "How can I track customer interactions?",
        "What reports are available for customer data?"
      ],
      marketing: [
        "How do I create a marketing campaign?",
        "How does competitor analysis work?",
        "What SEO tools are available?"
      ],
      support: [
        "How do I create a support ticket?",
        "How can I track ticket status?",
        "What support channels are available?"
      ]
    };

    return suggestions[currentPage] || [
      "What features are available in this section?",
      "How do I get started with this feature?",
      "What are the best practices for using this tool?"
    ];
  }
}

module.exports = ChatbotService;