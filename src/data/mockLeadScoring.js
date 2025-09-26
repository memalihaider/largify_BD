// Mock data for Lead Scoring functionality
export const mockLeadScoringData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Solutions",
    position: "Marketing Director",
    leadScore: 92,
    status: "Hot",
    assignedTo: "John Smith",
    assignedToId: 1,
    source: "Website Form",
    industry: "Technology",
    companySize: "201-500",
    budget: "$50,000 - $100,000",
    timeline: "Immediate",
    lastActivity: "2024-01-20T10:30:00Z",
    createdAt: "2024-01-15T09:00:00Z",
    scoringFactors: {
      engagement: 95,
      demographics: 88,
      behavior: 94,
      firmographics: 90
    },
    activities: [
      { type: "Email Opened", date: "2024-01-20T10:30:00Z" },
      { type: "Website Visit", date: "2024-01-19T14:20:00Z" },
      { type: "Downloaded Whitepaper", date: "2024-01-18T16:45:00Z" }
    ]
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@innovateplus.com",
    phone: "+1 (555) 234-5678",
    company: "InnovatePlus Inc",
    position: "CEO",
    leadScore: 88,
    status: "Hot",
    assignedTo: "Emily Davis",
    assignedToId: 2,
    source: "LinkedIn",
    industry: "Software",
    companySize: "51-200",
    budget: "$25,000 - $50,000",
    timeline: "1-3 months",
    lastActivity: "2024-01-19T15:45:00Z",
    createdAt: "2024-01-12T11:30:00Z",
    scoringFactors: {
      engagement: 85,
      demographics: 92,
      behavior: 87,
      firmographics: 88
    },
    activities: [
      { type: "Demo Requested", date: "2024-01-19T15:45:00Z" },
      { type: "Pricing Page Viewed", date: "2024-01-18T09:15:00Z" },
      { type: "Email Clicked", date: "2024-01-17T13:30:00Z" }
    ]
  },
  {
    id: 3,
    name: "Jennifer Rodriguez",
    email: "j.rodriguez@globaltech.com",
    phone: "+1 (555) 345-6789",
    company: "GlobalTech Systems",
    position: "VP of Operations",
    leadScore: 76,
    status: "Warm",
    assignedTo: "David Wilson",
    assignedToId: 3,
    source: "Webinar",
    industry: "Manufacturing",
    companySize: "501-1000",
    budget: "$100,000+",
    timeline: "3-6 months",
    lastActivity: "2024-01-18T12:20:00Z",
    createdAt: "2024-01-10T14:15:00Z",
    scoringFactors: {
      engagement: 72,
      demographics: 80,
      behavior: 75,
      firmographics: 78
    },
    activities: [
      { type: "Webinar Attended", date: "2024-01-18T12:20:00Z" },
      { type: "Case Study Downloaded", date: "2024-01-16T10:45:00Z" },
      { type: "Website Visit", date: "2024-01-15T16:30:00Z" }
    ]
  },
  {
    id: 4,
    name: "Robert Thompson",
    email: "robert.t@startupventure.com",
    phone: "+1 (555) 456-7890",
    company: "StartupVenture Co",
    position: "Founder",
    leadScore: 71,
    status: "Warm",
    assignedTo: "Sarah Miller",
    assignedToId: 4,
    source: "Google Ads",
    industry: "Startup",
    companySize: "1-50",
    budget: "$10,000 - $25,000",
    timeline: "6+ months",
    lastActivity: "2024-01-17T09:30:00Z",
    createdAt: "2024-01-08T16:45:00Z",
    scoringFactors: {
      engagement: 68,
      demographics: 75,
      behavior: 70,
      firmographics: 72
    },
    activities: [
      { type: "Blog Post Read", date: "2024-01-17T09:30:00Z" },
      { type: "Newsletter Subscribed", date: "2024-01-15T11:20:00Z" },
      { type: "Contact Form Submitted", date: "2024-01-08T16:45:00Z" }
    ]
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.wang@enterprisecorp.com",
    phone: "+1 (555) 567-8901",
    company: "Enterprise Corp",
    position: "IT Manager",
    leadScore: 65,
    status: "Warm",
    assignedTo: "John Smith",
    assignedToId: 1,
    source: "Referral",
    industry: "Enterprise",
    companySize: "1000+",
    budget: "$100,000+",
    timeline: "3-6 months",
    lastActivity: "2024-01-16T14:15:00Z",
    createdAt: "2024-01-05T10:30:00Z",
    scoringFactors: {
      engagement: 60,
      demographics: 70,
      behavior: 65,
      firmographics: 68
    },
    activities: [
      { type: "Email Opened", date: "2024-01-16T14:15:00Z" },
      { type: "Product Page Viewed", date: "2024-01-14T13:45:00Z" },
      { type: "Referral Received", date: "2024-01-05T10:30:00Z" }
    ]
  },
  {
    id: 6,
    name: "Alex Martinez",
    email: "alex.m@smallbiz.com",
    phone: "+1 (555) 678-9012",
    company: "SmallBiz Solutions",
    position: "Owner",
    leadScore: 45,
    status: "Cold",
    assignedTo: "Emily Davis",
    assignedToId: 2,
    source: "Cold Email",
    industry: "Consulting",
    companySize: "1-50",
    budget: "$5,000 - $10,000",
    timeline: "6+ months",
    lastActivity: "2024-01-14T11:00:00Z",
    createdAt: "2024-01-03T15:20:00Z",
    scoringFactors: {
      engagement: 40,
      demographics: 50,
      behavior: 45,
      firmographics: 45
    },
    activities: [
      { type: "Email Opened", date: "2024-01-14T11:00:00Z" },
      { type: "Website Visit", date: "2024-01-10T09:30:00Z" },
      { type: "Cold Email Sent", date: "2024-01-03T15:20:00Z" }
    ]
  },
  {
    id: 7,
    name: "Maria Garcia",
    email: "maria.garcia@retailchain.com",
    phone: "+1 (555) 789-0123",
    company: "RetailChain Inc",
    position: "Operations Manager",
    leadScore: 38,
    status: "Cold",
    assignedTo: "David Wilson",
    assignedToId: 3,
    source: "Trade Show",
    industry: "Retail",
    companySize: "201-500",
    budget: "$25,000 - $50,000",
    timeline: "6+ months",
    lastActivity: "2024-01-12T16:30:00Z",
    createdAt: "2024-01-01T12:00:00Z",
    scoringFactors: {
      engagement: 35,
      demographics: 42,
      behavior: 38,
      firmographics: 40
    },
    activities: [
      { type: "Business Card Collected", date: "2024-01-12T16:30:00Z" },
      { type: "Trade Show Meeting", date: "2024-01-01T12:00:00Z" }
    ]
  },
  {
    id: 8,
    name: "Kevin Brown",
    email: "k.brown@healthcareplus.com",
    phone: "+1 (555) 890-1234",
    company: "HealthcarePlus",
    position: "Director of Technology",
    leadScore: 82,
    status: "Hot",
    assignedTo: "Sarah Miller",
    assignedToId: 4,
    source: "Content Marketing",
    industry: "Healthcare",
    companySize: "501-1000",
    budget: "$75,000 - $100,000",
    timeline: "1-3 months",
    lastActivity: "2024-01-21T08:45:00Z",
    createdAt: "2024-01-14T13:30:00Z",
    scoringFactors: {
      engagement: 80,
      demographics: 85,
      behavior: 82,
      firmographics: 81
    },
    activities: [
      { type: "Free Trial Started", date: "2024-01-21T08:45:00Z" },
      { type: "Multiple Pages Viewed", date: "2024-01-20T14:20:00Z" },
      { type: "Ebook Downloaded", date: "2024-01-19T11:15:00Z" }
    ]
  }
];

// Mock team members for assignment
export const mockTeamMembers = [
  { id: 1, name: "John Smith", role: "Sales Manager" },
  { id: 2, name: "Emily Davis", role: "Account Executive" },
  { id: 3, name: "David Wilson", role: "Business Development Rep" },
  { id: 4, name: "Sarah Miller", role: "Senior Sales Rep" },
  { id: 5, name: "Mike Johnson", role: "Sales Director" }
];

// Lead scoring distribution data for charts
export const mockScoreDistribution = [
  { range: "0-20", count: 0, label: "Very Cold" },
  { range: "21-40", count: 2, label: "Cold" },
  { range: "41-60", count: 1, label: "Cool" },
  { range: "61-80", count: 3, label: "Warm" },
  { range: "81-100", count: 2, label: "Hot" }
];

// KPI data
export const mockKPIData = {
  totalLeads: mockLeadScoringData.length,
  highScoreLeads: mockLeadScoringData.filter(lead => lead.leadScore >= 80).length,
  conversionRate: 24.5, // percentage
  averageScore: Math.round(mockLeadScoringData.reduce((sum, lead) => sum + lead.leadScore, 0) / mockLeadScoringData.length)
};