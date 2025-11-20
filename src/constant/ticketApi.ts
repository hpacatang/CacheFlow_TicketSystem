const BASE_URL = '/api';

export const ticketApi = {
  getUsers: async () => {
    const response = await fetch(`${BASE_URL}/user`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },


  getTickets: async () => {
    const response = await fetch(`${BASE_URL}/ticket`);
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }
    return response.json();
  },

  createTicket: async (ticketData: any) => {
    const response = await fetch(`${BASE_URL}/ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create ticket error:', errorText);
      throw new Error(`Failed to create ticket: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  updateTicket: async (ticketId: number, ticketData: any) => {
    const response = await fetch(`${BASE_URL}/ticket/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update ticket error:', errorText);
      throw new Error(`Failed to update ticket: ${response.status} - ${errorText}`);
    }
    
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },

  deleteTicket: async (ticketId: number) => {
    const response = await fetch(`${BASE_URL}/ticket/${ticketId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete ticket: ${response.status} ${errorText}`);
    }
    return response.ok;
  },
};


export { BASE_URL };