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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await ticketApi.getUsers();
        
        const normalizedUsers = usersData.map((u: any) => ({
          Id: u.Id ?? u.id,
          UserId: u.UserId ?? u.userId,
          Email: u.Email ?? u.email,
          Name: u.Name ?? u.name,
          Password: u.Password ?? u.password,
          Role: u.Role ?? u.role,
          Status: u.Status ?? u.status,
          CreatedBy: u.CreatedBy ?? u.createdBy,
          CreatedTime: u.CreatedTime ?? u.createdTime,
          UpdatedBy: u.UpdatedBy ?? u.updatedBy,
          UpdatedTime: u.UpdatedTime ?? u.updatedTime,
        }));
        
        setUsers(normalizedUsers);
        
        const rawTickets = await ticketApi.getTickets();
        
        const mappedTickets = rawTickets.map((t: any) => ({
          id: t.Id ?? t.id,
          userId: t.UserID ?? t.userId ?? t.userid ?? t.userID,
          summary: t.Summary ?? t.summary,
          name: normalizedUsers.find((u: any) => u.Id === (t.UserID ?? t.userId))?.Name || '',
          assignee: normalizedUsers.find((u: any) => u.Id === (t.AgentID ?? t.agentID))?.Name || 'Unassigned',
          status: (t.Status ?? t.status ?? 'open').toLowerCase(),
          resolvedAt: t.ResolvedAt && new Date(t.ResolvedAt).getFullYear() < 9999 ? new Date(t.ResolvedAt).toISOString() : null,
          type: t.Type ?? t.type ?? '',
          description: t.Description ?? t.description ?? '',
          dueDate: t.DueDate && new Date(t.DueDate).getFullYear() < 9999 ? new Date(t.DueDate).toISOString().slice(0, 10) : '',
          priority: t.Priority ?? t.priority ?? '',
          category: t.Category ?? t.category ?? '',
          attachment: t.AttachmentPath ?? t.attachmentPath ?? null,
        }));
        setTickets(mappedTickets);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);

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
      dueDate: '9999-12-31T23:59:59',
      priority: newTicket.priority || 'Medium',
      category: newTicket.category || 'Hardware',
      status: 'open',
    };

    try {
      await ticketApi.createTicket(ticketToCreate, newTicket.attachment);
      
      const updatedTickets = await ticketApi.getTickets();
      
      const normalizedUsers = users.map((u: any) => ({
        Id: u.Id ?? u.id,
        Name: u.Name ?? u.name,
      }));
      
      const mappedTickets = updatedTickets.map((t: any) => ({
        id: t.Id ?? t.id,
        userId: t.UserID ?? t.userId ?? t.userid ?? t.userID,
        summary: t.Summary ?? t.summary,
        name: normalizedUsers.find((u: any) => u.Id === (t.UserID ?? t.userId))?.Name || '',
        assignee: normalizedUsers.find((u: any) => u.Id === (t.AgentID ?? t.agentID))?.Name || 'Unassigned',
        status: (t.Status ?? t.status ?? 'open').toLowerCase(),
        resolvedAt: t.ResolvedAt && new Date(t.ResolvedAt).getFullYear() < 9999 ? new Date(t.ResolvedAt).toISOString() : null,
        type: t.Type ?? t.type ?? '',
        description: t.Description ?? t.description ?? '',
        dueDate: t.DueDate && new Date(t.DueDate).getFullYear() < 9999 ? new Date(t.DueDate).toISOString().slice(0, 10) : '',
        priority: t.Priority ?? t.priority ?? '',
        category: t.Category ?? t.category ?? '',
        attachment: t.AttachmentPath ?? t.attachmentPath ?? null,
      }));
      
      setTickets(mappedTickets);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }

    handleCreateTicketClose();
    setNewTicket({ title: '', description: '', priority: '', category: '', attachment: null });
  };

  const toggleFilter = (type: string) => {
    setActiveFilters(prev =>
      prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]
    );
  };

  const isActive = (type: string) => activeFilters.includes(type);

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

      const isUnassignedA = a.dueDate && new Date(a.dueDate).getFullYear() >= 9999;
      const isUnassignedB = b.dueDate && new Date(b.dueDate).getFullYear() >= 9999;

      if (isUnassignedA && !isUnassignedB) return -1;
      if (!isUnassignedA && isUnassignedB) return 1;

      const priorityA = getPriorityValue(a.priority);
      const priorityB = getPriorityValue(b.priority);
      if (priorityA !== priorityB) return priorityA - priorityB;

      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      if (dateA !== dateB) return dateA - dateB;

      return b.id - a.id;
    });
  }, [visibleTickets, activeFilters, searchQuery]);

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

  const colorMap = { high: 'red', medium: 'orange', low: 'blue' };
  
  const PriorityIcon = ({ priority }: { priority: 'high' | 'medium' | 'low' }) => (
    <FiberManualRecordIcon style={{ color: colorMap[priority] || 'gray' }} />
  );

  const StatusIcon = ({ status }: { status: 'open' | 'inProgress' | 'resolved' | 'closed' }) => {
    const statusColors = { open: '#1976d2', inProgress: '#ff9800', resolved: '#4caf50', closed: '#757575' };
    return <FiberManualRecordIcon style={{ color: statusColors[status] || 'gray' }} />;
  };

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
    } else if (editTicket.status === 'open' || editTicket.status === 'inProgress') {
      resolvedAtValue = null;
    }
    
    const assignedAgent = users.find((u: any) => u.Name === editTicket.assignee);
    const agentId = assignedAgent ? assignedAgent.Id : null;
    
    const dueDateValue = editTicket.dueDate && editTicket.dueDate.trim() !== '' 
      ? `${editTicket.dueDate}T00:00:00`
      : '9999-12-31T23:59:59';
    
    const updatePayload = {
      summary: editTicket.summary,
      description: editTicket.description,
      dueDate: dueDateValue,
      priority: editTicket.priority,
      category: editTicket.category,
      status: editTicket.status,
      agentID: agentId,
      userID: editTicket.userId,
      type: editTicket.type,
      resolvedAt: resolvedAtValue,
    };

    const attachmentFile = (editTicket.attachment && typeof editTicket.attachment !== 'string')
      ? editTicket.attachment as File
      : null;
    
    try {
      await ticketApi.updateTicket(editTicket.id, updatePayload, attachmentFile);
      
      const updatedTicketFromBackend = await ticketApi.getTickets();
      const refreshedTicket = updatedTicketFromBackend.find((t: any) => (t.Id ?? t.id) === editTicket.id);
      
      if (refreshedTicket) {
        const mappedTicket = {
          id: refreshedTicket.Id ?? refreshedTicket.id,
          userId: refreshedTicket.UserID ?? refreshedTicket.userId ?? refreshedTicket.userid ?? refreshedTicket.userID,
          summary: refreshedTicket.Summary ?? refreshedTicket.summary,
          name: users.find((u: any) => u.Id === refreshedTicket.UserID)?.Name || '',
          assignee: users.find((u: any) => u.Id === refreshedTicket.AgentID)?.Name || 'Unassigned',
          status: (refreshedTicket.Status ?? refreshedTicket.status ?? 'open').toLowerCase(),
          resolvedAt: refreshedTicket.ResolvedAt && new Date(refreshedTicket.ResolvedAt).getFullYear() < 9999 ? new Date(refreshedTicket.ResolvedAt).toISOString() : null,
          type: refreshedTicket.Type ?? refreshedTicket.type ?? '',
          description: refreshedTicket.Description ?? refreshedTicket.description ?? '',
          dueDate: refreshedTicket.DueDate && new Date(refreshedTicket.DueDate).getFullYear() < 9999 ? new Date(refreshedTicket.DueDate).toISOString().slice(0, 10) : '',
          priority: refreshedTicket.Priority ?? refreshedTicket.priority ?? '',
          category: refreshedTicket.Category ?? refreshedTicket.category ?? '',
          attachment: refreshedTicket.AttachmentPath ?? refreshedTicket.attachmentPath ?? null,
        };
        
        setTickets(prev => prev.map(t => t.id === mappedTicket.id ? mappedTicket : t));
        setSelectedTicket(mappedTicket);
      }
      
      setShowEditModal(false);
      setShowViewModal(true);
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
          {ticket.dueDate && new Date(ticket.dueDate).getFullYear() < 9999
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

          <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>Attachments</Typography>
          
          {newTicket.attachment && (
            <div style={{ border: '1px solid #4caf50', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: '#f1f8f4' }}>
              <Typography variant="subtitle2" sx={{ marginBottom: '8px', fontWeight: 'bold', color: '#4caf50' }}>File Selected:</Typography>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">{newTicket.attachment.name}</Typography>
                <Button 
                  size="small" 
                  onClick={() => handleNewTicketChange('attachment', null)}
                  sx={{ color: 'red', textTransform: 'none' }}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          {!newTicket.attachment && (
            <div style={{ border: '2px dashed #ccc', borderRadius: '8px', padding: '24px', textAlign: 'center', marginBottom: '16px', backgroundColor: '#fafafa' }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const files = Array.from(e.dataTransfer.files); handleNewTicketChange('attachment', files[0] || null); }}>
              <Typography variant="body2" sx={{ marginBottom: '12px', color: '#666' }}>
                Drag and drop a file here, or click to browse
              </Typography>
              <input type="file" style={{ display: 'none' }} id="ticket-attachment-input" onChange={e => handleNewTicketChange('attachment', e.target.files ? e.target.files[0] : null)} />
              <Button variant="outlined" component="label" htmlFor="ticket-attachment-input" sx={{ textTransform: 'none' }}>
                Browse Files
              </Button>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateTicket} sx={{ backgroundColor: '#1E90FF', color: 'white', '&:hover': { backgroundColor: 'darkblue' }, display: 'block', margin: '0 auto', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', textTransform: 'none', marginBottom: '10px', fontSize: '16px' }}>Create Ticket</Button>
        </DialogActions>
      </Dialog>

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
              <Typography variant="subtitle1"><b>Due Date:</b> {selectedTicket.dueDate && new Date(selectedTicket.dueDate).getFullYear() < 9999 ? selectedTicket.dueDate : '—'}</Typography>
              <Typography variant="subtitle1"><b>Resolved At:</b> {selectedTicket.resolvedAt ? new Date(selectedTicket.resolvedAt).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : '—'}</Typography>
              <Typography variant="subtitle1"><b>Priority:</b> {selectedTicket.priority || '—'}</Typography>
              <Typography variant="subtitle1"><b>Category:</b> {selectedTicket.category || '—'}</Typography>
              
              {selectedTicket.attachment && typeof selectedTicket.attachment === 'string' && (
                <div>
                  <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}><b>Attachment:</b></Typography>
                  {/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(selectedTicket.attachment) ? (
                    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9' }}>
                      <img 
                        src={`https://localhost:51811${selectedTicket.attachment}`}
                        alt="Attachment preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '300px', 
                          borderRadius: '8px',
                          objectFit: 'contain',
                          display: 'block',
                          margin: '0 auto'
                        }} 
                      />
                    </div>
                  ) : (
                    <div>
                      <a href={`https://localhost:51811${selectedTicket.attachment}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                        View File ({selectedTicket.attachment.split('/').pop()})
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                        {users.filter(u => u.Role === 'Agent').map(user => (<MenuItem key={user.Id} value={user.Name}>{user.Name}</MenuItem>))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              )}

              <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>Attachments</Typography>
              
              {editTicket.attachment && typeof editTicket.attachment === 'string' && (
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: '#f9f9f9' }}>
                  <Typography variant="subtitle2" sx={{ marginBottom: '8px', fontWeight: 'bold' }}>Current Attachment:</Typography>
                  {/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(editTicket.attachment) ? (
                    <div style={{ marginBottom: '12px' }}>
                      <img 
                        src={`https://localhost:51811${editTicket.attachment}`}
                        alt="Attachment preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '300px', 
                          borderRadius: '8px',
                          objectFit: 'contain',
                          display: 'block',
                          margin: '0 auto'
                        }} 
                      />
                    </div>
                  ) : (
                    <div style={{ marginBottom: '12px' }}>
                      <a href={`https://localhost:51811${editTicket.attachment}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                        View File ({editTicket.attachment.split('/').pop()})
                      </a>
                    </div>
                  )}
                  {(userRole === 'user' || userRole === 'superadmin') && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Button 
                        variant="outlined" 
                        component="label" 
                        htmlFor="edit-replace-attachment-input"
                        sx={{ textTransform: 'none' }}
                      >
                        Replace File
                      </Button>
                      <input 
                        type="file" 
                        style={{ display: 'none' }} 
                        id="edit-replace-attachment-input" 
                        onChange={e => handleEditTicketChange('attachment', e.target.files ? e.target.files[0] : null)} 
                      />
                      <Button 
                        variant="outlined" 
                        color="error"
                        onClick={async () => { 
                          try { 
                            await ticketApi.deleteAttachment(editTicket.id); 
                            handleEditTicketChange('attachment', null); 
                          } catch (error) { 
                            console.error('Failed to delete attachment:', error); 
                          } 
                        }}
                        sx={{ textTransform: 'none' }}
                      >
                        Delete File
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {editTicket.attachment && typeof editTicket.attachment !== 'string' && 'name' in editTicket.attachment && (
                <div style={{ border: '1px solid #4caf50', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: '#f1f8f4' }}>
                  <Typography variant="subtitle2" sx={{ marginBottom: '8px', fontWeight: 'bold', color: '#4caf50' }}>New File Selected:</Typography>
                  
                  {/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(editTicket.attachment.name) ? (
                    <div style={{ marginBottom: '12px' }}>
                      <img 
                        src={URL.createObjectURL(editTicket.attachment)}
                        alt="New file preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '300px', 
                          borderRadius: '8px',
                          objectFit: 'contain',
                          display: 'block',
                          margin: '0 auto'
                        }} 
                      />
                    </div>
                  ) : (
                    <Typography variant="body2" sx={{ marginBottom: '12px' }}>{editTicket.attachment.name}</Typography>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      size="small" 
                      onClick={() => handleEditTicketChange('attachment', null)}
                      sx={{ color: 'red', textTransform: 'none' }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {!editTicket.attachment && (userRole === 'user' || userRole === 'superadmin') && (
                <div style={{ border: '2px dashed #ccc', borderRadius: '8px', padding: '24px', textAlign: 'center', marginBottom: '16px', backgroundColor: '#fafafa' }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const files = Array.from(e.dataTransfer.files); handleEditTicketChange('attachment', files[0] || null); }}>
                  <Typography variant="body2" sx={{ marginBottom: '12px', color: '#666' }}>
                    Drag and drop a file here, or click to browse
                  </Typography>
                  <input type="file" style={{ display: 'none' }} id="edit-ticket-attachment-input" onChange={e => handleEditTicketChange('attachment', e.target.files ? e.target.files[0] : null)} />
                  <Button variant="outlined" component="label" htmlFor="edit-ticket-attachment-input" sx={{ textTransform: 'none' }}>
                    Browse Files
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleEditTicketSave} sx={{ backgroundColor: '#1E90FF', color: 'white', '&:hover': { backgroundColor: 'darkblue' }, padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', textTransform: 'none', marginBottom: '10px', fontSize: '16px', mr: 2 }}>Save Changes</Button>
        </DialogActions>
      </Dialog>
      </div>
    </Layout>
  );
};
