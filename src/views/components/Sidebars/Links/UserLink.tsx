import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackRatingModal from '../../Modals/FeedbackRatingModal';

export const UserLinks = () => {

  return (
    <div>
      <Link to="/dashboard">Tickets</Link>
      <Link to="/knowledge-base">Knowledge Base</Link>
      <Link to="/SubmitFeedback">Submit Feedback</Link>
    </div>
  );
};