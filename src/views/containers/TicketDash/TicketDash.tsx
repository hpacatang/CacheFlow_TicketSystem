import React, { useEffect, useState } from 'react';
import { UserSidebar } from '../../components/Sidebars/UserSidebar';
import { AgentSidebar } from '../../components/Sidebars/AgentSidebar';
import { AdminSidebar } from '../../components/Sidebars/AdminSidebar';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  description: string;
  dueDate: string;
  priority?: string;
  category?: string;
  attachment?: string | File | null;
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const loggedInUser = 'yana'; //CHANGE USER HERE
  
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
  const handleCreateTicket = async () => {
    // Find the next available integer ID
    const usedIds = tickets.map(t => t.id).sort((a, b) => a - b);
    let nextId = 3;
    for (let i = 1; i < usedIds.length; i++) {
      if (usedIds[i] !== i + 1) {
        nextId = i + 1;
        break;
      }
      if (i === usedIds.length - 1) {
        nextId = usedIds.length + 1;
      }
    }
    if (usedIds.length === 0) nextId = 1;

    // Build the new ticket object
    const ticketToCreate = {
      ...newTicket,
      id: nextId,
      name: loggedInUser,
      assignee: '', // or assign as needed
      status: 'open',
      resolvedAt: null,
      type: newTicket.type || 'hardware', // default if needed
    };

    try {
      const response = await fetch('http://localhost:3001/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketToCreate),
      });
      const createdTicket = await response.json();
      setTickets(prev => [...prev, createdTicket]);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }

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

  // Edit modal open/close handlers
  const handleEditModalOpen = () => {
    if (selectedTicket) {
      setEditTicket({ ...selectedTicket });
      setShowEditModal(true);
    }
  };
  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditTicket(null);
  };

  // Edit ticket field change handler
  const handleEditTicketChange = (field: keyof Ticket, value: string | File | null) => {
    setEditTicket(prev => prev ? { ...prev, [field]: value } : prev);
  };

  // Save edited ticket
  const handleEditTicketSave = async () => {
    if (!editTicket) return;
    setTickets(prev => prev.map(t => t.id === editTicket.id ? { ...editTicket } : t));
    setSelectedTicket({ ...editTicket });
    setShowEditModal(false);
    setShowViewModal(true);
    try {
      await fetch(`http://localhost:3001/tickets/${editTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: editTicket.summary,
          description: editTicket.description,
          dueDate: editTicket.dueDate,
          priority: editTicket.priority,
          category: editTicket.category,
          attachment: typeof editTicket.attachment === 'string' ? editTicket.attachment : (editTicket.attachment && 'name' in editTicket.attachment ? editTicket.attachment.name : null),
        }),
      });
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  // Deleting a ticket
const handleDeleteTicket = async () => {
  if (!editTicket) return;
  try {
    await fetch(`http://localhost:3001/tickets/${editTicket.id}`, {
      method: 'DELETE',
    });
    setTickets(prev => prev.filter(t => t.id !== editTicket.id));
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedTicket(null);
  } catch (error) {
    console.error('Failed to delete ticket:', error);
  }
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

        <div className='ticket-filter-list'>
          {['open', 'inProgress', 'resolved', 'closed'].map(status => (
            <button
              key={status}
              className={`ticket-filter-btn ${isActive(status) ? 'active' : ''}`}
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
              className={`ticket-filter-btn ${isActive(type) ? 'active' : ''}`}
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

      {/* Main content/dashboard */}
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
              <tr key={ticket.id} className="clickable-row">
                <td>{ticket.id}</td>
                <td>
                  <span
                    style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedTicket(ticket);
                      setShowViewModal(true);
                    }}
                  >
                    {ticket.summary}
                  </span>
                </td>
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

      {/* View Ticket Modal */}
<Dialog
  open={showViewModal}
  onClose={() => setShowViewModal(false)}
  sx={{
    '& .MuiDialog-paper': {
      width: '800px', // Match the edit modal width
      maxWidth: '95%',
      borderRadius: '16px',
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      Ticket Details
      {selectedTicket && (
        <Button onClick={handleEditModalOpen} sx={{ minWidth: 'auto', padding: 0, color: '#1976d2', ml: 1 }} title="Edit Ticket">
          <EditIcon />
        </Button>
      )}
    </span>
    <Button
      onClick={() => setShowViewModal(false)}
      sx={{
        minWidth: 'auto',
        padding: 0,
        color: 'black',
        fontSize: '16px',
        '&:hover': { color: 'red' },
      }}
    >
      ✕
    </Button>


    {/* View Modal */}
  </DialogTitle>
  <DialogContent dividers>
    {selectedTicket && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Typography variant="subtitle1"><b>Title:</b> {selectedTicket.summary}</Typography>
        <Typography variant="subtitle1"><b>Description:</b> {selectedTicket.description || '—'}</Typography>
        <Typography variant="subtitle1"><b>Due Date:</b> {selectedTicket.dueDate || '—'}</Typography>
        <Typography variant="subtitle1"><b>Priority:</b> {selectedTicket.priority || '—'}</Typography>
        <Typography variant="subtitle1"><b>Category:</b> {selectedTicket.category || '—'}</Typography>
        <Typography variant="subtitle1"><b>Attachment:</b> {selectedTicket.attachment
          ? (typeof selectedTicket.attachment === 'string'
              ? <a href={selectedTicket.attachment} target="_blank" rel="noopener noreferrer">View Attachment</a>
              : (selectedTicket.attachment && 'name' in selectedTicket.attachment ? selectedTicket.attachment.name : '—'))
          : '—'}
        </Typography>
      </div>
    )}
  </DialogContent>
</Dialog>

{/* Edit Ticket Modal */}
<Dialog
  open={showEditModal}
  onClose={handleEditModalClose}
  sx={{
    '& .MuiDialog-paper': {
      width: '800px',
      maxWidth: '95%',
      borderRadius: '16px',
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    Edit Ticket
    <Button
      onClick={handleEditModalClose}
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
    {editTicket && (
      <>
        <Typography variant="subtitle1" sx={{ marginBottom: '2px' }}>
          Title
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          margin="dense"
          value={editTicket.summary}
          onChange={e => handleEditTicketChange('summary', e.target.value)}
          sx={{ borderRadius: '8px', marginBottom: '16px', '& .MuiOutlinedInput-root': { height: '40px' } }}
        />
        <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>
          Description
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          margin="dense"
          multiline
          rows={4}
          value={editTicket.description}
          onChange={e => handleEditTicketChange('description', e.target.value)}
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
              value={editTicket.dueDate || ''}
              onChange={e => handleEditTicketChange('dueDate', e.target.value)}
              sx={{ borderRadius: '8px', '& .MuiOutlinedInput-root': { height: '40px' } }}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>
              Priority
            </Typography>
            <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}>
              <Select
                displayEmpty
                value={editTicket.priority || ''}
                onChange={e => handleEditTicketChange('priority', e.target.value)}
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
          <div style={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>
              Category
            </Typography>
            <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}>
              <Select
                displayEmpty
                value={editTicket.category || ''}
                onChange={e => handleEditTicketChange('category', e.target.value)}
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
            handleEditTicketChange('attachment', files[0] || null);
          }}
        >
          Drag and drop files here, or click to upload
          <input
            type="file"
            style={{ display: 'none' }}
            id="edit-ticket-attachment-input"
            onChange={e => handleEditTicketChange('attachment', e.target.files ? e.target.files[0] : null)}
          />
          {editTicket.attachment && (typeof editTicket.attachment === 'string'
            ? <div style={{ marginTop: 8 }}><a href={editTicket.attachment} target="_blank" rel="noopener noreferrer">Current Attachment</a></div>
            : (editTicket.attachment && 'name' in editTicket.attachment ? <div style={{ marginTop: 8 }}>{editTicket.attachment.name}</div> : null))}
        </div>
      </>
    )}
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center' }}>
    <Button
      onClick={handleEditTicketSave}
      sx={{
        backgroundColor: '#1E90FF',
        color: 'white',
        '&:hover': {
          backgroundColor: 'darkblue',
        },
        padding: '8px 16px',
        borderRadius: '8px',
        fontWeight: 'bold',
        textTransform: 'none',
        marginBottom: '10px',
        fontSize: '16px',
        mr: 2,
      }}
    >
      Save Changes
    </Button>
    <Button
      onClick={handleDeleteTicket}
      sx={{
        minWidth: '40px',
        height: '40px',
        backgroundColor: '#ff4d4f',
        color: 'white',
        borderRadius: '50%',
        ml: 2,
        mb: '10px',
        '&:hover': {
          backgroundColor: '#b71c1c',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
      aria-label="Delete Ticket"
    >
      <DeleteIcon fontSize="medium" />
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
};
