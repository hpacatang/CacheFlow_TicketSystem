import React, { useState } from 'react';
import { UserSidebar } from '../../components/Sidebars/UserSidebar';
import SearchIcon from '@mui/icons-material/Search';
import './TicketDash.css';

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
  const loggedInUser = 'admin1'; // test users

  type UserRole = 'user' | 'agent' | 'admin';
 const userRole = (users.find(u => u.name === loggedInUser)?.role || 'user') as UserRole;


  const [tickets, setTickets] = useState(mockTickets);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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
          <button className='create-btn'>Create Ticket</button>
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
    </div>
  );
};
