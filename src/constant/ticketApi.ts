const BASE_URL = '/api';

export const ticketApi = {
  getUsers: async () => {
    const response = await fetch(`${BASE_URL}/users`);
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

  createTicket: async (ticketData: any, attachment?: File | null) => {
    const formData = new FormData();
    
    // Add all ticket fields to FormData
    Object.keys(ticketData).forEach(key => {
      if (ticketData[key] !== null && ticketData[key] !== undefined) {
        formData.append(key, ticketData[key].toString());
      }
    });
    
    // Add attachment if provided
    if (attachment) {
      formData.append('attachment', attachment);
    }
    
    const response = await fetch(`${BASE_URL}/ticket`, {
      method: 'POST',
      body: formData, // Don't set Content-Type - browser will set it with boundary
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create ticket error:', errorText);
      throw new Error(`Failed to create ticket: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  updateTicket: async (ticketId: number, ticketData: any, attachment?: File | null) => {
    const formData = new FormData();
    
    // Add JSON data as a string
    formData.append('jsonData', JSON.stringify(ticketData));
    
    // Add attachment if provided
    if (attachment) {
      formData.append('attachment', attachment);
    }
    
    const response = await fetch(`${BASE_URL}/ticket/${ticketId}`, {
      method: 'PUT',
      body: formData, // Don't set Content-Type - browser will set it with boundary
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

  deleteAttachment: async (ticketId: number) => {
    const response = await fetch(`${BASE_URL}/ticket/${ticketId}/attachment`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete attachment: ${response.status} ${errorText}`);
    }
    return response.ok;
  },
};


export { BASE_URL };