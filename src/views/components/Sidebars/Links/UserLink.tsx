import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackRatingModal from '../../Modals/FeedbackRatingModal';

export const UserLinks = () => {
  const [open, setOpen] = useState(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  return (
    <div>
      <Link to="/dashboard">Tickets</Link>
      <Link to="/knowledge-base">Knowledge Base</Link>
      <a href="#" onClick={handleOpenModal}>Submit Feedback</a>
      <FeedbackRatingModal
        open={open}
        onClose={handleCloseModal}
        ticketId={""}
        onSubmit={() => {}}
      />
    </div>
  );
};