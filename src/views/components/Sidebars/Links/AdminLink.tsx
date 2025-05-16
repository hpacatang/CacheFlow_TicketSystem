import React from 'react';
import { Link } from 'react-router-dom';


export const AdminLinks = () => {

  return (
    <div>
        <Link to="/dashboard">Tickets</Link>
        <Link to="/UserManagement">User Management</Link>
        <Link to="/knowledge-base">Knowledge Base</Link>
        <Link to="/analytics">Reporting & Analytics</Link>
        <Link to="/CustomerFeedback">Customer Feedback</Link>
    </div>
  )
}
