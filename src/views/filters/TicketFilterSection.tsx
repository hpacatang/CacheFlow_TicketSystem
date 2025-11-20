import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface TicketFilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
  priorityTicketCounts: { [key: string]: number };
  statusTicketCounts: { [key: string]: number };
  typeTicketCounts: { [key: string]: number };
  onCreateTicketOpen: () => void;
  userRole: string;
}

const colorMap = {
  high: 'red',
  medium: 'orange',
  low: 'blue',
};

export const TicketFilterSection: React.FC<TicketFilterSectionProps> = ({
  searchQuery,
  onSearchChange,
  activeFilters,
  onToggleFilter,
  priorityTicketCounts,
  statusTicketCounts,
  typeTicketCounts,
  onCreateTicketOpen,
  userRole,
}) => {
  const isActive = (type: string) => activeFilters.includes(type);

  return (
    <div className='filter-section'>
      {userRole === 'user' && (
        <div className="create-ticket-wrapper">
          <button className='create-btn' onClick={onCreateTicketOpen}>Create Ticket</button>
        </div>
      )}

      <div className="search-wrapper">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          className="search-filter"
          placeholder="Search in All Tickets"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="ticket-filter-list">
        {(
          <div className="ticket-filter-group">
            <div className="filter-group-title">Priority</div>
            {(['high', 'medium', 'low'] as const).map(priority => (
              <button
                key={priority}
                className={`ticket-filter-btn ${isActive(priority) ? 'active' : ''}`}
                onClick={() => onToggleFilter(priority)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 1rem',
                }}
              >
                <span style={{ flex: 1, textAlign: 'left' }}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </span>
                <FiberManualRecordIcon
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: colorMap[priority],
                    fontSize: 16,
                    pointerEvents: 'none',
                  }}
                />
                <div className="counter-div" style={{ textAlign: 'right' }}>
                  {priorityTicketCounts[priority] || 0}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="ticket-filter-group">
          <div className="filter-group-title">Status</div>
          {['open', 'inProgress', 'resolved', 'closed'].map(status => (
            <button
              key={status}
              className={`ticket-filter-btn ${isActive(status) ? 'active' : ''}`}
              onClick={() => onToggleFilter(status)}
            >
              {status}
              <div className="counter-div">{statusTicketCounts[status] || 0}</div>
            </button>
          ))}
        </div>

        <div className="ticket-filter-group">
          <div className="filter-group-title">Category</div>
          {['hardware', 'software', 'network'].map(type => (
            <button
              key={type}
              className={`ticket-filter-btn ${isActive(type) ? 'active' : ''}`}
              onClick={() => onToggleFilter(type)}
            >
              {type}
              <div className="counter-div">{typeTicketCounts[type] || 0}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
