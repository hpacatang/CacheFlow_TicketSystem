import React, { useState } from 'react';
import './settings.css';
import { UserSidebar } from '../../components/Sidebars/UserSidebar';
import { AgentSidebar } from '../../components/Sidebars/AgentSidebar';
import { AdminSidebar } from '../../components/Sidebars/AdminSidebar';

const TABS = [
  { label: 'Notification Settings' },
  { label: 'Ticket Views' },
  { label: 'Others' }
];

interface SettingsProps {
  role?: 'user' | 'agent' | 'admin'; //optional for now 
}

export const Settings: React.FC<SettingsProps> = ({ role }) => {
  const sidebarRole = (localStorage.getItem('userRole')); //use local storage to get role
  const [activeTab, setActiveTab] = useState(0);

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  const [dashboardView, setDashboardView] = useState('assigned');
  const [agentFilter, setAgentFilter] = useState('category');
  const [agentSort, setAgentSort] = useState('creation');
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [notif, setNotif] = useState<string[]>([]);
  const [system, setSystem] = useState<string[]>([]);
  const [reminder, setReminder] = useState<string[]>([]);

  const [userFilter, setUserFilter] = useState('all');
  const [userSort, setUserSort] = useState('latest');

  const handleMultiSelect = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {sidebarRole === 'user' && <UserSidebar />}
      {sidebarRole === 'agent' && <AgentSidebar />}
      {sidebarRole === 'admin' && <AdminSidebar />}
      <div style={{ flex: 1 }}>
        <div className="settings-container">
          <h2>Settings</h2>
          <div className="settings-tabs">
            {TABS.map((tab, idx) => (
              <button
                key={tab.label}
                className={`settings-tab${activeTab === idx ? ' active' : ''}`}
                onClick={() => setActiveTab(idx)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="settings-content">
            {/* Notification Settings */}
            {activeTab === 0 && (
              <div>
                <section>
                  <div className="section-title">Enable/Disable Notifications When:</div>
                  {role === 'agent' ? (
                    <>
                      <label>
                        <input
                          type="checkbox"
                          checked={notif.includes('new')}
                          onChange={() => handleMultiSelect('new', notif, setNotif)}
                        />
                        New Ticket Assigned
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={notif.includes('reply')}
                          onChange={() => handleMultiSelect('reply', notif, setNotif)}
                        />
                        User Replies to Ticket
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={notif.includes('status')}
                          onChange={() => handleMultiSelect('status', notif, setNotif)}
                        />
                        Ticket Status Changes
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={notif.includes('priority')}
                          onChange={() => handleMultiSelect('priority', notif, setNotif)}
                        />
                        High Priority Tickets
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={notif.includes('escalation')}
                          onChange={() => handleMultiSelect('escalation', notif, setNotif)}
                        />
                        Escalation
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        <input
                          type="checkbox"
                          checked={notif.includes('support-reply')}
                          onChange={() => handleMultiSelect('support-reply', notif, setNotif)}
                        />
                        Support agent replies to ticket
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={notif.includes('closed')}
                          onChange={() => handleMultiSelect('closed', notif, setNotif)}
                        />
                        Ticket closed/resolved
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={notif.includes('reopened')}
                          onChange={() => handleMultiSelect('reopened', notif, setNotif)}
                        />
                        Ticket reopened
                      </label>
                    </>
                  )}
                </section>
                <section>
                  <div className="section-title">{role === 'agent' ? 'System' : 'Reminders'}</div>
                  {role === 'agent' ? (
                    <>
                      <label>
                        <input
                          type="checkbox"
                          checked={system.includes('team')}
                          onChange={() => handleMultiSelect('team', system, setSystem)}
                        />
                        Team Updates
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={system.includes('shift')}
                          onChange={() => handleMultiSelect('shift', system, setSystem)}
                        />
                        Shift Changes
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={system.includes('summary')}
                          onChange={() => handleMultiSelect('summary', system, setSystem)}
                        />
                        Daily Weekly Summary
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        <input
                          type="checkbox"
                          checked={reminder.includes('pending')}
                          onChange={() => handleMultiSelect('pending', reminder, setReminder)}
                        />
                        Pending tickets after x days
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={reminder.includes('no-response')}
                          onChange={() => handleMultiSelect('no-response', reminder, setReminder)}
                        />
                        No user responses
                      </label>
                    </>
                  )}
                </section>
                <section>
                  <div className="section-title">{role === 'agent' ? 'Reminders' : 'Announcements'}</div>
                  {role === 'agent' ? (
                    <>
                      <label>
                        <input
                          type="checkbox"
                          checked={reminder.includes('unresolved')}
                          onChange={() => handleMultiSelect('unresolved', reminder, setReminder)}
                        />
                        Unresolved tickets
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={reminder.includes('sla')}
                          onChange={() => handleMultiSelect('sla', reminder, setReminder)}
                        />
                        SLA Breaches
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        <input
                          type="checkbox"
                          checked={system.includes('maintenance')}
                          onChange={() => handleMultiSelect('maintenance', system, setSystem)}
                        />
                        System maintenance
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={system.includes('features')}
                          onChange={() => handleMultiSelect('features', system, setSystem)}
                        />
                        New features
                      </label>
                    </>
                  )}
                </section>
              </div>
            )}

            {/* Ticket Views */}
            {activeTab === 1 && (
              <div>
                {role === 'agent' ? (
                  <>
                    <section>
                      <div className="section-title">Default Dashboard View</div>
                      <label>
                        <input type="radio" name="dashboardView" checked={dashboardView === 'assigned'} onChange={() => setDashboardView('assigned')} />
                        Tickets Assigned to me
                      </label>
                      <label>
                        <input type="radio" name="dashboardView" checked={dashboardView === 'unassigned'} onChange={() => setDashboardView('unassigned')} />
                        Unassigned Tickets
                      </label>
                      <label>
                        <input type="radio" name="dashboardView" checked={dashboardView === 'all'} onChange={() => setDashboardView('all')} />
                        Show All Tickets
                      </label>
                    </section>
                    <section>
                      <div className="section-title">Default Filter</div>
                      <label>
                        <input type="radio" name="agentFilter" checked={agentFilter === 'category'} onChange={() => setAgentFilter('category')} />
                        By Category
                      </label>
                      <label>
                        <input type="radio" name="agentFilter" checked={agentFilter === 'priority'} onChange={() => setAgentFilter('priority')} />
                        By Priority
                      </label>
                      <label>
                        <input type="radio" name="agentFilter" checked={agentFilter === 'status'} onChange={() => setAgentFilter('status')} />
                        By Status
                      </label>
                    </section>
                    <section>
                      <div className="section-title">Default sort order</div>
                      <label>
                        <input type="radio" name="agentSort" checked={agentSort === 'creation'} onChange={() => setAgentSort('creation')} />
                        By Creation Date
                      </label>
                    </section>
                    <section>
                      <div className="section-title">Tickets Per Page:</div>
                      <select
                        value={ticketsPerPage}
                        onChange={e => setTicketsPerPage(Number(e.target.value))}
                        style={{ marginLeft: 16, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
                      >
                        <option value={10}>10 tickets</option>
                        <option value={20}>20 tickets</option>
                        <option value={50}>50 tickets</option>
                        <option value={100}>100 tickets</option>
                      </select>
                    </section>
                    <section>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={autoRefresh}
                          onChange={() => setAutoRefresh(!autoRefresh)}
                          style={{ width: 32, height: 18, accentColor: '#0074d9' }}
                        />
                        <span>Auto Refresh Ticket List (30 Seconds)</span>
                      </label>
                    </section>
                  </>
                ) : (
                  <>
                    <section>
                      <div className="section-title">Default Filter</div>
                      <label>
                        <input
                          type="radio"
                          name="filter"
                          checked={userFilter === 'all'}
                          onChange={() => setUserFilter('all')}
                        /> Show All Tickets
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="filter"
                          checked={userFilter === 'open'}
                          onChange={() => setUserFilter('open')}
                        /> Only Open Tickets
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="filter"
                          checked={userFilter === 'resolved'}
                          onChange={() => setUserFilter('resolved')}
                        /> Only Resolved Tickets
                      </label>
                    </section>
                    <section>
                      <div className="section-title">Default Sort</div>
                      <label>
                        <input
                          type="radio"
                          name="sort"
                          checked={userSort === 'latest'}
                          onChange={() => setUserSort('latest')}
                        /> Latest First
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="sort"
                          checked={userSort === 'oldest'}
                          onChange={() => setUserSort('oldest')}
                        /> Oldest First
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="sort"
                          checked={userSort === 'priority'}
                          onChange={() => setUserSort('priority')}
                        /> Priority
                      </label>
                    </section>
                    <section>
                      <div className="section-title">Tickets Per Page:</div>
                      <select
                        value={ticketsPerPage}
                        onChange={e => setTicketsPerPage(Number(e.target.value))}
                        style={{ marginLeft: 16, padding: '4px 8px', minWidth: '140px', borderRadius: 4, border: '1px solid #ccc' }}
                      >
                        <option value={10}>10 tickets</option>
                        <option value={20}>20 tickets</option>
                        <option value={50}>50 tickets</option>
                        <option value={100}>100 tickets</option>
                      </select>
                    </section>
                    <section>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={autoRefresh}
                          onChange={() => setAutoRefresh(!autoRefresh)}
                          style={{ width: 32, height: 18, accentColor: '#0074d9' }}
                        />
                        <span>Auto Refresh Ticket List (30 Seconds)</span>
                      </label>
                    </section>
                  </>
                )}
              </div>
            )}

            {/* Others */}
            {activeTab === 2 && (
              <div>
                <section>
                  <div className="section-title">Theme</div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                      style={{ width: 32, height: 18, accentColor: '#0074d9' }}
                    />
                    <span>Dark Mode</span>
                  </label>
                </section>
                <hr style={{ margin: '24px 0' }} />
                <section>
                  <div className="section-title">Language</div>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    style={{ marginLeft: 16, padding: '4px 8px', minWidth: '240px', borderRadius: 4, border: '1px solid #ccc' }}
                  >
                    <option value="en">English (United States)</option>
                    <option value="es">Spanish (Español)</option>
                    <option value="fr">French (Français)</option>
                    <option value="de">German (Deutsch)</option>
                  </select>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
