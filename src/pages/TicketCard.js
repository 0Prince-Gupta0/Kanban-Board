import React from 'react';
import './TicketCard.css';

import high from "../icons_FEtask/High.svg";
import low from "../icons_FEtask/Low.svg";
import medium from "../icons_FEtask/Medium.svg";
import no from "../icons_FEtask/No-priority.svg";
import urgent from "../icons_FEtask/urgent.svg";

const TicketCard = ({ ticket, user }) => {
  return (
    <div className={`kanban-card priority-${ticket.priority}`}>
      <div className="card-header">
        <div className="card-title">
          <h2>{ticket.id}</h2>
          <div className="user-avatar">
            {user && user.charAt(0)}
          </div>
        </div>
        <h3>{ticket.title}</h3>
      </div>
      <p>{ticket.description}</p>
      <div className="card-footer">
      {ticket.priority === 0 ? (
                      <img src={no} alt="IMG" />
                    ) : null}
                    {ticket.priority === 1? (
                      <img src={low} alt="IMG" />
                    ) : null}
                    {ticket.priority === 2 ? (
                      <img src={medium} alt="IMG" />
                    ) : null}
                    {ticket.priority=== 3 ? (
                      <img src={high} alt="IMG" />
                    ) : null}
                    {ticket.priority === 4 ? (
                      <img src={urgent} alt="IMG" />
                    ) : null}
        <span className="feature-request-label">Feature Request</span>
      </div>
    </div>
  );
};

export default TicketCard;
