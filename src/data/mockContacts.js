// Mock data for contacts with comprehensive fields
export const mockContacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Solutions",
    status: "Hot",
    source: "Website",
    lastContacted: "2024-01-15",
    notes: "Interested in enterprise package. Follow up next week.",
    assignedTo: "John Smith",
    customerId: null, // For customer-specific contacts
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Michael Johnson",
    email: "michael.johnson@techcorp.com",
    phone: "+1 (555) 987-6543",
    company: "TechCorp Solutions",
    status: "Warm",
    source: "LinkedIn",
    lastContacted: "2024-01-12",
    notes: "Scheduled demo for next Tuesday. Very interested in automation features.",
    assignedTo: "Sarah Wilson",
    customerId: null,
    createdAt: "2024-01-12"
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@startupinc.com",
    phone: "+1 (555) 456-7890",
    company: "StartupInc",
    status: "Cold",
    source: "Website",
    lastContacted: "2024-01-08",
    notes: "Initial contact made. Needs more information about pricing.",
    assignedTo: "Mike Brown",
    customerId: null,
    createdAt: "2024-01-08"
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@consulting.com",
    phone: "+1 (555) 321-0987",
    company: "Wilson Consulting",
    status: "Hot",
    source: "Referral",
    lastContacted: "2024-01-14",
    notes: "Ready to sign contract. Waiting for final approval from board.",
    assignedTo: "John Smith",
    customerId: null,
    createdAt: "2024-01-14"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@marketing.com",
    phone: "+1 (555) 654-3210",
    company: "Anderson Marketing",
    status: "Warm",
    source: "Cold Call",
    lastContacted: "2024-01-11",
    notes: "Interested in marketing automation tools. Follow up in 2 weeks.",
    assignedTo: "Sarah Wilson",
    customerId: null,
    createdAt: "2024-01-11"
  },
  {
    id: 6,
    name: "Robert Taylor",
    email: "robert.taylor@finance.com",
    phone: "+1 (555) 789-0123",
    company: "Taylor Finance",
    status: "Cold",
    source: "Trade Show",
    lastContacted: "2024-01-09",
    notes: "Met at trade show. Expressed interest but budget concerns.",
    assignedTo: "Mike Brown",
    customerId: null,
    createdAt: "2024-01-09"
  },
  {
     id: 7,
     name: "Michael Chen",
     email: "m.chen@innovatetech.com",
     phone: "+1 (555) 234-5678",
     company: "InnovateTech",
     status: "Warm",
     source: "LinkedIn",
     lastContacted: "2024-01-12",
     notes: "Requested demo for Q2. Budget approved.",
     assignedTo: "Jane Doe",
     customerId: null,
     createdAt: "2024-01-08"
   },
   {
     id: 8,
     name: "David Thompson",
     email: "david.thompson@globalcorp.com",
     phone: "+1 (555) 456-7890",
     company: "Global Corp",
     status: "Hot",
     source: "Trade Show",
     lastContacted: "2024-01-14",
     notes: "Ready to sign contract. Waiting for final approval from board.",
     assignedTo: "Jane Doe",
     customerId: null,
     createdAt: "2024-01-02"
   },
   {
     id: 9,
     name: "Lisa Wang",
     email: "lisa.wang@digitalagency.com",
     phone: "+1 (555) 567-8901",
     company: "Digital Agency Pro",
     status: "Warm",
     source: "Google Ads",
     lastContacted: "2024-01-11",
     notes: "Comparing with competitors. Price sensitive.",
     assignedTo: "John Smith",
     customerId: null,
     createdAt: "2024-01-07"
   },
   {
     id: 10,
     name: "Robert Martinez",
     email: "r.martinez@consulting.com",
     phone: "+1 (555) 678-9012",
     company: "Martinez Consulting",
     status: "Cold",
     source: "Email Campaign",
     lastContacted: "2024-01-03",
     notes: "Not currently looking but interested for future.",
     assignedTo: "Jane Doe",
     customerId: null,
     createdAt: "2024-01-03"
   },
   {
     id: 11,
     name: "Amanda Foster",
     email: "amanda.foster@retailchain.com",
     phone: "+1 (555) 789-0123",
     company: "Retail Chain Inc",
     status: "Hot",
     source: "Website",
     lastContacted: "2024-01-13",
     notes: "Urgent need for implementation. Fast track opportunity.",
     assignedTo: "John Smith",
     customerId: null,
     createdAt: "2024-01-09"
   },
   {
     id: 12,
     name: "James Wilson",
     email: "james.wilson@manufacturing.com",
     phone: "+1 (555) 890-1234",
     company: "Wilson Manufacturing",
     status: "Warm",
     source: "Referral",
     lastContacted: "2024-01-10",
     notes: "Scheduled demo for next week. Positive initial response.",
     assignedTo: "Jane Doe",
     customerId: null,
     createdAt: "2024-01-06"
   },
   {
     id: 13,
     name: "Jennifer Lee",
     email: "jennifer.lee@healthtech.com",
     phone: "+1 (555) 901-2345",
     company: "HealthTech Solutions",
     status: "Cold",
     source: "LinkedIn",
     lastContacted: "2024-01-04",
     notes: "Initial outreach. No response yet.",
     assignedTo: "John Smith",
     customerId: null,
     createdAt: "2024-01-04"
   },
   {
     id: 14,
     name: "Christopher Brown",
     email: "chris.brown@financialservices.com",
     phone: "+1 (555) 012-3456",
     company: "Financial Services Group",
     status: "Hot",
     source: "Trade Show",
     lastContacted: "2024-01-16",
     notes: "Contract negotiations in progress. Very interested.",
     assignedTo: "Jane Doe",
     customerId: null,
     createdAt: "2024-01-01"
   }
];

// Contact status options
export const contactStatuses = [
  { value: "Hot", label: "Hot", color: "bg-red-500" },
  { value: "Warm", label: "Warm", color: "bg-yellow-500" },
  { value: "Cold", label: "Cold", color: "bg-blue-500" }
];

// Contact source options
export const contactSources = [
  { value: "Website", label: "Website" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Referral", label: "Referral" },
  { value: "Trade Show", label: "Trade Show" },
  { value: "Google Ads", label: "Google Ads" },
  { value: "Email Campaign", label: "Email Campaign" },
  { value: "Cold Call", label: "Cold Call" },
  { value: "Social Media", label: "Social Media" }
];

// Helper functions
export const getContactsByStatus = (status) => {
  return mockContacts.filter(contact => contact.status === status);
};

export const getContactById = (id) => {
  return mockContacts.find(contact => contact.id === parseInt(id));
};

export const getContactsByAssignee = (assignee) => {
  return mockContacts.filter(contact => contact.assignedTo === assignee);
};

export const searchContacts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(lowercaseQuery) ||
    contact.email.toLowerCase().includes(lowercaseQuery) ||
    contact.company.toLowerCase().includes(lowercaseQuery) ||
    contact.notes.toLowerCase().includes(lowercaseQuery)
  );
};