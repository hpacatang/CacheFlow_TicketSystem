const BASE_URL_TICKETS = '/api';
const BASE_URL_USERS = 'http://localhost:3001';          

export const ticketApi = {
  getUsers: async () => {
    try {
      // Try C# backend first
      const response = await fetch(`${BASE_URL_TICKETS}/user`);
      if (response.ok) {
        const data = await response.json();
        // C# backend returns Pascal case - use as is
        return data;
      }
    } catch (error) {
      console.log('C# backend not available, falling back to JSON server');
    }
    
    // Fallback to JSON server
    const response = await fetch(`${BASE_URL_USERS}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    
    // Normalize JSON server data to match C# model (Pascal case)
    return data.map((user: any) => ({
      Id: user.id || user.Id,
      UserId: user.userId || user.UserId || '',
      Email: user.email || user.Email || '',
      Name: user.name || user.Name,
      Password: user.password || user.Password || '',
      Role: user.role || user.Role,
      Status: user.status || user.Status || 'Active',
      CreatedBy: user.createdBy || user.CreatedBy || '',
      CreatedTime: user.createdTime || user.CreatedTime,
      UpdatedBy: user.updatedBy || user.UpdatedBy || '',
      UpdatedTime: user.updatedTime || user.UpdatedTime,
    }));
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
      const errorText = await response.text();
      console.error('Create ticket error:', errorText);
      throw new Error(`Failed to create ticket: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  updateTicket: async (ticketId: number, ticketData: any) => {
    const response = await fetch(`${BASE_URL_TICKETS}/ticket/${ticketId}`, {
      method: 'PUT', // Changed to PUT to use the endpoint that supports all fields including assignee and status
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update ticket error:', errorText);
      throw new Error(`Failed to update ticket: ${response.status} - ${errorText}`);
    }
    
    // Handle 204 No Content or empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
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