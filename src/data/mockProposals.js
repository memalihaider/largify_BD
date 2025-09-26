// Mock data for proposals
export const mockProposals = [
  {
    id: 1,
    title: "E-commerce Platform Development",
    clientName: "TechCorp Solutions",
    industry: "Technology",
    creationDate: "2024-01-15",
    status: "Sent",
    budget: "$50,000 - $75,000",
    deadline: "2024-04-15",
    projectScope: "Complete e-commerce platform with payment integration, inventory management, and customer portal.",
    content: {
      introduction: "We are excited to present this comprehensive proposal for developing a modern e-commerce platform that will transform your online business presence.",
      objectives: [
        "Create a scalable e-commerce platform",
        "Implement secure payment processing",
        "Develop inventory management system",
        "Build customer portal and dashboard"
      ],
      deliverables: [
        "Responsive web application",
        "Admin dashboard",
        "Payment gateway integration",
        "Inventory management system",
        "Customer portal",
        "Documentation and training"
      ],
      timeline: [
        { phase: "Planning & Design", duration: "2 weeks", startDate: "2024-01-15", endDate: "2024-01-29" },
        { phase: "Frontend Development", duration: "4 weeks", startDate: "2024-01-30", endDate: "2024-02-26" },
        { phase: "Backend Development", duration: "4 weeks", startDate: "2024-02-27", endDate: "2024-03-26" },
        { phase: "Testing & Deployment", duration: "2 weeks", startDate: "2024-03-27", endDate: "2024-04-09" },
        { phase: "Training & Handover", duration: "1 week", startDate: "2024-04-10", endDate: "2024-04-15" }
      ],
      pricing: [
        { item: "Frontend Development", cost: "$20,000", description: "React-based responsive interface" },
        { item: "Backend Development", cost: "$25,000", description: "Node.js API with database integration" },
        { item: "Payment Integration", cost: "$8,000", description: "Stripe and PayPal integration" },
        { item: "Testing & QA", cost: "$7,000", description: "Comprehensive testing suite" },
        { item: "Deployment & Setup", cost: "$5,000", description: "Cloud deployment and configuration" }
      ],
      closingNotes: "We look forward to partnering with you on this exciting project. Our team is committed to delivering exceptional results within the specified timeline and budget."
    }
  },
  {
    id: 2,
    title: "Mobile App Development",
    clientName: "HealthTech Innovations",
    industry: "Healthcare",
    creationDate: "2024-01-20",
    status: "Draft",
    budget: "$30,000 - $45,000",
    deadline: "2024-05-01",
    projectScope: "Cross-platform mobile application for patient management and telemedicine consultations.",
    content: {
      introduction: "This proposal outlines the development of a comprehensive mobile health application designed to streamline patient care and enable remote consultations.",
      objectives: [
        "Develop cross-platform mobile application",
        "Implement telemedicine features",
        "Create patient management system",
        "Ensure HIPAA compliance"
      ],
      deliverables: [
        "iOS and Android applications",
        "Patient portal",
        "Doctor dashboard",
        "Video consultation system",
        "Appointment scheduling",
        "Medical records management"
      ],
      timeline: [
        { phase: "Requirements & Design", duration: "2 weeks", startDate: "2024-01-20", endDate: "2024-02-02" },
        { phase: "Mobile App Development", duration: "6 weeks", startDate: "2024-02-03", endDate: "2024-03-15" },
        { phase: "Backend & API Development", duration: "4 weeks", startDate: "2024-03-16", endDate: "2024-04-12" },
        { phase: "Testing & Compliance", duration: "2 weeks", startDate: "2024-04-13", endDate: "2024-04-26" },
        { phase: "Deployment & Training", duration: "1 week", startDate: "2024-04-27", endDate: "2024-05-01" }
      ],
      pricing: [
        { item: "Mobile App Development", cost: "$25,000", description: "React Native cross-platform app" },
        { item: "Backend Development", cost: "$12,000", description: "HIPAA-compliant API and database" },
        { item: "Video Integration", cost: "$5,000", description: "WebRTC-based video consultation" },
        { item: "Testing & Compliance", cost: "$3,000", description: "Security and compliance testing" }
      ],
      closingNotes: "Our team has extensive experience in healthcare technology and HIPAA compliance. We're committed to delivering a secure and user-friendly solution."
    }
  },
  {
    id: 3,
    title: "Digital Marketing Campaign",
    clientName: "GreenEarth Organics",
    industry: "Retail",
    creationDate: "2024-01-25",
    status: "Accepted",
    budget: "$15,000 - $25,000",
    deadline: "2024-03-30",
    projectScope: "Comprehensive digital marketing strategy including social media, content marketing, and SEO optimization.",
    content: {
      introduction: "We propose a comprehensive digital marketing strategy to increase your online presence and drive organic growth for GreenEarth Organics.",
      objectives: [
        "Increase brand awareness by 150%",
        "Improve website traffic by 200%",
        "Generate 500+ qualified leads",
        "Boost social media engagement by 300%"
      ],
      deliverables: [
        "SEO optimization strategy",
        "Social media content calendar",
        "Blog content creation (20 articles)",
        "Email marketing campaigns",
        "Performance analytics dashboard",
        "Monthly progress reports"
      ],
      timeline: [
        { phase: "Strategy Development", duration: "1 week", startDate: "2024-01-25", endDate: "2024-01-31" },
        { phase: "Content Creation", duration: "4 weeks", startDate: "2024-02-01", endDate: "2024-02-28" },
        { phase: "Campaign Launch", duration: "6 weeks", startDate: "2024-03-01", endDate: "2024-03-15" },
        { phase: "Optimization & Reporting", duration: "2 weeks", startDate: "2024-03-16", endDate: "2024-03-30" }
      ],
      pricing: [
        { item: "SEO Strategy & Implementation", cost: "$8,000", description: "Keyword research and on-page optimization" },
        { item: "Content Creation", cost: "$6,000", description: "Blog posts, social media content" },
        { item: "Social Media Management", cost: "$4,000", description: "Daily posting and engagement" },
        { item: "Analytics & Reporting", cost: "$2,000", description: "Monthly performance reports" }
      ],
      closingNotes: "We're excited to help GreenEarth Organics achieve its digital marketing goals and establish a strong online presence in the organic retail market."
    }
  },
  {
    id: 4,
    title: "Data Analytics Platform",
    clientName: "Financial Insights Ltd",
    industry: "Finance",
    creationDate: "2024-02-01",
    status: "Draft",
    budget: "$80,000 - $120,000",
    deadline: "2024-07-15",
    projectScope: "Advanced data analytics platform with real-time reporting, predictive modeling, and interactive dashboards.",
    content: {
      introduction: "This proposal presents a comprehensive data analytics platform designed to transform your financial data into actionable business insights.",
      objectives: [
        "Build scalable data processing pipeline",
        "Implement real-time analytics",
        "Create predictive modeling capabilities",
        "Develop interactive dashboards"
      ],
      deliverables: [
        "Data ingestion pipeline",
        "Real-time processing engine",
        "Machine learning models",
        "Interactive dashboard suite",
        "API for data access",
        "Documentation and training materials"
      ],
      timeline: [
        { phase: "Architecture & Planning", duration: "3 weeks", startDate: "2024-02-01", endDate: "2024-02-21" },
        { phase: "Data Pipeline Development", duration: "6 weeks", startDate: "2024-02-22", endDate: "2024-04-04" },
        { phase: "Analytics Engine", duration: "8 weeks", startDate: "2024-04-05", endDate: "2024-05-30" },
        { phase: "Dashboard Development", duration: "4 weeks", startDate: "2024-05-31", endDate: "2024-06-27" },
        { phase: "Testing & Deployment", duration: "3 weeks", startDate: "2024-06-28", endDate: "2024-07-15" }
      ],
      pricing: [
        { item: "Data Pipeline Architecture", cost: "$30,000", description: "Scalable data ingestion and processing" },
        { item: "Analytics Engine", cost: "$40,000", description: "Real-time processing and ML models" },
        { item: "Dashboard Development", cost: "$25,000", description: "Interactive visualization suite" },
        { item: "Integration & Testing", cost: "$15,000", description: "System integration and QA" },
        { item: "Training & Documentation", cost: "$10,000", description: "User training and technical docs" }
      ],
      closingNotes: "Our team brings deep expertise in financial data analytics and cutting-edge technology to deliver a platform that will drive your business forward."
    }
  },
  {
    id: 5,
    title: "Brand Identity Redesign",
    clientName: "Artisan Coffee Co.",
    industry: "Food & Beverage",
    creationDate: "2024-02-05",
    status: "Sent",
    budget: "$10,000 - $18,000",
    deadline: "2024-04-01",
    projectScope: "Complete brand identity redesign including logo, color palette, typography, and marketing materials.",
    content: {
      introduction: "We're thrilled to propose a comprehensive brand identity redesign that will elevate Artisan Coffee Co.'s visual presence and market positioning.",
      objectives: [
        "Create modern, memorable brand identity",
        "Develop cohesive visual language",
        "Design marketing collateral suite",
        "Establish brand guidelines"
      ],
      deliverables: [
        "New logo design (3 concepts)",
        "Color palette and typography system",
        "Business card and letterhead design",
        "Marketing brochure templates",
        "Social media template kit",
        "Brand guidelines document"
      ],
      timeline: [
        { phase: "Brand Discovery", duration: "1 week", startDate: "2024-02-05", endDate: "2024-02-11" },
        { phase: "Concept Development", duration: "2 weeks", startDate: "2024-02-12", endDate: "2024-02-25" },
        { phase: "Design Refinement", duration: "3 weeks", startDate: "2024-02-26", endDate: "2024-03-18" },
        { phase: "Collateral Creation", duration: "2 weeks", startDate: "2024-03-19", endDate: "2024-04-01" }
      ],
      pricing: [
        { item: "Logo Design & Branding", cost: "$8,000", description: "Logo concepts and brand identity" },
        { item: "Marketing Collateral", cost: "$5,000", description: "Business cards, brochures, templates" },
        { item: "Brand Guidelines", cost: "$2,000", description: "Comprehensive brand usage guide" },
        { item: "Revisions & Finalization", cost: "$1,000", description: "Final adjustments and file delivery" }
      ],
      closingNotes: "We're passionate about creating brand identities that resonate with customers and drive business growth. Let's brew something amazing together!"
    }
  }
];

