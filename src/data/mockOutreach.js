// Mock data for outreach templates, contacts, and scheduled outreach
export const outreachTemplates = [
  // Email Templates
  {
    id: 1,
    name: "Cold Email - Introduction",
    type: "Email",
    category: "Cold Outreach",
    subject: "Quick question about {{company_name}}'s growth goals",
    content: `Hi {{first_name}},

I hope this email finds you well. I came across {{company_name}} and was impressed by your recent {{recent_achievement}}.

I'm reaching out because I help companies like yours {{value_proposition}}. We've helped similar businesses achieve {{specific_result}}.

Would you be open to a brief 15-minute call this week to discuss how we might be able to help {{company_name}} achieve similar results?

Best regards,
{{sender_name}}`,
    variables: ["first_name", "company_name", "recent_achievement", "value_proposition", "specific_result", "sender_name"],
    createdBy: "John Smith",
    createdAt: "2024-01-15",
    lastUsed: "2024-01-20",
    usageCount: 45
  },
  {
    id: 2,
    name: "Follow-up Email - After Demo",
    type: "Email",
    category: "Follow-up",
    subject: "Thanks for your time today - Next steps for {{company_name}}",
    content: `Hi {{first_name}},

Thank you for taking the time to speak with me today about {{company_name}}'s {{discussed_topic}}.

As discussed, I'm attaching the {{resource_type}} that shows how we've helped companies like yours achieve {{specific_benefit}}.

Based on our conversation, I believe our {{solution_name}} would be particularly valuable for addressing your {{pain_point}}.

Would you like to schedule a follow-up call next week to discuss implementation details?

Best regards,
{{sender_name}}`,
    variables: ["first_name", "company_name", "discussed_topic", "resource_type", "specific_benefit", "solution_name", "pain_point", "sender_name"],
    createdBy: "Sarah Wilson",
    createdAt: "2024-01-12",
    lastUsed: "2024-01-19",
    usageCount: 32
  },
  {
    id: 3,
    name: "Proposal Follow-up",
    type: "Email",
    category: "Follow-up",
    subject: "Proposal for {{company_name}} - Any questions?",
    content: `Hi {{first_name}},

I wanted to follow up on the proposal I sent over for {{company_name}} last week.

The proposal outlines how we can help you {{main_objective}} within {{timeframe}}, potentially saving you {{cost_savings}} annually.

Do you have any questions about the proposal? I'd be happy to jump on a quick call to address any concerns.

Looking forward to hearing from you.

Best regards,
{{sender_name}}`,
    variables: ["first_name", "company_name", "main_objective", "timeframe", "cost_savings", "sender_name"],
    createdBy: "Mike Brown",
    createdAt: "2024-01-10",
    lastUsed: "2024-01-18",
    usageCount: 28
  },

  // LinkedIn Templates
  {
    id: 4,
    name: "LinkedIn Connection Request",
    type: "LinkedIn",
    category: "Connection",
    subject: "",
    content: `Hi {{first_name}},

I noticed we both work in {{industry}} and thought it would be great to connect. I'm particularly interested in your work at {{company_name}} with {{specific_area}}.

Would love to connect and potentially share insights about {{mutual_interest}}.

Best,
{{sender_name}}`,
    variables: ["first_name", "industry", "company_name", "specific_area", "mutual_interest", "sender_name"],
    createdBy: "Jane Doe",
    createdAt: "2024-01-14",
    lastUsed: "2024-01-21",
    usageCount: 67
  },
  {
    id: 5,
    name: "LinkedIn Follow-up Message",
    type: "LinkedIn",
    category: "Follow-up",
    subject: "",
    content: `Hi {{first_name}},

Thanks for connecting! I see you're working on {{current_project}} at {{company_name}}. 

I've been helping companies in {{industry}} with similar challenges, particularly around {{specific_challenge}}.

Would you be interested in a brief call to discuss how we might be able to support {{company_name}}'s goals?

Best regards,
{{sender_name}}`,
    variables: ["first_name", "current_project", "company_name", "industry", "specific_challenge", "sender_name"],
    createdBy: "John Smith",
    createdAt: "2024-01-13",
    lastUsed: "2024-01-20",
    usageCount: 41
  },

  // WhatsApp Templates
  {
    id: 6,
    name: "WhatsApp Introduction",
    type: "WhatsApp",
    category: "Introduction",
    subject: "",
    content: `Hi {{first_name}}! 👋

Hope you're doing well. I got your number from {{referral_source}}.

I help businesses like {{company_name}} with {{service_area}}. We've helped similar companies achieve {{result_metric}}.

Would you be interested in a quick 10-minute call to see if we can help you too?

Thanks!
{{sender_name}}`,
    variables: ["first_name", "referral_source", "company_name", "service_area", "result_metric", "sender_name"],
    createdBy: "Sarah Wilson",
    createdAt: "2024-01-11",
    lastUsed: "2024-01-19",
    usageCount: 23
  },
  {
    id: 7,
    name: "WhatsApp Follow-up",
    type: "WhatsApp",
    category: "Follow-up",
    subject: "",
    content: `Hi {{first_name}}! 

Following up on our conversation about {{discussed_topic}}.

I've prepared a quick {{resource_type}} that shows exactly how we can help {{company_name}} with {{specific_need}}.

When would be a good time for a brief call this week?

Best,
{{sender_name}}`,
    variables: ["first_name", "discussed_topic", "resource_type", "company_name", "specific_need", "sender_name"],
    createdBy: "Mike Brown",
    createdAt: "2024-01-09",
    lastUsed: "2024-01-17",
    usageCount: 19
  }
];

