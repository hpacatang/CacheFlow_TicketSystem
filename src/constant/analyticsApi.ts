import { BASE_URL } from './ticketApi';

export interface AnalyticsData {
  categories: Array<{ name: string; value: number }>;
  status: Array<{ name: string; value: number }>;
  priority: Array<{ name: string; value: number }>;
  total: Array<{ name: string; value: number }>;
  metrics: {
    ticketsResolved: number;
    averageResolutionTime: string;
    satisfactionRating: number;
  };
}

export interface Ticket {
  id: number;
  summary: string;
  userID: number;
  agentID: number;
  status: string;
  resolvedAt?: string | null;
  type: string;
  description: string;
  dueDate: string;
  priority: string;
  category: string;
  createdTime?: string | null;
  createdBy?: string | null;
  updatedTime?: string | null;
  updatedBy?: string | null;
  attachmentPath?: string | null;
  feedback?: Array<{
    id: number;
    ticketId: number;
    rating: number;
    comment?: string | null;
    feedbackDate?: string | null;
    status: string;
  }>;
}

// Helper function to calculate average resolution time
const calculateAverageResolutionTime = (tickets: Ticket[]): string => {
  const resolvedTickets = tickets.filter(ticket => 
    ticket.status.toLowerCase() === 'resolved' && 
    ticket.resolvedAt && 
    ticket.createdTime
  );

  if (resolvedTickets.length === 0) return '0h 0m';

  let totalMinutes = 0;
  resolvedTickets.forEach(ticket => {
    const createdTime = new Date(ticket.createdTime!);
    const resolvedTime = new Date(ticket.resolvedAt!);
    const diffMs = resolvedTime.getTime() - createdTime.getTime();
    totalMinutes += diffMs / (1000 * 60); // Convert to minutes
  });

  const avgMinutes = totalMinutes / resolvedTickets.length;
  const hours = Math.floor(avgMinutes / 60);
  const minutes = Math.round(avgMinutes % 60);
  
  return `${hours}h ${minutes}m`;
};

// Helper function to calculate satisfaction rating
const calculateSatisfactionRating = (tickets: Ticket[]): number => {
  const ticketsWithFeedback = tickets.filter(ticket => 
    ticket.feedback && ticket.feedback.length > 0
  );

  if (ticketsWithFeedback.length === 0) return 0;

  let totalRating = 0;
  let ratingCount = 0;

  ticketsWithFeedback.forEach(ticket => {
    ticket.feedback?.forEach(feedback => {
      totalRating += feedback.rating;
      ratingCount++;
    });
  });

  return ratingCount > 0 ? Math.round((totalRating / ratingCount) * 10) / 10 : 0;
};

// Helper function to process tickets into analytics data
const processTicketsForAnalytics = (tickets: Ticket[]): AnalyticsData => {
  // Process categories
  const categoryCount: { [key: string]: number } = {};
  tickets.forEach(ticket => {
    categoryCount[ticket.category] = (categoryCount[ticket.category] || 0) + 1;
  });
  const categories = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

  // Process status
  const statusCount: { [key: string]: number } = {};
  tickets.forEach(ticket => {
    const status = ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).toLowerCase();
    statusCount[status] = (statusCount[status] || 0) + 1;
  });
  const status = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  // Process priority
  const priorityCount: { [key: string]: number } = {};
  tickets.forEach(ticket => {
    const priority = ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1).toLowerCase();
    priorityCount[priority] = (priorityCount[priority] || 0) + 1;
  });
  const priority = Object.entries(priorityCount).map(([name, value]) => ({ name, value }));

  // Calculate total metrics
  const totalTickets = tickets.length;
  const closedTickets = tickets.filter(ticket => 
    ticket.status.toLowerCase() === 'resolved' || ticket.status.toLowerCase() === 'closed'
  ).length;
  const openTickets = totalTickets - closedTickets;

  const total = [
    { name: "Tickets created", value: totalTickets },
    { name: "Of them closed", value: closedTickets },
    { name: "Still open", value: openTickets }
  ];

  // Calculate metrics
  const ticketsResolved = tickets.filter(ticket => 
    ticket.status.toLowerCase() === 'resolved'
  ).length;
  
  const averageResolutionTime = calculateAverageResolutionTime(tickets);
  const satisfactionRating = calculateSatisfactionRating(tickets);

  return {
    categories,
    status,
    priority,
    total,
    metrics: {
      ticketsResolved,
      averageResolutionTime,
      satisfactionRating
    }
  };
};

export const analyticsApi = {
  getAnalyticsData: async (period: string = 'last30days'): Promise<AnalyticsData> => {
    try {
      // Fetch all tickets with feedback
      const response = await fetch(`${BASE_URL}/ticket/with-feedback/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const tickets: Ticket[] = await response.json();
      
      // Filter tickets based on period (optional enhancement)
      let filteredTickets = tickets;
      if (period !== 'all') {
        const now = new Date();
        let periodStart: Date;
        
        switch (period) {
          case 'last7days':
            periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'last24hours':
            periodStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'last30days':
          default:
            periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        }
        
        filteredTickets = tickets.filter(ticket => {
          if (!ticket.createdTime) return false;
          const ticketDate = new Date(ticket.createdTime);
          return ticketDate >= periodStart;
        });
      }
      
      return processTicketsForAnalytics(filteredTickets);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }
};