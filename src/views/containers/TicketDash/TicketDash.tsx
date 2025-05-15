import React, { useEffect, useState } from 'react';
import { UserSidebar } from '../../components/Sidebars/UserSidebar';
import { AgentSidebar } from '../../components/Sidebars/AgentSidebar';
import { AdminSidebar } from '../../components/Sidebars/AdminSidebar';
import SearchIcon from '@mui/icons-material/Search';
import './TicketDash.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, FormControl, Select, MenuItem } from '@mui/material';

interface Ticket {
  id: number;
  summary: string;
  name: string;
  assignee: string;
  status: 'open' | 'inProgress' | 'resolved' | 'closed';
  resolvedAt: string | null;
  type: 'hardware' | 'software';
}

interface User {
  name: string;
  role: 'user' | 'agent' | 'admin' | 'superadmin';
}



export const TicketDash = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const loggedInUser = 'jamal'; //CHANGE USER HERE
  
  type UserRole = 'user' | 'agent' | 'admin' | 'superadmin';
  const userRole = (users.find(u => u.name === loggedInUser)?.role || 'user') as UserRole;
  
  
  
  //GETTER
  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error('Error fetching users:', err));

    fetch('http://localhost:3001/tickets')
      .then(res => res.json())
      .then(setTickets)
      .catch(err => console.error('Error fetching tickets:', err));
  }, []);

  //FILTERS
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

  //PATCHER + FITER
 const handleStatusChange = async (id: number, newStatus: Ticket['status']) => {
  const resolvedAt = (newStatus === 'resolved' || newStatus === 'closed') 
    ? new Date().toISOString() 
    : null;

  setTickets(prev =>
    prev.map(ticket =>
      ticket.id === id ? { ...ticket, status: newStatus, resolvedAt } : ticket
    )
  );

  try {
    await fetch(`http://localhost:3001/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, resolvedAt }),
    });
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};
const handleAssigneeChange = async (id: number, newAssignee: string) => {
  setTickets(prev =>
    prev.map(ticket =>
      ticket.id === id ? { ...ticket, assignee: newAssignee } : ticket
    )
  );

  try {
    await fetch(`http://localhost:3001/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignee: newAssignee }),
    });
  } catch (error) {
    console.error('Failed to update assignee:', error);
  }
};


    //MODALS 
    const openModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setShowModal(false);
  };



  return (
    <div className='parent-container'>

        {userRole === 'user' && <UserSidebar />}
        {userRole === 'agent' && <AgentSidebar />}
        {(userRole === 'admin' || userRole === 'superadmin') && <AdminSidebar />}

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
            >
              {status}
              <div className="counter-div">
                <span className="counter-value">{statusTicketCounts[status] || 0}</span>
              </div>
            </button>
          ))}

          {['hardware', 'software'].map(type => (
            <button
              key={type}
              className={`filter-btn ${isActive(type) ? 'active' : ''}`}
              onClick={() => toggleFilter(type)}
            >
              {type}
              <div className="counter-div">
                <span className="counter-value">{typeTicketCounts[type] || 0}</span>
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
              <tr key={ticket.id} onClick={() => openModal(ticket)} className="clickable-row">
                <td>{ticket.id}</td>
                <td>{ticket.summary}</td>
                <td>{ticket.name}</td>
                <td className={`assignee-${ticket.assignee}`}>
                  {(userRole === 'agent' || userRole === 'admin') ? (
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
                   onChange={(e) => handleStatusChange(ticket.id, e.target.value as Ticket['status'])}
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