// Template categories for filtering
export const templateCategories = [
  { value: "Cold Outreach", label: "Cold Outreach" },
  { value: "Follow-up", label: "Follow-up" },
  { value: "Introduction", label: "Introduction" },
  { value: "Connection", label: "Connection" },
  { value: "Proposal", label: "Proposal" },
  { value: "Meeting", label: "Meeting" }
];

// Template types
export const templateTypes = [
  { value: "Email", label: "Email", icon: "Mail" },
  { value: "LinkedIn", label: "LinkedIn", icon: "Linkedin" },
  { value: "WhatsApp", label: "WhatsApp", icon: "MessageCircle" }
];

// Mock scheduled outreach data
export const scheduledOutreach = [
  {
    id: 1,
    contactName: "Sarah Johnson",
    contactEmail: "sarah.johnson@techcorp.com",
    templateId: 1,
    templateName: "Cold Email - Introduction",
    templateType: "Email",
    scheduledDate: "2024-01-25",
    scheduledTime: "09:00",
    status: "Pending",
    assignedTo: "John Smith",
    createdAt: "2024-01-22",
    notes: "Follow up after their product launch announcement"
  },
  {
    id: 2,
    contactName: "Michael Chen",
    contactEmail: "m.chen@innovatetech.com",
    templateId: 2,
    templateName: "Follow-up Email - After Demo",
    templateType: "Email",
    scheduledDate: "2024-01-24",
    scheduledTime: "14:30",
    status: "Sent",
    assignedTo: "Sarah Wilson",
    createdAt: "2024-01-20",
    sentAt: "2024-01-24T14:30:00Z",
    notes: "Demo went well, they're interested in enterprise package"
  },
  {
    id: 3,
    contactName: "Emily Rodriguez",
    contactEmail: "emily.r@startupventures.com",
    templateId: 4,
    templateName: "LinkedIn Connection Request",
    templateType: "LinkedIn",
    scheduledDate: "2024-01-26",
    scheduledTime: "11:00",
    status: "Pending",
    assignedTo: "Jane Doe",
    createdAt: "2024-01-23",
    notes: "Met at industry conference, good connection opportunity"
  },
  {
    id: 4,
    contactName: "David Thompson",
    contactEmail: "david.thompson@globalcorp.com",
    templateId: 3,
    templateName: "Proposal Follow-up",
    templateType: "Email",
    scheduledDate: "2024-01-23",
    scheduledTime: "10:00",
    status: "Sent",
    assignedTo: "Mike Brown",
    createdAt: "2024-01-18",
    sentAt: "2024-01-23T10:00:00Z",
    notes: "Proposal sent last week, following up on decision timeline"
  },
  {
    id: 5,
    contactName: "Lisa Wang",
    contactEmail: "lisa.wang@digitalagency.com",
    templateId: 6,
    templateName: "WhatsApp Introduction",
    templateType: "WhatsApp",
    scheduledDate: "2024-01-27",
    scheduledTime: "16:00",
    status: "Pending",
    assignedTo: "Sarah Wilson",
    createdAt: "2024-01-24",
    notes: "Referral from existing client, warm lead"
  },
  {
    id: 6,
    contactName: "Robert Martinez",
    contactEmail: "r.martinez@consulting.com",
    templateId: 5,
    templateName: "LinkedIn Follow-up Message",
    templateType: "LinkedIn",
    scheduledDate: "2024-01-25",
    scheduledTime: "13:00",
    status: "Pending",
    assignedTo: "John Smith",
    createdAt: "2024-01-22",
    notes: "Connected last week, ready for follow-up message"
  }
];

// Outreach status options
export const outreachStatuses = [
  { value: "Pending", label: "Pending", color: "bg-yellow-500" },
  { value: "Sent", label: "Sent", color: "bg-green-500" },
  { value: "Failed", label: "Failed", color: "bg-red-500" },
  { value: "Scheduled", label: "Scheduled", color: "bg-blue-500" }
];

// Helper functions
export const getTemplatesByType = (type) => {
  return outreachTemplates.filter(template => template.type === type);
};

export const getTemplatesByCategory = (category) => {
  return outreachTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id) => {
  return outreachTemplates.find(template => template.id === parseInt(id));
};

export const getScheduledOutreachByStatus = (status) => {
  return scheduledOutreach.filter(outreach => outreach.status === status);
};

export const getScheduledOutreachByAssignee = (assignee) => {
  return scheduledOutreach.filter(outreach => outreach.assignedTo === assignee);
};

export const searchTemplates = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return outreachTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.content.toLowerCase().includes(lowercaseQuery) ||
    template.category.toLowerCase().includes(lowercaseQuery) ||
    template.type.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchScheduledOutreach = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return scheduledOutreach.filter(outreach => 
    outreach.contactName.toLowerCase().includes(lowercaseQuery) ||
    outreach.templateName.toLowerCase().includes(lowercaseQuery) ||
    outreach.notes.toLowerCase().includes(lowercaseQuery)
  );
};