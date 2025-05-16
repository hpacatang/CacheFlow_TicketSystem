import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './UserMngmt.css';
import { AdminSidebar } from '../../components/Sidebars/AdminSidebar';

interface User {
  username: string;
  email: string;
  role: string;
  password: string;
  status: string;
}

export const UserMngmt: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev =>
      prev.map(u =>
        u.username === updatedUser.username ? updatedUser : u
      )
    );
  };

  const handleDeleteUser = (username: string) => {
    setUsers(prev => prev.filter(u => u.username !== username));
    setEditUser(null);
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <div className="user-mngmt-container">
          <div className="user-mngmt-header">
            <h2>Users</h2>
            <button className="add-user-btn" onClick={() => setShowModal(true)}>
              Add User
            </button>
          </div>
          <div className="user-mngmt-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for user"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              className="manage-permissions-btn"
              onClick={() => navigate("/AccessControl")}
            >
              Manage Permissions
            </button>
          </div>
          <table className="user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={i}>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  <td>
                    <button
                      className="actions-btn"
                      onClick={() => setEditUser(u)}
                    >
                      ⋯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showModal && (
            <AddUserModal
              onClose={() => setShowModal(false)}
              onAddUser={(user) => {
                handleAddUser(user);
                setShowModal(false);
              }}
            />
          )}
          {editUser && (
            <EditUserModal
              user={editUser}
              onClose={() => setEditUser(null)}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Add User Modal
const AddUserModal: React.FC<{
  onClose: () => void;
  onAddUser: (user: User) => void;
}> = ({ onClose, onAddUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !role) return;
    onAddUser({
      username,
      email,
      role,
      password,
      status: "Active"
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>Add New User</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <label>User Name</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="User">User</option>
            <option value="Agent">Agent</option>
            <option value="Admin">Admin</option>
          </select>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="modal-add-btn" type="submit">Add User</button>
        </form>
      </div>
    </div>
  );
};

// Edit User Modal
const EditUserModal: React.FC<{
  user: User;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (username: string) => void;
}> = ({ user, onClose, onUpdateUser, onDeleteUser }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState(user.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !role) return;
    onUpdateUser({
      username,
      email,
      role,
      password,
      status: user.status
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit User</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <label>User Name</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="User">User</option>
            <option value="Agent">Agent</option>
            <option value="Admin">Admin</option>
          </select>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="modal-add-btn" type="submit">Update User</button>
        </form>
        <button
          className="modal-delete-btn"
          style={{
            color: "red",
            background: "none",
            border: "none",
            fontSize: "1.6rem",
            position: "absolute",
            right: 24,
            bottom: 24,
            cursor: "pointer"
          }}
          onClick={() => {
            if (window.confirm("Delete this user?")) {
              onDeleteUser(user.username);
            }
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};