import React, { useEffect, useState } from "react";
import "./KanbanBoard.css";
import display from "../icons_FEtask/Display.svg";
import down from "../icons_FEtask/down.svg";
import add from "../icons_FEtask/add.svg";
import Backlog from "../icons_FEtask/Backlog.svg";
import cancelled from "../icons_FEtask/Cancelled.svg";
import done from "../icons_FEtask/Done.svg";
import todo from "../icons_FEtask/To-do.svg";
import inProgress from "../icons_FEtask/in-progress.svg";
import Dot from "../icons_FEtask/three.svg";

import high from "../icons_FEtask/High.svg";
import low from "../icons_FEtask/Low.svg";
import medium from "../icons_FEtask/Medium.svg";
import no from "../icons_FEtask/No-priority.svg";
import urgent from "../icons_FEtask/urgent.svg";
import TicketCard from "./TicketCard";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState({});
  const [grouping, setGrouping] = useState("Status");
  const [sorting, setSorting] = useState("Priority");
  const [showDisplayMenu, setShowDisplayMenu] = useState(false);

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data["tickets"]);
        const userMap = {};
        data["users"].forEach((user) => {
          userMap[user.id] = user.name;
        });
        setUsers(userMap);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const normalizeStatus = (status) => {
    if (!status) return "Unassigned";
    return status
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      let groupKey;
      if (key === "status") {
        const normalizedStatus = normalizeStatus(currentValue[key]);
        switch (normalizedStatus) {
          case "Backlog":
            groupKey = "Backlog";
            break;
          case "Todo":
            groupKey = "To Do";
            break;
          case "In Progress":
            groupKey = "In Progress";
            break;
          case "Done":
            groupKey = "Done";
            break;
          case "Cancelled":
            groupKey = "Cancelled";
            break;
          default:
            groupKey = "Unassigned";
            break;
        }
      } else if (key === "userId") {
        groupKey = users[currentValue[key]] || "Unassigned";
      } else {
        groupKey =
          currentValue[key] !== undefined && currentValue[key] !== null
            ? currentValue[key]
            : "Unassigned";
      }

      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentValue);
      return result;
    }, {});
  };

  const groupTickets = () => {
    switch (grouping) {
      case "Status":
        return groupBy(tickets, "status");
      case "User":
        return groupBy(tickets, "userId");
      case "Priority":
        return groupBy(tickets, "priority");
      default:
        return {};
    }
  };

  const sortTickets = (tickets) => {
    return tickets.sort((a, b) => {
      if (sorting === "Priority") return b.priority - a.priority;
      else if (sorting === "Title") return a.title.localeCompare(b.title);
      return 0;
    });
  };

  const m={
    '4': "Urgent",

'3' : "High",

'2' : "Medium",

'1' : "Low",
'0' :"No priority"
  }

  const groupedTickets = groupTickets();

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div className="display-dropdown">
          <button
            onClick={() => setShowDisplayMenu(!showDisplayMenu)}
            className="display-button"
          >
            <div className="display-div">
              <img src={display} alt="IMG"></img>
              <span>Display</span>
              <img src={down} alt="IMG"></img>
            </div>
          </button>
          {showDisplayMenu && (
            <div className="display-menu">
              <div>
                <label>Grouping</label>
                <select
                  value={grouping}
                  onChange={(e) => setGrouping(e.target.value)}
                >
                  <option value="Status">Status</option>
                  <option value="User">User</option>
                  <option value="Priority">Priority</option>
                </select>
              </div>
              <div>
                <label>Ordering</label>
                <select
                  value={sorting}
                  onChange={(e) => setSorting(e.target.value)}
                >
                  <option value="Priority">Priority</option>
                  <option value="Title">Title</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="kanban-board">
        {grouping === "Status"
          ? ["Backlog", "To Do", "In Progress", "Done", "Cancelled"].map(
              (status) => (
                <div key={status} className="kanban-column">
                  <div className="kanban-column-div">
                    {status === "Backlog" ? (
                      <img src={Backlog} alt="IMG" />
                    ) : null}
                    {status === "To Do" ? <img src={todo} alt="IMG" /> : null}
                    {status === "In Progress" ? (
                      <img src={inProgress} alt="IMG" />
                    ) : null}
                    {status === "Done" ? <img src={done} alt="IMG" /> : null}
                    {status === "Cancelled" ? (
                      <img src={cancelled} alt="IMG" />
                    ) : null}
                    <h2>{status+" "}{groupedTickets[status] ? groupedTickets[status].length:0}</h2>
                    <img src={add} alt="img"></img>
                    <img src={Dot} alt="img"></img>
                  </div>

                  {groupedTickets[status] &&
                    sortTickets(groupedTickets[status]).map((ticket) => (
                        <TicketCard ticket={ticket} user={users[ticket.userId]}></TicketCard>
                    ))}
                </div>
              )
            )
          :grouping === "User" ?Object.keys(groupedTickets).map((groupKey) => (
              <div key={groupKey} className="kanban-column">
                <div className="kanban-column-div">
                <div className="user-avatar">
                        {groupKey.charAt(0)}
                </div>
                <h2>{groupKey+" "}{groupedTickets[groupKey]?groupedTickets[groupKey].length:0}</h2>
                <img src={add} alt="img"></img>
                <img src={Dot} alt="img"></img>
                </div>
                {sortTickets(groupedTickets[groupKey]).map((ticket) => (
                  <TicketCard ticket={ticket} user={users[ticket.userId]}></TicketCard>
                ))}
              </div>
            )) : Object.keys(groupedTickets).map((groupKey) => (
                <div key={groupKey} className="kanban-column">
                  <div className="kanban-column-div">
                  {groupKey === '0' ? (
                      <img src={no} alt="IMG" />
                    ) : null}
                    {groupKey === "1" ? (
                      <img src={low} alt="IMG" />
                    ) : null}
                    {groupKey === '2' ? (
                      <img src={medium} alt="IMG" />
                    ) : null}
                    {groupKey === '3' ? (
                      <img src={high} alt="IMG" />
                    ) : null}
                    {groupKey === '4' ? (
                      <img src={urgent} alt="IMG" />
                    ) : null}
                  <h2>{m[groupKey]+" "}{groupedTickets[groupKey]?groupedTickets[groupKey].length:0}</h2>
                  <img src={add} alt="img"></img>
                  <img src={Dot} alt="img"></img>
                  </div>
                  {sortTickets(groupedTickets[groupKey]).map((ticket) => (
                    <TicketCard ticket={ticket} user={users[ticket.userId]}></TicketCard>
                  ))}
                </div>))}
      </div>
    </div>
  );
};

export default KanbanBoard;
