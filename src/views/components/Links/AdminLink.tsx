import React from 'react';
import { Link } from 'react-router-dom';


export const AdminLinks = () => {

  return (
    <div>
        <Link to="/Tickets">Tickets</Link>
        <Link to="/UserManagement">User Management</Link>
        <Link to="/knowdlege">Knowledge Base</Link>
        <Link to="/Analytics">Reporting & Analytics</Link>
        <Link to="/knowdlege Base">Customer Feedback</Link>
    </div>
  )
}