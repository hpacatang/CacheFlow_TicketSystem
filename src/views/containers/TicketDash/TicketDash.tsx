import React, { useEffect, useState } from 'react';
import { UserSidebar } from '../../components/Sidebars/UserSidebar';
import { AgentSidebar } from '../../components/Sidebars/AgentSidebar';
import { AdminSidebar } from '../../components/Sidebars/AdminSidebar';
import SearchIcon from '@mui/icons-material/Search';
import './TicketDash.css';

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
  
  type UserRole = 'user' | 'agent' | 'admin' | 'superadmin';
  const userRole = (users.find(u => u.name === loggedInUser)?.role || 'user') as UserRole;
  
  const loggedInUser = 'yana';
  
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
        {userRole === 'user' && (
          <div className='create-ticket-wrapper'>
          <button className='create-btn' onClick={() => setShowCreateModal(true)}>
            Create Ticket
          </button>

          </div>
        )}

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
    </div>
  );

  //MODALS
  //   {showModal && selectedTicket && (
//   <>
//     {userRole === 'user' ? (
//       <ticketUserEditModal
//         ticket={selectedTicket}
//         onClose={() => setShowModal(false)}
//       
//       />
//     ) : (
//       <ticketAgentEditModal
//         ticket={selectedTicket}
//         onClose={() => setShowModal(false)}
//         users={users}
//       
//       />
//     )}
//   </>
// )}

// {showCreateModal && userRole === 'user' && (
//   <ticketCreateModal
//     onClose={() => setShowCreateModal(false)}
//     // optionally pass props like current user name
//   />
// )}




};
