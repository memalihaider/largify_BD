// Mock data for tickets and support functionality
const mockTickets = [
  {
    id: 'TKT-001',
    subject: 'Unable to access dashboard after login',
    description: 'I am experiencing issues accessing my dashboard after successfully logging in. The page loads but shows a blank screen. I have tried clearing my browser cache and using different browsers, but the issue persists. This is affecting my ability to manage my account and view important information.',
    status: 'open',
    priority: 'high',
    customer: {
      id: 'CUST-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatar: null
    },
    assignedTo: 'jane_smith',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:22:00Z',
    messages: [
      {
        id: 1,
        content: 'I am experiencing issues accessing my dashboard after successfully logging in. The page loads but shows a blank screen.',
        sender: {
          type: 'customer',
          name: 'John Smith',
          email: 'john.smith@example.com'
        },
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        content: 'Thank you for contacting support. I understand you\'re having trouble accessing your dashboard. Let me investigate this issue for you.',
        sender: {
          type: 'agent',
          name: 'Jane Smith',
          role: 'Support Agent'
        },
        timestamp: '2024-01-15T11:15:00Z',
        status: 'delivered'
      },
      {
        id: 3,
        content: 'I\'ve checked your account and noticed there might be a browser compatibility issue. Can you please try accessing the dashboard using Chrome or Firefox?',
        sender: {
          type: 'agent',
          name: 'Jane Smith',
          role: 'Support Agent'
        },
        timestamp: '2024-01-15T11:45:00Z',
        status: 'read'
      },
      {
        id: 4,
        content: 'I tried both Chrome and Firefox, but I\'m still seeing the same blank screen. The login works fine, but nothing loads after that.',
        sender: {
          type: 'customer',
          name: 'John Smith',
          email: 'john.smith@example.com'
        },
        timestamp: '2024-01-15T14:22:00Z'
      }
    ]
  },
  {
    id: 'TKT-002',
    subject: 'Billing discrepancy in monthly invoice',
    description: 'There appears to be an error in my latest monthly invoice. I was charged for features that I did not subscribe to. Could you please review my account and correct the billing?',
    status: 'pending',
    priority: 'medium',
    customer: {
      id: 'CUST-002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: null
    },
    assignedTo: 'mike_johnson',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
    messages: [
      {
        id: 1,
        content: 'There appears to be an error in my latest monthly invoice. I was charged for features that I did not subscribe to.',
        sender: {
          type: 'customer',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com'
        },
        timestamp: '2024-01-14T09:15:00Z'
      },
      {
        id: 2,
        content: 'I\'ll review your billing details and get back to you within 24 hours with a resolution.',
        sender: {
          type: 'agent',
          name: 'Mike Johnson',
          role: 'Billing Specialist'
        },
        timestamp: '2024-01-14T10:30:00Z',
        status: 'delivered'
      },
      {
        id: 3,
        content: 'I\'ve reviewed your account and found the discrepancy. We\'ll process a refund for the incorrect charges within 3-5 business days.',
        sender: {
          type: 'agent',
          name: 'Mike Johnson',
          role: 'Billing Specialist'
        },
        timestamp: '2024-01-14T16:30:00Z',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'TKT-003',
    subject: 'Feature request: Dark mode support',
    description: 'Would it be possible to add a dark mode option to the application? Many users would appreciate this feature for better usability during evening hours.',
    status: 'resolved',
    priority: 'low',
    customer: {
      id: 'CUST-003',
      name: 'Michael Chen',
      email: 'michael.chen@tech.com',
      avatar: null
    },
    assignedTo: 'john_doe',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-13T11:45:00Z',
    messages: [
      {
        id: 1,
        content: 'Would it be possible to add a dark mode option to the application? Many users would appreciate this feature.',
        sender: {
          type: 'customer',
          name: 'Michael Chen',
          email: 'michael.chen@tech.com'
        },
        timestamp: '2024-01-10T14:20:00Z'
      },
      {
        id: 2,
        content: 'Thank you for the suggestion! I\'ve forwarded this to our product team for consideration in future updates.',
        sender: {
          type: 'agent',
          name: 'John Doe',
          role: 'Product Support'
        },
        timestamp: '2024-01-11T09:30:00Z',
        status: 'delivered'
      },
      {
        id: 3,
        content: 'Great news! Dark mode has been implemented and is now available in the settings page. Please check it out!',
        sender: {
          type: 'agent',
          name: 'John Doe',
          role: 'Product Support'
        },
        timestamp: '2024-01-13T11:45:00Z',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'TKT-004',
    subject: 'Password reset not working',
    description: 'I\'ve been trying to reset my password using the forgot password link, but I\'m not receiving any reset emails. I\'ve checked my spam folder as well.',
    status: 'open',
    priority: 'urgent',
    customer: {
      id: 'CUST-004',
      name: 'Emily Davis',
      email: 'emily.davis@startup.io',
      avatar: null
    },
    assignedTo: null,
    createdAt: '2024-01-16T08:45:00Z',
    updatedAt: '2024-01-16T08:45:00Z',
    messages: [
      {
        id: 1,
        content: 'I\'ve been trying to reset my password using the forgot password link, but I\'m not receiving any reset emails.',
        sender: {
          type: 'customer',
          name: 'Emily Davis',
          email: 'emily.davis@startup.io'
        },
        timestamp: '2024-01-16T08:45:00Z'
      }
    ]
  },
  {
    id: 'TKT-005',
    subject: 'API integration documentation request',
    description: 'Could you provide more detailed documentation for the REST API endpoints? The current documentation is missing some important details about authentication and rate limiting.',
    status: 'pending',
    priority: 'medium',
    customer: {
      id: 'CUST-005',
      name: 'David Wilson',
      email: 'david.wilson@devteam.com',
      avatar: null
    },
    assignedTo: 'jane_smith',
    createdAt: '2024-01-12T16:30:00Z',
    updatedAt: '2024-01-15T10:15:00Z',
    messages: [
      {
        id: 1,
        content: 'Could you provide more detailed documentation for the REST API endpoints? The current documentation is missing authentication details.',
        sender: {
          type: 'customer',
          name: 'David Wilson',
          email: 'david.wilson@devteam.com'
        },
        timestamp: '2024-01-12T16:30:00Z'
      },
      {
        id: 2,
        content: 'I\'ll work with our technical writing team to update the API documentation. We should have improved docs available within the next week.',
        sender: {
          type: 'agent',
          name: 'Jane Smith',
          role: 'Technical Support'
        },
        timestamp: '2024-01-15T10:15:00Z',
        status: 'delivered'
      }
    ]
  }
];

// Mock agents data
const mockAgents = [
  { id: 'john_doe', name: 'John Doe', role: 'Senior Support Agent' },
  { id: 'jane_smith', name: 'Jane Smith', role: 'Technical Support Lead' },
  { id: 'mike_johnson', name: 'Mike Johnson', role: 'Billing Specialist' }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Support Service Functions
export const supportService = {
  // Get all tickets with optional filtering
  async getTickets(filters = {}) {
    await delay(500); // Simulate API call
    
    let filteredTickets = [...mockTickets];
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
    }
    
    if (filters.priority && filters.priority !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === filters.priority);
    }
    
    if (filters.assignedTo && filters.assignedTo !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.assignedTo === filters.assignedTo);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm) ||
        ticket.customer.name.toLowerCase().includes(searchTerm) ||
        ticket.customer.email.toLowerCase().includes(searchTerm)
      );
    }
    
    return {
      tickets: filteredTickets,
      total: filteredTickets.length
    };
  },

  // Get ticket by ID
  async getTicketById(ticketId) {
    await delay(300);
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  },

  // Get ticket statistics
  async getTicketStats() {
    await delay(200);
    
    const stats = {
      open: mockTickets.filter(t => t.status === 'open').length,
      pending: mockTickets.filter(t => t.status === 'pending').length,
      resolved: mockTickets.filter(t => t.status === 'resolved').length,
      total: mockTickets.length
    };
    
    return stats;
  },

  // Update ticket status
  async updateTicketStatus(ticketId, newStatus) {
    await delay(300);
    
    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }
    
    mockTickets[ticketIndex].status = newStatus;
    mockTickets[ticketIndex].updatedAt = new Date().toISOString();
    
    return mockTickets[ticketIndex];
  },

  // Update ticket assignment
  async updateTicketAssignment(ticketId, agentId) {
    await delay(300);
    
    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }
    
    mockTickets[ticketIndex].assignedTo = agentId === 'unassigned' ? null : agentId;
    mockTickets[ticketIndex].updatedAt = new Date().toISOString();
    
    return mockTickets[ticketIndex];
  },

  // Add reply to ticket
  async addReply(ticketId, content, attachments = []) {
    await delay(500);
    
    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }
    
    const newMessage = {
      id: mockTickets[ticketIndex].messages.length + 1,
      content,
      sender: {
        type: 'agent',
        name: 'Support Agent',
        role: 'Support Agent'
      },
      timestamp: new Date().toISOString(),
      status: 'delivered',
      attachments: attachments.map(file => ({
        name: file.name,
        size: `${Math.round(file.size / 1024)}KB`,
        type: file.type
      }))
    };
    
    mockTickets[ticketIndex].messages.push(newMessage);
    mockTickets[ticketIndex].updatedAt = new Date().toISOString();
    
    return newMessage;
  },

  // Get available agents
  async getAgents() {
    await delay(200);
    return mockAgents;
  },

  // Create new ticket (for testing)
  async createTicket(ticketData) {
    await delay(400);
    
    const newTicket = {
      id: `TKT-${String(mockTickets.length + 1).padStart(3, '0')}`,
      ...ticketData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{
        id: 1,
        content: ticketData.description,
        sender: {
          type: 'customer',
          name: ticketData.customer.name,
          email: ticketData.customer.email
        },
        timestamp: new Date().toISOString()
      }]
    };
    
    mockTickets.push(newTicket);
    return newTicket;
  }
};

// Named exports for individual functions
export const getTickets = supportService.getTickets;
export const getTicketStats = supportService.getTicketStats;
export const getTicketById = supportService.getTicketById;
export const updateTicketStatus = supportService.updateTicketStatus;
export const updateTicketAssignment = supportService.updateTicketAssignment;
export const addTicketMessage = supportService.addTicketMessage;
export const getAgents = supportService.getAgents;
export const createTicket = supportService.createTicket;

export default supportService;