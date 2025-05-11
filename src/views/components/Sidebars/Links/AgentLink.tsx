import React from 'react';
import { Link } from 'react-router-dom';


export const AgentLinks = () => {

    
  return (
    <div>
        <Link to="/Tickets">Tickets</Link>
        <Link to="/Knowledge">Knowledge Base</Link>
         <Link to="/Customer Feedback">Submit Feedback</Link>
    </div>
  )
}
