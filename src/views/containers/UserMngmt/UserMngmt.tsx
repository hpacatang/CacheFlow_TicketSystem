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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then(res => res.json())
      .then(data => {
        // Map backend users to expected User interface
        const mappedUsers = data.map((u: any) => ({
          username: u.username ?? u.name ?? "",
          email: u.email ?? "",
          role: u.role ?? "",
          password: u.password ?? "",
          status: u.status ?? "Active"
        }));
        setUsers(mappedUsers);
      })
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: User, originalUsername: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.username === originalUsername ? updatedUser : u
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

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
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
              {paginatedUsers.map((u, i) => (
                <tr key={i}>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  <td>
                    <button
                      className="actions-btn"
                      style={{ marginRight: 8 }}
                      onClick={() => setEditUser(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="actions-btn"
                      style={{ marginRight: 8 }}
                      onClick={() => {
                        if (window.confirm("Delete this user?")) {
                          handleDeleteUser(u.username);
                        }
                      }}
                    >
                      Delete
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
            />
          )}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span style={{ alignSelf: 'center' }}>Page {currentPage} of {totalPages}</span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Password validation
const isValidPassword = (password: string) => {
  return (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

// Email validation
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !role) return;
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 12 characters, include an uppercase letter, a number, and a special character."
      );
      return;
    }
    setError('');
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
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={12}
            required
          />
          {error && <div style={{ color: 'red', fontSize: '0.95em' }}>{error}</div>}
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
  onUpdateUser: (user: User, originalUsername: string) => void;
}> = ({ user, onClose, onUpdateUser }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState(user.password);
  const [error, setError] = useState('');
  const originalUsername = user.username;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !role) return;
    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 12 characters, include an uppercase letter, a number, and a special character."
      );
      return;
    }
    setError('');
    onUpdateUser(
      {
        username,
        email,
        role,
        password,
        status: user.status
      },
      originalUsername
    );
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
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={12}
            required
          />
          {error && <div style={{ color: 'red', fontSize: '0.95em' }}>{error}</div>}
          <button className="modal-add-btn" type="submit">Update User</button>
        </form>
      </div>
    </div>
  );
};