// Industry options for the form
export const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Real Estate",
  "Food & Beverage",
  "Entertainment",
  "Consulting",
  "Non-profit",
  "Government",
  "Other"
];

// Sample proposal templates
export const proposalTemplates = {
  technology: {
    introduction: "We are excited to present this comprehensive technology solution proposal that will transform your digital infrastructure and drive innovation.",
    objectives: [
      "Implement cutting-edge technology solutions",
      "Improve operational efficiency",
      "Enhance user experience",
      "Ensure scalability and security"
    ],
    deliverables: [
      "Custom software development",
      "System integration",
      "User training and documentation",
      "Ongoing support and maintenance"
    ],
    closingNotes: "Our team brings extensive experience in technology solutions and is committed to delivering exceptional results that exceed your expectations."
  },
  healthcare: {
    introduction: "This proposal outlines a comprehensive healthcare solution designed to improve patient outcomes and streamline clinical workflows.",
    objectives: [
      "Enhance patient care quality",
      "Improve clinical efficiency",
      "Ensure regulatory compliance",
      "Reduce operational costs"
    ],
    deliverables: [
      "HIPAA-compliant system",
      "Clinical workflow optimization",
      "Staff training programs",
      "Compliance documentation"
    ],
    closingNotes: "We understand the critical nature of healthcare technology and are committed to delivering solutions that prioritize patient safety and care quality."
  },
  finance: {
    introduction: "We propose a robust financial solution that will enhance your organization's financial management capabilities and regulatory compliance.",
    objectives: [
      "Improve financial reporting accuracy",
      "Enhance risk management",
      "Ensure regulatory compliance",
      "Optimize financial processes"
    ],
    deliverables: [
      "Financial management system",
      "Risk assessment tools",
      "Compliance reporting",
      "Process optimization"
    ],
    closingNotes: "Our financial expertise and technology solutions will help your organization achieve its financial goals while maintaining the highest standards of compliance and security."
  }
};