import React from 'react';
import { Link } from 'react-router-dom';


export const UserLinks = () => {

    
  return (
    <div>
        <Link to="/dashboard">Tickets</Link>
        <Link to="/knowledge-base-user">Knowledge Base</Link>
         <Link to="/Feedback">Submit Feedback</Link>
    </div>
  )
}
