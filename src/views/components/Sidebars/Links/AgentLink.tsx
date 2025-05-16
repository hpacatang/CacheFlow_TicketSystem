import React from 'react';
import { Link } from 'react-router-dom';


export const AgentLinks = () => {

    
  return (
    <div>
        <Link to="/dashboard">Tickets</Link>
        <Link to="/knowledge-base">Knowledge Base</Link>
         <Link to="/CustomerFeedback">Submit Feedback</Link>
    </div>
  )
}
