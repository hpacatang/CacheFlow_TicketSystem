const BASE_URL_TICKETS = '/api';
const BASE_URL_USERS = 'http://localhost:3001';          

export const ticketApi = {
  getUsers: async () => {
    const response = await fetch(`${BASE_URL_USERS}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },


  getTickets: async () => {
    const response = await fetch(`${BASE_URL_TICKETS}/ticket`);
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }
    return response.json();
  },

  createTicket: async (ticketData: any) => {
    const response = await fetch(`${BASE_URL_TICKETS}/ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }
    return response.json();
  },

  updateTicket: async (ticketId: number, ticketData: any) => {
    const response = await fetch(`${BASE_URL_TICKETS}/ticket/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    if (!response.ok) {
      throw new Error('Failed to update ticket');
    }
    return response.json();
  },

  deleteTicket: async (ticketId: number) => {
    console.log('Making DELETE request to:', `${BASE_URL_TICKETS}/ticket/${ticketId}`);
    const response = await fetch(`${BASE_URL_TICKETS}/ticket/${ticketId}`, {
      method: 'DELETE',
    });
    console.log('DELETE response status:', response.status);
    console.log('DELETE response ok:', response.ok);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DELETE error response:', errorText);
      throw new Error(`Failed to delete ticket: ${response.status} ${errorText}`);
    }
    return response.ok;
  },
};


export { BASE_URL_TICKETS, BASE_URL_USERS };