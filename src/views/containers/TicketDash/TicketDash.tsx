import React, { useEffect, useMemo, useState } from 'react';
import { UserSidebar } from '../../components/Sidebars/UserSidebar';
import { AgentSidebar } from '../../components/Sidebars/AgentSidebar';
import { AdminSidebar } from '../../components/Sidebars/AdminSidebar';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import './TicketDash.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, FormControl, Select, MenuItem } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


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
 // Main data
const [tickets, setTickets] = useState<Ticket[]>([]);
const [users, setUsers] = useState<User[]>([]);

// Filters & search
const [activeFilters, setActiveFilters] = useState<string[]>([]);
const [searchQuery, setSearchQuery] = useState('');

// Ticket modals
const [showModal, setShowModal] = useState(false);
const [showCreateModal, setShowCreateModal] = useState(false);
const [showViewModal, setShowViewModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);

// Ticket selection/edit
const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
const [editTicket, setEditTicket] = useState<Ticket | null>(null);

// Create ticket form
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

// loggedInUser
const loggedInUser = 'admin1'; // CHANGE USER HERE
const SidebarRole = localStorage.getItem('userRole') || 'user';
type UserRole = 'user' | 'agent' | 'admin' | 'superadmin';
const userRole = (users.find(u => u.name === loggedInUser)?.role || 'user') as UserRole;

// DATA FETCHING
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

useEffect(() => {
  console.log('Tickets count:', tickets.length);
}, [tickets]);



// Create ticket handlers
const handleCreateTicketOpen = () => setIsCreateTicketOpen(true);
const handleCreateTicketClose = () => setIsCreateTicketOpen(false);

const handleNewTicketChange = (field: string, value: string | File | null) => {
  setNewTicket(prev => ({ ...prev, [field]: value }));
};

