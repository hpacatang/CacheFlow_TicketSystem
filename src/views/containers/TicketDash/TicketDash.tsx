import React, { useState } from 'react';
import { UserSidebar } from '../../components/Sidebars/UserSidebar';
import SearchIcon from '@mui/icons-material/Search';
import './TicketDash.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, FormControl, Select, MenuItem } from '@mui/material';

const users = [
  { name: 'jamal', role: 'agent' },
  { name: 'kaye', role: 'agent' },
  { name: 'jhed', role: 'agent' },
  { name: 'yana', role: 'user' },
  { name: 'admin1', role: 'admin' }
];

const mockTickets = [
  {
    id: 1,
    summary: 'PC won’t boot',
    name: 'yana',
    assignee: 'jamal',
    status: 'open',
    resolvedAt: null,
    type: 'hardware',
  },
  {
    id: 2,
    summary: 'Windows issue',
    name: 'dona',
    assignee: 'kaye',
    status: 'resolved',
    resolvedAt: '2024-12-01',
    type: 'software',
  },
  {
    id: 3,
    summary: 'Slow net',
    name: 'james',
    assignee: 'jhed',
    status: 'inProgress',
    resolvedAt: null,
    type: 'hardware',
  }
];

export const TicketDash = () => {
  const loggedInUser = 'yana'; // test users

  type UserRole = 'user' | 'agent' | 'admin';
 const userRole = (users.find(u => u.name === loggedInUser)?.role || 'user') as UserRole;


  const [tickets, setTickets] = useState(mockTickets);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    summary: '',
    type: '',
    description: '',
    dueDate: '',
    priority: '',
    category: '',
    attachment: null as File | null,
  });

  const handleCreateTicketOpen = () => setIsCreateTicketOpen(true);
  const handleCreateTicketClose = () => setIsCreateTicketOpen(false);
  const handleNewTicketChange = (field: string, value: string | File | null) => {
    setNewTicket(prev => ({ ...prev, [field]: value }));
  };
  const handleCreateTicket = () => {
    // Add ticket creation logic here
    handleCreateTicketClose();
    setNewTicket({ summary: '', type: '', description: '', dueDate: '', priority: '', category: '', attachment: null });
  };

  const toggleFilter = (type: string) => {
    setActiveFilters(prev =>
      prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]
    );
  };

  const isActive = (type: string) => activeFilters.includes(type);

  const handleStatusChange = (id: number, newStatus: string) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === id ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const handleAssigneeChange = (id: number, newAssignee: string) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === id ? { ...ticket, assignee: newAssignee } : ticket
      )
    );
  };

  const visibleTickets = tickets.filter(ticket =>
    userRole === 'user' ? ticket.name === loggedInUser : true
  );

  const typeTicketCounts = ['hardware', 'software'].reduce((acc, type) => {
    acc[type] = visibleTickets.filter(ticket => ticket.type === type).length;
    return acc;
  }, {} as { [key: string]: number });

  const statusTicketCounts = ['open', 'inProgress', 'resolved', 'closed'].reduce((acc, status) => {
    acc[status] = visibleTickets.filter(ticket => ticket.status === status).length;
    return acc;
  }, {} as { [key: string]: number });

  const filteredTickets = visibleTickets.filter(ticket => {
    const matchesFilter =
      activeFilters.length === 0 ||
      activeFilters.includes(ticket.status) ||
      activeFilters.includes(ticket.type);

    const matchesSearch =
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className='parent-container'>
      <UserSidebar />

      <div className='filter-section'>
        <div className={`create-ticket-wrapper ${userRole === 'user' ? '' : 'hidden'}`}>
          <button className='create-btn' onClick={handleCreateTicketOpen}>Create Ticket</button>
        </div>

        <div className="search-wrapper">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-filter"
            placeholder="Search in All Tickets"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className='filter-list'>
          {['open', 'inProgress', 'resolved', 'closed'].map(status => (
            <button
              key={status}
              className={`filter-btn ${isActive(status) ? 'active' : ''}`}
              onClick={() => toggleFilter(status)}
              unselectable="on"
            >
              {status}
              <div className="counter-div">
                <span className="counter-value">{statusTicketCounts[status]}</span>
              </div>
            </button>
          ))}

          {['hardware', 'software'].map(type => (
            <button
              key={type}
              className={`filter-btn ${isActive(type) ? 'active' : ''}`}
              onClick={() => toggleFilter(type)}
              unselectable="on"
            >
              {type}
              <div className="counter-div">
                <span className="counter-value">{typeTicketCounts[type]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className='main-content'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Summary</th>
              <th>Name</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Resolved At</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.summary}</td>
                <td>{ticket.name}</td>
                <td className={`assignee-${ticket.assignee}`}>
                  {userRole === 'agent' || userRole === 'admin' ? (
                    <select
                      value={ticket.assignee}
                      onChange={(e) => handleAssigneeChange(ticket.id, e.target.value)}
                    >
                      {users
                        .filter(user => user.role === 'agent')
                        .map(agent => (
                          <option key={agent.name} value={agent.name}>
                            {agent.name}
                          </option>
                        ))}
                    </select>
                  ) : (
                    ticket.assignee
                  )}
                </td>
                <td className={`status-${ticket.status}`}>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                  >
                    {['open', 'inProgress', 'resolved', 'closed'].map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td>{ticket.resolvedAt || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create ticket modal */}
      <Dialog
        open={isCreateTicketOpen}
        onClose={handleCreateTicketClose}
        sx={{
          '& .MuiDialog-paper': {
            width: '800px',
            maxWidth: '95%',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Create Ticket
          <Button
            onClick={handleCreateTicketClose}
            sx={{
              minWidth: 'auto',
              padding: 0,
              color: 'black',
              fontSize: '16px',
              '&:hover': {
                color: 'red',
              },
            }}
          >
            ✕
          </Button>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ marginBottom: '2px' }}>
            Title
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            margin="dense"
            value={newTicket.summary}
            onChange={e => handleNewTicketChange('summary', e.target.value)}
            sx={{ borderRadius: '8px', marginBottom: '16px', '& .MuiOutlinedInput-root': { height: '40px' } }}
          />
          {/* Due date */}

          <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>
            Description
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            value={newTicket.description}
            onChange={e => handleNewTicketChange('description', e.target.value)}
            sx={{ borderRadius: '8px', marginBottom: '16px' }}
          />
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>
                Due Date
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                type="date"
                value={newTicket.dueDate || ''}
                onChange={e => handleNewTicketChange('dueDate', e.target.value)}
                sx={{ borderRadius: '8px', '& .MuiOutlinedInput-root': { height: '40px' } }}
                InputLabelProps={{ shrink: true }}
              />
            </div>

            {/* Priority */}
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>
                Priority
              </Typography>
              <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}>
                <Select
                  displayEmpty
                  value={newTicket.priority || ''}
                  onChange={e => handleNewTicketChange('priority', e.target.value)}
                  sx={{ borderRadius: '8px', height: '40px' }}
                >
                  <MenuItem value="" disabled>
                    <span style={{ color: 'gray' }}>Select Priority</span>
                  </MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Category */}
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>
                Category
              </Typography>
              <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}>
                <Select
                  displayEmpty
                  value={newTicket.category || ''}
                  onChange={e => handleNewTicketChange('category', e.target.value)}
                  sx={{ borderRadius: '8px', height: '40px' }}
                >
                  <MenuItem value="" disabled>
                    <span style={{ color: 'gray' }}>Select Category</span>
                  </MenuItem>
                  <MenuItem value="Hardware">Hardware</MenuItem>
                  <MenuItem value="Software">Software</MenuItem>
                  <MenuItem value="Network">Network</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Attachments */}
          <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>
            Attachments
          </Typography>
          <div
            style={{
              border: '2px dashed black',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '5px',
              backgroundColor: '#f9f9f9',
            }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              handleNewTicketChange('attachment', files[0] || null);
            }}
          >
            Drag and drop files here, or click to upload
            <input
              type="file"
              style={{ display: 'none' }}
              id="ticket-attachment-input"
              onChange={e => handleNewTicketChange('attachment', e.target.files ? e.target.files[0] : null)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCreateTicket}
            sx={{
              backgroundColor: '#1E90FF',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkblue',
              },
              display: 'block',
              margin: '0 auto',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              textTransform: 'none',
              marginBottom: '10px',
              fontSize: '16px',
            }}
          >
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
