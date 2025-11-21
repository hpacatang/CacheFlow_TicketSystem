import React, { useEffect, useMemo, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, FormControl, Select, MenuItem } from '@mui/material';
import Layout from '../../Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { ticketApi } from '../../../constant/ticketApi';
import { TicketFilterSection } from '../../filters/TicketFilterSection';
import './TicketDash.css';

interface Ticket {
  id: number;
  userId: number;
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
  Id: number;
  UserId: string;
  Email: string;
  Name: string;
  Password: string;
  Role: string;
  Status: string;
  CreatedBy: string;
  CreatedTime?: string;
  UpdatedBy: string;
  UpdatedTime?: string;
}

export const TicketDash = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: '',
    category: '',
    attachment: null as File | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { user, getUserRole, getTicketColumnVisibility } = useAuth();
  const loggedInUserId = user?.id ? Number(user.id) : undefined;
  const userRole = getUserRole();
  const columnVisibility = getTicketColumnVisibility();

  // ========== DATA FETCHING ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch users
        const usersData = await ticketApi.getUsers();
        console.log('Fetched users:', usersData);
        setUsers(usersData);
        
        // Then fetch tickets and map with user data
        const rawTickets = await ticketApi.getTickets();
        console.log('Fetched raw tickets:', rawTickets);
        
        // Map backend fields to frontend Ticket interface
        const mappedTickets = rawTickets.map((t: any) => ({
          id: t.Id ?? t.id,
          userId: t.UserID ?? t.userId ?? t.userid ?? t.userID,
          summary: t.Summary ?? t.summary,
          name: usersData.find((u: any) => u.Id === t.UserID)?.Name || '',
          assignee: usersData.find((u: any) => u.Id === t.AgentID)?.Name || 'Unassigned',
          status: (t.Status ?? t.status ?? 'open').toLowerCase(),
          resolvedAt: t.ResolvedAt ? new Date(t.ResolvedAt).toISOString() : null,
          type: t.Type ?? t.type ?? '',
          description: t.Description ?? t.description ?? '',
          dueDate: t.DueDate ? new Date(t.DueDate).toISOString().slice(0, 10) : '',
          priority: t.Priority ?? t.priority ?? '',
          category: t.Category ?? t.category ?? '',
          attachment: t.AttachmentPath ?? t.attachmentPath ?? null,
        }));
        console.log('Mapped tickets:', mappedTickets);
        setTickets(mappedTickets);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);

  // ========== TICKET HANDLERS ==========
  const handleCreateTicketOpen = () => setIsCreateTicketOpen(true);
  const handleCreateTicketClose = () => setIsCreateTicketOpen(false);
  const handleNewTicketChange = (field: string, value: string | File | null) => {
    setNewTicket(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateTicket = async () => {
    const ticketToCreate = {
      summary: newTicket.title,
      userId: loggedInUserId,
      name: user?.name || '',
      assignee: 'Unassigned',
      type: newTicket.category?.toLowerCase() || 'hardware',
      description: newTicket.description || '',
      dueDate: '9999-12-31',
      priority: newTicket.priority || 'Medium',
      category: newTicket.category || 'Hardware',
      status: 'open',
    };

    try {
      const createdTicket = await ticketApi.createTicket(ticketToCreate, newTicket.attachment);
      setTickets(prev => [...prev, createdTicket]);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }

    handleCreateTicketClose();
    setNewTicket({ title: '', description: '', priority: '', category: '', attachment: null });
  };

  // ========== FILTER LOGIC ==========
  const toggleFilter = (type: string) => {
    setActiveFilters(prev =>
      prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]
    );
  };

const isActive = (type: string) => activeFilters.includes(type);

  //Ticket filtering
  const visibleTickets = tickets.filter(ticket =>
    userRole === 'user' ? ticket.userId === loggedInUserId : true
  );

const priorityOrder: Record<'high' | 'medium' | 'low', number> = {
  high: 1,
  medium: 2,
  low: 3,
};
const sortedTickets = useMemo(() => {
  const filtered = visibleTickets.filter(ticket => {
    const statusFilters = activeFilters.filter(f => ['open', 'inProgress', 'resolved', 'closed'].includes(f));
    const typeFilters = activeFilters.filter(f => ['hardware', 'software','network'].includes(f));
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

    // Check if due date is unassigned (9999-12-31 at max)
    const isUnassignedA = a.dueDate && new Date(a.dueDate).getFullYear() >= 9999;
    const isUnassignedB = b.dueDate && new Date(b.dueDate).getFullYear() >= 9999;

    // first unassigned due dates first
    if (isUnassignedA && !isUnassignedB) return -1;
    if (!isUnassignedA && isUnassignedB) return 1;

    // priority after
    const priorityA = getPriorityValue(a.priority);
    const priorityB = getPriorityValue(b.priority);
    if (priorityA !== priorityB) return priorityA - priorityB;

    // due date chronological order
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    if (dateA !== dateB) return dateA - dateB;

    // by id newest
    return b.id - a.id;
  });
}, [visibleTickets, activeFilters, searchQuery]);

  // ========== PAGINATION ==========
  const totalPages = Math.max(1, Math.ceil(sortedTickets.length / itemsPerPage));
  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if ((currentPage - 1) * itemsPerPage >= sortedTickets.length) setCurrentPage(1);
  }, [sortedTickets, currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // ========== TICKET COUNTS ==========
  const priorityTicketCounts = ['high', 'medium', 'low'].reduce((acc, priority) => {
    acc[priority] = visibleTickets.filter(ticket => ticket.priority?.toLowerCase() === priority).length;
    return acc;
  }, {} as { [key: string]: number });

  const typeTicketCounts = ['hardware', 'software', 'network'].reduce((acc, type) => {
    acc[type] = visibleTickets.filter(ticket => ticket.type === type).length;
    return acc;
  }, {} as { [key: string]: number });

  const statusTicketCounts = ['open', 'inProgress', 'resolved', 'closed'].reduce((acc, status) => {
    acc[status] = visibleTickets.filter(ticket => ticket.status === status).length;
    return acc;
  }, {} as { [key: string]: number });

  // ========== ICON COMPONENTS ==========
  const colorMap = { high: 'red', medium: 'orange', low: 'blue' };
  
  const PriorityIcon = ({ priority }: { priority: 'high' | 'medium' | 'low' }) => (
    <FiberManualRecordIcon style={{ color: colorMap[priority] || 'gray' }} />
  );

  const StatusIcon = ({ status }: { status: 'open' | 'inProgress' | 'resolved' | 'closed' }) => {
    const statusColors = { open: '#1976d2', inProgress: '#ff9800', resolved: '#4caf50', closed: '#757575' };
    return <FiberManualRecordIcon style={{ color: statusColors[status] || 'gray' }} />;
  };

  // ========== MODAL HANDLERS ==========
  const openModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setShowModal(false);
  };

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

  const handleEditTicketChange = (field: keyof Ticket, value: string | File | null) => {
    setEditTicket(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleEditTicketSave = async () => {
    if (!editTicket) return;
    
    let resolvedAtValue = editTicket.resolvedAt;
    if ((editTicket.status === 'resolved' || editTicket.status === 'closed') && !editTicket.resolvedAt) {
      resolvedAtValue = new Date().toISOString();
      console.log('Setting resolvedAt to:', resolvedAtValue, 'for status:', editTicket.status);
    } else if (editTicket.status === 'open' || editTicket.status === 'inProgress') {
      resolvedAtValue = null;
      console.log('Clearing resolvedAt - ticket reopened');
    }
    
    const updatedTicket = { ...editTicket, resolvedAt: resolvedAtValue };
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setShowEditModal(false);
    setShowViewModal(true);
    
    const updatePayload = {
      summary: updatedTicket.summary,
      description: updatedTicket.description,
      dueDate: updatedTicket.dueDate,
      priority: updatedTicket.priority,
      category: updatedTicket.category,
      status: updatedTicket.status,
      assignee: updatedTicket.assignee,
      name: updatedTicket.name,
      type: updatedTicket.type,
      resolvedAt: updatedTicket.resolvedAt,
    };

    // Only pass attachment if it's a new File object
    const attachmentFile = (updatedTicket.attachment && typeof updatedTicket.attachment !== 'string')
      ? updatedTicket.attachment as File
      : null;
    
    try {
      await ticketApi.updateTicket(updatedTicket.id, updatePayload, attachmentFile);
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  const handleDeleteTicket = async (ticketToDelete?: Ticket) => {
    const ticket = ticketToDelete || editTicket;
    if (!ticket) return;
    
    try {
      await ticketApi.deleteTicket(ticket.id);
      setTickets(prev => prev.filter(t => t.id !== ticket.id));
      setShowEditModal(false);
      setShowViewModal(false);
      setSelectedTicket(null);
      setEditTicket(null);
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  return (
    <Layout module="tickets">
      <div className='parent-container'>
        <TicketFilterSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
          priorityTicketCounts={priorityTicketCounts}
          statusTicketCounts={statusTicketCounts}
          typeTicketCounts={typeTicketCounts}
          onCreateTicketOpen={handleCreateTicketOpen}
          userRole={userRole}
        />

    {/* Main dashboard content */}
    <div className='main-content'>
      <table>
        <thead>
          <tr>
            {columnVisibility.id && <th>ID</th>}
            {columnVisibility.priority && <th>Priority</th>}
            {columnVisibility.summary && <th>Summary</th>}
            {columnVisibility.name && <th>Name</th>}
            {columnVisibility.assignee && <th>Assignee</th>}
            {columnVisibility.status && <th>Status</th>}
            {columnVisibility.dueDate && <th>Due date</th>}
            {columnVisibility.resolvedAt && <th>Resolved At</th>}
            {columnVisibility.actions && <th>Actions</th>}
          </tr>
        </thead>
       <tbody>
  {paginatedTickets.map(ticket => {
    const isClosedOrResolved = ticket.status === 'resolved' || ticket.status === 'closed';
    return (
    <tr 
      key={ticket.id} 
      className="clickable-row"
      style={{
        backgroundColor: isClosedOrResolved ? '#e0e0e0' : 'transparent',
        opacity: isClosedOrResolved ? 0.85 : 1,
        color: isClosedOrResolved ? '#000000ff' : 'inherit'
      }}
    >
      {columnVisibility.id && <td>{ticket.id}</td>}
      
      {columnVisibility.priority && (
        <td>
          <div style={{ filter: isClosedOrResolved ? 'grayscale(100%)' : 'none', opacity: isClosedOrResolved ? 0.5 : 1 }}>
            <PriorityIcon priority={ticket.priority?.toLowerCase() as 'high' | 'medium' | 'low'} />
          </div>
        </td>
      )}

      {columnVisibility.summary && (
        <td>
          <span
            style={{ 
              color: isClosedOrResolved ? '#999' : '#1976d2', 
              textDecoration: isClosedOrResolved ? 'none' : 'underline', 
              cursor: isClosedOrResolved ? 'not-allowed' : 'pointer',
              pointerEvents: isClosedOrResolved ? 'none' : 'auto'
            }}
            onClick={e => {
              e.stopPropagation();
              setSelectedTicket(ticket);
              setShowViewModal(true);
            }}
          >
            {ticket.summary}
          </span>
        </td>
      )}

      {columnVisibility.name && <td>{ticket.name}</td>}
      
      {columnVisibility.assignee && (
        <td className={`assignee-${ticket.assignee}`}>{ticket.assignee}</td>
      )}

      {columnVisibility.status && (
        <td className={`status-${ticket.status}`}>
          {ticket.status === 'inProgress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
        </td>
      )}

      {columnVisibility.dueDate && (
        <td>
          {ticket.dueDate
            ? new Date(ticket.dueDate).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })
            : '—'}
        </td>
      )}

      {columnVisibility.resolvedAt && (
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
      )}

      {columnVisibility.actions && (
        <td>
          {/* All logged-in users can edit and delete tickets */}
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
            onClick={() => handleDeleteTicket(ticket)}
            sx={{ minWidth: 'auto', padding: 0, color: '#d32f2f', ml: 1 }}
            title="Delete Ticket"
          >
            <DeleteIcon />
          </Button>
        </td>
      )}
    </tr>
    );
  })}
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
            <button key={page} onClick={() => setCurrentPage(page)} className={`pagination-number ${page === currentPage ? 'active' : ''}`}>{page}</button>
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

      {/* ========== CREATE TICKET MODAL ========== */}
      <Dialog open={isCreateTicketOpen} onClose={handleCreateTicketClose} sx={{ '& .MuiDialog-paper': { width: '800px', maxWidth: '95%', borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Create Ticket
          <Button onClick={handleCreateTicketClose} sx={{ minWidth: 'auto', padding: 0, color: 'black', fontSize: '16px', '&:hover': { color: 'red' } }}>✕</Button>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ marginBottom: '2px' }}>Title</Typography>
          <TextField variant="outlined" fullWidth margin="dense" value={newTicket.title} onChange={e => handleNewTicketChange('title', e.target.value)} sx={{ borderRadius: '8px', marginBottom: '16px', '& .MuiOutlinedInput-root': { height: '40px' } }} />

          <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>Description</Typography>
          <TextField variant="outlined" fullWidth margin="dense" multiline rows={4} value={newTicket.description} onChange={e => handleNewTicketChange('description', e.target.value)} sx={{ borderRadius: '8px', marginBottom: '16px' }} />
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>Priority</Typography>
              <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}>
                <Select displayEmpty value={newTicket.priority || ''} onChange={e => handleNewTicketChange('priority', e.target.value)} sx={{ borderRadius: '8px', height: '40px' }}>
                  <MenuItem value="" disabled><span style={{ color: 'gray' }}>Select Priority</span></MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div style={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>Category</Typography>
              <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}>
                <Select displayEmpty value={newTicket.category || ''} onChange={e => handleNewTicketChange('category', e.target.value)} sx={{ borderRadius: '8px', height: '40px' }}>
                  <MenuItem value="" disabled><span style={{ color: 'gray' }}>Select Category</span></MenuItem>
                  <MenuItem value="Hardware">Hardware</MenuItem>
                  <MenuItem value="Software">Software</MenuItem>
                  <MenuItem value="Network">Network</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>Attachments</Typography>
          <div style={{ border: '2px dashed black', borderRadius: '8px', padding: '16px', textAlign: 'center', marginBottom: '5px', backgroundColor: '#f9f9f9' }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const files = Array.from(e.dataTransfer.files); handleNewTicketChange('attachment', files[0] || null); }}>
            Drag and drop files here, or click to upload
            <input type="file" style={{ display: 'none' }} id="ticket-attachment-input" onChange={e => handleNewTicketChange('attachment', e.target.files ? e.target.files[0] : null)} />
            <Button variant="outlined" component="label" htmlFor="ticket-attachment-input" sx={{ mt: 1 }}>Browse Files</Button>
            {newTicket.attachment && 'name' in newTicket.attachment && (
              <div style={{ marginTop: 8 }}>Selected: {newTicket.attachment.name}</div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateTicket} sx={{ backgroundColor: '#1E90FF', color: 'white', '&:hover': { backgroundColor: 'darkblue' }, display: 'block', margin: '0 auto', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', textTransform: 'none', marginBottom: '10px', fontSize: '16px' }}>Create Ticket</Button>
        </DialogActions>
      </Dialog>

      {/* ========== VIEW TICKET MODAL ========== */}
      <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} sx={{ '& .MuiDialog-paper': { width: '800px', maxWidth: '95%', borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Ticket Details
            {selectedTicket && <Button onClick={handleEditModalOpen} sx={{ minWidth: 'auto', padding: 0, color: '#1976d2', ml: 1 }} title="Edit Ticket"><EditIcon /></Button>}
          </span>
          <Button onClick={() => setShowViewModal(false)} sx={{ minWidth: 'auto', padding: 0, color: 'black', fontSize: '16px', '&:hover': { color: 'red' } }}>✕</Button>
        </DialogTitle>
        <DialogContent dividers>
          {selectedTicket && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Typography variant="subtitle1"><b>Title:</b> {selectedTicket.summary}</Typography>
              <Typography variant="subtitle1"><b>Description:</b> {selectedTicket.description || '—'}</Typography>
              <Typography variant="subtitle1"><b>Status:</b> {selectedTicket.status ? (selectedTicket.status === 'inProgress' ? 'In Progress' : selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)) : '—'}</Typography>
              <Typography variant="subtitle1"><b>Due Date:</b> {selectedTicket.dueDate || '—'}</Typography>
              <Typography variant="subtitle1"><b>Priority:</b> {selectedTicket.priority || '—'}</Typography>
              <Typography variant="subtitle1"><b>Category:</b> {selectedTicket.category || '—'}</Typography>
              <Typography variant="subtitle1"><b>Attachment:</b> {selectedTicket.attachment ? (typeof selectedTicket.attachment === 'string' ? <a href={selectedTicket.attachment} target="_blank" rel="noopener noreferrer">View Attachment</a> : (selectedTicket.attachment && 'name' in selectedTicket.attachment ? selectedTicket.attachment.name : '—')) : '—'}</Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========== EDIT TICKET MODAL ========== */}
      <Dialog open={showEditModal} onClose={handleEditModalClose} sx={{ '& .MuiDialog-paper': { width: '800px', maxWidth: '95%', borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Edit Ticket</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Typography variant="subtitle1" sx={{ marginBottom: '0px' }}>Status</Typography>
              <FormControl sx={{ minWidth: 150 }}>
                <Select value={editTicket?.status || 'open'} onChange={(e) => handleEditTicketChange('status', e.target.value)} sx={{ height: '40px', fontSize: '14px', borderRadius: '8px', '& .MuiSelect-select': { paddingY: '8px' } }}>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </div>
            <Button onClick={handleEditModalClose} sx={{ minWidth: 'auto', padding: 0, color: 'black', fontSize: '16px', '&:hover': { color: 'red' } }}>✕</Button>
          </div>
        </DialogTitle>
        <DialogContent>
          {editTicket && (
            <>
              <Typography variant="subtitle1" sx={{ marginBottom: '2px' }}>Title</Typography>
              <TextField variant="outlined" fullWidth margin="dense" value={editTicket.summary} onChange={e => handleEditTicketChange('summary', e.target.value)} sx={{ borderRadius: '8px', marginBottom: '16px', '& .MuiOutlinedInput-root': { height: '40px' } }} />
              
              <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>Description</Typography>
              <TextField variant="outlined" fullWidth margin="dense" multiline rows={4} value={editTicket.description} onChange={e => handleEditTicketChange('description', e.target.value)} sx={{ borderRadius: '8px', marginBottom: '16px' }} />
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>Priority</Typography>
                  <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}>
                    <Select displayEmpty value={editTicket.priority || ''} onChange={e => handleEditTicketChange('priority', e.target.value)} sx={{ borderRadius: '8px', height: '40px' }}>
                      <MenuItem value="" disabled><span style={{ color: 'gray' }}>Select Priority</span></MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div style={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>Category</Typography>
                  <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}>
                    <Select displayEmpty value={editTicket.category || ''} onChange={e => handleEditTicketChange('category', e.target.value)} sx={{ borderRadius: '8px', height: '40px' }}>
                      <MenuItem value="" disabled><span style={{ color: 'gray' }}>Select Category</span></MenuItem>
                      <MenuItem value="Hardware">Hardware</MenuItem>
                      <MenuItem value="Software">Software</MenuItem>
                      <MenuItem value="Network">Network</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {(userRole === 'agent' || userRole === 'admin' || userRole === 'superadmin') && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>Due Date</Typography>
                    <TextField variant="outlined" fullWidth margin="dense" type="date" value={editTicket.dueDate || ''} onChange={e => handleEditTicketChange('dueDate', e.target.value)} sx={{ borderRadius: '8px', '& .MuiOutlinedInput-root': { height: '40px' } }} InputLabelProps={{ shrink: true }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>Assign Agent</Typography>
                    <FormControl fullWidth margin="dense" sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}>
                      <Select displayEmpty value={editTicket.assignee || ''} onChange={e => handleEditTicketChange('assignee', e.target.value)} sx={{ borderRadius: '8px', height: '40px' }}>
                        <MenuItem value="" disabled><span style={{ color: 'gray' }}>Select Agent</span></MenuItem>
                        <MenuItem value="Unassigned">Unassigned</MenuItem>
                        {users.filter(u => u.Role === 'agent').map(user => (<MenuItem key={user.Id} value={user.Name}>{user.Name}</MenuItem>))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              )}

              <Typography variant="subtitle1" sx={{ marginBottom: '4px' }}>Attachments</Typography>
              <div style={{ border: '2px dashed black', borderRadius: '8px', padding: '16px', textAlign: 'center', marginBottom: '5px', backgroundColor: '#f9f9f9' }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const files = Array.from(e.dataTransfer.files); handleEditTicketChange('attachment', files[0] || null); }}>
                Drag and drop files here, or click to upload
                <input type="file" style={{ display: 'none' }} id="edit-ticket-attachment-input" onChange={e => handleEditTicketChange('attachment', e.target.files ? e.target.files[0] : null)} />
                <Button variant="outlined" component="label" htmlFor="edit-ticket-attachment-input" sx={{ mt: 1 }}>Browse Files</Button>
                {editTicket.attachment && (typeof editTicket.attachment === 'string'
                  ? <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <a href={editTicket.attachment} target="_blank" rel="noopener noreferrer">Current Attachment</a>
                      <Button size="small" onClick={async () => { 
                        try { 
                          await ticketApi.deleteAttachment(editTicket.id); 
                          handleEditTicketChange('attachment', null); 
                        } catch (error) { 
                          console.error('Failed to delete attachment:', error); 
                        } 
                      }} sx={{ color: 'red' }}>Delete</Button>
                    </div>
                  : (editTicket.attachment && 'name' in editTicket.attachment ? <div style={{ marginTop: 8 }}>New: {editTicket.attachment.name}</div> : null))}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleEditTicketSave} sx={{ backgroundColor: '#1E90FF', color: 'white', '&:hover': { backgroundColor: 'darkblue' }, padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', textTransform: 'none', marginBottom: '10px', fontSize: '16px', mr: 2 }}>Save Changes</Button>
          <Button onClick={() => handleDeleteTicket()} sx={{ minWidth: '40px', height: '40px', backgroundColor: '#ff4d4f', color: 'white', borderRadius: '50%', ml: 2, mb: '10px', '&:hover': { backgroundColor: '#b71c1c' }, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} aria-label="Delete Ticket"><DeleteIcon fontSize="medium" /></Button>
        </DialogActions>
      </Dialog>
      </div>
    </Layout>
  );
};
