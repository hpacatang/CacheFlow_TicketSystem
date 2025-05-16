import React, { useState } from 'react';
import './notifications.css';
import { UserSidebar } from '../../components/Sidebars/UserSidebar';
import { AgentSidebar } from '../../components/Sidebars/AgentSidebar';

interface NotificationsProps {
  role: 'user' | 'agent';
}

const FILTERS_USER = [
  'All',
  'Ticket Updates',
  'Resolutions'
];

const FILTERS_AGENT = [
  'All',
  'Ticket Updates',
  'Resolutions',
  'Reminders',
  'Assignments'
];

interface NotificationItem {
  type: string;
  title: string;
  message: string;
  date: string;
  highlight?: boolean;
}

type NotificationGroup = {
  date: string;
  items: NotificationItem[];
};

type NotificationsDataType = {
  user: {
    read: NotificationGroup[];
    unread: NotificationGroup[];
  };
  agent: {
    read: NotificationGroup[];
    unread: NotificationGroup[];
  };
};

const notificationsData: NotificationsDataType = {
  user: {
    read: [
      {
        date: 'Today',
        items: [
          {
            type: 'creation',
            title: 'Ticket Creation',
            message: 'New ticket created and pending',
            date: 'xx/xx'
          },
          {
            type: 'progress',
            title: 'Ticket Progress',
            message: 'Your ticket is now reviewed by an agent',
            date: 'xx/xx/xxxx'
          }
        ]
      }
    ],
    unread: []
  },
  agent: {
    read: [
      {
        date: '3 days ago',
        items: [
          {
            type: 'reminder',
            title: 'REMINDER!',
            message: 'Pending Ticket xx nearing deadline',
            date: 'xx/xx',
            highlight: true
          },
          {
            type: 'system',
            title: 'System changes',
            message: 'Change in team',
            date: 'xx/xx'
          }
        ]
      }
    ],
      unread: []
    }
  };
  
  export const Notifications: React.FC<NotificationsProps> = ({ role }) => {
    const [tab, setTab] = useState<'read' | 'unread'>('unread');
    const [filter, setFilter] = useState<string>('All');
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
  
    const filters = role === 'user' ? FILTERS_USER : FILTERS_AGENT;
  
    const notifications = notificationsData[role][tab] as Array<{
      date: string;
      items: NotificationItem[];
    }>;
  
    // Filter logic (expand as needed)
    const filteredNotifications = notifications.map(group => ({
      ...group,
      items: filter === 'All'
        ? group.items
        : group.items.filter(item =>
            (filter === 'Reminders' && item.type === 'reminder') ||
            (filter === 'Assignments' && item.type === 'assignment') ||
            (filter === 'Ticket Updates' && item.type === 'creation') ||
            (filter === 'Resolutions' && item.type === 'progress') ||
            (filter === 'System' && item.type === 'system')
          )
    }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {role === 'user' && <UserSidebar />}
      {role === 'agent' && <AgentSidebar />}
      <div style={{ flex: 1 }}>
        <div className="notifications-container">
          <div className="notifications-tabs">
            <button
              className={tab === 'read' ? 'active' : ''}
              onClick={() => setTab('read')}
            >
              Read
            </button>
            <button
              className={tab === 'unread' ? 'active' : ''}
              onClick={() => setTab('unread')}
            >
              Unread
            </button>
            <div className="notifications-filter">
              <button
                className="filter-btn"
                onClick={() => setFilterOpen(f => !f)}
                aria-label="Filter"
              >
                <span style={{ fontSize: 20 }}>☰</span>
              </button>
              {filterOpen && (
                <div className="filter-dropdown">
                  {filters.map(f => (
                    <div
                      key={f}
                      className={`filter-option${filter === f ? ' selected' : ''}`}
                      onClick={() => {
                        setFilter(f);
                        setFilterOpen(false);
                      }}
                    >
                      {f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="notifications-list">
            {filteredNotifications.map(group => (
              <div key={group.date}>
                <div className="notif-date">{group.date}</div>
                {group.items.length === 0 && (
                  <div className="notif-empty">No notifications</div>
                )}
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`notif-row${item.highlight ? ' highlight' : ''}`}
                  >
                    <div className="notif-title">
                      {item.highlight ? <span className="notif-reminder">{item.title}</span> : item.title}
                    </div>
                    <div className="notif-message">{item.message}</div>
                    <div className="notif-date-right">{item.date}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