const handleCreateTicket = async () => {
  const usedIds = tickets.map(t => t.id).sort((a, b) => a - b);
  let nextId = 1;
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

  const ticketToCreate = {
    ...newTicket,
    id: nextId,
    name: loggedInUser,
    assignee: '',
    status: 'open',
    resolvedAt: null,
    type: newTicket.type || 'hardware',
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


//Filter logic
 const toggleFilter = (type: string) => {
  setActiveFilters(prev =>
    prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]
  );
};

const isActive = (type: string) => activeFilters.includes(type);

//Ticket filtering
  const visibleTickets = tickets.filter(ticket =>
  userRole === 'user' ? ticket.name === loggedInUser : true
);

const priorityOrder: Record<'high' | 'medium' | 'low', number> = {
  high: 1,
  medium: 2,
  low: 3,
};
const sortedTickets = useMemo(() => {
  const filtered = visibleTickets.filter(ticket => {
    const statusFilters = activeFilters.filter(f => ['open', 'inProgress', 'resolved', 'closed'].includes(f));
    const typeFilters = activeFilters.filter(f => ['hardware', 'software'].includes(f));
    const priorityFilters = activeFilters.filter(f => ['high', 'medium', 'low'].includes(f));

    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(ticket.status);
    const matchesType = typeFilters.length === 0 || typeFilters.includes(ticket.type);
    const matchesPriority = priorityFilters.length === 0 || priorityFilters.includes(ticket.priority?.toLowerCase() || '');

    const matchesSearch =
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesPriority && matchesSearch;
  });

  return [...filtered].sort((a, b) => {
    const getPriorityValue = (priority?: string) =>
      priorityOrder[priority?.toLowerCase() as 'high' | 'medium' | 'low'] ?? 4;

    const priorityA = getPriorityValue(a.priority);
    const priorityB = getPriorityValue(b.priority);

    if (priorityA !== priorityB) return priorityA - priorityB;

    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

    return dateA - dateB;
  });
}, [visibleTickets, activeFilters, searchQuery]);


//----- PAGINATION ----- 
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 12;

const totalPages = Math.max(1, Math.ceil(sortedTickets.length / itemsPerPage));

const paginatedTickets = sortedTickets.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
useEffect(() => {
  if ((currentPage - 1) * itemsPerPage >= sortedTickets.length) {
    setCurrentPage(1);
  }
}, [sortedTickets, currentPage]);

useEffect(() => {
  window.scrollTo(0, 0);
}, [currentPage]);

// Move this logging separately
useEffect(() => {
  console.log('Rendering Page', currentPage);
  console.log('Tickets on page:', paginatedTickets.map(t => t.id));
}, [currentPage, paginatedTickets]);


//Ticket count
const priorityTicketCounts = ['high', 'medium', 'low'].reduce((acc, priority) => {
  acc[priority] = visibleTickets.filter(ticket =>
    ticket.priority?.toLowerCase() === priority
  ).length;
  return acc;
}, {} as { [key: string]: number });

const typeTicketCounts = ['hardware', 'software'].reduce((acc, type) => {
  acc[type] = visibleTickets.filter(ticket => ticket.type === type).length;
  return acc;
}, {} as { [key: string]: number });

const statusTicketCounts = ['open', 'inProgress', 'resolved', 'closed'].reduce((acc, status) => {
  acc[status] = visibleTickets.filter(ticket => ticket.status === status).length;
  return acc;
}, {} as { [key: string]: number });

  //RENDER CIRLE
  const colorMap = {
  high: 'red',
  medium: 'orange',
  low: 'blue',
};
const PriorityIcon = ({ priority }: { priority: 'high' | 'medium' | 'low' }) => {
  const colorMap = {
    high: 'red',
    medium: 'orange',
    low: 'blue',
  };

  return <FiberManualRecordIcon style={{ color: colorMap[priority] || 'gray' }} />;
};
//----- MODALS ----- 
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
    {SidebarRole === 'user' && <UserSidebar />}
    {SidebarRole === 'agent' && <AgentSidebar />}
    {(SidebarRole === 'admin' || userRole === 'superadmin') && <AdminSidebar />}

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

      <div className="ticket-filter-list">
        {/* Priority Filter */}
        <div className="ticket-filter-group">
          <div className="filter-group-title">Priority</div>
          {(['high', 'medium', 'low'] as const).map(priority => (
  <button
    key={priority}
    className={`ticket-filter-btn ${isActive(priority) ? 'active' : ''}`}
    onClick={() => toggleFilter(priority)}
    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
  >
    <FiberManualRecordIcon style={{ color: colorMap[priority], fontSize: 16 }} />
    {priority.charAt(0).toUpperCase() + priority.slice(1)}
    <div className="counter-div">{priorityTicketCounts[priority] || 0}</div>
  </button>
))}

        </div>
        {/* Status Filter */}
        <div className="ticket-filter-group">
          <div className="filter-group-title">Status</div>
          {['open', 'inProgress', 'resolved', 'closed'].map(status => (
            <button
              key={status}
              className={`ticket-filter-btn ${isActive(status) ? 'active' : ''}`}
              onClick={() => toggleFilter(status)}
            >
              {status}
              <div className="counter-div">{statusTicketCounts[status] || 0}</div>
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="ticket-filter-group">
          <div className="filter-group-title">Category</div>
          {['hardware', 'software'].map(type => (
            <button
              key={type}
              className={`ticket-filter-btn ${isActive(type) ? 'active' : ''}`}
              onClick={() => toggleFilter(type)}
            >
              {type}
              <div className="counter-div">{typeTicketCounts[type] || 0}</div>
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Main dashboard content */}
    <div className='main-content'>
      <table>
        <thead>
          <tr>
             {userRole !== 'user' && <th>Priority</th>}
            <th>Summary</th>
             {userRole !== 'user' && <th>Name</th>}
             {userRole !== 'agent' && <th>Assignee</th>}
            <th>Status</th>
            <th>Due date</th>
            <th>Resolved At</th>
            <th>Actions</th>
          </tr>
        </thead>
       <tbody>
  {paginatedTickets.map(ticket => (
    <tr key={ticket.id} className="clickable-row">
      {userRole !== 'user' && (
        <td>
          <PriorityIcon priority={ticket.priority?.toLowerCase() as 'high' | 'medium' | 'low'} />
        </td>
      )}

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

      {userRole !== 'user' && <td>{ticket.name}</td>}
      {userRole !== 'agent' && <td className={`assignee-${ticket.assignee}`}>{ticket.assignee}</td>}

      <td className={`status-${ticket.status}`}>
        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
      </td>

      <td>
        {ticket.dueDate
          ? new Date(ticket.dueDate).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })
          : '—'}
      </td>

      <td>
        {ticket.resolvedAt
          ? new Date(ticket.resolvedAt).toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          : '—'}
      </td>

      <td>
        <Button
          onClick={() => {
            setSelectedTicket(ticket);
            setEditTicket(ticket);
            setShowEditModal(true);
          }}
          sx={{ minWidth: 'auto', padding: 0, color: '#1976d2', ml: 1 }}
          title="Edit Ticket"
        >
          <EditIcon />
        </Button>
        <Button
          className="icon-button"
          onClick={async () => {
            setEditTicket(ticket);
            await handleDeleteTicket();
          }}
          sx={{ minWidth: 'auto', padding: 0, color: '#d32f2f', ml: 1 }}
          title="Delete Ticket"
        >
          <DeleteIcon />
        </Button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
            
      <div className="pagination-container">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            &#8592;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => {
                console.log('Clicked page', page);
                setCurrentPage(page);
              }}
              className={`pagination-number ${page === currentPage ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            &#8594;
          </button>
        </div>



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
