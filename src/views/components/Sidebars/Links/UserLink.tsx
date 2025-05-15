import React from 'react';
import { Link } from 'react-router-dom';


export const UserLinks = () => {

    
  return (
    <div>
        <Link to="/Tickets">Tickets</Link>
        <Link to="/Knowledge">Knowledge Base</Link>
         <Link to="/Feedback">Submit Feedback</Link>
    </div>
  )
}
